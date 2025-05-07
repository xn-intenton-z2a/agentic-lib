# Objective and Scope

Enhance the test console output summarizer to produce a structured, machine-readable summary that includes detailed information about failures, passes, and overall test statistics after a Vitest run. This feature provides a clear overview of test results to improve developer feedback loops and support automated CI reporting.

# Value Proposition

Deliver concise, actionable test summaries directly in the CLI or as a JSON artifact. Developers and CI systems can quickly identify failure reasons, test locations, and failure counts without manually scanning logs. This improves feedback speed, reduces debugging time, and supports downstream automation that reacts to test outcomes.

# Requirements

## CLI Integration
- Introduce a new flag on the main CLI entrypoint:
  --summarize-tests (alias --summary)
- When invoked, the CLI should:
  1. Run Vitest with the JSON reporter enabled to a temporary results file.
  2. Invoke the summarizer on the JSON output.
  3. Print a structured summary to stdout in both human-readable and JSON formats.
- Usage examples:
  npm run test -- --reporter=json --output tests/results.json && npm run start -- --summarize-tests
  npx agentic-lib --summarize-tests

## Summary Generation
- Read the Vitest JSON results file (default path tests/results.json or provided via an environment variable).
- Parse overall statistics:
  total tests, passed, failed, skipped, and duration.
- Extract failure details for each failed test:
  - test suite name
  - test name
  - error message
  - first stack trace line
- Construct a JSON summary object with keys:
  summary: { total, passed, failed, skipped, duration }
  failures: [ { suite, name, message, stack } ]
- Print the JSON summary to stdout prefixed with a level info log entry.

## File and Directory Handling
- Ensure the Vitest JSON reporter writes to a known file path.
- Overwrite any existing results file and clean up temporary files after summarization.
- Fail gracefully with an error log if the results file is missing or invalid.

## Dependencies & Constraints
- No new external dependencies; use built-in JSON parsing and fs utilities.
- Leverage the existing logInfo and logError functions for logging.
- Maintain Node 20 and ESM compatibility.

# Verification and Acceptance

- Add unit tests in tests/unit/testSummary.test.js that supply a sample Vitest JSON results object and assert the structure and content of the summary output.
- CLI integration test simulates a Vitest run by creating a dummy JSON results file and invoking the CLI flag --summarize-tests, then verifies the summary printed to stdout and exit code zero.
- Manual acceptance: run npx agentic-lib --summarize-tests after running tests with JSON reporter and confirm the summary matches actual test outcomes.