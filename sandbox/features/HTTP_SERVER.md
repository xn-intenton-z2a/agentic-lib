# HTTP Server Support

# Objective
Add an express-based HTTP server to expose application endpoints for local testing and integration.

# Scope
- Add a new CLI flag `--start-server` to launch the server.
- Implement endpoints for health check, status, and digest processing.

# Endpoints
- GET /health returns {status: 'ok'}.
- GET /status returns runtime metrics including callCount and uptime.
- POST /digest accepts a JSON payload, creates an SQS event using createSQSEventFromDigest, invokes digestLambdaHandler, and returns batchItemFailures.

# Configuration
Use HTTP_PORT environment variable to set the listen port. Default port is 3000.

# Value Proposition
Enables local and automated testing of digest processing via HTTP. Simplifies integration in CI pipelines and local development workflows.

# Dependencies
Requires express for HTTP server. Leverages existing createSQSEventFromDigest and digestLambdaHandler functions. No additional dependencies needed.

# Verification & Acceptance
- Unit and integration tests cover each endpoint for success and error scenarios.
- Tests verify correct status codes and response bodies.
- Manual testing instructions included in README with curl examples.
