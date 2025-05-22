import { describe, test, expect } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("CLI Features Flag", () => {
  test("node sandbox/source/main.js --features prints valid JSON and exits 0", async () => {
    // Execute the CLI command
    const { stdout, stderr } = await execAsync(
      "node sandbox/source/main.js --features"
    );

    // Ensure no error output
    expect(stderr).toBe("");

    // Parse JSON output
    let json;
    expect(() => {
      json = JSON.parse(stdout);
    }).not.toThrow();

    // Validate structure
    expect(json).toHaveProperty("features");
    expect(Array.isArray(json.features)).toBe(true);
    expect(json.features.length).toBeGreaterThan(0);

    // Ensure HTTP_INTERFACE feature is present
    const feature = json.features.find(
      (f) => f.name === "HTTP_INTERFACE"
    );
    expect(feature).toBeDefined();
    expect(typeof feature.title).toBe("string");
    expect(feature.title.length).toBeGreaterThan(0);
  });
});
