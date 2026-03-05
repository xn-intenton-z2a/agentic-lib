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
  runCopilotTask: vi.fn().mockResolvedValue({
    content: "[ACTIONS]\nnop\n[/ACTIONS]\n[REASONING]\nNothing to do.\n[/REASONING]",
    tokensUsed: 100,
  }),
  readOptionalFile: vi.fn().mockReturnValue("mock content"),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

// Mock fs
vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, existsSync: vi.fn().mockReturnValue(false) };
});

import { supervise } from "../../../../src/actions/agentic-step/tasks/supervise.js";
import { runCopilotTask, readOptionalFile } from "../../../../src/actions/agentic-step/copilot.js";
import { existsSync } from "fs";

// --- Helpers ---

function createMockOctokit(overrides = {}) {
  return {
    rest: {
      issues: {
        listForRepo: vi.fn().mockResolvedValue({ data: [] }),
        create: vi.fn().mockResolvedValue({ data: { number: 99 } }),
        addLabels: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
      },
      pulls: {
        list: vi.fn().mockResolvedValue({ data: [] }),
      },
      actions: {
        listWorkflowRunsForRepo: vi.fn().mockResolvedValue({
          data: { workflow_runs: [] },
        }),
        createWorkflowDispatch: vi.fn().mockResolvedValue({}),
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
      library: { path: "library/", limit: 32 },
    },
    attemptsPerIssue: 2,
    attemptsPerBranch: 3,
    featureDevelopmentIssuesWipLimit: 2,
    maintenanceIssuesWipLimit: 1,
    readOnlyPaths: ["README.md"],
    writablePaths: ["src/", "tests/"],
    tdd: false,
    intentionBot: { intentionFilepath: "intenti\u00F6n.md" },
    schedule: "daily",
    supervisor: "daily",
    ...overrides,
  };
}

function createMockContext(overrides = {}) {
  return {
    task: "supervise",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "",
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

describe("tasks/supervise", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\nnop\n[/ACTIONS]\n[REASONING]\nNothing to do.\n[/REASONING]",
      tokensUsed: 100,
    });
    readOptionalFile.mockReturnValue("mock content");
    existsSync.mockReturnValue(false);
  });

  it("returns nop when LLM chooses nop", async () => {
    const ctx = createMockContext();

    const result = await supervise(ctx);

    expect(result.outcome).toBe("supervised:1-actions");
    expect(result.tokensUsed).toBe(100);
    expect(result.details).toContain("nop");
    expect(result.details).toContain("Nothing to do.");
  });

  it("returns nop outcome when no actions block found", async () => {
    runCopilotTask.mockResolvedValue({
      content: "I have no idea what to do.",
      tokensUsed: 50,
    });
    const ctx = createMockContext();

    const result = await supervise(ctx);

    expect(result.outcome).toBe("nop");
    expect(result.tokensUsed).toBe(50);
  });

  it("dispatches a workflow when LLM chooses dispatch action", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\ndispatch:agentic-lib-workflow\n[/ACTIONS]\n[REASONING]\nPick up next issue.\n[/REASONING]",
      tokensUsed: 120,
    });
    const octokit = createMockOctokit();
    octokit.rest.actions.listWorkflowRuns = vi.fn().mockResolvedValue({ data: { total_count: 0 } });
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(result.outcome).toBe("supervised:1-actions");
    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-workflow.yml",
        ref: "main",
      }),
    );
    expect(result.details).toContain("dispatched:agentic-lib-workflow.yml");
  });

  it("dispatches workflow with pr-number param", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\ndispatch:agentic-lib-workflow | pr-number: 42\n[/ACTIONS]\n[REASONING]\nFix failing PR.\n[/REASONING]",
      tokensUsed: 90,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-workflow.yml",
        ref: "main",
        inputs: { "pr-number": "42" },
      }),
    );
    expect(result.details).toContain("dispatched:agentic-lib-workflow.yml");
  });

  it("creates an issue via github:create-issue", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\ngithub:create-issue | title: Add caching layer | labels: automated, enhancement\n[/ACTIONS]\n[REASONING]\nGap in features.\n[/REASONING]",
      tokensUsed: 80,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.issues.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Add caching layer",
        labels: ["automated", "enhancement"],
      }),
    );
    expect(result.details).toContain("created-issue:#99");
  });

  it("labels an issue via github:label-issue", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\ngithub:label-issue | issue-number: 7 | labels: priority, bug\n[/ACTIONS]\n[REASONING]\nCategorise.\n[/REASONING]",
      tokensUsed: 70,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.issues.addLabels).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 7,
        labels: ["priority", "bug"],
      }),
    );
    expect(result.details).toContain("labelled-issue:#7");
  });

  it("closes an issue via github:close-issue", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\ngithub:close-issue | issue-number: 15\n[/ACTIONS]\n[REASONING]\nResolved.\n[/REASONING]",
      tokensUsed: 60,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.issues.update).toHaveBeenCalledWith(
      expect.objectContaining({
        issue_number: 15,
        state: "closed",
      }),
    );
    expect(result.details).toContain("closed-issue:#15");
  });

  it("handles multiple actions in a single response", async () => {
    runCopilotTask.mockResolvedValue({
      content: [
        "[ACTIONS]",
        "dispatch:agentic-lib-workflow | mode: dev-only | issue-number: 1",
        "dispatch:agentic-lib-workflow | mode: maintain-only",
        "github:create-issue | title: New feature | labels: automated",
        "[/ACTIONS]",
        "[REASONING]",
        "Multiple actions needed.",
        "[/REASONING]",
      ].join("\n"),
      tokensUsed: 200,
    });
    const octokit = createMockOctokit();
    octokit.rest.actions.listWorkflowRuns = vi.fn().mockResolvedValue({ data: { total_count: 0 } });
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(result.outcome).toBe("supervised:3-actions");
    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledTimes(2);
    expect(octokit.rest.issues.create).toHaveBeenCalledTimes(1);
  });

  it("skips label-issue when params are missing", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\ngithub:label-issue\n[/ACTIONS]\n[REASONING]\nTest.\n[/REASONING]",
      tokensUsed: 40,
    });
    const ctx = createMockContext();

    const result = await supervise(ctx);

    expect(result.details).toContain("skipped:label-issue-missing-params");
  });

  it("skips close-issue when issue-number is missing", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\ngithub:close-issue\n[/ACTIONS]\n[REASONING]\nTest.\n[/REASONING]",
      tokensUsed: 40,
    });
    const ctx = createMockContext();

    const result = await supervise(ctx);

    expect(result.details).toContain("skipped:close-issue-missing-number");
  });

  it("handles unknown action gracefully", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\nunknown:action\n[/ACTIONS]\n[REASONING]\nTest.\n[/REASONING]",
      tokensUsed: 40,
    });
    const ctx = createMockContext();

    const result = await supervise(ctx);

    expect(result.details).toContain("unknown:unknown:action");
  });

  it("handles action execution failure gracefully", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\ndispatch:agentic-lib-workflow\n[/ACTIONS]\n[REASONING]\nDispatch.\n[/REASONING]",
      tokensUsed: 90,
    });
    const octokit = createMockOctokit();
    octokit.rest.actions.listWorkflowRuns = vi.fn().mockResolvedValue({ data: { total_count: 0 } });
    octokit.rest.actions.createWorkflowDispatch.mockRejectedValue(new Error("API error"));
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(result.outcome).toBe("supervised:1-actions");
    expect(result.details).toContain("error:dispatch:agentic-lib-workflow:API error");
  });

  it("gathers context from issues, PRs, and workflow runs", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.listForRepo.mockResolvedValue({
      data: [
        {
          number: 1,
          title: "Test issue",
          created_at: new Date().toISOString(),
          labels: [{ name: "bug" }],
        },
      ],
    });
    octokit.rest.pulls.list.mockResolvedValue({
      data: [
        {
          number: 10,
          title: "Test PR",
          created_at: new Date().toISOString(),
          head: { ref: "feature-branch" },
          labels: [],
        },
      ],
    });
    octokit.rest.actions.listWorkflowRunsForRepo.mockResolvedValue({
      data: {
        workflow_runs: [{ name: "test", conclusion: "success", created_at: new Date().toISOString() }],
      },
    });
    const ctx = createMockContext({ octokit });

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("#1: Test issue");
    expect(callArgs.prompt).toContain("bug");
    expect(callArgs.prompt).toContain("#10: Test PR");
    expect(callArgs.prompt).toContain("feature-branch");
    expect(callArgs.prompt).toContain("test: success");
    expect(callArgs.prompt).toContain("Available Actions");
  });

  it("includes features and library in prompt when directories exist", async () => {
    existsSync.mockReturnValue(true);
    const { scanDirectory } = await import("../../../../src/actions/agentic-step/copilot.js");
    scanDirectory.mockReturnValue([{ name: "HTTP.md" }, { name: "AUTH.md" }]);
    const ctx = createMockContext();

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("HTTP");
    expect(callArgs.prompt).toContain("AUTH");
  });

  it("uses custom instructions when provided", async () => {
    const ctx = createMockContext({ instructions: "Focus on maintenance tasks only." });

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("Focus on maintenance tasks only.");
  });

  it("uses default instructions when none provided", async () => {
    const ctx = createMockContext({ instructions: "" });

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("You are the supervisor");
  });

  it("dispatches discussions bot for respond:discussions action", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\nrespond:discussions | message: Working on it | discussion-url: https://github.com/org/repo/discussions/1\n[/ACTIONS]\n[REASONING]\nRespond to user.\n[/REASONING]",
      tokensUsed: 75,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-bot.yml",
        ref: "main",
        inputs: {
          "message": "Working on it",
          "discussion-url": "https://github.com/org/repo/discussions/1",
        },
      }),
    );
    expect(result.details).toContain("respond-discussions");
  });

  it("skips respond:discussions when message is empty", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\nrespond:discussions\n[/ACTIONS]\n[REASONING]\nEmpty.\n[/REASONING]",
      tokensUsed: 30,
    });
    const ctx = createMockContext();

    const result = await supervise(ctx);

    expect(result.details).toContain("skipped:respond-no-message");
  });

  it("handles workflow runs fetch failure gracefully", async () => {
    const octokit = createMockOctokit();
    octokit.rest.actions.listWorkflowRunsForRepo.mockRejectedValue(new Error("Forbidden"));
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    // Should still succeed despite workflow runs fetch failure
    expect(result.outcome).toBeDefined();
    expect(runCopilotTask).toHaveBeenCalled();
  });

  it("passes model through to result", async () => {
    const ctx = createMockContext({ model: "claude-sonnet-4.5" });

    const result = await supervise(ctx);

    expect(result.model).toBe("claude-sonnet-4.5");
  });

  it("parses set-schedule action from ACTIONS block", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\nset-schedule:weekly\n[/ACTIONS]\n[REASONING]\nMission complete, wind down.\n[/REASONING]",
      tokensUsed: 60,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-schedule.yml",
        ref: "main",
        inputs: { frequency: "weekly" },
      }),
    );
    expect(result.details).toContain("set-schedule:weekly");
  });

  it("dispatches schedule workflow for valid frequencies", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\nset-schedule:continuous\n[/ACTIONS]\n[REASONING]\nRamp up.\n[/REASONING]",
      tokensUsed: 50,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-schedule.yml",
        inputs: { frequency: "continuous" },
      }),
    );
    expect(result.details).toContain("set-schedule:continuous");
  });

  it("skips set-schedule with invalid frequency", async () => {
    runCopilotTask.mockResolvedValue({
      content: "[ACTIONS]\nset-schedule:invalid\n[/ACTIONS]\n[REASONING]\nBad frequency.\n[/REASONING]",
      tokensUsed: 40,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).not.toHaveBeenCalled();
    expect(result.details).toContain("skipped:invalid-frequency:invalid");
  });

  it("includes set-schedule in prompt available actions", async () => {
    const ctx = createMockContext();

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("set-schedule:");
    expect(callArgs.prompt).toContain("Schedule Control");
  });

  it("forwards issue-number to transform dispatch", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\ndispatch:agentic-lib-workflow | issue-number: 7\n[/ACTIONS]\n[REASONING]\nResolve issue.\n[/REASONING]",
      tokensUsed: 100,
    });
    const octokit = createMockOctokit();
    octokit.rest.actions.listWorkflowRuns = vi.fn().mockResolvedValue({ data: { total_count: 0 } });
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-workflow.yml",
        ref: "main",
        inputs: { "issue-number": "7" },
      }),
    );
    expect(result.details).toContain("dispatched:agentic-lib-workflow.yml");
  });

  it("skips transform dispatch when transform is already running", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\ndispatch:agentic-lib-workflow | issue-number: 7\n[/ACTIONS]\n[REASONING]\nResolve issue.\n[/REASONING]",
      tokensUsed: 100,
    });
    const octokit = createMockOctokit();
    octokit.rest.actions.listWorkflowRuns = vi.fn().mockResolvedValue({ data: { total_count: 1 } });
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(result.details).toContain("skipped:workflow-already-running");
    // Should NOT have dispatched
    expect(octokit.rest.actions.createWorkflowDispatch).not.toHaveBeenCalled();
  });

  it("dispatches pr-cleanup-only workflow", async () => {
    runCopilotTask.mockResolvedValue({
      content:
        "[ACTIONS]\ndispatch:agentic-lib-workflow | mode: pr-cleanup-only\n[/ACTIONS]\n[REASONING]\nMerge ready PRs.\n[/REASONING]",
      tokensUsed: 80,
    });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    const result = await supervise(ctx);

    expect(octokit.rest.actions.createWorkflowDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        workflow_id: "agentic-lib-workflow.yml",
        ref: "main",
      }),
    );
    expect(result.details).toContain("dispatched:agentic-lib-workflow.yml");
  });

  it("includes dispatch:agentic-lib-workflow pr-cleanup in prompt available actions", async () => {
    const ctx = createMockContext();

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("dispatch:agentic-lib-workflow | mode: pr-cleanup-only");
  });

  it("includes configToml in prompt when available", async () => {
    const config = createMockConfig({ configToml: '[schedule]\nsupervisor = "daily"\n' });
    const ctx = createMockContext({ config });

    await supervise(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("### Configuration");
    expect(callArgs.prompt).toContain("[schedule]");
    expect(callArgs.prompt).toContain("supervisor");
    expect(callArgs.prompt).toContain("daily");
  });
});
