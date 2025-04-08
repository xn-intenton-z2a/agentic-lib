import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";

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


describe("delegateDecisionToLLMFunctionCallWrapper", () => {
  test("returns error if prompt is empty", async () => {
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper("", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("non-empty string");
    expect(result.message).toMatch(/\(type: string\)/);
  });

  test("returns error if prompt is non-string (NaN) without auto conversion", async () => {
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(NaN, {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("non-empty string");
    expect(result.message).toMatch(/\(type: number\)/);
  });

  test("returns error if API key is missing", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper("Test prompt", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
  });

  // New additional test cases for invalid prompt input types
  describe("Input validation edge cases", () => {
    test("returns error if prompt is null", async () => {
      // @ts-ignore
      const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(null, {});
      expect(result.fixed).toBe("false");
      expect(result.message).toContain("non-empty string");
      expect(result.message).toMatch(/null.*\(type: object\)/);
    });

    test("returns error if prompt is undefined", async () => {
      // @ts-ignore
      const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(undefined, {});
      expect(result.fixed).toBe("false");
      expect(result.message).toContain("non-empty string");
      expect(result.message).toMatch(/undefined.*\(type: undefined\)/);
    });

    test("returns error if prompt is a boolean (false) without auto conversion", async () => {
      // @ts-ignore
      const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(false, {});
      expect(result.fixed).toBe("false");
      expect(result.message).toContain("non-empty string");
      expect(result.message).toMatch(/false.*\(type: boolean\)/);
    });

    test("returns error if prompt is an object", async () => {
      // @ts-ignore
      const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper({ key: 'value' }, {});
      expect(result.fixed).toBe("false");
      expect(result.message).toContain("non-empty string");
      expect(result.message).toMatch(/\[object Object\].*\(type: object\)/);
    });

    test("returns error if prompt is an array", async () => {
      // @ts-ignore
      const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(["invalid"], {});
      expect(result.fixed).toBe("false");
      expect(result.message).toContain("non-empty string");
      expect(result.message).toMatch(/invalid.*\(type: object\)/);
    });
  });
});


describe("Auto Conversion of Prompt", () => {
  test("auto converts number prompt when autoConvertPrompt is true", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(123, { autoConvertPrompt: true, cache: false });
    expect(result.message).not.toContain("Invalid prompt provided");
  });

  test("auto converts boolean prompt when autoConvertPrompt is true", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(false, { autoConvertPrompt: true, cache: false });
    expect(result.message).not.toContain("Invalid prompt provided");
  });
});


describe("Caching Mechanism", () => {
  let callCount = 0;
  beforeAll(() => {
    // Reset global callCount for these tests
    globalThis.callCount = 0;
    vi.resetModules();
    vi.doMock("openai", () => {
      return {
        Configuration: (config) => config,
        OpenAIApi: class {
          async createChatCompletion() {
            // Use global callCount
            globalThis.callCount++;
            const dummyResponse = { fixed: "true", message: "cached test", refinement: "none" };
            return {
              data: {
                choices: [{ message: { content: JSON.stringify(dummyResponse) } }]
              }
            };
          }
        }
      };
    });
    // Re-import after setting the mock
    return import("../../src/lib/main.js").then(mod => { agenticLib = mod; });
  });

  test("should cache identical calls when caching is enabled", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const prompt = "Test caching prompt";
    const options = { autoConvertPrompt: true, cache: true };
    const expectedResponse = { fixed: "true", message: "cached test", refinement: "none" };
    const firstCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    const secondCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    expect(firstCall).toEqual(expectedResponse);
    expect(secondCall).toEqual(expectedResponse);
    expect(globalThis.callCount).toEqual(1);
  });

  test("should not use cache when caching is disabled", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const prompt = "Test no cache prompt";
    const options = { autoConvertPrompt: true, cache: false };
    const expectedResponse = { fixed: "true", message: "cached test", refinement: "none" };
    const firstCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    const secondCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    expect(firstCall).toEqual(expectedResponse);
    expect(secondCall).toEqual(expectedResponse);
    expect(globalThis.callCount).toBeGreaterThanOrEqual(2);
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


describe("TTL functionality", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("returns cached result if within TTL", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const prompt = "TTL test prompt";
    const options = { autoConvertPrompt: true, cache: true, ttl: 5000 };
    // Reset global callCount
    globalThis.callCount = 0;
    const expectedResponse = { fixed: "true", message: "cached test", refinement: "none" };
    const firstCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    // Advance time by 3000ms, which is within the TTL
    vi.advanceTimersByTime(3000);
    const secondCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    expect(secondCall).toEqual(expectedResponse);
    expect(globalThis.callCount).toEqual(1);
  });

  test("bypasses cache if TTL expired", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const prompt = "TTL fresh prompt";
    const options = { autoConvertPrompt: true, cache: true, ttl: 5000 };
    globalThis.callCount = 0;
    vi.doMock("openai", () => {
      return {
        Configuration: (config) => config,
        OpenAIApi: class {
          async createChatCompletion() {
            globalThis.callCount++;
            const response = globalThis.callCount === 1 ? { fixed: "true", message: "cached test", refinement: "none" } : { fixed: "true", message: "fresh test", refinement: "none" };
            return { data: { choices: [{ message: { content: JSON.stringify(response) } }] } };
          }
        }
      };
    });
    // Re-import after remocking
    await import("../../src/lib/main.js").then(mod => { agenticLib = mod; });
    const firstCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    // Advance time by 6000ms, exceeding the TTL
    vi.advanceTimersByTime(6000);
    const secondCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    expect(globalThis.callCount).toEqual(2);
    expect(secondCall).toEqual({ fixed: "true", message: "fresh test", refinement: "none" });
  });
});
