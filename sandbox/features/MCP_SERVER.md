# Objective
Consolidate and fully document the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js, exposing all agentic-lib core functionality via a unified Express API. This feature will incorporate health checks, mission retrieval, available commands, command invocation, real-time statistics, issue management, and a machine-readable OpenAPI specification into a single, cohesive implementation.

# Endpoints

## GET /health
- Description: Verify the server is running.
- Response: HTTP 200 with JSON:
  {
    "status": "ok",
    "timestamp": "<ISO 8601 timestamp>"
  }

## GET /mission
- Description: Return contents of sandbox/MISSION.md.
- Behavior:
  • Read file at process.cwd()/sandbox/MISSION.md via fs/promises.
  • On success: HTTP 200 and JSON { "mission": "<file content>" }.
  • On failure: HTTP 404 and JSON { "error": "Mission file not found" }.

## GET /features
- Description: List available commands for remote invocation.
- Response: HTTP 200 and JSON array: ["digest","version","help"].

## POST /invoke
- Description: Invoke core library commands via JSON body { command: string, args?: string[] }.
- Validation: Reject unsupported commands or invalid body with HTTP 400 and JSON { "error": "<message>" }.
- Behavior:
  • digest: parse args[0] as JSON or default to {}; call createSQSEventFromDigest(), await digestLambdaHandler(); respond HTTP 200 { "result": <handler output> }.
  • version: import version from package.json via ESM assert; respond HTTP 200 { "version": <version>, "timestamp": <ISO> }.
  • help: call generateUsage(); respond HTTP 200 with plain text or JSON usage.
  • After any successful invocation, increment globalThis.callCount.

## GET /stats
- Description: Retrieve real-time runtime metrics.
- Behavior: Read globalThis.callCount, process.uptime(), process.memoryUsage(); log metrics; respond HTTP 200 JSON:
  {
    "callCount": <number>,
    "uptime": <number>,
    "memoryUsage": { "rss": <number>, "heapTotal": <number>, "heapUsed": <number>, "external": <number> }
  }

## GET /issues
- Description: List open GitHub issues via listIssues().
- Response: HTTP 200 and JSON array of issue objects (number, title, body, state, url).

## POST /issues
- Description: Create a new issue via JSON { title: string, body?: string }.
- Validation: title required; invalid or missing yields HTTP 400 and JSON { "error": "Title is required" }.
- Behavior: call createIssue(); on success HTTP 201 with JSON of created issue; on error HTTP 500 with { "error": <message> }.

## GET /openapi.json
- Description: Download machine-readable OpenAPI 3.0 spec for all MCP endpoints.
- Behavior: Dynamically import package.json version; construct spec inline; log via logInfo; respond HTTP 200 with JSON OpenAPI document.

## GET /docs
- Description: Serve interactive Swagger UI via swagger-ui-express.
- Behavior: Mount swaggerUi.serve and swaggerUi.setup(openapiSpec) at /docs; respond HTTP 200 with text/html UI.

# Logging & Startup
- Middleware: logInfo logs each HTTP method and path; logError captures handler errors with optional stack.
- Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
- Export default Express app; listen on process.env.PORT or default 3000 when NODE_ENV ≠ 'test'.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock fs/promises.readFile, createSQSEventFromDigest, digestLambdaHandler, listIssues, createIssue, swaggerUi, process.uptime(), and process.memoryUsage().
- Validate all endpoints including error cases for unsupported commands and validation failures, stats metrics, openapi spec, and docs UI.
- Spy on logInfo and logError to verify logging behavior.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- End-to-end verify: /health, /mission, /features, POST /invoke (digest, version, help, invalid), /stats after multiple invokes, GET /issues, POST /issues (valid/invalid), GET /openapi.json, GET /docs returns HTML.
- Assert status codes, response shapes, and content type for HTML.

# Documentation

## sandbox/docs/API.md
Document every endpoint with request/response examples (cURL and JavaScript fetch), request schemas for POST bodies, and OpenAPI sample.

## sandbox/README.md
Add “MCP HTTP API” section summarizing endpoints, validation behavior, startup instructions (npm start, PORT), and links to API.md, MISSION.md, CONTRIBUTING.md, and LICENSE.
