# Objective & Scope
Add a JSON Test Reporter option to the Vitest test runner to produce structured test results on the console. This feature updates existing scripts and configuration so that users can opt into JSON output without adding new files.

# Value Proposition
Providing test outputs in a machine-readable JSON format enables seamless integration with CI pipelines, dashboards, and external analysis tools. Teams can automate result parsing, trend tracking, and custom notifications based on structured test data.

# Success Criteria & Requirements
- Update the `test` and `test:unit` scripts in package.json to accept a `--reporter=json` flag by default or via an environment variable.
- Define a `vitest` configuration section in package.json that specifies the JSON reporter as an available option.
- No new files are created; changes apply only to package.json, README.md, and tests where necessary.
- When tests are run, the console emits a single valid JSON object summarizing the test suite, including total tests, passed, failed, and duration.

# Implementation Details
1. In package.json:
   - Add a `vitest` field with a `reporters` array including `default` and `json`.
   - Modify `test` and `test:unit` scripts to pass `--reporter=json` when an environment variable JSON_REPORTER is set to `true`, or always include it if desirable.
2. In README.md:
   - Document how to run tests with JSON output: `npm test` or `npm test -- --reporter=json`.
   - Provide a sample of the JSON payload printed on the console.
3. In tests:
   - Add or update a unit test that verifies the JSON reporter produces a parsable JSON summary, for example by capturing stdout and asserting valid JSON structure.

# User Scenarios & Examples

Scenario: CI Integration
User updates their workflow to run `npm test` and parse the resulting JSON output to fail builds on test failures and publish test metrics.

Example command:
  JSON_REPORTER=true npm test

Example output:
  {"total": 42, "passed": 40, "failed": 2, "durationMs": 1234}

# Verification & Acceptance Criteria
- Running `npm test` without flags continues to use the default console reporter unless JSON_REPORTER is set.
- Running `JSON_REPORTER=true npm test` emits valid JSON without any extra log lines.
- A new or updated test asserts that the JSON output can be parsed into an object with the expected keys.
- All existing tests continue to pass under both default and JSON reporter modes.