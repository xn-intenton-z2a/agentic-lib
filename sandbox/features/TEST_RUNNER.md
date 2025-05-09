# Test Runner CLI Command with Structured Console Output Demo

# Overview
Extend the existing test runner to aggregate console output by test suite in the JSON report and include a sandbox example demonstrating structured console output from Vitest tests. Provide clear guidance and tests in sandbox/tests to show developers how structured logs appear and can be consumed.

# Objectives & Scope

- Enhance the --run-tests command to support:
  - Consolidated log aggregation at the suite level in JSON output.
  - A sandbox demonstration suite under sandbox/tests illustrating structured console logs.
- Introduce a new flag --aggregate-logs to toggle grouping of console output under each suite.
- Maintain existing flags and behaviors: pattern filtering, verbose logging, JSON report structure, exit codes, and Vitest compatibility.
- Provide example Vitest tests in sandbox/tests that produce JSON log entries for info and error levels.

# Value Proposition

- Improves readability of large test reports by grouping related log entries with their suite context.
- Supplies a reference implementation in sandbox/tests so developers can see how to write and parse structured logs.
- Simplifies CI/CD diagnostics by providing a structured JSON object that maps each suite to its logs and test outcomes.
- Ensures backward compatibility for users who do not require log aggregation.

# Requirements & Success Criteria

1. Add a new CLI flag --aggregate-logs (boolean) to the argument parser in src/lib/main.js.
2. When --aggregate-logs is enabled, capture console output from tests and group entries under their corresponding suite name in the JSON report.
3. Preserve existing flags: --run-tests, --pattern <glob>, and --verbose-logs, ensuring compatibility with --aggregate-logs.
4. Use Vitest Node API to programmatically load and run matching tests, capturing suite names, test names, statuses, error details, and console logs.
5. Update the JSON schema to include a logs array under each suite object, containing timestamped log entries with level and message fields.
6. Create sandbox/tests/structured-logs.test.js containing example tests that call console.log and console.error with JSON-formatted entries and verify their appearance in the report.
7. Default behavior (without --aggregate-logs) remains unchanged, with logs attached per test when --verbose-logs is used.
8. Exit with code 0 if all tests pass, or 1 if any fail.
9. Add unit tests in tests/unit to verify the new flag parsing, log grouping logic, updated JSON schema, and exit codes.
10. Update sandbox/README.md to document the sandbox example test suite usage and illustrate structured output expected.

# User Scenarios & Examples

- Developer runs node src/lib/main.js --run-tests --aggregate-logs and receives a JSON report where each suite object contains its own array of log entries.
- Developer opens sandbox/tests/structured-logs.test.js to see tests that produce JSON log entries, then runs node src/lib/main.js --run-tests --pattern sandbox/tests/structured-logs.test.js --aggregate-logs to inspect the structured output.
- In CI pipeline, the command with --aggregate-logs produces a concise report consumed by log parsers to display per-suite diagnostics.

# Verification & Acceptance

- Unit tests cover flag parsing combinations, correct grouping of console outputs, JSON schema validation, and exit codes.
- Manual review confirms the report groups logs by suite and retains existing filtering and verbosity behavior.
- sandbox/tests/structured-logs.test.js runs successfully and produces log entries in the expected JSON structure.
- Documentation in sandbox/README.md accurately describes usage, example tests, flags, and the updated JSON schema.