// tasks/maintain-library.js — Library and knowledge management
//
// Crawls SOURCES.md, updates library documents, maintains the knowledge base
// that provides context for feature generation and issue resolution.

import * as core from '@actions/core';
import { CopilotClient } from '@github/copilot-sdk';
import { readFileSync, readdirSync, existsSync } from 'fs';

/**
 * Maintain the library of knowledge documents from source URLs.
 *
 * @param {Object} context - Task context from index.js
 * @returns {Promise<Object>} Result with outcome, tokensUsed, model
 */
export async function maintainLibrary(context) {
  const { config, instructions, writablePaths, model } = context;

  // Read sources
  const sourcesPath = config.paths.librarySourcesFilepath?.path || 'SOURCES.md';
  let sources = '';
  try { sources = readFileSync(sourcesPath, 'utf8'); } catch { /* optional */ }

  if (!sources.trim()) {
    core.info('No sources found. Returning nop.');
    return { outcome: 'nop', details: 'No SOURCES.md or empty' };
  }

  // Read existing library docs
  const libraryPath = config.paths.libraryDocumentsPath?.path || 'library/';
  const libraryLimit = config.paths.libraryDocumentsPath?.limit || 32;
  let libraryDocs = [];
  if (existsSync(libraryPath)) {
    libraryDocs = readdirSync(libraryPath)
      .filter(f => f.endsWith('.md'))
      .map(f => {
        try { return { name: f, content: readFileSync(`${libraryPath}${f}`, 'utf8').substring(0, 500) }; }
        catch { return { name: f, content: '' }; }
      });
  }

  const agentInstructions = instructions || 'Maintain the library by updating documents from sources.';

  const prompt = [
    '## Instructions',
    agentInstructions,
    '',
    '## Sources',
    sources,
    '',
    `## Current Library Documents (${libraryDocs.length}/${libraryLimit} max)`,
    ...libraryDocs.map(d => `### ${d.name}\n${d.content}`),
    '',
    '## Your Task',
    '1. Read each URL in SOURCES.md and extract technical content.',
    '2. Create or update library documents based on the source content.',
    '3. Remove library documents that no longer have corresponding sources.',
    '',
    '## File Paths',
    '### Writable (you may modify these)',
    writablePaths.length > 0 ? writablePaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '### Read-Only (for context only, do NOT modify)',
    (config.readOnlyPaths || []).length > 0 ? config.readOnlyPaths.map(p => `- ${p}`).join('\n') : '- (none)',
    '',
    '## Constraints',
    `- Maximum ${libraryLimit} library documents`,
  ].join('\n');

  const client = new CopilotClient();
  let tokensUsed = 0;

  try {
    const session = await client.createSession({
      model,
      systemMessage: 'You are a knowledge librarian. Maintain a library of technical documents extracted from web sources.',
      workingDirectory: process.cwd(),
    });

    const response = await session.sendAndWait({ prompt });
    tokensUsed = response?.data?.usage?.totalTokens || 0;

    return {
      outcome: 'library-maintained',
      tokensUsed,
      model,
      details: `Maintained library (${libraryDocs.length} docs, limit ${libraryLimit})`,
    };
  } finally {
    await client.stop();
  }
}
