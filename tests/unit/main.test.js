import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
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
  gatherAdvancedTelemetryData,
  gatherGitHubTelemetrySummary,
  gatherCustomTelemetryData,
  gatherFullSystemReport,
  simulateRealKafkaStream,
  delegateDecisionToLLM,
  delegateDecisionToLLMWrapped,
  delegateDecisionToLLMAdvanced,
  delegateDecisionToLLMAdvancedVerbose,
  delegateDecisionToLLMAdvancedStrict,
  sendMessageToKafka,
  receiveMessageFromKafka,
  logKafkaOperations,
  simulateKafkaStream,
  simulateKafkaDetailedStream,
  simulateKafkaBulkStream,
  simulateKafkaInterWorkflowCommunication,
  performAgenticHealthCheck,
  analyzeSystemPerformance,
  callRemoteService,
  callAnalyticsService,
  callNotificationService,
  callBuildStatusService,
  callDeploymentService,
  parseSarifOutput,
  parseEslintSarifOutput,
  parseVitestOutput,
  main
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

describe("splitArguments", () => {
  test("splits flags and non-flags correctly", () => {
    const args = ["--verbose", "input.txt", "--debug", "output.txt"];
    const { flagArgs, nonFlagArgs } = splitArguments(args);
    expect(flagArgs).toEqual(["--verbose", "--debug"]);
    expect(nonFlagArgs).toEqual(["input.txt", "output.txt"]);
  });
});

describe("processFlags", () => {
  test("returns proper message without flags", () => {
    expect(processFlags([])).toBe("No flags to process.");
  });
  test("returns proper message with flags", () => {
    const result = processFlags(["--test", "--flag"]);
    expect(result).toContain("--test");
  });
  test("with --verbose flag returns verbose message", () => {
    const result = processFlags(["--verbose", "--debug"]);
    expect(result).toContain("Verbose mode enabled.");
  });
  test("with --debug flag returns debug message", () => {
    const result = processFlags(["--debug"]);
    expect(result).toContain("Debug mode enabled.");
  });
});

describe("enhancedDemo", () => {
  test("returns a string containing NODE_ENV and debug status", () => {
    const demoMessage = enhancedDemo();
    expect(demoMessage).toContain("Enhanced Demo:");
    expect(demoMessage).toContain("NODE_ENV:");
    expect(demoMessage).toContain("DEBUG_MODE:");
  });
});

describe("logEnvironmentDetails", () => {
  test("returns NODE_ENV detail", () => {
    const details = logEnvironmentDetails();
    expect(details).toMatch(/NODE_ENV:/);
  });
});

describe("showVersion", () => {
  test("returns a version string", () => {
    const versionStr = showVersion();
    expect(versionStr).toMatch(/^Version:/);
  });
});

describe("getIssueNumberFromBranch", () => {
  test("extracts issue number correctly", () => {
    expect(getIssueNumberFromBranch("agentic-lib-issue-123")).toBe(123);
    expect(getIssueNumberFromBranch("feature-agentic-lib-issue-456-more")).toBe(456);
    expect(getIssueNumberFromBranch("no-issue")).toBe(null);
  });
});

describe("sanitizeCommitMessage", () => {
  test("sanitizes commit messages", () => {
    const raw = "Fix bug!!! -- urgent";
    expect(sanitizeCommitMessage(raw)).toBe("Fix bug -- urgent");
  });
});

