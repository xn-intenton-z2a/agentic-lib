# Objective and Scope

Introduce a new `--aggregate-logs` CLI flag that runs a defined test command (such as `npm test` or `vitest`) under the hood, captures and groups all console output by test file and test case, and then emits a single structured JSON report containing per-test stdout and stderr streams.

# Value Proposition

By providing structured, machine-readable aggregation of test run output, developers and CI systems can programmatically analyze flaky tests, extract error contexts, and integrate detailed per-test logs into dashboards or notification systems without brittle log parsing.

# Requirements

## CLI Integration

- In `src/lib/main.js`, implement `processAggregateLogs(args)`:
  - Detect a new `--aggregate-logs [command]` flag (default to `npm test`).
  - Use Node’s `child_process.spawn` to execute the specified test command, capturing stdout and stderr streams.
  - Buffer output by test file and test case boundary markers (e.g., using Vitest’s `--reporter=json` option if available, or simple regex hooks for `describe`/`it` labels).
  - On completion, build a JSON object with keys for each test suite and test case, each containing its collected logs and the test status (pass/fail).
  - Emit the JSON object via `logInfo` and exit with the original test runner exit code.

## Source File Updates

- Import Node’s `child_process` module in `main.js`.
- Add `processAggregateLogs` above other flag handlers, ensuring it runs before default behavior.
- Ensure proper error handling: if the child process fails to start, call `logError` and exit code 1.

## Test File Updates

- Create `tests/unit/aggregateLogs.test.js`:
  - Mock `child_process.spawn` to simulate a two-test suite run, emitting sample stdout and stderr fragments via the mock stream events.
  - Verify that invoking `main(["--aggregate-logs", "mock-cmd"])` captures the streams, constructs the expected JSON structure, and calls `logInfo` with the correct object.
  - Simulate spawn error to ensure `logError` is invoked and the process exits with code 1.

## README Updates

- Under **CLI Usage**, add:
  
  --aggregate-logs [command]
      Run the specified test command and output structured per-test logs as JSON. Defaults to `npm test`.

- Provide an example:
  
  npx agentic-lib --aggregate-logs "vitest --reporter=json"
  
  Output:
  {
    "suiteA.test.js": {
      "test case 1": {"status":"passed","stdout":"...","stderr":""},
      "test case 2": {"status":"failed","stdout":"...","stderr":"error stack"}
    }
  }

## Dependencies

- No new dependencies. Rely on built-in `child_process` and existing logging utilities.
