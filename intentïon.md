# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
2025-05-20T00:51:44Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-20T00-51Z

## Maintain Feature at 2025-05-20T00:52:34.136Z

Maintained feature HTTP_ENDPOINT.

Git diff:

```
diff --git a/sandbox/features/FEATURE.md b/sandbox/features/FEATURE.md
deleted file mode 100644
index 218b352f..00000000
--- a/sandbox/features/FEATURE.md
+++ /dev/null
@@ -1 +0,0 @@
-Create a tty based guess a number game.
diff --git a/sandbox/features/HTTP_ENDPOINT.md b/sandbox/features/HTTP_ENDPOINT.md
new file mode 100644
index 00000000..d2ceefe3
--- /dev/null
+++ b/sandbox/features/HTTP_ENDPOINT.md
@@ -0,0 +1,31 @@
+# HTTP Endpoint Feature
+
+# Description
+Provide an integrated HTTP server that exposes the existing digestLambdaHandler as a RESTful endpoint. Users can send POST requests to trigger the same processing logic used in the CLI and AWS Lambda contexts.
+
+# Value Proposition
+Deliver a direct HTTP API to invoke digest logic without requiring AWS infrastructure or CLI commands. Simplifies local development, testing, and integration with external services.
+
+# Success Criteria & Requirements
+- Launch an HTTP server when invoked with the --serve flag.
+- Default to port 3000 or honor the PORT environment variable.
+- Accept POST requests at the /digest endpoint with a JSON body matching the SQS event schema.
+- Return HTTP 200 with a JSON body listing any batchItemFailures.
+- Graceful shutdown on SIGINT or SIGTERM.
+
+# API Specification
+Endpoint: POST /digest
+Request Body: JSON object with either Records array or single event record. Matches SQS event format.
+Response:
+  status: 200
+  body: { batchItemFailures: Array }
+
+# CLI Integration
+Extend main() to process a new --serve flag:
+  node src/lib/main.js --serve [--port <number>]
+When --serve is present, start HTTP server instead of running CLI commands.
+
+# Verification & Acceptance
+- Unit tests simulate POST /digest requests and validate JSON responses.
+- Tests cover valid and invalid JSON payloads and error handling.
+- Manual test using curl or HTTP client to verify behavior.
```

LLM API Usage:

