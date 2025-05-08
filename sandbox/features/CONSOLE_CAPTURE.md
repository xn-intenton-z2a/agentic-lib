# Objective
Extend the existing console capture facility to include detailed capture metrics in the CLI summary when console capture is enabled.

# Scope
When users run the agentic-lib CLI with console capture enabled, intercept and buffer all console.log and console.error calls, then after command execution:

1. Emit the captured logs as before under the header "Captured Console Output:".
2. Compute and emit a metrics summary under the header "Console Capture Metrics:".

Metrics include total number of entries, count by level (info vs error), and captured session duration in milliseconds computed from the first and last timestamps.

# Requirements
- Detect the existing `--capture-console` CLI flag or `AGENTIC_CAPTURE_CONSOLE` environment variable in `src/lib/main.js` and trigger capture start/end as before.
- After `stopConsoleCapture()` and printing buffered entries:
  - Retrieve entries from `getCapturedOutput()`.
  - Compute:
    - totalEntries: total number of buffered entries.
    - infoCount: count of entries where level is "info".
    - errorCount: count of entries where level is "error".
    - durationMs: difference in milliseconds between the first and last entry timestamps (zero if only one or none).
  - Print the header `Console Capture Metrics:` followed by a single JSON object with these metrics.
- Preserve existing capture behavior: no impact when capture disabled; default remains disabled.
- Timestamps remain ISO-8601 strings and used for duration calculation.

# Success Criteria
- Running `agentic-lib --capture-console --digest` yields:
  1. Header `Captured Console Output:` with JSON lines for each log entry.
  2. Header `Console Capture Metrics:` with JSON summarizing totalEntries, infoCount, errorCount, durationMs.
- Environment variable toggle works equivalently: `AGENTIC_CAPTURE_CONSOLE=true agentic-lib --digest`.
- No additional output when capture is not enabled.

# Design
1. In `src/lib/main.js`, extend the logic after `stopConsoleCapture()` to compute metrics from `getCapturedOutput()`.
2. Implement a helper function `computeCaptureMetrics(entries)` that returns the metrics object.
3. Print metrics with `console.log(JSON.stringify(metrics))` under the metrics header.
4. Keep capture glue code in `sandbox/source/consoleCapture.js` unchanged; rely on its API.

# Testing and Verification
- Unit Tests:
  - Spy on `console.log` and `console.error` in a dummy CLI command run with `--capture-console`. Verify headers, raw entries, and metrics JSON printed in correct order.
  - Validate `computeCaptureMetrics()` for no entries, single entry, multiple entries.
- Integration Test:
  - Mock a CLI command that logs two info and one error. Run with capture flag and assert metric counts and duration computation.
- E2E Test:
  - Spawn a child process with `agentic-lib --capture-console --digest`, inspect stdout for both headers and correct JSON values.
