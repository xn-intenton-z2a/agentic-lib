import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";
import { main } from "@src/lib/main.js";

// Basic tests remain unchanged as functionality is stable

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should print usage instructions, demo output, and a message when no arguments are provided", () => {
    let output = "";
    const originalLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    // Instead of calling process.exit in tests, we catch the exit call by wrapping in a try-catch
    try {
      main([]);
    } catch (e) {
      // expected process.exit
    }
    console.log = originalLog;
    expect(output).toContain("Usage: npm run start");
    expect(output).toContain("Demo: This is a demonstration of agentic-lib's functionality.");
    expect(output).toContain("No additional arguments provided.");
  });
});

describe("CLI Arguments Handling", () => {
  test("should print provided arguments correctly", () => {
    let output = "";
    const originalLog = console.log;
    console.log = (msg) => { output += msg; };
    main(["testArg1", "testArg2"]);
    console.log = originalLog;
    expect(output).toContain('["testArg1","testArg2"]');
  });
});

describe("Fancy Mode", () => {
  test("should print ASCII art when --fancy is provided", () => {
    let output = "";
    const originalLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    main(["--fancy", "testArg"]);
    console.log = originalLog;
    expect(output).toContain("Agentic Lib");
  });
});

describe("Time Mode", () => {
  test("should print the current time when --time is provided", () => {
    let output = "";
    const originalLog = console.log;
    console.log = (msg) => { output += msg + "\n"; };
    main(["--time"]);
    console.log = originalLog;
    const timeRegex = /Current Time: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
    expect(output).toMatch(timeRegex);
  });
});
