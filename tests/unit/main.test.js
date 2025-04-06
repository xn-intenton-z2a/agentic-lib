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

  test("returns error if prompt is non-string (NaN)", async () => {
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

    test("returns error if prompt is a boolean (false)", async () => {
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

describe("CLI main function", () => {
  test("prints usage and demo if --help flag provided", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    agenticLib.main(["--help", "extraArg"]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("--help"));
    logSpy.mockRestore();
  });
});

// Added tests for digestLambdaHandler missing messageId

describe("digestLambdaHandler", () => {
  test("handles missing messageId by using a fallback identifier", async () => {
    const recordWithoutMessageId = {
      body: "{ invalid json",
    };
    const result = await agenticLib.digestLambdaHandler({ Records: [recordWithoutMessageId] });
    expect(result.batchItemFailures.length).toBe(1);
    expect(result.batchItemFailures[0].itemIdentifier).toMatch(/^fallback-/);
  });
});
