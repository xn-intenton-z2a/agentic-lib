import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @actions/core
vi.mock("@actions/core", () => ({
  info: vi.fn(),
  warning: vi.fn(),
  setOutput: vi.fn(),
  getInput: vi.fn(),
  setFailed: vi.fn(),
}));

// Mock the copilot module
vi.mock("../../../../src/actions/agentic-step/copilot.js", () => ({
  runCopilotTask: vi.fn().mockResolvedValue({ content: "mock generated code", tokensUsed: 100 }),
  readOptionalFile: vi.fn().mockReturnValue("mock contributing content"),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

// Mock safety.js
vi.mock("../../../../src/actions/agentic-step/safety.js", () => ({
  isIssueResolved: vi.fn().mockResolvedValue(false),
  checkAttemptLimit: vi.fn().mockResolvedValue({ allowed: true, attempts: 0 }),
  checkWipLimit: vi.fn().mockResolvedValue({ allowed: true, count: 0 }),
}));

import { resolveIssue } from "../../../../src/actions/agentic-step/tasks/resolve-issue.js";
import { isIssueResolved, checkAttemptLimit, checkWipLimit } from "../../../../src/actions/agentic-step/safety.js";
import { runCopilotTask, readOptionalFile } from "../../../../src/actions/agentic-step/copilot.js";

// --- Helpers ---

function createMockOctokit(overrides = {}) {
  return {
    rest: {
      issues: {
        get: vi.fn().mockResolvedValue({ data: { state: "open", title: "Test Issue", body: "Test body", labels: [] } }),
        listForRepo: vi.fn().mockResolvedValue({ data: [] }),
        listComments: vi.fn().mockResolvedValue({ data: [] }),
        update: vi.fn().mockResolvedValue({}),
        addLabels: vi.fn().mockResolvedValue({}),
        createComment: vi.fn().mockResolvedValue({}),
      },
      pulls: {
        get: vi.fn().mockResolvedValue({ data: { title: "Test PR", body: "", head: { sha: "abc123" } } }),
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
      mission: { path: "MISSION.md" },
      contributing: { path: "CONTRIBUTING.md" },
      features: { path: "features/", permissions: ["write"], limit: 4 },
      source: { path: "src/" },
      tests: { path: "tests/" },
      librarySources: { path: "SOURCES.md" },
      library: { path: "library/" },
    },
    attemptsPerIssue: 2,
    attemptsPerBranch: 3,
    featureDevelopmentIssuesWipLimit: 2,
    maintenanceIssuesWipLimit: 1,
    readOnlyPaths: ["README.md"],
    writablePaths: ["src/", "tests/"],
    tdd: false,
    intentionBot: { intentionFilepath: "intenti\u00F6n.md" },
    ...overrides,
  };
}

function createMockContext(overrides = {}) {
  return {
    task: "resolve-issue",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "42",
    prNumber: "",
    writablePaths: ["src/", "tests/"],
    testCommand: "npm test",
    discussionUrl: "",
    model: "claude-sonnet-4",
    octokit: createMockOctokit(),
    repo: { owner: "test-owner", repo: "test-repo" },
    github: { runId: 12345 },
    ...overrides,
  };
}

// --- Tests ---

describe("tasks/resolve-issue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset safety mocks to defaults
    isIssueResolved.mockResolvedValue(false);
    checkAttemptLimit.mockResolvedValue({ allowed: true, attempts: 0 });
    checkWipLimit.mockResolvedValue({ allowed: true, count: 0 });
    runCopilotTask.mockResolvedValue({ content: "mock generated code", tokensUsed: 100 });
    readOptionalFile.mockReturnValue("mock contributing content");
  });

  it("throws if issueNumber is missing", async () => {
    const ctx = createMockContext({ issueNumber: "" });
    await expect(resolveIssue(ctx)).rejects.toThrow("resolve-issue task requires issue-number input");
  });

  it("throws if issueNumber is undefined", async () => {
    const ctx = createMockContext({ issueNumber: undefined });
    await expect(resolveIssue(ctx)).rejects.toThrow("resolve-issue task requires issue-number input");
  });

  it("returns nop if issue is already closed", async () => {
    isIssueResolved.mockResolvedValue(true);
    const ctx = createMockContext();

    const result = await resolveIssue(ctx);

    expect(result.outcome).toBe("nop");
    expect(result.details).toBe("Issue already resolved");
    // Should not proceed to copilot
    expect(runCopilotTask).not.toHaveBeenCalled();
    expect(checkAttemptLimit).not.toHaveBeenCalled();
  });

  it("returns attempt-limit-exceeded if attempts exhausted", async () => {
    checkAttemptLimit.mockResolvedValue({ allowed: false, attempts: 3 });
    const ctx = createMockContext();

    const result = await resolveIssue(ctx);

    expect(result.outcome).toBe("attempt-limit-exceeded");
    expect(result.details).toContain("3 attempts exhausted");
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it("returns wip-limit-reached if WIP limit hit", async () => {
    checkWipLimit.mockResolvedValue({ allowed: false, count: 2 });
    const ctx = createMockContext();

    const result = await resolveIssue(ctx);

    expect(result.outcome).toBe("wip-limit-reached");
    expect(result.details).toContain("2 issues in progress");
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it("calls runCopilotTask on happy path and returns code-generated", async () => {
    const ctx = createMockContext();

    const result = await resolveIssue(ctx);

    expect(result.outcome).toBe("code-generated");
    expect(result.tokensUsed).toBe(100);
    expect(result.model).toBe("claude-sonnet-4");
    expect(result.prNumber).toBeNull();
    expect(result.commitUrl).toBeNull();
    expect(result.details).toContain("Generated code for issue #42");
    expect(runCopilotTask).toHaveBeenCalledTimes(1);
  });

  it("includes issue body and title in the prompt sent to Copilot", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.get.mockResolvedValue({
      data: { state: "open", title: "Fix the widget", body: "The widget is broken", labels: [] },
    });
    octokit.rest.issues.listComments.mockResolvedValue({
      data: [{ user: { login: "testuser" }, body: "I can reproduce this" }],
    });
    const ctx = createMockContext({ octokit });

    await resolveIssue(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("Fix the widget");
    expect(callArgs.prompt).toContain("The widget is broken");
    expect(callArgs.prompt).toContain("testuser");
    expect(callArgs.prompt).toContain("I can reproduce this");
    expect(callArgs.systemMessage).toContain("#42");
  });

  it("passes correct writable paths and model to runCopilotTask", async () => {
    const ctx = createMockContext({ writablePaths: ["lib/", "tests/"], model: "gpt-4o" });

    await resolveIssue(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.writablePaths).toEqual(["lib/", "tests/"]);
    expect(callArgs.model).toBe("gpt-4o");
  });

  it("calls safety checks in correct order with correct parameters", async () => {
    const ctx = createMockContext();

    await resolveIssue(ctx);

    expect(isIssueResolved).toHaveBeenCalledWith(ctx.octokit, ctx.repo, "42");
    expect(checkAttemptLimit).toHaveBeenCalledWith(ctx.octokit, ctx.repo, "42", "agentic-lib-issue-", 2);
    expect(checkWipLimit).toHaveBeenCalledWith(ctx.octokit, ctx.repo, "in-progress", 2);
  });
});
