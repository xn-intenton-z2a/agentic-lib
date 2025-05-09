# Test Runner CLI Command

# Overview
Extend the existing test runner to aggregate console output by test suite in the JSON report. Provide an option to group logs under each suite and deliver a clear, organized structure of test results and logs.

# Objectives & Scope
- Enhance the --run-tests command to support consolidated log aggregation at the suite level.
- Introduce a new flag --aggregate-logs to toggle grouping of console output under each suite.
- Maintain existing features: pattern filtering, verbose logging, JSON report structure, exit codes, and Vitest compatibility.

# Value Proposition
- Improves readability of large test reports by grouping related log entries with their suite context.
- Simplifies CI/CD diagnostics by providing a structured JSON object that maps each suite to its logs and test outcomes.
- Retains backward compatibility for users who do not require log aggregation.

# Requirements & Success Criteria
1. Add a new CLI flag --aggregate-logs (boolean) to the argument parser.
2. When --aggregate-logs is enabled, capture console output from tests and group entries under their corresponding suite name in the JSON report.
3. Preserve existing flags: --run-tests, --pattern <glob>, and --verbose-logs, and ensure they work in combination with --aggregate-logs.
4. Use Vitest Node API to programmatically load and run matching tests, capturing suite names, test names, statuses, error details, and console logs.
5. Update the JSON schema to include a logs array under each suite object, containing timestamped log entries.
6. Default behavior (without --aggregate-logs) remains unchanged, with logs attached per test when --verbose-logs is used.
7. Exit with code 0 if all tests pass, or 1 if any fail.
8. Add unit tests in tests/unit to verify the new flag parsing, log grouping logic, updated JSON schema, and exit codes.
9. Update README.md to document the --aggregate-logs flag and illustrate the updated JSON report structure.

# User Scenarios & Examples
- A developer runs node src/lib/main.js --run-tests --aggregate-logs and receives a JSON report where each suite object contains its own array of log entries.
- A CI pipeline executes the command with --run-tests --pattern user* and --aggregate-logs, then parses the grouped logs to display per-suite diagnostics.

# Verification & Acceptance
- Unit tests cover flag parsing combinations, correct grouping of console outputs, and JSON schema validation.
- Manual review confirms the report groups logs by suite and retains existing filtering and verbosity behavior.
- Documentation in README.md accurately describes usage, flags, and the updated JSON schema.