# COMMAND_HISTORY Feature Specification

This feature introduces tracking and displaying a history of processed agentic commands. It enhances observability and debugging by maintaining a runtime log of each command processed through the agenticHandler. The history includes the command text, timestamp, and execution time in milliseconds.

# Overview

The COMMAND_HISTORY feature maintains a global list of processed commands. Each time a command is processed (whether a single command or within a batch), an entry is recorded that captures the processed command, the timestamp when it was executed, and the execution time. Additionally, a new CLI flag `--history` is added to display the history log to the user.

# Implementation Details

1. **Source File Changes (`src/lib/main.js`):**
   - Introduce a new global variable (e.g., `globalThis.commandHistory`) initialized as an empty array.
   - In the `agenticHandler` function, after a command is successfully processed, push an object containing `processedCommand`, `timestamp`, and `executionTimeMS` into `globalThis.commandHistory`.
   - In batch processing, each successfully processed command should also be added to the history array.
   - Update the CLI usage in the `generateUsage` function to include the new `--history` flag.
   - Add a new CLI handler: when the `--history` flag is provided, output the command history in a formatted JSON or human-readable format.

2. **Test File Changes (`tests/unit/main.test.js`):**
   - Add a test suite for the COMMAND_HISTORY functionality.
   - Verify that after invoking `agenticHandler`, the `globalThis.commandHistory` includes an entry for the command that was processed.
   - Verify that invoking the CLI with the `--history` flag outputs the history data.

3. **README File Updates (`README.md`):**
   - Update the CLI Commands section to document the new `--history` flag with a description stating: "Display a history summary of processed agentic commands including command details, timestamps, and execution times."
   - Document the overall benefit of tracking command history for debugging and monitoring purposes.

# Success Criteria & Verification

- The `globalThis.commandHistory` array must accumulate entries each time a command is processed via `agenticHandler`.
- When the CLI is run with the `--history` flag, the output contains the recorded history in a clear format.
- Unit tests must verify that history entries are correctly recorded and retrievable via the CLI flag.

# Dependencies & Constraints

- This feature is implemented solely by updating existing source, test, and README files. No new files are created.
- The feature conforms to the project's Node 20 and ECMAScript Module standards.

This enhancement provides developers and users with valuable insights into the execution flow, aiding troubleshooting and usage analysis in line with the overall mission of the agentic library.