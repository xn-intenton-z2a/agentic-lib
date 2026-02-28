import { describe, it, expect } from 'vitest';
import { enhanceIssue } from '../../../../src/actions/agentic-step/tasks/enhance-issue.js';

describe('tasks/enhance-issue', () => {
  it('exports an async function', () => {
    expect(typeof enhanceIssue).toBe('function');
    expect(enhanceIssue.constructor.name).toBe('AsyncFunction');
  });
});
