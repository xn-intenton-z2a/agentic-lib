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
