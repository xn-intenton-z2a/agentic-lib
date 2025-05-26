import fs from "fs";
import os from "os";
import path from "path";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "../source/main.js";

describe("--crawl command", () => {
  const sampleResponse = {
    results: {
      bindings: [
        {
          item: { value: "http://example.com/item1" },
          itemLabel: { value: "Item1" },
          prop1: { value: "Val1" },
        },
      ],
    },
  };

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(sampleResponse),
        })
      )
    );
    vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("writes to stdout when no output", async () => {
    await main(["--crawl", "TEST_QUERY"]);
    const expected = [
      { key: "http://example.com/item1", label: "Item1", properties: { prop1: "Val1" } },
    ];
    expect(console.log).toHaveBeenCalledWith(JSON.stringify(expected, null, 2));
    expect(fetch).toHaveBeenCalledWith(
      'https://query.wikidata.org/sparql?query=' + encodeURIComponent("TEST_QUERY"),
      { headers: { Accept: "application/sparql-results+json" } }
    );
  });

  test("writes to file when output specified", async () => {
    const tempFile = path.join(os.tmpdir(), "out.json");
    await main(["--crawl", "TEST_QUERY", "--output", tempFile]);
    const expected = [
      { key: "http://example.com/item1", label: "Item1", properties: { prop1: "Val1" } },
    ];
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      tempFile,
      JSON.stringify(expected, null, 2),
      "utf8"
    );
  });

  test("uses dbpedia endpoint when source specified", async () => {
    await main(["--source", "dbpedia", "--crawl", "TEST_QUERY"]);
    expect(fetch).toHaveBeenCalledWith(
      'https://dbpedia.org/sparql?query=' + encodeURIComponent("TEST_QUERY"),
      { headers: { Accept: "application/sparql-results+json" } }
    );
  });

  test("errors on unknown source", async () => {
    await expect(
      main(["--source", "unknown", "--crawl", "Q"])
    ).rejects.toThrow("Unknown source: unknown");
    expect(console.error).toHaveBeenCalledWith("Unknown source: unknown");
  });
});
