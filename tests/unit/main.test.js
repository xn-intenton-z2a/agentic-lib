// tests/unit/main.test.js

import { describe, test, expect } from "vitest";
import { spawnSync } from "child_process";

// Helper function to run the CLI command
const runCLI = (args = []) => {
  const result = spawnSync("node", ["src/lib/main.js", ...args], { encoding: "utf8" });
  return result;
};


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

  test("help command displays usage", () => {
    const result = runCLI(["help"]);
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.stdout).toContain("Available commands:");
  });

  test("Unknown command prints error and usage and exits with code 1", () => {
    const result = runCLI(["unknown"]);
    expect(result.stderr).toContain("Unknown command: unknown");
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.status).toBe(1);
  });
});
