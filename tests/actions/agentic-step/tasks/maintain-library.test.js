import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @actions/core
vi.mock('@actions/core', () => ({
  info: vi.fn(),
  warning: vi.fn(),
  setOutput: vi.fn(),
  getInput: vi.fn(),
  setFailed: vi.fn(),
}));

// Mock the copilot module
vi.mock('../../../../src/actions/agentic-step/copilot.js', () => ({
  runCopilotTask: vi.fn().mockResolvedValue({ content: 'library updated', tokensUsed: 90 }),
  readOptionalFile: vi.fn().mockReturnValue(''),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue('## File Paths\n- mock'),
}));

import { maintainLibrary } from '../../../../src/actions/agentic-step/tasks/maintain-library.js';
import { runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection } from '../../../../src/actions/agentic-step/copilot.js';

// --- Helpers ---

function createMockConfig(overrides = {}) {
  return {
    paths: {
      missionFilepath: { path: 'MISSION.md' },
      contributingFilepath: { path: 'CONTRIBUTING.md' },
      featuresPath: { path: 'features/', permissions: ['write'], limit: 4 },
      targetSourcePath: { path: 'src/' },
      targetTestsPath: { path: 'tests/' },
      librarySourcesFilepath: { path: 'SOURCES.md' },
      libraryDocumentsPath: { path: 'library/', limit: 32 },
    },
    attemptsPerIssue: 2,
    attemptsPerBranch: 3,
    featureDevelopmentIssuesWipLimit: 2,
    maintenanceIssuesWipLimit: 1,
    readOnlyPaths: ['README.md'],
    writablePaths: ['src/', 'tests/'],
    tdd: false,
    intentionBot: { intentionFilepath: 'intenti\u00F6n.md' },
    ...overrides,
  };
}

function createMockContext(overrides = {}) {
  return {
    task: 'maintain-library',
    config: createMockConfig(),
    instructions: '',
    issueNumber: '',
    prNumber: '',
    writablePaths: ['library/'],
    testCommand: 'npm test',
    discussionUrl: '',
    model: 'claude-sonnet-4.5',
    octokit: null,
    repo: { owner: 'test-owner', repo: 'test-repo' },
    github: { runId: 12345 },
    ...overrides,
  };
}

// --- Tests ---

describe('tasks/maintain-library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readOptionalFile.mockReturnValue('');
    scanDirectory.mockReturnValue([]);
    runCopilotTask.mockResolvedValue({ content: 'library updated', tokensUsed: 90 });
  });

  it('returns nop if no sources found (SOURCES.md empty)', async () => {
    readOptionalFile.mockReturnValue('');
    const ctx = createMockContext();

    const result = await maintainLibrary(ctx);

    expect(result.outcome).toBe('nop');
    expect(result.details).toContain('No SOURCES.md or empty');
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it('returns nop if sources is whitespace-only', async () => {
    readOptionalFile.mockReturnValue('   \n  \t  ');
    const ctx = createMockContext();

    const result = await maintainLibrary(ctx);

    expect(result.outcome).toBe('nop');
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it('includes library docs and sources in prompt', async () => {
    readOptionalFile.mockReturnValue('- https://example.com/docs\n- https://nodejs.org/api');
    scanDirectory.mockReturnValue([
      { name: 'express.md', content: 'Express.js docs' },
      { name: 'node-api.md', content: 'Node.js API docs' },
    ]);
    const ctx = createMockContext();

    await maintainLibrary(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain('https://example.com/docs');
    expect(callArgs.prompt).toContain('https://nodejs.org/api');
    expect(callArgs.prompt).toContain('express.md');
    expect(callArgs.prompt).toContain('node-api.md');
    expect(callArgs.prompt).toContain('Current Library Documents (2/32 max)');
    expect(callArgs.systemMessage).toContain('knowledge librarian');
  });

  it('returns library-maintained outcome on happy path', async () => {
    readOptionalFile.mockReturnValue('- https://example.com/docs');
    scanDirectory.mockReturnValue([{ name: 'doc.md', content: 'some doc' }]);
    const ctx = createMockContext();

    const result = await maintainLibrary(ctx);

    expect(result.outcome).toBe('library-maintained');
    expect(result.tokensUsed).toBe(90);
    expect(result.model).toBe('claude-sonnet-4.5');
    expect(result.details).toContain('1 docs');
    expect(result.details).toContain('limit 32');
  });
});
