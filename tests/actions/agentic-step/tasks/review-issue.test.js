// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
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
  runCopilotTask: vi.fn().mockResolvedValue({ content: "OPEN: not yet implemented", tokensUsed: 60 }),
  readOptionalFile: vi.fn().mockReturnValue("mock content"),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

import { reviewIssue } from "../../../../src/actions/agentic-step/tasks/review-issue.js";
import { runCopilotTask, scanDirectory } from "../../../../src/actions/agentic-step/copilot.js";

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
    task: "review-issue",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "42",
    prNumber: "",
    writablePaths: [],
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

describe("tasks/review-issue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runCopilotTask.mockResolvedValue({ content: "OPEN: not yet implemented", tokensUsed: 60 });
    scanDirectory.mockReturnValue([]);
  });

  it("fetches oldest open automated issue if no issueNumber provided", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.listForRepo.mockResolvedValue({
      data: [{ number: 17, title: "Automated issue" }],
    });
    octokit.rest.issues.get.mockResolvedValue({
      data: { state: "open", title: "Automated issue", body: "auto body", labels: [] },
    });
    const ctx = createMockContext({ octokit, issueNumber: "" });

    await reviewIssue(ctx);

    expect(octokit.rest.issues.listForRepo).toHaveBeenCalledWith(
      expect.objectContaining({ state: "open", labels: "automated", per_page: 8, sort: "created", direction: "asc" }),
    );
    expect(octokit.rest.issues.get).toHaveBeenCalledWith(expect.objectContaining({ issue_number: 17 }));
    // Should proceed to review the issue
    expect(runCopilotTask).toHaveBeenCalled();
  });

  it("returns nop if no automated issues and no issueNumber", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.listForRepo.mockResolvedValue({ data: [] });
    const ctx = createMockContext({ octokit, issueNumber: "" });

    const result = await reviewIssue(ctx);

    expect(result.outcome).toBe("nop");
    expect(result.details).toContain("No open automated issues");
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it("returns nop if issue is already closed", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.get.mockResolvedValue({
      data: { state: "closed", title: "Closed Issue", body: "body", labels: [] },
    });
    const ctx = createMockContext({ octokit });

    const result = await reviewIssue(ctx);

    expect(result.outcome).toBe("nop");
    expect(result.details).toContain("already closed");
    expect(runCopilotTask).not.toHaveBeenCalled();
  });

  it("closes issue and comments if verdict starts with RESOLVED", async () => {
    runCopilotTask.mockResolvedValue({ content: "RESOLVED: The feature has been fully implemented", tokensUsed: 85 });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await reviewIssue(ctx);

    expect(result.outcome).toBe("issue-closed");
    expect(result.tokensUsed).toBe(85);
    expect(result.details).toContain("Closed issue #42");
    expect(result.details).toContain("RESOLVED");

    expect(octokit.rest.issues.createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 42,
        body: expect.stringContaining("Automated Review Result"),
      }),
    );
    expect(octokit.rest.issues.update).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 42,
        state: "closed",
      }),
    );
  });

  it("uses batch mode when no issueNumber provided", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.listForRepo.mockResolvedValue({
      data: [
        { number: 5, title: "Issue 5" },
        { number: 6, title: "Issue 6" },
        { number: 7, title: "Issue 7" },
      ],
    });
    octokit.rest.issues.listComments.mockResolvedValue({ data: [] });
    octokit.rest.issues.get.mockResolvedValue({
      data: { state: "open", title: "Test Issue", body: "body", labels: [] },
    });
    const ctx = createMockContext({ octokit, issueNumber: "" });

    const result = await reviewIssue(ctx);

    // Should review 3 issues in batch
    expect(runCopilotTask).toHaveBeenCalledTimes(3);
    expect(result.outcome).toBe("issues-reviewed");
    expect(result.details).toContain("Batch reviewed 3 issues");
  });

  it("returns issue-still-open when verdict does not start with RESOLVED", async () => {
    runCopilotTask.mockResolvedValue({ content: "OPEN: The implementation is incomplete", tokensUsed: 70 });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await reviewIssue(ctx);

    expect(result.outcome).toBe("issue-still-open");
    expect(result.tokensUsed).toBe(70);
    expect(result.details).toContain("remains open");
    expect(result.details).toContain("OPEN");

    // Should NOT close the issue
    expect(octokit.rest.issues.update).not.toHaveBeenCalled();
    expect(octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });
});
