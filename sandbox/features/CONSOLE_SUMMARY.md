# Purpose & Scope

Capture and summarize all console output emitted during Vitest test executions and produce a structured JSON report that aggregates messages by test suite and individual test. This enables developers and CI systems to generate a concise summary of logs, warnings, and errors for easier diagnostics and automated processing.

# Value Proposition

By providing a machine-readable console summary, users can:

- Quickly identify noisy or failing tests with grouped logs per test.
- Integrate test console summaries into dashboards or reporting tools.
- Automate alerting on repeated warnings or errors across test suites.
- Streamline post-test analysis with a single JSON report.

# Success Criteria & Requirements

1. Interception
   - Support a new CLI flag --console-summary when running Vitest via the agentic-lib wrapper.
   - Spawn Vitest with its built-in JSON reporter and intercept console.log, console.warn, and console.error during execution.

2. Parsing & Aggregation
   - Parse the JSON stream from Vitest to identify test suites and individual test cases with statuses (pass, fail, skip).
   - Map each intercepted console entry to its corresponding test case based on reporter metadata and timestamp.
   - Structure the summary with an array of testSuites, each containing:
     - suiteName
     - tests: array of { testName, status, consoleEntries: array of { level, message, timestamp } }

3. Report Output
   - Emit a top-level JSON object with keys: totalTests, passed, failed, skipped, durationMs, consoleSummary.
   - consoleSummary is the aggregated structure of suites and their console entries.
   - Support an optional --summary-file <path> flag to write the JSON report to the specified file instead of stdout.

# Dependencies & Constraints

- Use Vitest installed as a dev dependency; rely on its --reporter json output.
- Utilize Node.js child_process.spawn or exec to capture live output and timestamps.
- Ensure compatibility with Node 20 in ESM mode and maintain existing --stats and --verbose-stats behavior.

# User Scenarios & Examples

Scenario 1: Local development
  agentic-lib --console-summary
  -> JSON report with consoleSummary printed to stdout.

Scenario 2: CI integration
  agentic-lib --console-summary --summary-file test-console-report.json
  -> report written to test-console-report.json for later upload.

# Verification & Acceptance

- Unit tests mock child_process.spawn emitting Vitest JSON events and console lines; verify correct mapping of console entries to tests.
- Integration test runs a sample test suite that logs messages; confirm the JSON summary includes expected messages under the right tests.
- Manual CLI test: run agentic-lib --console-summary and inspect the JSON output for completeness and correctness.