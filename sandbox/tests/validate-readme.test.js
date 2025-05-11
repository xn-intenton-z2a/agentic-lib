import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

describe("processValidateReadme", () => {
  let readFileMock;
  let consoleLogMock;
  let consoleErrorMock;
  let exitMock;

  beforeEach(() => {
    vi.resetModules();
    readFileMock = vi.fn();
    vi.doMock("fs/promises", () => ({
      readFile: readFileMock,
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
    const { processValidateReadme } = await import("../source/main.js");
    const result = await processValidateReadme([]);
    expect(result).toBe(false);
  });

  test("should log info and return true when all references exist", async () => {
    const content =
      "Intro MISSION.md some text CONTRIBUTING.md more text LICENSE.md and link https://github.com/xn-intenton-z2a/agentic-lib";
    readFileMock.mockResolvedValue(content);
    const { processValidateReadme } = await import("../source/main.js");
    await expect(
      processValidateReadme(["--validate-readme"]),
    ).resolves.toBe(true);
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("README validation passed"),
    );
    expect(consoleErrorMock).not.toHaveBeenCalled();
  });

  test("should log errors and exit when references are missing", async () => {
    const content = "Only MISSION.md present";
    readFileMock.mockResolvedValue(content);
    const { processValidateReadme } = await import("../source/main.js");
    await expect(
      processValidateReadme(["--validate-readme"]),
    ).rejects.toThrow("EXIT:1");
    // Should error for CONTRIBUTING.md, LICENSE.md, and repo URL
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("README missing reference: CONTRIBUTING.md"),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("README missing reference: LICENSE.md"),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "README missing reference: https://github.com/xn-intenton-z2a/agentic-lib",
      ),
    );
  });

  test("combined flags: features pass but readme fails should exit with errors", async () => {
    // Mock fs/promises for both features and readme
    const readdirMock = vi.fn(async () => ["file1.md"]);
    const readFileMockCombined = vi.fn(async (filePath) => {
      if (filePath.includes("features")) {
        return "Includes MISSION.md";
      }
      // README mock missing references
      return "Only MISSION.md here";
    });
    vi.doMock("fs/promises", () => ({
      readdir: readdirMock,
      readFile: readFileMockCombined,
      writeFile: vi.fn(),
    }));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation((code) => {
        throw new Error(`EXIT:${code}`);
      });
    const { main } = await import("../source/main.js");
    await expect(
      main(["--validate-features", "--validate-readme"]),
    ).rejects.toThrow("EXIT:1");
    // Should report missing readme references
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("README missing reference"),
    );
    exitSpy.mockRestore();
  });
});
