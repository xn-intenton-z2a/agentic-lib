# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-24T23:08:48.382Z

Maintained feature HTTP_API.

Feature spec:

# Overview

The HTTP API feature exposes an Express server that allows clients to invoke agentic-lib functions via HTTP, enabling local testing and integration with external services.

# Endpoints

GET /health
Return a 200 OK with JSON containing { status: 'ok' }.

GET /version
Return version and timestamp JSON from package.json.

POST /digest
Accept a JSON body matching the AWS SQS event schema, invoke digestLambdaHandler, and return a JSON response with batchItemFailures and handler.

# Configuration

PORT
Environment variable or CLI flag --port to configure the server port (default: 3000).

--serve-api
CLI flag to start the HTTP server instead of default CLI behavior.

# Usage Examples

To start the server:
    node src/lib/main.js --serve-api --port 3000

Health check:
    curl http://localhost:3000/health

Version:
    curl http://localhost:3000/version

Submit digest event:
    curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{ JSON SQS event }'

# Success Criteria & Requirements

- Express server starts and listens on the configured port.
- Health endpoint returns status ok.
- Version endpoint returns valid version and timestamp.
- digest endpoint invokes digestLambdaHandler and returns expected JSON response.
- Existing logging and error handling behavior is maintained for HTTP requests.

# Testing

- Add supertest based tests to verify each endpoint for success and error scenarios.
- Ensure invalid JSON payloads to /digest return a 400 status with error details.
- Verify that health and version endpoints respond correctly under test conditions.


Git diff:

```diff
diff --git a/sandbox/features/FEATURE.md b/sandbox/features/FEATURE.md
deleted file mode 100644
index 577d98c2..00000000
--- a/sandbox/features/FEATURE.md
+++ /dev/null
@@ -1 +0,0 @@
- as mentioned in reply \n\n// New [sandbox/features/HTTP_API.md]:\n# Overview

The HTTP API feature exposes an Express server that allows clients to invoke agentic-lib functions via HTTP, enabling local testing and integration with external services.

# Endpoints

GET /health
Return a 200 OK with JSON containing { status: 'ok' }.

GET /version
Return version and timestamp JSON from package.json.

POST /digest
Accept a JSON body matching the AWS SQS event schema, invoke digestLambdaHandler, and return a JSON response with batchItemFailures and handler.

# Configuration

PORT
Environment variable or CLI flag --port to configure the server port (default: 3000).

--serve-api
CLI flag to start the HTTP server instead of default CLI behavior.

# Usage Examples

To start the server:
    node src/lib/main.js --serve-api --port 3000

Health check:
    curl http://localhost:3000/health

Version:
    curl http://localhost:3000/version

Submit digest event:
    curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{ JSON SQS event }'

# Success Criteria & Requirements

- Express server starts and listens on the configured port.
- Health endpoint returns status ok.
- Version endpoint returns valid version and timestamp.
- digest endpoint invokes digestLambdaHandler and returns expected JSON response.
- Existing logging and error handling behavior is maintained for HTTP requests.

# Testing

- Add supertest based tests to verify each endpoint for success and error scenarios.
- Ensure invalid JSON payloads to /digest return a 400 status with error details.
- Verify that health and version endpoints respond correctly under test conditions.
```

LLM API Usage:

```json
{"prompt_tokens":6158,"completion_tokens":3866,"total_tokens":10024,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":3456,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

