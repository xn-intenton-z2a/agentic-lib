import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import * as agenticLib from "../../src/lib/main.js";

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

describe("Telemetry Functions", () => {
  test("gatherTelemetryData returns telemetry details", () => {
    process.env.GITHUB_WORKFLOW = "CI Workflow";
    process.env.GITHUB_RUN_ID = "12345";
    process.env.GITHUB_RUN_NUMBER = "67";
    process.env.GITHUB_JOB = "build";
    process.env.GITHUB_ACTION = "run";
    process.env.NODE_ENV = "test";
    const telemetry = agenticLib.gatherTelemetryData();
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
    const extendedTelemetry = agenticLib.gatherExtendedTelemetryData();
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
    const fullTelemetry = agenticLib.gatherFullTelemetryData();
    expect(fullTelemetry.githubRef).toBe("refs/heads/main");
    expect(fullTelemetry.githubSha).toBe("abc123");
    expect(fullTelemetry.githubHeadRef).toBe("feature-branch");
    expect(fullTelemetry.githubBaseRef).toBe("main");
  });
  
  test("gatherAdvancedTelemetryData returns advanced telemetry details with runtime info", () => {
    const advancedTelemetry = agenticLib.gatherAdvancedTelemetryData();
    expect(advancedTelemetry).toHaveProperty("nodeVersion");
    expect(advancedTelemetry).toHaveProperty("processPID");
    expect(advancedTelemetry).toHaveProperty("currentWorkingDirectory");
    expect(advancedTelemetry).toHaveProperty("platform");
    expect(advancedTelemetry).toHaveProperty("memoryUsage");
  });
  
  test("gatherGitHubTelemetrySummary returns merged telemetry data", () => {
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
    const summary = agenticLib.gatherGitHubTelemetrySummary();
    expect(summary.githubWorkflow).toBe("CI Workflow");
    expect(summary.githubActor).toBe("tester");
    expect(summary.githubRef).toBe("refs/heads/main");
  });
  
  test("gatherCustomTelemetryData returns custom telemetry details with system metrics", () => {
    const customTelemetry = agenticLib.gatherCustomTelemetryData();
    expect(customTelemetry).toHaveProperty("osUptime");
    expect(customTelemetry).toHaveProperty("loadAverages");
    expect(customTelemetry).toHaveProperty("networkInterfaces");
    expect(customTelemetry).toHaveProperty("hostname");
  });
  
  test("gatherWorkflowTelemetryData returns workflow telemetry details", () => {
    process.env.GITHUB_RUN_ATTEMPT = "3";
    process.env.GITHUB_EVENT = "push";
    process.env.GITHUB_RUN_STARTED_AT = "2025-03-06T16:00:00Z";
    const workflowTelemetry = agenticLib.gatherWorkflowTelemetryData();
    expect(workflowTelemetry.githubRunAttempt).toBe("3");
    expect(workflowTelemetry.githubWorkflowEvent).toBe("push");
    expect(workflowTelemetry.githubRunStartedAt).toBe("2025-03-06T16:00:00Z");
  });
});

describe("analyzeSystemPerformance", () => {
  test("returns system details", () => {
    const details = agenticLib.analyzeSystemPerformance();
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
        agenticLib.main(["--env"]);
      } catch (error) {}
    });
    expect(output).toContain("Environment Variables:");
  });

  test("--help flag prints usage and demo output", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--help"]);
      } catch (error) {}
    });
    expect(output).toContain("Usage: npm run start");
    expect(output).toContain("Demo: Demonstration of agentic‐lib functionality:");
  });

  test("--reverse flag prints reversed input", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--reverse", "hello", "world"]);
      } catch (error) {}
    });
    expect(output).toContain("Reversed input: dlrow olleh");
  });

  test("--telemetry flag prints telemetry data", () => {
    process.env.NODE_ENV = "test";
    process.env.GITHUB_WORKFLOW = "CI Test Workflow";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--telemetry"]);
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
        agenticLib.main(["--telemetry-extended"]);
      } catch (error) {}
    });
    expect(output).toContain("Extended Telemetry Data:");
    expect(output).toContain("extendedTester");
  });

  test("--version flag prints version", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--version"]);
      } catch (error) {}
    });
    expect(output).toMatch(/^Version:/);
  });

  test("--create-issue flag simulates issue creation", () => {
    process.env.NODE_ENV = "test";
    process.env.ISSUE_BODY = "Please resolve this issue.";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--create-issue", "Test Issue"]);
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
        agenticLib.main(["--simulate-remote"]);
      } catch (e) {}
    });
    expect(output).toContain("Simulated remote service call initiated.");
  });

  test("--extended flag prints extended logging", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--extended"]);
      } catch (error) {}
    });
    expect(output).toContain("Extended logging activated.");
    expect(output).toContain("Detailed messages:");
  });

  test("--report flag prints combined diagnostics including advanced telemetry", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--report"]);
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
        agenticLib.main(["--advanced"]);
      } catch (error) {}
    });
    expect(output).toContain("Advanced analytics data:");
  });

  test("--analytics flag triggers simulated analytics call", () => {
    process.env.NODE_ENV = "test";
    const output = captureOutput(() => {
      try {
        agenticLib.main(["--analytics"]);
      } catch (error) {}
    });
    expect(output).toContain("Simulated analytics service call initiated.");
  });
});

