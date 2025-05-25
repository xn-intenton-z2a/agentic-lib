import supertest from "supertest";
import { describe, test, beforeAll, afterAll, expect } from "vitest";
import { app } from "../source/main.js";

describe("HTTP Server", () => {
  let server;
  let request;

  beforeAll(() => {
    server = app.listen(0);
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    request = supertest(`http://127.0.0.1:${port}`);
  });

  afterAll(async () => {
    await server.close();
  });

  test("GET /health responds with status ok and uptime", async () => {
    const response = await request.get("/health");
    expect(response.status).toEqual(200);
    expect(response.body.status).toEqual("ok");
    expect(typeof response.body.uptime).toEqual("number");
  });

  test("POST /digest responds with batchItemFailures empty array", async () => {
    const exampleDigest = { x: "y", value: "value" };
    const sqsEvent = { Records: [{ body: JSON.stringify(exampleDigest) }] };
    const response = await request
      .post("/digest")
      .send(sqsEvent)
      .set("Content-Type", "application/json");
    expect(response.status).toEqual(200);
    expect(response.body.batchItemFailures).toEqual([]);
  });
});