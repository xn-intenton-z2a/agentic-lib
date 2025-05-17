# Objective & Scope
Implement an HTTP server in the main CLI library to expose event processing handlers via REST endpoints, complementing existing AWS Lambda and CLI flows.

# Value Proposition
- Provide a single, self-contained HTTP API for event-driven and agentic workflows, simplifying integration into webhooks and applications.
- Ensure consistent structured JSON logging for all endpoints using existing logInfo and logError utilities.
- Maintain reuse of digestLambdaHandler and agenticHandler logic for easy maintenance and observability.

# Success Criteria & Requirements
## HTTP Server Setup
- Listen on port from environment variable HTTP_PORT or default to 3000.
- Increment globalThis.callCount for each incoming request before routing.
- Gracefully handle server errors and log using logError.

## Routing & Endpoints
- POST /digest
  - Validate JSON body schema: must include key, value, lastModified fields.
  - Invoke digestLambdaHandler with created event payload.
  - Respond with 200 and JSON containing batchItemFailures and handler metadata.
- POST /stats
  - No request body required.
  - Compute and return JSON with current callCount and uptime (seconds).
- POST /agentic
  - Validate JSON body schema: must include issueUrl or id.
  - Invoke agenticHandler with payload.
  - Return 200 and JSON with suggestion details or appropriate error code.
- GET /health
  - Respond with service name, current uptime, and total callCount.

# Testability & Stability
- Add supertest-based integration tests for each endpoint, covering success responses and error conditions (invalid JSON, missing fields).
- Ensure unit tests mock express-like request objects or HTTP server to verify routing and handler invocation.
- Validate that all endpoints return correct HTTP status codes: 200, 400 for bad request, 500 for server error.

# Dependencies & Constraints
- Use Node.js built-in http module; no new external HTTP frameworks.
- Use zod for input validation of request bodies.
- Configure server port via environment variable HTTP_PORT.
- Maintain Node 20 ESM compatibility.
