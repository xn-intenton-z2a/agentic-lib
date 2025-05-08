# Purpose & Scope

Implement structured console reporting for Vitest test runs integrated into the existing CLI. Provide both a concise test summary and a real-time event stream of individual test case outcomes parsed from Vitest JSON reporter output.

# Value Proposition

- Deliver immediate insights into test suite health with total tests, passed, failed, skipped, and duration metrics.
- Stream per-test events in real time for integration with dashboards or log aggregation systems.
- Combine test reporting with existing metrics summary in a single invocation to avoid context switching.
- Offer flexible output formats and themes for each report type independently.

# Success Criteria & Requirements

1. Test Summary
   - Introduce CLI flag `--test-summary` to execute Vitest under the hood with the JSON reporter.
   - Parse summary fields: total tests, passed, failed, skipped, durationMs.
   - Support format option `--test-summary-format` with values json, table, yaml.
   - Support theme option `--test-summary-theme` with values light, dark.
   - Support color option `--test-summary-color` to enable or disable color.
   - Standalone mode: when used alone, display only test summary and exit.
   - Combined mode: when combined with metrics flags, append test summary after metrics output.
   - Exit code should reflect Vitest run status or parsing errors.

2. Structured Test Events
   - Introduce CLI flag `--stream-test-events` to spawn Vitest in streaming mode with JSON reporter.
   - Use child_process.spawn to capture stdout line by line without buffering entire output.
   - For each JSON event line, parse and output a structured JSON object with fields: file, title, status, durationMs, timestamp.
   - Support post-run summary with format option `--stream-test-events-format` and theme and color options analogous to test summary.
   - When combined with other report flags, interleave or append event logs based on invocation order.
   - Exit code reflects Vitest run status and any parsing or execution errors.

3. Flag Integration and Precedence
   - Ensure format and theme flags apply only to their respective report types.
   - Provide verbose modes `--verbose-test-summary` and `--verbose-stream-test-events` to append detailed logs after primary output.

# Dependencies & Constraints

- Use child_process.spawn for real-time streaming of Vitest JSON output.
- Continue using chalk for coloring and js-yaml for YAML formatting.
- Maintain compatibility with Node 20, ESM module system, and existing test mocks for spawn.

# User Scenarios & Examples

Scenario: stream detailed test events with summary table

  node src/lib/main.js --digest --stream-test-events --stream-test-events-format table

Scenario: JSON summary only without color

  node src/lib/main.js --test-summary --test-summary-format json --test-summary-color false

# Verification & Acceptance

- Unit tests must mock child_process.spawn and simulate JSON event lines to verify parsing, streaming, and formatting behaviors.
- Integration tests run combinations of flags and assert correct structured output and exit codes.
- Manual CLI tests in both TTY and non-TTY environments to confirm color handling and formatting options.