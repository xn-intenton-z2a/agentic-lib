import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@sandbox/source/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "sandbox/source/main.js"];
    main();
  });
});

describe("--crawl flag", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete global.fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete global.fetch;
  });

  test("successful fetch prints JSON", async () => {
    const dummyData = { foo: "bar" };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(dummyData),
      })
    );
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit");
    });

    await main(["--crawl", "https://example.com/data"]);

    expect(global.fetch).toHaveBeenCalledWith("https://example.com/data");
    expect(logSpy).toHaveBeenCalledWith(JSON.stringify(dummyData));
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test("fetch error logs and exit", async () => {
    const fetchError = new Error("network failure");
    global.fetch = vi.fn(() => Promise.reject(fetchError));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit:${code}`);
    });

    await expect(main(["--crawl", "https://example.com/data"]))
      .rejects.toThrow("process.exit:1");
    expect(errorSpy).toHaveBeenCalledWith(
      JSON.stringify({ error: "FetchError", message: fetchError.message, url: "https://example.com/data" })
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("invalid JSON logs and exit", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new SyntaxError("invalid json")),
      })
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`process.exit:${code}`);
    });

    await expect(main(["--crawl", "https://example.com/data"]))
      .rejects.toThrow("process.exit:1");
    expect(errorSpy).toHaveBeenCalledWith(
      JSON.stringify({ error: "JSONParseError", message: "invalid json", url: "https://example.com/data" })
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
