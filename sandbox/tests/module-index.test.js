import { describe, test, expect } from "vitest";
import anything from "../source/index.js";

describe("Index Module Exports", () => {
  test("module index should be defined", () => {
    expect(anything).toBeUndefined();
  });
});
