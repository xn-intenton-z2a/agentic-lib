# Objective
Add configurable verbose logging and statistics output controlled by CLI flags and environment variables to improve debugging and operational visibility.

# Implementation Details
- Insole in source main file, parse two new CLI flags: --verbose and --verbose-stats.
- When --verbose is supplied, set VERBOSE_MODE global flag to true. When --verbose-stats is supplied, set VERBOSE_STATS global flag to true.
- Update logInfo and logError helpers to include additional diagnostic fields when VERBOSE_MODE is true.
- In main execution flow, after processing help version or digest commands, if VERBOSE_STATS is true, always output current callCount and process uptime in JSON format.

# Test Coverage
- Add unit tests to simulate CLI invocation with and without verbose flags and assert that log entries include verbose fields or statistic outputs appropriately.
- Mock console to capture output and verify correct logging behavior when flags are enabled.

# Documentation
- Update README usage section to document the new flags and their effects, including examples showing verbose log entries and statistics output.