# Overview
This feature consolidates performance and runtime metrics enhancements into a unified module called PERF_STATS. It merges the capabilities provided by the verbose statistics mode and the simulation load functionality into a single, streamlined feature. When activated, the CLI will output detailed performance results such as CPU load simulation metrics (including minimum, maximum, and average execution times) along with runtime statistics like the global call count and process uptime.

# Implementation Details
- In the source file (src/lib/main.js), refactor and merge the existing implementations of the --simulate-load and --verbose-stats flags. Ensure that the simulate-load handler captures detailed timing data for simulated commands, including calculating minimum, maximum, and average execution times.
- Enhance the verbose mode (triggered by --verbose-stats) so that, in addition to the standard verbose output, it includes runtime statistics (global callCount and process uptime) alongside performance metrics from simulate-load if used concurrently.
- Update the CLI processing functions to output a consolidated JSON summary when both --simulate-load and --verbose-stats flags are active, ensuring clarity and consistency in the output.
- Modify unit tests in tests/unit/main.test.js to verify that when these flags are used (separately or together), the output contains accurate performance metrics and runtime statistics according to user expectations.
- Update the README file (README.md) in the CLI Behavior section to document this consolidated performance metrics feature, describing the usage of --simulate-load and --verbose-stats flags and the resulting JSON output.

# User Scenarios & Acceptance Criteria
- When the CLI is executed with --simulate-load, the run simulates CPU load and records detailed timing metrics (minimum, maximum, and average execution times) for each command.
- When the --verbose-stats flag is active, the CLI additionally outputs runtime statistics such as the cumulative call count and process uptime.
- When both flags are used together, the system outputs a consolidated JSON performance summary that includes all detailed metrics.
- Automated tests confirm that these functionalities are correctly integrated and that edge cases, such as invalid duration inputs, are appropriately handled.
