# HTTP SERVER

## Objective

Extend the library with an HTTP server that exposes a POST /digest endpoint. Incoming JSON payloads are forwarded to the existing digestLambdaHandler. This allows external systems or HTTP clients to push digest messages without requiring AWS SQS or CLI invocation.

## Value Proposition

- Provides a lightweight HTTP API for digest handling alongside the CLI and SQS integrations.
- Simplifies testing and local development by using express instead of mocking SQS events.
- Broadens adoption scenarios by allowing any service that can send HTTP POST requests to interact with agentic-lib.

## Requirements & Design

- Add express as an imported dependency and initialize an express application.
- Read PORT from environment or default to 3000.
- Parse incoming requests as JSON and validate that the body matches a simple object schema (object with any fields).
- On POST /digest, call createSQSEventFromDigest on the received JSON, then await digestLambdaHandler with that event.
- Respond with status 200 and JSON body containing batchItemFailures returned by digestLambdaHandler.
- Log request receipt and response using logInfo and logError.
- Only start the HTTP server when the process is launched with a new CLI flag --http or environment variable RUN_HTTP set to true.

## User Scenarios

- A developer runs `node src/lib/main.js --http`. The server starts on port 3000. A curl POST to /digest with a JSON payload returns batch failures if parsing fails or an empty list on success.
- In CI or local testing, supertest can send valid and invalid payloads to confirm correct status codes and failure payloads.

## Verification & Acceptance Criteria

- Unit tests using supertest cover at least:
  - Successful POST with valid JSON returns 200 and an array in property batchItemFailures.
  - POST with invalid JSON returns a 400 with an error message.
  - Server does not start when --http flag or RUN_HTTP is absent.
- README updated with HTTP server usage, examples, and instructions.
- package.json dependencies updated to include express (already present) and supertest tests referenced in test scripts.