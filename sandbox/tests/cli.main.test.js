import { describe, test, expect } from "vitest";
import { main } from "../../src/lib/main.js";

// This test ensures that the main function completes without error when no arguments are provided.

describe("CLI Main Function", () => {
  test("main completes without error when no arguments are provided", async () => {
    await expect(main([])).resolves.toBeUndefined();
  });
});
