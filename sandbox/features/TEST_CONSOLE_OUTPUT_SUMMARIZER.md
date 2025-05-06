# Purpose
Add a new utility function summarizeTestConsoleOutput to src/lib/main.js that analyzes raw test runner console output and produces a concise summary suitable for display in CLI or feeding to automation agents.

# Value Proposition
Provide developers and agentic workflows with an at a glance report of test run results without manual parsing. This accelerates troubleshooting by highlighting counts of passed tests, failed tests, skipped tests, total tests run, and brief error messages, improving observability in CI/CD pipelines and discussion bots.

# Success Criteria & Requirements
* Export a function summarizeTestConsoleOutput(output, options?) from src/lib/main.js
* The function accepts:
  - output: string containing the full console output of a Vitest or similar test run
  - options: optional object with a format key that can be text (default) or json
* On each invocation, increment globalThis.callCount
* Parse the output string to identify:
  - total tests run
  - number of passed tests
  - number of failed tests
  - number of skipped tests (if any)
  - collection of up to three error messages from failed tests
* For format text, return a plain text summary with labeled lines for each metric and error messages
* For format json, return a JSON serializable object with fields total, passed, failed, skipped, errors
* No external dependencies beyond those already declared

# Implementation Details
1. In src/lib/main.js, after existing utilities, define function summarizeTestConsoleOutput(output, options = {})
2. Use regular expressions to scan output for patterns like x passed, x failed, x skipped and to extract failure messages
3. Compile metrics and error snippets into a summary
4. If options.format is json return an object, otherwise build a multiline string
5. Increment globalThis.callCount before returning
6. Export summarizeTestConsoleOutput alongside other utilities
7. Update README.md under API Usage to document signature, parameters, and examples for both text and json formats
8. Add Vitest unit tests in tests/unit/main.test.js that supply sample console output strings and assert that:
   - The returned text summary contains expected counts and messages
   - The returned object from json format matches expected structure and values

# Verification & Acceptance
* Write tests for a passing only output, a mixed pass/fail/skip output, and ensure error snippets are captured
* Confirm globalThis.callCount increments correctly for each call
* Run npm test and verify no regressions in existing tests
* Confirm README examples render clearly and produce valid output