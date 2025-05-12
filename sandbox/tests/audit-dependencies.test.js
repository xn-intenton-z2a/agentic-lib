import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let spawnSyncMock;
let consoleLogMock;
let consoleErrorMock;
let exitMock;

describe("processAuditDependencies", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
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

  test("returns false when flag not provided", async () => {
    const { processAuditDependencies } = await import("../source/main.js");
    const result = await processAuditDependencies([]);
    expect(result).toBe(false);
  });

  test("logs error and exits when npm audit spawn fails", async () => {
    spawnSyncMock.mockImplementation(() => { throw new Error("spawn error"); });
    const { processAuditDependencies } = await import("../source/main.js");
    await expect(
      processAuditDependencies(["--audit-dependencies"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to run or parse npm audit"),
    );
  });

  test("logs error and exits when audit JSON invalid", async () => {
    spawnSyncMock.mockReturnValue({ stdout: "not json", error: null });
    const { processAuditDependencies } = await import("../source/main.js");
    await expect(
      processAuditDependencies(["--audit-dependencies"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to run or parse npm audit"),
    );
  });

  test("exits with errors for vulnerabilities above threshold", async () => {
    const auditOutput = JSON.stringify({
      metadata: { vulnerabilities: { low: 1, moderate: 2, high: 0, critical: 0 } },
      advisories: {
        "1": {
          module_name: "mod",
          severity: "moderate",
          title: "title",
          vulnerable_versions: "<1.0.0>",
          patched_versions: "^1.0.0",
          url: "https://example.com"
        }
      }
    });
    spawnSyncMock.mockReturnValue({ stdout: auditOutput, error: null });
    const { processAuditDependencies } = await import("../source/main.js");
    await expect(
      processAuditDependencies(["--audit-dependencies"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"module":"mod"'),
    );
  });

  test("logs info and exits when no vulnerabilities meet threshold", async () => {
    const auditOutput = JSON.stringify({
      metadata: { vulnerabilities: { low: 0, moderate: 0, high: 0, critical: 0 } },
      advisories: {}
    });
    spawnSyncMock.mockReturnValue({ stdout: auditOutput, error: null });
    const { processAuditDependencies } = await import("../source/main.js");
    await expect(
      processAuditDependencies(["--audit-dependencies"]),
    ).rejects.toThrow("EXIT:0");
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('"message":"Dependency audit passed"'),
    );
  });
});
