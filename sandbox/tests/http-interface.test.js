import { describe, test, expect, beforeAll } from "vitest";
import request from "supertest";
import { createHttpServer } from "../source/main.js";

describe("HTTP Interface Integration", () => {
  let app;

  beforeAll(() => {
    app = createHttpServer();
  });

  test("GET /health returns status ok and numeric uptime", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(typeof res.body.uptime).toBe("number");
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  test("POST /digest with valid payload returns batchItemFailures and handler", async () => {
    const payload = {
      key: "events/1.json",
      value: "12345",
      lastModified: new Date().toISOString(),
    };
    const res = await request(app)
      .post("/digest")
      .set("Content-Type", "application/json")
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("batchItemFailures");
    expect(Array.isArray(res.body.batchItemFailures)).toBe(true);
    expect(res.body.batchItemFailures.length).toBe(0);
    expect(res.body).toHaveProperty("handler", "sandbox/source/main.digestLambdaHandler");
  });

  test("POST /digest with malformed JSON returns 400 and error message", async () => {
    const res = await request(app)
      .post("/digest")
      .set("Content-Type", "application/json")
      .send("{ invalidJson:");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/Invalid JSON payload:/);
  });

  test("POST /digest with missing fields returns 400 and error message", async () => {
    const res = await request(app)
      .post("/digest")
      .set("Content-Type", "application/json")
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toMatch(/Invalid JSON payload:/);
  });

  test("POST /webhook returns status received and logs payload", async () => {
    const payload = { foo: "bar" };
    const res = await request(app)
      .post("/webhook")
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "received" });
  });
});