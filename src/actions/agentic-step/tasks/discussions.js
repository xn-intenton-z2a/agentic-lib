// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
// tasks/discussions.js — GitHub Discussions bot
//
// Responds to GitHub Discussions, creates features, seeds repositories,
// and provides status updates. Uses the Copilot SDK for natural conversation.

import * as core from "@actions/core";
import { existsSync } from "fs";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../copilot.js";

const BOT_LOGINS = ["github-actions[bot]", "github-actions"];

/**
 * Respond to a GitHub Discussion using the Copilot SDK.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, action, tokensUsed, model
 */
export async function discussions(context) {
  const { octokit, config, instructions, model, discussionUrl } = context;

  if (!discussionUrl) {
    throw new Error("discussions task requires discussion-url input");
  }

  // Parse discussion URL and fetch content via GraphQL
  const urlMatch = discussionUrl.match(/github\.com\/([^/]+)\/([^/]+)\/discussions\/(\d+)/);
  let discussionTitle = "";
  let discussionBody = "";
  let discussionComments = [];
  let discussionNodeId = "";

  if (urlMatch) {
    const [, urlOwner, urlRepo, discussionNumber] = urlMatch;
    try {
      const query = `query {
        repository(owner: "${urlOwner}", name: "${urlRepo}") {
          discussion(number: ${discussionNumber}) {
            id
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
      discussionNodeId = discussion.id || "";
      discussionTitle = discussion.title || "";
      discussionBody = discussion.body || "";
      discussionComments = discussion.comments.nodes || [];
      core.info(
        `Fetched discussion #${discussionNumber}: "${discussionTitle}" (${discussionComments.length} comments)`,
      );
    } catch (err) {
      core.warning(`Failed to fetch discussion content via GraphQL: ${err.message}. Falling back to URL-only.`);
    }
  } else {
    core.warning(`Could not parse discussion URL: ${discussionUrl}`);
  }

  // Separate human comments from bot's own replies
  const humanComments = discussionComments.filter(
    (c) => !BOT_LOGINS.includes(c.author?.login),
  );
  const botReplies = discussionComments.filter(
    (c) => BOT_LOGINS.includes(c.author?.login),
  );
  const latestHumanComment = humanComments.length > 0 ? humanComments[humanComments.length - 1] : null;
  const lastBotReply = botReplies.length > 0 ? botReplies[botReplies.length - 1] : null;

  const mission = readOptionalFile(config.paths.mission.path);
  const contributing = readOptionalFile(config.paths.contributing.path, 1000);

  const featuresPath = config.paths.features.path;
  let featureNames = [];
  if (existsSync(featuresPath)) {
    featureNames = scanDirectory(featuresPath, ".md").map((f) => f.name.replace(".md", ""));
  }

  const intentionPath = config.intentionBot.intentionFilepath;
  const recentActivity = readOptionalFile(intentionPath).split("\n").slice(-20).join("\n");

  const agentInstructions = instructions || "Respond to the GitHub Discussion as the repository bot.";

  // Build thread-aware prompt
  const promptParts = [
    "## Instructions",
    agentInstructions,
    "",
    "## Discussion Thread",
    `URL: ${discussionUrl}`,
    discussionTitle ? `### ${discussionTitle}` : "",
    discussionBody || "(no body)",
  ];

  // Show conversation history (human comments only, with timestamps)
  if (humanComments.length > 0) {
    promptParts.push("", "### Conversation History");
    for (const c of humanComments) {
      const isLatest = c === latestHumanComment;
      const prefix = isLatest ? ">>> **[LATEST — RESPOND TO THIS]** " : "";
      promptParts.push(`${prefix}**${c.author?.login || "unknown"}** (${c.createdAt}):\n${c.body}`);
    }
  }

  // Show the bot's last reply so it knows what it already said
  if (lastBotReply) {
    promptParts.push(
      "",
      "### Your Last Reply (DO NOT REPEAT THIS)",
      lastBotReply.body.substring(0, 500),
    );
  }

  // Context section
  promptParts.push(
    "",
    "## Repository Context",
    `### Mission\n${mission}`,
    contributing ? `### Contributing\n${contributing}` : "",
    `### Current Features\n${featureNames.join(", ") || "none"}`,
    recentActivity ? `### Recent Activity\n${recentActivity}` : "",
  );

  // Actions — concise, not a wall of text
  promptParts.push(
    "",
    "## Actions",
    "Include exactly one action tag in your response. Only mention actions to the user when relevant.",
    "`[ACTION:request-supervisor] <free text>` — Ask the supervisor to evaluate and act on a user request",
    "`[ACTION:create-feature] <name>` — Create a new feature",
    "`[ACTION:update-feature] <name>` — Update an existing feature",
    "`[ACTION:delete-feature] <name>` — Delete a feature",
    "`[ACTION:create-issue] <title>` — Create a new issue",
    "`[ACTION:seed-repository]` — Reset to initial state",
    "`[ACTION:nop]` — No action needed, just respond conversationally",
    "`[ACTION:mission-complete]` — Declare mission complete",
    "`[ACTION:stop]` — Halt automation",
  );

  const prompt = promptParts.filter(Boolean).join("\n");

  const { content, tokensUsed } = await runCopilotTask({
    model,
    systemMessage:
      "You are this repository. Respond in first person. Be concise and engaging — never repeat what you said in your last reply. Adapt to the user's language level. Encourage experimentation and suggest interesting projects. When a user requests an action, pass it to the supervisor via [ACTION:request-supervisor]. Protect the mission: push back on requests that contradict it.",
    prompt,
    writablePaths: [],
  });

  // Parse action from response
  const actionMatch = content.match(/\[ACTION:(\S+?)\](.+)?/);
  const action = actionMatch ? actionMatch[1] : "nop";
  const actionArg = actionMatch && actionMatch[2] ? actionMatch[2].trim() : "";
  const replyBody = content.replace(/\[ACTION:\S+?\].+/, "").trim();

  core.info(`Discussion bot action: ${action}, arg: ${actionArg}`);

  // Post reply comment back to the Discussion
  if (discussionNodeId && replyBody) {
    try {
      const mutation = `mutation($discussionId: ID!, $body: String!) {
        addDiscussionComment(input: { discussionId: $discussionId, body: $body }) {
          comment { url }
        }
      }`;
      const { addDiscussionComment } = await octokit.graphql(mutation, {
        discussionId: discussionNodeId,
        body: replyBody,
      });
      core.info(`Posted reply to discussion: ${addDiscussionComment.comment.url}`);
    } catch (err) {
      core.warning(`Failed to post discussion reply: ${err.message}`);
    }
  } else if (!discussionNodeId) {
    core.warning("Cannot post reply: discussion node ID not available");
  } else if (!replyBody) {
    core.warning("Cannot post reply: no reply content generated");
  }

  const argSuffix = actionArg ? ` (${actionArg})` : "";
  return {
    outcome: `discussion-${action}`,
    tokensUsed,
    model,
    details: `Action: ${action}${argSuffix}\nReply: ${replyBody.substring(0, 200)}`,
    action,
    actionArg,
    replyBody,
  };
}
