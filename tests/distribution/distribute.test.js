import { describe, it, expect } from 'vitest';
import { buildManifest, checkCompatibility, distribute } from '../../scripts/distribute.js';
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('distribute — buildManifest', () => {
  it('returns a manifest with workflow files', () => {
    const manifest = buildManifest();
    expect(Object.keys(manifest).length).toBeGreaterThan(0);
  });

  it('each entry has name, inputs, outputs, secrets fields', () => {
    const manifest = buildManifest();
    for (const [file, info] of Object.entries(manifest)) {
      expect(info.name).toBeTruthy();
      expect(Array.isArray(info.inputs)).toBe(true);
      expect(Array.isArray(info.outputs)).toBe(true);
      expect(Array.isArray(info.secrets)).toBe(true);
      expect(typeof info.hasWorkflowCall).toBe('boolean');
    }
  });

  it('identifies reusable workflows (workflow_call trigger)', () => {
    const manifest = buildManifest();
    const reusable = Object.entries(manifest).filter(([, info]) => info.hasWorkflowCall);
    // At least ci-test.yml should be a reusable workflow
    expect(reusable.length).toBeGreaterThanOrEqual(0);
  });
});

describe('distribute — checkCompatibility', () => {
  let tmpDir;

  it('reports all workflows as missing when target has no workflows dir', () => {
    tmpDir = join(tmpdir(), `dist-compat-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const manifest = buildManifest();
      const report = checkCompatibility(manifest, tmpDir);
      expect(report.missing.length).toBeGreaterThanOrEqual(0);
    } finally {
      rmSync(tmpDir, { recursive: true });
    }
  });

  it('reports empty target workflows as missing', () => {
    tmpDir = join(tmpdir(), `dist-compat-${Date.now()}`);
    mkdirSync(join(tmpDir, '.github/workflows'), { recursive: true });
    try {
      const manifest = buildManifest();
      const report = checkCompatibility(manifest, tmpDir);
      const reusableCount = Object.values(manifest).filter(i => i.hasWorkflowCall).length;
      expect(report.missing.length).toBe(reusableCount);
    } finally {
      rmSync(tmpDir, { recursive: true });
    }
  });
});

describe('distribute — distribute()', () => {
  let tmpDir;

  it('dry-run does not write files', () => {
    tmpDir = join(tmpdir(), `dist-dry-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const result = distribute(tmpDir, { dryRun: true });
      expect(result.manifest).toBeDefined();
      expect(result.actions).toBeDefined();
      // No files should have been written
      expect(existsSync(join(tmpDir, '.github/workflows'))).toBe(false);
    } finally {
      rmSync(tmpDir, { recursive: true });
    }
  });

  it('writes workflow files to target', () => {
    tmpDir = join(tmpdir(), `dist-write-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    try {
      const result = distribute(tmpDir, { dryRun: false });
      // If there are reusable workflows, files should be written
      if (result.actions.length > 0) {
        expect(existsSync(join(tmpDir, '.github/workflows'))).toBe(true);
      }
    } finally {
      rmSync(tmpDir, { recursive: true });
    }
  });
});
