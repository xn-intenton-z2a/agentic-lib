sandbox/features/VERBOSE_FLAGS.md
# sandbox/features/VERBOSE_FLAGS.md
# Feature Overview

Add new CLI flags to control logging verbosity and runtime statistics at execution time. Introduce two flags: `--verbose` to enable detailed debug output in each log entry, and `--stats` to print call count and uptime after command execution. These flags allow users to diagnose behavior and monitor performance without changing environment variables or modifying code.

# Value Proposition

  • Users gain runtime control over logging detail for troubleshooting and monitoring.
  • Facilitates debugging in local and CI environments without code changes.
  • Provides quick visibility into invocation count and process uptime for performance insights.

# Requirements

  1. Extend the existing CLI parser in `main` to recognize `--verbose` and `--stats`.
  2. When `--verbose` is present, set the global `VERBOSE_MODE` flag to true.
  3. When `--stats` is present, set the global `VERBOSE_STATS` flag to true.
  4. Ensure that downstream calls to `logInfo` and `logError` include extra fields when `VERBOSE_MODE` is true.
  5. After processing any supported command (`--help`, `--version`, `--digest` or default), if `VERBOSE_STATS` is true, print JSON with `callCount` and `uptime`.
  6. Update the usage instructions in `generateUsage` to document the new flags.
  7. Add unit tests covering both flags in combination with existing commands.
  8. Update README to describe new CLI options and illustrate usage examples.

# Success Criteria & Requirements

  - Passing `--verbose` produces additional `verbose: true` in log output objects.
  - Passing `--stats` after a command prints a JSON object with `callCount` and `uptime`.
  - Flags can work together or independently.
  - Tests assert correct behavior under all combinations of flags and commands.
  - Documentation reflects the new options and example invocations.

# User Scenarios & Examples

1. Developer runs `node src/lib/main.js --verbose --digest` in local mode and sees log entries with verbose details.
2. CI pipeline runs `npm start -- --stats` and captures call count and uptime metrics after version display.
3. Combined use: `npm start -- --verbose --stats --version` yields version info, verbose log of retrieval, then stats JSON.

# Verification & Acceptance

  - Unit tests for flag parsing, toggling of global flags, and correct output are implemented in `tests/unit/main.test.js`.
  - Manual test scenario with `--verbose` and `--stats` flags executed in sandbox and logged in CI.
  - README updated with new flag descriptions under CLI Usage section.
