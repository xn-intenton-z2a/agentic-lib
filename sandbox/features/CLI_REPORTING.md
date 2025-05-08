# Purpose & Scope

Extend the existing CLI reporting feature to consume and render structured test events from the Vitest JSON reporter in real time. Provide unified console output that interleaves summary, metrics, coverage, and detailed test events according to user flags, and ensure output remains easily machine-parseable and human-readable.

# Value Proposition

- Real-time insight into test progress: display per-test events (start, pass, fail, skip) with timestamps and durations.
- Consistent formatting: align structured test events with summary, coverage, and metrics reports under the same theming and formatting system.
- Machine-readable output: maintain JSON-L output mode for integrations while offering colored table or YAML modes for human developers.
- Better failure diagnostics: include stack traces and error messages in the structured event stream when tests fail.

# Success Criteria & Requirements

1. Flag Definitions
   - --stream-test-events: activates streaming mode. Internally runs Vitest with --reporter=json and --watch=false flags.
   - --test-events-format: formats event stream as json, table, or yaml.
   - --test-events-theme: light or dark theme for table rendering.
   - --test-events-color: toggle colored output.
2. Event Parsing & Rendering
   - Parse each JSON event object emitted by Vitest to extract file, title, status, durationMs, and timestamp.
   - When a test fails, include error message and stack trace fields from the JSON event.
   - In table mode, render columns: TIMESTAMP, STATUS, TEST, DURATION.
   - In YAML mode, emit an array of event objects under key testEvents.
3. Integration with Other Reports
   - In combined mode with --test-summary, --coverage-summary, or metrics flags, interleave or append event rows in the order flags are passed.
   - Ensure metrics (--stats, --verbose-stats) render before events; summaries render after events if flag order indicates.
4. Standalone & Combined Modes
   - Standalone: only event stream when --stream-test-events is passed alone.
   - Combined: properly merge event output with existing summary, coverage, metrics sections.

# Dependencies & Constraints

- Use child_process.spawn to run Vitest with JSON reporter in streaming mode.
- Reuse existing formatting utilities (chalk for colors, js-yaml for YAML, console.table or custom table renderer).
- Maintain ESM compatibility with Node 20.
- Write unit tests that mock child_process.spawn to emit JSON events and validate parsing, formatting, and flag precedence.

# User Scenarios & Examples

Scenario: Stream test events with colorized table output

  node src/lib/main.js --stream-test-events --test-events-format table --test-events-color

Scenario: Combine coverage summary and event stream in YAML mode

  node src/lib/main.js --coverage-summary --stream-test-events --test-events-format yaml

# Verification & Acceptance

- Unit tests simulate Vitest event stream, assert correct JSON parsing and formatting in each mode.
- Integration tests invoke CLI with combinations of flags and verify output order and content.
- Manual tests watching console to confirm live event display and correct handling of passing, failing, and skipped tests.