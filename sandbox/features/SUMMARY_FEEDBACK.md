# Objective

Implement a summary feedback workflow for console-captured test output, enabling developers to generate concise summaries of their buffered logs, surface key metrics, and record user or automated feedback on those summaries.

# Value Proposition

By providing a quick, structured summary of console output and a feedback mechanism, developers gain faster insights into test behaviors, spot error trends, and collect targeted feedback for improving test quality and clarity—all without leaving the console capture context.

# Scope

- Modify sandbox/source/consoleCapture.js:
  - Add export function summarizeCapturedOutput():
    - Returns an object with totalEntries, infoCount, errorCount, firstMessages (array of up to 3 message strings).
  - Add export function submitSummaryFeedback(summaryId, feedbackText):
    - Accepts summaryId and feedbackText strings.
    - Calls logInfo with message "Received summary feedback" and additionalData { summaryId, feedbackText }.

- Update sandbox/tests/consoleCapture.test.js:
  - Add tests for summarizeCapturedOutput:
    - Buffer known entries via startConsoleCapture, produce entries, call summarizeCapturedOutput, and verify counts and previews.
  - Add tests for submitSummaryFeedback:
    - Mock logInfo, call submitSummaryFeedback, and assert logInfo receives correct parameters.

- Update sandbox/docs/CONSOLE_CAPTURE.md:
  - Document new APIs summarizeCapturedOutput and submitSummaryFeedback under a new section "Summary Feedback API" with usage examples.

- Update sandbox/README.md:
  - Under Core Utilities, append a subsection "Console Capture Summary Feedback" describing the new functions, their purpose, and basic invocation examples.

# Requirements

- Use existing formatLogEntry and logInfo implementations.
- Maintain ESM module exports and Node 20 compatibility.
- All new tests must use Vitest and follow existing mock conventions.
- No additional dependencies beyond those already present.

# Success Criteria

1. sandbox/source/consoleCapture.js exports summarizeCapturedOutput and submitSummaryFeedback with the documented behavior.
2. Tests in sandbox/tests/consoleCapture.test.js pass without errors for the new summary and feedback functions.
3. sandbox/docs/CONSOLE_CAPTURE.md and sandbox/README.md include clear usage and guidance for the new APIs.
4. No new dependencies are introduced.