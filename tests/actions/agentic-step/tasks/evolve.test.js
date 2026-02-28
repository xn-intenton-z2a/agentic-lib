import { describe, it, expect } from 'vitest';
import { evolve } from '../../../../src/actions/agentic-step/tasks/evolve.js';

describe('tasks/evolve', () => {
  it('exports an async function', () => {
    expect(typeof evolve).toBe('function');
    expect(evolve.constructor.name).toBe('AsyncFunction');
  });
});
