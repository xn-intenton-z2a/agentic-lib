 as mentioned in reply 
## Maintain Feature at 2025-05-25T01:16:33.620Z

Maintained feature .

Feature spec:



Git diff:

```diff

```

LLM API Usage:

```json

```
---

## Maintain Feature at 2025-05-25T01:17:18.875Z

Maintained feature HTTP_API_SERVER.

Feature spec:

# HTTP API Server
Provide an Express based HTTP server to receive digest events over HTTP, forward them to digestLambdaHandler for processing

# Routes

- GET /health
  - Returns status code 200 and JSON { status: "OK" }
- POST /digest
  - Expects a JSON body representing a digest object
  - Validates required fields key, value, and lastModified
  - Invokes digestLambdaHandler with a synthetic SQS event
- GET /metrics
  - Returns Prometheus-style metrics for server performance and error counts

# Configuration

- PORT environment variable controls server listen port, default 3000
- API_KEY environment variable for request authentication
- METRICS_ENABLED environment variable to enable or disable /metrics endpoint

# Authentication

- All POST /digest requests must include an X-API-Key header matching API_KEY
- Requests missing or with invalid API key receive 401 Unauthorized

# Metrics

- Track total request count, successful processing count, failure count, and processing durations
- Expose metrics in text format at GET /metrics when METRICS_ENABLED is true

# Graceful Shutdown

- Listen for SIGINT and SIGTERM signals
- On signal, stop accepting new connections
- Wait for in-flight requests to complete with configurable timeout
- Log shutdown progress and exit with status code 0

# Logging and Error Handling

- Log incoming requests and responses with logInfo
- Log authentication failures and processing errors with logError
- Return structured JSON error responses with appropriate HTTP status codes

# Testing and Verification

- Use supertest to cover GET /health, GET /metrics, POST /digest with valid payload, invalid payload, missing or bad API_KEY, and simulated handler errors
- Verify server starts and listens on configured port
- Ensure metrics endpoint returns correct metrics when enabled and returns 404 when disabled
- Run tests under sandbox path using npm test

Git diff:

```diff
diff --git a/sandbox/features/HTTP_API_SERVER.md b/sandbox/features/HTTP_API_SERVER.md
index e63080fc..6a5c2281 100644
--- a/sandbox/features/HTTP_API_SERVER.md
+++ b/sandbox/features/HTTP_API_SERVER.md
@@ -1,19 +1,49 @@
 # HTTP API Server
-Provide an Express based HTTP server to receive digest events over HTTP and forward them to digestLambdaHandler for processing
+Provide an Express based HTTP server to receive digest events over HTTP, forward them to digestLambdaHandler for processing
 
 # Routes
-- GET /health check endpoint returns status code 200 and JSON status OK
-- POST /digest receives a JSON body representing a digest object validates required fields key value and lastModified then invokes digestLambdaHandler with a synthetic SQS event
+
+- GET /health
+  - Returns status code 200 and JSON { status: "OK" }
+- POST /digest
+  - Expects a JSON body representing a digest object
+  - Validates required fields key, value, and lastModified
+  - Invokes digestLambdaHandler with a synthetic SQS event
+- GET /metrics
+  - Returns Prometheus-style metrics for server performance and error counts
 
 # Configuration
-PORT environment variable controls server listen port defaulting to 3000
+
+- PORT environment variable controls server listen port, default 3000
+- API_KEY environment variable for request authentication
+- METRICS_ENABLED environment variable to enable or disable /metrics endpoint
+
+# Authentication
+
+- All POST /digest requests must include an X-API-Key header matching API_KEY
+- Requests missing or with invalid API key receive 401 Unauthorized
+
+# Metrics
+
+- Track total request count, successful processing count, failure count, and processing durations
+- Expose metrics in text format at GET /metrics when METRICS_ENABLED is true
+
+# Graceful Shutdown
+
+- Listen for SIGINT and SIGTERM signals
+- On signal, stop accepting new connections
+- Wait for in-flight requests to complete with configurable timeout
+- Log shutdown progress and exit with status code 0
 
 # Logging and Error Handling
-Incoming requests and responses are logged using logInfo and logError functions
-Invalid JSON payload or processing errors return status code 400 or 500 with structured error response
-Batch item failures from digest processing are returned in POST response
+
+- Log incoming requests and responses with logInfo
+- Log authentication failures and processing errors with logError
+- Return structured JSON error responses with appropriate HTTP status codes
 
 # Testing and Verification
-Add supertest based tests for GET health and POST digest scenarios covering successful processing invalid payload and handler failures
-Verify server starts and listens on configured port
-Ensure tests run under sandbox path tests using npm test
\ No newline at end of file
+
+- Use supertest to cover GET /health, GET /metrics, POST /digest with valid payload, invalid payload, missing or bad API_KEY, and simulated handler errors
+- Verify server starts and listens on configured port
+- Ensure metrics endpoint returns correct metrics when enabled and returns 404 when disabled
+- Run tests under sandbox path using npm test
\ No newline at end of file
```

