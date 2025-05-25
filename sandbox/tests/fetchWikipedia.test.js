import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "../source/main.js";

describe("--fetch-wikipedia flag", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("successful fetch logs JSON data", async () => {
    const mockData = { title: "Node.js", extract: "Node.js is a runtime..." };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });
    const logSpy = vi.spyOn(console, "log");
    const errSpy = vi.spyOn(console, "error");

    await main(["--fetch-wikipedia", "Node.js"]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://en.wikipedia.org/api/rest_v1/page/summary/Node.js"
    );
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(mockData));
    expect(errSpy).not.toHaveBeenCalled();
  });

  test("missing topic logs error and exits", async () => {
    const errSpy = vi.spyOn(console, "error");
    const logSpy = vi.spyOn(console, "log");

    await main(["--fetch-wikipedia"]);

    expect(errSpy).toHaveBeenCalledWith(
      "Missing topic for --fetch-wikipedia flag"
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  test("HTTP error logs status and exits", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });
    const errSpy = vi.spyOn(console, "error");
    const logSpy = vi.spyOn(console, "log");

    await main(["--fetch-wikipedia", "Earth"]);

    expect(errSpy).toHaveBeenCalledWith(
      "Error fetching Wikipedia summary: 404 Not Found"
    );
    expect(logSpy).not.toHaveBeenCalled();
  });

  test("flag bypass prints default run message", async () => {
    const logSpy = vi.spyOn(console, "log");
    const errSpy = vi.spyOn(console, "error");

    await main(["--other", "value"]);
    expect(logSpy).toHaveBeenCalledWith(
      `Run with: ${JSON.stringify(["--other", "value"])}`
    );
    expect(errSpy).not.toHaveBeenCalled();
  });
});
