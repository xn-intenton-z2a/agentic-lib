# HTTP API Server

## Objective & Scope
Define an HTTP API server using Express in src/lib/main.js to expose digest processing and health check endpoints without relying on AWS SQS.

## Value Proposition & Benefits
Provide a RESTful interface for external systems to trigger digest processing directly over HTTP, simplify integration, and offer a lightweight health monitoring endpoint.

## Requirements & Success Criteria
- Add Express dependency and initialize an HTTP server in src/lib/main.js.
- Expose GET /health that returns HTTP 200 and JSON { status: "ok", uptime: process.uptime() }.
- Expose POST /digest that accepts a JSON body, invokes digestLambdaHandler with the payload wrapped as an SQS event, and returns { batchItemFailures } as JSON.
- Ensure server port is configurable via DIGEST_SERVER_PORT environment variable, defaulting to 3000.
- Add accompanying Vitest tests using Supertest to cover both endpoints and edge cases.
- Update README.md with API documentation and usage examples.

## User Scenarios & Examples
1. A monitoring system calls GET /health to confirm the server is operational and retrieves uptime statistics.
2. A client system sends a POST /digest request with a JSON payload representing a digest event and receives processing results.

## Verification & Acceptance Criteria
- All new HTTP routes are covered by automated tests in tests/unit/ using Supertest.
- Manual verification via curl:
  curl http://localhost:3000/health
  curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{"key":"events/1.json","value":"12345","lastModified":"..."}'
- README.md updated with endpoint descriptions, example curl commands, and environment variable configuration.

## Dependencies & Constraints
- Leverage existing express dependency.
- Include Supertest in devDependencies if not already present.
- Maintain ESM compatibility and Node 20 support.
