// tests/unit/main.test.js

import { describe, test, expect, vi } from "vitest";
import { spawnSync } from "child_process";

// Helper function to run the CLI command
const runCLI = (args = []) => {
  const result = spawnSync("node", ["src/lib/main.js", ...args], { encoding: "utf8" });
  return result;
};

describe("CLI Minimal Commands", () => {
  test("Displays usage when no command is provided", () => {
    const result = runCLI();
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.stdout).toContain("Available commands:");
  });

  test("self-test command outputs self-test message", () => {
    const result = runCLI(["self-test"]);
    expect(result.stdout).toContain("Running self-test...");
  });

  test("demo command outputs demo message", () => {
    const result = runCLI(["demo"]);
    expect(result.stdout).toContain("Running demo...");
  });

  test("help command displays usage", () => {
    const result = runCLI(["help"]);
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.stdout).toContain("Available commands:");
  });

  test("Unknown command prints error and usage", () => {
    const result = runCLI(["unknown"]);
    expect(result.stderr).toContain("Unknown command:");
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
  });
});
