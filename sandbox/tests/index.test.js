import { describe, test, expect } from 'vitest';
import * as CLI from '../source/main.js';

describe('Module exports', () => {
  test('no default export and named exports exist', () => {
    expect(CLI.default).toBeUndefined();
    expect(typeof CLI.createSQSEventFromDigest).toBe('function');
    expect(typeof CLI.digestLambdaHandler).toBe('function');
    expect(typeof CLI.main).toBe('function');
    expect(typeof CLI.logInfo).toBe('function');
    expect(typeof CLI.logError).toBe('function');
    expect(typeof CLI.logConfig).toBe('function');
  });
});
