#!/usr/bin/env node
// record-golden-prompts.js — Capture current prompt templates as golden files
//
// Runs each task handler's prompt construction logic with mock data
// and saves the resulting prompts as golden files for regression testing.

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const GOLDEN_DIR = join(import.meta.dirname, '../tests/fixtures/golden-prompts');
mkdirSync(GOLDEN_DIR, { recursive: true });

// Golden prompt templates extracted from handler source code.
// These are the structural patterns — not the dynamic content.

const goldenPrompts = {
  'resolve-issue': {
    systemMessage: 'You are an autonomous coding agent resolving GitHub issue #{issueNumber}. Write clean, tested code. Only modify files listed under "Writable" paths. Read-only paths are for context only.',
    promptSections: [
      '## Instructions',
      '## Issue',
      '## Issue Comments',
      '## File Paths',
      '## Constraints',
      '## Contributing Guidelines',
    ],
  },
  'fix-code': {
    systemMessage: 'You are an autonomous coding agent fixing failing tests on PR #{prNumber}. Make minimal, targeted changes to fix the test failures.',
    promptSections: [
      '## Instructions',
      '## Pull Request',
      '## Failing Checks',
      '## File Paths',
      '## Constraints',
    ],
  },
  'evolve': {
    systemMessage: 'You are an autonomous code evolution agent. Your goal is to advance the repository toward its mission by making the most impactful change possible in a single step.',
    promptSections: [
      '## Instructions',
      '## Mission',
      '## Current Features',
      '## Current Source Files',
      '## Open Issues',
      '## Your Task',
      '## File Paths',
      '## Constraints',
    ],
  },
  'maintain-features': {
    systemMessage: 'You are a feature lifecycle manager. Create, update, and prune feature specification files to keep the project focused on its mission.',
    promptSections: [
      '## Instructions',
      '## Mission',
      '## Current Features',
      '## Library Documents',
      '## Recently Closed Issues',
      '## Your Task',
      '## File Paths',
      '## Constraints',
    ],
  },
  'maintain-library': {
    systemMessage: 'You are a knowledge librarian. Maintain a library of technical documents extracted from web sources.',
    promptSections: [
      '## Instructions',
      '## Sources',
      '## Current Library Documents',
      '## Your Task',
      '## File Paths',
      '## Constraints',
    ],
  },
  'enhance-issue': {
    systemMessage: 'You are a requirements analyst. Enhance GitHub issues with clear, testable acceptance criteria.',
    promptSections: [
      '## Instructions',
      '## Issue',
      '## Contributing Guidelines',
      '## Related Features',
      '## Your Task',
    ],
  },
  'review-issue': {
    systemMessage: 'You are a code reviewer determining if GitHub issues have been resolved.',
    promptSections: [
      '## Instructions',
      '## Issue',
      '## Current Source',
      '## Current Tests',
      '## Your Task',
    ],
  },
  'discussions': {
    systemMessage: 'You are a repository bot that responds to GitHub Discussions.',
    promptSections: [
      '## Instructions',
      '## Discussion',
      '## Context',
      '## Available Actions',
      '## Mission Protection',
    ],
  },
};

for (const [task, golden] of Object.entries(goldenPrompts)) {
  const filepath = join(GOLDEN_DIR, `${task}.json`);
  writeFileSync(filepath, JSON.stringify(golden, null, 2) + '\n');
  console.log(`Recorded: ${filepath}`);
}

console.log(`\nRecorded ${Object.keys(goldenPrompts).length} golden prompt templates`);
