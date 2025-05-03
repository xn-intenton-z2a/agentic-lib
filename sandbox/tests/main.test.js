import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";

// Ensure that the global callCount is reset before tests that rely on it
beforeAll(() => {
  globalThis.callCount = 0;
});

// Reset callCount before each test
beforeEach(() => {
  globalThis.callCount = 0;
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

let mainModule;

// Dynamically import the refactored main module from sandbox/source
beforeAll(async () => {
  mainModule = await import("../../sandbox/source/main.js");
});

describe("Main Module Import", () => {
  test("should be non-null", async () => {
    const loaded = await import("../../sandbox/source/main.js");
    expect(loaded).not.toBeNull();
  });
});
