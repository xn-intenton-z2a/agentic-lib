import request from "supertest";
import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import { app, processServe, createSQSEventFromDigest } from "../source/main.js";

describe("HTTP Server Mode", () => {
  let listenSpy;

  beforeAll(() => {
    listenSpy = vi.spyOn(app, "listen").mockImplementation((port, cb) => {
      cb();
      return { close: () => {} };
    });
  });

  afterAll(() => {
    listenSpy.mockRestore();
  });

  test("processServe starts server on default port", async () => {
    const result = await processServe(["--serve"]);
    expect(result).toBe(true);
    expect(listenSpy).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  test("processServe uses PORT env var", async () => {
    process.env.PORT = "4000";
    const result = await processServe(["--serve"]);
    expect(result).toBe(true);
    expect(listenSpy).toHaveBeenCalledWith("4000", expect.any(Function));
    delete process.env.PORT;
  });
});

describe("POST /digest Endpoint", () => {
  test("valid payload returns empty batchItemFailures", async () => {
    const payload = {
      Records: [{ body: JSON.stringify({ key: "value" }) }]
    };
    const response = await request(app)
      .post("/digest")
      .send(payload)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ batchItemFailures: [] });
  });

  test("invalid JSON payload returns fallback identifier", async () => {
    const payload = {
      Records: [{ body: "not a json" }]
    };
    const response = await request(app)
      .post("/digest")
      .send(payload)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.batchItemFailures)).toBe(true);
    expect(response.body.batchItemFailures.length).toBe(1);
    expect(response.body.batchItemFailures[0]).toMatch(/fallback-\d+-\d+\w+/);
  });

  test("single record payload without Records array normalizes to Records array", async () => {
    const sampleDigest = { key: "events/2.json", value: "abcde", lastModified: new Date().toISOString() };
    const response = await request(app)
      .post("/digest")
      .send(sampleDigest)
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ batchItemFailures: [] });
  });
});
