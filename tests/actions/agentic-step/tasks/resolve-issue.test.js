import { describe, it, expect } from 'vitest';
import { resolveIssue } from '../../../../src/actions/agentic-step/tasks/resolve-issue.js';

describe('tasks/resolve-issue', () => {
  it('exports an async function', () => {
    expect(typeof resolveIssue).toBe('function');
    expect(resolveIssue.constructor.name).toBe('AsyncFunction');
  });
});
