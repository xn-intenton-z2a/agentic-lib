import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import * as agenticLib from "../../src/lib/main.js";
import { exec } from "child_process";
import util from "util";
const execPromise = util.promisify(exec);

/* eslint-disable sonarjs/unused-import */

// Helper to capture console output
function captureOutput(callback) {
  const originalLog = console.log;
  let output = "";
  console.log = (msg, ...args) => {
    output += msg + (args.length ? " " + args.join(" ") : "") + "\n";
  };
  try {
    callback();
  } catch (e) {
    console.error("Ignored error:", e.message);
  }
  console.log = originalLog;
  return output;
}

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

describe("reviewIssue", () => {
  test("returns correct resolution when conditions met", () => {
    const params = {
      sourceFileContent:
        "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [args...]",
      testFileContent: "Some test content",
      readmeFileContent: "# intentïon agentic-lib\nSome README content",
      dependenciesFileContent: "{}",
      issueTitle: "Test Issue",
      issueDescription: "Description",
      issueComments: "Comment",
      dependenciesListOutput: "npm list output",
      buildOutput: "build output",
      testOutput: "test output",
      mainOutput: "test output"
    };
    const result = agenticLib.reviewIssue(params);
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("The issue has been resolved.");
    expect(result.refinement).toBe("None");
  });

  test("returns false when conditions not met", () => {
    const params = {
      sourceFileContent: "Some other content",
      testFileContent: "Test content",
      readmeFileContent: "# Some other header",
      dependenciesFileContent: "{}",
      issueTitle: "Issue",
      issueDescription: "Description",
      issueComments: "Comment",
      dependenciesListOutput: "list output",
      buildOutput: "build output",
      testOutput: "test output",
      mainOutput: "test output"
    };
    const result = agenticLib.reviewIssue(params);
    expect(result.fixed).toBe("false");
    expect(result.message).toBe("Issue not resolved.");
  });
});

describe("splitArguments", () => {
  test("splits flags and non-flags correctly", () => {
    const args = ["--verbose", "input.txt", "--debug", "output.txt"];
    const { flagArgs, nonFlagArgs } = agenticLib.splitArguments(args);
    expect(flagArgs).toEqual(["--verbose", "--debug"]);
    expect(nonFlagArgs).toEqual(["input.txt", "output.txt"]);
  });
});

describe("processFlags", () => {
  test("returns proper message without flags", () => {
    expect(agenticLib.processFlags([])).toBe("No flags to process.");
  });
  test("returns proper message with flags", () => {
    const result = agenticLib.processFlags(["--test", "--flag"]);
    expect(result).toContain("--test");
  });
  test("with --verbose flag returns verbose message", () => {
    const result = agenticLib.processFlags(["--verbose", "--debug"]);
    expect(result).toContain("Verbose mode enabled");
  });
  test("with --debug flag returns debug message", () => {
    const result = agenticLib.processFlags(["--debug"]);
    expect(result).toContain("Debug mode enabled");
  });
});

describe("enhancedDemo", () => {
  test("returns a string containing NODE_ENV and debug status", () => {
    const demoMessage = agenticLib.enhancedDemo();
    expect(demoMessage).toContain("Enhanced Demo:");
    expect(demoMessage).toContain("NODE_ENV:");
    expect(demoMessage).toContain("DEBUG_MODE:");
  });
});

describe("logEnvironmentDetails", () => {
  test("returns NODE_ENV detail", () => {
    const details = agenticLib.logEnvironmentDetails();
    expect(details).toMatch(/NODE_ENV:/);
  });
});

describe("showVersion", () => {
  test("returns a version string", () => {
    const versionStr = agenticLib.showVersion();
    expect(versionStr).toMatch(/^Version:/);
  });
});

describe("getIssueNumberFromBranch", () => {
  test("extracts issue number correctly", () => {
    expect(agenticLib.getIssueNumberFromBranch("agentic-lib-issue-123")).toBe(123);
    expect(agenticLib.getIssueNumberFromBranch("feature-agentic-lib-issue-456-more")).toBe(456);
    expect(agenticLib.getIssueNumberFromBranch("no-issue")).toBe(null);
  });
});

describe("sanitizeCommitMessage", () => {
  test("sanitizes commit messages", () => {
    const raw = "Fix bug!!! -- urgent";
    expect(agenticLib.sanitizeCommitMessage(raw)).toBe("Fix bug -- urgent");
  });
});

describe("gatherExtraTelemetryData", () => {
  test("returns extra telemetry data with expected keys", () => {
    const extraData = agenticLib.gatherExtraTelemetryData();
    expect(extraData).toHaveProperty("npmPackageVersion");
    expect(extraData).toHaveProperty("currentTimestamp");
    expect(extraData).toHaveProperty("cpuUsage");
    expect(extraData).toHaveProperty("freeMemory");
    expect(typeof extraData.npmPackageVersion).toBe("string");
  });
});

describe("gatherGithubEnvTelemetry", () => {
  test("returns only GitHub environment variables", () => {
    process.env.GITHUB_TEST_ABC = "test_value";
    const envTelemetry = agenticLib.gatherGithubEnvTelemetry();
    expect(envTelemetry).toHaveProperty("GITHUB_TEST_ABC", "test_value");
    delete process.env.GITHUB_TEST_ABC;
  });
});

describe("Remote Service Wrappers", () => {
  test("callPackageManagementService returns error for invalid URL", async () => {
    const result = await agenticLib.callPackageManagementService("http://invalid.url");
    expect(result).toHaveProperty("error");
  });
});

describe("Kafka Messaging Functions", () => {
  test("simulateKafkaTopicRouting routes messages based on routing key", () => {
    const topics = ["orders", "payments", "orders-critical", "logs"];
    const routingKey = "orders";
    const message = "Test Message";
    const result = agenticLib.simulateKafkaTopicRouting(topics, routingKey, message);
    expect(result).toHaveProperty("orders");
    expect(result).toHaveProperty("orders-critical");
    expect(Object.keys(result)).not.toContain("payments");
    expect(Object.keys(result)).not.toContain("logs");
  });
});

describe("Run Main Execution", () => {
  test("should output usage information and exit", async () => {
    const { stdout, stderr } = await execPromise("node src/lib/main.js --help");
    expect(stdout).toContain("Usage: npm run start");
    expect(stdout).toContain("Exiting agentic‑lib.");
    expect(stderr).toBe("");
  });
});

describe("delegateDecisionToLLMAdvancedOptimized", () => {
  test("returns success object when TEST_OPENAI_SUCCESS is true", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await agenticLib.delegateDecisionToLLMAdvancedOptimized("Test prompt", { refinement: "None" });
    expect(result.fixed).toBe("true");
    process.env.TEST_OPENAI_SUCCESS = "";
  });
});

describe("delegateDecisionToLLMAdvancedEnhanced", () => {
  test("returns success object when TEST_OPENAI_SUCCESS is true", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await agenticLib.delegateDecisionToLLMAdvancedEnhanced("Test prompt", { refinement: "Enhanced", verbose: true });
    expect(result.fixed).toBe("true");
    process.env.TEST_OPENAI_SUCCESS = "";
  });
});
