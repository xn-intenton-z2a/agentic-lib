# Digest Payload Validation

# Purpose and Value

Validate incoming SQS digest messages at runtime using a Zod schema to ensure only well-formed payloads are processed. This reduces unexpected exceptions, improves reliability, and provides clear feedback on invalid messages.

# Schema Requirements

Define a Zod schema for the digest payload:
- key: required string
- value: required string
- lastModified: required ISO timestamp string

# Implementation Approach

1. Create a `digestSchema` using Zod in `src/lib/main.js`.
2. In `digestLambdaHandler`, for each record before processing JSON.parse, apply `digestSchema.parse` on the parsed object.
3. On schema validation failure (`ZodError`), log an error with detailed validation issues and the raw message body.
4. Add the record identifier to `batchItemFailures` and continue processing remaining records.

# Success Criteria

- Valid messages are successfully processed and do not appear in `batchItemFailures`.
- Invalid messages trigger an error log containing Zod validation details and raw payload.
- `batchItemFailures` precisely lists identifiers for all invalid records.

# Test Scenarios

- A well-formed digest message passes validation and is processed without errors.
- A message missing required fields logs a detailed validation error and is added to `batchItemFailures`.
- A message with invalid timestamp format logs a validation error and is added to `batchItemFailures`.

# User Scenarios

As a developer, I want only properly structured digest messages to be handled so that my Lambda function remains stable and provides clear diagnostics for malformed inputs.