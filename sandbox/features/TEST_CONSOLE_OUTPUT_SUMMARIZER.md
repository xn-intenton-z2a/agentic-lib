# Purpose
Integrate the test console output summarizer into the CI workflow so that test runs automatically emit structured JSON summaries.

# Value Proposition
Provide CI pipelines and developers with a single command to run the full test suite and receive machine-readable test results without extra scripting. This simplifies CI configuration and accelerates failure analysis by producing a consistent JSON report of pass, fail, skip counts, error details, and optional timing metrics.

# Success Criteria & Requirements
* Export a function summarizeTestConsoleOutput(rawOutput, options?) that returns an object with fields total, passed, failed, skipped, errors (array of unique error messages), and metrics (durationTotal and durationAverage when enabled or null otherwise)
* Introduce a CLI flag --ci-summarize-tests that spawns the test runner, captures combined stdout and stderr, and passes the output to summarizeTestConsoleOutput
* Support an optional --metrics flag alongside the CLI flag to include timing metrics in the summary
* Print the summary as a single JSON object to standard output with JSON.stringify
* Exit with code 1 if the test runner exit code is non zero or failed count is greater than zero, otherwise exit with code 0
* Increment globalThis.callCount exactly once per invocation of the CLI helper

# Implementation Details
1. In src/lib/main.js import spawn from child_process near existing imports
2. Define function summarizeTestConsoleOutput(rawOutput, options = {}) below existing utilities
   - Split rawOutput into lines
   - Count lines indicating passes, failures, and skips
   - Extract unique error messages from failure lines
   - If options.metrics is true, extract timing durations, calculate total and average
   - Return the structured summary object
3. Define async function processCiSummarizeTests(args) before other CLI helpers
   - Detect --ci-summarize-tests in args
   - Determine includeMetrics from presence of --metrics in args
   - Spawn the test script (npm test or the package.json test command) capturing stdout and stderr into rawOutput
   - Await process close event to obtain exitCode
   - Call summarizeTestConsoleOutput(rawOutput, { metrics: includeMetrics })
   - console.log(JSON.stringify(summary))
   - Increment globalThis.callCount
   - If exitCode or summary.failed is non zero call process.exit(1)
   - Return true when handled, otherwise return false
4. In main(args) at the very top invoke processCiSummarizeTests(args) and return when it handles the flag

# Verification & Acceptance
* Add Vitest tests in tests/unit/main.test.js to mock spawn for passing and failing scenarios, verifying JSON output, callCount increment, and exit code behavior
* Confirm summarizeTestConsoleOutput returns correct summary for sample outputs with and without metrics
* Run npm test to ensure new tests pass and existing tests are unaffected
* Manually invoke npx @xn-intenton-z2a/agentic-lib --ci-summarize-tests and with --metrics to validate JSON summary and exit codes