# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
2025-05-21T23:10:07Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-21T23-09Z

## Maintain Feature at 2025-05-21T23:10:20.195Z

Maintained feature HTTP_SERVER.

Feature spec:

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

Git diff:

```diff
\n\n// New [sandbox/features/HTTP_SERVER.md]:\n# HTTP SERVER

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
```

LLM API Usage:

```json
{"prompt_tokens":5926,"completion_tokens":1133,"total_tokens":7059,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

