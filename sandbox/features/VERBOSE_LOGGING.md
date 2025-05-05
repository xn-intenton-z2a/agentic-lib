# Objective
Enable users to turn on detailed logging and statistics output via new CLI flags, improving observability and debugging in workflows.

# Value Proposition
With verbose logs and runtime metrics available on demand, developers can quickly diagnose failures, trace execution steps, and measure performance in local or CI environments without changing code.

# Requirements
1. Support a --verbose flag that enables inclusion of a verbose field in info logs and full error stack traces in error logs.
2. Support a --verbose-stats flag that, when combined with any command, prints callCount and uptime metrics after execution.
3. Update the usage instructions to document both flags under CLI Helper Functions.
4. Maintain backward compatibility: existing behavior when flags are absent must remain unchanged.
5. Provide unit tests covering scenarios with and without each flag, including error handling with verbose enabled.
6. Update README to include examples of invoking the CLI with --verbose and --verbose-stats and sample output.

# Implementation
Modify src/lib/main.js to:
1. Parse args for --verbose and --verbose-stats before processing help, version, or digest flags.
2. Set global constants VERBOSE_MODE and VERBOSE_STATS based on presence of flags.
3. Enhance logInfo to add a verbose property when VERBOSE_MODE is true.
4. Enhance logError to include error.stack when VERBOSE_MODE is true.
5. After any handled command in main, if VERBOSE_STATS is true, log callCount and uptime.
6. Update generateUsage to list both new flags with descriptions.

# Tests & Verification
1. In tests/unit/main.test.js, add cases invoking main with ["--verbose"] and a dummy command to verify console.log entries include verbose:true.
2. Add tests for --verbose-stats to confirm callCount and uptime are printed after commands.
3. Simulate error within a handler to verify error.stack appears when verbose mode is on.
4. Ensure existing tests without flags still pass with unchanged output.

# Documentation
1. Update sandbox/README.md to add a section for CLI Usage Flags showing examples of --verbose and --verbose-stats.
2. Include sample JSON log entries demonstrating the verbose field and stats output.
