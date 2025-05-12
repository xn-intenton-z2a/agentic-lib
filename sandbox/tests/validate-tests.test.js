import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let readFileMock;
let consoleLogMock;
let consoleErrorMock;
let exitMock;

describe("processValidateTests", () => {
  beforeEach(() => {
    vi.resetModules();
    readFileMock = vi.fn();
    vi.doMock("fs/promises", () => ({ readFile: readFileMock }));
    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    exitMock = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`EXIT:${code}`);
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("success when all metrics meet threshold", async () => {
    const summary = {
      statements: { pct: 85 },
      branches: { pct: 90 },
      functions: { pct: 80 },
      lines: { pct: 88 },
    };
    readFileMock.mockResolvedValue(JSON.stringify(summary));
    const { processValidateTests } = await import("../source/main.js");
    await expect(
      processValidateTests(["--validate-tests"]),
    ).rejects.toThrow("EXIT:0");
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("Test coverage validation passed"),
    );
  });

  test("failure when a metric below threshold", async () => {
    const summary = {
      statements: { pct: 75 },
      branches: { pct: 85 },
      functions: { pct: 90 },
      lines: { pct: 88 },
    };
    readFileMock.mockResolvedValue(JSON.stringify(summary));
    const { processValidateTests } = await import("../source/main.js");
    await expect(
      processValidateTests(["--validate-tests"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"metric":"statements"'),
    );
  });

  test("error on read failure", async () => {
    readFileMock.mockRejectedValue(new Error("io error"));
    const { processValidateTests } = await import("../source/main.js");
    await expect(
      processValidateTests(["--validate-tests"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to read coverage summary"),
    );
  });

  test("returns false when flag not provided", async () => {
    const { processValidateTests } = await import("../source/main.js");
    const result = await processValidateTests([]);
    expect(result).toBe(false);
  });
});