describe("Remote Service Wrapper", () => {
  afterAll(() => {
    if (global.fetch) vi.resetAllMocks();
  });

  test("callRemoteService returns data for successful call", async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) }));
    const data = await agenticLib.callRemoteService("https://dummyapi.io/data");
    expect(data).toEqual({ success: true });
  });

  test("callRemoteService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));
    const data = await agenticLib.callRemoteService("https://dummyapi.io/data");
    expect(data.error).toBe("Network error");
  });

  test("callAnalyticsService returns data for successful call", async () => {
    const analyticsResponse = { event: "click", status: "recorded" };
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(analyticsResponse) }));
    const data = await agenticLib.callAnalyticsService("https://analytics.example.com/record", { event: "click" });
    expect(data).toEqual(analyticsResponse);
  });

  test("callAnalyticsService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Analytics network error")));
    const data = await agenticLib.callAnalyticsService("https://analytics.example.com/record", { event: "click" });
    expect(data.error).toBe("Analytics network error");
  });

  test("callNotificationService returns data for successful call", async () => {
    const notificationResponse = { status: "sent" };
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(notificationResponse) }));
    const data = await agenticLib.callNotificationService("https://notify.example.com/send", { message: "Alert" });
    expect(data).toEqual(notificationResponse);
  });

  test("callNotificationService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Notification network error")));
    const data = await agenticLib.callNotificationService("https://notify.example.com/send", { message: "Alert" });
    expect(data.error).toBe("Notification network error");
  });

  test("callBuildStatusService returns data for successful call", async () => {
    const statusResponse = { build: "success", duration: "5m" };
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(statusResponse) }));
    const data = await agenticLib.callBuildStatusService("https://ci.example.com/status");
    expect(data).toEqual(statusResponse);
  });

  test("callBuildStatusService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Build status network error")));
    const data = await agenticLib.callBuildStatusService("https://ci.example.com/status");
    expect(data.error).toBe("Build status network error");
  });

  test("callDeploymentService returns data for successful call", async () => {
    const deploymentResponse = { deployment: "triggered", id: "dep123" };
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(deploymentResponse) }));
    const data = await agenticLib.callDeploymentService("https://deploy.example.com/trigger", { version: "1.0.0" });
    expect(data).toEqual(deploymentResponse);
  });

  test("callDeploymentService returns error on failed call", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Deployment network error")));
    const data = await agenticLib.callDeploymentService("https://deploy.example.com/trigger", { version: "1.0.0" });
    expect(data.error).toBe("Deployment network error");
  });

  describe("Repository Service Wrapper", () => {
    test("callRepositoryService returns data for successful call", async () => {
      const repoResponse = { repo: "test-repo", stars: 100 };
      global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(repoResponse) }));
      const data = await agenticLib.callRepositoryService("https://api.example.com/repo");
      expect(data).toEqual(repoResponse);
    });
    test("callRepositoryService returns error on failed call", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Repository network error")));
      const data = await agenticLib.callRepositoryService("https://api.example.com/repo");
      expect(data.error).toBe("Repository network error");
    });
  });

  describe("Logging Service Wrapper", () => {
    test("callLoggingService returns data for successful call", async () => {
      const logResponse = { status: "logged" };
      global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(logResponse) }));
      const data = await agenticLib.callLoggingService("https://log.example.com/record", { message: "Log event" });
      expect(data).toEqual(logResponse);
    });
    test("callLoggingService returns error on failed call", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Logging network error")));
      const data = await agenticLib.callLoggingService("https://log.example.com/record", { message: "Log event" });
      expect(data.error).toBe("Logging network error");
    });
  });

  describe("Code Quality Service Wrapper", () => {
    test("callCodeQualityService returns data for successful call", async () => {
      const qualityResponse = { quality: "excellent", score: 95 };
      global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(qualityResponse) }));
      const data = await agenticLib.callCodeQualityService("https://quality.example.com/metrics", { repo: "test-repo" });
      expect(data).toEqual(qualityResponse);
    });
    test("callCodeQualityService returns error on failed call", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Code quality network error")));
      const data = await agenticLib.callCodeQualityService("https://quality.example.com/metrics", { repo: "test-repo" });
      expect(data.error).toBe("Code quality network error");
    });
  });
});

