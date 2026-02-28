// tasks/enhance-issue.js — Add testable acceptance criteria to issues
//
// Takes an issue and enhances it with clear, testable acceptance criteria
// so that the resolve-issue task can implement it effectively.

import * as core from '@actions/core';
import { CopilotClient } from '@github/copilot-sdk';
import { isIssueResolved } from '../safety.js';
import { readFileSync, existsSync } from 'fs';

/**
 * Enhance a GitHub issue with testable acceptance criteria.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function enhanceIssue(context) {
  const { octokit, repo, config, issueNumber, instructions, model } = context;

  if (!issueNumber) {
    throw new Error('enhance-issue task requires issue-number input');
  }

  // Check if already resolved
  if (await isIssueResolved(octokit, repo, issueNumber)) {
    return { outcome: 'nop', details: 'Issue already resolved' };
  }

  // Fetch the issue
  const { data: issue } = await octokit.rest.issues.get({
    ...repo,
    issue_number: Number(issueNumber),
  });

  // Check if issue already has the 'ready' label (already enhanced)
  if (issue.labels.some(l => l.name === 'ready')) {
    return { outcome: 'nop', details: 'Issue already has ready label' };
  }

  // Read contributing guidelines for context
  let contributing = '';
  try { contributing = readFileSync(config.paths.contributingFilepath?.path || 'CONTRIBUTING.md', 'utf8'); } catch { /* optional */ }

  // Read features for context
  const featuresPath = config.paths.featuresPath?.path || 'features/';
  let features = [];
  if (existsSync(featuresPath)) {
    const { readdirSync } = await import('fs');
    features = readdirSync(featuresPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        try { return readFileSync(`${featuresPath}${f}`, 'utf8').substring(0, 500); }
        catch { return ''; }
      });
  }

  const agentInstructions = instructions || 'Enhance this issue with clear, testable acceptance criteria.';

  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    `## Issue #${issueNumber}: ${issue.title}`,
    issue.body || '(no description)',
    '',
    contributing ? `## Contributing Guidelines\n${contributing.substring(0, 1000)}` : '',
    features.length > 0 ? `## Related Features\n${features.join('\n---\n')}` : '',
    '',
    '## Your Task',
    'Write an enhanced version of this issue body that includes:',
    '1. Clear problem statement or feature description',
    '2. Testable acceptance criteria (Given/When/Then or checkbox format)',
    '3. Implementation hints if applicable',
    '',
    'Output ONLY the new issue body text, no markdown code fences.',
  ].join('\n');

  const client = new CopilotClient();
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: 'You are a requirements analyst. Enhance GitHub issues with clear, testable acceptance criteria.',
    });

    const response = await session.sendAndWait({ prompt });
    tokensUsed = response?.data?.usage?.totalTokens || 0;
    const enhancedBody = response?.data?.content || '';

    if (enhancedBody.trim()) {
      // Update the issue body
      await octokit.rest.issues.update({
        ...repo,
        issue_number: Number(issueNumber),
        body: enhancedBody.trim(),
      });

      // Add 'ready' label
      await octokit.rest.issues.addLabels({
        ...repo,
        issue_number: Number(issueNumber),
        labels: ['ready'],
      });

      // Add contextual comment explaining what was done
      await octokit.rest.issues.createComment({
        ...repo,
        issue_number: Number(issueNumber),
        body: [
          '**Automated Enhancement:** This issue has been enhanced with testable acceptance criteria.',
          '',
          `**Task:** enhance-issue`,
          `**Model:** ${model}`,
          `**Features referenced:** ${features.length}`,
          '',
          'The issue body has been updated. The `ready` label has been added to indicate it is ready for implementation.',
        ].join('\n'),
      });

      core.info(`Issue #${issueNumber} enhanced and labeled 'ready'`);
    }

    return {
      outcome: 'issue-enhanced',
      tokensUsed,
      model,
      details: `Enhanced issue #${issueNumber} with acceptance criteria`,
    };
  } finally {
    await client.stop();
  }
}
