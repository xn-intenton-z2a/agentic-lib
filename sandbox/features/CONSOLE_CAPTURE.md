# Objective
Add a CLI option to agentic-lib that enables or disables runtime console output capture, extending the existing Console Capture Utility beyond Vitest integration to all CLI commands.

# Scope
Intercept and buffer console.log and console.error calls when running agentic-lib CLI with a new flag. Support the same capture API used in tests, and emit grouped logs after command execution or on demand.

# Requirements
- Introduce a new CLI flag `--capture-console` in `src/lib/main.js`.
- Support an environment variable `AGENTIC_CAPTURE_CONSOLE` as an alternative toggle.
- When capture is enabled, invoke `startConsoleCapture()` before any command logic and `stopConsoleCapture()` after command execution.
- After stopping capture, print a header `Captured Console Output:` followed by JSON-formatted entries for each buffered log.
- Preserve existing behavior: capture disabled by default; no impact on commands when flag is absent.
- Ensure compatibility with existing Vitest console capture setup and preserve timestamps, levels, and messages.

# Success Criteria
- Running `agentic-lib --capture-console --digest` captures all logs produced by the digest command and prints them after execution.
- Environment variable toggle works: `AGENTIC_CAPTURE_CONSOLE=true agentic-lib --digest` yields the same result as the flag.
- No logs are buffered or suppressed when capture is not enabled.

# Design
1. Update CLI argument parsing in `src/lib/main.js` to detect `--capture-console`.
2. If enabled, call `startConsoleCapture()` at the very start of `main` and schedule `stopConsoleCapture()` after each command runs.
3. After `stopConsoleCapture()`, retrieve buffered entries via `getCapturedOutput()`, print a header, then iterate entries and `console.log(JSON.stringify(entry))` for each.
4. Add fallback using `process.env.AGENTIC_CAPTURE_CONSOLE` if flag is not provided.
5. Write minimal glue code so that core capture logic remains in `sandbox/source/consoleCapture.js` and tests continue to work.

# Testing and Verification
- Unit tests for `main` to simulate invocation with and without the flag. Use `vi.spyOn` on `startConsoleCapture` and `stopConsoleCapture` to confirm calls.
- Integration test: mock console output in a dummy CLI command and verify the captured logs appear after header when running with the flag.
- E2E test: spawn a child process running the CLI with `--capture-console` and inspect stdout for header and JSON logs.
- Verify environment variable toggle, clearing and restoring capture buffer between runs.
