// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Mock child_process.execSync to avoid running real commands
vi.mock("child_process", () => ({
  execSync: vi.fn(() => "mock test output"),
}));

const { gatherLocalContext, buildUserPrompt } = await import("../../src/copilot/context.js");

describe("context.js", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "context-test-"));
    writeFileSync(join(tmpDir, "MISSION.md"), "# Test Mission\nDo something useful.");
    mkdirSync(join(tmpDir, "src/lib"), { recursive: true });
    writeFileSync(join(tmpDir, "src/lib/main.js"), "export function hello() { return 'hello'; }");
    mkdirSync(join(tmpDir, "tests"), { recursive: true });
    writeFileSync(join(tmpDir, "tests/main.test.js"), "import { hello } from '../src/lib/main.js'; test('works', () => { expect(hello()).toBe('hello'); });");
    mkdirSync(join(tmpDir, "features"), { recursive: true });
    writeFileSync(join(tmpDir, "features/feature-1.md"), "# Feature 1\n- [x] Done item\n- [ ] TODO item");
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("gatherLocalContext", () => {
    it("reads mission file", () => {
      const config = { paths: {}, tuning: {}, writablePaths: [], readOnlyPaths: [] };
      const ctx = gatherLocalContext(tmpDir, config);
      expect(ctx.mission).toContain("Test Mission");
    });

    it("scans source files", () => {
      const config = { paths: { source: { path: "src/lib/" } }, tuning: {}, writablePaths: [], readOnlyPaths: [] };
      const ctx = gatherLocalContext(tmpDir, config);
      expect(ctx.sourceFiles.length).toBe(1);
      expect(ctx.sourceFiles[0].name).toBe("main.js");
    });

    it("scans test files", () => {
      const config = { paths: { tests: { path: "tests/" } }, tuning: {}, writablePaths: [], readOnlyPaths: [] };
      const ctx = gatherLocalContext(tmpDir, config);
      expect(ctx.testFiles.length).toBe(1);
    });

    it("extracts feature summaries", () => {
      const config = { paths: { features: { path: "features/" } }, tuning: {}, writablePaths: [], readOnlyPaths: [] };
      const ctx = gatherLocalContext(tmpDir, config);
      expect(ctx.features.length).toBe(1);
      expect(ctx.features[0]).toContain("Feature 1");
      expect(ctx.features[0]).toContain("1/2");
    });

    it("captures test output", () => {
      const config = { paths: {}, tuning: {}, writablePaths: [], readOnlyPaths: [] };
      const ctx = gatherLocalContext(tmpDir, config);
      expect(ctx.testOutput).toBe("mock test output");
    });

    it("returns empty mission for missing MISSION.md", () => {
      const emptyDir = mkdtempSync(join(tmpdir(), "context-empty-"));
      try {
        const config = { paths: {}, tuning: {}, writablePaths: [], readOnlyPaths: [] };
        const ctx = gatherLocalContext(emptyDir, config);
        expect(ctx.mission).toBe("");
      } finally {
        rmSync(emptyDir, { recursive: true, force: true });
      }
    });

    it("includes writable and readOnly paths from config", () => {
      const config = {
        paths: {},
        tuning: {},
        writablePaths: ["src/lib/", "tests/"],
        readOnlyPaths: ["MISSION.md"],
      };
      const ctx = gatherLocalContext(tmpDir, config);
      expect(ctx.writablePaths).toEqual(["src/lib/", "tests/"]);
      expect(ctx.readOnlyPaths).toEqual(["MISSION.md"]);
    });
  });

  describe("buildUserPrompt", () => {
    it("includes mission section for agent-iterate", () => {
      const ctx = { mission: "Do something", testOutput: "all pass", sourceFiles: [], testFiles: [], features: [] };
      const prompt = buildUserPrompt("agent-iterate", ctx);
      expect(prompt).toContain("# Mission");
      expect(prompt).toContain("Do something");
    });

    it("includes source files when available", () => {
      const ctx = {
        mission: "Test",
        testOutput: "pass",
        sourceFiles: [{ name: "main.js", content: "const x = 1;" }],
        testFiles: [],
        features: [],
      };
      const prompt = buildUserPrompt("agent-iterate", ctx);
      expect(prompt).toContain("# Source Files (1)");
      expect(prompt).toContain("main.js");
    });

    it("includes test files when available", () => {
      const ctx = {
        mission: "Test",
        testOutput: "pass",
        sourceFiles: [],
        testFiles: [{ name: "main.test.js", content: "test('x', () => {});" }],
        features: [],
      };
      const prompt = buildUserPrompt("agent-iterate", ctx);
      expect(prompt).toContain("# Test Files (1)");
    });

    it("includes features when available", () => {
      const ctx = {
        mission: "Test",
        testOutput: "pass",
        sourceFiles: [],
        testFiles: [],
        features: ["Feature: X\nStatus: 1/2"],
      };
      const prompt = buildUserPrompt("agent-iterate", ctx);
      expect(prompt).toContain("# Features (1)");
    });

    it("includes GitHub issues when provided", () => {
      const ctx = { mission: "Test", testOutput: "pass", sourceFiles: [], testFiles: [], features: [] };
      const github = {
        issues: [{ number: 42, title: "Fix bug", body: "It's broken", labels: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
      };
      const prompt = buildUserPrompt("agent-issue-resolution", ctx, github);
      expect(prompt).toContain("# Open Issues (1)");
      expect(prompt).toContain("#42");
    });

    it("includes issue detail when provided", () => {
      const ctx = { mission: "Test", testOutput: "pass", sourceFiles: [], testFiles: [], features: [] };
      const github = {
        issues: [],
        issueDetail: { number: 42, title: "Fix bug", body: "Details here", comments: [] },
      };
      const prompt = buildUserPrompt("agent-issue-resolution", ctx, github);
      expect(prompt).toContain("# Issue #42: Fix bug");
      expect(prompt).toContain("Details here");
    });

    it("includes PR detail when provided", () => {
      const ctx = { mission: "Test", testOutput: "pass", sourceFiles: [], testFiles: [], features: [] };
      const github = {
        issues: [],
        prDetail: { number: 123, title: "Fix tests", body: "PR body", files: [{ path: "src/main.js" }] },
      };
      const prompt = buildUserPrompt("agent-apply-fix", ctx, github);
      expect(prompt).toContain("# PR #123: Fix tests");
      expect(prompt).toContain("src/main.js");
    });

    it("includes paths section when writable paths exist", () => {
      const ctx = {
        mission: "Test",
        testOutput: "pass",
        sourceFiles: [],
        testFiles: [],
        features: [],
        writablePaths: ["src/lib/"],
        readOnlyPaths: ["MISSION.md"],
      };
      const prompt = buildUserPrompt("agent-iterate", ctx);
      expect(prompt).toContain("## File Paths");
      expect(prompt).toContain("src/lib/");
    });

    it("skips source section for agent-maintain-library", () => {
      const ctx = {
        mission: "Test",
        testOutput: "pass",
        sourceFiles: [{ name: "main.js", content: "code" }],
        testFiles: [],
        features: [],
        libraryFiles: [{ name: "doc.md", content: "library doc" }],
        librarySources: "https://example.com",
      };
      const prompt = buildUserPrompt("agent-maintain-library", ctx);
      expect(prompt).not.toContain("# Source Files");
      expect(prompt).toContain("# Library Files");
      expect(prompt).toContain("# Sources");
    });

    it("uses agent-iterate context for unknown agent names", () => {
      const ctx = { mission: "Test", testOutput: "pass", sourceFiles: [], testFiles: [], features: [] };
      const prompt = buildUserPrompt("unknown-agent", ctx);
      expect(prompt).toContain("# Mission");
    });

    it("always includes instruction footer", () => {
      const ctx = { mission: "Test", testOutput: "pass", sourceFiles: [], testFiles: [], features: [] };
      const prompt = buildUserPrompt("agent-iterate", ctx);
      expect(prompt).toContain("Implement this mission");
    });
  });
});
