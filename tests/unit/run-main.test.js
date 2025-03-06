// tests/unit/run-main.test.js
// src/lib/main.js
//
// This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
// This file is licensed under the MIT License. For details, see LICENSE-MIT
//

import { exec } from "child_process";
import { describe, test, expect } from "vitest";

// This is a test

describe("Main Script Execution", () => {
  test("should exit with code 0", (done) => {
    exec(`${process.execPath} ./src/lib/main.js`, (error, stdout, stderr) => {
      expect(error).toBeNull();
      expect(stderr).toBe("");
      done();
    });
  });
});
