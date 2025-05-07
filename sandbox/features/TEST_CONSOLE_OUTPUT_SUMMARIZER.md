# Objective and Scope
Enhance the existing test console output summarization capability to aggregate failed test cases, count occurrences, and generate actionable links for each failure. This feature focuses on improving test diagnostics by providing a clear failure summary that developers can quickly navigate.

# Value Proposition
Developers receive a concise overview of all test failures in the CI or local run, reducing time spent scrolling through logs. Actionable links point to relevant source files and documentation, accelerating debugging and improving workflow efficiency.

# Requirements

- Introduce a new summarizer function `summarizeTestFailures` in src/lib/main.js that:
  - Parses raw console output from Vitest or other supported runners.
  - Identifies and counts each failed test by suite and test name.
  - Collates error messages and stack traces into grouped entries.
  - Constructs file links in the format `<filePath>:<lineNumber>` and documentation links for known error codes.

- Modify test runner invocation logic to pipe console output through the summarizer when `--summarize` flag is supplied.

- Update CLI usage text in README to include `--summarize` option description and examples.

- Add unit tests in tests/unit/main.test.js and sandbox/tests/ summarizer tests that:
  - Feed sample console logs with multiple failure patterns.
  - Verify the summary output includes correct counts, grouped messages, and valid link formats.

- Ensure no breaking changes to existing `--help`, `--version`, and `--digest` behaviours.

# User Scenarios and Examples

1. A developer runs `npm test -- --summarize`. After test execution, a summary block appears:
   - Total failures: 3
   - Suite: utils.parse tests – 2 failures
     • parse invalid JSON: link: src/lib/utils.js:45
     • parse empty input: link: src/lib/utils.js:60
   - Suite: lib.main tests – 1 failure
     • main invocation without args: link: src/lib/main.js:120

2. CI logs show a final summary section with counts and clickable file links.

# Verification and Acceptance

- Verify unit tests pass and cover edge cases (no failures, single failure, multiple suites).
- Manual test by running `node src/lib/main.js --summarize` against a sample log file.
- Confirm integration in CI environment outputs JSON-formatted summary when using `--json` alongside `--summarize`.
