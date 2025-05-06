# Purpose
Add CLI flag --summarize-tests to output aggregated test results in structured JSON.

# Value Proposition
Provide developers and automation scripts with structured test result data, enabling easy consumption in CI pipelines and reporting systems.

# Success Criteria & Requirements
* Detect the --summarize-tests flag in the CLI entry point.
* Accept a file path argument immediately following --summarize-tests or read from stdin if no path is provided.
* Upon invocation, read raw test output from the specified file or stdin and call summarizeTestConsoleOutput(output, { format: 'json' }).
* Console.log the returned object serialized with JSON.stringify(summary, null, 2).
* Increment globalThis.callCount for the CLI invocation.
* Preserve existing CLI flags and behavior when --summarize-tests is not present.

# Implementation Details
1. In src/lib/main.js, import fs from "fs/promises" if not already imported.
2. Below existing CLI helper functions, define async function processSummarizeTests(args) {
   * Check if args includes "--summarize-tests".
   * Determine the next argument as file path; if absent, read from process.stdin until end.
   * For file path: await fs.readFile(path, 'utf8'); for stdin: collect data chunks and await end.
   * Call summarizeTestConsoleOutput(output, { format: 'json' }).
   * Console.log JSON.stringify(summary, null, 2).
   * Increment globalThis.callCount.
   * Return true to indicate the flag was handled.
   * On errors (file not found, parse errors), call logError and exit with code 1.
}
3. In main(args), before falling back to default output, insert:
   if (await processSummarizeTests(args)) {
     if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
     return;
   }
4. Update README.md under CLI Usage to include:
   ## Summarize Tests
   Add description for --summarize-tests flag.
   Example invocation:
     npx @xn-intenton-z2a/agentic-lib --summarize-tests path/to/test-output.txt
   Sample output:
     {
       "total": 10,
       "passed": 8,
       "failed": 1,
       "skipped": 1,
       "errors": ["Error message details"]
     }
5. Add Vitest tests in tests/unit/main.test.js for processSummarizeTests:
   * Mock fs.readFile to return a sample output string and verify console.log is called with expected JSON summary.
   * Mock process.stdin to provide sample output when no file path is given and verify behavior.
   * Test error handling when file path is invalid; expect logError and process.exit(1).

# Verification & Acceptance
* Run npm test to ensure all new and existing tests pass.
* Confirm that invoking --summarize-tests produces valid JSON output with correct counts and errors array.
* Verify that callCount increments correctly for both programmatic and CLI invocations.
* Ensure no regressions in existing CLI behavior and tests.