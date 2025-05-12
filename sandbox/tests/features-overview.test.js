import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let writeFileMock;
let consoleLogMock;
let consoleErrorMock;
let exitMock;

describe("processFeaturesOverview", () => {
  beforeEach(() => {
    vi.resetModules();
    writeFileMock = vi.fn();
    vi.doMock("fs/promises", () => ({ writeFile: writeFileMock }));
    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    exitMock = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`EXIT:${code}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("success case: generates markdown and logs info", async () => {
    const { processFeaturesOverview } = await import("../source/main.js");
    await expect(
      processFeaturesOverview(["--features-overview"]),
    ).rejects.toThrow("EXIT:0");

    expect(writeFileMock).toHaveBeenCalledTimes(1);
    const [pathArg, contentArg] = writeFileMock.mock.calls[0];
    expect(pathArg).toContain("sandbox/docs/FEATURES_OVERVIEW.md");
    expect(contentArg).toContain("| Flag | Description |");
    expect(contentArg).toContain("| --audit-dependencies |");
    expect(contentArg).toContain("| --bridge-s3-sqs |");
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('"level":"info"'),
    );
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('"featuresOverview":'),
    );
  });

  test("overwrite behavior: running twice replaces old content", async () => {
    const { processFeaturesOverview } = await import("../source/main.js");
    // first run
    try {
      await processFeaturesOverview(["--features-overview"]);
    } catch (e) {}
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    writeFileMock.mockClear();
    // second run
    try {
      await processFeaturesOverview(["--features-overview"]);
    } catch (e) {}
    expect(writeFileMock).toHaveBeenCalledTimes(1);
  });

  test("failure case: writeFile error logs error and exits with code 1", async () => {
    writeFileMock.mockRejectedValue(new Error("disk error"));
    const { processFeaturesOverview } = await import("../source/main.js");
    await expect(
      processFeaturesOverview(["--features-overview"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to generate features overview"),
    );
  });

  test("returns false when flag not provided", async () => {
    const { processFeaturesOverview } = await import("../source/main.js");
    const result = await processFeaturesOverview([]);
    expect(result).toBe(false);
  });
});
