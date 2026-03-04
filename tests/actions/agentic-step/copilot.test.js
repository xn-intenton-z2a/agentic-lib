// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readOptionalFile, scanDirectory, formatPathsSection } from "../../../src/actions/agentic-step/copilot.js";
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
