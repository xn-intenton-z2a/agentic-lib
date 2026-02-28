import { describe, it, expect } from 'vitest';
import { reviewIssue } from '../../../../src/actions/agentic-step/tasks/review-issue.js';

describe('tasks/review-issue', () => {
  it('exports an async function', () => {
    expect(typeof reviewIssue).toBe('function');
    expect(reviewIssue.constructor.name).toBe('AsyncFunction');
  });
});
