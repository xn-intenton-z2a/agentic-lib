# Purpose
Add a structured test console output summarizer to the CLI that parses raw test output and emits a machine-readable JSON report suitable for CI dashboards and alerts.

# Value Proposition
Enable automated systems and dashboards to consume detailed test results without custom scripts. This feature extracts pass, fail, skip counts, unique error messages, and optional timing metrics from test console output, accelerating failure analysis and reporting.

# Success Criteria & Requirements
* Export function summarizeTestConsoleOutput(rawOutput: string, options?):
  - Returns an object with fields: total (number), passed (number), failed (number), skipped (number), errors (string[]), metrics ({ durationTotal: number|null, durationAverage: number|null })
  - By default metrics fields are null. If options.metrics is true and durations are present, calculate durationTotal and durationAverage in seconds.
* CLI integration in src/lib/main.js:
  - Introduce async function processSummarizeTests(args) before existing handlers.
  - Detect --summarize-tests flag; parse optional --metrics flag.
  - Read raw console output from standard input until EOF.
  - Invoke summarizeTestConsoleOutput with includeMetrics flag and print JSON.stringify(summary, null, 2) to stdout.
  - Increment globalThis.callCount exactly once per invocation of processSummarizeTests.
  - Return true when --summarize-tests is handled, false otherwise.
* Update main(args) to call processSummarizeTests before other CLI helpers (help, version, digest).
* Update README.md under CLI Usage:
  --summarize-tests [--metrics]
    Read test console output from stdin and print JSON summary.
  Example:
    cat test.log | npx agentic-lib --summarize-tests --metrics
  Sample Output:
    {
      "total": 10,
      "passed": 8,
      "failed": 2,
      "skipped": 0,
      "errors": ["should handle edge case", "throws on invalid input"],
      "metrics": { "durationTotal": 12.34, "durationAverage": 1.234 }
    }
* Add Vitest tests in tests/unit/main.test.js:
  - Unit tests for summarizeTestConsoleOutput: parse sample output to verify counts, error messages, and metrics behavior.
  - CLI tests for processSummarizeTests: mock process.stdin to supply sample output, spy on console.log, verify globalThis.callCount increments and the JSON summary printed matches expectations.

# Implementation Details
1. In src/lib/main.js define and export function summarizeTestConsoleOutput(rawOutput, options = {}):
   - Split rawOutput into lines.
   - Count lines matching pass, fail, skip patterns.
   - Collect unique error messages or test names from failure lines.
   - If options.metrics is true, extract numeric durations in parentheses, sum and average.
   - Return structured object.
2. Define async function processSummarizeTests(args):
   - If args includes "--summarize-tests":
     • const includeMetrics = args.includes("--metrics");
     • Read entire stdin into a string (e.g., using process.stdin.on data/end).
     • const summary = summarizeTestConsoleOutput(rawOutput, { metrics: includeMetrics });
     • console.log(JSON.stringify(summary, null, 2));
     • globalThis.callCount++;
     • return true;
   - Otherwise return false.
3. In main(args), at the very start insert:
   if (await processSummarizeTests(args)) return;
4. Update README.md under "CLI Usage" to document the new flags and provide examples.
5. No new dependencies are required beyond Node built-ins.

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests remain unaffected.
* Write unit tests for summarizeTestConsoleOutput covering basic, missing-duration, and metrics-enabled scenarios.
* Write CLI tests for processSummarizeTests simulating stdin input and verifying console.log output.
* Confirm callCount increments exactly once per CLI invocation.