import { describe, test, expect } from "vitest";
import {
  reviewIssue,
  splitArguments,
  processFlags,
  enhancedDemo,
  logEnvironmentDetails,
  showVersion,
  getIssueNumberFromBranch,
  sanitizeCommitMessage,
} from "../../src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("reviewIssue", () => {
  test("reviewIssue returns correct resolution", () => {
    const params = {
      sourceFileContent: "Usage: npm run start [--usage|--help] [--version] [args...]",
      testFileContent: "Some test content",
      readmeFileContent: "# intentïon agentic-lib\nSome README content",
      dependenciesFileContent: "{}",
      issueTitle: "Test Issue",
      issueDescription: "Description",
      issueComments: "Comment",
      dependenciesListOutput: "npm list output",
      buildOutput: "build output",
      testOutput: "test output",
      mainOutput: "main output",
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

  test("enhancedDemo returns a string containing NODE_ENV", () => {
    const demoMessage = enhancedDemo();
    expect(demoMessage).toContain("Enhanced Demo:");
    expect(demoMessage).toContain("NODE_ENV:");
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
    expect(getIssueNumberFromBranch("issue-123")).toBe(123);
    expect(getIssueNumberFromBranch("feature-issue-456-more")).toBe(456);
    expect(getIssueNumberFromBranch("no-issue")).toBe(null);
  });

  test("sanitizeCommitMessage sanitizes commit messages", () => {
    const raw = "Fix bug!!! -- urgent";
    expect(sanitizeCommitMessage(raw)).toBe("Fix bug -- urgent");
  });
});
