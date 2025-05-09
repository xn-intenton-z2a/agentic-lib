# Objective
Provide an aggregated summary of console capture outputs test results to help developers quickly understand log distribution across levels and tests.

# Value Proposition
Aggregating captured log entries by level offers a concise overview of test logging behavior, revealing patterns of info and error usage and helping to identify noisy tests or unexpected errors.

# Scope
- Add summarizeCapturedResults in sandbox/source/consoleCapture.js: function to accept an array of entries and return summary counts by level and total.
- Extend consoleCapture module exports to include summarizeCapturedResults.
- Write unit tests in sandbox/tests/consoleCapture.test.js covering scenarios for empty arrays, mixed levels, and custom filters.
- Update sandbox/docs/CONSOLE_CAPTURE.md to document the new API and usage examples.
- Update sandbox/README.md to include a "Test Results Summary" section describing how to use summarizeCapturedResults and interpret its output.

# Requirements
- Function name: summarizeCapturedResults; input: Array<{level:string, timestamp:string, message:string}>, output: object with keys info, error, total and optional breakdown by timestamp range.
- Must run synchronously with pure JavaScript and no new external dependencies.
- Maintain existing ESM compatibility and Node 20+ support.
- Include test cases for edge conditions: no entries, only one level, and mixed-level arrays.

# Success Criteria
- Unit tests for summarizeCapturedResults achieve at least 90% coverage of the new code.
- consoleCapture API exports include the new function and its behavior is validated by tests.
- Documentation in CONSOLE_CAPTURE.md and sandbox README contains clear descriptions and example outputs.

# Verification
1. Import summarizeCapturedResults and call it with mock data to verify counts by level and total.
2. Run npm test to ensure all tests pass and coverage thresholds are met.
3. Review updated docs and README to confirm examples compile and accurately reflect behavior.