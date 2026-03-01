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
  runCopilotTask: vi.fn().mockResolvedValue({ content: "transformed code", tokensUsed: 150 }),
  readOptionalFile: vi.fn().mockReturnValue(""),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

// Use dynamic import after mocks are set up
const { transform } = await import("../../../../src/actions/agentic-step/tasks/transform.js");
const { runCopilotTask, readOptionalFile, scanDirectory } = await import(
  "../../../../src/actions/agentic-step/copilot.js"
);

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
    task: "transform",
    config: createMockConfig(),
    instructions: "",
    issueNumber: "",
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

describe("tasks/transform", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readOptionalFile.mockReturnValue("");
    scanDirectory.mockReturnValue([]);
    runCopilotTask.mockResolvedValue({ content: "transformed code", tokensUsed: 150 });
  });

  it("returns nop if no mission file found", async () => {
    readOptionalFile.mockReturnValue("");
    const ctx = createMockContext();

    const result = await transform(ctx);

    expect(result.outcome).toBe("nop");
    expect(result.details).toBe("No mission file found");
  });

  it("includes features list in the prompt", async () => {
    readOptionalFile.mockReturnValue("Build an awesome CLI tool");
    scanDirectory
      .mockReturnValueOnce([
        { name: "HTTP_SERVER.md", content: "Feature: HTTP Server for serving content" },
        { name: "CLI.md", content: "Feature: Command-line interface" },
      ])
      .mockReturnValueOnce([{ name: "main.js", content: 'console.log("hello")' }]);
    const ctx = createMockContext();

    await transform(ctx);

    expect(runCopilotTask).toHaveBeenCalledTimes(1);
    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.systemMessage).toContain("autonomous code transformation agent");
    expect(callArgs.prompt).toContain("HTTP_SERVER.md");
    expect(callArgs.prompt).toContain("CLI.md");
    expect(callArgs.prompt).toContain("Current Features (2)");
  });

  it("includes source files in the prompt", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    scanDirectory
      .mockReturnValueOnce([]) // features
      .mockReturnValueOnce([
        { name: "index.js", content: "export function main() {}" },
        { name: "utils.js", content: "export function helper() {}" },
      ]);
    const ctx = createMockContext();

    await transform(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.prompt).toContain("index.js");
    expect(callArgs.prompt).toContain("utils.js");
    expect(callArgs.prompt).toContain("Current Source Files (2)");
  });

  it("returns transformed outcome with token count on happy path", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    const ctx = createMockContext();

    const result = await transform(ctx);

    expect(result.outcome).toBe("transformed");
    expect(result.tokensUsed).toBe(150);
    expect(result.model).toBe("claude-sonnet-4");
    expect(result.details).toContain("transformed code");
  });

  it("passes writablePaths and model to runCopilotTask", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    const ctx = createMockContext();

    await transform(ctx);

    const callArgs = runCopilotTask.mock.calls[0][0];
    expect(callArgs.model).toBe("claude-sonnet-4");
    expect(callArgs.writablePaths).toEqual(["src/", "tests/"]);
  });

  it("uses TDD mode when config.tdd is true", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    const ctx = createMockContext({ config: createMockConfig({ tdd: true }) });

    const result = await transform(ctx);

    expect(result.outcome).toBe("transformed-tdd");
    // TDD creates 2 runCopilotTask calls (Phase 1 + Phase 2)
    expect(runCopilotTask).toHaveBeenCalledTimes(2);
    expect(result.tokensUsed).toBe(300); // 150 * 2 phases
  });
});
