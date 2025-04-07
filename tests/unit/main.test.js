import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import * as agenticLib from "../../src/lib/main.js";

beforeAll(() => {
  vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit: ${code}`);
  });
});

afterAll(() => {
  process.exit.mockRestore && process.exit.mockRestore();
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
  beforeAll(() => {
    vi.resetModules();
    vi.mock('openai', () => {
      return {
        Configuration: function(config) { return config; },
        OpenAIApi: class {
          async createChatCompletion() {
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
    // Clear cache if possible
    // @ts-ignore: Accessing internal cache
    if (agenticLib.llmCache && agenticLib.llmCache.clear) agenticLib.llmCache.clear();
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
  });
});

// Added tests for digestLambdaHandler missing messageId

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

// New tests for TTL functionality

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
    const expectedResponse = { fixed: "true", message: "cached test", refinement: "none" };
    const firstCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    // Advance time by 3000ms, which is within the TTL
    vi.advanceTimersByTime(3000);
    const secondCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    expect(secondCall).toEqual(expectedResponse);
  });

  test("bypasses cache if TTL expired", async () => {
    process.env.OPENAI_API_KEY = "dummy-api-key";
    const prompt = "TTL fresh prompt";
    const options = { autoConvertPrompt: true, cache: true, ttl: 5000 };
    let callCount = 0;
    vi.mock('openai', () => {
      return {
        Configuration: function(config) { return config; },
        OpenAIApi: class {
          async createChatCompletion() {
            callCount++;
            const response = callCount === 1 ? { fixed: "true", message: "cached test", refinement: "none" } : { fixed: "true", message: "fresh test", refinement: "none" };
            return { data: { choices: [{ message: { content: JSON.stringify(response) } }] } };
          }
        }
      };
    });
    const firstCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    // Advance time by 6000ms, exceeding the TTL
    vi.advanceTimersByTime(6000);
    const secondCall = await agenticLib.delegateDecisionToLLMFunctionCallWrapper(prompt, options);
    expect(callCount).toEqual(2);
    expect(secondCall).toEqual({ fixed: "true", message: "fresh test", refinement: "none" });
  });
});
