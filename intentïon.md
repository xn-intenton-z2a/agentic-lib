# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-24T18:34:02.851Z

Maintained feature HTTP_SERVER.

Feature spec:

# HTTP Server Integration

## Purpose
Provide an embedded HTTP API to expose core agentic-lib functionality over HTTP.  This allows workflows, CICD pipelines, or external tools to invoke the digest handler and health checks without using SQS or CLI flags.

## Behavior
- When the CLI is invoked with the `--serve` flag, an Express HTTP server is started.
- The server listens on a port defined by the `HTTP_PORT` environment variable (default 3000).

## HTTP Endpoints
### GET /health
- Returns status code 200 and JSON:
  {
    "status": "ok",
    "uptime": <process uptime in seconds>,
    "version": <package version>
  }

### POST /digest
- Accepts an HTTP JSON payload matching the SQS event format or a single digest object.
- Internally constructs an SQS-like event and passes it to digestLambdaHandler.
- Returns status code 200 with JSON:
  {
    "batchItemFailures": [...]
  }
- If the request body is invalid JSON or missing required fields, responds with status 400 and an error message.

## CLI Integration
- Extend the existing `main` function to detect `--serve` before other flags.
- On `--serve`, spin up the HTTP server and log an info entry that the server is listening.

## Configuration
- `HTTP_PORT`: Port for the HTTP server (default 3000).
- Honor existing VERBOSE_STATS flag: when set, include callCount and uptime in logs and /health output.

## Error Handling
- Any internal errors in request handlers should be logged via `logError` and responded with status 500 and error details.

## Testing & Verification
- Add Supertest-based unit tests under sandbox/tests to verify:
  - Server starts and responds to /health with correct JSON.
  - POST /digest with valid payload returns expected batchItemFailures.
  - POST /digest with invalid JSON returns 400.
- Ensure coverage thresholds are met.
- Update README with API usage examples.


Git diff:

```diff
diff --git a/sandbox/features/FEATURE.md b/sandbox/features/FEATURE.md
deleted file mode 100644
index d74aa0fa..00000000
--- a/sandbox/features/FEATURE.md
+++ /dev/null
@@ -1 +0,0 @@
-Create a console based i-am-thinking-of-a-number game. as mentioned in reply Create a console based i-am-thinking-of-a-number game.\n\n// New [sandbox/features/HTTP_SERVER.md]:\n# HTTP Server Integration

## Purpose
Provide an embedded HTTP API to expose core agentic-lib functionality over HTTP.  This allows workflows, CICD pipelines, or external tools to invoke the digest handler and health checks without using SQS or CLI flags.

## Behavior
- When the CLI is invoked with the `--serve` flag, an Express HTTP server is started.
- The server listens on a port defined by the `HTTP_PORT` environment variable (default 3000).

## HTTP Endpoints
### GET /health
- Returns status code 200 and JSON:
  {
    "status": "ok",
    "uptime": <process uptime in seconds>,
    "version": <package version>
  }

### POST /digest
- Accepts an HTTP JSON payload matching the SQS event format or a single digest object.
- Internally constructs an SQS-like event and passes it to digestLambdaHandler.
- Returns status code 200 with JSON:
  {
    "batchItemFailures": [...]
  }
- If the request body is invalid JSON or missing required fields, responds with status 400 and an error message.

## CLI Integration
- Extend the existing `main` function to detect `--serve` before other flags.
- On `--serve`, spin up the HTTP server and log an info entry that the server is listening.

## Configuration
- `HTTP_PORT`: Port for the HTTP server (default 3000).
- Honor existing VERBOSE_STATS flag: when set, include callCount and uptime in logs and /health output.

## Error Handling
- Any internal errors in request handlers should be logged via `logError` and responded with status 500 and error details.

## Testing & Verification
- Add Supertest-based unit tests under sandbox/tests to verify:
  - Server starts and responds to /health with correct JSON.
  - POST /digest with valid payload returns expected batchItemFailures.
  - POST /digest with invalid JSON returns 400.
- Ensure coverage thresholds are met.
- Update README with API usage examples.
```

LLM API Usage:

```json
{"prompt_tokens":6190,"completion_tokens":1461,"total_tokens":7651,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":960,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-24T18:35:09.927Z

Generated issue  for feature "" with URL https://github.com/xn-intenton-z2a/agentic-lib/issues/

title:



And description:



LLM API Usage:

```json

```
---

