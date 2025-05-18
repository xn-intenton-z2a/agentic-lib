import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock fs/promises for readFile
vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
}));

import path from "path";
import { main } from "../source/main.js";
import { readFile } from "fs/promises";

describe("--mission flag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should read and print mission statement and exit early", async () => {
    const sampleMarkdown = "# Sample Mission";
    readFile.mockResolvedValue(sampleMarkdown);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await main(["--mission"]);

    expect(readFile).toHaveBeenCalledWith(path.resolve(process.cwd(), "MISSION.md"), "utf8");
    expect(consoleSpy).toHaveBeenCalledWith(sampleMarkdown);

    consoleSpy.mockRestore();
  });
});
