# Purpose
Align the module-index test with the actual source structure by updating its import path to reference the main library file directly.

# Value Proposition
Enhance test stability and accuracy by ensuring the module-index test imports the correct module. This prevents false negatives and supports the library’s mission of robust, agentic workflows.

# Success Criteria & Requirements

* The file `tests/unit/module-index.test.js` must import the default export from `src/lib/main.js` using a valid relative path.
* The import statement should use the path `../../src/lib/main.js` to locate the module correctly.
* The test should still assert that the default export is undefined and pass without errors.
* No other tests or source files should be affected.

# Implementation Details

1. Open `tests/unit/module-index.test.js`.
2. Replace the line:
   import anything from "@src/index.js";
   with:
   import anything from "../../src/lib/main.js";
3. Ensure the rest of the test remains unchanged.

# Verification & Acceptance

* Run `npm test` and confirm all tests pass, including the module-index test.
* Verify that the default import value `anything` is undefined as expected.
* Confirm no new lint or formatting errors are introduced.
