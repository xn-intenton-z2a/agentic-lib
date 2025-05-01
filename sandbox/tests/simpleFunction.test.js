import { describe, test, expect } from 'vitest';
import { simpleEcho, simpleReverse } from '../../sandbox/source/simpleFunction.js';


describe('simpleEcho function', () => {
  test('returns greeting with trimmed input', () => {
    const result = simpleEcho('  World  ');
    expect(result).toBe('Hello, World');
  });

  test('throws error on empty input', () => {
    expect(() => simpleEcho('   ')).toThrow("Invalid input: must be a non-empty string");
  });
});


describe('simpleReverse function', () => {
  test('returns reversed string with trimmed input', () => {
    const result = simpleReverse('  Hello  ');
    expect(result).toBe('olleH');
  });

  test('throws error on empty input', () => {
    expect(() => simpleReverse('   ')).toThrow("Invalid input: must be a non-empty string");
  });
});
