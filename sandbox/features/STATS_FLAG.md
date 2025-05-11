# Objective
Enable users to request runtime execution statistics by introducing a new CLI flag `--stats` that prints callCount and uptime after any command finishes.

# Value Proposition
Deliver actionable insights into how the library is being used during development and workflows. The statistics flag aids debugging, performance monitoring, and operational observability without changing existing behavior when not in use.

# Requirements
1. Introduce a `--stats` CLI flag recognized by the main entrypoint.
2. When the `--stats` flag is present, after processing any of the supported commands (help, version, digest, or default usage), output a JSON object containing:
   - `callCount`: the global count of operations executed during this run.
   - `uptime`: the process uptime in seconds.
3. Integrate the `--stats` option into the generated usage instructions.
4. Ensure that the new flag does not alter behavior when omitted.

# Implementation Details
- Change `const VERBOSE_STATS = false` to `let VERBOSE_STATS = false` in `src/lib/main.js`.
- Before processing known flags (`--help`, `--version`, `--digest`), detect and remove `--stats` from the args, setting `VERBOSE_STATS = true`.
- After each command handler completes, if `VERBOSE_STATS` is true, print JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }) to stdout.
- Update `generateUsage()` text to mention `--stats` and describe its effect.

# Test Scenarios
- Invoke CLI with `--stats --help` and verify help text followed by a JSON stats object.
- Invoke CLI with `--stats --version` and verify version info JSON followed by stats JSON.
- Invoke CLI with `--stats --digest` and verify digest logs followed by stats JSON.
- Invoke CLI with `--stats` alone and verify default usage text followed by stats JSON.
- Ensure absence of `--stats` produces no statistics output.

# Acceptance Criteria
- All existing tests continue to pass.
- New tests added to cover each scenario above and pass under Vitest.
- README updated to include documentation for `--stats` flag.
