import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import * as agenticLib from "../../src/lib/main.js";

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
