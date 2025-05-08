# Objective
Integrate CI test summaries into Discussions Bot responses to provide immediate visibility of test results within discussion threads.

# Value Proposition
By embedding concise CI test summaries directly into Bot-generated discussion comments, developers can quickly understand test outcomes without leaving the GitHub UI, speeding up feedback loops and improving issue triage efficiency.

# Scope
- Add a new CLI flag --ci-summary to src/lib/main.js to trigger CI test execution in JSON mode.
- Implement runCITests, parseTestResults, and formatSummary functions in src/lib/main.js.
- Update package.json scripts to include a test runner command for JSON output (e.g., "test:ci-summary").
- Enhance generateUsage in src/lib/main.js to document the --ci-summary flag.
- Update sandbox/README.md to describe usage of the CI summary feature.

# Requirements
- Use child_process to invoke Vitest with --reporter=json and write output to a temporary file.
- Parse the JSON report to extract total test count, passed, failed, duration, and detailed failure messages.
- Format the summary as a markdown snippet suitable for GitHub Discussions (table or list).
- Provide a promise-based API that returns the formatted summary string for discussion bot integration.
- Add unit tests for parseTestResults and formatSummary in sandbox/tests/consoleCapture.test.js or a new test file.

# Success Criteria
- node src/lib/main.js --ci-summary runs the tests and prints the summary to stdout.
- Summary accurately reflects test metrics and includes failure details when present.
- sandbox/README.md and CLI usage instructions include and illustrate the new flag.
- Automated tests cover the new functions with at least 90% coverage in the new module.

# Verification
1. Run npm run test:ci-summary to produce a JSON report.
2. Execute node src/lib/main.js --ci-summary and verify summary output matches the JSON report.
3. Confirm updated documentation in sandbox/README.md is clear and accurate.
4. Run npm test to ensure all tests pass and coverage thresholds are met.