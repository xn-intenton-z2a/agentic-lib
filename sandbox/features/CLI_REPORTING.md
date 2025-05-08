# Purpose & Scope

Integrate structured console reporting and HTML report generation across test summary, streaming events, coverage metrics, and persistent workflow metrics into a unified CLI feature.

# Value Proposition

- Consolidated insights: view test results, real-time test events, code coverage percentages, and persisted pipeline metrics in one invocation or as a comprehensive HTML dashboard.
- Workflow metrics persistence: track and report total issues and successful commits across CLI invocations.
- Flexible output formats and theming for console, and customizable HTML report templates.
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

5. HTML Report Generation
   - Flag --html-report-output <filepath> to generate a self-contained HTML report summarizing metrics, test summary, events, and coverage.
   - Option --html-template <templatePath> to specify an EJS template; fallback to default built-in template if not provided.
   - Generated HTML must include timestamp, colored status indicators, summary tables, and collapsible sections for event streams.
   - Overwrite existing report file or create parent directories as needed.

6. Flag Integration and Precedence
   - Each format, theme, and color option applies only to its respective report type.
   - Define precedence: metrics flags apply first in combined console output; HTML generation occurs after all console output when --html-report-output is present.

# Dependencies & Constraints

- Use child_process.spawn to capture Vitest JSON output, fs for file operations, chalk for coloring, js-yaml for yaml formatting, and EJS for HTML templating.
- Maintain Node 20 ESM compatibility and existing test mocks.

# User Scenarios & Examples

Scenario: Run digest, update metrics, display console reports in table format and generate an HTML dashboard

  node src/lib/main.js --digest --stats --test-summary --coverage-summary --test-summary-format table --coverage-summary-format table --html-report-output reports/dashboard.html

Scenario: Generate HTML report with custom template without console output

  node src/lib/main.js --html-report-output reports/summary.html --html-template templates/custom.ejs

# Verification & Acceptance

- Unit tests mocking fs, child_process.spawn, and EJS rendering to verify HTML file creation, parsing of test and coverage JSON, correct template usage, and formatting.
- Integration tests for combinations of console flags and --html-report-output asserting correct console output order and HTML report content structure.
- Manual tests opening the generated HTML in a browser to confirm styling, collapsible sections, and data accuracy.