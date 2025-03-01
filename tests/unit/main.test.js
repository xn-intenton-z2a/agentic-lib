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
  reviewIssue,
  appendIndexArgs,
  uniqueArgs,
  trimArgs,
  kebabCaseArgs,
  constantCaseArgs
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

// New test suite for conflicting case flags

describe("Conflicting Flags", () => {
  test("should warn when both --upper and --lower flags are provided", async () => {
    const output = await captureOutputAsync(() => main(["--upper", "--lower", "Test"]));
    expect(output).toContain("Warning: Conflicting flags --upper and --lower. No case transformation applied.");
  });
});

// Additional tests for new flags

describe("Main function flag tests", () => {
  test("should convert arguments to uppercase when only --upper is provided", async () => {
    const output = await captureOutputAsync(() => main(["--upper", "test"]));
    expect(output).toContain("Uppercase Args: [\"TEST\"]");
  });

  test("should convert arguments to lowercase when only --lower is provided", async () => {
    const output = await captureOutputAsync(() => main(["--lower", "TEST"]));
    expect(output).toContain("Lowercase Args: [\"test\"]");
  });

  test("should append exclamation mark with --append flag", async () => {
    const output = await captureOutputAsync(() => main(["--append", "hello", "world"]));
    expect(output).toContain("Appended Output: hello world!");
  });

  test("should display reversed arguments with --reverse flag", async () => {
    const output = await captureOutputAsync(() => main(["--reverse", "first", "second", "third"]));
    expect(output).toContain("Reversed Args:");
    expect(output).toContain("third");
    expect(output).toContain("first");
  });
});

// New utility function tests

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

  test("appendIndexArgs appends index to each argument", () => {
    expect(appendIndexArgs(["a", "b", "c"]).join(",")).toBe("a0,b1,c2");
  });

  test("uniqueArgs returns an array with unique elements", () => {
    expect(uniqueArgs(["a", "b", "a", "c"]).join(",")).toBe("a,b,c");
  });

  test("trimArgs trims whitespace from each argument", () => {
    expect(trimArgs([" foo ", "bar  "]).join(",")).toBe("foo,bar");
  });

  test("kebabCaseArgs converts arguments to kebab-case", () => {
    expect(kebabCaseArgs(["Hello World", "TestCase"]).join(",")).toBe("hello-world,test-case");
  });

  test("constantCaseArgs converts arguments to CONSTANT_CASE", () => {
    expect(constantCaseArgs(["Hello World", "TestCase"]).join(",")).toBe("HELLO_WORLD,TEST_CASE");
  });
});
