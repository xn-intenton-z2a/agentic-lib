import { describe, test, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import {
  reviewIssue,
  splitArguments,
  processFlags,
  enhancedDemo,
  logEnvironmentDetails,
  showVersion,
  getIssueNumberFromBranch,
  sanitizeCommitMessage,
  gatherTelemetryData,
  gatherExtendedTelemetryData,
  gatherFullTelemetryData,
  delegateDecisionToLLM,
  delegateDecisionToLLMWrapped,
  sendMessageToKafka,
  receiveMessageFromKafka,
  logKafkaOperations,
  simulateKafkaStream,
  simulateKafkaDetailedStream,
  analyzeSystemPerformance,
  callRemoteService,
  callAnalyticsService,
  callNotificationService,
  parseSarifOutput,
  parseEslintSarifOutput,
  parseVitestOutput,
  main,
  generateUsage
} from "../../src/lib/main.js";

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

// Prevent process.exit from terminating tests
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
    const result = reviewIssue(params);
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
    const result = reviewIssue(params);
    expect(result.fixed).toBe("false");
    expect(result.message).toBe("Issue not resolved.");
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
    expect(result).toContain("--test");
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

  test("gatherTelemetryData returns telemetry details", () => {
    process.env.GITHUB_WORKFLOW = "CI Workflow";
    process.env.GITHUB_RUN_ID = "12345";
    process.env.GITHUB_RUN_NUMBER = "67";
    process.env.GITHUB_JOB = "build";
    process.env.GITHUB_ACTION = "run";
    process.env.NODE_ENV = "test";

    const telemetry = gatherTelemetryData();
    expect(telemetry.githubWorkflow).toBe("CI Workflow");
    expect(telemetry.githubRunId).toBe("12345");
    expect(telemetry.githubRunNumber).toBe("67");
    expect(telemetry.githubJob).toBe("build");
    expect(telemetry.githubAction).toBe("run");
    expect(telemetry.nodeEnv).toBe("test");
  });

  test("gatherExtendedTelemetryData returns extended telemetry details", () => {
    process.env.GITHUB_WORKFLOW = "CI Workflow";
    process.env.GITHUB_RUN_ID = "12345";
    process.env.GITHUB_RUN_NUMBER = "67";
    process.env.GITHUB_JOB = "build";
    process.env.GITHUB_ACTION = "run";
    process.env.GITHUB_ACTOR = "tester";
    process.env.GITHUB_REPOSITORY = "repo/test";
    process.env.GITHUB_EVENT_NAME = "push";
    process.env.CI = "true";
    process.env.NODE_ENV = "test";

    const extendedTelemetry = gatherExtendedTelemetryData();
    expect(extendedTelemetry.githubWorkflow).toBe("CI Workflow");
    expect(extendedTelemetry.githubActor).toBe("tester");
    expect(extendedTelemetry.githubRepository).toBe("repo/test");
    expect(extendedTelemetry.githubEventName).toBe("push");
    expect(extendedTelemetry.ci).toBe("true");
  });

  test("gatherFullTelemetryData returns full telemetry including additional keys", () => {
    process.env.GITHUB_REF = "refs/heads/main";
    process.env.GITHUB_SHA = "abc123";
    process.env.GITHUB_HEAD_REF = "feature-branch";
    process.env.GITHUB_BASE_REF = "main";
    process.env.GITHUB_WORKFLOW = "CI Workflow";
    process.env.GITHUB_RUN_ID = "12345";
    process.env.GITHUB_RUN_NUMBER = "67";
    process.env.GITHUB_JOB = "build";
    process.env.GITHUB_ACTION = "run";
    process.env.GITHUB_ACTOR = "tester";
    process.env.GITHUB_REPOSITORY = "repo/test";
    process.env.GITHUB_EVENT_NAME = "push";
    process.env.CI = "true";
    process.env.NODE_ENV = "test";

    const fullTelemetry = gatherFullTelemetryData();
    expect(fullTelemetry.githubRef).toBe("refs/heads/main");
    expect(fullTelemetry.githubSha).toBe("abc123");
    expect(fullTelemetry.githubHeadRef).toBe("feature-branch");
    expect(fullTelemetry.githubBaseRef).toBe("main");
  });

  test("analyzeSystemPerformance returns system details", () => {
    const details = analyzeSystemPerformance();
    expect(details).toHaveProperty("platform");
    expect(details).toHaveProperty("cpus");
    expect(typeof details.cpus).toBe("number");
  });

  test("main with --env flag prints environment variables", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--env"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Environment Variables:");
  });

  test("main with --help flag prints usage and demo output", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--help"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Usage: npm run start");
    expect(output).toContain("Demo: Demonstration of agentic-lib functionality:");
  });

  test("main with --reverse flag prints reversed input", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--reverse", "hello", "world"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Reversed input: dlrow olleh");
  });

  test("main with --telemetry flag prints telemetry data", () => {
    process.env.NODE_ENV = "test";
    process.env.GITHUB_WORKFLOW = "CI Test Workflow";
    const output = captureOutput(() => {
      try {
        main(["--telemetry"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Telemetry Data:");
    expect(output).toContain("CI Test Workflow");
  });

  test("main with --telemetry-extended flag prints extended telemetry data", () => {
    process.env.NODE_ENV = "test";
    process.env.GITHUB_ACTOR = "extendedTester";
    const output = captureOutput(() => {
      try {
        main(["--telemetry-extended"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Extended Telemetry Data:");
    expect(output).toContain("extendedTester");
  });

  test("main with --version flag prints version", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--version"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toMatch(/^Version:/);
  });

  test("main with --create-issue flag simulates issue creation", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--create-issue", "Test Issue"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Simulated Issue Created:");
    expect(output).toContain("Title: Test Issue");
    const match = output.match(/Issue Number: (\d+)/);
    expect(match).not.toBeNull();
  });

  test("main with --simulate-remote flag prints simulated remote service call", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--simulate-remote"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Simulated remote service call initiated.");
  });

  test("logKafkaOperations logs Kafka send and receive operations", () => {
    const result = logKafkaOperations("testTopic", "Test Kafka Message");
    expect(result.sendResult).toBe("Message sent to topic 'testTopic': Test Kafka Message");
    expect(result.receiveResult).toBe("Simulated message from topic 'testTopic'");
  });

  test("simulateKafkaStream returns an array of simulated messages", () => {
    const messages = simulateKafkaStream("streamTopic", 2);
    expect(messages.length).toBe(2);
    expect(messages[0]).toContain("Streamed message 1 from topic 'streamTopic'");
    expect(messages[1]).toContain("Streamed message 2 from topic 'streamTopic'");
  });

  test("simulateKafkaDetailedStream returns an array of detailed simulated messages", () => {
    const messages = simulateKafkaDetailedStream("detailedTopic", 2);
    expect(messages.length).toBe(2);
    expect(messages[0]).toContain("(detailed)");
  });

  test("delegateDecisionToLLM returns fallback message in test environment", async () => {
    const response = await delegateDecisionToLLM("Should I deploy now?");
    expect(response).toBe("LLM decision could not be retrieved.");
  });

  test("delegateDecisionToLLMWrapped returns fallback object in test environment", async () => {
    const response = await delegateDecisionToLLMWrapped("Should I deploy now?");
    expect(response.fixed).toBe("false");
    expect(response.message).toBe("LLM decision could not be retrieved.");
    expect(response.refinement).toBe("None");
  });

  test("sendMessageToKafka simulates sending message", () => {
    const result = sendMessageToKafka("testTopic", "Hello Kafka");
    expect(result).toBe("Message sent to topic 'testTopic': Hello Kafka");
  });

  test("receiveMessageFromKafka simulates receiving message", () => {
    const result = receiveMessageFromKafka("testTopic");
    expect(result).toBe("Simulated message from topic 'testTopic'");
  });

  describe("Remote Service Wrapper", () => {
    afterEach(() => {
      if (global.fetch) vi.resetAllMocks();
    });

    test("callRemoteService returns data for successful call", async () => {
      global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ success: true }) }));
      const data = await callRemoteService("https://dummyapi.io/data");
      expect(data).toEqual({ success: true });
    });

    test("callRemoteService returns error on failed call", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
      const data = await callRemoteService("https://dummyapi.io/data");
      expect(data.error).toBe("Network error");
    });

    test("callAnalyticsService returns data for successful call", async () => {
      const analyticsResponse = { event: "click", status: "recorded" };
      global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(analyticsResponse) }));
      const data = await callAnalyticsService("https://analytics.example.com/record", { event: "click" });
      expect(data).toEqual(analyticsResponse);
    });

    test("callAnalyticsService returns error on failed call", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Analytics network error")));
      const data = await callAnalyticsService("https://analytics.example.com/record", { event: "click" });
      expect(data.error).toBe("Analytics network error");
    });

    test("callNotificationService returns data for successful call", async () => {
      const notificationResponse = { status: "sent" };
      global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(notificationResponse) }));
      const data = await callNotificationService("https://notify.example.com/send", { message: "Alert" });
      expect(data).toEqual(notificationResponse);
    });

    test("callNotificationService returns error on failed call", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Notification network error")));
      const data = await callNotificationService("https://notify.example.com/send", { message: "Alert" });
      expect(data.error).toBe("Notification network error");
    });
  });

  test("generateUsage returns proper usage string", () => {
    expect(generateUsage()).toContain("Usage: npm run start");
  });

  describe("parseSarifOutput Function", () => {
    test("returns correct total issues for valid SARIF JSON", () => {
      const sarifSample = JSON.stringify({
        runs: [{ results: [{}, {}] }, { results: [{}] }],
      });
      const result = parseSarifOutput(sarifSample);
      expect(result.totalIssues).toBe(3);
    });

    test("returns error property for invalid SARIF JSON", () => {
      const result = parseSarifOutput("invalid json");
      expect(result.error).toBeDefined();
    });

    test("main with --sarif flag processes SARIF JSON", () => {
      process.env.NODE_ENV = "test";
      const sarifJSON = JSON.stringify({ runs: [{ results: [{}, {}] }] });
      const output = captureOutput(() => {
        try {
          main(["--sarif", sarifJSON]);
        } catch (e) {
          console.error("Caught error:", e.message);
        }
      });
      expect(output).toContain("SARIF Report: Total issues: 2");
    });
  });

  describe("parseEslintSarifOutput Function", () => {
    test("returns correct total issues for valid ESLint SARIF JSON", () => {
      const eslintSarif = JSON.stringify({
        runs: [{ results: [{}, {}] }],
      });
      const result = parseEslintSarifOutput(eslintSarif);
      expect(result.totalIssues).toBe(2);
    });

    test("returns error property for invalid ESLint SARIF JSON", () => {
      const result = parseEslintSarifOutput("invalid eslint json");
      expect(result.error).toBeDefined();
    });
  });

  describe("parseVitestOutput Function", () => {
    test("returns correct testsPassed count when summary is present", () => {
      const sampleOutput = "Some log info\n5 tests passed\nMore info";
      const result = parseVitestOutput(sampleOutput);
      expect(result.testsPassed).toBe(5);
    });

    test("returns error when test summary is missing", () => {
      const sampleOutput = "No summary here";
      const result = parseVitestOutput(sampleOutput);
      expect(result.error).toBeDefined();
    });
  });

  test("main with --extended flag prints extended logging", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--extended"]);
      } catch (error) {
        console.error("Caught error:", error.message);
      }
    });
    expect(output).toContain("Extended logging activated.");
    expect(output).toContain("Detailed messages:");
  });
});
