// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @actions/core
vi.mock("@actions/core", () => ({
  info: vi.fn(),
  debug: vi.fn(),
  warning: vi.fn(),
  setOutput: vi.fn(),
  getInput: vi.fn(),
  setFailed: vi.fn(),
}));

// Mock the copilot module
vi.mock("../../../../src/actions/agentic-step/copilot.js", () => ({
  runCopilotTask: vi.fn().mockResolvedValue({ content: "mock fix applied", tokensUsed: 80 }),
  readOptionalFile: vi.fn().mockReturnValue("mock content"),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

// Mock child_process
vi.mock("child_process", () => ({
  execSync: vi.fn().mockReturnValue("FAIL tests/unit/main.test.js\n  ✕ should return correct value\n    Error: expected 42 but got undefined"),
}));

import { fixCode } from "../../../../src/actions/agentic-step/tasks/fix-code.js";
import { runCopilotTask } from "../../../../src/actions/agentic-step/copilot.js";
import { execSync } from "child_process";

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
        get: vi.fn().mockResolvedValue({ data: { title: "Test PR", body: "PR description", head: { sha: "abc123" } } }),
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
    task: "fix-code",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "",
    prNumber: "99",
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

describe("tasks/fix-code", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runCopilotTask.mockResolvedValue({ content: "mock fix applied", tokensUsed: 80 });
  });

  it("throws if prNumber is missing", async () => {
    const ctx = createMockContext({ prNumber: "" });
    await expect(fixCode(ctx)).rejects.toThrow("fix-code task requires pr-number input");
  });

  it("returns nop if no failing checks", async () => {
    const octokit = createMockOctokit();
    // All checks pass (no failures)
    octokit.rest.checks.listForRef.mockResolvedValue({
      data: {
        check_runs: [
          { name: "build", conclusion: "success", output: {} },
          { name: "lint", conclusion: "success", output: {} },
        ],
      },
    });
    const ctx = createMockContext({ octokit });

    const result = await fixCode(ctx);

    expect(result.outcome).toBe("nop");
    expect(result.details).toBe("No failing checks found");
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it("includes failure details in prompt when checks fail", async () => {
    const octokit = createMockOctokit();
    octokit.rest.checks.listForRef.mockResolvedValue({
      data: {
        check_runs: [
          {
            name: "unit-tests",
            conclusion: "failure",
            details_url: "https://github.com/owner/repo/actions/runs/12345",
            output: { summary: "TypeError: cannot read property" },
          },
          { name: "lint", conclusion: "success", output: {} },
          {
            name: "e2e",
            conclusion: "failure",
            details_url: "https://github.com/owner/repo/actions/runs/12346",
            output: { summary: "Timeout waiting for selector" },
          },
        ],
      },
    });
    const ctx = createMockContext({ octokit });

    await fixCode(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("unit-tests");
    // Should contain the actual log output from execSync mock
    expect(callArgs.prompt).toContain("FAIL tests/unit/main.test.js");
    expect(callArgs.prompt).toContain("e2e");
    expect(callArgs.prompt).toContain("Test PR");
    expect(callArgs.systemMessage).toContain("#99");
    // execSync should have been called for each failed check
    expect(execSync).toHaveBeenCalledTimes(2);
  });

  it("falls back to summary when log fetch fails", async () => {
    execSync.mockImplementation(() => { throw new Error("gh not found"); });
    const octokit = createMockOctokit();
    octokit.rest.checks.listForRef.mockResolvedValue({
      data: {
        check_runs: [
          {
            name: "unit-tests",
            conclusion: "failure",
            details_url: "https://github.com/owner/repo/actions/runs/12345",
            output: { summary: "TypeError: cannot read property" },
          },
        ],
      },
    });
    const ctx = createMockContext({ octokit });

    await fixCode(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("TypeError: cannot read property");
  });

  it("returns fix-applied outcome on happy path", async () => {
    const octokit = createMockOctokit();
    octokit.rest.checks.listForRef.mockResolvedValue({
      data: {
        check_runs: [{ name: "unit-tests", conclusion: "failure", output: { summary: "Assertion failed" } }],
      },
    });
    const ctx = createMockContext({ octokit });

    const result = await fixCode(ctx);

    expect(result.outcome).toBe("fix-applied");
    expect(result.tokensUsed).toBe(80);
    expect(result.model).toBe("claude-sonnet-4");
    expect(result.details).toContain("1 failing check(s)");
    expect(result.details).toContain("PR #99");
  });

  it("uses default failure message when output summary is missing", async () => {
    execSync.mockImplementation(() => { throw new Error("gh not found"); });
    const octokit = createMockOctokit();
    octokit.rest.checks.listForRef.mockResolvedValue({
      data: {
        check_runs: [{ name: "build", conclusion: "failure", output: {} }],
      },
    });
    const ctx = createMockContext({ octokit });

    await fixCode(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("**build:**");
    expect(callArgs.prompt).toContain("Failed");
  });
});
