# Purpose & Scope

Capture all console output (log, warn, error) emitted during Vitest test executions and produce a structured JSON report that aggregates messages by test suite and individual test. This will enhance visibility into test diagnostics and enable automated tooling to process test logs.

# Value Proposition

By aggregating console output in machine-readable form, developers and CI systems can:

- Quickly identify patterns of noisy or failing tests by reviewing structured logs.
- Integrate test console summaries into dashboards, alerting on repeated warnings or errors.
- Streamline post-test analysis by providing grouped messages per test case.

# Success Criteria & Requirements

1. Interception
   - During a Vitest run invoked via the CLI flag --summarize-tests, spawn Vitest with the built-in JSON reporter.
   - Intercept any console.log, console.warn, and console.error output emitted by tests.

2. Parsing & Aggregation
   - Parse the Vitest JSON output to identify individual test suites and test cases with status (pass, fail, skip).
   - Map each intercepted console entry to its corresponding test case based on the Vitest reporter metadata.
   - Structure the report with an array of testSuites, each containing:
     - suiteName
     - tests: array of { testName, status, consoleLogs: array of { level, message, timestamp } }

3. Report Output
   - Emit the aggregated report as JSON to stdout under the key consoleSummary, alongside existing keys totalTests, passed, failed, skipped, durationMs.
   - Support an optional flag --summary-file <path> to write the JSON report to a file instead of stdout.

# Dependencies & Constraints

- Vitest installed as a dev dependency; use its --reporter json output.
- Use Node.js child_process.spawn to capture live output and associate timestamps.
- Ensure compatibility with Node 20 ESM environment.
- Maintain existing behavior of --summarize-tests flag and backward compatibility with --stats.

# User Scenarios & Examples

Scenario 1: Developer runs agentic-lib --summarize-tests on local machine
  - Console output from tests is captured and printed as a single JSON document summarizing messages per test.

Scenario 2: CI job uses agentic-lib --summarize-tests --summary-file test-report.json
  - The report is written to test-report.json for upload or further processing.

# Verification & Acceptance

- Unit tests mock child_process.spawn to emit Vitest-like JSON events and console lines; verify correct aggregation of console logs per test.
- Integration test runs a small test suite with deliberate console.log and console.error calls; confirm JSON report contains expected messages and structure.
- Manual verification: run CLI with --summarize-tests and inspect output for grouping and completeness.