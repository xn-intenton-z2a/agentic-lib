// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2025-2026 Polycode Limited
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig, getWritablePaths } from "../../../src/actions/agentic-step/config-loader.js";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("config-loader", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `agentic-step-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("loadConfig", () => {
    it("throws when no TOML file exists", () => {
      const configPath = join(tmpDir, "config.toml");
      expect(() => loadConfig(configPath)).toThrow(/Config file not found/);
    });

    it("loads a minimal TOML config with defaults", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(configPath, '[schedule]\nsupervisor = "weekly"\n');

      const config = loadConfig(configPath);
      expect(config.supervisor).toBe("weekly");
      expect(config.model).toBe("gpt-5-mini");
      expect(config.buildScript).toBe("npm run build");
      expect(config.testScript).toBe("npm test");
      expect(config.mainScript).toBe("npm run start");
      expect(config.featureDevelopmentIssuesWipLimit).toBe(2);
      expect(config.maintenanceIssuesWipLimit).toBe(1);
      expect(config.attemptsPerBranch).toBe(3);
      expect(config.attemptsPerIssue).toBe(2);
      expect(config.tdd).toBe(false);
      expect(config.writablePaths).toEqual([
        "src/lib/",
        "tests/unit/",
        "features/",
        "docs/",
        "examples/",
        "README.md",
        "package.json",
      ]);
      expect(config.readOnlyPaths).toEqual(["MISSION.md", "library/", "SOURCES.md", "CONTRIBUTING.md"]);
    });

    it("parses model from schedule section", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(configPath, '[schedule]\nmodel = "claude-sonnet-4"\n');

      const config = loadConfig(configPath);
      expect(config.model).toBe("claude-sonnet-4");
    });

    it("parses custom paths and marks writable keys correctly", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(
        configPath,
        [
          "[paths]",
          'mission = "MISSION.md"',
          'source = "src/lib/"',
          'tests = "tests/unit/"',
          'features = "features/"',
        ].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.writablePaths).toContain("src/lib/");
      expect(config.writablePaths).toContain("tests/unit/");
      expect(config.writablePaths).toContain("features/");
      expect(config.readOnlyPaths).toContain("MISSION.md");
    });

    it("parses execution scripts", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(
        configPath,
        ["[execution]", 'build = "make build"', 'test = "make test"', 'start = "node app.js"'].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.buildScript).toBe("make build");
      expect(config.testScript).toBe("make test");
      expect(config.mainScript).toBe("node app.js");
    });

    it("parses limits", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(
        configPath,
        [
          "[limits]",
          "feature-issues = 3",
          "maintenance-issues = 2",
          "attempts-per-branch = 5",
          "attempts-per-issue = 4",
          "features-limit = 8",
          "library-limit = 64",
        ].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.featureDevelopmentIssuesWipLimit).toBe(3);
      expect(config.maintenanceIssuesWipLimit).toBe(2);
      expect(config.attemptsPerBranch).toBe(5);
      expect(config.attemptsPerIssue).toBe(4);
      expect(config.paths.features.limit).toBe(8);
      expect(config.paths.library.limit).toBe(64);
    });

    it("parses bot config", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(configPath, '[bot]\nlog-file = "log.md"\n');

      const config = loadConfig(configPath);
      expect(config.intentionBot.intentionFilepath).toBe("log.md");
    });

    it("reads tdd flag", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(configPath, "tdd = true\n");

      const config = loadConfig(configPath);
      expect(config.tdd).toBe(true);
    });

    it("normalises library-sources key", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(configPath, '[paths]\nlibrary-sources = "LINKS.md"\n');

      const config = loadConfig(configPath);
      expect(config.paths.librarySources.path).toBe("LINKS.md");
    });

    it("returns raw configToml text", () => {
      const configPath = join(tmpDir, "config.toml");
      const tomlContent = '[schedule]\nsupervisor = "daily"\n';
      writeFileSync(configPath, tomlContent);

      const config = loadConfig(configPath);
      expect(config.configToml).toContain("[schedule]");
      expect(config.configToml).toContain('supervisor = "daily"');
    });

    it("derives TOML path from YAML-style path (3 levels up)", () => {
      // Simulate .github/agentic-lib/agents/agentic-lib.yml → project root agentic-lib.toml
      const agentsDir = join(tmpDir, ".github", "agentic-lib", "agents");
      mkdirSync(agentsDir, { recursive: true });
      const yamlPath = join(agentsDir, "agentic-lib.yml");
      writeFileSync(yamlPath, ""); // dummy, not read
      writeFileSync(join(tmpDir, "agentic-lib.toml"), '[schedule]\nsupervisor = "hourly"\n');

      const config = loadConfig(yamlPath);
      expect(config.supervisor).toBe("hourly");
    });
  });

  describe("getWritablePaths", () => {
    it("returns config writable paths by default", () => {
      const config = { writablePaths: ["src/", "tests/"] };
      expect(getWritablePaths(config)).toEqual(["src/", "tests/"]);
    });

    it("returns override paths when provided", () => {
      const config = { writablePaths: ["src/"] };
      const result = getWritablePaths(config, "lib/;dist/");
      expect(result).toEqual(["lib/", "dist/"]);
    });

    it("trims whitespace from override paths", () => {
      const config = { writablePaths: [] };
      const result = getWritablePaths(config, " src/ ; tests/ ");
      expect(result).toEqual(["src/", "tests/"]);
    });

    it("filters empty strings from override paths", () => {
      const config = { writablePaths: [] };
      const result = getWritablePaths(config, "src/;;tests/;");
      expect(result).toEqual(["src/", "tests/"]);
    });
  });
});
