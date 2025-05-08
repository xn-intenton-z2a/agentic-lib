# Purpose & Scope

Integrate structured console reporting across test summary, streaming events, coverage metrics, and persistent workflow metrics into a unified CLI feature.

# Value Proposition

- Consolidated insights: view test results, real-time test events, code coverage percentages, and persisted pipeline metrics in one invocation.
- Workflow metrics persistence: track and report total issues and successful commits across CLI invocations with minimal overhead.
- Flexible output formats and theming: support json, table, and yaml outputs with light/dark themes and optional color.
- Streamlined CI and developer feedback loops with combined and standalone modes for each report type.

# Success Criteria & Requirements

1. Metrics Reporting
   - Flag --stats to read .agentic_metrics.json and print totalIssues and successfulCommits.
   - Flag --verbose-stats to append the same metrics after primary output when used alongside other flags.
   - Behavior: create or update metrics file on --digest, incrementing both counts by 1, then optionally output metrics when --stats or --verbose-stats is present.

2. Test Summary
   - Flag --test-summary to run Vitest with JSON reporter and parse total tests, passed, failed, skipped, and durationMs.
   - Options --test-summary-format (json, table, yaml), --test-summary-theme (light, dark), --test-summary-color.
   - Standalone mode: display only test summary when used alone.
   - Combined mode: append test summary after other reports when used with metrics or coverage flags.

3. Structured Test Events
   - Flag --stream-test-events to run Vitest in streaming JSON mode and parse events with file, title, status, durationMs, timestamp.
   - Options --stream-test-events-format, --stream-test-events-theme, --stream-test-events-color.
   - Interleave or append event logs based on flag order when combined with other reports.

4. Coverage Summary
   - Flag --coverage-summary to run Vitest with coverage reporter in JSON and parse linesPercent, statementsPercent, functionsPercent, branchesPercent.
   - Options --coverage-summary-format (json, table, yaml), --coverage-summary-theme (light, dark), --coverage-summary-color.
   - Standalone mode: display only coverage summary when used alone.
   - Combined mode: append coverage summary after test summary, events, or metrics outputs.

5. Flag Integration and Precedence
   - Each format, theme, and color option applies only to its respective report type.
   - Define precedence: metrics flags apply first in combined output when --stats is standalone, otherwise metrics appear last with --verbose-stats.

# Dependencies & Constraints

- Use child_process.spawn to capture Vitest JSON output, fs to read/write .agentic_metrics.json, chalk for coloring, js-yaml for yaml formatting.
- Maintain Node 20 ESM compatibility and existing test mocks.

# User Scenarios & Examples

Scenario: Run digest, update metrics, and display all reports in table format

  node src/lib/main.js --digest --stats --test-summary --coverage-summary --test-summary-format table --coverage-summary-format table

Scenario: JSON metrics and coverage only without color

  node src/lib/main.js --coverage-summary --coverage-summary-format json --coverage-summary-color false --stats

Scenario: Stream test events with dark theme and append metrics

  node src/lib/main.js --stream-test-events --stream-test-events-theme dark --verbose-stats

# Verification & Acceptance

- Unit tests mocking fs and child_process.spawn to verify metrics file creation, parsing of test and coverage JSON, and formatting.
- Integration tests for combinations of --stats, --verbose-stats, --test-summary, --stream-test-events, --coverage-summary flags asserting correct output order, formats, and exit codes.
- Manual tests in TTY and non-TTY to confirm color handling, themes, file creation and update semantics.