import { describe, test, expect } from 'vitest';
import { main } from '../../src/lib/main.js';

// Test to ensure that the main function terminates without error
// by simply awaiting its execution with an empty arguments array.

describe('CLI Main Execution', () => {
  test('main function completes without throwing an error', async () => {
    await expect(main([])).resolves.toBeUndefined();
  });
});
