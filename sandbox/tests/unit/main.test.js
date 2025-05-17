import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import fs from "fs";

// Ensure that the global callCount is reset before tests that rely on it
beforeAll(() => {
  globalThis.callCount = 0;
});

// Reset callCount before each test
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
  agenticLib = await import("../../source/src/lib/main.js");
});

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../source/src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("--mission flag", () => {
  test("should print mission statement and return early", async () => {
    const fakeContent = "# Mission Statement\nExample";
    const readSpy = vi.spyOn(fs, "readFileSync").mockReturnValue(fakeContent);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await agenticLib.main(["--mission"]);
    expect(logSpy).toHaveBeenCalledWith(fakeContent);
    readSpy.mockRestore();
    logSpy.mockRestore();
  });
});