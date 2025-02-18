// tests/unit/main.test.js

import { describe, test, expect, vi } from "vitest";
import * as mainModule from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });
});

describe("selfTestCommand", () => {
  test("should output self test header", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mainModule.selfTestCommand();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("=== Self Test: Demonstrating features with expected outputs ==="));
    logSpy.mockRestore();
  });
});
