import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { main } from "@sandbox/source/main.js";

describe("Hello World CLI", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("prints Hello World! when --hello flag is provided", () => {
    main(["--hello"]);
    expect(logSpy).toHaveBeenCalledWith("Hello World!");
  });

  test("prints Hello World! when no arguments are provided", () => {
    main([]);
    expect(logSpy).toHaveBeenCalledWith("Hello World!");
  });
});
