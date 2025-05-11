import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import path from "path";

describe("processGenerateInteractiveExamples", () => {
  let readFileMock;
  let writeFileMock;
  let consoleLogMock;
  let consoleErrorMock;
  let exitMock;

  beforeEach(() => {
    vi.resetModules();
    readFileMock = vi.fn();
    writeFileMock = vi.fn();
    vi.doMock("fs/promises", () => ({
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

  test("Success case: HTML injection and info log", async () => {
    const sampleContent = "Intro\n```mermaid-workflow\ndiagram\n```";
    readFileMock.mockResolvedValue(sampleContent);

    const { processGenerateInteractiveExamples } = await import("../source/main.js");
    await expect(
      processGenerateInteractiveExamples(["--generate-interactive-examples"]),
    ).rejects.toThrow("EXIT:0");

    expect(writeFileMock).toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('"level":"info"'),
    );
  });

  test("Warning case: no blocks and warning log", async () => {
    readFileMock.mockResolvedValue("No code blocks here");
    const { processGenerateInteractiveExamples } = await import("../source/main.js");
    await expect(
      processGenerateInteractiveExamples(["--generate-interactive-examples"]),
    ).rejects.toThrow("EXIT:0");

    expect(writeFileMock).not.toHaveBeenCalled();
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('"level":"warn"'),
    );
  });

  test("Failure case: render error and error log", async () => {
    const sampleContent = "Intro\n```mermaid-workflow\nbroken\n```";
    readFileMock.mockResolvedValue(sampleContent);
    // Mock markdown-it to throw on render
    vi.doMock("markdown-it", () => {
      return {
        default: class {
          constructor() {}
          use() {
            return this;
          }
          render() {
            throw new Error("render failure");
          }
        },
      };
    });
    vi.doMock("markdown-it-github", () => () => {});
    const { processGenerateInteractiveExamples } = await import("../source/main.js");
    await expect(
      processGenerateInteractiveExamples(["--generate-interactive-examples"]),
    ).rejects.toThrow("EXIT:1");

    expect(writeFileMock).not.toHaveBeenCalled();
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to render mermaid-workflow"),
    );
  });
});