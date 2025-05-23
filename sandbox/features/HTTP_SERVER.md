# HTTP Server Support

## Overview
Enable the library to stand up an HTTP server for real-time digest ingestion and health checks. This allows agentic workflows or external systems to send events directly over HTTP instead of only via CLI or SQS simulation.

## API Endpoints

### POST /digest
Accepts a JSON payload representing a digest object. Forwards the payload to the existing digestLambdaHandler. Returns 200 and an object listing any failed record identifiers.

### GET /health
Returns basic health information including server status and uptime. Responds with 200 and a JSON object { status: "ok", uptime: <seconds> }.

## Configuration

- PORT (number, default 3000): Port the HTTP server listens on.
- GITHUB_API_BASE_URL, OPENAI_API_KEY: Inherited from existing environment config.

## Logging & Error Handling

Use existing logInfo and logError utilities for request and error logs. Validate incoming JSON body for the /digest endpoint, return 400 if the payload is missing or invalid. All errors must produce JSON responses with an error message and appropriate HTTP status codes.

## Implementation Details

- Modify sandbox/source/main.js (or src/lib/main.js when building sandbox) to import express and start the server when --serve or when environment variable ENABLE_HTTP_SERVER is true.
- On startup, log server listen events and errors.

## Testing & Verification

- Add tests in sandbox/tests/http-server.test.js using supertest to verify:
  - POST /digest with valid payload returns success structure with empty failures.
  - POST /digest with malformed JSON returns 400 and error message.
  - GET /health returns status ok and a numeric uptime.
- Include tests in existing vitest setup and run via npm test.

## Documentation

- Update sandbox/README.md to document HTTP server usage, environment variables, and example curl commands for /digest and /health endpoints.
- Add API reference section detailing request and response schemas.

## Dependencies

- Confirm express is listed in package.json; add supertest to devDependencies for testing if not already present.
