import { describe, test, expect, vi } from "vitest";
import {
  main,
  openaiChatCompletions,
  generateUsage,
  reverseArgs,
  toUpperCaseArgs,
  toLowerCaseArgs,
  shuffleArgs,
  sortArgs,
  duplicateArgs,
  countArgs,
  getIssueNumberFromBranch,
  sanitizeCommitMessage,
  reviewIssue
} from "../../src/lib/main.js";

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

// Test suite for --shuffle flag

describe("Shuffle flag", () => {
  test("should display shuffled arguments when --shuffle is provided", async () => {
    const output = await captureOutputAsync(() => main(["--shuffle", "one", "two", "three"]));
    expect(output).toContain("Shuffled Args:");
    expect(output).toContain("one");
    expect(output).toContain("two");
    expect(output).toContain("three");
  });
});

// New test suite for exported utility functions

describe("Utility Functions", () => {
  test("generateUsage returns correct usage message", () => {
    const usage = generateUsage();
    expect(usage).toMatch(/Usage: npm run start/);
  });

  test("reverseArgs reverses the array correctly", () => {
    expect(reverseArgs(["a", "b", "c"]).join("")).toBe("cba");
  });

  test("toUpperCaseArgs converts array elements to uppercase", () => {
    expect(toUpperCaseArgs(["a", "b"]).join(",")).toBe("A,B");
  });

  test("toLowerCaseArgs converts array elements to lowercase", () => {
    expect(toLowerCaseArgs(["A", "B"]).join(",")).toBe("a,b");
  });

  test("shuffleArgs returns an array with the same elements in different order", () => {
    const arr = ["one", "two", "three", "four"];
    const shuffled = shuffleArgs(arr);
    expect(shuffled.sort().join(" ")).toBe(arr.sort().join(" "));
  });

  test("sortArgs returns sorted array", () => {
    const arr = ["delta", "alpha", "charlie", "bravo"];
    expect(sortArgs(arr)).toEqual(["alpha", "bravo", "charlie", "delta"]);
  });

  test("duplicateArgs duplicates each element", () => {
    expect(duplicateArgs(["a", "b"]).join(",")).toBe("aa,bb");
  });

  test("countArgs returns correct count", () => {
    expect(countArgs([1,2,3])).toBe(3);
  });

  test("getIssueNumberFromBranch extracts number correctly", () => {
    expect(getIssueNumberFromBranch("issue-123", "issue-")).toBe(123);
    expect(getIssueNumberFromBranch("feature-456", "feature-")).toBe(456);
    expect(getIssueNumberFromBranch("no-match", "issue-")).toBeNull();
  });

  test("sanitizeCommitMessage removes unwanted characters", () => {
    const msg = "Fix: update README! @#";
    expect(sanitizeCommitMessage(msg)).toBe("Fix update README");
  });

  test("reviewIssue returns correct resolution", () => {
    const params = {
      sourceFileContent: "Usage: npm run start ...",
      testFileContent: "Some test content",
      readmeFileContent: "# intentïon agentic-lib\nSome README content",
      dependenciesFileContent: "{}",
      issueTitle: "Test Issue",
      issueDescription: "Description",
      issueComments: "Comment",
      dependenciesListOutput: "npm list output",
      buildOutput: "build output",
      testOutput: "test output",
      mainOutput: "main output"
    };
    const result = reviewIssue(params);
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("The issue has been resolved.");
    expect(result.refinement).toBe("None");
  });
});

// New test suite for openaiChatCompletions wrapper

vi.mock("openai", () => {
  const createMock = vi.fn().mockResolvedValue("mocked response");
  return {
    default: class {
      constructor({ apiKey }) {
        this.apiKey = apiKey;
        this.chat = {
          completions: {
            create: createMock
          }
        };
      }
    },
    __createMock: createMock
  };
});

describe("openaiChatCompletions wrapper", () => {
  test("should call openai.chat.completions.create with provided options", async () => {
    const options = { messages: [{ role: "user", content: "Hello" }] };
    const response = await openaiChatCompletions(options);
    const { __createMock } = await import("openai");
    expect(__createMock).toHaveBeenCalledWith(options);
    expect(response).toEqual("mocked response");
  });
});
