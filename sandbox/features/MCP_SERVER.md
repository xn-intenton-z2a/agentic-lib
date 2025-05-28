# Objective
Extend the existing MCP HTTP server in sandbox/source/server.js to provide a machine-readable OpenAPI 3.0 specification and an interactive documentation UI, consolidating all Express middleware and routes under one unified feature.

# Endpoints

## GET /openapi.json
- Description: Download the OpenAPI 3.0 document describing all MCP endpoints.
- Response: HTTP 200 with JSON body containing `openapi`, `info` (populated from package.json), and `paths` definitions for `/health`, `/mission`, `/features`, `/invoke`, `/stats`, and `/openapi.json`.
- Behavior:
  • Dynamically import `version` from package.json via ESM JSON assert.
  • Construct the OpenAPI document inline without external file reads.
  • Log each request with `logInfo`.

## GET /docs
- Description: Serve an interactive Swagger UI for the MCP HTTP API.
- Behavior:
  • Import and mount `swagger-ui-express` middleware.
  • Use the OpenAPI document from `/openapi.json` as the UI specification.
  • Serve UI on `/docs` endpoint, returning HTML with `Content-Type: text/html`.
  • Ensure `/docs` is mounted before other routes and does not disrupt existing functionality.

# Implementation Details
- Add dependency: `swagger-ui-express`.
- In `sandbox/source/server.js`:
  1. Import `swaggerUi` from `swagger-ui-express` and the inline OpenAPI spec generator.
  2. Define a route for `/openapi.json` that returns the spec and logs via `logInfo`.
  3. Mount `swaggerUi.serve` and `swaggerUi.setup(openapiSpec)` on `/docs` before other handlers.
  4. No changes to non-UI endpoints; preserve existing order and middleware.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock the OpenAPI spec builder to return a known object.
- Mock `swaggerUi.serve` and `swaggerUi.setup`.
- Test GET `/openapi.json`: expect HTTP 200, JSON body with correct `openapi` and `info.version`.
- Test GET `/docs`: expect HTTP 200, `Content-Type: text/html`, and response text containing `SwaggerUIBundle`.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server using `createServer(app)`.
- Perform GET `/openapi.json` and validate top-level keys and status 200.
- Perform GET `/docs` and verify status 200 and HTML contains `SwaggerUIBundle`.
- Ensure `/docs` does not break other endpoints.

# Documentation

- **sandbox/docs/API.md**: Add a section for `/openapi.json` with request and response examples, and a section for `/docs` with a browser URL example.
- **sandbox/README.md**: In the "MCP HTTP API" section, add bullets:
  - `/openapi.json` – returns the API specification in OpenAPI format.
  - `/docs` – serves an interactive Swagger UI (visit in browser at `/docs`).