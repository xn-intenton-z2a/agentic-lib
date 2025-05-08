# Purpose & Scope

Enhance the existing CLI reporting feature to support verbose and verbose-stats modes alongside streaming test events, mission alignment, coverage, and metrics. Introduce two new flags to enable detailed runtime diagnostics and append workflow metrics after core outputs for deeper insight during development and automated runs.

# Value Proposition

- **Verbose Mode** (--verbose) enables detailed debug-level entries on logInfo and logError, including internal state and stack traces when errors occur, aiding rapid troubleshooting.
- **Verbose-Stats Mode** (--verbose-stats) appends current workflow metrics (call count, uptime, totalTests, passedTests, failedTests) after primary CLI outputs such as help, version, digest, and reporting streams.
- Unify flag handling so developers can combine verbose and verbose-stats with other reporting flags seamlessly.
- Maintain machine-readable JSON output for integrations, while preserving human-friendly formats.

# Success Criteria & Requirements

1. Flag Definitions
   - --verbose: toggles global VERBOSE_MODE to true.
   - --verbose-stats: toggles global VERBOSE_STATS to true.
   - Existing flags (--help, --version, --digest, --stream-test-events, --mission-report, --coverage-summary) remain supported.

2. Behavior in verbose Mode
   - logInfo and logError include additional fields when VERBOSE_MODE is true:
     - logInfo appends a verbose=true flag and any contextual data.
     - logError includes stack trace when available.

3. Behavior in verbose-stats Mode
   - After processing --help, --version, --digest, or any reporting stream, if VERBOSE_STATS is true, output a JSON object with:
     - callCount: number of times main has been invoked in this session.
     - uptime: process uptime in seconds.
     - totalTests, passedTests, failedTests, missionsReported from .agentic_metrics.json.

4. Integration & Combined Modes
   - Support combining --verbose and --verbose-stats with all other flags.
   - Ensure flag precedence: if both are active, primary output occurs first, then verbose diagnostics (if --verbose), then metrics dump (if --verbose-stats).

# Dependencies & Constraints

- Use existing formatLogEntry for additional fields.
- Use fs/promises to read metrics file .agentic_metrics.json for verbose-stats.
- Maintain ESM compatibility on Node 20.
- Write unit tests to cover: setting flags, logInfo/logError behavior, stats output, flag combinations.
- Update README CLI section and METRICS.md to document new flags and behavior.