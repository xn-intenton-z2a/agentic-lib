// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

const AGENTS_DIR = join(import.meta.dirname, "../../src/agents");

const allFiles = readdirSync(AGENTS_DIR).sort();
const mdFiles = allFiles.filter((f) => f.endsWith(".md"));
const ymlFiles = allFiles.filter((f) => f.endsWith(".yml"));

describe("src/agents", () => {
  it("has 10 files total (9 prompts + 1 config)", () => {
    expect(allFiles).toHaveLength(10);
  });

  it("has exactly 1 YAML config file (agentic-lib.yml)", () => {
    expect(ymlFiles).toEqual(["agentic-lib.yml"]);
  });

  describe("agentic-lib.yml", () => {
    let config;

    it("is valid YAML", () => {
      const content = readFileSync(join(AGENTS_DIR, "agentic-lib.yml"), "utf8");
      config = yaml.load(content);
      expect(config).toBeTruthy();
    });

    it("has a paths field", () => {
      const content = readFileSync(join(AGENTS_DIR, "agentic-lib.yml"), "utf8");
      config = yaml.load(content);
      expect(config.paths).toBeTruthy();
    });

    it("has test script", () => {
      const content = readFileSync(join(AGENTS_DIR, "agentic-lib.yml"), "utf8");
      config = yaml.load(content);
      expect(config.testScript).toBeTruthy();
    });
  });

  describe.each(mdFiles)("%s", (filename) => {
    it("is non-empty", () => {
      const stat = statSync(join(AGENTS_DIR, filename));
      expect(stat.size).toBeGreaterThan(0);
    });

    it("contains text content", () => {
      const content = readFileSync(join(AGENTS_DIR, filename), "utf8");
      expect(content.trim().length).toBeGreaterThan(0);
    });
  });
});
