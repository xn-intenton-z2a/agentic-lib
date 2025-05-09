# JSON Test Reporter

## Objective
Enhance the existing test harness to emit structured JSON output for each test run.

## Value Proposition
Users and CI systems can parse test outcomes programmatically, integrate with dashboards, and detect failures automatically.

## Success Criteria & Requirements
- Each test invocation emits one JSON record for each test suite and each individual test.
- JSON records include suite name, test name, status (passed, failed, skipped), duration in milliseconds, timestamp, and error details when status is failed.
- Default human readable output remains unchanged unless the JSON reporter is activated.
- Compatible with Vitest reporter API and integrated into existing CLI flow.

## Implementation Details
1. Add a reporter module at src/lib/jsonTestReporter.js implementing Vitest reporter hooks onTestFileStart, onTestFileResult, onRunComplete.
2. Register the reporter in package.json under vitest.reporter or enable via CLI flag --reporter json.
3. Extend the main execution in src/lib/main.js to accept a new argument --json-report that configures Vitest to use the JSON reporter.
4. Update tests in tests/unit/main.test.js to simulate a run with the JSON reporter and assert that each console log is valid JSON matching the defined schema.

## User Scenarios
- CI pipeline runs npm test -- --json-report and pipes structured output to a test dashboard aggregator.
- Local developers use the flag to generate log files for debugging or reporting purposes.

## Verification & Acceptance
- Unit tests mock Vitest events and confirm the generated JSON lines match schema definitions for success and failure cases.
- Manual end-to-end test running Vitest with and without the --json-report flag to verify behavior.
- Ensure existing tests pass without modification when JSON reporting is not enabled.