# EXEC_TIMINGS Feature Specification

## Overview
This feature introduces a new CLI flag `--timings` to measure and output the execution time of the commands processed by the agentic-lib. By wrapping the command execution flow with a timer, users will receive a report of how long the operation took, enhancing observability and performance troubleshooting without altering any core functionalities.

## Implementation Details

### Source File Modifications (src/lib/main.js)
- **Timer Integration:**
  - Modify the `main` function to check if the `--timings` flag is present in the command arguments.
  - If present, capture the start time before processing any command.
  - After processing the command(s) (including CLI flags like `--agentic`, `--digest`, etc.), compute the elapsed time and print it to the console using a formatted message (e.g., "Execution time: X ms").
  - Ensure that all branches (like `--help`, `--version`, etc.) include timing calculation where appropriate without interfering with their original behavior.

### Testing Enhancements (tests/unit/main.test.js)
- **New Test Cases for Execution Timings:**
  - Add test cases that invoke the CLI with the `--timings` flag along with another valid flag (such as `--dry-run` or `--status`).
  - Verify that the console output includes a message indicating the execution time (e.g., matches a regex like /Execution time: \d+ ms/).
  - Ensure that the addition of timings does not break existing CLI functionalities.

### Documentation Updates (README.md)
- **Usage Section Update:**
  - Include examples showing how to use the `--timings` flag.
  - Document that the flag is intended to provide users with performance insights for the executed command.

## Benefits & Success Criteria
- **Enhanced Observability:** Users can now easily measure how long each command or interaction takes, which is particularly useful for debugging or performance tuning.
- **Non-intrusive:** The feature integrates seamlessly with existing commands, providing additional value without modifying core behaviors.
- **Testable:** New unit tests ensure that the timing output is correctly reported and does not interfere with other outputs.
- **Documentation:** Updated README makes it clear how to utilize the new flag, helping users and developers alike.
