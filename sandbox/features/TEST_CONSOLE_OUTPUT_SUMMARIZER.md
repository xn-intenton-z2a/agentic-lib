# Purpose
Enhance the CLI to include a flag for summarizing raw test console output and update USAGE.md with practical examples demonstrating its usage.

# Value Proposition
Provide developers and automation agents with an easy way to generate concise summaries of test results directly from the command line. This accelerates debugging and improves observability in CI/CD pipelines by highlighting key metrics and errors without manual parsing.

# Success Criteria & Requirements
* Add a new CLI flag `--summarize-output <filePath>` that reads a test runner console output file and prints a summary to stdout.
* Support an optional flag `--format <text|json>`, defaulting to `text`.
* On invocation increment globalThis.callCount.
* Exit with code 0 on successful summary, non-zero on errors.
* Enhance USAGE.md with clear usage examples for both text and json formats, including sample invocations and expected console output snippets.

# Implementation Details
1. In `src/lib/main.js`, after existing CLI helper functions, add a function `processSummarizerCLI(args)` to:
   - Detect `--summarize-output` flag and parse the next argument as `filePath`.
   - Detect optional `--format` flag and parse its value.
   - Read the file content at `filePath` (use `fs/promises`).
   - Call the existing `summarizeTestConsoleOutput(output, { format })` function.
   - Print the returned summary (string or object) to console. For JSON format, use `JSON.stringify` with indentation of 2.
   - Increment `globalThis.callCount`.
   - Return `true` to signal the flag was handled.
2. In the `main(args)` function, before the default fallback, insert:
   ```js
   if (await processSummarizerCLI(args)) {
     if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
     return;
   }
   ```
3. In `README.md` under CLI Usage, add a new section titled "Summarize Test Console Output" with examples:
   ```
   # Summarize Test Console Output

   # Text format (default)
   npx agentic-lib --summarize-output path/to/test-output.log

   Total: 50 tests run
   Passed: 48
   Failed: 2
   Skipped: 0
   Errors:
     ● should handle edge case
       Error: expected "foo" to equal "bar"
     ● should throw on invalid input
       Error: received null

   # JSON format
   npx agentic-lib --summarize-output path/to/test-output.log --format json

   {
     "total":50,
     "passed":48,
     "failed":2,
     "skipped":0,
     "errors":[
       "expected \"foo\" to equal \"bar\"",
       "received null"
     ]
   }
   ```
4. Update USAGE.md if present, otherwise consolidate examples into README.md. Ensure both files reflect the new flag and examples.
5. Add Vitest tests in `tests/unit/main.test.js` to:
   - Mock `fs.promises.readFile` to return a sample console output string.
   - Verify that calling `main(["--summarize-output","dummy.log"])` prints the expected summary.
   - Test both default text and `--format json` cases.
   - Confirm `globalThis.callCount` increments correctly.

# Verification & Acceptance
* Manual inspection of USAGE.md and README.md shows the new section with valid examples.
* Run `npm test` and confirm new tests pass and no regressions occur.
* Use the CLI in a local shell to verify the `--summarize-output` flag produces correct summaries and exit codes.