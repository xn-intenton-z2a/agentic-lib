# Objective
Provide a unified Express-based MCP HTTP server in sandbox/source/server.js to expose core agentic-lib functionality over HTTP. This feature consolidates health checks, mission retrieval, command invocation, runtime statistics, a machine-readable OpenAPI specification, and an interactive Swagger UI into a single implementation.

# Endpoints
## GET /health
- Description: Verify the server is running.
- Response: HTTP 200 with JSON:
  {
    "status": "ok",
    "timestamp": "<ISO 8601>"
  }

## GET /mission
- Description: Return the contents of sandbox/MISSION.md.
- Success: HTTP 200 and JSON { "mission": "<file content>" }.
- Failure: HTTP 404 and JSON { "error": "Mission file not found" }.

## GET /features
- Description: List available commands for invocation.
- Response: HTTP 200 and JSON ["digest", "version", "help"].

## POST /invoke
- Description: Invoke a library command remotely via JSON { "command": string, "args"?: string[] }.
- Validation: command must be "digest", "version", or "help"; otherwise HTTP 400 "Unsupported command".
- Behavior:
  • digest: parse args[0] as JSON or use {}. Create an SQS event with createSQSEventFromDigest(), await digestLambdaHandler(), increment call counter, return HTTP 200 { "result": <handler output> }.
  • version: return HTTP 200 { "version": <pkg.version>, "timestamp": <ISO> } and increment counter.
  • help: call generateUsage(); return HTTP 200 plain text or JSON usage and increment counter.

## GET /stats
- Description: Retrieve real-time server metrics.
- Response: HTTP 200 and JSON:
  {
    "callCount": <number>,
    "uptime": <seconds since start>,
    "memoryUsage": { "rss": <bytes>, "heapTotal": <bytes>, "heapUsed": <bytes>, "external": <bytes> }
  }
- Behavior: read globalThis.callCount, process.uptime(), process.memoryUsage(), log metrics.

## GET /openapi.json
- Description: Download the OpenAPI 3.0 document describing all MCP routes.
- Response: HTTP 200 with JSON OpenAPI object including info.version from package.json and paths for /health, /mission, /features, /invoke, /stats, /openapi.json, /docs.

## GET /docs
- Description: Serve interactive Swagger UI based on the OpenAPI spec.
- Response: HTTP 200 HTML at Content-Type text/html.

# Logging & Startup
- Use logInfo middleware for all requests and logError for handler errors.
- Initialize globalThis.callCount = 0 in src/lib/main.js.
- Export default Express app in sandbox/source/server.js.
- When NODE_ENV !== 'test', listen on process.env.PORT || 3000.

# Testing
- Unit Tests (sandbox/tests/server.unit.test.js): mock file reads, process.uptime, process.memoryUsage; spy on logInfo; verify each endpoint’s status, response shape, and logging.
- Integration Tests (sandbox/tests/server.integration.test.js): start server via createServer(app); end-to-end verify /health, /mission, /features, /invoke (digest, version, help), /stats after multiple invokes, /openapi.json structure, and GET /docs returns HTML.

# Documentation
- Update sandbox/docs/API.md: document all endpoints with request/response examples (cURL and fetch).
- Update sandbox/README.md: add “MCP HTTP API” section summarizing endpoints and usage, include links to API.md and sandbox/MISSION.md.