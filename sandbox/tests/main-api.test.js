import request from "supertest";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { createHttpServer } from "../source/main.js";
import * as mainModule from "../../src/lib/main.js";

describe("HTTP API /digest", () => {
  let app;

  beforeEach(() => {
    app = createHttpServer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Success case: returns 200 and batchItemFailures", async () => {
    const payload = {
      key: "events/1.json",
      value: "12345",
      lastModified: new Date().toISOString(),
    };
    const response = await request(app)
      .post("/digest")
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("batchItemFailures");
    expect(Array.isArray(response.body.batchItemFailures)).toBe(true);
    // Default handler returns no failures
    expect(response.body.batchItemFailures).toHaveLength(0);
  });

  test("Invalid JSON: returns 400 and error message", async () => {
    const response = await request(app)
      .post("/digest")
      .set("Content-Type", "application/json")
      // Malformed JSON
      .send("{invalidJson:");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid JSON" });
  });

  test("Handler error: returns 500 and error message", async () => {
    // Mock the digestLambdaHandler to throw
    vi.spyOn(mainModule, "digestLambdaHandler").mockImplementation(async () => {
      throw new Error("Test error");
    });
    const payload = {
      key: "events/2.json",
      value: "67890",
      lastModified: new Date().toISOString(),
    };
    const response = await request(app)
      .post("/digest")
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  });
});
