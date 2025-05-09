# Purpose
Integrate structured JSON reporting for Vitest runs when invoked via the CLI to enable machine parsing and improved CI dashboards.

# Specification
1. CLI Integration:
   - Introduce a new processTestReport helper to detect the --test-report flag among CLI args.
   - On detection, import the run function from vitest programmatic API and execute tests with reporter set to json.
   - Stream the JSON lines emitted by Vitest, parse each line, add a timestamp if missing, and forward the object to logInfo for structured output.
   - Exit the process after reporting completes, returning Vitest exit code.

2. Source File Changes in src/lib/main.js:
   - Implement processTestReport(args) before existing flag handlers.
   - Extend main() to call processTestReport and return if it handled the flag.
   - Wrap runner invocation in try catch and call logError on failures, then exit with nonzero status.

3. Dependency Updates in package.json:
   - Ensure vitest is available as a devDependency for programmatic use.

4. README Updates in sandbox/README.md:
   - Document the --test-report flag, describe JSON output format, and provide an example CI invocation.

# Tests
- In sandbox/tests/jsonReporter.test.js
  - Mock the vitest run function to simulate streaming of JSON objects for start, test pass, test fail, and end events.
  - Verify that logInfo is called with each parsed event object.
  - Simulate a runner error and verify logError is invoked with error details.

# Success Criteria
- Running node src/lib/main.js --test-report executes Vitest in JSON mode and emits structured logs to stdout.
- Errors during reporter execution are logged as structured error entries.
- Automated tests cover both normal reporting and error scenarios.

# Value Proposition
Enable structured test output that CI systems and monitoring tools can ingest, improving visibility and automation of test result processing.