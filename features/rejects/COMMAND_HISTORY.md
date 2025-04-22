# COMMAND_HISTORY Feature Specification

This update enhances the existing COMMAND_HISTORY functionality by introducing robust tracking and display of each processed command. Every successful command processed by the agenticHandler (both single and batch) is recorded in a global history. Users will be able to view this history via a new CLI flag.

# Overview

The COMMAND_HISTORY feature now maintains a global array that records details of every processed agentic command. Each record includes the command text, a timestamp, and its execution time in milliseconds. A new CLI flag (`--history`) displays the accumulated history in a user-friendly format.

# Implementation Details

## Source File Updates (src/lib/main.js):
- **Global History Initialization:**
  - At startup, initialize `globalThis.commandHistory` if not already set.

- **Recording Commands:**
  - In the `agenticHandler` function, after successfully processing a command (whether single or in batch), push an object to `globalThis.commandHistory`. The object must include:
    - `processedCommand`: The final command after any alias substitution and trimming.
    - `timestamp`: The ISO timestamp when the command was processed.
    - `executionTimeMS`: The time taken (in milliseconds) to process the command.

- **CLI Integration:**
  - Add a new branch in the main CLI logic to handle the `--history` flag. When provided, the program should output the current contents of `globalThis.commandHistory` as formatted JSON. If no commands have been processed, a message such as "No command history available." should be displayed.

## Test File Updates (tests/unit/main.test.js):
- **New Test Suite for Command History:**
  - Add tests to verify that after processing commands (single and batch), the global history array is updated correctly with command details.
  - Add a test for the CLI: invoking `main` with the `--history` flag should output the command history in JSON format. The test should check for the correct structure and contents of a history record.

## README File Updates (README.md):
- **CLI Behavior Section:**
  - Add documentation for the `--history` flag under CLI options:
    - Example: "--history: Display a history summary of processed agentic commands, including command details, timestamps, and execution times."

## Dependencies File Updates (package.json):
- No dependency changes are required for this update.

# Success Criteria & Verification

- Every time `agenticHandler` processes a command successfully, an entry is added to `globalThis.commandHistory` with all required details.
- The CLI flag `--history` correctly outputs the stored command history in a clear, formatted JSON structure.
- Test cases confirm that history tracking works both for single command and batch processing scenarios.
- The README accurately reflects the presence and usage of the new `--history` flag.

# Dependencies & Constraints

- The update is confined to modifications within existing files: source code (src/lib/main.js), tests (tests/unit/main.test.js), and documentation (README.md).
- All changes follow Node 20+ and ECMAScript Module standards.
- The enhancements align with the mission of making agentic operations transparent and traceable.
