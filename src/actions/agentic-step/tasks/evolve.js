// tasks/evolve.js — Full mission → features → issues → code pipeline
//
// Reads the mission, analyzes the current state, identifies what to build next,
// and either creates features, issues, or code.

import * as core from '@actions/core';
import { CopilotClient, approveAll } from '@github/copilot-sdk';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { createAgentTools } from '../tools.js';

/**
 * Run the full evolution pipeline from mission to code.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function evolve(context) {
  const { config, instructions, writablePaths, testCommand, model, octokit, repo } = context;

  // Read mission
  const missionPath = config.paths.missionFilepath?.path || 'MISSION.md';
  let mission = '';
  try {
    mission = readFileSync(missionPath, 'utf8');
  } catch {
    core.warning(`No mission file found at ${missionPath}`);
    return { outcome: 'nop', details: 'No mission file found' };
  }

  // Read existing features
  const featuresPath = config.paths.featuresPath?.path || 'features/';
  let features = [];
  if (existsSync(featuresPath)) {
    features = readdirSync(featuresPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        try { return { name: f, content: readFileSync(`${featuresPath}${f}`, 'utf8') }; }
        catch { return { name: f, content: '' }; }
      });
  }

  // Read current source files for context
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

  // Fetch open issues
  const { data: openIssues } = await octokit.rest.issues.listForRepo({
    ...repo,
    state: 'open',
    per_page: 20,
  });

  // Read instructions
  const agentInstructions = instructions || 'Evolve the repository toward its mission by identifying the next best action.';

  // Separate writable and read-only paths
  const readOnlyPaths = config.readOnlyPaths || [];

  // TDD mode: split into test-first + implementation phases
  const tddEnabled = config.tdd === true;

  if (tddEnabled) {
    return await evolveTdd({ config, instructions: agentInstructions, writablePaths, readOnlyPaths, testCommand, model, mission, features, sourceFiles, openIssues });
  }

  // Build the prompt
  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    '## Mission',
    mission,
    '',
    `## Current Features (${features.length})`,
    ...features.map(f => `### ${f.name}\n${f.content.substring(0, 500)}`),
    '',
    `## Current Source Files (${sourceFiles.length})`,
    ...sourceFiles.map(f => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
    '',
    `## Open Issues (${openIssues.length})`,
    ...openIssues.slice(0, 10).map(i => `- #${i.number}: ${i.title}`),
    '',
    '## Your Task',
    'Analyze the mission, features, source code, and open issues.',
    'Determine the single most impactful next step to evolve this repository.',
    'Then implement that step.',
    '',
    '## File Paths',
    '### Writable (you may modify these)',
    writablePaths.length > 0 ? writablePaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '### Read-Only (for context only, do NOT modify)',
    readOnlyPaths.length > 0 ? readOnlyPaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '## Constraints',
    `- Run \`${testCommand}\` to validate your changes`,
  ].join('\n');

  // Create Copilot SDK session
  const client = new CopilotClient({ githubToken: process.env.GITHUB_TOKEN });
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: { content: 'You are an autonomous code evolution agent. Your goal is to advance the repository toward its mission by making the most impactful change possible in a single step.' },
      tools: createAgentTools(writablePaths),
      onPermissionRequest: approveAll,
      workingDirectory: process.cwd(),
    });

    const response = await session.sendAndWait({ prompt });

    tokensUsed = response?.data?.usage?.totalTokens || 0;
    const resultContent = response?.data?.content || '';

    core.info(`Evolution step completed (${tokensUsed} tokens)`);

    return {
      outcome: 'evolved',
      tokensUsed,
      model,
      details: resultContent.substring(0, 500),
    };
  } finally {
    await client.stop();
  }
}

/**
 * TDD-mode evolution: Phase 1 creates a failing test, Phase 2 writes implementation.
 *
 * @param {Object} params - Parameters extracted from the evolve context
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
async function evolveTdd({ config, instructions, writablePaths, readOnlyPaths, testCommand, model, mission, features, sourceFiles, openIssues }) {
  const client = new CopilotClient({ githubToken: process.env.GITHUB_TOKEN });
  let totalTokens = 0;

  try {
    // Phase 1: Create a failing test
    core.info('TDD Phase 1: Creating failing test');

    const testPrompt = [
      '## Instructions',
      instructions,
      '',
      '## Mode: TDD Phase 1 — Write Failing Test',
      'You are in TDD mode. In this phase, you must ONLY write a test.',
      'The test should capture the next feature requirement based on the mission and current state.',
      'The test MUST fail against the current codebase (it tests something not yet implemented).',
      'Do NOT write any implementation code in this phase.',
      '',
      '## Mission',
      mission,
      '',
      `## Current Features (${features.length})`,
      ...features.map(f => `### ${f.name}\n${f.content.substring(0, 500)}`),
      '',
      `## Current Source Files (${sourceFiles.length})`,
      ...sourceFiles.map(f => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
      '',
      `## Open Issues (${openIssues.length})`,
      ...openIssues.slice(0, 10).map(i => `- #${i.number}: ${i.title}`),
      '',
      '## File Paths',
      '### Writable (you may modify these)',
      writablePaths.length > 0 ? writablePaths.map(p => `- ${p}`).join('\n') : '- (none)',
      '',
      '### Read-Only (for context only, do NOT modify)',
      readOnlyPaths.length > 0 ? readOnlyPaths.map(p => `- ${p}`).join('\n') : '- (none)',
      '',
      '## Constraints',
      '- Write ONLY test code in this phase',
      '- The test must fail when run (it tests unimplemented functionality)',
      `- Run \`${testCommand}\` to confirm the test fails`,
    ].join('\n');

    const session1 = await client.createSession({
      model,
      systemMessage: { content: 'You are a TDD agent. In this phase, write ONLY a failing test that captures the next feature requirement. Do not write implementation code.' },
      tools: createAgentTools(writablePaths),
      onPermissionRequest: approveAll,
      workingDirectory: process.cwd(),
    });

    const response1 = await session1.sendAndWait({ prompt: testPrompt });
    totalTokens += response1?.data?.usage?.totalTokens || 0;
    const testResult = response1?.data?.content || '';

    core.info(`TDD Phase 1 completed (${totalTokens} tokens): test created`);

    // Phase 2: Write implementation to make the test pass
    core.info('TDD Phase 2: Writing implementation');

    const implPrompt = [
      '## Instructions',
      instructions,
      '',
      '## Mode: TDD Phase 2 — Write Implementation',
      'A failing test has been written in Phase 1. Your job is to write the MINIMUM implementation',
      'code needed to make the test pass. Do not modify the test.',
      '',
      '## What was done in Phase 1',
      testResult.substring(0, 1000),
      '',
      '## Mission',
      mission,
      '',
      `## Current Source Files (${sourceFiles.length})`,
      ...sourceFiles.map(f => `### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``),
      '',
      '## File Paths',
      '### Writable (you may modify these)',
      writablePaths.length > 0 ? writablePaths.map(p => `- ${p}`).join('\n') : '- (none)',
      '',
      '### Read-Only (for context only, do NOT modify)',
      readOnlyPaths.length > 0 ? readOnlyPaths.map(p => `- ${p}`).join('\n') : '- (none)',
      '',
      '## Constraints',
      '- Write implementation code to make the failing test pass',
      '- Do NOT modify the test file created in Phase 1',
      `- Run \`${testCommand}\` to confirm all tests pass`,
    ].join('\n');

    const session2 = await client.createSession({
      model,
      systemMessage: { content: 'You are a TDD agent. A failing test was written in Phase 1. Write the minimum implementation to make it pass. Do not modify the test.' },
      tools: createAgentTools(writablePaths),
      onPermissionRequest: approveAll,
      workingDirectory: process.cwd(),
    });

    const response2 = await session2.sendAndWait({ prompt: implPrompt });
    totalTokens += response2?.data?.usage?.totalTokens || 0;

    core.info(`TDD Phase 2 completed (total ${totalTokens} tokens)`);

    return {
      outcome: 'evolved-tdd',
      tokensUsed: totalTokens,
      model,
      details: `TDD evolution: Phase 1 (failing test) + Phase 2 (implementation). ${testResult.substring(0, 200)}`,
    };
  } finally {
    await client.stop();
  }
}
