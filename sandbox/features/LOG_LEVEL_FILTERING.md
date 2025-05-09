# Objective

Allow users to specify which log levels to capture when using the Console Capture Utility, filtering out unwanted entries and focusing on relevant output.

# Value Proposition

By enabling configurable log level filters, developers and testers can limit captured logs to only the levels they care about (for example, capturing only errors or warnings). This reduces noise in test output, diagnostics, and runtime analysis, making it easier to identify issues and verify expected behaviors.

# Scope

- Modify sandbox/source/consoleCapture.js:
  - Update startConsoleCapture to accept an optional parameter `levels` (an array of strings or comma-separated string) representing the log levels to capture (e.g., ['info', 'error']).
  - Store the allowed levels internally and only buffer entries whose `level` is included in the configured list.
  - Preserve existing behavior when no levels are provided: capture all levels.
- Update sandbox/tests/consoleCapture.test.js:
  - Add tests to verify that when startConsoleCapture is called with a levels filter, only entries matching those levels are captured.
  - Ensure tests cover filtering single level (e.g., only 'error') and multiple levels.
  - Maintain existing tests for default behavior.
- Update sandbox/docs/CONSOLE_CAPTURE.md:
  - Document the new optional `levels` parameter for startConsoleCapture, describe valid values, default behavior, and example usage.
- Update sandbox/README.md:
  - In the "Console Capture" section, note support for passing an array of levels to filter captured logs and include an example.
- No changes to dependencies.

# Success Criteria

1. Invoking startConsoleCapture with a specific levels list only buffers entries matching those levels.
2. startConsoleCapture without a levels parameter continues to capture all log and error entries.
3. New tests in sandbox/tests/consoleCapture.test.js pass and cover filter scenarios.
4. Documentation and README clearly explain how to use log level filtering and include examples.