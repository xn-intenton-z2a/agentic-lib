# Objective
Extend the existing console capture facility to include a comprehensive metrics summary alongside the captured logs in both CLI and Vitest test runs.

# Value Proposition
Provide developers and CI systems with actionable insights into log volume, error frequency, and capture duration without manual parsing. This enhances debugging, performance analysis, and test diagnostics.

# Scope
When console capture is enabled via:
- CLI flag `--capture-console` or environment variable `AGENTIC_CAPTURE_CONSOLE` in `main.js`
- Vitest integration flag `VITEST_CONSOLE_CAPTURE`

The system will:
1. Buffer all `console.log` (info) and `console.error` (error) calls.
2. After capture stops, emit:
   - A header `Captured Console Output:` followed by buffered entries.
   - A header `Console Capture Metrics:` followed by a JSON object summarizing metrics.
3. Preserve existing behavior when capture is disabled.

# Requirements
- Detect capture mode in `src/lib/main.js` and in Vitest setup.
- After calling `stopConsoleCapture()`, fetch entries from `getCapturedOutput()`.
- Compute metrics:
  - totalEntries: total buffered entries count.
  - infoCount: number of entries with level "info".
  - errorCount: number of entries with level "error".
  - durationMs: difference in milliseconds between the first and last timestamp (0 if one or none).
- Emit metrics under `Console Capture Metrics:` as a single JSON object.
- Ensure no impact when capture is not active.
- Retain ISO-8601 timestamps for duration calculation.

# Success Criteria
- Running `agentic-lib --capture-console --digest` outputs:
  1. `Captured Console Output:` header with each entry as JSON.
  2. `Console Capture Metrics:` header with a summary JSON.
- Environment variable `AGENTIC_CAPTURE_CONSOLE=true agentic-lib --digest` behaves identically.
- Vitest tests print grouped logs and metrics per test when `VITEST_CONSOLE_CAPTURE=true`.
- No extra output when capture is disabled.

# Design
1. In `main.js`, after `stopConsoleCapture()` and log replay, call `computeCaptureMetrics(entries)`.
2. Implement `computeCaptureMetrics(entries)` in `sandbox/source/consoleCapture.js` or in `main.js` as a helper:
   - Iterate entries to count info and error levels.
   - Calculate durationMs from first and last timestamps.
3. Print metrics header and JSON via `console.log(JSON.stringify(metrics))`.
4. Maintain current capture API and restore console methods as before.

# User Scenarios
- A developer simulates an SQS replay via CLI and instantly sees how many logs and errors occurred, and how long the session lasted.
- CI pipelines capture test logs per test and review metrics to detect flakiness or excessive logging.
- Automated monitors aggregate capture metrics over time to alert on error spikes or performance regressions.

# Testing & Verification
- Unit tests for `computeCaptureMetrics()` with no entries, single entry, and multiple entries.
- Integration tests mocking a CLI command emitting logs and errors, verifying headers and metrics JSON in correct order.
- Vitest E2E tests running `sandbox/tests/consoleCapture.vitest.setup.js` with capture enabled, asserting grouped logs and metrics output.
