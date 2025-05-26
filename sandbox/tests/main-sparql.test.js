import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { processSparql, main } from "@sandbox/source/main.js";
import * as lib from "../../src/lib/main.js";

describe("SPARQL CLI", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // spy on process.exit to throw for test
    vi.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`process.exit: ${code}`); });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("successful SPARQL fetch and processing", async () => {
    const sampleBindings = [{ id: { value: "Q1" } }, { id: { value: "Q2" } }];
    const fakeResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ results: { bindings: sampleBindings } }),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fakeResponse));

    const createEventSpy = vi.spyOn(lib, "createSQSEventFromDigest");
    const handlerSpy = vi.spyOn(lib, "digestLambdaHandler").mockResolvedValue();
    const logInfoSpy = vi.spyOn(lib, "logInfo").mockImplementation();
    const logErrorSpy = vi.spyOn(lib, "logError").mockImplementation();

    const result = await main(["--sparql", "SELECT *", "--endpoint", "https://example.org/sparql"]);

    expect(fetch).toHaveBeenCalledWith("https://example.org/sparql", {
      method: "POST",
      headers: { "Content-Type": "application/sparql-query" },
      body: "SELECT *",
    });
    expect(createEventSpy).toHaveBeenCalledTimes(sampleBindings.length);
    for (const binding of sampleBindings) {
      expect(createEventSpy).toHaveBeenCalledWith(expect.objectContaining({
        query: "SELECT *",
        endpoint: "https://example.org/sparql",
        binding,
        timestamp: expect.any(String),
      }));
    }
    expect(handlerSpy).toHaveBeenCalledTimes(sampleBindings.length);
    expect(logInfoSpy).toHaveBeenCalledWith(
      `SPARQL query processed at https://example.org/sparql, bindings: 2`
    );
    expect(logErrorSpy).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("HTTP error status", async () => {
    const fakeResponse = { ok: false, status: 500 };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fakeResponse));
    const logErrorSpy = vi.spyOn(lib, "logError").mockImplementation();
    const logInfoSpy = vi.spyOn(lib, "logInfo").mockImplementation();

    await expect(processSparql(["--sparql", "q"]))
      .rejects.toThrow("process.exit: 1");
    expect(fetch).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith(
      "Error fetching SPARQL from https://query.wikidata.org/sparql", "500"
    );
    expect(logInfoSpy).not.toHaveBeenCalled();
  });

  test("network failure", async () => {
    const error = new Error("network down");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));
    const logErrorSpy = vi.spyOn(lib, "logError").mockImplementation();

    await expect(processSparql(["--sparql", "q"]))
      .rejects.toThrow("process.exit: 1");
    expect(fetch).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith(
      "Error executing SPARQL query against https://query.wikidata.org/sparql", error.toString()
    );
  });

  test("named preset usage", async () => {
    const sampleBindings = [];
    const fakeResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ results: { bindings: sampleBindings } }),
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fakeResponse));

    const createEventSpy = vi.spyOn(lib, "createSQSEventFromDigest");
    const handlerSpy = vi.spyOn(lib, "digestLambdaHandler").mockResolvedValue();
    const logInfoSpy = vi.spyOn(lib, "logInfo").mockImplementation();

    const result = await main(["--sparql", "wikidata-items"]);

    expect(fetch).toHaveBeenCalledWith("https://query.wikidata.org/sparql", {
      method: "POST",
      headers: { "Content-Type": "application/sparql-query" },
      body: "SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 3",
    });
    expect(createEventSpy).toHaveBeenCalledTimes(sampleBindings.length);
    expect(handlerSpy).toHaveBeenCalledTimes(sampleBindings.length);
    expect(logInfoSpy).toHaveBeenCalledWith(
      `SPARQL query processed at https://query.wikidata.org/sparql, bindings: 0`
    );
    expect(result).toBe(true);
  });
});
