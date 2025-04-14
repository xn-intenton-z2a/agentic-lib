import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";

// Ensure that the global callCount is reset before tests that rely on it
beforeAll(() => {
  globalThis.callCount = 0;
});

// Reset callCount before each test in agenticHandler tests
beforeEach(() => {
  globalThis.callCount = 0;
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

describe("agenticHandler Single Command Processing", () => {
  test("processes a valid agentic command correctly", async () => {
    const payload = { command: "doSomething" };
    const response = await agenticLib.agenticHandler(payload);
    expect(response.status).toBe("success");
    expect(response.processedCommand).toBe("doSomething");
    expect(response.timestamp).toBeDefined();
    expect(response).toHaveProperty('executionTimeMS');
    expect(typeof response.executionTimeMS).toBe('number');
    expect(response.executionTimeMS).toBeGreaterThanOrEqual(0);
  });

  test("throws an error when payload is not an object", async () => {
    await expect(agenticLib.agenticHandler(null)).rejects.toThrow("Invalid payload: must be an object");
  });

  test("throws an error when payload is missing command property", async () => {
    await expect(agenticLib.agenticHandler({})).rejects.toThrow("Payload must have a 'command' property");
  });

  test("increments global invocation counter on successful command processing", async () => {
    const initialCount = globalThis.callCount;
    const payload = { command: "incrementTest" };
    await agenticLib.agenticHandler(payload);
    expect(globalThis.callCount).toBe(initialCount + 1);
  });

  test("throws an error and logs when command is non-actionable (NaN)", async () => {
    await expect(agenticLib.agenticHandler({ command: "NaN" })).rejects.toThrow(/Invalid prompt input/);
  });

  test("throws an error and logs when command is an empty string", async () => {
    await expect(agenticLib.agenticHandler({ command: "" })).rejects.toThrow(/Invalid prompt input/);
  });

  test("throws an error when command is 'nan' in lowercase", async () => {
    await expect(agenticLib.agenticHandler({ command: "nan" })).rejects.toThrow(/Invalid prompt input/);
  });
});

describe("agenticHandler Batch Processing", () => {
  test("processes a valid batch of commands correctly", async () => {
    const payload = { commands: ["command1", "command2", "command3"] };
    const response = await agenticLib.agenticHandler(payload);
    expect(response.status).toBe("success");
    expect(response.results).toHaveLength(3);
    response.results.forEach((res, i) => {
      expect(res.status).toBe("success");
      expect(res.processedCommand).toBe(`command${i+1}`);
      expect(res.timestamp).toBeDefined();
      expect(res).toHaveProperty('executionTimeMS');
      expect(typeof res.executionTimeMS).toBe('number');
      expect(res.executionTimeMS).toBeGreaterThanOrEqual(0);
    });
    expect(globalThis.callCount).toBe(3);
  });

  test("throws an error when commands is not an array", async () => {
    const payload = { commands: "not-an-array" };
    await expect(agenticLib.agenticHandler(payload)).rejects.toThrow("Payload 'commands' must be an array");
  });

  test("throws an error when one of the commands is invalid", async () => {
    const payload = { commands: ["validCommand", "", "anotherValid"] };
    await expect(agenticLib.agenticHandler(payload)).rejects.toThrow(/Invalid prompt input in commands/);
  });

  test("throws an error when one of the batch commands is ' NAn ' with spaces", async () => {
    const payload = { commands: ["command1", " NAn "] };
    await expect(agenticLib.agenticHandler(payload)).rejects.toThrow(/Invalid prompt input in commands/);
  });

  test("processes batch within MAX_BATCH_COMMANDS limit", async () => {
    process.env.MAX_BATCH_COMMANDS = "5";
    const payload = { commands: ["cmd1", "cmd2", "cmd3"] };
    const response = await agenticLib.agenticHandler(payload);
    expect(response.status).toBe("success");
    expect(response.results).toHaveLength(3);
    delete process.env.MAX_BATCH_COMMANDS;
  });

  test("throws error when batch size exceeds MAX_BATCH_COMMANDS limit", async () => {
    process.env.MAX_BATCH_COMMANDS = "2";
    const payload = { commands: ["cmd1", "cmd2", "cmd3"] };
    await expect(agenticLib.agenticHandler(payload)).rejects.toThrow(/Batch size exceeds maximum allowed/);
    delete process.env.MAX_BATCH_COMMANDS;
  });
});
