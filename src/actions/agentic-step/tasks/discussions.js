// tasks/discussions.js — GitHub Discussions bot
//
// Responds to GitHub Discussions, creates features, seeds repositories,
// and provides status updates. Uses the Copilot SDK for natural conversation.

import * as core from '@actions/core';
import { CopilotClient, approveAll } from '@github/copilot-sdk';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { createAgentTools } from '../tools.js';

/**
 * Respond to a GitHub Discussion using the Copilot SDK.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, action, tokensUsed, model
 */
export async function discussions(context) {
  const { octokit, repo, config, instructions, model, discussionUrl } = context;

  if (!discussionUrl) {
    throw new Error('discussions task requires discussion-url input');
  }

  // Parse discussion URL to extract owner, repo, and discussion number
  // Format: https://github.com/{owner}/{repo}/discussions/{number}
  const urlMatch = discussionUrl.match(/github\.com\/([^/]+)\/([^/]+)\/discussions\/(\d+)/);
  let discussionTitle = '';
  let discussionBody = '';
  let discussionComments = [];

  if (urlMatch) {
    const [, urlOwner, urlRepo, discussionNumber] = urlMatch;
    try {
      const query = `query {
        repository(owner: "${urlOwner}", name: "${urlRepo}") {
          discussion(number: ${discussionNumber}) {
            title
            body
            comments(last: 10) {
              nodes {
                body
                author { login }
                createdAt
              }
            }
          }
        }
      }`;
      const result = await octokit.graphql(query);
      const discussion = result.repository.discussion;
      discussionTitle = discussion.title || '';
      discussionBody = discussion.body || '';
      discussionComments = discussion.comments.nodes || [];
      core.info(`Fetched discussion #${discussionNumber}: "${discussionTitle}" (${discussionComments.length} comments)`);
    } catch (err) {
      core.warning(`Failed to fetch discussion content via GraphQL: ${err.message}. Falling back to URL-only.`);
    }
  } else {
    core.warning(`Could not parse discussion URL: ${discussionUrl}`);
  }

  // Read mission for context
  const missionPath = config.paths.missionFilepath?.path || 'MISSION.md';
  let mission = '';
  try { mission = readFileSync(missionPath, 'utf8'); } catch { /* optional */ }

  // Read contributing guidelines
  let contributing = '';
  try { contributing = readFileSync(config.paths.contributingFilepath?.path || 'CONTRIBUTING.md', 'utf8'); } catch { /* optional */ }

  // Read features
  const featuresPath = config.paths.featuresPath?.path || 'features/';
  let features = [];
  if (existsSync(featuresPath)) {
    features = readdirSync(featuresPath)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''));
  }

  // Read activity log (last 20 lines)
  const intentionPath = config.intentionBot?.intentionFilepath || 'intentïon.md';
  let recentActivity = '';
  try {
    const log = readFileSync(intentionPath, 'utf8');
    recentActivity = log.split('\n').slice(-20).join('\n');
  } catch { /* optional */ }

  const agentInstructions = instructions || 'Respond to the GitHub Discussion as the repository bot.';

  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    '## Discussion',
    `URL: ${discussionUrl}`,
    discussionTitle ? `### ${discussionTitle}` : '',
    discussionBody || '(no body)',
    discussionComments.length > 0 ? `### Comments (${discussionComments.length})` : '',
    ...discussionComments.map(c => `**${c.author?.login || 'unknown'}** (${c.createdAt}):\n${c.body}`),
    '',
    '## Context',
    `### Mission\n${mission}`,
    contributing ? `### Contributing\n${contributing.substring(0, 1000)}` : '',
    `### Current Features\n${features.join(', ') || 'none'}`,
    recentActivity ? `### Recent Activity\n${recentActivity}` : '',
    '',
    '## Available Actions',
    'Respond with one of these action tags in your response:',
    '- `[ACTION:seed-repository]` — Reset the sandbox to initial state',
    '- `[ACTION:create-feature] <name>` — Create a new feature',
    '- `[ACTION:update-feature] <name>` — Update an existing feature',
    '- `[ACTION:delete-feature] <name>` — Delete a feature that is no longer needed',
    '- `[ACTION:create-issue] <title>` — Create a new issue',
    '- `[ACTION:nop]` — No action needed, just respond conversationally',
    '- `[ACTION:mission-complete]` — Declare the current mission complete',
    '- `[ACTION:stop]` — Halt automation',
    '',
    'Include exactly one action tag. The rest of your response is the discussion reply.',
    '',
    '## Mission Protection',
    'If the user requests something that contradicts or would undermine the mission,',
    'you MUST push back. Explain why the request conflicts with the mission and suggest',
    'an alternative that aligns with it. Use `[ACTION:nop]` in this case.',
    'The mission is the non-negotiable foundation of this repository.',
  ].join('\n');

  const client = new CopilotClient({ githubToken: process.env.GITHUB_TOKEN });
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: { content: 'You are a repository bot that responds to GitHub Discussions. You are self-aware — you refer to yourself as the repository. Be helpful, adaptive, and proactive about suggesting features. You can update and delete features proactively when they are outdated or completed. You MUST protect the mission: if a user requests something that contradicts the mission, push back politely and suggest an aligned alternative.' },
      tools: createAgentTools([]),
      onPermissionRequest: approveAll,
      workingDirectory: process.cwd(),
    });

    const response = await session.sendAndWait({ prompt });
    tokensUsed = response?.data?.usage?.totalTokens || 0;
    const content = response?.data?.content || '';

    // Parse action from response
    const actionMatch = content.match(/\[ACTION:(\S+?)\](.*)?/);
    const action = actionMatch ? actionMatch[1] : 'nop';
    const actionArg = actionMatch && actionMatch[2] ? actionMatch[2].trim() : '';

    // Strip action tag from reply
    const replyBody = content.replace(/\[ACTION:\S+?\].*/, '').trim();

    core.info(`Discussion bot action: ${action}, arg: ${actionArg}`);

    return {
      outcome: `discussion-${action}`,
      tokensUsed,
      model,
      details: `Action: ${action}${actionArg ? ` (${actionArg})` : ''}\nReply: ${replyBody.substring(0, 200)}`,
      action,
      actionArg,
      replyBody,
    };
  } finally {
    await client.stop();
  }
}
