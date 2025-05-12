import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let spawnSyncMock;
let consoleLogMock;
let consoleErrorMock;
let exitMock;

describe("processValidateLint", () => {
  beforeEach(() => {
    vi.resetModules();
    spawnSyncMock = vi.fn();
    vi.doMock("child_process", () => ({ spawnSync: spawnSyncMock }));
    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    exitMock = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`EXIT:${code}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("success when eslint passes", async () => {
    spawnSyncMock.mockReturnValue({ status: 0, stdout: "", stderr: "" });
    const { processValidateLint } = await import("../source/main.js");
    await expect(
      processValidateLint(["--validate-lint"]),
    ).rejects.toThrow("EXIT:0");
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("Lint validation passed"),
    );
  });

  test("failure when eslint reports errors", async () => {
    const message = "file.js:10:5 Unexpected var [no-var]";
    spawnSyncMock.mockReturnValue({ status: 1, stdout: message, stderr: "" });
    const { processValidateLint } = await import("../source/main.js");
    await expect(
      processValidateLint(["--validate-lint"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"file":"file.js"'),
    );
  });

  test("error on spawn failure", async () => {
    spawnSyncMock.mockImplementation(() => { throw new Error("spawn error"); });
    const { processValidateLint } = await import("../source/main.js");
    await expect(
      processValidateLint(["--validate-lint"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Lint process failed"),
    );
  });

  test("returns false when flag not provided", async () => {
    const { processValidateLint } = await import("../source/main.js");
    const result = await processValidateLint([]);
    expect(result).toBe(false);
  });
});