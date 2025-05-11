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
    await expect(simulateWorkflow("missing.yml")).rejects.toThrow("Failed to read file missing.yml: file not found");
  });

  test("throws error on invalid YAML", async () => {
    readFile.mockResolvedValue("not: [invalid");
    await expect(simulateWorkflow("workflow.yml")).rejects.toThrow(/Failed to parse YAML/);
  });

  test("matrix expansion when expandMatrix is true", async () => {
    const yamlContent = `
on: push
jobs:
  job1:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu, windows]
        node: [14, 16]
    steps: []
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml", { expandMatrix: true });
    expect(result.matrixExpansions).toEqual({
      job1: [
        { os: "ubuntu", node: 14 },
        { os: "ubuntu", node: 16 },
        { os: "windows", node: 14 },
        { os: "windows", node: 16 },
      ],
    });
  });

  test("graph generation for dot format", async () => {
    const yamlContent = `
on: push
jobs:
  job1:
    runs-on: ubuntu-latest
    steps: []
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps: []
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml", { graphFormat: "dot" });
    expect(result.graph.trim().startsWith("digraph workflow")).toBe(true);
    expect(result.graph).toContain('"job1" -> "job2"');
  });

  test("graph generation for mermaid format", async () => {
    const yamlContent = `
on: push
jobs:
  job1:
    runs-on: ubuntu-latest
    steps: []
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps: []
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml", { graphFormat: "mermaid" });
    expect(result.graph.trim().startsWith("graph LR")).toBe(true);
    expect(result.graph).toContain("job1 --> job2");
  });

  test("validation collects issues for invalid dependencies", async () => {
    const yamlContent = `
on: push
jobs:
  a:
    runs-on: ubuntu-latest
    steps: []
  b:
    needs: c
    runs-on: ubuntu-latest
    steps: []
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml", { validate: true });
    expect(result.validationIssues).toEqual([
      { type: "InvalidDependency", message: "Job b needs unknown job c", location: "b" },
    ]);
  });

  test("validation returns empty array for valid workflows", async () => {
    const yamlContent = `
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps: []
`;
    readFile.mockResolvedValue(yamlContent);
    const result = await simulateWorkflow("workflow.yml", { validate: true });
    expect(result.validationIssues).toEqual([]);
  });
});
