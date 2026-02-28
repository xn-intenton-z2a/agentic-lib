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
  runCopilotTask: vi.fn().mockResolvedValue({ content: "mock response", tokensUsed: 100 }),
  readOptionalFile: vi.fn().mockReturnValue(""),
  scanDirectory: vi.fn().mockReturnValue([]),
  formatPathsSection: vi.fn().mockReturnValue("## File Paths\n- mock"),
}));

// Mock tools.js
vi.mock("../../../../src/actions/agentic-step/tools.js", () => ({
  createAgentTools: vi.fn().mockReturnValue([]),
}));

// Mock the Copilot SDK using the exact resolved path to the nested node_modules.
// This is required because the SDK is installed at
// src/actions/agentic-step/node_modules/@github/copilot-sdk/ and vitest resolves
// vi.mock specifiers relative to the test file, not the source file.
vi.mock("../../../../src/actions/agentic-step/node_modules/@github/copilot-sdk/dist/index.js", () => {
  const sendAndWait = vi.fn().mockResolvedValue({ data: { content: "transformed code", usage: { totalTokens: 150 } } });
  const createSession = vi.fn().mockResolvedValue({ sendAndWait });
  const stop = vi.fn().mockResolvedValue(undefined);

  class MockCopilotClient {
    constructor() {}
  }
  MockCopilotClient.prototype.createSession = createSession;
  MockCopilotClient.prototype.stop = stop;
  MockCopilotClient._mockCreateSession = createSession;
  MockCopilotClient._mockSendAndWait = sendAndWait;
  MockCopilotClient._mockStop = stop;

  return {
    CopilotClient: MockCopilotClient,
    CopilotSession: vi.fn(),
    approveAll: vi.fn(),
    defineTool: vi.fn(),
  };
});

// Use dynamic import after mocks are set up
const { transform } = await import("../../../../src/actions/agentic-step/tasks/transform.js");
const { readOptionalFile, scanDirectory } = await import("../../../../src/actions/agentic-step/copilot.js");

// Access the internal mock functions via the SDK mock
const sdkModule = await import("../../../../src/actions/agentic-step/node_modules/@github/copilot-sdk/dist/index.js");
const mockCreateSession = sdkModule.CopilotClient._mockCreateSession;
const mockSendAndWait = sdkModule.CopilotClient._mockSendAndWait;
const mockStop = sdkModule.CopilotClient._mockStop;

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
    model: "claude-sonnet-4.5",
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
    mockSendAndWait.mockResolvedValue({ data: { content: "transformed code", usage: { totalTokens: 150 } } });
    mockCreateSession.mockResolvedValue({ sendAndWait: mockSendAndWait });
    mockStop.mockResolvedValue(undefined);
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

    const sessionCallArgs = mockCreateSession.mock.calls[0][0];
    expect(sessionCallArgs.systemMessage.content).toContain("autonomous code transformation agent");

    const sendCallArgs = mockSendAndWait.mock.calls[0][0];
    expect(sendCallArgs.prompt).toContain("HTTP_SERVER.md");
    expect(sendCallArgs.prompt).toContain("CLI.md");
    expect(sendCallArgs.prompt).toContain("Current Features (2)");
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

    const sendCallArgs = mockSendAndWait.mock.calls[0][0];
    expect(sendCallArgs.prompt).toContain("index.js");
    expect(sendCallArgs.prompt).toContain("utils.js");
    expect(sendCallArgs.prompt).toContain("Current Source Files (2)");
  });

  it("returns transformed outcome with token count on happy path", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    const ctx = createMockContext();

    const result = await transform(ctx);

    expect(result.outcome).toBe("transformed");
    expect(result.tokensUsed).toBe(150);
    expect(result.model).toBe("claude-sonnet-4.5");
    expect(result.details).toContain("transformed code");
  });

  it("always calls client.stop() even on success", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    const ctx = createMockContext();

    await transform(ctx);

    expect(mockStop).toHaveBeenCalledTimes(1);
  });

  it("uses TDD mode when config.tdd is true", async () => {
    readOptionalFile.mockReturnValue("Build a tool");
    const ctx = createMockContext({ config: createMockConfig({ tdd: true }) });

    const result = await transform(ctx);

    expect(result.outcome).toBe("transformed-tdd");
    // TDD creates 2 sessions (Phase 1 + Phase 2)
    expect(mockCreateSession).toHaveBeenCalledTimes(2);
    expect(result.tokensUsed).toBe(300); // 150 * 2 phases
  });
});
