import { describe, test } from "vitest";
import { main } from "@sandbox/source/main.js";

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "sandbox/source/main.js"];
    main();
  });
});
