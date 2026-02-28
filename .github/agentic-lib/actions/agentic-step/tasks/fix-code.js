// tasks/fix-code.js — Fix failing tests on a PR
//
// Given a PR number with failing tests, analyzes the test output,
// generates fixes using the Copilot SDK, and pushes a commit.

import * as core from '@actions/core';
import { CopilotClient } from '@github/copilot-sdk';
import { readFileSync } from 'fs';

/**
 * Fix failing code on a pull request.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function fixCode(context) {
  const { octokit, repo, config, prNumber, instructions, writablePaths, testCommand, model } = context;

  if (!prNumber) {
    throw new Error('fix-code task requires pr-number input');
  }

  // Fetch the PR
  const { data: pr } = await octokit.rest.pulls.get({
    ...repo,
    pull_number: Number(prNumber),
  });

  // Fetch recent check runs for this PR
  const { data: checkRuns } = await octokit.rest.checks.listForRef({
    ...repo,
    ref: pr.head.sha,
    per_page: 10,
  });

  const failedChecks = checkRuns.check_runs.filter(cr => cr.conclusion === 'failure');
  const failureDetails = failedChecks.map(cr => `**${cr.name}:** ${cr.output?.summary || 'Failed'}`).join('\n');

  if (failedChecks.length === 0) {
    core.info(`PR #${prNumber} has no failing checks. Returning nop.`);
    return { outcome: 'nop', details: 'No failing checks found' };
  }

  // Read instructions
  const agentInstructions = instructions || 'Fix the failing tests by modifying the source code.';

  // Separate writable and read-only paths
  const readOnlyPaths = config.readOnlyPaths || [];

  // Build the prompt
  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    `## Pull Request #${prNumber}: ${pr.title}`,
    '',
    pr.body || '(no description)',
    '',
    '## Failing Checks',
    failureDetails,
    '',
    '## File Paths',
    '### Writable (you may modify these)',
    writablePaths.length > 0 ? writablePaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '### Read-Only (for context only, do NOT modify)',
    readOnlyPaths.length > 0 ? readOnlyPaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '## Constraints',
    `- Run \`${testCommand}\` to validate your fixes`,
    '- Make minimal changes to fix the failing tests',
  ].join('\n');

  // Create Copilot SDK session
  const client = new CopilotClient();
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: `You are an autonomous coding agent fixing failing tests on PR #${prNumber}. Make minimal, targeted changes to fix the test failures.`,
      workingDirectory: process.cwd(),
    });

    const response = await session.sendAndWait({ prompt });

    tokensUsed = response?.data?.usage?.totalTokens || 0;
    const resultContent = response?.data?.content || '';

    core.info(`Copilot SDK fix response received (${tokensUsed} tokens)`);

    return {
      outcome: 'fix-applied',
      tokensUsed,
      model,
      details: `Applied fix for ${failedChecks.length} failing check(s) on PR #${prNumber}`,
    };
  } finally {
    await client.stop();
  }
}
