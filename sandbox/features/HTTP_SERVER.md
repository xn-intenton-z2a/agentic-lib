# HTTP Server

## Objective & Scope
Provide an HTTP interface for health checks, metrics, and digest processing. This feature uses express to expose REST endpoints that mirror AWS Lambda handlers and internal metrics.

## Value Proposition
- Allow local development and integration testing via HTTP.
- Simplify monitoring and health checks.
- Enable system integrations that rely on HTTP protocols.

## Success Criteria & Requirements
- Server starts on user-specified or default port and logs startup.
- GET /health returns HTTP 200 and JSON { status: "ok" }.
- GET /metrics returns JSON with uptime and callCount when stats enabled.
- POST /digest accepts JSON body matching digest schema and invokes digestLambdaHandler, returning 200 on success or appropriate error codes.

## Testability & Stability
- Include automated tests using supertest to verify endpoint responses.
- Validate request bodies with zod schema and return 400 on validation errors.
- Graceful error handling and HTTP error status codes.

## Dependencies & Constraints
- express for HTTP server.
- zod for payload validation.
- Compatible with Node 20 and ESM.

## Verification & Acceptance
- Unit tests for each endpoint.
- Ensure no breaking changes to existing CLI behavior.
