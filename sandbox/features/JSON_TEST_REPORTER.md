# Purpose

Enable structured JSON reporting for Vitest test runs when invoked via the CLI. This facilitates automated parsing of test results by CI pipelines and monitoring systems, improving visibility and integration.

# Specification

1. CLI Integration
   - Detect a new `--test-report` flag in the CLI arguments within the main entry point.
   - When present, invoke the Vitest programmatic API with reporter set to `json`.
   - Stream JSON output lines from Vitest, parse each line into an object, ensure each event has a valid ISO timestamp, and forward to a `logInfo` helper for uniform structured logging.
   - After all events are processed, exit with Vitest’s exit code.

2. Source File Changes in `src/lib/main.js`
   - Implement a `processTestReport(args)` function:
     - Check for the presence of `--test-report`.
     - Import and call `run` from `vitest` programmatic API with appropriate reporter options.
     - Stream, parse, timestamp, and log each JSON event.
   - Modify `main()` to invoke `processTestReport` early and return if handled.
   - Wrap the runner invocation in try/catch to call `logError` on exceptions and exit with nonzero code.

3. Dependency Updates
   - Ensure `vitest` is listed as a devDependency for programmatic API usage.

4. Documentation Updates in `sandbox/README.md`
   - Add a dedicated section explaining the `--test-report` flag.
   - Describe the JSON output schema and provide a CLI example for CI integration.

# Dependencies & Constraints

- Depends on `vitest` as a devDependency.
- Must run in Node 20+ under ESM standards.
- JSON output must be newline-delimited objects, each containing `level`, `timestamp`, `message`, and any event-specific fields.

# User Scenarios & Examples

- **CI Integration:** A CI job runs `node src/lib/main.js --test-report`, captures stdout, parses each JSON object to display aggregated test results.
- **Local Debugging:** Developers invoke the flag locally to get structured logs for faster analysis and integration with local dashboards.

# Success Criteria & Verification

- Automated tests in `sandbox/tests/jsonReporter.test.js` cover:
  - Streaming of start, pass, fail, and end events.
  - Addition of missing timestamps.
  - Error handling when the Vitest runner throws.
- Manual verification by running `node src/lib/main.js --test-report` and confirming correct JSON output and exit code alignment with test outcomes.
