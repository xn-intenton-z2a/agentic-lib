# Objective & Scope
Implement an HTTP server in the main CLI library to expose event processing handlers via REST endpoints for digesting events, retrieving stats, agentic actions, and health checks. This API will reuse existing logic (digestLambdaHandler and agenticHandler) and structured logging utilities.

# Value Proposition
- Enables low-latency, HTTP-based integration for webhooks and external services.
- Provides consistent structured JSON logging across REST and existing flows.
- Simplifies deployment by bundling HTTP handling into the existing CLI library with no additional frameworks.

# Success Criteria & Requirements
## HTTP Server Setup
- Use Node.js built-in http module to listen on port from HTTP_PORT or default 3000.
- Increment globalThis.callCount for each request before routing.
- Gracefully handle and log server errors via logError.

## Endpoints & Behavior
### POST /digest
- Validate JSON body with zod schema: key (string), value (string), lastModified (ISO 8601 string).
- Invoke digestLambdaHandler with constructed SQS event.
- Return 200 with JSON: { batchItemFailures, handler }.
- Return 400 for body validation errors and 500 for handler exceptions.

### POST /stats
- No request body required.
- Respond 200 with JSON: { callCount, uptime }.

### POST /agentic
- Validate JSON body with zod schema: issueUrl (string) or id (string or number).
- Invoke agenticHandler with payload.
- Return 200 with suggestion JSON or 400/500 on errors.

### GET /health
- Respond 200 with JSON: { service: name, uptime, callCount }.

# Testability & Stability
- Add integration tests using supertest to cover success and error cases for each endpoint.
- Mock HTTP requests in unit tests to verify routing logic and handler invocation.
- Ensure 200, 400, and 500 status codes are correctly returned.

# Dependencies & Constraints
- Only use built-in http module and zod for validation.
- Maintain Node 20 ESM compatibility.
- No additional external HTTP frameworks.

# User Scenarios & Examples
- Webhook sender posts digest events to /digest for real-time processing.
- Monitoring system polls /stats and /health for uptime and usage metrics.
- CI workflow triggers agentic suggestions via /agentic endpoint.

# Verification & Acceptance
- Manual test: start server locally, exercise each endpoint with curl or HTTP client.
- Automated tests pass with coverage > 90% for new code paths.
- Review logs to confirm structured JSON output and error handling.