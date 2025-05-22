import { describe, test, expect } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("CLI Discussion Stats Flag", () => {
  test("node sandbox/source/main.js --discussion-stats prints JSON with zero metrics and exits 0", async () => {
    const { stdout, stderr } = await execAsync(
      "node sandbox/source/main.js --discussion-stats"
    );
    expect(stderr).toBe("");
    let json;
    expect(() => { json = JSON.parse(stdout); }).not.toThrow();
    expect(json).toHaveProperty("discussionCount");
    expect(typeof json.discussionCount).toBe("number");
    expect(json.discussionCount).toBe(0);
    expect(json).toHaveProperty("commentCount");
    expect(typeof json.commentCount).toBe("number");
    expect(json.commentCount).toBe(0);
    expect(json).toHaveProperty("uniqueAuthors");
    expect(typeof json.uniqueAuthors).toBe("number");
    expect(json.uniqueAuthors).toBe(0);
  });
});