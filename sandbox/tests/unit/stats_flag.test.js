import { describe, test, expect, vi, beforeEach } from "vitest";
import { main, logInfo } from "../../src/lib/main.js";

beforeEach(() => {
  globalThis.callCount = 0;
  vi.restoreAllMocks();
});

describe("Stats Flag CLI", () => {
  test("Zero Logs: --stats outputs only metrics JSON", async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(["--stats"]);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    const obj = JSON.parse(output);
    expect(obj).toHaveProperty('callCount', 0);
    expect(typeof obj.uptime).toBe('number');
  });

  test("With Logs: after one logInfo, --stats outputs incremented callCount", async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logInfo('test');
    await main(["--stats"]);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const obj = JSON.parse(logSpy.mock.calls[0][0]);
    expect(obj.callCount).toBe(1);
    expect(obj.uptime).toBeGreaterThanOrEqual(0);
  });

  test("Help + Stats: outputs help then metrics JSON", async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(["--help", "--stats"]);
    expect(logSpy).toHaveBeenCalledTimes(2);
    const usageOutput = logSpy.mock.calls[0][0];
    expect(usageOutput).toContain('--stats');
    const statsOutput = logSpy.mock.calls[1][0];
    const obj = JSON.parse(statsOutput);
    expect(obj.callCount).toBe(0);
    expect(typeof obj.uptime).toBe('number');
  });

  test("Version + Stats: outputs version then metrics JSON", async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await main(["--version", "--stats"]);
    expect(logSpy).toHaveBeenCalledTimes(2);
    const versionOutputRaw = logSpy.mock.calls[0][0];
    const versionObj = JSON.parse(versionOutputRaw);
    expect(versionObj).toHaveProperty('version');
    expect(typeof versionObj.timestamp).toBe('string');
    const statsOutput = logSpy.mock.calls[1][0];
    const statsObj = JSON.parse(statsOutput);
    expect(statsObj).toHaveProperty('callCount');
    expect(typeof statsObj.uptime).toBe('number');
  });
});
