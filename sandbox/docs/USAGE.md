# Agentic‑lib Usage Guide

This document provides an overview of the core CLI and event handling features in agentic‑lib. Recent improvements have been made to the digestLambdaHandler to enhance JSON parsing and error handling through a dedicated helper function.

## Digest Lambda Handler and JSON Parsing

The `digestLambdaHandler` is designed to process SQS events by parsing JSON payloads from incoming messages. In the latest update:

- A new helper function named `parseAndLogDigest` has been extracted from the main SQS event processing loop.
- `parseAndLogDigest` is responsible for parsing the JSON content of each SQS record and logging detailed error messages if the payload is invalid.
- When valid JSON is provided, `parseAndLogDigest` returns an object with `{ success: true, digest }` and logs the received digest.
- If the JSON is invalid, it logs an error with a fallback identifier and returns `{ success: false, recordId }`.
- The `digestLambdaHandler` collects these failures to allow AWS SQS to reprocess the failed messages.

### Example Workflow

When invoking the CLI with the `--digest` flag, the following steps occur:

1. An SQS event is created with a sample digest payload.
2. `digestLambdaHandler` receives the event and iterates over each record.
3. For each record, it calls `parseAndLogDigest`:
   - On success, the payload is processed normally.
   - On failure, the record's identifier is added to the `batchItemFailures` array.
4. The function returns an object containing the list of failed records and handler information.

### Benefits of the Refactor

- **Separation of Concerns:** The parsing logic is isolated, making it easier to maintain and test.
- **Improved Error Handling:** Detailed error logs and fallback identifiers help in tracking and debugging issues with SQS messages.
- **Clearer Code:** The refactored structure adheres to clean code principles, enhancing overall readability and reliability.

For further details, refer to the source code in `src/lib/main.js` and the unit tests in `tests/unit/main.test.js`.
