# HTTP API Service

## Objective & Scope
Provide an HTTP API for submitting digest events and health checks. Implement a new CLI flag `--serve` in the core application to spin up an Express server that listens for HTTP requests. Clients can POST digest payloads to `/digest` and verify service availability via `/health`. This service will run in the same process as CLI and reuse existing digest handler logic.

## Value Proposition
- Enables remote systems to push data for processing without requiring SQS or AWS infrastructure.
- Simplifies integration and testing by providing a local HTTP endpoint.
- Extends the core CLI tool into a lightweight HTTP service for rapid prototyping and integration.

## Requirements & Dependencies
- Extend `src/lib/main.js` to import and configure Express.
- Add a new CLI flag `--serve` processed in `main` to start the HTTP server.
- Default port should be configurable via environment variable `HTTP_API_PORT`, defaulting to 3000.
- Add health check endpoint `/health` that returns status JSON `{"status":"ok"}`.
- Add digest endpoint `/digest` expecting JSON body representing a digest, forwarding it to `digestLambdaHandler` and returning its response.
- Ensure graceful shutdown on SIGINT or SIGTERM.

## Success Criteria & Verification
- When running `node src/lib/main.js --serve`, Express server starts and listens on configured port.
- GET `/health` returns HTTP 200 and `{"status":"ok"}`.
- POST `/digest` with a valid JSON payload returns HTTP 200 and a JSON body containing `batchItemFailures` and `handler` fields.
- Invalid JSON bodies return HTTP 400 with an error message.
- Integration tests cover both endpoints using Supertest.

## User Scenarios
- Developer runs `npm run start -- --serve` to start the service and uses `curl http://localhost:3000/health` to verify availability.
- CI pipeline stage can use the API to submit a test digest and verify successful forwarding to the handler.

## Testing & Delivery
- Add new unit tests in `tests/unit/http-api.test.js` using Supertest to cover `/health` and `/digest` endpoints.
- Update sandbox README to document `--serve` usage, API endpoints, and environment variable configuration.
- Ensure existing tests and coverage remain green.
