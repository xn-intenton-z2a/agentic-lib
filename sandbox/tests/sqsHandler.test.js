import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { createSQSEventFromDigest, digestLambdaHandler } from "../../src/lib/main.js";

describe("SQS Utility and Handler", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("createSQSEventFromDigest produces correct event", () => {
    const digest = { key: "foo", value: "bar" };
    const event = createSQSEventFromDigest(digest);
    expect(event).toHaveProperty("Records");
    expect(Array.isArray(event.Records)).toBe(true);
    expect(event.Records).toHaveLength(1);
    const record = event.Records[0];
    expect(record.body).toBe(JSON.stringify(digest));
    expect(record.eventSource).toBe("aws:sqs");
    expect(record.eventName).toBe("SendMessage");
  });

  test("digestLambdaHandler processes valid payload without errors", async () => {
    const digest = { key: "k", value: "v" };
    const event = createSQSEventFromDigest(digest);
    const errorSpy = vi.spyOn(console, "error");
    const result = await digestLambdaHandler(event);
    expect(result).toEqual({
      batchItemFailures: [],
      handler: "src/lib/main.digestLambdaHandler",
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  test("digestLambdaHandler reports failure for invalid JSON without messageId", async () => {
    const event = { Records: [{ body: "not valid json" }] };
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await digestLambdaHandler(event);
    expect(result.handler).toBe("src/lib/main.digestLambdaHandler");
    expect(result.batchItemFailures).toHaveLength(1);
    const [failure] = result.batchItemFailures;
    expect(failure).toHaveProperty("itemIdentifier");
    expect(failure.itemIdentifier).toMatch(/^fallback-0-\d+-[a-z0-9]{9}$/);
    // Should log two errors
    expect(errorSpy).toHaveBeenCalledTimes(2);
  });

  test("digestLambdaHandler reports failure for invalid JSON with messageId", async () => {
    const event = { Records: [{ messageId: "msg-123", body: "{{bad}}" }] };
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await digestLambdaHandler(event);
    expect(result.handler).toBe("src/lib/main.digestLambdaHandler");
    expect(result.batchItemFailures).toEqual([{ itemIdentifier: "msg-123" }]);
    expect(errorSpy).toHaveBeenCalled();
    // ensure messageId in logging
    const logCalls = errorSpy.mock.calls.map(call => call.join(" "));
    const joined = logCalls.join(" ");
    expect(joined).toContain("msg-123");
    expect(joined).toContain("{{bad}}");
  });

  test("end-to-end integration: valid event yields no failures", async () => {
    const digest = { k: 1, lastModified: "date" };
    const event = createSQSEventFromDigest(digest);
    const errorSpy = vi.spyOn(console, "error");
    const result = await digestLambdaHandler(event);
    expect(result).toEqual({
      batchItemFailures: [],
      handler: "src/lib/main.digestLambdaHandler",
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
