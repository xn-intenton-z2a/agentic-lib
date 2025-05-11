import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

describe("processFixFeatures", () => {
  let readdirMock;
  let readFileMock;
  let writeFileMock;
  let consoleLogMock;
  let consoleErrorMock;
  let exitMock;

  beforeEach(() => {
    vi.resetModules();
    readdirMock = vi.fn();
    readFileMock = vi.fn();
    writeFileMock = vi.fn();
    vi.doMock("fs/promises", () => ({
      readdir: readdirMock,
      readFile: readFileMock,
      writeFile: writeFileMock,
    }));
    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    exitMock = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`EXIT:${code}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("should return false when flag not provided", async () => {
    const { processFixFeatures } = await import("../source/main.js");
    const result = await processFixFeatures([]);
    expect(result).toBe(false);
  });

  test("should fix files missing reference and log info with modified filenames", async () => {
    const files = ["file1.md", "file2.md"];
    readdirMock.mockResolvedValue(files);
    readFileMock.mockImplementation(async (filePath) =>
      filePath.endsWith("file1.md") ? "# Mission existing content" : "no reference here"
    );
    writeFileMock.mockResolvedValue();

    const { processFixFeatures } = await import("../source/main.js");
    await expect(
      processFixFeatures(["--fix-features"]),
    ).rejects.toThrow("EXIT:0");

    // Only file2.md should be written
    expect(writeFileMock).toHaveBeenCalledTimes(1);
    const writtenPath = writeFileMock.mock.calls[0][0];
    const writtenContent = writeFileMock.mock.calls[0][1];
    expect(writtenPath).toContain("sandbox/features/file2.md");
    expect(writtenContent.startsWith("> See our [Mission Statement](../MISSION.md)\n\n")).toBe(true);

    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining(
        '"message":"Fixed feature files to include mission reference"',
      ),
    );
  });

  test("should log error and exit when writeFile fails", async () => {
    const files = ["only.md"];
    readdirMock.mockResolvedValue(files);
    readFileMock.mockResolvedValue("no mission present");
    writeFileMock.mockRejectedValue(new Error("disk write error"));

    const { processFixFeatures } = await import("../source/main.js");
    await expect(
      processFixFeatures(["--fix-features"]),
    ).rejects.toThrow("EXIT:1");

    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to fix feature files"),
    );
  });
});
