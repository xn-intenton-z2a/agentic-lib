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
  runCopilotTask: vi.fn().mockResolvedValue({ content: "features updated", tokensUsed: 120 }),
  readOptionalFile: vi.fn().mockReturnValue("mock mission"),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

import { maintainFeatures } from "../../../../src/actions/agentic-step/tasks/maintain-features.js";
import { runCopilotTask, readOptionalFile, scanDirectory } from "../../../../src/actions/agentic-step/copilot.js";

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
      missionFilepath: { path: "MISSION.md" },
      contributingFilepath: { path: "CONTRIBUTING.md" },
      featuresPath: { path: "features/", permissions: ["write"], limit: 4 },
      targetSourcePath: { path: "src/" },
      targetTestsPath: { path: "tests/" },
      librarySourcesFilepath: { path: "SOURCES.md" },
      libraryDocumentsPath: { path: "library/" },
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
    task: "maintain-features",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "",
    prNumber: "",
    writablePaths: ["features/"],
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

describe("tasks/maintain-features", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readOptionalFile.mockReturnValue("mock mission content");
    scanDirectory.mockReturnValue([]);
    runCopilotTask.mockResolvedValue({ content: "features updated", tokensUsed: 120 });
  });

  it("reads mission, features, and library docs", async () => {
    scanDirectory
      .mockReturnValueOnce([{ name: "HTTP_SERVER.md", content: "HTTP feature" }]) // features
      .mockReturnValueOnce([{ name: "express-docs.md", content: "Express.js guide" }]); // library
    const ctx = createMockContext();

    await maintainFeatures(ctx);

    expect(readOptionalFile).toHaveBeenCalledWith("MISSION.md");
    expect(scanDirectory).toHaveBeenCalledWith("features/", ".md");
    expect(scanDirectory).toHaveBeenCalledWith("library/", ".md", { contentLimit: 1000 });
  });

  it("fetches closed issues from the repository", async () => {
    const octokit = createMockOctokit();
    octokit.rest.issues.listForRepo.mockResolvedValue({
      data: [
        { number: 10, title: "Closed bug fix" },
        { number: 8, title: "Old feature request" },
      ],
    });
    const ctx = createMockContext({ octokit });

    await maintainFeatures(ctx);

    expect(octokit.rest.issues.listForRepo).toHaveBeenCalledWith(
      expect.objectContaining({ state: "closed", per_page: 20 }),
    );
  });

  it("includes feature count and limit in the prompt", async () => {
    scanDirectory
      .mockReturnValueOnce([
        { name: "FEAT_A.md", content: "Feature A" },
        { name: "FEAT_B.md", content: "Feature B" },
      ]) // features
      .mockReturnValueOnce([]); // library
    const ctx = createMockContext();

    await maintainFeatures(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("Current Features (2/4 max)");
    expect(callArgs.prompt).toContain("Maximum 4 feature files");
  });

  it("returns features-maintained outcome with correct details", async () => {
    scanDirectory
      .mockReturnValueOnce([
        { name: "F1.md", content: "feat 1" },
        { name: "F2.md", content: "feat 2" },
        { name: "F3.md", content: "feat 3" },
      ])
      .mockReturnValueOnce([]);
    const ctx = createMockContext();

    const result = await maintainFeatures(ctx);

    expect(result.outcome).toBe("features-maintained");
    expect(result.tokensUsed).toBe(120);
    expect(result.model).toBe("claude-sonnet-4");
    expect(result.details).toContain("3 existing");
    expect(result.details).toContain("limit 4");
  });
});
