# Purpose & Scope

Implement structured console reporting for Vitest test runs integrated into the existing CLI, enhanced with code coverage summary output. Provide a concise test summary, real-time event stream, and coverage metrics parsed from Vitest JSON reporters.

# Value Proposition

- Immediate insights into test suite health, event-level details, and code coverage in a single invocation.
- Coverage metrics at a glance: lines, statements, functions, and branches percentages.
- Flexible output formats and themes for test summary, event streams, and coverage reports.
- Streamlined CI console output without context switching or multiple commands.

# Success Criteria & Requirements

1. Test Summary
   - CLI flag --test-summary to execute Vitest with JSON reporter.
   - Parse total tests, passed, failed, skipped, and durationMs.
   - Options --test-summary-format (json, table, yaml), --test-summary-theme (light, dark), --test-summary-color.
   - Standalone mode: only test summary is displayed when used alone.
   - Combined mode: append test summary after other outputs when combined with metrics or coverage flags.
   - Exit code reflects Vitest execution status or parsing errors.

2. Structured Test Events
   - CLI flag --stream-test-events to spawn Vitest in streaming JSON mode.
   - Use child_process.spawn to parse each JSON event line into fields: file, title, status, durationMs, timestamp.
   - Options --stream-test-events-format, --stream-test-events-theme, --stream-test-events-color.
   - Interleave or append event logs based on flag order when combined with other reports.
   - Exit code reflects Vitest and parsing status.

3. Coverage Summary
   - CLI flag --coverage-summary to run Vitest with coverage reporter in JSON mode.
   - Parse coverage summary fields: linesPercent, statementsPercent, functionsPercent, branchesPercent.
   - Options --coverage-summary-format (json, table, yaml), --coverage-summary-theme (light, dark), --coverage-summary-color.
   - Standalone mode: display only coverage summary when used alone.
   - Combined mode: append coverage summary after test summary or metrics outputs.
   - Exit code reflects Vitest run and coverage parsing status.

4. Flag Integration and Precedence
   - Ensure each format, theme, and color flag applies only to its respective report type.
   - Provide verbose modes --verbose-test-summary, --verbose-stream-test-events, --verbose-coverage-summary to include detailed logs after primary output.

# Dependencies & Constraints

- Use child_process.spawn to capture Vitest JSON output and coverage JSON file.
- Continue using chalk for coloring and js-yaml for YAML formatting.
- Maintain compatibility with Node 20, ESM modules, and existing spawn mocks in tests.

# User Scenarios & Examples

Scenario: Table-formatted test and coverage summary

  node src/lib/main.js --test-summary --coverage-summary --test-summary-format table --coverage-summary-format table

Scenario: JSON coverage only without color

  node src/lib/main.js --coverage-summary --coverage-summary-format json --coverage-summary-color false

# Verification & Acceptance

- Unit tests must mock child_process.spawn and simulate Vitest summary, event, and coverage JSON outputs to verify parsing and formatting.
- Integration tests run combinations of flags and assert correct structured output order, formats, and exit codes.
- Manual CLI tests in TTY and non-TTY environments to confirm color handling, themes, and flag precedence.