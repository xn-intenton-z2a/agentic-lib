# Purpose & Scope

Implement a unified structured summary and event streaming capability in the CLI to provide three kinds of post-run reports:

1. Persistent workflow metrics summary (totalIssues, successfulCommits, conversionRate) as before.
2. Test run results summary parsed from Vitest JSON reporter output, showing total tests, passed, failed, skipped, and duration.
3. Structured test event output streaming individual test case events parsed in real time from Vitest JSON reporter, including file path, test title, status, and duration.

# Value Proposition

By consolidating metrics, summaries, and detailed test events into a single CLI feature, users can:

- Gain immediate insight into workflow health and conversion metrics and test suite outcomes without switching tools.
- Stream detailed, structured events for each test case, enabling integration with external dashboards or log aggregation systems.
- Choose output formats (json, table, yaml) and themes (light, dark) for each report type independently.
- Enable or disable colored output based on environment (CI, TTY).

# Success Criteria & Requirements

1. Metrics Persistence (existing behavior preserved)
   - On first `--digest`, create `.agentic_metrics.json` with zeroed counters.
   - Increment counters on each `--digest` invocation.
   - Expose `--stats` and `--verbose-stats` with `--stats-format`, `--stats-theme`, and `--stats-color` flags as documented.

2. Test Summary (existing)
   - New CLI flag `--test-summary` to spawn Vitest run under the hood using `vitest run --reporter=json`.
   - Parse Vitest JSON output to extract summary fields: total, passed, failed, skipped, durationMs.
   - Support formatting flags: `--test-summary-format <json|table|yaml>`, `--test-summary-theme <light|dark>`, `--test-summary-color <true|false>`.
   - When `--test-summary` is used alone, show only test summary and exit; when combined, append after primary output.
   - Exit with non-zero code on Vitest execution failures or parse errors.

3. Structured Test Events
   - New CLI flag `--stream-test-events` to spawn Vitest using `vitest run --reporter json` in streaming mode.
   - Use `child_process.spawn` to capture Vitest stdout line by line.
   - For each JSON event line, parse and log a structured JSON object with fields: file, title, status, durationMs, timestamp.
   - Support `--stream-test-events-format <json|table|yaml>` to output a summary table or detailed list after streaming completes.
   - Support `--stream-test-events-theme <light|dark>` and `--stream-test-events-color <true|false>`.
   - When combined with other flags, interleave or append event logs according to invocation order.
   - Exit code reflects Vitest run status; stream errors on parse or execution failures.

4. Flag Integration and Precedence
   - Format and theme flags must apply only to their respective report type.
   - `--verbose-stats`, `--verbose-test-summary`, and `--verbose-stream-test-events` all supported for appending after primary output.

# Dependencies & Constraints

- Use `child_process.spawn` for streaming JSON output from Vitest.
- Continue to use `fs/promises` for metrics persistence.
- Use `chalk` for coloring, `js-yaml` for YAML formatting, and simple string alignment for tables.
- Maintain compatibility with Node 20, ESM, and existing test mocking.

# User Scenarios & Examples

Scenario: Stream detailed test events with summary
```
node src/lib/main.js --digest --verbose-stats --stream-test-events --stream-test-events-format table
```
Outputs digest logs, metrics table, then streams each test event as JSON, and finally a formatted table summary of events.

Scenario: JSON stream only
```
node src/lib/main.js --stream-test-events --stream-test-events-color false
```
Outputs each test event line as JSON and exits with Vitest exit code.

# Verification & Acceptance

- Unit tests must mock `child_process.spawn` and simulate JSON lines to verify event parsing and output formatting.
- Integration test runs `--stream-test-events` and asserts correct structured logs and exit code.
- Manual CLI tests in TTY and non-TTY confirm flag behavior and color handling.
