// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readOptionalFile, scanDirectory, formatPathsSection, supportsReasoningEffort, logTuningParam } from "../../../src/actions/agentic-step/copilot.js";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("readOptionalFile", () => {
  it("returns file content when file exists", () => {
    const dir = join(tmpdir(), `copilot-test-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, "test.txt");
    writeFileSync(file, "hello world");
    try {
      expect(readOptionalFile(file)).toBe("hello world");
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  it("returns empty string when file does not exist", () => {
    expect(readOptionalFile("/nonexistent/path/file.txt")).toBe("");
  });

  it("respects content limit", () => {
    const dir = join(tmpdir(), `copilot-test-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, "test.txt");
    writeFileSync(file, "abcdefghij");
    try {
      expect(readOptionalFile(file, 5)).toBe("abcde");
    } finally {
      rmSync(dir, { recursive: true });
    }
  });
});

describe("scanDirectory", () => {
  let dir;

  beforeEach(() => {
    dir = join(tmpdir(), `copilot-scan-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "a.md"), "# Alpha");
    writeFileSync(join(dir, "b.md"), "# Beta");
    writeFileSync(join(dir, "c.txt"), "not markdown");
    writeFileSync(join(dir, "d.md"), "# Delta");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true });
  });

  it("returns files matching extension", () => {
    const result = scanDirectory(dir + "/", ".md");
    expect(result).toHaveLength(3);
    expect(result.map((f) => f.name).sort()).toEqual(["a.md", "b.md", "d.md"]);
  });

  it("respects fileLimit", () => {
    const result = scanDirectory(dir + "/", ".md", { fileLimit: 2 });
    expect(result).toHaveLength(2);
  });

  it("respects contentLimit", () => {
    const result = scanDirectory(dir + "/", ".md", { contentLimit: 3 });
    expect(result[0].content).toBe("# A");
  });

  it("supports array of extensions", () => {
    const result = scanDirectory(dir + "/", [".md", ".txt"]);
    expect(result).toHaveLength(4);
  });

  it("works when directory path does not have trailing slash", () => {
    const result = scanDirectory(dir, ".md");
    expect(result).toHaveLength(3);
    expect(result.map((f) => f.name).sort()).toEqual(["a.md", "b.md", "d.md"]);
    // Verify content was read correctly (not corrupted by missing separator)
    expect(result.find((f) => f.name === "a.md").content).toBe("# Alpha");
  });

  it("returns empty array for nonexistent directory", () => {
    expect(scanDirectory("/nonexistent/", ".md")).toEqual([]);
  });
});

describe("formatPathsSection", () => {
  it("formats writable and read-only paths", () => {
    const result = formatPathsSection(["src/", "tests/"], ["README.md"]);
    expect(result).toContain("- src/");
    expect(result).toContain("- tests/");
    expect(result).toContain("- README.md");
    expect(result).toContain("Writable");
    expect(result).toContain("Read-Only");
  });

  it("shows (none) for empty paths", () => {
    const result = formatPathsSection([], []);
    expect(result).toContain("- (none)");
  });

  it("defaults readOnlyPaths to empty", () => {
    const result = formatPathsSection(["src/"]);
    expect(result).toContain("- src/");
    expect(result).toContain("- (none)");
  });

  it("includes TOML config when provided", () => {
    const toml = '[schedule]\nsupervisor = "daily"\n';
    const result = formatPathsSection(["src/"], ["README.md"], { configToml: toml });
    expect(result).toContain("### Configuration (agentic-lib.toml)");
    expect(result).toContain("```toml");
    expect(result).toContain("[schedule]");
    expect(result).toContain("supervisor");
    expect(result).toContain("daily");
  });

  it("includes package.json when provided", () => {
    const pkg = '{"name": "my-pkg", "version": "2.0.0"}';
    const result = formatPathsSection(["src/"], ["README.md"], { packageJson: pkg });
    expect(result).toContain("### Dependencies (package.json)");
    expect(result).toContain("```json");
    expect(result).toContain("my-pkg");
    expect(result).toContain("2.0.0");
  });

  it("omits context file sections when not provided", () => {
    const result = formatPathsSection(["src/"], ["README.md"]);
    expect(result).not.toContain("### Configuration");
    expect(result).not.toContain("### Dependencies");
  });
});

describe("supportsReasoningEffort", () => {
  it("returns true for gpt-5-mini", () => {
    expect(supportsReasoningEffort("gpt-5-mini")).toBe(true);
  });

  it("returns true for o4-mini", () => {
    expect(supportsReasoningEffort("o4-mini")).toBe(true);
  });

  it("returns false for claude-sonnet-4", () => {
    expect(supportsReasoningEffort("claude-sonnet-4")).toBe(false);
  });

  it("returns false for gpt-4.1", () => {
    expect(supportsReasoningEffort("gpt-4.1")).toBe(false);
  });

  it("returns false for unknown models", () => {
    expect(supportsReasoningEffort("some-future-model")).toBe(false);
  });
});

describe("logTuningParam", () => {
  it("is a function that does not throw", () => {
    expect(() => logTuningParam("reasoningEffort", "medium", "recommended", "gpt-5-mini")).not.toThrow();
  });

  it("accepts optional clip info", () => {
    expect(() => logTuningParam("featuresScan", 10, "recommended", "gpt-5-mini", { requested: 50, available: 10 })).not.toThrow();
  });
});

describe("scanDirectory clipping", () => {
  let dir;

  beforeEach(() => {
    dir = join(tmpdir(), `copilot-clip-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    for (let i = 0; i < 5; i++) {
      writeFileSync(join(dir, `file${i}.md`), "x".repeat(100));
    }
  });

  afterEach(() => {
    rmSync(dir, { recursive: true });
  });

  it("clips files when fileLimit is exceeded", () => {
    const result = scanDirectory(dir, ".md", { fileLimit: 2 });
    expect(result).toHaveLength(2);
  });

  it("clips content when contentLimit is exceeded", () => {
    const result = scanDirectory(dir, ".md", { contentLimit: 10 });
    expect(result[0].content).toHaveLength(10);
  });
});
