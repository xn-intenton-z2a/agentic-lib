# HTTP Endpoint

Objective & Scope:
Implement a minimal HTTP server in the main library file that exposes a POST /digest endpoint. This endpoint accepts a JSON payload matching the SQS digest body format and forwards it to the existing digestLambdaHandler logic. Provide a configurable port via HTTP_PORT environment variable, defaulting to 3000.

Value Proposition:
Enables external systems to push digest events over HTTP without requiring SQS, simplifies local testing workflows, and supports flexible integration patterns for agentic-lib users.

Success Criteria & Requirements:
- HTTP server must start when main is invoked with --http or when HTTP_MODE environment variable is true.
- Expose POST /digest accepting application/json requests.
- Validate request body is valid JSON; respond with 400 and error message on invalid payload.
- On valid payload, invoke digestLambdaHandler and return the handler response in JSON with status code 200.
- Support configurable port via HTTP_PORT environment variable.
- Graceful shutdown on SIGINT and SIGTERM.

Dependencies & Constraints:
- Use Node.js built-in http module to avoid additional dependencies.
- Limit request body size to 1 megabyte to prevent abuse.
- Adhere to ESM standards and Node 20 compatibility.

User Scenarios & Examples:
Use curl to push a digest directly:
  curl -X POST http://localhost:3000/digest \
       -H "Content-Type: application/json" \
       -d '{"key":"events/1.json","value":"12345","lastModified":"2023-01-01T00:00:00Z"}'

Verification & Acceptance:
- Unit tests cover server startup, route availability, valid and invalid payload handling.
- Simulate POST requests in tests, mocking digestLambdaHandler to verify it is called with parsed body.
- Confirm 200 response and correct JSON shape on success, and 400 with error details on invalid JSON.
- Manual verification: run npm start with HTTP_MODE=true and exercise endpoint as above.