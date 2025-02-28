import { describe, test, expect, vi } from "vitest";

// Helper function to capture console output synchronously
async function captureOutputAsync(fn) {
  let output = "";
  const originalLog = console.log;
  console.log = (msg) => {
    output += msg + "\n";
  };
  try {
    await fn();
  } finally {
    console.log = originalLog;
  }
  return output;
}

// Existing test suites...

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

// [Other describe blocks for default demo output, CLI arguments handling, fancy mode, etc...]

describe("Shuffle flag", () => {
  test("should display shuffled arguments when --shuffle is provided", async () => {
    const { main } = await import("../../src/lib/main.js");
    const output = await captureOutputAsync(() => main(["--shuffle", "one", "two", "three"]));
    expect(output).toContain("Shuffled Args:");
    expect(output).toContain("one");
    expect(output).toContain("two");
    expect(output).toContain("three");
  });
});

// New test suite for the openaiChatCompletions wrapper

// Mock the OpenAI module
vi.mock("openai", () => {
  const createMock = vi.fn().mockResolvedValue("mocked response");
  return {
    default: class {
      constructor({ apiKey }) {
        this.apiKey = apiKey;
        this.chat = {
          completions: {
            create: createMock,
          },
        };
      }
    },
    __createMock: createMock,
  };
});

describe("openaiChatCompletions wrapper", () => {
  test("should call openai.chat.completions.create with provided options", async () => {
    const { openaiChatCompletions } = await import("../../src/lib/main.js");
    const { __createMock } = await import("openai");
    const options = { messages: [{ role: "user", content: "Hello" }] };
    const response = await openaiChatCompletions(options);
    expect(__createMock).toHaveBeenCalledWith(options);
    expect(response).toEqual("mocked response");
  });
});

// Additional existing tests...
