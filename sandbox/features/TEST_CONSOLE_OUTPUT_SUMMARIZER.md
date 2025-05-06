# Purpose
Add a CI integrated test console output summarizer command to run the test suite and emit a structured JSON report in a single invocation.

# Value Proposition
Allow continuous integration pipelines to execute tests and automatically generate machine readable summaries with pass, fail, skip counts, unique error messages and timing metrics, and to fail the CI step on test failures without additional scripting.

# Success Criteria & Requirements
* The existing summarizeTestConsoleOutput function continues to parse raw test output and return an object with total, passed, failed, skipped, errors and metrics fields.
* A new CLI helper processCiSummarizeTests detects the flag --ci-summarize-tests and an optional --metrics flag.
* When --ci-summarize-tests is supplied, spawn the configured test script (npm test) as a child process, capture its stdout and stderr streams until the process completes.
* After the test process exits, invoke summarizeTestConsoleOutput with includeMetrics true if --metrics was supplied, otherwise false.
* Print the JSON summary to standard output in a single JSON object format.
* If the summary.failed count is greater than zero, exit the process with a non-zero exit code to signal CI failure; otherwise continue or return normally.
* Increment globalThis.callCount exactly once per --ci-summarize-tests invocation.
* processCiSummarizeTests must be called at the very start of main before any other CLI handlers.
* Update README.md under CLI Usage to document the new --ci-summarize-tests flag with examples showing invocation and sample output.
* Add Vitest unit tests in tests/unit/main.test.js mocking the child process invocation, simulating passing and failing tests, verifying summary output, exit code behavior, and callCount increment.

# Implementation Details
1. In src/lib/main.js import spawn from "child_process" near existing imports.
2. After processSummarizeTests definition add:
   async function processCiSummarizeTests(args) {
     if args includes --ci-summarize-tests then
       const includeMetrics = args includes --metrics
       spawn the test script using spawn('npm', ['test'], { stdio: ['ignore','pipe','pipe'] })
       collect stdout and stderr data into a string rawOutput
       await child process close event to get exitCode
       const summary = summarizeTestConsoleOutput(rawOutput, { metrics: includeMetrics })
       console.log(JSON.stringify(summary))
       globalThis.callCount++
       if summary.failed > 0 or exitCode not zero then process.exit with code 1
       return true
     return false
   }
3. In main(args) at the very top insert:
   if await processCiSummarizeTests(args) then return
4. Update README.md under CLI Usage to add:
   --ci-summarize-tests [--metrics]
     Run the test suite and print a JSON summary of results and metrics if requested
   Example:
     npx agentic-lib --ci-summarize-tests --metrics
   Sample Output:
     {"total":10,"passed":8,"failed":2,"skipped":0,"errors":["edge case"],"metrics":{"durationTotal":12.3,"durationAverage":1.23}}
5. Add Vitest tests in tests/unit/main.test.js:
   - Mock spawn to emit predefined test output and exit codes
   - Verify processCiSummarizeTests returns true, prints correct JSON to console.log, increments callCount, and exits with code 1 on failures
   - Verify includeMetrics controls metrics fields in summary

# Verification & Acceptance
* Running npm test should execute new tests and existing tests without regression.
* Manual invocation of npx agentic-lib --ci-summarize-tests should run tests, emit JSON summary, and exit with non-zero code on failures.
* Metrics flag should enable timing metrics in the summary.
* Code style and formatting must conform to existing patterns.