describe("gatherTelemetryData", () => {
  test("returns telemetry details", () => {
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
});

describe("gatherExtendedTelemetryData", () => {
  test("returns extended telemetry details", () => {
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
});

describe("gatherFullTelemetryData", () => {
  test("returns full telemetry including additional keys", () => {
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
});

describe("gatherAdvancedTelemetryData", () => {
  test("returns advanced telemetry details with runtime info", () => {
    const advancedTelemetry = gatherAdvancedTelemetryData();
    expect(advancedTelemetry).toHaveProperty("nodeVersion");
    expect(advancedTelemetry).toHaveProperty("processPID");
    expect(advancedTelemetry).toHaveProperty("currentWorkingDirectory");
    expect(advancedTelemetry).toHaveProperty("platform");
    expect(advancedTelemetry).toHaveProperty("memoryUsage");
  });
});

describe("gatherGitHubTelemetrySummary", () => {
  test("returns merged telemetry data", () => {
    process.env.GITHUB_WORKFLOW = "CI Workflow";
    process.env.GITHUB_RUN_ID = "12345";
    process.env.GITHUB_RUN_NUMBER = "67";
    process.env.GITHUB_JOB = "build";
    process.env.GITHUB_ACTION = "run";
    process.env.GITHUB_ACTOR = "tester";
    process.env.GITHUB_REPOSITORY = "repo/test";
    process.env.GITHUB_EVENT_NAME = "push";
    process.env.GITHUB_REF = "refs/heads/main";
    process.env.GITHUB_SHA = "abc123";
    process.env.GITHUB_HEAD_REF = "feature-branch";
    process.env.GITHUB_BASE_REF = "main";
    process.env.NODE_ENV = "test";
    const summary = gatherGitHubTelemetrySummary();
    expect(summary.githubWorkflow).toBe("CI Workflow");
    expect(summary.githubActor).toBe("tester");
    expect(summary.githubRef).toBe("refs/heads/main");
  });
});

describe("gatherCustomTelemetryData", () => {
  test("returns custom telemetry details with system metrics", () => {
    const customTelemetry = gatherCustomTelemetryData();
    expect(customTelemetry).toHaveProperty("osUptime");
    expect(customTelemetry).toHaveProperty("loadAverages");
    expect(customTelemetry).toHaveProperty("networkInterfaces");
    expect(customTelemetry).toHaveProperty("hostname");
  });
});

describe("analyzeSystemPerformance", () => {
  test("returns system details", () => {
    const details = analyzeSystemPerformance();
    expect(details).toHaveProperty("platform");
    expect(details).toHaveProperty("cpus");
    expect(typeof details.cpus).toBe("number");
  });
});

describe("main function flags", () => {
  test("--env flag prints environment variables", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--env"]);
      } catch (error) {}
    });
    expect(output).toContain("Environment Variables:");
  });

  test("--help flag prints usage and demo output", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--help"]);
      } catch (error) {}
    });
    expect(output).toContain("Usage: npm run start");
    expect(output).toContain("Demo: Demonstration of agentic-lib functionality:");
  });

  test("--reverse flag prints reversed input", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--reverse", "hello", "world"]);
      } catch (error) {}
    });
    expect(output).toContain("Reversed input: dlrow olleh");
  });

  test("--telemetry flag prints telemetry data", () => {
    process.env.NODE_ENV = "test";
    process.env.GITHUB_WORKFLOW = "CI Test Workflow";
    const output = captureOutput(() => {
      try {
        main(["--telemetry"]);
      } catch (error) {}
    });
    expect(output).toContain("Telemetry Data:");
    expect(output).toContain("CI Test Workflow");
  });

  test("--telemetry-extended flag prints extended telemetry data", () => {
    process.env.NODE_ENV = "test";
    process.env.GITHUB_ACTOR = "extendedTester";
    const output = captureOutput(() => {
      try {
        main(["--telemetry-extended"]);
      } catch (error) {}
    });
    expect(output).toContain("Extended Telemetry Data:");
    expect(output).toContain("extendedTester");
  });

  test("--version flag prints version", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--version"]);
      } catch (error) {}
    });
    expect(output).toMatch(/^Version:/);
  });

  test("--create-issue flag simulates issue creation", () => {
    process.env.NODE_ENV = "test";
    process.env.ISSUE_BODY = "Please resolve this issue.";
    const output = captureOutput(() => {
      try {
        main(["--create-issue", "Test Issue"]);
      } catch (error) {}
    });
    expect(output).toContain("Simulated GitHub Issue Creation Workflow triggered.");
    expect(output).toContain("Simulated Issue Created:");
    expect(output).toContain("Title: Test Issue");
    expect(output).toContain("Issue Body: Please resolve this issue.");
    const match = output.match(/Issue Number: (\d+)/);
    expect(match).not.toBeNull();
  });

  test("--simulate-remote flag prints simulated remote service call", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--simulate-remote"]);
      } catch (e) {}
    });
    expect(output).toContain("Simulated remote service call initiated.");
  });

  test("--extended flag prints extended logging", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--extended"]);
      } catch (error) {}
    });
    expect(output).toContain("Extended logging activated.");
    expect(output).toContain("Detailed messages:");
  });

  test("--report flag prints combined diagnostics including advanced telemetry", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--report"]);
      } catch (error) {}
    });
    expect(output).toContain("System Performance:");
    expect(output).toContain("Telemetry Data:");
    expect(output).toContain("Extended Telemetry Data:");
    expect(output).toContain("Full Telemetry Data:");
    expect(output).toContain("Advanced Telemetry Data:");
  });

  test("--advanced flag prints advanced analytics simulation", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        main(["--advanced"]);
      } catch (error) {}
    });
    expect(output).toContain("Advanced analytics data:");
  });
});

describe("Remote Service Wrapper", () => {
  afterAll(() => {
    if (global.fetch) vi.resetAllMocks();
  });

  test("callRemoteService returns data for successful call", async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) }));
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
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(analyticsResponse) }));
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
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(notificationResponse) }));
    const data = await callNotificationService("https://notify.example.com/send", { message: "Alert" });
    expect(data).toEqual(notificationResponse);
  });

  test("callNotificationService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Notification network error")));
    const data = await callNotificationService("https://notify.example.com/send", { message: "Alert" });
    expect(data.error).toBe("Notification network error");
  });

  test("callBuildStatusService returns data for successful call", async () => {
    const statusResponse = { build: "success", duration: "5m" };
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(statusResponse) }));
    const data = await callBuildStatusService("https://ci.example.com/status");
    expect(data).toEqual(statusResponse);
  });

  test("callBuildStatusService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Build status network error")));
    const data = await callBuildStatusService("https://ci.example.com/status");
    expect(data.error).toBe("Build status network error");
  });

  test("callDeploymentService returns data for successful call", async () => {
    const deploymentResponse = { deployment: "triggered", id: "dep123" };
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(deploymentResponse) }));
    const data = await callDeploymentService("https://deploy.example.com/trigger", { version: "1.0.0" });
    expect(data).toEqual(deploymentResponse);
  });

  test("callDeploymentService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Deployment network error")));
    const data = await callDeploymentService("https://deploy.example.com/trigger", { version: "1.0.0" });
    expect(data.error).toBe("Deployment network error");
  });
});

