import request from "supertest";
import { readFileSync } from "fs";
import { URL } from "url";
import { describe, test, expect, vi } from "vitest";
import { app } from "../source/main.js";
import { createSQSEventFromDigest } from "../../src/lib/main.js";

describe("HTTP API Server", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("GET /health returns status ok and uptime number", async () => {
    const res = await request(app).get("/health").expect(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(typeof res.body.uptime).toBe("number");
  });

  test("GET /version returns version and timestamp", async () => {
    const pkgPath = new URL("../../package.json", import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const res = await request(app).get("/version").expect(200);
    expect(res.body).toHaveProperty("version", pkg.version);
    expect(typeof res.body.timestamp).toBe("string");
    expect(new Date(res.body.timestamp).toString()).not.toBe("Invalid Date");
  });

  test("POST /digest invokes digestLambdaHandler and returns success", async () => {
    const mod = await import("../../src/lib/main.js");
    const spy = vi.spyOn(mod, "digestLambdaHandler").mockResolvedValue({
      batchItemFailures: [],
      handler: "handler",
    });
    const digest = {
      key: "events/1.json",
      value: "12345",
      lastModified: "2025-01-01T00:00:00Z",
    };
    const res = await request(app).post("/digest").send(digest).expect(200);
    expect(res.body).toEqual({ success: true });
    expect(spy).toHaveBeenCalledWith(createSQSEventFromDigest(digest));
  });

  test("POST /digest errors are handled with 500", async () => {
    const errorMsg = "Handler error";
    const mod = await import("../../src/lib/main.js");
    vi.spyOn(mod, "digestLambdaHandler").mockRejectedValue(new Error(errorMsg));
    const digest = {
      key: "events/2.json",
      value: "67890",
      lastModified: "2025-02-02T00:00:00Z",
    };
    const res = await request(app).post("/digest").send(digest).expect(500);
    expect(res.body).toHaveProperty("error", errorMsg);
  });
});
