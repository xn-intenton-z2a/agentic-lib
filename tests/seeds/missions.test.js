// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const MISSIONS_DIR = join(import.meta.dirname, "../../src/seeds/missions");

const allFiles = readdirSync(MISSIONS_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

const EXPECTED_MISSIONS = [
  "c64-emulator",
  "cron-engine",
  "dense-encoding",
  "empty",
  "fizz-buzz",
  "hamming-distance",
  "lunar-lander",
  "markdown-compiler",
  "owl-ontology",
  "plot-code-lib",
  "ray-tracer",
  "roman-numerals",
  "string-utils",
  "time-series-lab",
];

const BOUNDED_MISSIONS = [
  "c64-emulator",
  "cron-engine",
  "dense-encoding",
  "fizz-buzz",
  "hamming-distance",
  "lunar-lander",
  "markdown-compiler",
  "plot-code-lib",
  "ray-tracer",
  "roman-numerals",
  "string-utils",
];

const ONGOING_MISSIONS = ["owl-ontology", "time-series-lab"];

describe("src/seeds/missions", () => {
  it("has 14 mission files", () => {
    expect(allFiles).toHaveLength(14);
  });

  it("contains all expected missions", () => {
    const names = allFiles.map((f) => f.replace(/\.md$/, ""));
    expect(names).toEqual(EXPECTED_MISSIONS);
  });

  describe.each(allFiles)("%s", (filename) => {
    it("starts with '# Mission'", () => {
      const content = readFileSync(join(MISSIONS_DIR, filename), "utf8");
      expect(content.trimStart().startsWith("# Mission")).toBe(true);
    });
  });

  describe.each(BOUNDED_MISSIONS)("%s has acceptance criteria", (name) => {
    it("contains '## Acceptance Criteria' section", () => {
      const content = readFileSync(join(MISSIONS_DIR, `${name}.md`), "utf8");
      expect(content).toContain("## Acceptance Criteria");
    });
  });

  describe.each(ONGOING_MISSIONS)("%s is marked as ongoing", (name) => {
    it("contains 'do not set schedule to off'", () => {
      const content = readFileSync(join(MISSIONS_DIR, `${name}.md`), "utf8");
      expect(content.toLowerCase()).toContain("do not set schedule to off");
    });
  });

  it("empty.md is a blank template", () => {
    const content = readFileSync(join(MISSIONS_DIR, "empty.md"), "utf8");
    expect(content).toContain("Describe your project");
  });

  it("zero-MISSION.md matches hamming-distance.md", () => {
    const zeroMission = readFileSync(join(MISSIONS_DIR, "../zero-MISSION.md"), "utf8");
    const hammingDistance = readFileSync(join(MISSIONS_DIR, "hamming-distance.md"), "utf8");
    expect(zeroMission).toBe(hammingDistance);
  });
});
