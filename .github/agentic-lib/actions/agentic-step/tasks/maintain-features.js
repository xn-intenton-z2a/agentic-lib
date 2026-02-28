// tasks/maintain-features.js — Feature lifecycle management
//
// Reviews existing features, creates new ones from mission/library analysis,
// prunes completed/irrelevant features, and ensures quality.

import * as core from '@actions/core';
import { CopilotClient } from '@github/copilot-sdk';
import { readFileSync, readdirSync, existsSync } from 'fs';

/**
 * Maintain the feature set — create, update, or prune feature files.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainFeatures(context) {
  const { config, instructions, writablePaths, model, octokit, repo } = context;

  // Read mission
  const missionPath = config.paths.missionFilepath?.path || 'MISSION.md';
  let mission = '';
  try { mission = readFileSync(missionPath, 'utf8'); } catch { /* optional */ }

  // Read existing features
  const featuresPath = config.paths.featuresPath?.path || 'features/';
  const featureLimit = config.paths.featuresPath?.limit || 4;
  let features = [];
  if (existsSync(featuresPath)) {
    features = readdirSync(featuresPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        try { return { name: f, content: readFileSync(`${featuresPath}${f}`, 'utf8') }; }
        catch { return { name: f, content: '' }; }
      });
  }

  // Read library docs for context
  const libraryPath = config.paths.libraryDocumentsPath?.path || 'library/';
  let libraryDocs = [];
  if (existsSync(libraryPath)) {
    libraryDocs = readdirSync(libraryPath)
      .filter(f => f.endsWith('.md'))
      .slice(0, 10)
      .map(f => {
        try { return { name: f, content: readFileSync(`${libraryPath}${f}`, 'utf8').substring(0, 1000) }; }
        catch { return { name: f, content: '' }; }
      });
  }

  // Fetch closed issues (recently completed features)
  const { data: closedIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: 'closed',
    per_page: 20,
    sort: 'updated',
    direction: 'desc',
  });

  const agentInstructions = instructions || 'Maintain the feature set by creating, updating, or pruning features.';

  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    '## Mission',
    mission,
    '',
    `## Current Features (${features.length}/${featureLimit} max)`,
    ...features.map(f => `### ${f.name}\n${f.content}`),
    '',
    libraryDocs.length > 0 ? `## Library Documents (${libraryDocs.length})` : '',
    ...libraryDocs.map(d => `### ${d.name}\n${d.content}`),
    '',
    `## Recently Closed Issues (${closedIssues.length})`,
    ...closedIssues.slice(0, 10).map(i => `- #${i.number}: ${i.title}`),
    '',
    '## Your Task',
    `1. Review each existing feature — if it is already implemented or irrelevant, delete it.`,
    `2. If there are fewer than ${featureLimit} features, create new features aligned with the mission.`,
    '3. Ensure each feature has clear, testable acceptance criteria.',
    '',
    '## File Paths',
    '### Writable (you may modify these)',
    writablePaths.length > 0 ? writablePaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '### Read-Only (for context only, do NOT modify)',
    (config.readOnlyPaths || []).length > 0 ? config.readOnlyPaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '## Constraints',
    `- Maximum ${featureLimit} feature files`,
    '- Feature files must be markdown with a descriptive filename (e.g. HTTP_SERVER.md)',
  ].join('\n');

  const client = new CopilotClient();
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: 'You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission.',
      workingDirectory: process.cwd(),
    });

    const response = await session.sendAndWait({ prompt });
    tokensUsed = response?.data?.usage?.totalTokens || 0;

    return {
      outcome: 'features-maintained',
      tokensUsed,
      model,
      details: `Maintained features (${features.length} existing, limit ${featureLimit})`,
    };
  } finally {
    await client.stop();
  }
}
