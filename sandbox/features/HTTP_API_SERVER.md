# Objective
Implement an HTTP API server using Express to allow external clients to submit digest events and retrieve service status in realtime.

# Value Proposition
Provide a consistent HTTP interface for automated workflows and custom integrations. Clients can POST digest payloads directly over HTTP without using CLI or AWS SQS, simplifying local development and external automation scenarios.

# Success Criteria & Requirements
- Add a new --serve CLI flag to start the HTTP server on a configurable port (default 3000).
- Expose POST /digest endpoint that accepts the same JSON payloads as the existing createSQSEventFromDigest function and invokes digestLambdaHandler internally.
- Expose GET /health endpoint returning HTTP 200 with JSON {status: "ok", uptime: <seconds> }.
- Expose GET /version endpoint returning { version: <package version>, timestamp: <current ISO timestamp> }.
- Support graceful shutdown on SIGTERM and SIGINT.

# Dependencies & Constraints
- Use the existing express dependency; add no new libraries beyond supertest for testing.
- Ensure application still functions as CLI when --serve is not supplied.
- Port must be configurable via an optional --port flag or environment variable HTTP_PORT.

# User Scenarios & Examples
1. HTTP integration:
   - Run: node src/lib/main.js --serve --port 4000
   - POST http://localhost:4000/digest with JSON payload to trigger digestLambdaHandler.
   - GET http://localhost:4000/health returns service status.
   - GET http://localhost:4000/version returns version info.

# Verification & Acceptance
- Unit tests for server start/stop logic using supertest.
- Tests for POST /digest ensuring successful handler invocation and 200 response.
- Tests for GET /health and GET /version endpoints return expected JSON and status codes.
- Manual verification: start server, send requests with curl or HTTP client.