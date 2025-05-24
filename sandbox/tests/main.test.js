import { describe, test, expect } from "vitest";
import { main, createSQSEventFromDigest, digestLambdaHandler } from "../source/main.js";

describe("Main API", () => {
  test("main is a function", () => {
    expect(typeof main).toBe("function");
  });

  test("createSQSEventFromDigest wraps digest correctly", () => {
    const digest = { key: "k", value: "v" };
    const event = createSQSEventFromDigest(digest);
    expect(event).toHaveProperty("Records");
    expect(Array.isArray(event.Records)).toBe(true);
    expect(JSON.parse(event.Records[0].body)).toEqual(digest);
  });

  test("digestLambdaHandler returns handler name and no failures for valid JSON", async () => {
    const digest = { foo: "bar" };
    const event = createSQSEventFromDigest(digest);
    const result = await digestLambdaHandler(event);
    expect(result).toEqual({ batchItemFailures: [], handler: "src/lib/main.digestLambdaHandler" });
  });

  test("digestLambdaHandler returns fallback UUID identifier on invalid JSON", async () => {
    const badEvent = { Records: [{ body: "invalid-json" }] };
    const result = await digestLambdaHandler(badEvent);
    expect(result.batchItemFailures).toHaveLength(1);
    const id = result.batchItemFailures[0].itemIdentifier;
    expect(typeof id).toBe("string");
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
