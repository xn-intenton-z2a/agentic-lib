import { describe, test, expect } from 'vitest';
import { simpleEcho } from '../../sandbox/source/simpleFunction.js';


describe('simpleEcho function', () => {
  test('returns greeting with trimmed input', () => {
    const result = simpleEcho('  World  ');
    expect(result).toBe('Hello, World');
  });

  test('throws error on empty input', () => {
    expect(() => simpleEcho('   ')).toThrow("Invalid input: must be a non-empty string");
  });
});