describe("parseSarifOutput", () => {
  test("returns correct total issues for valid SARIF JSON", () => {
    const sarifSample = JSON.stringify({ runs: [{ results: [{}, {}] }, { results: [{}] }] });
    const result = agenticLib.parseSarifOutput(sarifSample);
    expect(result.totalIssues).toBe(3);
  });

  test("returns error property for invalid SARIF JSON", () => {
    const result = agenticLib.parseSarifOutput("invalid json");
    expect(result.error).toBeDefined();
  });
});

describe("parseEslintSarifOutput", () => {
  test("returns correct total issues for valid ESLint SARIF JSON", () => {
    const eslintSarif = JSON.stringify({ runs: [{ results: [{}, {}] }] });
    const result = agenticLib.parseEslintSarifOutput(eslintSarif);
    expect(result.totalIssues).toBe(2);
  });

  test("returns error property for invalid ESLint SARIF JSON", () => {
    const result = agenticLib.parseEslintSarifOutput("invalid eslint json");
    expect(result.error).toBeDefined();
  });
});

describe("parseVitestOutput", () => {
  test("returns correct testsPassed count when summary is present", () => {
    const sampleOutput = "Some log info\n5 tests passed\nMore info";
    const result = agenticLib.parseVitestOutput(sampleOutput);
    expect(result.testsPassed).toBe(5);
  });

  test("returns error when test summary is missing", () => {
    const sampleOutput = "No summary here";
    const result = agenticLib.parseVitestOutput(sampleOutput);
    expect(result.error).toBeDefined();
  });
});

describe("parseVitestSarifOutput", () => {
  test("returns test summaries array for valid vitest SARIF JSON", () => {
    const sampleSarif = JSON.stringify({ runs: [{ results: [ { message: { text: "Test case passed" } }, { message: { text: "Test case failed" } } ] }] });
    const result = agenticLib.parseVitestSarifOutput(sampleSarif);
    expect(result.testSummaries).toEqual(["Test case passed", "Test case failed"]);
  });
  test("returns error property for invalid vitest SARIF JSON", () => {
    const result = agenticLib.parseVitestSarifOutput("invalid vitest json");
    expect(result.error).toBeDefined();
  });
});

describe("parseEslintDetailedOutput", () => {
  test("returns detailed issues for valid ESLint SARIF JSON", () => {
    const sampleSarif = JSON.stringify({ runs: [{ results: [ { ruleId: "no-unused-vars", message: { text: "Unused variable" } }, { ruleId: "no-extra-semi", message: { text: "Unnecessary semicolon" } } ] }] });
    const result = agenticLib.parseEslintDetailedOutput(sampleSarif);
    expect(result.eslintIssues).toEqual([
      { ruleId: "no-unused-vars", message: "Unused variable" },
      { ruleId: "no-extra-semi", message: "Unnecessary semicolon" }
    ]);
  });
  test("returns error property for invalid ESLint SARIF JSON", () => {
    const result = agenticLib.parseEslintDetailedOutput("invalid eslint json");
    expect(result.error).toBeDefined();
  });
});

describe("delegateDecisionToLLMAdvancedVerbose", () => {
  test("returns simulated response with verbose logging when TEST_OPENAI_SUCCESS is set", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await agenticLib.delegateDecisionToLLMAdvancedVerbose("test verbose", { refinement: "Verbose check" });
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("LLM advanced call succeeded");
    expect(result.refinement).toBe("Verbose check");
  });
});

describe("delegateDecisionToLLMAdvancedStrict", () => {
  test("returns simulated response when TEST_OPENAI_SUCCESS is set", async () => {
    process.env.TEST_OPENAI_SUCCESS = "true";
    const result = await agenticLib.delegateDecisionToLLMAdvancedStrict("test strict", { refinement: "Strict check", timeout: 5000 });
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("LLM advanced call succeeded");
  });

  test("returns timeout error when underlying call does not resolve in time", async () => {
    delete process.env.TEST_OPENAI_SUCCESS;
    const spy = vi.spyOn(agenticLib, 'delegateDecisionToLLMAdvanced').mockImplementation(() => new Promise(() => {}));
    const result = await agenticLib.delegateDecisionToLLMAdvancedStrict("test timeout", { timeout: 10, refinement: "Strict check" });
    expect(result.fixed).toBe("false");
    expect(result.message).toBe("LLM advanced strict call timed out");
    expect(result.refinement).toBe("Timeout exceeded");
    spy.mockRestore();
  });
});

