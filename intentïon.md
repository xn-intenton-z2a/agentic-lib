 as mentioned in reply 
## Maintain Feature at 2025-05-25T00:47:31.095Z

Maintained feature .

Feature spec:



Git diff:

```diff

```

LLM API Usage:

```json

```
---

## Feature to Issue at 2025-05-25T00:48:34.240Z

Generated issue 1597 for feature "http-event-server" with URL https://github.com/xn-intenton-z2a/agentic-lib/issues/1597

title:

Implement HTTP event server with /events endpoint and --server CLI flag

And description:

We need to provide a lightweight HTTP server that wraps the existing `digestLambdaHandler` so users can run and test event-processing workflows locally without AWS infrastructure. This issue will add support for a `--server [port]` CLI flag, set up an Express app with a POST `/events` endpoint, and include unit tests and documentation.

Changes to Apply:

1. **src/lib/main.js**
   - Import `express`.
   - Create and export a `startEventServer(port: number)` function that:
     - Initializes an Express app.
     - Applies `express.json()` middleware.
     - Defines `POST /events`:
       - Parses the JSON body. If invalid or missing, log an error via `logError` and return HTTP 400.
       - Calls `createSQSEventFromDigest(payload)` and then `digestLambdaHandler(sqsEvent)`.
       - On success, return HTTP 200 with `{ batchItemFailures: [...] }`.
       - On handler rejection, log the error via `logError` and return HTTP 500.
   - In `main(args)`, before other flags, detect `--server [port]`:
     - Determine port from the next CLI argument or `EVENT_SERVER_PORT` env var (default 3000).
     - Invoke `startEventServer(port)` and return immediately.
   - Export the Express `app` instance for testing. 

2. **sandbox/tests/http-server.test.js**
   - Add a new test file using `supertest` and `vitest` covering:
     - **Success Path:** Mock `digestLambdaHandler` to resolve `{ batchItemFailures: [] }` and assert HTTP 200 and response body.
     - **Invalid JSON:** Send raw invalid JSON and assert HTTP 400.
     - **Handler Error:** Mock `digestLambdaHandler` to reject, then assert HTTP 500.

3. **sandbox/README.md**
   - Document the new `--server [port]` flag under Usage.
   - Describe the `POST /events` endpoint behavior (request payload, response format, error codes).
   - Provide example `curl` commands for sending events:
     ```bash
     curl -X POST http://localhost:3000/events \
       -H "Content-Type: application/json" \
       -d '{"key":"value"}'
     ```

Verification Steps:

- Run `npm test` to ensure all unit tests (including `http-server.test.js`) pass.
- Start the server locally: `npm start -- --server 3500` (or set `EVENT_SERVER_PORT=3500 npm start`).
- Send valid and invalid POST requests to `/events` and verify correct HTTP status codes and JSON responses.


LLM API Usage:

```json
{"prompt_tokens":7075,"completion_tokens":2250,"total_tokens":9325,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1600,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-25T00:49:20.602Z

Generated issue 1598 for feature "http-event-server" with URL https://github.com/xn-intenton-z2a/agentic-lib/issues/1598

title:

Add health check, CORS support, and graceful shutdown to HTTP event server

And description:

## Overview
Extend the existing HTTP event server implementation in `sandbox/source/main.js` to include:

- **Health Check Endpoint** (`GET /health`): Returns `{ "status": "ok", "uptime": <seconds> }` with HTTP 200.
- **CORS Support**: Enable optional CORS middleware when `EVENT_SERVER_CORS` is set to `true`.
- **Graceful Shutdown**: Cleanly handle `SIGINT`/`SIGTERM` with a configurable shutdown timeout (`EVENT_SERVER_SHUTDOWN_TIMEOUT_MS`, default `5000`).

## Tasks

1. **Modify `sandbox/source/main.js`**
   - Parse `--server [port]` CLI flag or `EVENT_SERVER_PORT` env var (default `3000`).
   - When `--server` is provided, spin up an Express app:
     - `POST /events`:
       - Parse JSON body, use `createSQSEventFromDigest` to build an SQS-style event.
       - Call `digestLambdaHandler(event)` and return `{ batchItemFailures }` with status 200.
       - Return 400 on parse errors (invalid/missing JSON).
       - Return 500 on handler errors, logging via `logError`.
     - `GET /health`: return JSON `{ status: 'ok', uptime: process.uptime() }`.
     - Conditionally apply `cors()` middleware when env var `EVENT_SERVER_CORS=true`.
     - Listen on configured port and log startup info.
     - Handle `SIGINT`/`SIGTERM`: stop accepting new connections, wait up to configured timeout, then exit.

2. **Add Tests in `sandbox/tests/http-server.test.js`**
   - Use `supertest` without opening a real network port (import the Express app instance).
   - Cover:
     - Successful `POST /events` with valid JSON.
     - `POST /events` with invalid JSON yields 400 and logs error.
     - `GET /health` returns status and uptime field.
     - CORS header is present when `EVENT_SERVER_CORS` is enabled.
     - Simulated graceful shutdown: send `SIGINT` to server instance and ensure listener closes within timeout.

3. **Update Documentation in `sandbox/README.md`**
   - Document the `--server [port]` flag and default behavior.
   - Describe `POST /events` and `GET /health` endpoints with example `curl` commands.
   - List environment variables: `EVENT_SERVER_PORT`, `EVENT_SERVER_CORS`, `EVENT_SERVER_SHUTDOWN_TIMEOUT_MS`.
   - Provide guidance on running tests: `npm test` includes the HTTP server tests.

4. **Verify**
   - Run `npm test` and confirm all new tests pass.
   - Start the server with `npm run sandbox -- --server 4000` (or `EVENT_SERVER_PORT=4000 npm run sandbox`) and manually exercise endpoints.


LLM API Usage:

```json
{"prompt_tokens":7271,"completion_tokens":2045,"total_tokens":9316,"prompt_tokens_details":{"cached_tokens":1024,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1344,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

