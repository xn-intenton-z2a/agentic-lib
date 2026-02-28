import { describe, it, expect } from 'vitest';
import { fixCode } from '../../../../src/actions/agentic-step/tasks/fix-code.js';

describe('tasks/fix-code', () => {
  it('exports an async function', () => {
    expect(typeof fixCode).toBe('function');
    expect(fixCode.constructor.name).toBe('AsyncFunction');
  });
});
