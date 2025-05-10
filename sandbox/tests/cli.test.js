import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import path from "path";
import fs from "fs";

// spy on console.log and clear mocks
beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  vi.restoreAllMocks();
});

import {
  generateDiagram,
  processDiagram,
  generateFeaturesOverview,
  processFeaturesOverview,
  main
} from "../source/main.js";

describe("generateDiagram", () => {
  test("returns markdown mermaid diagram by default", () => {
    const md = generateDiagram();
    expect(md).toMatch(/^```mermaid[\s\S]+```$/);
  });

  test("returns JSON object when format=json", () => {
    const obj = generateDiagram('json');
    expect(obj).toHaveProperty('nodes');
    expect(obj).toHaveProperty('links');
    expect(Array.isArray(obj.nodes)).toBe(true);
    expect(Array.isArray(obj.links)).toBe(true);
  });
});

describe("processDiagram", () => {
  test("logs markdown diagram and returns true", async () => {
    vi.mocked(console.log).mockClear();
    const handled = await processDiagram(['--diagram']);
    expect(handled).toBe(true);
    expect(console.log).toHaveBeenCalled();
  });

  test("logs JSON diagram when format=json", async () => {
    vi.mocked(console.log).mockClear();
    const handled = await processDiagram(['--diagram', '--format=json']);
    expect(handled).toBe(true);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"nodes"'));
  });

  test("returns false when not triggered", async () => {
    const handled = await processDiagram([]);
    expect(handled).toBe(false);
  });
});

describe("generateFeaturesOverview", () => {
  test("returns markdown overview by default", async () => {
    const md = await generateFeaturesOverview();
    expect(md).toContain('## TestFeature1');
    expect(md).toContain('This is the first test feature summary.');
  });

  test("returns JSON array when format=json", async () => {
    const arr = await generateFeaturesOverview('json');
    expect(Array.isArray(arr)).toBe(true);
    const names = arr.map(item => item.name);
    expect(names).toEqual(expect.arrayContaining(['TestFeature1', 'TestFeature2']));
  });
});

describe("processFeaturesOverview", () => {
  test("logs markdown overview and returns true", async () => {
    vi.mocked(console.log).mockClear();
    const handled = await processFeaturesOverview(['--features-overview']);
    expect(handled).toBe(true);
    expect(console.log).toHaveBeenCalled();
  });

  test("logs JSON overview when format=json", async () => {
    vi.mocked(console.log).mockClear();
    const handled = await processFeaturesOverview(['--features-overview', '--format=json']);
    expect(handled).toBe(true);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('"name"'));
  });

  test("returns false when not triggered", async () => {
    const handled = await processFeaturesOverview([]);
    expect(handled).toBe(false);
  });
});

describe("integration: main handles both flags together", () => {
  test("main logs combined JSON output and returns without fallback", async () => {
    vi.mocked(console.log).mockClear();
    await main(['--diagram', '--features-overview', '--format=json']);
    const logged = console.log.mock.calls[0][0];
    expect(logged).toContain('nodes');
    expect(logged).toContain('featuresOverview');
  });
});

// Tests for README content
describe("README content", () => {
  let content;
  beforeAll(() => {
    const readPath = path.resolve(process.cwd(), 'sandbox/README.md');
    content = fs.readFileSync(readPath, 'utf8');
  });
  test("contains mission link and header", () => {
    expect(content).toContain('../MISSION.md');
    expect(content).toContain('## Mission Progress');
  });
  test("contains version pattern", () => {
    expect(content).toMatch(/\d+\.\d+\.\d+/);
  });
  test("contains all CLI flags", () => {
    ['`--help`','`--diagram [--format=json|markdown]`','`--features-overview [--format=json|markdown]`','`--digest`','`--version`'].forEach(flag => {
      expect(content).toContain(flag);
    });
  });
  test("contains usage examples with code fences", () => {
    const examples = [
      `$ node sandbox/source/main.js --help`,
      `$ node sandbox/source/main.js --diagram`,
      `$ node sandbox/source/main.js --diagram --format=json`,
      `$ node sandbox/source/main.js --features-overview`,
      `$ node sandbox/source/main.js --features-overview --format=json`,
      `$ node sandbox/source/main.js --digest`,
      `$ node sandbox/source/main.js --version`
    ];
    examples.forEach(cmd => {
      const regex = new RegExp('```bash[\s\S]*' + cmd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\s\S]*```');
      expect(content).toMatch(regex);
    });
  });
  test("contains footer links", () => {
    expect(content).toContain('../CONTRIBUTING.md');
    expect(content).toContain('..LICENSE.md' || '../LICENSE.md'); // ensure LICENSE link
    expect(content).toContain('https://github.com/xn-intenton-z2a/agentic-lib');
  });
});
