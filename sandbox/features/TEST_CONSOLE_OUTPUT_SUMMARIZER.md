# Purpose
Add a CLI command to run the test suite and emit a structured JSON summary of test results for CI integration and local usage.

# Value Proposition
This feature enables automated systems and developers to run the test suite in one step and receive a machine readable report with pass, fail, skip counts, unique error messages, and optional timing metrics. It simplifies CI configurations and local debugging by providing a single command to execute tests and parse outputs without extra scripting.

# Success Criteria & Requirements
* Expose function summarizeTestConsoleOutput that accepts raw test output and an options object and returns an object with fields total, passed, failed, skipped, errors, and metrics containing durationTotal and durationAverage when enabled.
* Introduce CLI flag --ci-summarize-tests that spawns the test runner, captures stdout and stderr, and passes the combined output to summarizeTestConsoleOutput.
* Support optional --metrics flag to enable timing metrics in the summary.
* Print the summary as a single JSON object to standard output and exit with a non zero code if failed count is greater than zero or test runner exit code is non zero.
* Increment globalThis.callCount exactly once per invocation of the CLI helper.
* Ensure processCiSummarizeTests is called at the very start of the main function so that summarization takes priority over other CLI flags.

# Implementation Details
1. In src/lib/main.js import spawn from child_process.
2. Define function summarizeTestConsoleOutput that splits raw output into lines, counts lines indicating test pass, fail, and skip, extracts unique error messages, and computes duration metrics when requested.
3. Define async function processCiSummarizeTests that checks for --ci-summarize-tests in args, determines includeMetrics based on presence of --metrics, spawns the test script using spawn, collects output streams into rawOutput, awaits process close event, invokes summarizeTestConsoleOutput, logs JSON summary, increments callCount, and calls process.exit with code 1 when failures exist.
4. In main(args) invoke processCiSummarizeTests before all other CLI handlers and return when it handles the flag.
5. Update README.md under CLI Usage to document both flags with examples showing invocation and sample output of the JSON summary.
6. Add vitest unit tests in tests/unit/main.test.js mocking spawn to simulate passing and failing tests, verifying console output, callCount increment, exit behavior, and metrics inclusion.

# Verification & Acceptance
* Running npm test passes all new and existing tests.
* Manual invocation of npx agentic-lib --ci-summarize-tests emits a JSON summary object and sets exit code to 1 on failures and 0 on success.
* Metrics appear only when --metrics is specified and are null or omitted otherwise.
* globalThis.callCount increases by one each time the command is run.
* README.md renders the new CLI section correctly without formatting errors.