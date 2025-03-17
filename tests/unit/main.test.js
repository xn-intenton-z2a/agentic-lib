import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import * as agenticLib from "../../src/lib/main.js";
import { promises as fs } from "fs";

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
        "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [args...]"
    };
    const result = agenticLib.reviewIssue(params);
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("The issue has been resolved.");
    expect(result.refinement).toBe("None");
  });
});

describe("delegateDecisionToLLMChat", () => {
  test("returns error if prompt is empty", async () => {
    const result = await agenticLib.delegateDecisionToLLMChat("", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Prompt is required");
  });

  test("returns error if API key is missing", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMChat("Test prompt", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
  });
});

describe("delegateDecisionToLLMChatVerbose", () => {
  test("returns error if prompt is empty (verbose)", async () => {
    const result = await agenticLib.delegateDecisionToLLMChatVerbose("", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Prompt is required");
  });

  test("returns error if API key is missing (verbose)", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMChatVerbose("Test prompt", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
  });
});

describe("delegateDecisionToLLMChatOptimized", () => {
  test("returns error if prompt is empty", async () => {
    const result = await agenticLib.delegateDecisionToLLMChatOptimized("", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Prompt is required");
  });

  test("returns error if API key is missing", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMChatOptimized("Test prompt", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
  });
});

describe("gatherTotalTelemetry", () => {
  test("should contain githubEnv property", () => {
    const total = agenticLib.gatherTotalTelemetry();
    expect(total).toHaveProperty("githubEnv");
  });
});

describe("simulateKafkaWorkflowMessaging", () => {
  test("should simulate routing and consumer group messaging", () => {
    const topics = ["sales", "special-trade", "random"];
    const routingKey = "special";
    const message = "Test message";
    const consumerGroup = "group1";
    const result = agenticLib.simulateKafkaWorkflowMessaging(topics, routingKey, message, consumerGroup);
    expect(result).toHaveProperty("routedMessages");
    expect(result).toHaveProperty("consumerGroupResults");
    expect(Object.keys(result.routedMessages)).toContain("special-trade");
  });
});

describe("simulateKafkaDirectMessage", () => {
  test("should simulate direct Kafka messaging", () => {
    const topic = "test-topic";
    const msg = "Hello Kafka";
    const result = agenticLib.simulateKafkaDirectMessage(topic, msg);
    expect(result).toHaveProperty("sent");
    expect(result).toHaveProperty("receipt");
    expect(result.topic).toBe(topic);
  });
});

describe("simulateFileSystemCall", () => {
  test("returns file content if file exists", async () => {
    const dummyPath = "./dummy.txt";
    const readFileSpy = vi.spyOn(fs, "readFile").mockResolvedValue("file content");
    const result = await agenticLib.simulateFileSystemCall(dummyPath);
    expect(result).toBe("file content");
    readFileSpy.mockRestore();
  });

  test("returns null and logs error if file does not exist", async () => {
    const dummyPath = "./nonexistent.txt";
    const error = new Error("File not found");
    const readFileSpy = vi.spyOn(fs, "readFile").mockRejectedValue(error);
    const result = await agenticLib.simulateFileSystemCall(dummyPath);
    expect(result).toBeNull();
    readFileSpy.mockRestore();
  });
});

describe("parseCombinedDefaultOutput", () => {
  test("should parse both vitest and eslint default outputs", () => {
    const vitestStr = "42 tests passed";
    const eslintStr = "10 problems, 3 errors, 5 warnings";
    const result = agenticLib.parseCombinedDefaultOutput(vitestStr, eslintStr);
    expect(result.vitest.testsPassed).toBe(42);
    expect(result.eslint.numProblems).toBe(10);
    expect(result.eslint.numErrors).toBe(3);
    expect(result.eslint.numWarnings).toBe(5);
  });
});

describe("simulateCIWorkflowLifecycle", () => {
  test("should return telemetry and kafkaBroadcast properties", () => {
    const result = agenticLib.simulateCIWorkflowLifecycle();
    expect(result).toHaveProperty("telemetry");
    expect(result).toHaveProperty("kafkaBroadcast");
    expect(result.telemetry).toHaveProperty("githubEnv");
  });
});

describe("getIssueNumberFromBranch", () => {
  test("should extract issue number correctly", () => {
    const branch = "agentic-lib-issue-123";
    const issueNum = agenticLib.getIssueNumberFromBranch(branch);
    expect(issueNum).toBe(123);
  });

  test("should return null for non-matching branch", () => {
    const branch = "feature-new-idea";
    const issueNum = agenticLib.getIssueNumberFromBranch(branch);
    expect(issueNum).toBeNull();
  });
});

describe("sanitizeCommitMessage", () => {
  test("should remove unwanted characters and extra spaces", () => {
    const msg = "Commit: Fix issue! @#$$%^&*()";
    const sanitized = agenticLib.sanitizeCommitMessage(msg);
    expect(sanitized).toBe("Commit Fix issue");
  });
});

describe("callRepositoryService", () => {
  test("should return data when service responds successfully", async () => {
    const dummyData = { success: true };
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => dummyData
    });
    const result = await agenticLib.callRepositoryService("https://example.com");
    expect(result).toEqual(dummyData);
    fetchMock.mockRestore();
  });

  test("should handle error when service fails", async () => {
    const error = new Error("Not Found");
    const fetchMock = vi.spyOn(global, 'fetch').mockRejectedValue(error);
    const result = await agenticLib.callRepositoryService("https://example.com");
    expect(result).toHaveProperty("error");
    fetchMock.mockRestore();
  });
});

describe("simulateKafkaBroadcast", () => {
  test("should simulate broadcast messaging across topics", () => {
    const topics = ["topic1", "topic2"];
    const message = "Broadcast message";
    const result = agenticLib.simulateKafkaBroadcast(topics, message);
    expect(result).toHaveProperty("topic1");
    expect(result).toHaveProperty("topic2");
    expect(result.topic1.broadcast).toBe(true);
  });
});