describe("parseSarifOutput", () => {
  test("returns correct total issues for valid SARIF JSON", () => {
    const sarifSample = JSON.stringify({ runs: [{ results: [{}, {}] }, { results: [{}] }] });
    const result = parseSarifOutput(sarifSample);
    expect(result.totalIssues).toBe(3);
  });

  test("returns error property for invalid SARIF JSON", () => {
    const result = parseSarifOutput("invalid json");
    expect(result.error).toBeDefined();
  });
});

describe("parseEslintSarifOutput", () => {
  test("returns correct total issues for valid ESLint SARIF JSON", () => {
    const eslintSarif = JSON.stringify({ runs: [{ results: [{}, {}] }] });
    const result = parseEslintSarifOutput(eslintSarif);
    expect(result.totalIssues).toBe(2);
  });

  test("returns error property for invalid ESLint SARIF JSON", () => {
    const result = parseEslintSarifOutput("invalid eslint json");
    expect(result.error).toBeDefined();
  });
});

describe("parseVitestOutput", () => {
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

describe("delegateDecisionToLLMAdvanced", () => {
  test("returns simulated response when TEST_OPENAI_SUCCESS is set", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await delegateDecisionToLLMAdvanced("test prompt", { refinement: "Advanced default" });
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("LLM advanced call succeeded");
  });
});

describe("delegateDecisionToLLMAdvancedVerbose", () => {
  test("returns simulated response with verbose logging when TEST_OPENAI_SUCCESS is set", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await delegateDecisionToLLMAdvancedVerbose("test verbose", { refinement: "Verbose check" });
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("LLM advanced call succeeded");
  });
});

// New tests for delegateDecisionToLLMAdvancedStrict
describe("delegateDecisionToLLMAdvancedStrict", () => {
  test("returns simulated response when TEST_OPENAI_SUCCESS is set", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await delegateDecisionToLLMAdvancedStrict("test strict", { refinement: "Strict check", timeout: 5000 });
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("LLM advanced call succeeded");
  });

  test("returns timeout error when underlying call does not resolve in time", async () => {
    process.env.TEST_OPENAI_SUCCESS = undefined;
    // Temporarily override delegateDecisionToLLMAdvanced to simulate a hanging call
    const originalFunction = delegateDecisionToLLMAdvanced;
    const hangingFunction = () => new Promise(() => {});
    
    // Override
    delegateDecisionToLLMAdvanced = hangingFunction;
    
    const result = await delegateDecisionToLLMAdvancedStrict("test timeout", { timeout: 10 });
    expect(result.fixed).toBe("false");
    expect(result.message).toBe("LLM advanced strict call timed out");
    expect(result.refinement).toBe("Timeout exceeded");
    
    // Restore original function
    delegateDecisionToLLMAdvanced = originalFunction;
  });
});

// New Features Tests
describe("New Features", () => {
  test("simulateKafkaBulkStream returns specified count of messages", () => {
    const messages = simulateKafkaBulkStream("bulkTopic", 3);
    expect(messages.length).toBe(3);
    messages.forEach((msg, index) => {
      expect(msg).toContain(`Bulk message ${index + 1} from topic 'bulkTopic'`);
    });
  });

  test("simulateKafkaInterWorkflowCommunication returns simulation results for multiple topics", () => {
    const topics = ["topicA", "topicB"];
    const message = "Hello Workflows";
    const results = simulateKafkaInterWorkflowCommunication(topics, message);
    expect(results).toHaveProperty("topicA");
    expect(results).toHaveProperty("topicB");
    expect(results.topicA.sent).toContain(message);
    expect(results.topicB.received).toContain("Simulated message");
  });

  test("performAgenticHealthCheck returns health report with status healthy", () => {
    const report = performAgenticHealthCheck();
    expect(report).toHaveProperty("status", "healthy");
    expect(report).toHaveProperty("timestamp");
    expect(report).toHaveProperty("system");
    expect(report).toHaveProperty("telemetry");
  });

  test("gatherFullSystemReport returns combined report with all keys", () => {
    const report = gatherFullSystemReport();
    expect(report).toHaveProperty("healthCheck");
    expect(report).toHaveProperty("advancedTelemetry");
    expect(report).toHaveProperty("combinedTelemetry");
  });

  test("simulateRealKafkaStream returns messages with detailed logs", () => {
    const messages = simulateRealKafkaStream("realTopic", 2);
    expect(messages.length).toBe(2);
    messages.forEach((msg, index) => {
      expect(msg).toContain(`Real Kafka stream message ${index + 1} from topic 'realTopic'");
    });
  });
});
