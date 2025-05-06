# Purpose

Add structured test console output summarizer accessible via a new CLI flag

# Value Proposition

Provide richer machine readable test reports with error summaries and performance metrics to power dashboards and CI alerts

# Success Criteria & Requirements

* summarizeTestConsoleOutput returns an object with fields total passed failed skipped errors metrics
* errors is an array of unique failure messages or test names
* metrics is an object with durationTotal and durationAverage in seconds or null when not available
* processSummarizeTests detects --summarize-tests and optional --metrics flag
* CLI invocation prints JSON summary and increments globalThis.callCount exactly once
* backward compatibility when duration data is missing retains summary structure with metrics fields set to null or zero

# Implementation Details

1. In src/lib/main.js update summarizeTestConsoleOutput to parse test output lines for pass fail skip counts error messages and durations
2. Extend processSummarizeTests to detect --summarize-tests before other handlers and parse an optional --metrics flag
3. Invoke summarizeTestConsoleOutput with metrics option based on presence of --metrics
4. Use console.log to print JSON stringified summary
5. Increment globalThis.callCount once per CLI invocation
6. No new dependencies are required

# Verification & Acceptance

* Add Vitest tests in tests/unit/main.test.js covering count aggregation error summary and metrics calculations
* Run npm test to confirm new tests pass and existing tests remain unaffected
* Validate that invoking node src/lib/main.js --summarize-tests yields correct JSON output
* Verify metrics fields default when duration data is absent and error array lists unique failures