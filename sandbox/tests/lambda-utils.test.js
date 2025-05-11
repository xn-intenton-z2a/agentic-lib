import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  createSQSEventFromDigest,
  digestLambdaHandler,
  main as cliMain,
} from "../../src/lib/main.js";

describe("SQS Utility Functions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("createSQSEventFromDigest returns correct structure", () => {
    const digest = {
      key: "events/1.json",
      value: "12345",
      lastModified: "2025-05-11T00:00:00Z",
    };
    const event = createSQSEventFromDigest(digest);
    expect(event).toHaveProperty("Records");
    expect(Array.isArray(event.Records)).toBe(true);
    expect(event.Records).toHaveLength(1);
    const record = event.Records[0];
    expect(record.body).toBe(JSON.stringify(digest));
  });

  test("digestLambdaHandler processes valid event", async () => {
    const digest = {
      key: "events/1.json",
      value: "12345",
      lastModified: "2025-05-11T00:00:00Z",
    };
    const event = createSQSEventFromDigest(digest);
    const consoleLogSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await digestLambdaHandler(event);
    expect(result).toHaveProperty("batchItemFailures");
    expect(result.batchItemFailures).toEqual([]);
    expect(result).toHaveProperty(
      "handler",
      "src/lib/main.digestLambdaHandler",
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Record 0: Received digest"),
    );

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("digestLambdaHandler processes invalid JSON event", async () => {
    const badEvent = { Records: [{ body: "not a json" }] };
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await digestLambdaHandler(badEvent);
    expect(result.batchItemFailures).toHaveLength(1);
    const failure = result.batchItemFailures[0];
    expect(failure.itemIdentifier).toMatch(
      /^fallback-0-\d+-[a-z0-9]+$/,
    );
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  test("CLI integration with --digest flag calls digestLambdaHandler and logs info", async () => {
    const consoleLogSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});
    await expect(cliMain(["--digest"]) ).resolves.toBeUndefined();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Record 0: Received digest"),
    );
    consoleLogSpy.mockRestore();
  });
});