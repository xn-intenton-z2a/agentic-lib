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

describe("Telemetry Functions", () => {
  test("gatherTotalTelemetry should contain githubEnv property", () => {
    const total = agenticLib.gatherTotalTelemetry();
    expect(total).toHaveProperty("githubEnv");
  });
  test("gatherWorkflowTelemetry returns additional workflow properties", () => {
    const workflowTelemetry = agenticLib.gatherWorkflowTelemetry();
    expect(workflowTelemetry).toHaveProperty("buildTimestamp");
    expect(workflowTelemetry).toHaveProperty("runnerOs");
    expect(workflowTelemetry).toHaveProperty("repository");
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

describe("delegateDecisionToLLMFunctionCallWrapper", () => {
  test("returns error if prompt is empty", async () => {
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper("", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Prompt is required");
  });

  test("returns error if API key is missing", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMFunctionCallWrapper("Test prompt", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
  });
});

describe("delegateDecisionToLLMChatAdvanced", () => {
  test("returns error if prompt is empty", async () => {
    const result = await agenticLib.delegateDecisionToLLMChatAdvanced("", "Some extra context", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Prompt is required");
  });

  test("returns error if API key is missing", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMChatAdvanced("Test prompt", "Extra context", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
  });
});

describe("delegateDecisionToLLMChatPremium", () => {
  test("returns error if prompt is empty", async () => {
    const result = await agenticLib.delegateDecisionToLLMChatPremium("", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Prompt is required");
  });
  
  test("returns error if API key is missing", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const result = await agenticLib.delegateDecisionToLLMChatPremium("Test prompt", {});
    expect(result.fixed).toBe("false");
    expect(result.message).toContain("Missing API key");
    process.env.OPENAI_API_KEY = originalApiKey;
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

describe("simulateKafkaDelayedMessage", () => {
  test("should simulate delayed Kafka messaging", async () => {
    const topic = "delayed-topic";
    const message = "Delayed Hello";
    const result = await agenticLib.simulateKafkaDelayedMessage(topic, message, 100);
    expect(result).toHaveProperty("delayed", true);
    expect(result.topic).toBe(topic);
    expect(result.message).toContain(message);
  });
});

describe("simulateKafkaTransaction", () => {
  test("should simulate a Kafka transaction", () => {
    const messagesArray = [
      { topic: "txn-topic1", message: "Message 1" },
      { topic: "txn-topic2", message: "Message 2" }
    ];
    const result = agenticLib.simulateKafkaTransaction(messagesArray);
    expect(result).toHaveProperty("success", true);
    expect(result.transaction).toHaveProperty("txn-topic1");
    expect(result.transaction).toHaveProperty("txn-topic2");
  });
});

describe("simulateKafkaPriorityQueue", () => {
  test("should return messages sorted by priority", () => {
    const topic = "priority-topic";
    const messages = [
      { message: "Low priority", priority: 1 },
      { message: "High priority", priority: 10 },
      { message: "Medium priority", priority: 5 }
    ];
    const sorted = agenticLib.simulateKafkaPriorityQueue(topic, messages);
    expect(sorted[0]).toContain("High priority");
    expect(sorted[sorted.length - 1]).toContain("Low priority");
  });
});

describe("simulateKafkaMessagePersistence", () => {
  test("should persist messages and return updated store", () => {
    const topic = "persistent-topic";
    const msg1 = "First message";
    const msg2 = "Second message";
    const result1 = agenticLib.simulateKafkaMessagePersistence(topic, msg1);
    const result2 = agenticLib.simulateKafkaMessagePersistence(topic, msg2);
    expect(result1.persistedMessages).toContain(msg1);
    expect(result2.persistedMessages).toContain(msg1);
    expect(result2.persistedMessages).toContain(msg2);
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

describe("parseVitestDefaultOutput", () => {
  test("should correctly parse Vitest output", () => {
    const vitestStr = "37 tests passed";
    const result = agenticLib.parseVitestDefaultOutput(vitestStr);
    expect(result.testsPassed).toBe(37);
  });
});

describe("parseEslintSarifOutput", () => {
  test("should correctly parse ESLint SARIF output", () => {
    const sarif = {
      runs: [
        { results: [ { level: "error" }, { level: "warning" }, { level: "error" } ] }
      ]
    };
    const result = agenticLib.parseEslintSarifOutput(sarif);
    expect(result.numProblems).toBe(3);
    expect(result.numErrors).toBe(2);
    expect(result.numWarnings).toBe(1);
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
    const fetchMock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => dummyData,
    });
    const result = await agenticLib.callRepositoryService("https://example.com");
    expect(result).toEqual(dummyData);
    fetchMock.mockRestore();
  });

  test("should handle error when service fails", async () => {
    const error = new Error("Not Found");
    const fetchMock = vi.spyOn(global, "fetch").mockRejectedValue(error);
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

describe("simulateKafkaMulticast", () => {
  test("should simulate multicast messaging to multiple topics", () => {
    const topics = ["multi1", "multi2", "multi3"];
    const message = "Multicast message";
    const options = { delay: 50 };
    const result = agenticLib.simulateKafkaMulticast(topics, message, options);
    topics.forEach((topic) => {
      expect(result[topic].multicast).toContain(message);
      expect(result[topic].multicast).toContain("delayed by 50ms");
    });
  });
});

describe("simulateKafkaRebroadcast", () => {
  test("should rebroadcast message to multiple topics repeatedly", () => {
    const topics = ["rebroadcast1", "rebroadcast2"];
    const message = "Rebroadcast message";
    const repeat = 3;
    const result = agenticLib.simulateKafkaRebroadcast(topics, message, repeat);
    topics.forEach((topic) => {
      expect(result[topic].length).toBe(repeat);
      result[topic].forEach((entry) => {
        expect(entry.sent).toContain(message);
        expect(entry.received).toContain(topic);
      });
    });
  });
});

describe("simulateIssueCreation", () => {
  test("should select a random issue title when 'house choice' is provided", () => {
    const params = {
      issueTitle: "house choice",
      issueBody: "Please resolve the issue.",
      houseChoiceOptions: ["Option A", "Option B", "Option C"]
    };
    const result = agenticLib.simulateIssueCreation(params);
    expect(params.houseChoiceOptions).toContain(result.issueTitle);
    expect(result.issueBody).toBe(params.issueBody);
    expect(result.issueNumber).toBeGreaterThanOrEqual(100);
    expect(result.issueNumber).toBeLessThan(1000);
  });
  
  test("should use the provided issue title if not 'house choice'", () => {
    const params = {
      issueTitle: "Explicit Title",
      issueBody: "Detailed issue body.",
      houseChoiceOptions: ["Option A", "Option B"]
    };
    const result = agenticLib.simulateIssueCreation(params);
    expect(result.issueTitle).toBe("Explicit Title");
    expect(result.issueBody).toBe(params.issueBody);
  });
});
