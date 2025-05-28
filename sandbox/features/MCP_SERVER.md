# Objective
Consolidate and extend the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js to expose core agentic-lib functionality via a unified Express API. This feature now includes health checks, mission retrieval, command invocation, real-time statistics, machine-readable OpenAPI specification, and an interactive Swagger UI.

# Endpoints

## GET /health
- Verify service health.
- Response: HTTP 200 JSON { status: "ok", timestamp: "<ISO 8601>" }.

## GET /mission
- Return contents of sandbox/MISSION.md.
- Success: HTTP 200 JSON { mission: "<file content>" }.
- Failure: HTTP 404 JSON { error: "Mission file not found" }.

## GET /features
- List supported commands.
- Response: HTTP 200 JSON ["digest","version","help"].

## POST /invoke
- Invoke commands: digest, version, help via JSON { command, args? }.
- Validation: unsupported commands return HTTP 400 JSON { error: "Unsupported command" }.
- digest: parse args, create SQS event, await digestLambdaHandler, return HTTP 200 JSON { result }.
- version: read version from package.json, return HTTP 200 JSON { version, timestamp }.
- help: return usage from generateUsage() as plain text or JSON.
- After a successful invocation, increment globalThis.callCount.

## GET /stats
- Retrieve runtime metrics.
- Response: HTTP 200 JSON {
  callCount: <number>,
  uptime: <seconds since start>,
  memoryUsage: { rss, heapTotal, heapUsed, external }
}.
- Behavior: read globalThis.callCount, process.uptime(), process.memoryUsage(), logInfo metrics.

## GET /openapi.json
- Return OpenAPI 3.0 specification for all MCP endpoints.
- Response: HTTP 200 JSON with fields openapi, info, paths for /health, /mission, /features, /invoke, /stats, /openapi.json, /docs.
- Version sourced dynamically from package.json.

## GET /docs
- Serve interactive Swagger UI at /docs using swagger-ui-express.
- Response: HTTP 200 HTML with Swagger interface.

# Logging & Startup
- Use logInfo middleware to record every request method and path.
- Use logError for handler errors including stack when verbose.
- Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
- Export default Express app; listen on process.env.PORT or 3000 when NODE_ENV is not "test".

# Testing
- **Unit Tests** (sandbox/tests/server.unit.test.js):
  • Mock fs/promises.readFile for /mission.
  • Mock and spy on globalThis.callCount, process.uptime, process.memoryUsage, swaggerUi.
  • Assert each endpoint’s status, response shape, and that logInfo and logError are called appropriately.

- **Integration Tests** (sandbox/tests/server.integration.test.js):
  • Start server via createServer(app).  
  • Verify end-to-end behavior for all endpoints: /health, /mission, /features, POST /invoke (digest, version, help), /stats after multiple invokes, GET /openapi.json, and GET /docs returns HTML.

# Documentation
- Update sandbox/docs/API.md to document all endpoints with request and response examples (cURL and fetch).
- Update sandbox/README.md under "MCP HTTP API" to include sections for Statistics (/stats) and Documentation UI (/docs), and link to API.md and MISSION.md.
