# COMMAND_STATS Feature Specification

This feature introduces a new CLI flag, `--command-stats`, which calculates and displays aggregated statistics based on the history of processed agentic commands. These metrics provide users with quick insights into overall command performance, including total commands processed, average execution time, fastest and slowest command execution times, and the sum of execution times.

## Overview

- **Purpose:** Provide a concise statistical summary of command processing to help monitor performance and identify anomalies over time.
- **Value Proposition:** Enhance observability by offering aggregated performance metrics that complement the detailed command history already maintained by the system.
- **Scope:** Update existing source, test, and README files without adding or removing files.

## Implementation Details

### Source File (src/lib/main.js)

- **Global Command History:**
  - Ensure that a global array `globalThis.commandHistory` exists to hold command execution records. Each record should include properties:
    - `processedCommand` (string)
    - `timestamp` (string in ISO format)
    - `executionTimeMS` (number)

- **Function: `commandStatsHandler()`**
  - Create a new function that scans `globalThis.commandHistory` and computes the following metrics:
    - `totalCommands`: Total number of commands processed.
    - `totalExecutionTimeMS`: Sum of all execution times.
    - `averageExecutionTimeMS`: Average execution time across all commands.
    - `minExecutionTimeMS`: Fastest (minimum) execution time.
    - `maxExecutionTimeMS`: Slowest (maximum) execution time.
  - If no command history exists, output a message indicating that no commands have been processed.
  - Output the metrics as formatted JSON to the console.

- **CLI Integration:**
  - Update the main CLI logic to check for the `--command-stats` flag. When provided, the program should call `commandStatsHandler()` and exit immediately.

### Test File (tests/unit/main.test.js)

- **New Test Cases:**
  - Add tests to simulate processing a series of commands (populating `globalThis.commandHistory` with sample records) and then invoke the CLI with `--command-stats`.
  - Verify that the output JSON includes all aggregated metrics with correct values.
  - Check proper behavior when no command history is present (output should indicate no available history).

### README File (README.md)

- **CLI Commands Section Update:**
  - Document the new `--command-stats` flag:
    > `--command-stats`: Calculate and display statistics for processed commands, including total number, average execution time, minimum and maximum execution times, and total execution time.

## Success Criteria & Verification

- **Functionality:** When `--command-stats` is used, the CLI outputs a JSON object containing aggregated metrics based on the command history.
- **Test Coverage:** Automated tests verify that aggregated metrics are computed accurately and that the output is formatted correctly.
- **User Feedback:** If no commands have been processed, the CLI should clearly indicate that command history is empty.

## Dependencies & Constraints

- The feature is confined to modifications within the source file, test file, and documentation (README).
- No new dependencies are introduced; the feature leverages existing global variables and CLI processing mechanisms.

By implementing the `COMMAND_STATS` feature, users gain valuable insights into the performance of their agentic commands, aligning with the mission of providing transparent and accessible automation diagnostics.
