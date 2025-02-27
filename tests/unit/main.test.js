import { describe, test, expect } from "vitest";

// Helper function to capture console output synchronously
async function captureOutputAsync(fn) {
  let output = "";
  const originalLog = console.log;
  console.log = (msg) => { output += msg + "\n"; };
  try {
    await fn();
  } finally {
    console.log = originalLog;
  }
  return output;
}

// Updated tests to use dynamic import() for ES Modules

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("Default Demo Output", () => {
  test("should print usage instructions, demo output, and a message when no arguments are provided", async () => {
    const module = await import("../../src/lib/main.js");
    let captured = "";
    const originalLog = console.log;
    console.log = (msg) => { captured += msg + "\n"; };
    module.main([]);
    console.log = originalLog;
    expect(captured).toContain("Usage: npm run start");
    expect(captured).toContain("Demo: This is a demonstration of agentic-lib's functionality.");
    expect(captured).toContain("No additional arguments provided.");
  });
});

describe("CLI Arguments Handling", () => {
  test("should print provided arguments correctly", async () => {
    const module = await import("../../src/lib/main.js");
    let captured = "";
    const originalLog = console.log;
    console.log = (msg) => { captured += msg + "\n"; };
    module.main(["testArg1", "testArg2"]);
    console.log = originalLog;
    expect(captured).toContain('["testArg1","testArg2"]');
  });
});

describe("Fancy Mode", () => {
  test("should print ASCII art when --fancy is provided", async () => {
    const module = await import("../../src/lib/main.js");
    let captured = "";
    const originalLog = console.log;
    console.log = (msg) => { captured += msg + "\n"; };
    module.main(["--fancy", "testArg"]);
    console.log = originalLog;
    expect(captured).toContain("Agentic Lib");
  });
});

describe("Time Mode", () => {
  test("should print the current time when --time is provided", async () => {
    const module = await import("../../src/lib/main.js");
    let captured = "";
    const originalLog = console.log;
    console.log = (msg) => { captured += msg + "\n"; };
    module.main(["--time"]);
    console.log = originalLog;
    const timeRegex = /Current Time: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
    expect(captured).toMatch(timeRegex);
  });
});

describe("Reverse Mode", () => {
  test("should reverse provided arguments when --reverse flag is provided", async () => {
    const module = await import("../../src/lib/main.js");
    let captured = "";
    const originalLog = console.log;
    console.log = (msg) => { captured += msg + "\n"; };
    module.main(["--reverse", "first", "second", "third"]);
    console.log = originalLog;
    expect(captured).toContain('Reversed Args: ["third","second","first"]');
  });
});
