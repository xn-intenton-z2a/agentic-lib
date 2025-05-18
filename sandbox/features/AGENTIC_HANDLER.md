# Value Proposition
- Introduce CLI flags `--verbose` and `--stats` to control runtime logging verbosity and metrics output across both HTTP and CLI workflows.
- Enhance observability and debugging by allowing users to see detailed trace data and performance statistics when invoking agentic workflows or digest replays.
- Maintain existing agentic automation features while offering fine-grained control over log output and execution metrics.

# Success Criteria & Requirements
- Extend `sandbox/source/main.js` and `src/lib/main.js` to recognize `--verbose` and `--stats` flags before primary command processing.
  - When `--verbose` is set, enable detailed logging: `VERBOSE_MODE = true` so that `logInfo` and `logError` include additional data and stack traces when available.
  - When `--stats` is set, enable `VERBOSE_STATS = true` so that after any command (mission, help, version, digest, or agentic), the CLI prints a JSON object containing `{ callCount, uptime }`.
- Update the usage instructions in both CLI helpers (`generateUsage`) across sandbox and core source to document `--verbose` and `--stats` flags.
- Ensure flag parsing does not interfere with existing flags (`--help`, `--mission`, `--version`, `--digest`, `--agentic`). Flags order should be flexible.
- All logging functions (`logInfo`, `logError`) should respect the new `VERBOSE_MODE` setting.

# User Scenarios & Examples
## Verbose Mode
Run an agentic workflow with detailed logging:

$ echo '{"headers": {"x-github-event": "workflow_call"}, "body": {"event": "workflow_call"}}' \
  | node sandbox/source/main.js --agentic --verbose

Expect console output of each log entry with additional debug fields and AI plan dispatch confirmation.

## Stats Output
Run a digest replay and get runtime metrics:

$ node sandbox/source/main.js --digest --stats

Expect the usual digest handler output followed by a JSON line containing callCount and uptime.

# Verification & Acceptance
- Add unit tests in `sandbox/tests` to invoke the CLI with combinations of `--verbose` and `--stats`, mocking `console.log` and `console.error`, and asserting:
  - `logInfo` outputs include `verbose` flag and extra data when `--verbose`.
  - After command completion with `--stats`, one additional console output with callCount and uptime JSON.
- Ensure existing tests for mission, help, version, digest, and agentic continue to pass without regression.
- Update `README.md` in sandbox to include the new flags in the options list with descriptions.