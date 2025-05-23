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
});
