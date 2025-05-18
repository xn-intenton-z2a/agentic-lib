# Objective
Provide a built-in mechanism to collect and export runtime usage statistics from the library, exposed via a new CLI flag. This will enable consumers to inspect call counts, handler invocations, and uptime metrics in a structured format.

# Value Proposition
By adding a --stats command, users and automated workflows can easily retrieve operational telemetry without external monitoring systems. It helps teams debug, validate processing volumes, and track library adoption over time.

# Requirements
1. Introduce a new global stats object that tracks:
   • Number of times digestLambdaHandler has processed records
   • Number of successful and failed record processing attempts
   • Total invocation count of the main CLI entry point
   • Uptime since process start
2. Implement a processStats(args) function that:
   • Detects the --stats flag in CLI arguments
   • Outputs a JSON object with the above metrics and exits
3. Ensure --stats can be combined with VERBOSE_STATS and increments callCount
4. Add automated tests to verify metrics collection and correct JSON output
5. Update README to document the --stats flag and example output

# Implementation
• Modify src/lib/main.js:
  • Import process.uptime() at module scope to capture start time
  • Increment counters in main invocation and in digestLambdaHandler loop
  • Add processStats(args) before other CLI flags to handle --stats
  • Output metrics JSON via console.log and return true to exit
• Update tests/unit/main.test.js:
  • Mock process.uptime() and globalThis.callCount
  • Test that running main(["--stats"]) logs the expected metrics structure
  • Test counters increment correctly after sample digest events
• Update sandbox/README.md:
  • Document the --stats flag under CLI usage
  • Show example JSON response with version, uptime, callCount, batchItemFailures, handler invocation counts

# Verification & Acceptance
• Unit tests covering positive and negative cases for --stats
• CI ensures all tests pass with npm test
• Manual test: run node src/lib/main.js --stats and inspect JSON structure
