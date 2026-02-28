import { describe, it, expect } from 'vitest';
import { discussions } from '../../../../src/actions/agentic-step/tasks/discussions.js';

describe('tasks/discussions', () => {
  it('exports an async function', () => {
    expect(typeof discussions).toBe('function');
    expect(discussions.constructor.name).toBe('AsyncFunction');
  });
});
