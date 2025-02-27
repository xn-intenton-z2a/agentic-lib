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
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
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
