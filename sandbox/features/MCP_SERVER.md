# Objective
Implement a unified Express-based HTTP server in sandbox/source/server.js that exposes core agentic-lib functionality over HTTP, enabling remote clients to interact with workflows, retrieve metadata, and monitor service health.

# Endpoints

## GET /health
Verify server availability. Respond with HTTP 200 and JSON:
{
  "status": "ok",
  "timestamp": "<ISO 8601>"
}

## GET /mission
Return the contents of sandbox/MISSION.md. On success, HTTP 200 and JSON { "mission": "<file content>" }; if file is missing, HTTP 404 and JSON { "error": "Mission file not found" }.

## GET /features
List supported commands. Respond HTTP 200 with JSON array ["digest","version","help"].

## POST /invoke
Accept JSON body { command: string, args?: string[] }. Validate that command is one of digest, version, help; otherwise respond HTTP 400 and JSON { "error": "Unsupported command" }.

• digest: parse args[0] as JSON or use {}. Create SQS event via createSQSEventFromDigest(), call digestLambdaHandler(), respond HTTP 200 with JSON { "result": <handler output> } and increment globalThis.callCount.
• version: read version from package.json via ESM import, respond HTTP 200 with JSON { "version": <string>, "timestamp": <ISO 8601> } and increment callCount.
• help: call generateUsage(), respond HTTP 200 with usage text or JSON and increment callCount.

## GET /stats
Expose runtime metrics: total successful /invoke calls, process.uptime(), and process.memoryUsage(). Respond HTTP 200 with JSON { callCount, uptime, memoryUsage: { rss, heapTotal, heapUsed, external } }.

## GET /openapi.json
Serve an inline OpenAPI 3.0 spec describing all endpoints. Respond HTTP 200 with JSON spec and log each request via logInfo.

## GET /docs
Mount swagger-ui-express to serve an interactive API documentation UI at /docs with Content-Type text/html.

# Implementation
- Use express in sandbox/source/server.js with JSON parsing.
- Apply cors() for cross-origin support using CORS_ORIGIN env var.
- Apply API key authentication middleware: require x-api-key for protected routes, loading valid keys from API_KEYS env.
- Use Zod schemas to validate POST /invoke and POST /issues payloads, rejecting invalid bodies with HTTP 400 and detailed error.
- Export default Express app and listen on process.env.PORT or 3000 when NODE_ENV is not test.

# Testing
- Unit tests (sandbox/tests/server.unit.test.js): mock fs/promises.readFile, process.uptime(), process.memoryUsage(), swaggerUi, authentication, and Zod validation. Verify each endpoint’s status, JSON shape, error cases, and that logInfo/logError are called appropriately.
- Integration tests (sandbox/tests/server.integration.test.js): start server via createServer(app), perform end-to-end requests for all endpoints (valid and invalid cases) and assert HTTP status, response content, and side effects (e.g., callCount increments).

# Documentation
- Update sandbox/docs/API.md with detailed reference for each endpoint, including request and response examples (cURL and JavaScript fetch).
- Update sandbox/README.md to include an “MCP HTTP API” section summarizing server startup, environment variables (PORT, API_KEYS, CORS_ORIGIN), and links to API.md, MISSION.md, CONTRIBUTING.md, and LICENSE-MIT.