describe("New Features", () => {
  test("simulateKafkaBulkStream returns specified count of messages", () => {
    const messages = agenticLib.simulateKafkaBulkStream("bulkTopic", 3);
    expect(messages.length).toBe(3);
    messages.forEach((msg, index) => {
      expect(msg).toContain(`Bulk message ${index + 1} from topic 'bulkTopic'`);
    });
  });

  test("simulateKafkaInterWorkflowCommunication returns simulation results for multiple topics", () => {
    const topics = ["topicA", "topicB"];
    const message = "Hello Workflows";
    const results = agenticLib.simulateKafkaInterWorkflowCommunication(topics, message);
    expect(results).toHaveProperty("topicA");
    expect(results).toHaveProperty("topicB");
    expect(results.topicA.sent).toContain(message);
    expect(results.topicB.received).toContain("Simulated message");
  });

  test("performAgenticHealthCheck returns health report with status healthy", () => {
    const report = agenticLib.performAgenticHealthCheck();
    expect(report).toHaveProperty("status", "healthy");
    expect(report).toHaveProperty("timestamp");
    expect(report).toHaveProperty("system");
    expect(report).toHaveProperty("telemetry");
  });

  test("gatherFullSystemReport returns combined report with all keys", () => {
    const report = agenticLib.gatherFullSystemReport();
    expect(report).toHaveProperty("healthCheck");
    expect(report).toHaveProperty("advancedTelemetry");
    expect(report).toHaveProperty("combinedTelemetry");
  });

  test("simulateRealKafkaStream returns messages with detailed logs", () => {
    const messages = agenticLib.simulateRealKafkaStream("realTopic", 2);
    expect(messages.length).toBe(2);
    messages.forEach((msg, index) => {
      expect(msg).toContain(`Real Kafka stream message ${index + 1} from topic 'realTopic'`);
    });
  });

  describe("Kafka Producer/Consumer", () => {
    test("simulateKafkaProducer returns the produced messages", () => {
      const messages = ["msg1", "msg2", "msg3"];
      const result = agenticLib.simulateKafkaProducer("producerTopic", messages);
      expect(result.topic).toBe("producerTopic");
      expect(result.producedMessages).toEqual(messages);
    });

    test("simulateKafkaConsumer returns the correct number of consumed messages", () => {
      const consumed = agenticLib.simulateKafkaConsumer("consumerTopic", 4);
      expect(consumed.length).toBe(4);
      consumed.forEach((msg, index) => {
        expect(msg).toContain(`Consumed message ${index + 1} from topic 'consumerTopic'`);
      });
    });

    test("simulateKafkaRequestResponse returns appropriate response", async () => {
      const response = await agenticLib.simulateKafkaRequestResponse("reqResTopic", "Request Data", 50);
      expect(response).toBe("Response to 'Request Data' on topic 'reqResTopic'");
    });

    test("simulateKafkaRequestResponse handles error gracefully", async () => {
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = () => { throw new Error("Simulated error") };
      const response = await agenticLib.simulateKafkaRequestResponse("errorTopic", "Test Failure", 10);
      expect(response).toContain("Error in simulation: Simulated error");
      global.setTimeout = originalSetTimeout;
    });

    test("simulateKafkaGroupMessaging returns responses from all consumers in group", () => {
      const responses = agenticLib.simulateKafkaGroupMessaging("group1", "Group Message", 4);
      expect(responses.length).toBe(4);
      responses.forEach((resp, index) => {
        expect(resp).toContain(`Group 'group1' consumer ${index + 1} received message: Group Message`);
      });
    });

    test("simulateKafkaTopicSubscription returns subscription confirmations", () => {
      const topics = ["topicX", "topicY"];
      const subs = agenticLib.simulateKafkaTopicSubscription(topics);
      expect(subs).toEqual(["Subscribed to topic: topicX", "Subscribed to topic: topicY"]);
    });
  });
});

describe("delegateDecisionToLLM fallback", () => {
  test("delegateDecisionToLLM returns fallback message when openai call fails", async () => {
    const result = await agenticLib.delegateDecisionToLLM("test prompt");
    expect(result).toBe("LLM decision could not be retrieved.");
  });

  test("delegateDecisionToLLMWrapped returns fallback message when openai call fails", async () => {
    const result = await agenticLib.delegateDecisionToLLMWrapped("test prompt");
    expect(result.fixed).toBe("false");
  });
});

describe("Additional Functions", () => {
  test("splitArguments with empty array returns empty arrays", () => {
    const result = agenticLib.splitArguments([]);
    expect(result.flagArgs).toEqual([]);
    expect(result.nonFlagArgs).toEqual([]);
  });
  test("printReport function logs output", () => {
    const output = captureOutput(() => {
      agenticLib.printReport();
    });
    expect(output).toContain("System Performance:");
    expect(output).toContain("Telemetry Data:");
  });
});

describe("callOpenAIFunctionWrapper", () => {
  test("returns fallback message when OpenAI call fails", async () => {
    const result = await agenticLib.callOpenAIFunctionWrapper("test prompt");
    expect(result.fixed).toBe("false");
  });
});
