// tasks/review-issue.js — Review issues and close resolved ones
//
// Checks open issues against the current codebase to determine
// if they have been resolved, and closes them if so.

import * as core from '@actions/core';
import { CopilotClient } from '@github/copilot-sdk';
import { readFileSync, readdirSync, existsSync } from 'fs';

/**
 * Review open issues and close those that have been resolved.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function reviewIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, model } = context;

  // If a specific issue is provided, review just that one
  // Otherwise, review the oldest open automated issue
  let targetIssueNumber = issueNumber;

  if (!targetIssueNumber) {
    const { data: openIssues } = await octokit.rest.issues.listForRepo({
      ...repo,
      state: 'open',
      labels: 'automated',
      per_page: 1,
      sort: 'created',
      direction: 'asc',
    });

    if (openIssues.length === 0) {
      return { outcome: 'nop', details: 'No open automated issues to review' };
    }
    targetIssueNumber = openIssues[0].number;
  }

  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(targetIssueNumber),
  });

  if (issue.state === 'closed') {
    return { outcome: 'nop', details: `Issue #${targetIssueNumber} is already closed` };
  }

  // Read current source files to check if the issue is resolved
  const sourcePath = config.paths.targetSourcePath?.path || 'src/';
  let sourceFiles = [];
  if (existsSync(sourcePath)) {
    sourceFiles = readdirSync(sourcePath, { recursive: true })
      .filter(f => f.endsWith('.js') || f.endsWith('.ts'))
      .slice(0, 10)
      .map(f => {
        try { return { name: f, content: readFileSync(`${sourcePath}${f}`, 'utf8').substring(0, 2000) }; }
        catch { return { name: f, content: '' }; }
      });
  }

  // Read test files
  const testsPath = config.paths.targetTestsPath?.path || 'tests/';
  let testFiles = [];
  if (existsSync(testsPath)) {
    testFiles = readdirSync(testsPath, { recursive: true })
      .filter(f => f.endsWith('.test.js') || f.endsWith('.test.ts'))
      .slice(0, 10)
      .map(f => {
        try { return { name: f, content: readFileSync(`${testsPath}${f}`, 'utf8').substring(0, 2000) }; }
        catch { return { name: f, content: '' }; }
      });
  }

  const agentInstructions = instructions || 'Review whether this issue has been resolved by the current codebase.';

  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    `## Issue #${targetIssueNumber}: ${issue.title}`,
    issue.body || '(no description)',
    '',
    `## Current Source (${sourceFiles.length} files)`,
    ...sourceFiles.map(f => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    '',
    `## Current Tests (${testFiles.length} files)`,
    ...testFiles.map(f => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    '',
    '## Your Task',
    'Determine if this issue has been resolved by the current code.',
    'Respond with exactly one of:',
    '- "RESOLVED: <reason>" if the issue is satisfied by the current code',
    '- "OPEN: <reason>" if the issue is not yet resolved',
  ].join('\n');

  const client = new CopilotClient({ githubToken: process.env.GITHUB_TOKEN });
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: { content: 'You are a code reviewer determining if GitHub issues have been resolved.' },
    });

    const response = await session.sendAndWait({ prompt });
    tokensUsed = response?.data?.usage?.totalTokens || 0;
    const verdict = response?.data?.content || '';

    if (verdict.toUpperCase().startsWith('RESOLVED')) {
      // Close the issue with a contextual comment
      await octokit.rest.issues.createComment({
        ...repo,
        issue_number: Number(targetIssueNumber),
        body: [
          '**Automated Review Result:** This issue has been resolved by the current codebase.',
          '',
          `**Task:** review-issue`,
          `**Model:** ${model}`,
          `**Source files reviewed:** ${sourceFiles.length}`,
          `**Test files reviewed:** ${testFiles.length}`,
          '',
          verdict,
        ].join('\n'),
      });
      await octokit.rest.issues.update({
        ...repo,
        issue_number: Number(targetIssueNumber),
        state: 'closed',
      });
      core.info(`Issue #${targetIssueNumber} closed as resolved`);

      return {
        outcome: 'issue-closed',
        tokensUsed,
        model,
        details: `Closed issue #${targetIssueNumber}: ${verdict.substring(0, 200)}`,
      };
    }

    core.info(`Issue #${targetIssueNumber} still open: ${verdict.substring(0, 100)}`);
    return {
      outcome: 'issue-still-open',
      tokensUsed,
      model,
      details: `Issue #${targetIssueNumber} remains open: ${verdict.substring(0, 200)}`,
    };
  } finally {
    await client.stop();
  }
}
