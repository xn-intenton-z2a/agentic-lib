import { describe, test, expect } from "vitest";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

describe("CLI Stats Flag", () => {
  test("node sandbox/source/main.js --stats prints JSON with uptime and metrics and exits 0", async () => {
    const { stdout, stderr } = await execAsync(
      "node sandbox/source/main.js --stats"
    );
    expect(stderr).toBe("");
    let json;
    expect(() => { json = JSON.parse(stdout); }).not.toThrow();
    expect(json).toHaveProperty("uptime");
    expect(typeof json.uptime).toBe("number");
    expect(json.uptime).toBeGreaterThanOrEqual(0);
    expect(json).toHaveProperty("metrics");
    const metrics = json.metrics;
    const keys = [
      "digestInvocations",
      "digestErrors",
      "webhookInvocations",
      "webhookErrors",
      "featuresRequests",
      "missionRequests",
    ];
    keys.forEach((key) => {
      expect(metrics).toHaveProperty(key);
      expect(typeof metrics[key]).toBe("number");
      expect(metrics[key]).toBeGreaterThanOrEqual(0);
    });
  });
});