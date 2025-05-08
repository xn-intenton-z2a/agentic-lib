# Purpose & Scope

Enhance the existing CLI reporting feature to support verbose and verbose-stats modes alongside streaming test events, mission alignment, coverage, and metrics. Introduce a new Dashboard Mode to generate an automated mission progress dashboard summarizing mission statuses and key workflow metrics.

# Value Proposition

- **Verbose Mode** (--verbose) enables detailed debug-level entries on logInfo and logError, including internal state and stack traces when errors occur, aiding rapid troubleshooting.
- **Verbose-Stats Mode** (--verbose-stats) appends current workflow metrics (call count, uptime, totalTests, passedTests, failedTests) after primary CLI outputs such as help, version, digest, and reporting streams.
- **Dashboard Mode** (--dashboard) generates a mission progress dashboard that presents missionProgress summary (totalMissions, completedMissions, pendingMissions) alongside other persisted metrics, enabling at-a-glance tracking of ongoing mission status.
- Unify flag handling so developers can combine verbose, verbose-stats, and dashboard modes with other reporting flags seamlessly.
- Maintain machine-readable JSON output for integrations, while preserving human-friendly formats.

# Success Criteria & Requirements

1. Flag Definitions
   - --verbose: toggles global VERBOSE_MODE to true.
   - --verbose-stats: toggles global VERBOSE_STATS to true.
   - --dashboard: toggles DASHBOARD_MODE to true.
   - Existing flags (--help, --version, --digest, --stream-test-events, --mission-report, --coverage-summary) remain supported.

2. Behavior in Dashboard Mode
   - When DASHBOARD_MODE is true, after processing other flags (help, version, digest, etc.), output a JSON object with:
     - missionProgress:
       - totalMissions: obtained from the .agentic_metrics.json file or zero if missing.
       - completedMissions: value from .agentic_metrics.json or zero if missing.
       - pendingMissions: computed as totalMissions minus completedMissions.
     - metrics: all other top-level fields from .agentic_metrics.json (e.g., totalIssues, successfulCommits).
   - If .agentic_metrics.json is missing or malformed, log an error entry and exit with code 1.

3. Integration & Combined Modes
   - Support combining --dashboard with --verbose and --verbose-stats flags.
   - Ensure output order: primary functionality, then dashboard (if --dashboard), then verbose diagnostics (if --verbose), then metrics dump (if --verbose-stats).

# Dependencies & Constraints

- Use fs/promises to read the .agentic_metrics.json file from the project root.
- Use existing formatLogEntry for structured log entries and error reporting.
- Introduce a new global DASHBOARD_MODE flag initialized from CLI arguments.
- Maintain ESM compatibility on Node 20.
- Write unit tests to cover: parsing of --dashboard flag, successful dashboard output, error handling when metrics file is invalid, and combined flag behavior.
- Update README CLI section and METRICS.md to document the new --dashboard flag and expected output structure.
