# LOG_FORMAT Feature Specification

This feature introduces a new CLI flag `--log-format` which enables users to select the output format for log messages. By default, the agentic-lib logs messages in JSON format. With the new feature, users can specify either `json` or `plain` to get logs in machine-readable JSON or human-friendly plain text respectively.

## Objectives

- **User Configuration:** Allow users to customize logging output format via the CLI.
- **Enhanced Usability:** Provide easier readability when plain text is preferred and maintain machine-readability with JSON by default.
- **Minimal Changes:** Confine modifications to the source file, test file, README file, and dependencies file without introducing new files.

## Implementation Details

### Source File (src/lib/main.js) Changes

- **Global Variable:** Introduce a new global variable `LOG_FORMAT` with a default value of "json".

- **CLI Flag Handling:** In the main CLI function, parse the optional flag `--log-format`. Accept a following argument specifying either "json" or "plain". Set `LOG_FORMAT` accordingly; if an invalid value is provided, default to "json" and log a warning.

- **Logging Functions Update:** Update `logInfo` and `logError` functions:
  - If `LOG_FORMAT` is set to "json", output logs as JSON string (maintaining existing behavior).
  - If set to "plain", output logs in a human-readable plain text format, e.g., `[LEVEL] message - timestamp`.

### Test File (tests/unit/main.test.js) Changes

- **New Test Cases:** Add tests to verify that when the `--log-format plain` flag is provided, log messages are output as plain text rather than JSON formatted strings.

- **Test Verification:** Ensure that other CLI commands continue to work correctly regardless of the log format setting and that the default remains JSON if the flag is not used.

### README File (README.md) Updates

- **CLI Behavior Section:** Update the CLI Commands section to include documentation for the new `--log-format <format>` flag. For example:

  > `--log-format <format>`: Specify the logging output format. Allowed values are `json` (default) and `plain` for human-readable logs.

## Success Criteria & Verification

- When invoked with `--log-format plain`, log messages output by `logInfo` and `logError` are in plain text format.
- The default logging format is JSON if the flag is omitted or an invalid value is provided.
- Tests in `tests/unit/main.test.js` confirm that the logging output reflects the selected format and that overall CLI behavior remains stable.

## Dependencies & Constraints

- The feature adheres to modifying only the source file, tests, README, and dependency file content (if necessary).
- It remains compatible with Node 20+ and ECMAScript Module standards.

By allowing users to choose between JSON and plain text logging formats, this feature enhances the usability and flexibility of agentic-lib, aligning with the mission to provide transparent and accessible automation workflows.