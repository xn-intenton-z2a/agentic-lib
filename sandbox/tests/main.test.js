// sandbox/tests/main.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

// Mock openai to provide Configuration and OpenAIApi for spying
vi.mock("openai", () => {
  return {
    Configuration: class {},
    OpenAIApi: class {
      constructor() {}
      async createChatCompletion() {}
    },
  };
});

import { main } from "../source/main.js";
import { OpenAIApi } from "openai";

beforeEach(() => {
  globalThis.callCount = 0;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("--agent CLI command", () => {
  test("should log parsed JSON and increment callCount on success", async () => {
    const mockResponse = {
      data: {
        choices: [
          { message: { content: JSON.stringify({ foo: "bar" }) } },
        ],
      },
    };
    vi.spyOn(OpenAIApi.prototype, "createChatCompletion").mockResolvedValue(mockResponse);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main(["--agent", "test prompt"]);

    expect(logSpy).toHaveBeenCalledWith(JSON.stringify({ foo: "bar" }));
    expect(globalThis.callCount).toBe(1);
  });

  test("should log error JSON on failure and increment callCount", async () => {
    const error = new Error("API failure");
    vi.spyOn(OpenAIApi.prototype, "createChatCompletion").mockRejectedValue(error);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await main(["--agent", "fails prompt"]);

    expect(globalThis.callCount).toBe(1);
    expect(errorSpy).toHaveBeenCalled();
    const firstCallArg = errorSpy.mock.calls[0][0];
    let parsed;
    try {
      parsed = JSON.parse(firstCallArg);
    } catch {
      parsed = null;
    }
    expect(parsed).not.toBeNull();
    expect(parsed.level).toBe("error");
    expect(parsed.message).toBe("Agent CLI failed");
    expect(parsed.error).toContain("Error: API failure");
  });
});