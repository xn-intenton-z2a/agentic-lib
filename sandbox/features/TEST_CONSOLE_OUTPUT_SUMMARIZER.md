# Purpose
Add a core function summarizeTestConsoleOutput to src/lib/main.js that parses raw test runner console output and generates concise summaries for CLI and programmatic use.

# Value Proposition
Provide a reusable utility that transforms verbose test output into clear metrics and error details. This enhances developer productivity and automation by highlighting test results without manual parsing, supporting both human-readable text and JSON formats.

# Success Criteria & Requirements
* Expose an exported async function summarizeTestConsoleOutput(output, options?) in src/lib/main.js.
* Accept parameters:
  * output (string): raw test runner console output
  * options.format ("text"|"json"): desired summary format, defaulting to "text".
* Parse the output to compute:
  * total number of tests run
  * passed count
  * failed count
  * skipped count
  * an array of error messages for each failed test
* For text format:
  * Return a multi-line string:
      Total: X tests run
      Passed: Y
      Failed: Z
      Skipped: W
      Errors:
        ● <error message 1>
        ● <error message 2>
* For JSON format:
  * Return a JavaScript object:
      {
        total: X,
        passed: Y,
        failed: Z,
        skipped: W,
        errors: ["message1","message2"]
      }
* Increment globalThis.callCount on each invocation.

# Implementation Details
1. In src/lib/main.js, after existing CLI helpers, import fs/promises if not already.
2. Define async function summarizeTestConsoleOutput(output, options = {}) {
     * Initialize counters and error list.
     * Split output into lines and detect test status lines using simple patterns (e.g., ✓, ✕, skipped keywords).
     * Extract error messages by locating lines starting with error markers (e.g., Error:, ●).
     * Build summary data and increment globalThis.callCount.
     * If options.format === 'json' return the summary object.
     * Otherwise format a text string matching the CLI examples.
   }
3. Export summarizeTestConsoleOutput alongside other utilities in main.js.
4. In the existing processSummarizerCLI function:
   * Import summarizeTestConsoleOutput.
   * After reading file content, call summarizeTestConsoleOutput(content, { format }).
   * If JSON format, console.log JSON.stringify(summary, null, 2).
   * Else, console.log the summary string.
   * Increment globalThis.callCount again only for CLI invocation logic if desired.

# Verification & Acceptance
* Add Vitest tests in tests/unit/main.test.js:
  * Unit tests for summarizeTestConsoleOutput parsing:
    - A sample output string with passed, failed, skipped and error messages; verify returned text and JSON variants.
  * CLI tests in processSummarizerCLI:
    - Mock fs.promises.readFile to return sample output; verify console.log called with expected text or JSON.
    - Confirm processSummarizerCLI returns true and globalThis.callCount increments correctly.
* Run npm test to ensure all new and existing tests pass.
* Confirm that README.md under CLI Usage includes the "Summarize Test Console Output" section with accurate examples.