import { describe, test, expect, vi } from "vitest";
import fs from "fs";
import { main } from "../source/main.js";

describe("Mission Flag", () => {
  test("prints mission content and stops processing other flags", async () => {
    const missionContent = "This is the mission statement.";
    vi.spyOn(fs, "readFileSync").mockReturnValue(missionContent);
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await main(["--mission"]);

    expect(consoleLog).toHaveBeenCalledWith(missionContent);
    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleError).not.toHaveBeenCalled();

    fs.readFileSync.mockRestore();
    consoleLog.mockRestore();
    consoleError.mockRestore();
  });
});