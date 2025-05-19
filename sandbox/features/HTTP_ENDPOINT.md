# HTTP Endpoint
# Objectives & Scope
Implement a minimal HTTP server in the main library file that exposes two routes:
- POST /digest: Accept a JSON payload matching the SQS digest body format and forward it to the existing digestLambdaHandler logic.
- GET /health: Provide a health check endpoint that returns service status, uptime, and global callCount.
Provide a configurable port via HTTP_PORT environment variable, defaulting to 3000.
# Value Proposition
Enables external systems to push digest events over HTTP and monitor service health, improving integration and observability for agentic-lib users.
# Success Criteria & Requirements
- HTTP server starts when main is invoked with --http or when HTTP_MODE environment variable is true.
- POST /digest accepts application/json requests, validates the payload, returns 400 on invalid JSON, and returns handler response in JSON with status 200 on success.
- GET /health returns JSON with keys status ("ok"), uptime (seconds since start), and callCount (global invocation count), with status code 200.
- Configurable port via HTTP_PORT environment variable.
- Limit request body size to 1 megabyte.
- Graceful shutdown on SIGINT and SIGTERM, ensuring in-flight requests complete.
# Dependencies & Constraints
- Use Node.js built-in http module to avoid additional dependencies.
- Adhere to ESM standards and Node 20 compatibility.
- No new dependencies beyond existing ones.
# User Scenarios & Examples
Use curl to push a digest:
  curl -X POST http://localhost:3000/digest \
       -H "Content-Type: application/json" \
       -d '{"key":"events/1.json","value":"12345","lastModified":"2023-01-01T00:00:00Z"}'
Use curl to check health:
  curl http://localhost:3000/health
# Verification & Acceptance
- Unit tests cover server startup, route availability, POST /digest payload validation and forwarding, and GET /health response shape.
- Simulate HTTP requests in tests, mocking digestLambdaHandler and process.uptime to verify correct behaviour.
- Manual verification: run npm start with HTTP_MODE=true, exercise both endpoints and confirm correct JSON responses and graceful shutdown.