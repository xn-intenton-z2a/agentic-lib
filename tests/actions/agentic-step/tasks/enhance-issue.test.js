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
  runCopilotTask: vi.fn().mockResolvedValue({ content: 'Enhanced issue body with acceptance criteria', tokensUsed: 75 }),
  readOptionalFile: vi.fn().mockReturnValue('mock contributing'),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue('## File Paths\n- mock'),
}));

// Mock safety.js
vi.mock('../../../../src/actions/agentic-step/safety.js', () => ({
  isIssueResolved: vi.fn().mockResolvedValue(false),
  checkAttemptLimit: vi.fn().mockResolvedValue({ allowed: true, attempts: 0 }),
  checkWipLimit: vi.fn().mockResolvedValue({ allowed: true, count: 0 }),
}));

import { enhanceIssue } from '../../../../src/actions/agentic-step/tasks/enhance-issue.js';
import { isIssueResolved } from '../../../../src/actions/agentic-step/safety.js';
import { runCopilotTask, readOptionalFile, scanDirectory } from '../../../../src/actions/agentic-step/copilot.js';

// --- Helpers ---

function createMockOctokit(overrides = {}) {
  return {
    rest: {
      issues: {
        get: vi.fn().mockResolvedValue({ data: { state: 'open', title: 'Test Issue', body: 'Test body', labels: [] } }),
        listForRepo: vi.fn().mockResolvedValue({ data: [] }),
        listComments: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({}),
        addLabels: vi.fn().mockResolvedValue({}),
        createComment: vi.fn().mockResolvedValue({}),
      },
      pulls: {
        get: vi.fn().mockResolvedValue({ data: { title: 'Test PR', body: '', head: { sha: 'abc123' } } }),
      },
      checks: {
        listForRef: vi.fn().mockResolvedValue({ data: { check_runs: [] } }),
      },
      git: {
        listMatchingRefs: vi.fn().mockResolvedValue({ data: [] }),
      },
      ...overrides,
    },
    graphql: vi.fn().mockResolvedValue({}),
  };
}

function createMockConfig(overrides = {}) {
  return {
    paths: {
      missionFilepath: { path: 'MISSION.md' },
      contributingFilepath: { path: 'CONTRIBUTING.md' },
      featuresPath: { path: 'features/', permissions: ['write'], limit: 4 },
      targetSourcePath: { path: 'src/' },
      targetTestsPath: { path: 'tests/' },
      librarySourcesFilepath: { path: 'SOURCES.md' },
      libraryDocumentsPath: { path: 'library/' },
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
    task: 'enhance-issue',
    config: createMockConfig(),
    instructions: '',
    issueNumber: '42',
    prNumber: '',
    writablePaths: ['src/', 'tests/'],
    testCommand: 'npm test',
    discussionUrl: '',
    model: 'claude-sonnet-4.5',
    octokit: createMockOctokit(),
    repo: { owner: 'test-owner', repo: 'test-repo' },
    github: { runId: 12345 },
    ...overrides,
  };
}

// --- Tests ---

describe('tasks/enhance-issue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isIssueResolved.mockResolvedValue(false);
    runCopilotTask.mockResolvedValue({ content: 'Enhanced issue body with acceptance criteria', tokensUsed: 75 });
    readOptionalFile.mockReturnValue('mock contributing');
    scanDirectory.mockReturnValue([]);
  });

  it('throws if issueNumber is missing', async () => {
    const ctx = createMockContext({ issueNumber: '' });
    await expect(enhanceIssue(ctx)).rejects.toThrow('enhance-issue task requires issue-number input');
  });

  it('returns nop if issue is already resolved', async () => {
    isIssueResolved.mockResolvedValue(true);
    const ctx = createMockContext();

    const result = await enhanceIssue(ctx);

    expect(result.outcome).toBe('nop');
    expect(result.details).toBe('Issue already resolved');
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it('returns nop if issue already has ready label', async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.get.mockResolvedValue({
      data: { state: 'open', title: 'Test', body: 'body', labels: [{ name: 'ready' }] },
    });
    const ctx = createMockContext({ octokit });

    const result = await enhanceIssue(ctx);

    expect(result.outcome).toBe('nop');
    expect(result.details).toBe('Issue already has ready label');
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it('updates issue body, adds labels, and comments on happy path', async () => {
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await enhanceIssue(ctx);

    expect(result.outcome).toBe('issue-enhanced');
    expect(result.tokensUsed).toBe(75);
    expect(result.model).toBe('claude-sonnet-4.5');
    expect(result.details).toContain('Enhanced issue #42');

    // Verify octokit calls
    expect(octokit.rest.issues.update).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: 'test-owner',
        repo: 'test-repo',
        issue_number: 42,
        body: 'Enhanced issue body with acceptance criteria',
      })
    );
    expect(octokit.rest.issues.addLabels).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 42,
        labels: ['ready'],
      })
    );
    expect(octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 42,
        body: expect.stringContaining('Automated Enhancement'),
      })
    );
  });

  it('does not update issue if enhanced body is empty', async () => {
    runCopilotTask.mockResolvedValue({ content: '   ', tokensUsed: 50 });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await enhanceIssue(ctx);

    expect(result.outcome).toBe('issue-enhanced');
    // Should NOT have updated the issue body since content was whitespace
    expect(octokit.rest.issues.update).not.toHaveBeenCalled();
    expect(octokit.rest.issues.addLabels).not.toHaveBeenCalled();
    expect(octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });
});
