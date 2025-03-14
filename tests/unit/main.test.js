import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import * as agenticLib from "../../src/lib/main.js";

beforeAll(() => {
  vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`process.exit: ${code}`);
  });
});

afterAll(() => {
  process.exit.mockRestore && process.exit.mockRestore();
});

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const mainModule = await import("../../src/lib/main.js");
    expect(mainModule).not.toBeNull();
  });
});

describe("reviewIssue", () => {
  test("returns correct resolution when conditions met", () => {
    const params = {
      sourceFileContent: "Usage: npm run start [--usage | --help] [--version] [--env] [--telemetry] [--telemetry-extended] [--reverse] [args...]"
    };
    const result = agenticLib.reviewIssue(params);
    expect(result.fixed).toBe("true");
    expect(result.message).toBe("The issue has been resolved.");
    expect(result.refinement).toBe("None");
  });
});
