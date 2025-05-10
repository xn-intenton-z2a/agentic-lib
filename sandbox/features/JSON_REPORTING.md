# Objective & Scope

Unify structured machine-readable output, automated coverage enforcement, and introduce a new --report CLI flag to produce a complete repository state summary. This single feature replaces separate JSON output and coverage features, providing:

- Consistent JSON output for tests, help, version, digest, and summary commands.
- Automated code coverage reporting with enforcement and a README badge.
- A new --report option that emits a JSON summary of the repository state, including branch name, latest commit hash, test results, coverage percentage, and configuration values.

# Value Proposition

- Simplifies integration with CI/CD and monitoring systems by offering a single reporting mechanism.
- Enforces code quality through coverage thresholds and visible status.
- Streamlines diagnostics by providing a one-command overview of repository health and configuration.

# Success Criteria & Requirements

- Users can request JSON output via --json flag or JSON_OUTPUT environment variable for all CLI commands and test runs.
- Automated coverage reporting in CI with minimum thresholds (e.g., 80% statements, branches, functions, lines) causing failure if unmet.
- README displays a live coverage badge from shields.io reflecting current coverage percentage.
- New --report flag outputs a JSON object summarizing:
  - Current Git branch and latest commit hash.
  - Test suite summary: total, passed, failed, duration.
  - Coverage percentages matching threshold reporting.
  - Loaded configuration values (e.g., GITHUB_API_BASE_URL, OPENAI_API_KEY).
- No new files beyond package.json, src/lib/main.js, README.md, and tests are created or removed.

# Implementation Details

1. package.json updates
   • Add a "report" script alias: "npm run report" which invokes the CLI with --report.
   • Update test and test:unit scripts to support --json and --coverage flags.
2. src/lib/main.js
   • Introduce processReport(args) to handle --report before other commands.
   • Gather information from Git using a lightweight child_process exec call (e.g., git rev-parse --abbrev-ref HEAD, git rev-parse HEAD).
   • Combine branch, commit, test summary (by invoking internal test runner or using Vitest JSON output), and coverage summary into a single JSON object via formatLogEntry.
   • Detect --json or JSON_OUTPUT and wrap existing commands accordingly.
3. README.md updates
   • Add coverage badge at top using shields.io.
   • Document new --report flag and show example JSON output.
   • Illustrate usage of JSON output for tests and CLI commands.
4. Tests
   • Add unit tests for processReport to mock Git commands, simulate test runner and coverage outputs, and verify valid JSON summary structure.
   • Ensure existing JSON and coverage tests still pass without modification.

# Verification & Acceptance Criteria

- npm test and npm run report produce valid JSON objects when --json or --report is used.
- Coverage thresholds enforced in CI and local runs via npm run coverage.
- README badge displays correct coverage percentage.
- Repository summary includes accurate branch, commit, tests, coverage, and config values.
