import { describe, test, expect, vi } from "vitest";
import { main } from "@sandbox/source/main.js";

describe("SPARQL CLI Functionality", () => {
  test("should fetch and log SPARQL results for supported source", async () => {
    const dummyBindings = [{ foo: "bar" }];
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ results: { bindings: dummyBindings } })
      })
    );
    const consoleLogSpy = vi.spyOn(console, "log");

    await main(["--sparql", "wikidata"]);

    expect(global.fetch).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(dummyBindings));

    consoleLogSpy.mockRestore();
  });

  test("should handle unsupported SPARQL source", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    await main(["--sparql", "unknown"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Unsupported SPARQL source: unknown");

    consoleErrorSpy.mockRestore();
  });

  test("should handle fetch errors gracefully", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("network error")));
    const consoleErrorSpy = vi.spyOn(console, "error");

    await main(["--sparql", "wikidata"]);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error fetching SPARQL data:")
    );

    consoleErrorSpy.mockRestore();
  });
});