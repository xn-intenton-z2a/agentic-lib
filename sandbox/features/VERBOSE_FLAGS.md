# Purpose
Support dynamic activation of verbose logging and statistics in the CLI by introducing runtime flags to override the static default settings.

# Value Proposition
Allow users to enable detailed log entries and runtime statistics when invoking the CLI without modifying source code or environment. This improves debugging, observability, and operational insight by exposing internal log levels and performance metrics on demand.

# Success Criteria & Requirements
* Introduce two new CLI flags: `--verbose` and `--verbose-stats`.
* Change VERBOSE_MODE and VERBOSE_STATS in src/lib/main.js from constants to variables that can be set at runtime based on CLI flags.
* `--verbose` toggles verbose mode, causing logInfo and logError to include additional fields (e.g., stack traces) as defined by existing logic.
* `--verbose-stats` toggles stats mode so that after each handled CLI flag, the tool prints a JSON object with current callCount and uptime.
* Flags should be processed before any other CLI handlers (help, version, digest, etc.).
* The CLI handlers (processHelp, processVersion, processDigest, and any future handlers) should respect the updated variables and output extra information accordingly.
* No new external dependencies should be added.

# Implementation Details
1. In src/lib/main.js, change:
   ```js
   const VERBOSE_MODE = false;
   const VERBOSE_STATS = false;
   ```
   to:
   ```js
   let VERBOSE_MODE = false;
   let VERBOSE_STATS = false;
   ```
2. Define a function `processVerboseFlags(args)` before other CLI helpers:
   - If args includes `--verbose`, set VERBOSE_MODE = true.
   - If args includes `--verbose-stats`, set VERBOSE_STATS = true.
   - Return true if either flag was present, otherwise false.
3. In main(args), at the very top, call `processVerboseFlags(args)` to initialize the variables before invoking any other handlers.
4. Ensure existing logging helpers (`logInfo`, `logError`) automatically include verbose details when VERBOSE_MODE is true.
5. After any CLI handler returns true (help, version, digest, or others), if VERBOSE_STATS is true, print:
   ```js
   console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
   ```
6. Update README.md under CLI Usage to document:
   - `--verbose` to enable verbose logging
   - `--verbose-stats` to print callCount and uptime after each command
   - Show example invocations and sample outputs with additional fields and stats
7. Add Vitest tests in tests/unit/main.test.js:
   - Verify that passing `--verbose` causes logInfo to output additional verbose data (e.g., contains a verbose flag in the JSON log entry).
   - Verify that passing `--verbose-stats` causes a stats JSON line to be printed after a handled flag (e.g., after `--help`).
   - Test combinations of both flags.

# Verification & Acceptance
* Run `npm test` to confirm new tests pass and existing tests remain unaffected.
* Invoke the CLI with and without `--verbose` and `--verbose-stats` to manually observe additional log fields and stats output.
* Confirm that non-flag behavior remains unchanged when flags are absent.
* Ensure code style and formatting adhere to existing patterns.