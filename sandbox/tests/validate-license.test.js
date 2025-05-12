import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let readFileMock;
let consoleLogMock;
let consoleErrorMock;
let exitMock;

describe("processValidateLicense", () => {
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

  test("success with valid SPDX identifier", async () => {
    readFileMock.mockResolvedValue("MIT License\nSome text");
    const { processValidateLicense } = await import("../source/main.js");
    await expect(
      processValidateLicense(["--validate-license"]),
    ).rejects.toThrow("EXIT:0");
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("License validation passed"),
    );
  });

  test("failure on missing file", async () => {
    readFileMock.mockRejectedValue(new Error("not found"));
    const { processValidateLicense } = await import("../source/main.js");
    await expect(
      processValidateLicense(["--validate-license"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to read license file"),
    );
  });

  test("failure on invalid SPDX identifier", async () => {
    readFileMock.mockResolvedValue("Random License\nSomething");
    const { processValidateLicense } = await import("../source/main.js");
    await expect(
      processValidateLicense(["--validate-license"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("License missing or invalid SPDX identifier"),
    );
  });

  test("returns false when flag not provided", async () => {
    const { processValidateLicense } = await import("../source/main.js");
    const result = await processValidateLicense([]);
    expect(result).toBe(false);
  });
});
