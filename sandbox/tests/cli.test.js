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
  processFeaturesOverview
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
  import { main } from '../source/main.js';

  test("main logs combined JSON output and returns without fallback", async () => {
    vi.mocked(console.log).mockClear();
    await main(['--diagram', '--features-overview', '--format=json']);
    // expect a single JSON object with both keys
    const logged = console.log.mock.calls[0][0];
    expect(logged).toContain('nodes');
    expect(logged).toContain('featuresOverview');
  });
});
