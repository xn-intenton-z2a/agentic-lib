import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs";
import * as libMain from "../../src/lib/main.js";

// Mock OpenAI for tests
vi.mock("openai", () => {
  return {
    Configuration: class {},
    OpenAIApi: class {
      async createChatCompletion() {
        return {
          data: { choices: [{ message: { content: "Mock summary" } }] }
        };
      }
    }
  };
});

// Import after mocking
import { summarizeDigest, processSummarize } from "../source/main.js";

describe("summarizeDigest", () => {
  test("returns summary from OpenAI", async () => {
    const digest = { foo: "bar" };
    const summary = await summarizeDigest(digest);
    expect(summary).toBe("Mock summary");
  });
});

describe("processSummarize", () => {
  let consoleLogSpy;
  let exitSpy;
  let logErrorSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`process.exit:${code}`); });
    logErrorSpy = vi.spyOn(libMain, "logError").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("handles inline JSON and prints summary", async () => {
    const args = ["--summarize", '{"foo":"bar"}'];
    const result = await processSummarize(args);
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith("Mock summary");
  });

  test("handles file path JSON and prints summary", async () => {
    // Mock file existence and content
    vi.spyOn(fs, "existsSync").mockReturnValue(true);
    vi.spyOn(fs, "readFileSync").mockReturnValue('{"foo":"baz"}');
    const args = ["--summarize", "dummy.json"];
    const result = await processSummarize(args);
    expect(result).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith("Mock summary");
  });

  test("errors on missing argument and exits", async () => {
    const args = ["--summarize"];
    expect(() => processSummarize(args)).rejects.toThrow("process.exit:1");
    expect(logErrorSpy).toHaveBeenCalledWith("Missing argument for --summarize");
  });

  test("errors on invalid JSON and exits", async () => {
    const args = ["--summarize", "notjson"];
    vi.spyOn(fs, "existsSync").mockReturnValue(false);
    expect(() => processSummarize(args)).rejects.toThrow("process.exit:1");
    expect(logErrorSpy).toHaveBeenCalledWith("Failed to summarize digest", expect.any(Error));
  });
});
