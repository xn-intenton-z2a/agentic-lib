# Objective

Implement a new SQS Lambda handler to process user feedback on discussion summaries.

# Value Proposition

Allow automated workflows to collect and surface feedback on generated discussion summaries, enabling continuous improvement and quality tracking in end-to-end autonomous pipelines.

# Scope

- Modify src/lib/main.js to add and export an async function named feedbackLambdaHandler.
  - Accept the same shape of sqsEvent input as digestLambdaHandler.
  - For each record in sqsEvent.Records:
    - Parse JSON from record.body to an object with summaryId (string), feedbackText (string), submittedBy (string).
    - Validate the parsed object against a zod schema: all three properties required and non-empty.
    - On valid payloads, call logInfo with a message indicating receipt of feedback and include summaryId and submittedBy in additionalData.
    - On JSON parse errors or schema validation failures, call logError with details, generate a record identifier (record.messageId or fallback), and add it to batchItemFailures.
  - Return an object with batchItemFailures array and handler identifying feedbackLambdaHandler.

- Add tests in tests/unit/main.feedbackLambdaHandler.test.js:
  - Test a valid feedback message: expect no batch failures and verify logInfo captured the correct structure.
  - Test an invalid JSON payload: expect one batch failure with the correct identifier and that logError was called.

- Update sandbox/README.md:
  - Under the Core Utilities section, insert a new subsection titled Discussion Summary Feedback Handler.
  - Describe the purpose of feedbackLambdaHandler, its input shape, return value, and how to invoke it via an SQS event example.

# Requirements

- Use existing logInfo and logError functions for consistency.
- Leverage the zod dependency already present for payload validation.
- Maintain ESM module exports and Node 20 compatibility.
- Ensure all new tests use Vitest and respect existing mock conventions.

# Success Criteria

1. src/lib/main.js exports feedbackLambdaHandler with the documented behavior.
2. Tests in tests/unit/main.feedbackLambdaHandler.test.js pass without errors.
3. sandbox/README.md includes a clear usage description for the new handler.
4. No new dependencies beyond zod and existing utilities are added.