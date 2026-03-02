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
  runCopilotTask: vi.fn().mockResolvedValue({ content: "Great question! [ACTION:nop]", tokensUsed: 110 }),
  readOptionalFile: vi.fn().mockReturnValue("mock content"),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

// Mock fs
vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, existsSync: vi.fn().mockReturnValue(true) };
});

import { discussions } from "../../../../src/actions/agentic-step/tasks/discussions.js";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../../../../src/actions/agentic-step/copilot.js";
import { existsSync } from "fs";

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
    graphql: vi.fn().mockImplementation((query) => {
      if (query.includes("addDiscussionComment")) {
        return Promise.resolve({
          addDiscussionComment: { comment: { url: "https://github.com/test-owner/test-repo/discussions/123#comment-1" } },
        });
      }
      return Promise.resolve({
        repository: {
          discussion: {
            id: "D_kwDOTest123",
            title: "Test Discussion",
            body: "Discussion body text",
            comments: {
              nodes: [{ body: "First comment", author: { login: "user1" }, createdAt: "2026-01-01T00:00:00Z" }],
            },
          },
        },
      });
    }),
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
    task: "discussions",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "",
    prNumber: "",
    writablePaths: [],
    testCommand: "npm test",
    discussionUrl: "https://github.com/test-owner/test-repo/discussions/123",
    model: "claude-sonnet-4",
    octokit: createMockOctokit(),
    repo: { owner: "test-owner", repo: "test-repo" },
    github: { runId: 12345 },
    ...overrides,
  };
}

// --- Tests ---

describe("tasks/discussions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    runCopilotTask.mockResolvedValue({ content: "Great question! [ACTION:nop]", tokensUsed: 110 });
    readOptionalFile.mockReturnValue("mock content");
    scanDirectory.mockReturnValue([{ name: "FEAT_A.md", content: "Feature A" }]);
    existsSync.mockReturnValue(true);
  });

  it("throws if discussionUrl is missing", async () => {
    const ctx = createMockContext({ discussionUrl: "" });
    await expect(discussions(ctx)).rejects.toThrow("discussions task requires discussion-url input");
  });

  it("parses URL to extract owner/repo/number and fetches via GraphQL", async () => {
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    await discussions(ctx);

    expect(octokit.graphql).toHaveBeenCalledTimes(2); // fetch + reply
    const graphqlQuery = octokit.graphql.mock.calls[0][0];
    expect(graphqlQuery).toContain("test-owner");
    expect(graphqlQuery).toContain("test-repo");
    expect(graphqlQuery).toContain("123");
    // Second call is the reply mutation
    const graphqlMutation = octokit.graphql.mock.calls[1][0];
    expect(graphqlMutation).toContain("addDiscussionComment");
  });

  it("constructs prompt with mission, features, and discussion content", async () => {
    readOptionalFile
      .mockReturnValueOnce("Build an awesome tool") // mission
      .mockReturnValueOnce("contributing guidelines") // contributing
      .mockReturnValueOnce("recent activity log"); // intention file
    scanDirectory.mockReturnValue([{ name: "HTTP.md", content: "HTTP feature" }]);
    const ctx = createMockContext();

    await discussions(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("Test Discussion");
    expect(callArgs.prompt).toContain("Discussion body text");
    expect(callArgs.prompt).toContain("First comment");
    expect(callArgs.prompt).toContain("user1");
    expect(callArgs.prompt).toContain("Build an awesome tool");
    expect(callArgs.prompt).toContain("HTTP");
    expect(callArgs.systemMessage).toContain("this repository");
  });

  it("parses ACTION:nop from response", async () => {
    runCopilotTask.mockResolvedValue({ content: "Thanks for the feedback! [ACTION:nop]", tokensUsed: 50 });
    const ctx = createMockContext();

    const result = await discussions(ctx);

    expect(result.outcome).toBe("discussion-nop");
    expect(result.action).toBe("nop");
    expect(result.actionArg).toBe("");
    expect(result.replyBody).toContain("Thanks for the feedback!");
    expect(result.tokensUsed).toBe(50);
  });

  it("parses ACTION:create-feature with argument", async () => {
    runCopilotTask.mockResolvedValue({
      content: "I will create a new feature for you. [ACTION:create-feature] WebSocket Support",
      tokensUsed: 80,
    });
    const ctx = createMockContext();

    const result = await discussions(ctx);

    expect(result.outcome).toBe("discussion-create-feature");
    expect(result.action).toBe("create-feature");
    expect(result.actionArg).toBe("WebSocket Support");
    expect(result.replyBody).toContain("I will create a new feature");
  });

  it("defaults to nop if no action tag found in response", async () => {
    runCopilotTask.mockResolvedValue({ content: "Just a plain response with no action tag", tokensUsed: 30 });
    const ctx = createMockContext();

    const result = await discussions(ctx);

    expect(result.outcome).toBe("discussion-nop");
    expect(result.action).toBe("nop");
  });

  it("posts reply comment back to the Discussion via GraphQL mutation", async () => {
    runCopilotTask.mockResolvedValue({ content: "Here is my reply! [ACTION:nop]", tokensUsed: 60 });
    const octokit = createMockOctokit();
    const ctx = createMockContext({ octokit });

    await discussions(ctx);

    // Second graphql call should be the reply mutation
    expect(octokit.graphql).toHaveBeenCalledTimes(2);
    const [mutation, variables] = octokit.graphql.mock.calls[1];
    expect(mutation).toContain("addDiscussionComment");
    expect(variables.discussionId).toBe("D_kwDOTest123");
    expect(variables.body).toContain("Here is my reply!");
  });

  it("skips reply when discussion node ID is not available", async () => {
    const octokit = createMockOctokit();
    // Override graphql to not return id for the fetch query
    octokit.graphql.mockImplementation((query) => {
      if (query.includes("addDiscussionComment")) {
        return Promise.resolve({ addDiscussionComment: { comment: { url: "mock" } } });
      }
      return Promise.resolve({
        repository: { discussion: { title: "No ID", body: "body", comments: { nodes: [] } } },
      });
    });
    const ctx = createMockContext({ octokit, discussionUrl: "https://github.com/test-owner/test-repo/discussions/456" });

    await discussions(ctx);

    // Only the fetch query should have been called, no mutation
    expect(octokit.graphql).toHaveBeenCalledTimes(1);
  });

  it("handles GraphQL failure gracefully and still calls Copilot", async () => {
    const octokit = createMockOctokit();
    octokit.graphql.mockRejectedValue(new Error("GraphQL query failed"));
    const ctx = createMockContext({ octokit });

    const result = await discussions(ctx);

    // Should still proceed and call runCopilotTask
    expect(runCopilotTask).toHaveBeenCalled();
    expect(result.outcome).toContain("discussion-");
  });

  it("still proceeds when discussion URL cannot be parsed", async () => {
    const ctx = createMockContext({ discussionUrl: "https://not-github.com/invalid/url" });

    const result = await discussions(ctx);

    // Should still proceed -- GraphQL should not be called since URL did not match
    expect(ctx.octokit.graphql).not.toHaveBeenCalled();
    expect(runCopilotTask).toHaveBeenCalled();
    expect(result.outcome).toContain("discussion-");
  });
});
