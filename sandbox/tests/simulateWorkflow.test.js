import { describe, test, expect, vi, beforeEach } from "vitest";
import { readFile } from "fs/promises";

vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
}));

import { simulateWorkflow } from "../source/main.js";

describe("simulateWorkflow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("parses simple workflow", async () => {
    const yamlContent = `
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml");
    expect(result).toEqual({
      triggers: ["push"],
      jobs: [{ name: "build", needs: [] }],
      calls: ["actions/checkout@v2"],
    });
  });

  test("parses multi-job workflow with needs and array triggers", async () => {
    const yamlContent = `
on:
  - push
  - pull_request
jobs:
  build:
    runs-on: ubuntu-latest
    steps: []
  test:
    needs: build
    steps:
      - uses: ./reusable/workflow.yml
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml");
    expect(result).toEqual({
      triggers: ["push", "pull_request"],
      jobs: [
        { name: "build", needs: [] },
        { name: "test", needs: ["build"] },
      ],
      calls: ["./reusable/workflow.yml"],
    });
  });

  test("throws error on missing file", async () => {
    readFile.mockRejectedValue(new Error("file not found"));
    await expect(simulateWorkflow("missing.yml")).rejects.toThrow(
      "Failed to read file missing.yml: file not found"
    );
  });

  test("throws error on invalid YAML", async () => {
    readFile.mockResolvedValue("not: [invalid");
    await expect(simulateWorkflow("workflow.yml")).rejects.toThrow(
      /Failed to parse YAML/);
  });
});
