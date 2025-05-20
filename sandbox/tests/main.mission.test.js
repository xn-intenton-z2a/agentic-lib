import { describe, test, expect, vi } from "vitest";

// Mock fs to return dummy mission content
vi.mock("fs", () => ({
  readFileSync: (path, encoding) => "dummy mission"
}));

import { main } from "../source/main.js";

describe("Mission Flag", () => {
  test("should print mission statement and return early", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await main(["--mission"]);
    expect(logSpy).toHaveBeenCalledWith("dummy mission");
    logSpy.mockRestore();
  });
});