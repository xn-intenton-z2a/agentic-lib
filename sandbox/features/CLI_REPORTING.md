# Purpose & Scope

Extend the existing CLI reporting feature to consume and render structured test events from the Vitest JSON reporter in real time and to automate mission alignment and progress reporting based on the repository’s mission statement and persisted metrics. Provide a unified console interface that interleaves test summaries, metrics, coverage, mission alignment status, and detailed progress events according to user flags, ensuring output remains easily machine-parseable and human-readable.

# Value Proposition

- Real-time insight into test progress: display per-test events (start, pass, fail, skip) with timestamps and durations.
- Automated mission alignment: read and summarize the current mission statement from MISSION.md and report completion status against tracked metrics.
- Persistent progress reporting: store and retrieve key workflow metrics (e.g., tests run, missions aligned, digests processed) in a local JSON metrics file for trend analysis.
- Consistent formatting: align mission report with summary, coverage, and metrics under a single theming system.
- Machine-readable output: maintain JSON-L output mode for integrations while offering colored table or YAML modes for human developers.

# Success Criteria & Requirements

1. Flag Definitions
   - --stream-test-events: activates streaming mode for test events (uses Vitest JSON reporter).  
   - --test-events-format: choose output as json, table, or yaml.  
   - --mission-report: generates mission alignment report, reads MISSION.md and metrics file.  
   - --metrics-format: choose mission and workflow metrics output as json or table.  
   - --theme: choose table theme (light or dark).  
   - --color: toggle colored output across all report types.

2. Event Parsing & Rendering
   - Parse each JSON event object emitted by Vitest to extract file, title, status, durationMs, timestamp.  
   - Include error messages and stack traces for failing tests.  
   - In table mode, render columns: TIMESTAMP, STATUS, TEST, DURATION.  

3. Mission Alignment & Progress Reporting
   - Read mission statement from MISSION.md.  
   - Persist metrics in .agentic_metrics.json in project root with keys: totalTests, passedTests, failedTests, missionsReported.  
   - On --mission-report, display mission title and description, then metrics summary.  
   - Support updating metrics on each CLI invocation when flags like --stream-test-events or --digest are used.

4. Integration & Combined Modes
   - Support combined mode: --mission-report with --stream-test-events and coverage flags to interleave all outputs in the order flags are passed.  
   - Ensure metrics render before events; mission summary renders after metrics if flag order indicates.

# Dependencies & Constraints

- Use child_process.spawn to run Vitest with JSON reporter.  
- Reuse existing formatting utilities (chalk, js-yaml, console.table).  
- Use fs/promises to read MISSION.md and read/write .agentic_metrics.json.  
- Maintain ESM compatibility with Node 20.  
- Write unit tests that mock child_process.spawn, fs operations, and validate parsing, formatting, persistence, and flag precedence.

# User Scenarios & Examples

Scenario 1: Stream test events with mission report and colored table output

  node src/lib/main.js --stream-test-events --mission-report --test-events-format table --metrics-format table --color

Scenario 2: JSON mission report only

  node src/lib/main.js --mission-report --metrics-format json

Scenario 3: Combine coverage summary, mission report, and event stream

  node src/lib/main.js --coverage-summary --mission-report --stream-test-events --test-events-format yaml --metrics-format table

# Verification & Acceptance

- Unit tests simulate Vitest event stream and mock fs to assert correct parsing, formatting, mission reading, and metrics persistence.  
- Integration tests invoke CLI with combinations of flags and verify output order, content, and metrics file updates.  
- Manual verification reading console to confirm mission summary, metrics consistency, and real-time event display.