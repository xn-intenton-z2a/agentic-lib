# Purpose
Enhance the existing test console output summarizer to include a concise error summary and aggregated test execution metrics.

# Value Proposition
Provide richer, machine-readable test reports by adding an error summary and performance metrics to the JSON output. This enables CI pipelines, dashboards, and alerting systems to detect failure patterns, monitor test performance trends, and quickly pinpoint problematic tests without manual log parsing.

# Success Criteria & Requirements
* Extend summarizeTestConsoleOutput (and its CLI wrapper processSummarizeTests) in src/lib/main.js to collect:
  - total tests run, passed, failed, skipped
  - error count and list of unique error messages or test names that failed
  - aggregated metrics including total run time and average duration per test
* The JSON output must include new top-level fields:
  {
    total, passed, failed, skipped,
    errors: ["Error message 1", "Error message 2", …],
    metrics: { durationTotal: seconds, durationAverage: seconds }
  }
* Preserve backward compatibility: if duration information is not available in the console output, metrics fields should default to null or zero
* Accept an optional flag --metrics on the CLI to include metrics; error summary is always included
* No additional dependencies should be introduced

# Implementation Details
1. In src/lib/main.js, locate summarizeTestConsoleOutput and processSummarizeTests. Update parsing logic to:
   - Extract individual test result lines including duration if present
   - Increment counters for passed, failed, skipped tests
   - Collect error messages or test identifiers from failure sections
   - Sum durations and compute average when duration data is available
2. Modify processSummarizeTests to detect an optional --metrics flag and pass a metrics option to summarizeTestConsoleOutput
3. Ensure JSON.stringify output includes the new errors and metrics properties
4. Update README.md in the Scripts and CLI Usage sections:
   - Document new fields in the JSON summary
   - Show example output including errors array and metrics object
   - Document the --metrics flag usage
5. In tests/unit/main.test.js add Vitest tests:
   - Simulate sample verbose test output containing passes, fails, skips, and durations
   - Verify summarizeTestConsoleOutput returns correct total, passed, failed, skipped counts
   - Verify errors array contains expected failure messages
   - Verify metrics.durationTotal and durationAverage are computed correctly when durations exist
   - Test behavior when durations are missing: metrics fields should be null or zero

# Verification & Acceptance
* Run npm test to confirm all new and existing tests pass
* Validate that invoking node src/lib/main.js --summarize-tests outputs valid JSON with errors and metrics
* Confirm error summary lists unique failure messages and metrics match parsed durations
* Ensure default behavior remains intact when no --metrics flag is provided
* Verify README renders correctly and examples reflect the enhanced output