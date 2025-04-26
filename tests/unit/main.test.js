import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";

// Ensure that the global callCount is reset before tests that rely on it
beforeAll(() => {
  globalThis.callCount = 0;
});

// Reset callCount before each test in agenticHandler tests
beforeEach(() => {
  globalThis.callCount = 0;
});

// Clear all mocks after each test to tidy up
afterEach(() => {
  vi.clearAllMocks();
});

// Use dynamic import for the module to ensure mocks are applied correctly
let agenticLib;

// Default mock for openai used by tests that don't override it
vi.mock("openai", () => {
  return {
    Configuration: (config) => config,
    OpenAIApi: class {
      async createChatCompletion() {
        const dummyResponse = { fixed: "true", message: "dummy success", refinement: "none" };
        return {
          data: {
            choices: [{ message: { content: JSON.stringify(dummyResponse) } }]
          }
        };
      }
    }
  };
});

// Re-import the module after setting up the default mock
beforeAll(async () => {
  agenticLib = await import("../../src/lib/main.js");
});

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("digestLambdaHandler", () => {
  test("handles missing messageId by using a fallback identifier", async () => {
    const recordWithoutMessageId = {
      body: "{ invalid json"
    };
    const result = await agenticLib.digestLambdaHandler({ Records: [recordWithoutMessageId] });
    expect(result.batchItemFailures.length).toBe(1);
    expect(result.batchItemFailures[0].itemIdentifier).toMatch(/^fallback-/);
  });
});

describe("CLI Diagnostics Mode", () => {
  test("prints diagnostics information and exits immediately when --diagnostics flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await agenticLib.main(["--diagnostics"]);
    const calls = consoleSpy.mock.calls;
    let found = false;
    for (const call of calls) {
      if (typeof call[0] === "string" && call[0].includes("Diagnostics Mode:")) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
    consoleSpy.mockRestore();
  });
});

describe("CLI Version Flag", () => {
  test("outputs version information and timestamp", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await agenticLib.main(["--version"]);
    expect(consoleSpy).toHaveBeenCalled();
    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1][0];
    let output;
    try {
      output = JSON.parse(lastCall);
    } catch (e) {
      output = {};
    }
    expect(output).toHaveProperty("version");
    expect(output).toHaveProperty("timestamp");
    expect(typeof output.version).toBe("string");
    consoleSpy.mockRestore();
  });
});

describe("CLI Status Flag", () => {
  test("outputs runtime health summary on --status", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await agenticLib.main(["--status"]);
    const callArg = consoleSpy.mock.calls.find(c => {
      try {
        const parsed = JSON.parse(c[0]);
        return parsed && parsed.config && parsed.nodeVersion && typeof parsed.callCount !== 'undefined' && typeof parsed.uptime !== 'undefined';
      } catch (e) {
        return false;
      }
    });
    expect(callArg).toBeDefined();
    const output = JSON.parse(callArg[0]);
    expect(output).toHaveProperty("config");
    expect(output).toHaveProperty("nodeVersion");
    expect(output).toHaveProperty("callCount");
    expect(output).toHaveProperty("uptime");
    consoleSpy.mockRestore();
  });
});

describe("CLI Dry Run Flag", () => {
  test("prints dry-run message and exits immediately when --dry-run flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await agenticLib.main(["--dry-run"]);
    expect(consoleSpy).toHaveBeenCalledWith("Dry-run: No action taken.");
    consoleSpy.mockRestore();
  });
});

describe("CLI Simulate Error Flag", () => {
  test("logs simulated error and exits with non-zero code when --simulate-error flag is provided", async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`process.exit: ${code}`); });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(agenticLib.main(["--simulate-error"]))
      .rejects.toThrow(/process.exit: 1/);
    const loggedErrors = consoleErrorSpy.mock.calls.map(call => call[0]);
    const foundSimulatedError = loggedErrors.some(msg => msg.includes("Simulated error triggered by '--simulate-error' flag"));
    expect(foundSimulatedError).toBe(true);
    exitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});

describe("CLI Apply Fix Flag", () => {
  test("logs applied fix message and exits immediately when --apply-fix flag is provided", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await agenticLib.main(["--apply-fix"]);
    const calls = consoleSpy.mock.calls;
    let found = false;
    for (const call of calls) {
      if (typeof call[0] === 'string' && call[0].includes("Applied fix successfully")) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
    consoleSpy.mockRestore();
  });
});

// Additional tests for perf-metrics
import anything from "@src/index.js";

describe("CLI Perf Metrics Flag", () => {
  test("outputs initial perfMetrics when --perf-metrics flag is provided first", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('perf-exit'); });
    await expect(agenticLib.main(['--perf-metrics'])).rejects.toThrow('perf-exit');
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify({ agenticCommands: { count: 0, totalTimeMS: 0, minTimeMS: Infinity, maxTimeMS: 0 }, workflowChains: { count: 0, totalTimeMS: 0, minTimeMS: Infinity, maxTimeMS: 0 } }));
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
  test("metrics reflect single agentic command invocation", async () => {
    // Run one agentic command
    await agenticLib.main(["--agentic", JSON.stringify({ command: 'ping' })]);
    // Now get perf metrics
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('perf-exit'); });
    await expect(agenticLib.main(['--perf-metrics'])).rejects.toThrow('perf-exit');
    const last = consoleSpy.mock.calls[consoleSpy.mock.calls.length-1][0];
    const metrics = JSON.parse(last);
    expect(metrics.agenticCommands.count).toBe(1);
    expect(metrics.agenticCommands.totalTimeMS).toBeGreaterThanOrEqual(0);
    expect(metrics.agenticCommands.minTimeMS).toBeGreaterThanOrEqual(0);
    expect(metrics.agenticCommands.maxTimeMS).toBeGreaterThanOrEqual(0);
    consoleSpy.mockRestore(); exitSpy.mockRestore();
  });
  test("metrics reflect workflow chain invocation", async () => {
    const chainPayload = JSON.stringify({ chain: ['cmdA', 'cmdB'] });
    await agenticLib.main(["--workflow-chain", chainPayload]);
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('perf-exit'); });
    await expect(agenticLib.main(['--perf-metrics'])).rejects.toThrow('perf-exit');
    const last = consoleSpy.mock.calls[consoleSpy.mock.calls.length-1][0];
    const metrics = JSON.parse(last);
    expect(metrics.workflowChains.count).toBe(1);
    expect(metrics.workflowChains.totalTimeMS).toBeGreaterThanOrEqual(metrics.workflowChains.minTimeMS);
    consoleSpy.mockRestore(); exitSpy.mockRestore();
  });
});
