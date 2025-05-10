# Objective & Scope
Consolidate and extend existing JSON test reporting support into a unified JSON output feature for both the Vitest test runner and all CLI commands. Provide a single flag or environment variable to produce structured JSON output for test results, version information, help usage, and digest simulations without modifying file structures beyond package.json, README.md, and tests.

# Value Proposition
Offering consistent machine-readable output for both tests and CLI commands enables seamless integration with CI pipelines, dashboards, monitoring systems, and automated workflows. Teams can parse results and command outputs programmatically to automate failure detection, metrics collection, version tracking, and command chaining.

# Success Criteria & Requirements
- Users can run tests with JSON_REPORTER=true or a new --json flag to emit a single valid JSON object summarizing test suite results.
- Users can supply --json when invoking the CLI with --help, --version, or --digest to get structured JSON output for usage instructions, version metadata, or digest events.
- No additional files are created; updates apply only to package.json scripts, src/lib/main.js, README.md, and tests as needed.
- Existing non-JSON behavior remains unchanged when JSON output is not requested.

# Implementation Details
1. In package.json:
   - Add a global script alias or instruct users to pass "--json" or set JSON_OUTPUT=true alongside existing test and CLI commands.
   - Ensure "test" and "test:unit" scripts include conditional JSON reporter logic.
2. In src/lib/main.js:
   - Parse a global JSON_OUTPUT flag or detect --json in args before processing subcommands.
   - Wrap processHelp, processVersion, and processDigest responses to output JSON when JSON_OUTPUT is true or --json is present.
   - Consolidate JSON formatting logic into a shared helper, reusing formatLogEntry where possible.
3. In README.md:
   - Document the new --json option or JSON_OUTPUT environment variable for both test commands and CLI invocation.
   - Provide examples of JSON payloads for test results, version info, help usage, and digest events.
4. In tests:
   - Add or update unit tests capturing stdout/stderr for both test runs and CLI commands with --json to assert valid JSON structure containing expected keys.

# User Scenarios & Examples
Scenario: CI collects unified metrics
  Run JSON_REPORTER=true npm test to get { total, passed, failed, durationMs }.
  Run npm start -- --version --json to get { version, timestamp } without human-readable text.
  Run npm start -- --help --json to get { usage: "..." }.

# Verification & Acceptance Criteria
- Running test commands without JSON output remains unchanged.
- Running JSON_REPORTER=true npm test or npm test -- --json emits valid JSON only.
- Invoking CLI with --json alongside any command flag outputs a single JSON object without extra log lines.
- New tests validate JSON output format for tests and each CLI command.
- All existing tests still pass under both JSON and default modes.