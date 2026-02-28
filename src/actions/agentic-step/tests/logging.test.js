import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { join } from 'path';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';

// Mock @actions/core before importing logging
vi.mock('@actions/core', () => ({
  info: vi.fn(),
  warning: vi.fn(),
}));

const core = await import('@actions/core');
const { logActivity, logSafetyCheck } = await import('../logging.js');

describe('logging', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `agentic-step-log-test-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });
    vi.clearAllMocks();
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('logActivity', () => {
    it('creates a new activity log file', () => {
      const filepath = join(tmpDir, 'intention.md');
      logActivity({
        filepath,
        task: 'resolve-issue',
        outcome: 'code-generated',
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('# intent');
      expect(content).toContain('## resolve-issue at');
      expect(content).toContain('**Outcome:** code-generated');
    });

    it('appends to existing activity log', () => {
      const filepath = join(tmpDir, 'intention.md');
      writeFileSync(filepath, '# existing log\n');

      logActivity({
        filepath,
        task: 'evolve',
        outcome: 'evolved',
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('# existing log');
      expect(content).toContain('## evolve at');
    });

    it('includes issue number', () => {
      const filepath = join(tmpDir, 'intention.md');
      logActivity({
        filepath,
        task: 'resolve-issue',
        outcome: 'code-generated',
        issueNumber: '42',
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('**Issue:** #42');
    });

    it('includes PR number', () => {
      const filepath = join(tmpDir, 'intention.md');
      logActivity({
        filepath,
        task: 'fix-code',
        outcome: 'fix-applied',
        prNumber: '99',
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('**PR:** #99');
    });

    it('includes commit URL', () => {
      const filepath = join(tmpDir, 'intention.md');
      const commitUrl = 'https://github.com/org/repo/commit/abc123';
      logActivity({
        filepath,
        task: 'resolve-issue',
        outcome: 'code-generated',
        commitUrl,
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain(`**Commit:** [${commitUrl}](${commitUrl})`);
    });

    it('includes model and tokens', () => {
      const filepath = join(tmpDir, 'intention.md');
      logActivity({
        filepath,
        task: 'evolve',
        outcome: 'evolved',
        model: 'claude-sonnet-4-5',
        tokensUsed: 1500,
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('**Model:** claude-sonnet-4-5');
      expect(content).toContain('**Tokens:** 1500');
    });

    it('includes workflow URL', () => {
      const filepath = join(tmpDir, 'intention.md');
      const workflowUrl = 'https://github.com/org/repo/actions/runs/123';
      logActivity({
        filepath,
        task: 'evolve',
        outcome: 'evolved',
        workflowUrl,
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain(`**Workflow:** [${workflowUrl}](${workflowUrl})`);
    });

    it('includes details', () => {
      const filepath = join(tmpDir, 'intention.md');
      logActivity({
        filepath,
        task: 'review-issue',
        outcome: 'issue-closed',
        details: 'The feature was already implemented',
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('The feature was already implemented');
    });

    it('creates parent directories if needed', () => {
      const filepath = join(tmpDir, 'sub', 'dir', 'intention.md');
      logActivity({
        filepath,
        task: 'evolve',
        outcome: 'evolved',
      });

      const content = readFileSync(filepath, 'utf8');
      expect(content).toContain('## evolve at');
    });
  });

  describe('logSafetyCheck', () => {
    it('logs passed checks with core.info', () => {
      logSafetyCheck('wip-limit', true, { count: 1, limit: 3 });
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Safety check [wip-limit]: PASSED')
      );
    });

    it('logs blocked checks with core.warning', () => {
      logSafetyCheck('attempt-limit', false, { attempts: 3, maxAttempts: 3 });
      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining('Safety check [attempt-limit]: BLOCKED')
      );
    });

    it('includes detail values', () => {
      logSafetyCheck('issue-resolved', false, { issueNumber: 42, state: 'closed' });
      expect(core.warning).toHaveBeenCalledWith(
        expect.stringContaining('issueNumber=42')
      );
    });

    it('works with no details', () => {
      logSafetyCheck('path-writable', true);
      expect(core.info).toHaveBeenCalledWith(
        expect.stringContaining('Safety check [path-writable]: PASSED')
      );
    });
  });
});
