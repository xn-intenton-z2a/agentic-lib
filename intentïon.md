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

## Feature to Issue at 2025-05-21T23:11:20.453Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1558 with title:

Add Express-based HTTP Server with POST /digest Endpoint

And description:

Overview:

Implement an embeddable HTTP server in `src/lib/main.js` that exposes a POST `/digest` endpoint. Incoming JSON payloads should be converted into SQS-style events and passed to the existing `digestLambdaHandler`. This provides a lightweight HTTP API for digest handling alongside the CLI and SQS integrations.

Scope of Changes:

1. src/lib/main.js
   - Import and initialize an Express app.
   - Read `PORT` from environment (default `3000`).
   - Add a new CLI flag `--http` (and respect `RUN_HTTP=true`) to start the server; do not start by default.
   - Register middleware to parse JSON bodies.
   - Define POST `/digest`:
     • Validate request body is a JSON object.
     • Call `createSQSEventFromDigest(body)` and invoke `await digestLambdaHandler(event)`.
     • On success: respond `200` with `{ batchItemFailures }`.
     • On invalid JSON or handler errors: respond `400` with `{ error: string }`.
     • Use `logInfo`/`logError` for request and error logging.

2. sandbox/tests/http-server.test.js
   - Use Supertest to spin up the server via `node src/lib/main.js --http` import or by exporting an `app` instance for testing.
   - Test cases:
     • Server does not start without `--http` (connection refused or similar behavior).
     • Successful POST `/digest` with valid JSON returns `200` and an array `batchItemFailures`.
     • POST `/digest` with invalid JSON returns `400` and an error message.
   - Cleanly start and stop the server in tests.

3. sandbox/README.md
   - Document how to start the HTTP server (`node src/lib/main.js --http` or `RUN_HTTP=true`).
   - Show example `curl` commands for valid and invalid POST `/digest` requests.
   - Describe response format and error handling.

Acceptance Criteria:

- `npm test` passes all existing and new tests.
- Running `node src/lib/main.js --http` starts the server on the configured port.
- A POST to `/digest` with a valid JSON object returns `{ batchItemFailures: [] }`.
- Invalid payloads return `400` with an error description.
- No modifications to files outside of `src/lib/main.js`, `sandbox/tests/http-server.test.js`, and `sandbox/README.md`.  

Please provide updated file contents for all modified files in one LLM invocation.

LLM API Usage:

```json
{"prompt_tokens":6617,"completion_tokens":1173,"total_tokens":7790,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":576,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to enhanced Issue at 2025-05-21T23:12:07.385Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/ with enhanced description:

Overview:
Implement an embeddable HTTP server in `src/lib/main.js` that exposes a POST `/digest` endpoint. Incoming JSON payloads will be transformed into SQS-style events and passed to the existing `digestLambdaHandler`, providing a lightweight HTTP API for digest handling in addition to CLI and SQS integrations.

Requirements & Scope:
1. In `src/lib/main.js`:
   - Import and initialize an Express application.
   - Read server port from environment variable `PORT` (default `3000`).
   - Introduce a new CLI flag `--http` and respect environment variable `RUN_HTTP=true` to start the HTTP server. The server must not start by default.
   - Apply JSON body-parsing middleware and validate that the request body is an object.
   - Define POST `/digest` route:
     • Convert the request body into an SQS event via `createSQSEventFromDigest(body)`.
     • Invoke `await digestLambdaHandler(event)`.
     • On successful handling, respond with HTTP 200 and JSON `{ batchItemFailures: [...] }`.
     • On JSON parsing errors or handler failures, respond with HTTP 400 and JSON `{ error: string }`.
     • Log incoming requests and errors using `logInfo` and `logError`.

2. In `sandbox/tests/http-server.test.js`:
   - Use Supertest to import or spin up the Express `app` (exported for testing) when run with `--http` or `RUN_HTTP=true`.
   - Test scenarios:
     a. No server: running without `--http` and without `RUN_HTTP` must refuse connections on default port.
     b. Startup: running with `--http` or `RUN_HTTP=true` starts server on specified port.
     c. Valid payload: POST `/digest` with a well-formed JSON object returns HTTP 200 with body `{ batchItemFailures: [] }`.
     d. Invalid payload: POST `/digest` with malformed JSON or non-object body returns HTTP 400 with `{ error: <message> }`.
   - Ensure clean startup and shutdown of server between tests.

3. In `sandbox/README.md`:
   - Document how to start the HTTP server (`node src/lib/main.js --http` or `RUN_HTTP=true node ...`).
   - Provide example `curl` commands for valid and invalid POST `/digest` requests.
   - Describe expected JSON response formats for success and error cases.

Acceptance Criteria (Testable):
1. Running `node src/lib/main.js` without `--http` or `RUN_HTTP` does not listen on port 3000 (connection refused).
2. Running `node src/lib/main.js --http` or `RUN_HTTP=true node src/lib/main.js` starts the server on the configured port (default 3000). A health check (e.g., GET `/`) may return 404 or usage instructions.
3. POST `/digest` with a valid JSON object returns HTTP 200 and a JSON body containing a `batchItemFailures` array (empty or with entries on failure).
4. POST `/digest` with invalid JSON returns HTTP 400 and a JSON error message.
5. All new and existing tests (`npm test`) pass, including Supertest coverage for the HTTP server.
6. Logs produced by successful and failed requests use `logInfo` and `logError` appropriately.
7. Documentation in `sandbox/README.md` is updated with clear usage instructions and examples.

No files outside `src/lib/main.js`, `sandbox/tests/http-server.test.js`, and `sandbox/README.md` should be modified.

LLM API Usage:

```json
{"prompt_tokens":7092,"completion_tokens":1465,"total_tokens":8557,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

