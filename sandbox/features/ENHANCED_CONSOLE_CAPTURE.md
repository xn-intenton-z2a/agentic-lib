# Objective

Extend the Console Capture API to support customizable log-level filters while preserving existing summary feedback capabilities.  Developers can limit buffered entries to specified levels and still generate summaries and collect feedback.

# Value Proposition

By allowing developers to specify which log levels to capture, they obtain more focused and relevant logs, reducing noise and improving diagnostic workflows.  Combined with summarized output and feedback collection, this yields a comprehensive console inspection tool.

# Scope

- Modify sandbox/source/consoleCapture.js:
  - Change startConsoleCapture to accept an optional parameter filterLevels, an array of level strings (e.g., ['info', 'error']).  When provided, only entries whose level is in filterLevels are buffered.
  - Add export function getFilteredCapturedOutput(filterLevels):  returns an array of buffered entries matching filterLevels without altering the main buffer.
  - Retain existing summarizeCapturedOutput and submitSummaryFeedback functions unchanged.

- Update sandbox/tests/consoleCapture.test.js:
  - Add tests for startConsoleCapture filterLevels behavior, verifying only specified levels are captured.
  - Add tests for getFilteredCapturedOutput with various filter arrays.
  - Ensure existing summary feedback tests continue passing.

- Update sandbox/docs/CONSOLE_CAPTURE.md:
  - Introduce a section Custom Log Level Filters with clear descriptions and examples of filterLevels parameter and getFilteredCapturedOutput usage.

- Update sandbox/README.md:
  - In Core Utilities under Console Capture, describe the new filterLevels option and provide example usage alongside summary feedback.

# Requirements

- Use existing formatLogEntry and logInfo implementations.
- Preserve ESM exports and Node 20 compatibility.
- All tests use Vitest and follow existing mock conventions.
- Do not introduce any new dependencies.

# Success Criteria

1. startConsoleCapture accepts an optional filterLevels array and only buffers entries for those levels when provided.
2. getFilteredCapturedOutput returns correct filtered entries without mutating the buffer.
3. summarizeCapturedOutput and submitSummaryFeedback remain functional and tested.
4. Updated tests cover all filter behaviors and pass without errors.
5. Documentation and README reflect the new filter feature clearly.