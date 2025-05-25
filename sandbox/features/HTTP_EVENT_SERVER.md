# Objective
Provide a lightweight HTTP server to accept incoming JSON event payloads and route them through the existing digestLambdaHandler. This allows users to run and test event processing workflows locally without AWS infrastructure.

# API Endpoints

## POST /events
- Accepts a JSON payload in the request body.
- Parses the JSON and constructs an SQS-style event using createSQSEventFromDigest.
- Invokes digestLambdaHandler and returns its batchItemFailures response.
- Returns HTTP 200 with JSON:
  {
    "batchItemFailures": [ ... ]
  }
- Returns HTTP 400 if the payload is missing or invalid JSON.

# CLI Integration

- New flag `--server [port]` in the main CLI invocation:
  - If supplied, spin up the Express server on the specified port (default 3000).
  - Other flags (`--help`, `--version`, `--digest`) remain unaffected.

# Configuration

- Port can be overridden via environment variable `EVENT_SERVER_PORT` or the `--server` CLI argument.
- CORS disabled by default; details can be extended in future iterations.

# Success Criteria & Requirements

1. Server starts and listens on port 3000 by default or custom port when provided.
2. POST requests to `/events` with valid JSON call digestLambdaHandler and return correct structure.
3. Invalid JSON or missing body yields HTTP 400 and error log.
4. Server errors produce HTTP 500 and logError is invoked.

# Testing & Verification

- Unit tests send mock HTTP requests against the Express app without listening on a real port using supertest.
- Tests cover successful event processing, invalid JSON input, and error handling scenarios.

# Dependencies & Constraints

- Requires `express` and `body-parser` or built-in JSON parsing in Express.
- Should not alter existing SQS handler behavior or logging logic.

# README Updates

- Document the new `--server` flag and HTTP endpoints under Usage.
- Provide example curl commands for POST /events.

# Verification & Acceptance

- Add supertest-based tests in sandbox/tests/http-server.test.js.
- Ensure `npm test` passes and coverage is added for the new server code.
