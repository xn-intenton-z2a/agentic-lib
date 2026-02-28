import { describe, it, expect } from 'vitest';
import { maintainFeatures } from '../../../../src/actions/agentic-step/tasks/maintain-features.js';

describe('tasks/maintain-features', () => {
  it('exports an async function', () => {
    expect(typeof maintainFeatures).toBe('function');
    expect(maintainFeatures.constructor.name).toBe('AsyncFunction');
  });
});
