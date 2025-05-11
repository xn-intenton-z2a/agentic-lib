# Objective

Introduce a new CLI flag `--stats` that reports runtime metrics for each invocation of agentic-lib. This feature will enable users and automation workflows to inspect how many times the library has processed events or logged messages during a session and view current uptime for monitoring and diagnostics.

# Value Proposition

- Provides visibility into invocation volume and execution time for troubleshooting and performance monitoring.
- Enables CI/CD and automation workflows to assert health or detect unusual behavior by evaluating call counts and uptime.
- Builds upon existing global call tracking and verbose stats infrastructure to deliver immediate insight without external tooling.

# Requirements & Success Criteria

1. Extend the call-count mechanism by incrementing a counter each time the library logs a message (info or error).
2. Add support for a new CLI flag `--stats` that, when provided, prints a JSON object with:
   - `callCount`: total number of log entries since process start.
   - `uptime`: process uptime in seconds.
3. Update the usage instructions displayed by `--help` to include the `--stats` flag.
4. Ensure the feature does not disrupt existing CLI flags (`--help`, `--version`, `--digest`).
5. Tests must verify:
   - When `--stats` is passed, output is valid JSON with the expected keys.
   - The callCount increments when logging functions are invoked.

# User Scenarios & Examples

- As a workflow maintainer, I run `agentic-lib --digest --stats` to process a batch and immediately inspect the number of log entries and total uptime.
- As a developer debugging an integration, I run `agentic-lib --stats` to confirm that no events have been processed and check that the tool is running correctly.

# Verification & Acceptance

- Unit tests in `tests/unit` cover:
  - Invocation of `main(['--stats'])` logs a JSON string parseable into an object with `callCount` and `uptime` keys.
  - After one logging call (e.g., by invoking `digestLambdaHandler`) and then `main(['--stats'])`, the `callCount` reflects the correct count.
- Manual acceptance:
  - Running `node src/lib/main.js --stats` prints a JSON object with the two metrics and exits cleanly.
  - Running `node src/lib/main.js --help` and `node src/lib/main.js --version` still behave as expected, with `--stats` described in the help text.
