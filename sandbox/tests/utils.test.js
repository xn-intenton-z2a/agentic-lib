import { describe, test, expect } from "vitest";
import { createSQSEventFromDigest, digestLambdaHandler } from "../source/main.js";

describe("Utility Functions", () => {
  test("createSQSEventFromDigest returns correct SQS event", () => {
    const sampleDigest = { key: "events/1.json", value: "12345", lastModified: "2025-01-01T00:00:00.000Z" };
    const event = createSQSEventFromDigest(sampleDigest);
    expect(event).toHaveProperty("Records");
    expect(Array.isArray(event.Records)).toBe(true);
    expect(event.Records).toHaveLength(1);
    const record = event.Records[0];
    expect(record.eventVersion).toBe("2.0");
    expect(record.eventSource).toBe("aws:sqs");
    expect(record.eventName).toBe("SendMessage");
    expect(typeof record.eventTime).toBe("string");
    expect(record.eventTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(record.body).toBe(JSON.stringify(sampleDigest));
  });

  test("digestLambdaHandler processes valid JSON record without failures", async () => {
    const sampleDigest = { key: "events/3.json", value: "67890", lastModified: "2025-01-01T00:00:00.000Z" };
    const sqsEvent = { Records: [{ body: JSON.stringify(sampleDigest), messageId: "msg-1" }] };
    const result = await digestLambdaHandler(sqsEvent);
    expect(result).toEqual({ batchItemFailures: [], handler: "src/lib/main.digestLambdaHandler" });
  });

  test("digestLambdaHandler reports failures on invalid JSON with messageId", async () => {
    const sqsEvent = { Records: [{ body: "not a json", messageId: "msg-2" }] };
    const result = await digestLambdaHandler(sqsEvent);
    expect(Array.isArray(result.batchItemFailures)).toBe(true);
    expect(result.batchItemFailures).toHaveLength(1);
    const [failure] = result.batchItemFailures;
    expect(failure).toHaveProperty("itemIdentifier", "msg-2");
  });

  test("digestLambdaHandler reports fallback identifier when messageId missing", async () => {
    const sqsEvent = { Records: [{ body: "bad payload" }] };
    const result = await digestLambdaHandler(sqsEvent);
    expect(result.batchItemFailures).toHaveLength(1);
    const fallbackId = result.batchItemFailures[0].itemIdentifier;
    expect(fallbackId).toMatch(/^fallback-\d+-\d+-[a-z0-9]+$/);
  });
});
