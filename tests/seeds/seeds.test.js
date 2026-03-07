// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { parse as parseToml } from "smol-toml";

const SEEDS_DIR = join(import.meta.dirname, "../../src/seeds");
const ROOT_DIR = join(import.meta.dirname, "../..");

const allFiles = readdirSync(SEEDS_DIR).sort();

describe("src/seeds", () => {
  it("has 11 seed entries (10 files + missions directory)", () => {
    expect(allFiles).toHaveLength(11);
  });

  describe("zero-package.json", () => {
    let pkg;

    it("is valid JSON", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-package.json"), "utf8");
      pkg = JSON.parse(content);
      expect(pkg).toBeTruthy();
    });

    it("has required fields", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-package.json"), "utf8");
      pkg = JSON.parse(content);
      expect(pkg.name).toBeTruthy();
      expect(pkg.version).toBeTruthy();
      expect(pkg.type).toBe("module");
    });

    it("requires Node >= 24", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-package.json"), "utf8");
      pkg = JSON.parse(content);
      expect(pkg.engines?.node).toMatch(/>=24/);
    });

    it("has a test script", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-package.json"), "utf8");
      pkg = JSON.parse(content);
      expect(pkg.scripts?.test).toBeTruthy();
    });
  });

  describe("agentic-lib.toml (root config)", () => {
    it("is valid TOML (ignoring #@dist comments)", () => {
      const content = readFileSync(join(ROOT_DIR, "agentic-lib.toml"), "utf8");
      const doc = parseToml(content);
      expect(doc).toBeTruthy();
    });

    it("has required sections", () => {
      const content = readFileSync(join(ROOT_DIR, "agentic-lib.toml"), "utf8");
      const doc = parseToml(content);
      expect(doc.schedule).toBeTruthy();
      expect(doc.paths).toBeTruthy();
      expect(doc.execution).toBeTruthy();
      expect(doc.limits).toBeTruthy();
      expect(doc.bot).toBeTruthy();
    });

    it("has source and tests paths pointing to test/", () => {
      const content = readFileSync(join(ROOT_DIR, "agentic-lib.toml"), "utf8");
      const doc = parseToml(content);
      expect(doc.paths.source).toMatch(/^test\//);
      expect(doc.paths.tests).toMatch(/^test\//);
    });
  });
});
