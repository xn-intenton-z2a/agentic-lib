# Purpose
Integrate the test console output summarizer into Continuous Integration workflows by adding a dedicated npm script that runs tests and pipes the output into the summarizer.

# Value Proposition
Automate the generation of a machine-readable summary of test results during CI runs. This enables dashboards and alerts to consume structured test metrics and quickly identify failures without manual log parsing.

# Success Criteria & Requirements
* summarizeTestConsoleOutput and processSummarizeTests functions are present in src/lib/main.js and support reading from piped stdin.
* package.json scripts section includes a ci:test-summary script that runs vitest tests in verbose mode and pipes the console output to the summarizer CLI flag.
* README.md is updated under Scripts and CI Usage to document the ci:test-summary script with example invocation and expected JSON output.
* No additional dependencies are introduced.

# Implementation Details
1. In package.json under scripts add a new script ci:test-summary that executes vitest tests in verbose mode and pipes the output to node src/lib/main.js --summarize-tests
2. Update README.md Scripts section to include:
   - ci:test-summary: run tests and output structured JSON summary of results
   - Example invocation: npm run ci:test-summary
3. Ensure summarizeTestConsoleOutput in src/lib/main.js correctly processes piped input when no file path is provided and exits with code 1 on parsing errors
4. No changes to tests are required beyond existing summarizer coverage.

# Verification & Acceptance
* Execute npm run ci:test-summary to verify JSON summary output with fields total, passed, failed, skipped, errors
* Confirm exit code is zero when tests pass and non-zero when tests fail
* Ensure all existing tests in tests/unit/main.test.js pass without modification
* Validate README.md updates render correctly with no formatting errors