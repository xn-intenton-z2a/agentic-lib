import { describe, test, expect } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("CLI Features Flag", () => {
  test("node sandbox/source/main.js --features prints JSON with feature descriptions and exits 0", async () => {
    const { stdout, stderr } = await execAsync(
      "node sandbox/source/main.js --features"
    );
    expect(stderr).toBe("");

    let json;
    expect(() => { json = JSON.parse(stdout); }).not.toThrow();

    expect(json).toHaveProperty("features");
    expect(Array.isArray(json.features)).toBe(true);
    expect(json.features.length).toBeGreaterThan(0);

    const feature = json.features.find((f) => f.name === "HTTP_INTERFACE");
    expect(feature).toBeDefined();
    expect(typeof feature.title).toBe("string");
    expect(feature.title.length).toBeGreaterThan(0);
    expect(feature).toHaveProperty("description");
    expect(typeof feature.description).toBe("string");
    expect(feature.description.length).toBeGreaterThan(0);
  });
});