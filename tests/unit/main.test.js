import { describe, test, expect } from "vitest";

// Helper function to capture console output
function captureOutput(fn) {
  let output = "";
  const originalLog = console.log;
  console.log = (msg) => { output += msg + "\n"; };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return output;
}

// Basic tests remain unchanged as functionality is stable

describe("Main Module Import", () => {
  test("should be non-null", () => {
    const mainModule = require("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should print usage instructions, demo output, and a message when no arguments are provided", () => {
    const output = captureOutput(() => {
      const { main } = require("../../src/lib/main.js");
      main([]);
    });
    expect(output).toContain("Usage: npm run start");
    expect(output).toContain("Demo: This is a demonstration of agentic-lib's functionality.");
    expect(output).toContain("No additional arguments provided.");
  });
});

describe("CLI Arguments Handling", () => {
  test("should print provided arguments correctly", () => {
    const output = captureOutput(() => {
      const { main } = require("../../src/lib/main.js");
      main(["testArg1", "testArg2"]);
    });
    expect(output).toContain('["testArg1","testArg2"]');
  });
});

describe("Fancy Mode", () => {
  test("should print ASCII art when --fancy is provided", () => {
    const output = captureOutput(() => {
      const { main } = require("../../src/lib/main.js");
      main(["--fancy", "testArg"]);
    });
    expect(output).toContain("Agentic Lib");
  });
});

describe("Time Mode", () => {
  test("should print the current time when --time is provided", () => {
    const output = captureOutput(() => {
      const { main } = require("../../src/lib/main.js");
      main(["--time"]);
    });
    const timeRegex = /Current Time: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
    expect(output).toMatch(timeRegex);
  });
});

describe("Reverse Mode", () => {
  test("should reverse provided arguments when --reverse flag is provided", () => {
    const output = captureOutput(() => {
      const { main } = require("../../src/lib/main.js");
      main(["--reverse", "first", "second", "third"]);
    });
    expect(output).toContain('Reversed Args: ["third","second","first"]');
  });
});
