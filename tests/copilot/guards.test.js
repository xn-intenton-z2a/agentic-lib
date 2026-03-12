// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

// Mock child_process.execSync for the tests-pass guard
const mockExecSync = vi.fn();
vi.mock("child_process", () => ({
  execSync: (...args) => mockExecSync(...args),
}));

// Mock telemetry to control cumulative cost
const mockReadCumulativeCost = vi.fn(() => 0);
vi.mock("../../src/copilot/telemetry.js", () => ({
  readCumulativeCost: (...args) => mockReadCumulativeCost(...args),
}));

const { checkGuards } = await import("../../src/copilot/guards.js");

describe("guards.js", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "guards-test-"));
    mockExecSync.mockReset();
    mockReadCumulativeCost.mockReturnValue(0);
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  const baseConfig = {
    paths: { mission: { path: "MISSION.md" } },
    testScript: "npm test",
    transformationBudget: 16,
    intentionBot: { intentionFilepath: "intention.md" },
  };

  describe("transform guards", () => {
    it("skips when no MISSION.md exists", () => {
      const result = checkGuards("transform", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
      expect(result.reason).toContain("No mission file");
    });

    it("proceeds when MISSION.md exists", () => {
      writeFileSync(join(tmpDir, "MISSION.md"), "# Mission");
      const result = checkGuards("transform", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });

    it("skips when MISSION_COMPLETE.md exists", () => {
      writeFileSync(join(tmpDir, "MISSION.md"), "# Mission");
      writeFileSync(join(tmpDir, "MISSION_COMPLETE.md"), "done");
      const result = checkGuards("transform", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
      expect(result.reason).toContain("Mission already complete");
    });

    it("proceeds when MISSION_COMPLETE.md exists but supervisor is maintenance", () => {
      writeFileSync(join(tmpDir, "MISSION.md"), "# Mission");
      writeFileSync(join(tmpDir, "MISSION_COMPLETE.md"), "done");
      const result = checkGuards("transform", { ...baseConfig, supervisor: "maintenance" }, tmpDir);
      expect(result.skip).toBe(false);
    });

    it("skips when transformation budget exhausted", () => {
      writeFileSync(join(tmpDir, "MISSION.md"), "# Mission");
      mockReadCumulativeCost.mockReturnValue(16);
      const result = checkGuards("transform", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
      expect(result.reason).toContain("budget exhausted");
    });

    it("proceeds when budget has room", () => {
      writeFileSync(join(tmpDir, "MISSION.md"), "# Mission");
      mockReadCumulativeCost.mockReturnValue(15);
      const result = checkGuards("transform", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });
  });

  describe("fix-code guards", () => {
    it("skips when tests already pass", () => {
      mockExecSync.mockReturnValue("All tests passed");
      const result = checkGuards("fix-code", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
      expect(result.reason).toContain("Tests already pass");
    });

    it("proceeds when tests fail", () => {
      mockExecSync.mockImplementation(() => { throw new Error("test failure"); });
      const result = checkGuards("fix-code", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });

    it("skips when budget exhausted even if tests fail", () => {
      mockExecSync.mockImplementation(() => { throw new Error("test failure"); });
      mockReadCumulativeCost.mockReturnValue(16);
      const result = checkGuards("fix-code", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
      expect(result.reason).toContain("budget exhausted");
    });
  });

  describe("maintain-features guards", () => {
    it("skips when MISSION_COMPLETE.md exists", () => {
      writeFileSync(join(tmpDir, "MISSION_COMPLETE.md"), "done");
      const result = checkGuards("maintain-features", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
    });

    it("proceeds normally", () => {
      const result = checkGuards("maintain-features", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });
  });

  describe("maintain-library guards", () => {
    it("skips when MISSION_COMPLETE.md exists", () => {
      writeFileSync(join(tmpDir, "MISSION_COMPLETE.md"), "done");
      const result = checkGuards("maintain-library", baseConfig, tmpDir);
      expect(result.skip).toBe(true);
    });

    it("proceeds normally", () => {
      const result = checkGuards("maintain-library", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });
  });

  describe("unknown tasks", () => {
    it("never skips for unknown task names", () => {
      const result = checkGuards("supervise", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });

    it("never skips for discussions", () => {
      const result = checkGuards("discussions", baseConfig, tmpDir);
      expect(result.skip).toBe(false);
    });
  });

  describe("budget with zero means unlimited", () => {
    it("does not skip when budget is 0 (unlimited)", () => {
      writeFileSync(join(tmpDir, "MISSION.md"), "# Mission");
      mockReadCumulativeCost.mockReturnValue(999);
      const result = checkGuards("transform", { ...baseConfig, transformationBudget: 0 }, tmpDir);
      expect(result.skip).toBe(false);
    });
  });
});
