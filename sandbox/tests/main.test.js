import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";

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
let agenticLib;
beforeAll(async () => {
  agenticLib = await import("../source/main.js");
});

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../source/main.js");
    expect(mainModule).not.toBeNull();
  });
});
