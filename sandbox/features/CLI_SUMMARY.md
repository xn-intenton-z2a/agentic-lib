# Purpose & Scope

Implement a unified structured summary capability in the CLI to provide two kinds of post-run reports:

1. Persistent workflow metrics summary (totalIssues, successfulCommits, conversionRate) as before.
2. Test run results summary parsed from Vitest JSON reporter output, showing total tests, passed, failed, skipped, and duration.

All summaries support customizable output formats and theming, and can be enabled independently or combined.

# Value Proposition

By consolidating both metrics and test reporting into a single CLI feature, users can:

- Gain immediate insight into workflow health and conversion metrics.
- Get an at-a-glance summary of test suite outcomes without switching tools.
- Choose their preferred summary format (json, table, yaml) and theme (light, dark) for readability or integration.
- Enable or disable colored output based on environment (CI, TTY).

# Success Criteria & Requirements

1. Metrics Persistence (existing behavior preserved)
   - On first `--digest`, create `.agentic_metrics.json` with zeroed counters.
   - Increment counters on each `--digest` invocation.
   - Expose `--stats` and `--verbose-stats` with `--stats-format`, `--stats-theme`, and `--stats-color` flags as documented.

2. Test Summary
   - New CLI flag `--test-summary` to spawn a Vitest run under the hood using `vitest run --reporter=json`.
   - Parse Vitest JSON output to extract summary fields: total, passed, failed, skipped, durationMs.
   - Support formatting flags:
     - `--test-summary-format <json|table|yaml>` (default: json)
     - `--test-summary-theme <light|dark>` (default: light)
     - `--test-summary-color <true|false>` (default: true in TTY)
   - When `--test-summary` is used alone, show only test summary and exit; when combined with other flags or commands, append after primary output.
   - Error out with non-zero code on Vitest execution failures or JSON parse errors.

3. Flag Integration and Precedence
   - Format and theme flags for metrics and tests must only apply to their respective summaries.
   - `--verbose-stats` and `--verbose-test-summary` both supported: each can be appended after other CLI outputs.

# Dependencies & Constraints

- Use Node built-in `child_process` to execute Vitest and capture stdout.
- Use `fs/promises` to read/write `.agentic_metrics.json` atomically.
- Use `chalk` for coloring, `js-yaml` for YAML formatting, and simple string alignment for tables.
- Must remain compatible with Node 20, ESM, and existing test mocking.

# User Scenarios & Examples

Scenario 1: Table-formatted metrics and test summary after digest
```
node src/lib/main.js --digest --verbose-stats --verbose-test-summary --stats-format table --test-summary-format table
``` 
Outputs digest logs, then a metrics table, then a test summary table.

Scenario 2: YAML test summary only
```
node src/lib/main.js --test-summary --test-summary-format yaml --test-summary-color false
```
Outputs:
```
total: 50
passed: 48
failed: 2
skipped: 0
durationMs: 1234
```

# Verification & Acceptance

- Unit tests mock `child_process.exec` and verify correct parsing and formatting of Vitest JSON.
- Integration test runs both `--stats` and `--test-summary` and asserts combined outputs.
- Manual CLI tests in TTY and non-TTY environments confirm color and theme behavior.
