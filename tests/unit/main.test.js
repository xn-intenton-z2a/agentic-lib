import { describe, test, expect } from "vitest";
import { spawnSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { getUsageMessage, displayUsage } from "../../src/lib/main.js";

// Helper function to run the CLI command
// eslint-disable-next-line sonarjs/no-os-command-from-path
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
    expect(result.stdout).toContain("Running self-test...");
    expect(result.stdout).toContain("Performing extended self-test validations...");
    expect(result.stdout).toContain("Running demo...");
    expect(result.stdout).toContain("Executing extended demo scenarios...");
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.stdout).toContain("Available commands:");
    expect(result.status).toBe(0);
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

  test("timestamp command outputs current timestamp", () => {
    const result = runCLI(["timestamp"]);
    expect(result.stdout).toContain("Current Timestamp:");
    const timestampOutput = result.stdout.split("Current Timestamp:")[1].trim();
    expect(new Date(timestampOutput).toString()).not.toEqual("Invalid Date");
  });

  test("about command outputs project info", () => {
    const result = runCLI(["about"]);
    expect(result.stdout).toContain("Project:");
    expect(result.stdout).toContain("Description:");
  });

  test("status command outputs project status summary", () => {
    const result = runCLI(["status"]);
    expect(result.stdout).toContain("Project:");
    expect(result.stdout).toContain("Version:");
    expect(result.stdout).toContain("Current Timestamp:");
  });

  test("fun command outputs ASCII art banner containing 'agentic-lib'", () => {
    const result = runCLI(["fun"]);
    expect(result.stdout).toContain("agentic-lib");
  });

  test("greet command outputs a greeting message", () => {
    const result = runCLI(["greet"]);
    const greetings = [
      "Hello, welcome to agentic-lib!",
      "Hi there! agentic-lib greets you warmly!",
      "Greetings from agentic-lib! Enjoy your coding journey!"
    ];
    const found = greetings.some(greeting => result.stdout.includes(greeting));
    expect(found).toBe(true);
  });

  test("echo command outputs uppercase message", () => {
    const result = runCLI(["echo", "hello", "world"]);
    expect(result.stdout).toContain("HELLO WORLD");
  });

  test("Unknown command prints error and usage and exits with code 1", () => {
    const result = runCLI(["unknown"]);
    expect(result.stderr).toContain("Unknown command: unknown");
    expect(result.stdout).toContain("Usage: node src/lib/main.js <command> [arguments...]");
    expect(result.status).toBe(1);
  });
});

describe("Default Demo Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    displayUsage();
  });
});
