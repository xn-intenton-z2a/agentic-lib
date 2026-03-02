// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";
import { parse as parseToml } from "smol-toml";

const SEEDS_DIR = join(import.meta.dirname, "../../src/seeds");

const allFiles = readdirSync(SEEDS_DIR).sort();
const ymlFiles = allFiles.filter((f) => f.endsWith(".yml"));

describe("src/seeds", () => {
  it("has 9 seed files", () => {
    expect(allFiles).toHaveLength(9);
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

  describe("zero-agentic-lib.toml", () => {
    it("is valid TOML", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-agentic-lib.toml"), "utf8");
      const doc = parseToml(content);
      expect(doc).toBeTruthy();
    });

    it("has required sections", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-agentic-lib.toml"), "utf8");
      const doc = parseToml(content);
      expect(doc.schedule).toBeTruthy();
      expect(doc.paths).toBeTruthy();
      expect(doc.execution).toBeTruthy();
      expect(doc.limits).toBeTruthy();
      expect(doc.bot).toBeTruthy();
    });

    it("has source and tests paths", () => {
      const content = readFileSync(join(SEEDS_DIR, "zero-agentic-lib.toml"), "utf8");
      const doc = parseToml(content);
      expect(doc.paths.source).toBeTruthy();
      expect(doc.paths.tests).toBeTruthy();
    });
  });

  describe.each(ymlFiles)("%s", (filename) => {
    it("is valid YAML", () => {
      const content = readFileSync(join(SEEDS_DIR, filename), "utf8");
      const doc = yaml.load(content);
      expect(doc).toBeTruthy();
    });

    it("has name, on, and jobs fields", () => {
      const content = readFileSync(join(SEEDS_DIR, filename), "utf8");
      const doc = yaml.load(content);
      expect(doc.name).toBeTruthy();
      expect(doc.on || doc.true).toBeTruthy();
      expect(doc.jobs).toBeTruthy();
    });

    it("uses node 24", () => {
      const content = readFileSync(join(SEEDS_DIR, filename), "utf8");
      const nodeVersionMatches = content.match(/node-version:\s*['"]?(\d+)['"]?/g);
      if (nodeVersionMatches) {
        for (const match of nodeVersionMatches) {
          const version = match.match(/(\d+)/)?.[1];
          expect(Number(version)).toBe(24);
        }
      }
    });
  });
});