```json
{"prompt_tokens":6126,"completion_tokens":1442,"total_tokens":7568,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1088,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-20T00:53:41.512Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1540 with title:

Implement HTTP Server (--serve) Mode Using Express for /digest Endpoint

And description:

Objective
--------
Enhance the CLI in src/lib/main.js to support an HTTP server mode (triggered by a new --serve flag) that exposes the existing digestLambdaHandler as a RESTful POST /digest endpoint. Update tests, README, and package.json to reflect and verify this new capability.

Scope of Changes
----------------
1. package.json
   • Add "express" as a runtime dependency (e.g., "express": "^4.18.2").
   • Add "supertest" as a devDependency (e.g., "supertest": "^6.3.3").

2. src/lib/main.js
   • Import Express and initialize an app.
   • Implement a processServe(args) function that:
     - Detects --serve flag.
     - Reads PORT from env or defaults to 3000.
     - Defines POST /digest to accept JSON payloads:
       * If body.Records is an array, pass it directly to digestLambdaHandler.
       * Otherwise, wrap the JSON body as a single record object.
     - Sends HTTP 200 with { batchItemFailures } returned by digestLambdaHandler.
   • In main(), check for the --serve flag before existing CLI flags, call processServe and return.
   • Add graceful shutdown handling on SIGINT/SIGTERM to close the HTTP server.

3. tests/unit/main.test.js
   • Import supertest and the main Express app (via the new processServe export).
   • Write test cases for:
     - Successful POST /digest with valid SQS-style JSON -> expect HTTP 200 and correct batchItemFailures array.
     - POST /digest with invalid JSON payload -> expect HTTP 200 and batchItemFailures containing a fallback identifier.
     - Custom PORT via environment variable.

4. README (sandbox/README.md)
   • Add a new "HTTP Server Mode" section:
     - Describe how to start: \`node src/lib/main.js --serve [--port <number>]\`.
     - Provide curl examples for POST /digest with a sample payload.
     - Document response format.

Verification & Acceptance
-------------------------
• Running `npm test` should cover all new HTTP endpoint tests and pass.
• Manually starting with `npm start -- --serve` or `node src/lib/main.js --serve --port 4000` and curling POST requests should return expected JSON.
• README examples must work out-of-the-box when copy-pasted.

Implementation Notes
--------------------
- Avoid adding new files: update only package.json, src/lib/main.js, tests/unit/main.test.js, and sandbox/README.md.
- Use Express's built-in JSON body parser (no extra body-parser package).
- Ensure the server shuts down cleanly on process signals to prevent hanging in test suites.

LLM API Usage:

```json
{"prompt_tokens":6676,"completion_tokens":1675,"total_tokens":8351,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to enhanced Issue at 2025-05-20T00:54:21.777Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/ with enhanced description:

Title: HTTP Server Mode (--serve) for /digest Endpoint

Objective:
--------
Enable the CLI in src/lib/main.js to start an Express-based HTTP server when invoked with a new --serve flag, exposing the existing digestLambdaHandler at POST /digest.

Scope of Changes:
------------------
1. package.json
   • Add "express" as a runtime dependency (e.g., "express": "^4.18.2").
   • Add "supertest" as a devDependency (e.g., "supertest": "^6.3.3").

2. src/lib/main.js
   • Import Express and implement a processServe(args) function:
     - Detect --serve flag before other CLI flags.
     - Read PORT from environment or default to 3000.
     - Configure POST /digest:
       * If body.Records is an array, pass it directly to digestLambdaHandler.
       * Otherwise wrap the request body as a single record.
       * Return HTTP 200 with JSON { batchItemFailures }.
     - Support JSON parsing via express.json().
     - Implement graceful shutdown on SIGINT and SIGTERM to close the server.
   • Export processServe (for testing) and invoke it in main() when --serve is present.

3. tests/unit/main.test.js
   • Use supertest against the exported Express app:
     - POST /digest with valid SQS-style JSON -> expect 200 and correct batchItemFailures: [].
     - POST /digest with invalid JSON payload -> expect 200 and batchItemFailures contains a fallback identifier.
     - Custom PORT via environment variable -> server listens on the configured port.
     - Ensure server shuts down cleanly after tests to prevent hanging.

4. sandbox/README.md
   • Add "HTTP Server Mode" section:
     - Usage: `node src/lib/main.js --serve [--port <number>]`.
     - curl examples:
         curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{"Records":[{"body":"{ \"key\": \"value\" }"}]}'
     - Document response format: `{ "batchItemFailures": [] }` or fallback identifiers.

Acceptance Criteria:
--------------------
- Automated tests pass (`npm test` covers HTTP endpoint tests and existing tests).  
- The CLI `--serve` flag starts an HTTP server on port 3000 or the value of the PORT environment variable.  
- POST /digest with a valid SQS event payload returns HTTP 200 and an empty batchItemFailures array.  
- POST /digest with malformed JSON returns HTTP 200 and batchItemFailures contains a generated fallback identifier.  
- Graceful shutdown: sending SIGINT or SIGTERM closes the server within 5 seconds without hanging.  
- sandbox/README.md examples work out-of-the-box when copy-pasted.

Implementation Notes:
---------------------
- Use Express’s built-in express.json() middleware.  
- Do not add new source or test files; update only package.json, src/lib/main.js, tests/unit/main.test.js, and sandbox/README.md.

LLM API Usage:

```json
{"prompt_tokens":7198,"completion_tokens":1257,"total_tokens":8455,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":512,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

