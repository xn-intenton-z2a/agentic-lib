# Objective
Enhance the existing Console Capture Utility to include structured test metadata—namely test name, execution duration, and pass/fail status—in captured log entries when running tests under Vitest.

# Value Proposition
Including test metadata in captured logs helps developers and CI systems quickly identify slow or failing tests directly in the console output. This improves visibility into test performance characteristics and failure details without leaving the terminal.

# Scope
- Update sandbox/source/consoleCapture.js:
  - Add a map of active tests to track start times keyed by test name.
  - Introduce two new exports:
    - startTestCapture(testName): record the start timestamp for the given test.
    - endTestCapture(testName, passed, error?): compute duration, format a log entry with level "test", timestamp, testName, durationMs, and status ("passed" or "failed"); include error message when provided.
  - Ensure these entries are appended to the existing capture buffer.
- Update sandbox/tests/consoleCapture.vitest.setup.js:
  - Before each test, call startTestCapture with the current test name from Vitest state.
  - After each test, detect pass/fail by inspecting Vitest’s expect.getState().currentTestErrors; call endTestCapture accordingly.
  - Maintain existing grouping behavior under VITEST_CONSOLE_CAPTURE.
- Update sandbox/docs/CONSOLE_CAPTURE.md:
  - Document the new API functions startTestCapture and endTestCapture along with usage example in a Vitest setup file.
- Update sandbox/README.md:
  - Describe how enabling VITEST_CONSOLE_CAPTURE now includes test metadata in the grouped logs.

# Requirements
- startTestCapture and endTestCapture must not interfere with existing consoleCapture behavior when unused.
- Test metadata entries must include:
  • level: "test"
  • testName: string
  • status: "passed" | "failed"
  • durationMs: number
  • timestamp: ISO-8601 string
  • error: string (only on failed tests)
- Ensure new functions are ESM-compatible and have unit tests added in sandbox/tests/consoleCapture.test.js for core logic.

# Success Criteria
- Captured output includes a test-level entry immediately after each test that records name, durationMs, status, and error when applicable.
- Unit tests for startTestCapture and endTestCapture verify correct computation of duration and metadata formatting under both pass and fail scenarios.
- Vitest setup integration writes grouped logs with test metadata when VITEST_CONSOLE_CAPTURE is truthy.

# Verification
1. npm test should pass all existing and new tests under sandbox/tests.
2. Running vitest with VITEST_CONSOLE_CAPTURE=true should print a header per test followed by JSON entries including test-level metadata.
3. Manual inspection of getCapturedOutput shows new test entries with correct fields.