LLM API Usage:

```json
{"prompt_tokens":6260,"completion_tokens":1662,"total_tokens":7922,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1216,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-25T01:17:40.515Z

Generated issue 1599 for feature "http-api-server" with URL https://github.com/xn-intenton-z2a/agentic-lib/issues/1599

title:

Implement Express HTTP API Server with /health and /digest Endpoints

And description:

## Overview

We need to extend the sandbox source to provide a fully functional HTTP API server using Express. This server will expose two routes:

1. GET `/health` – simple health check returning HTTP 200 with JSON `{ status: "OK" }`.
2. POST `/digest` – accepts a JSON body representing a digest object (must contain `key`, `value`, and `lastModified`).  
   - On valid payload: constructs an SQS event via `createSQSEventFromDigest()`, invokes `digestLambdaHandler`, and returns HTTP 200 with the handler response (`{ batchItemFailures, handler }`).  
   - On missing or invalid fields: returns HTTP 400 with `{ error: "<missing_field> is required" }`.  
   - On handler errors: returns HTTP 500 with `{ error: "<error message>" }`.

All incoming requests and responses should be logged using `logInfo`; errors should be logged via `logError`.

## Tasks

1. **Update `sandbox/source/main.js`:**
   - Import and initialize `express` and `express.json()` middleware.
   - Import `digestLambdaHandler`, `createSQSEventFromDigest`, `logInfo`, and `logError` from `src/lib/main.js`.
   - Define the two routes as specified.
   - Export the Express `app` instance for testing.
   - In the CLI entry point (when executed directly), start listening on `process.env.PORT || 3000` and log startup with `logInfo`.

2. **Revise `sandbox/tests/main.test.js`:**
   - Replace the existing stub test with Supertest-based coverage for:
     - Successful GET `/health` → 200 + `{ status: "OK" }`.
     - Successful POST `/digest` → 200 + valid handler response.
     - POST `/digest` with missing field → 400 + appropriate error JSON.
     - Simulate `digestLambdaHandler` throwing → 500 + error JSON.
   - Use Vitest’s `vi.mock()` to stub behaviors of `digestLambdaHandler` for error scenarios.
   - Import the Express `app` directly from `sandbox/source/main.js`.

3. **Update `sandbox/README.md`:**
   - Add documentation for the new HTTP API server.
   - Include usage examples:
     - Starting the server: `npm run sandbox` or `PORT=4000 npm run sandbox`.
     - Invoking endpoints with `curl` (GET `/health`, POST `/digest`).

## Verification

- Run `npm test` and ensure all sandbox tests pass.
- Manually verify by running `npm run sandbox`, then:
  ```bash
  curl http://localhost:3000/health
  # → { "status": "OK" }

  curl -X POST http://localhost:3000/digest \
       -H 'Content-Type: application/json' \
       -d '{ "key":"foo","value":"bar","lastModified":"2023-01-01T00:00:00Z" }'
  # → { "batchItemFailures":[],"handler":"src/lib/main.digestLambdaHandler" }
  ```

LLM API Usage:

```json
{"prompt_tokens":6774,"completion_tokens":1972,"total_tokens":8746,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1216,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

