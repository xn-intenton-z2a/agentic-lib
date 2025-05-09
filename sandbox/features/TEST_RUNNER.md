# Test Runner CLI Command

# Overview
Implement a new CLI flag --run-tests that programmatically invokes Vitest to execute unit tests inside tests/unit and sandbox/tests. The CLI captures suite names, test case results, console output, and outputs a structured JSON report.

# Objectives & Scope
- Provide a built-in test execution command in the CLI without requiring an external script.
- Support optional filter by pattern to run subsets of tests.
- Enable verbose mode to include console logs emitted by tests.
- Maintain compatibility with normal Vitest CLI invocation.

# Value Proposition
- Streamlines developer workflows by consolidating test execution into a single command.
- Facilitates CI/CD integration by producing machine-readable JSON test reports.
- Offers filtering and verbosity options to target specific test groups or troubleshoot failures.

# Requirements & Success Criteria
1. Add a --run-tests flag to the CLI argument parser.
2. Accept optional --pattern <glob> to filter test files by path or name.
3. Accept optional --verbose-logs flag to include console output in results.
4. Use Vitest Node API to programmatically load and run matching tests.
5. Capture the following for each suite and test:
   - Suite name
   - Test case name
   - Pass or fail status
   - Error message and stack trace for failures
   - Captured console outputs when verbose mode is enabled
6. Output a single JSON object with:
   {
     suites: [ ... ],
     summary: { total: number, passed: number, failed: number }
   }
7. Exit with code 0 if all tests pass, or 1 if any fail.
8. Add unit tests under tests/unit to verify flag parsing, filtering, verbosity, JSON schema, and exit codes.
9. Update README.md to document the --run-tests, --pattern, and --verbose-logs flags and the JSON report schema.

# User Scenarios & Examples
- A developer runs `node src/lib/main.js --run-tests` and sees a JSON report for all tests.
- A developer runs `node src/lib/main.js --run-tests --pattern user*` to run only user-related tests.
- A CI pipeline executes the command and parses the JSON to report in its dashboard.

# Verification & Acceptance
- Unit tests cover core scenarios and edge cases.
- Manual validation shows correct JSON output and exit codes.
- Documentation in README.md accurately describes usage and options.