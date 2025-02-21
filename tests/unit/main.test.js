// tests/unit/main.test.js

import { describe, test, expect, vi } from "vitest";
import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { getUsageMessage, displayUsage } from "../../src/lib/main.js";

// Helper function to run the CLI command
const runCLI = (args = []) => {
  const result = spawnSync("node", ["src/lib/main.js", ...args], { encoding: "utf8" });
  return result;
};

// Read expected version from package.json
const pkg = JSON.parse(readFileSync(join(__dirname, "../../package.json"), "utf8"));
const expectedVersion = pkg.version;


describe("CLI Minimal Commands", () => {
  test("Default mode runs self-test, demo and displays usage when no command is provided", () => {
    const result = runCLI();
    // Check that self-test and demo outputs are present along with usage message
    expect(result.stdout).toContain("Running self-test...");
    expect(result.stdout).toContain("Performing extended self-test validations...");
    expect(result.stdout).toContain("Running demo...");
    expect(result.stdout).toContain("Executing extended demo scenarios...");
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.stdout).toContain("Available commands:");
  });

  test("self-test command outputs self-test message", () => {
    const result = runCLI(["self-test"]);
    expect(result.stdout).toContain("Running self-test...");
    expect(result.stdout).toContain("Performing extended self-test validations...");
  });

  test("demo command outputs demo message", () => {
    const result = runCLI(["demo"]);
    expect(result.stdout).toContain("Running demo...");
    expect(result.stdout).toContain("Executing extended demo scenarios...");
  });

  test("publish command outputs publish message", () => {
    const result = runCLI(["publish"]);
    expect(result.stdout).toContain("Running publish...");
    expect(result.stdout).toContain("Publish functionality is under development.");
  });

  test("config command outputs configuration options", () => {
    const result = runCLI(["config"]);
    expect(result.stdout).toContain("Configuration options:");
    expect(result.stdout).toContain("theme");
    expect(result.stdout).toContain("default");
  });

  test("help command displays usage", () => {
    const result = runCLI(["help"]);
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.stdout).toContain("Available commands:");
  });

  test("version command outputs version message", () => {
    const result = runCLI(["version"]);
    expect(result.stdout).toContain("Version: " + expectedVersion);
  });

  test("Unknown command prints error and usage and exits with code 1", () => {
    const result = runCLI(["unknown"]);
    expect(result.stderr).toContain("Unknown command: unknown");
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.status).toBe(1);
  });
});

describe("Exported Functions", () => {
  test("getUsageMessage returns a valid help message", () => {
    const msg = getUsageMessage();
    expect(msg).toContain("Usage: node src/lib/main.js");
    expect(msg).toContain("Available commands:");
  });

  test("displayUsage prints the usage message to console", () => {
    const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    displayUsage();
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining("Usage: node src/lib/main.js"));
    consoleLogSpy.mockRestore();
  });
});
