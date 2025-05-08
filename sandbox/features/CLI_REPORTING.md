# Purpose & Scope

Introduce a new CLI mode to execute the test suite and produce a concise summary of test results alongside existing workflow metrics. This enables quick health checks of both code correctness and persisted metrics in one command.

# Value Proposition

- Provides immediate insight into test suite health by reporting total, passed, failed, and skipped tests and overall duration.
- Combines code validation and metrics visibility, reducing the need for separate commands and manual file inspection.
- Supports integration in CI/CD pipelines for fast feedback and exit codes reflecting test success.
- Maintains both human-friendly and machine-readable outputs for diverse consumption scenarios.

# Success Criteria & Requirements

1. Flag Definitions
   - --test-summary: triggers execution of the Vitest test runner in JSON reporter mode and outputs a summary of test results.
   - --json: when combined with --test-summary, emits output as a single JSON object with testSummary and metrics fields.
   - Existing flags (--help, --version, --digest, --verbose, --verbose-stats, --dashboard) remain supported and can be combined.

2. Test Execution and Parsing
   - Programmatically invoke the Vitest runner API to execute all tests under tests/unit and sandbox/tests paths.
   - Collect result data: totalTests, passedTests, failedTests, skippedTests, durationMs.
   - Exit the process with code 0 if failedTests is zero; otherwise, exit with code equal to number of failed tests.

3. Metrics Integration
   - After summarizing test results, attempt to read .agentic_metrics.json from project root using fs/promises.
   - If file exists and is valid JSON, include its fields (for example totalIssues, successfulCommits, totalMissions, completedMissions) under a metrics section.
   - If the file is missing or malformed, log an error entry and omit the metrics section without failing the test summary command.

4. Output Format
   - Human-readable mode: display bullet or table format listing testSummary fields followed by metrics if present.
   - JSON mode: output a single JSON object:
     {
       testSummary: { totalTests, passedTests, failedTests, skippedTests, durationMs },
       metrics: { ... }
     }

5. Integration & Combined Modes
   - Support combining --test-summary with --verbose to append debug diagnostics, --verbose-stats to append workflow metrics after primary output, and --dashboard to include mission progress dashboard.
   - Ensure consistent output order: test summary, dashboard, verbose diagnostics, verbose-stats metrics.

# Dependencies & Constraints

- Add vitest as a dev dependency and use its programmatic Runner API.
- Use fs/promises to read .agentic_metrics.json.
- Maintain ESM compatibility on Node 20.
- Include unit tests covering: flag parsing, correct invocation of Vitest runner, parsing of JSON results, metrics file present and absent scenarios, output formats, and exit codes.
- Update sandbox/README.md CLI Features section and docs/METRICS.md to document the new --test-summary command and JSON output structure.