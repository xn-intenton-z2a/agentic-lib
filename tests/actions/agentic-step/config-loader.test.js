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
    it("loads a minimal config with defaults", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(configPath, "schedule: schedule-2\n");

      const config = loadConfig(configPath);
      expect(config.schedule).toBe("schedule-2");
      expect(config.buildScript).toBe("npm run build");
      expect(config.testScript).toBe("npm test");
      expect(config.mainScript).toBe("npm run start");
      expect(config.featureDevelopmentIssuesWipLimit).toBe(2);
      expect(config.maintenanceIssuesWipLimit).toBe(1);
      expect(config.attemptsPerBranch).toBe(3);
      expect(config.attemptsPerIssue).toBe(2);
      expect(config.tdd).toBe(false);
      expect(config.writablePaths).toEqual([]);
      expect(config.readOnlyPaths).toEqual([]);
    });

    it("parses writable and read-only paths from config", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(
        configPath,
        [
          "paths:",
          "  source:",
          "    path: src/",
          "    permissions:",
          "      - write",
          "  readme:",
          "    path: README.md",
          "  mission: MISSION.md",
        ].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.writablePaths).toEqual(["src/"]);
      expect(config.readOnlyPaths).toContain("README.md");
      expect(config.readOnlyPaths).toContain("MISSION.md");
    });

    it("reads tdd flag from config", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(configPath, "tdd: true\n");

      const config = loadConfig(configPath);
      expect(config.tdd).toBe(true);
    });

    it("defaults tdd to false when not set", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(configPath, "schedule: schedule-1\n");

      const config = loadConfig(configPath);
      expect(config.tdd).toBe(false);
    });

    it("parses custom scripts", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(
        configPath,
        ["buildScript: make build", "testScript: make test", "mainScript: node app.js"].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.buildScript).toBe("make build");
      expect(config.testScript).toBe("make test");
      expect(config.mainScript).toBe("node app.js");
    });

    it("parses array-style paths", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(
        configPath,
        ["paths:", "  otherTests:", "    paths:", "      - tests/unit/", "      - tests/integration/"].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.readOnlyPaths).toContain("tests/unit/");
      expect(config.readOnlyPaths).toContain("tests/integration/");
    });

    it("parses path with limit", () => {
      const configPath = join(tmpDir, "config.yml");
      writeFileSync(
        configPath,
        ["paths:", "  features:", "    path: features/", "    permissions:", "      - write", "    limit: 4"].join(
          "\n",
        ),
      );

      const config = loadConfig(configPath);
      expect(config.paths.features.limit).toBe(4);
      expect(config.writablePaths).toContain("features/");
    });
  });

  describe("loadConfig with TOML", () => {
    it("loads a TOML config file", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(
        configPath,
        [
          "[schedule]",
          'tier = "schedule-2"',
          "",
          "[paths]",
          'mission = "MISSION.md"',
          'source = "src/lib/"',
          'tests = "tests/unit/"',
          "",
          "[execution]",
          'build = "make build"',
          'test = "make test"',
          'start = "node app.js"',
          "",
          "[limits]",
          "feature-issues = 3",
          "maintenance-issues = 2",
          "attempts-per-branch = 5",
          "attempts-per-issue = 4",
          "",
          "[bot]",
          'log-file = "log.md"',
        ].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.schedule).toBe("schedule-2");
      expect(config.buildScript).toBe("make build");
      expect(config.testScript).toBe("make test");
      expect(config.mainScript).toBe("node app.js");
      expect(config.featureDevelopmentIssuesWipLimit).toBe(3);
      expect(config.maintenanceIssuesWipLimit).toBe(2);
      expect(config.attemptsPerBranch).toBe(5);
      expect(config.attemptsPerIssue).toBe(4);
      expect(config.intentionBot.intentionFilepath).toBe("log.md");
    });

    it("marks source/tests/features as writable in TOML", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(
        configPath,
        [
          "[paths]",
          'mission = "MISSION.md"',
          'source = "src/lib/"',
          'tests = "tests/unit/"',
          'features = ".github/agentic-lib/features/"',
        ].join("\n"),
      );

      const config = loadConfig(configPath);
      expect(config.writablePaths).toContain("src/lib/");
      expect(config.writablePaths).toContain("tests/unit/");
      expect(config.writablePaths).toContain(".github/agentic-lib/features/");
      expect(config.readOnlyPaths).toContain("MISSION.md");
    });

    it("defaults missing TOML sections", () => {
      const configPath = join(tmpDir, "config.toml");
      writeFileSync(configPath, '[schedule]\ntier = "schedule-1"\n');

      const config = loadConfig(configPath);
      expect(config.buildScript).toBe("npm run build");
      expect(config.testScript).toBe("npm test");
      expect(config.writablePaths).toEqual([]);
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
