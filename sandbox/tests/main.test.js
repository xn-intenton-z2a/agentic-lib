import { describe, test, expect, vi } from "vitest";
import { main } from "@sandbox/source/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "sandbox/source/main.js"];
    // Default invocation with no args
    main();
  });

  test("prints Hello World! when --hello flag provided", () => {
    const logSpy = vi.spyOn(console, "log");
    main(["--hello"]);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("Hello World!");
    logSpy.mockRestore();
  });
});
