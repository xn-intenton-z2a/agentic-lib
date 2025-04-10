import { describe, test, expect, vi, beforeAll } from "vitest";

// Ensure that the global callCount is reset before tests that rely on it
beforeAll(() => {
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

describe("agenticHandler", () => {
  test("processes a valid agentic command correctly", async () => {
    const payload = { command: "doSomething" };
    const response = await agenticLib.agenticHandler(payload);
    expect(response.status).toBe("success");
    expect(response.processedCommand).toBe("doSomething");
    expect(response.timestamp).toBeDefined();
  });

  test("throws an error when payload is not an object", async () => {
    await expect(agenticLib.agenticHandler(null)).rejects.toThrow("Invalid payload: must be an object");
  });

  test("throws an error when payload is missing command property", async () => {
    await expect(agenticLib.agenticHandler({})).rejects.toThrow("Payload must have a 'command' property");
  });
});
