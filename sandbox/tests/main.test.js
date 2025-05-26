import { describe, test, expect, vi } from "vitest";
import { main } from "@sandbox/source/main.js";

describe("Main CLI Functionality", () => {
  test("should terminate without error when no arguments", async () => {
    await main([]);
  });

  test("should fetch and log JSON for --crawl option", async () => {
    const dummyData = { foo: "bar" };
    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(dummyData) })
    );
    const consoleLogSpy = vi.spyOn(console, "log");

    await main(["--crawl", "http://example.com/data"]);

    expect(global.fetch).toHaveBeenCalledWith("http://example.com/data");
    expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(dummyData));

    consoleLogSpy.mockRestore();
  });
});
