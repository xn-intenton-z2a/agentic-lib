import { describe, test, expect, vi, beforeEach } from "vitest";

describe("processValidateFeatures", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  test("should return false when flag not provided", async () => {
    const { processValidateFeatures } = await import("../source/main.js");
    const result = await processValidateFeatures([]);
    expect(result).toBe(false);
  });

  test("should exit with code 1 when a file is missing reference", async () => {
    // Mock filesystem with one valid and one invalid file
    vi.doMock("fs/promises", () => ({
      readdir: vi.fn(async () => ["file1.md", "file2.md"]),
      readFile: vi.fn(async (filePath) =>
        filePath.endsWith("file1.md") ? "Contains MISSION.md" : "No reference",
      ),
    }));
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`EXIT:${code}`);
    });
    const consoleErrorSpy = vi
default.mockImplementation(() => {});
    vi.doMock("fs/promises");

    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const { processValidateFeatures } = await import("../source/main.js");
    await expect(
      processValidateFeatures(["--validate-features"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("Feature file missing mission reference"),
    );
    exitSpy.mockRestore();
  });

  test("should log info when all files pass validation", async () => {
    vi.doMock("fs/promises", () => ({
      readdir: vi.fn(async () => ["file1.md"]),
      readFile: vi.fn(async () => "Some content # Mission"),
    }));
    const consoleLogSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {});
    const { processValidateFeatures } = await import("../source/main.js");
    const result = await processValidateFeatures(["--validate-features"]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("All feature files reference mission statement"),
    );
    expect(result).toBe(true);
    exitSpy.mockRestore();
  });
});
