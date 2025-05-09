sandbox/features/CLI_METRICS.md
# sandbox/features/CLI_METRICS.md
# Objective
Collect and emit structured metrics for all CLI operations in agentic-lib.

# Value Proposition
Provide teams and CI pipelines with accurate, machine-readable insights into command usage, performance, and error rates. Leverage existing global callCount counter and enrich logs with metrics to drive monitoring and optimization of autonomous workflows.

# Success Criteria & Requirements
- Introduce a new CLI flag --metrics that triggers metrics collection and emission.
- After any CLI invocation (help, version, digest, feedback), capture:
  - Total invocations per command type.
  - Duration of command execution in milliseconds.
  - Total error count encountered during execution.
  - Current globalThis.callCount value.
- Emit collected metrics as a single JSON object to stdout when --metrics is supplied.
- Ensure default CLI behavior remains unchanged when --metrics flag is absent.

# Implementation Details
1. Extend src/lib/main.js:
   - Introduce a metrics collector object tracking counts, durations, and errors per command.
   - Wrap command handlers (processHelp, processVersion, processDigest, processFeedback) with timers and error hooks.
   - Implement a new function processMetrics(args) that checks for --metrics flag and outputs the metrics JSON.
2. Update tests in tests/unit/main.test.js:
   - Add tests to verify metrics object structure and values for success and error scenarios.
   - Mock timers to simulate execution durations.
   - Use globalThis.callCount in assertions.
3. Update sandbox/README.md Usage section:
   - Document the --metrics flag and provide an example JSON output.
4. No new dependencies required; reuse existing formatLogEntry for structured output.

# User Scenarios
- CI pipeline runs node main.js --digest --metrics to ingest metrics into observability systems.
- Developer runs node main.js --help --metrics to audit how often help is invoked and command performance.

# Verification & Acceptance
- Unit tests simulate each command with --metrics and validate metrics JSON schema.
- Manual runs confirm metrics JSON appears only when --metrics is present and retains original CLI output when absent.
- All existing tests and new metrics tests pass without regressions.