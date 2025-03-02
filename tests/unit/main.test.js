import { describe, test, expect, vi } from "vitest";
import {
  reviewIssue,
  splitArguments,
  processFlags,
  enhancedDemo,
  logEnvironmentDetails,
  showVersion,
  getIssueNumberFromBranch,
  sanitizeCommitMessage,
  main
} from "../../src/lib/main.js";

// Helper function to capture console output
function captureOutput(callback) {
  const originalLog = console.log;
  let output = "";
  console.log = (msg, ...args) => {
    output += msg + (args.length ? " " + args.join(" ") : "") + "\n";
  };
  callback();
  console.log = originalLog;
  return output;
}

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("reviewIssue", () => {
  test("reviewIssue returns correct resolution", () => {
    const params = {
      sourceFileContent: "Usage: npm run start [--usage | --help] [--version] [--env] [--reverse] [args...]",
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

describe("Utility Functions", () => {
  test("splitArguments splits flags and non-flags correctly", () => {
    const args = ["--verbose", "input.txt", "--debug", "output.txt"];
    const { flagArgs, nonFlagArgs } = splitArguments(args);
    expect(flagArgs).toEqual(["--verbose", "--debug"]);
    expect(nonFlagArgs).toEqual(["input.txt", "output.txt"]);
  });

  test("processFlags returns proper message without flags", () => {
    expect(processFlags([])).toBe("No flags to process.");
  });

  test("processFlags returns proper message with flags", () => {
    const result = processFlags(["--test", "--flag"]);
    expect(result.includes("--test")).toBe(true);
  });

  test("processFlags with --verbose flag returns verbose message", () => {
    const result = processFlags(["--verbose", "--debug"]);
    expect(result).toContain("Verbose mode enabled.");
  });

  test("processFlags with --debug flag returns debug message", () => {
    const result = processFlags(["--debug"]);
    expect(result).toContain("Debug mode enabled.");
  });

  test("enhancedDemo returns a string containing NODE_ENV and debug status", () => {
    const demoMessage = enhancedDemo();
    expect(demoMessage).toContain("Enhanced Demo:");
    expect(demoMessage).toContain("NODE_ENV:");
    expect(demoMessage).toContain("DEBUG_MODE:");
  });

  test("logEnvironmentDetails returns NODE_ENV detail", () => {
    const details = logEnvironmentDetails();
    expect(details).toMatch(/NODE_ENV:/);
  });

  test("showVersion returns a version string", () => {
    const versionStr = showVersion();
    expect(versionStr).toMatch(/^Version:/);
  });

  test("getIssueNumberFromBranch extracts issue number correctly", () => {
    expect(getIssueNumberFromBranch("agentic-lib-issue-123")).toBe(123);
    expect(getIssueNumberFromBranch("feature-agentic-lib-issue-456-more")).toBe(456);
    expect(getIssueNumberFromBranch("no-issue")).toBe(null);
  });

  test("sanitizeCommitMessage sanitizes commit messages", () => {
    const raw = "Fix bug!!! -- urgent";
    expect(sanitizeCommitMessage(raw)).toBe("Fix bug -- urgent");
  });

  test("main with --env flag prints environment variables", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      main(["--env"]);
    });
    expect(output).toContain("Environment Variables:");
  });

  test("main with --help flag prints usage and demo output", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      main(["--help"]);
    });
    expect(output).toContain("Usage: npm run start");
    expect(output).toContain("Demo: Demonstration of agentic-lib functionality:");
  });

  test("main with --reverse flag prints reversed input", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      main(["--reverse", "hello", "world"]);
    });
    // "hello world" reversed becomes "dlrow olleh"
    expect(output).toContain("Reversed input: dlrow olleh");
  });
});
