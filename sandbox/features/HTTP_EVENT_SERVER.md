# HTTP_EVENT_SERVER

# Objective
Provide a lightweight HTTP server to accept incoming JSON event payloads and route them through the existing digestLambdaHandler. Extend server functionality with health checks, configurable CORS, and graceful shutdown to improve developer experience and reliability during local testing.

# API Endpoints

## POST /events
- Accepts a JSON payload in the request body.
- Parses the JSON, constructs an SQS-style event using createSQSEventFromDigest, and invokes digestLambdaHandler.
- Returns HTTP 200 with JSON containing the batchItemFailures response from the handler.
- Returns HTTP 400 if the payload is missing or invalid JSON.
- Returns HTTP 500 on internal server errors and logs the error via logError.

## GET /health
- Returns HTTP 200 with JSON { "status": "ok", "uptime": <seconds> } to verify server liveness and uptime.

# CLI Integration

- Introduce a new `--server [port]` flag in the main CLI invocation:
  - When provided, spin up the Express server on the specified port (default 3000).
  - Preserve existing CLI flags (`--help`, `--version`, `--digest`) without change in behavior.

# Configuration

- Port override via:
  - Environment variable `EVENT_SERVER_PORT`.
  - CLI argument `--server [port]`.
- Enable or disable CORS via environment variable `EVENT_SERVER_CORS` (default disabled).
- Configure graceful shutdown timeout via `EVENT_SERVER_SHUTDOWN_TIMEOUT_MS` (default 5000 ms).

# Success Criteria & Requirements

1. Server starts and listens on the default or custom port when `--server` is used.
2. POST /events routes valid JSON to digestLambdaHandler and returns correct batchItemFailures.
3. GET /health returns server status and uptime.
4. Invalid JSON yields HTTP 400 and error logged.
5. Uncaught errors yield HTTP 500 and error logged.
6. CORS headers applied when enabled.
7. Server gracefully shuts down on SIGINT/SIGTERM within configured timeout.

# Testing & Verification

- Unit tests using supertest against the Express app without opening a real network port.
- Test cases for:
  - Successful event processing.
  - Invalid JSON input.
  - Health check endpoint returning correct status.
  - CORS header presence when enabled.
  - Graceful shutdown behavior via simulated signals.

# Dependencies & Constraints

- Requires `express` and built-in JSON parsing in Express.
- Optionally uses `cors` middleware if CORS is enabled.
- Should not modify existing SQS handler behavior or logging logic.

# README Updates

- Document the new `--server` flag and its options.
- Provide example curl commands for POST /events and GET /health.
- Explain environment variables for port, CORS, and shutdown timeout.
- Include health check usage in development and CI scenarios.

# Verification & Acceptance

- Add supertest-based tests in sandbox/tests/http-server.test.js.
- Ensure `npm test` passes and coverage includes the new endpoints and configuration.
