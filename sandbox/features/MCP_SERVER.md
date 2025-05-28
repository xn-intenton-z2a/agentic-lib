# Objective
Consolidate the Model Contact Protocol (MCP) HTTP server into a single Express application providing secure, rate-limited access to core agentic-lib functionality. Clients can perform health checks, retrieve the mission, list commands, invoke library actions, monitor runtime metrics, and download an OpenAPI specification.

# Middleware
- API Key Authentication
  • Read `MCP_API_KEY` from environment at startup
  • Reject requests without header `Authorization: Bearer <MCP_API_KEY>` with HTTP 401 and JSON `{ "error": "Unauthorized" }`
- Rate Limiting
  • Use `express-rate-limit` with a default 15-minute window and max 100 requests per IP
  • Override via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`
  • Reject excess requests with HTTP 429 and JSON `{ "error": "Too many requests, please try again later." }`
- Logging
  • Apply `logInfo` middleware to record each request method and path
  • Use `logError` for error reporting and authentication failures

# Endpoints
## GET /health
- Verify server is running
- Response: HTTP 200 JSON `{ status: "ok", timestamp: "<ISO 8601>" }`

## GET /mission
- Read `sandbox/MISSION.md`
- On success: HTTP 200 JSON `{ mission: "<file content>" }`
- If missing: HTTP 404 JSON `{ error: "Mission file not found" }`

## GET /features
- List available commands for invocation
- Response: HTTP 200 JSON `["digest","version","help"]`

## POST /invoke
- Accept JSON `{ command: string, args?: string[] }`
- Validate command in `["digest","version","help"]`; else HTTP 400 `{ error: "Unsupported command" }`
- Behavior:
  • `digest`: parse args[0] as JSON or use `{}`; create an SQS event via `createSQSEventFromDigest`; await `digestLambdaHandler`; return HTTP 200 JSON `{ result: <handler output> }`
  • `version`: import version from `package.json`; return HTTP 200 JSON `{ version: "<string>", timestamp: "<ISO 8601>" }`
  • `help`: call `generateUsage()`; return HTTP 200 plain text or JSON usage output
- After any successful invocation, increment `globalThis.callCount`

## GET /stats
- Retrieve runtime metrics
- Response: HTTP 200 JSON:
  ```json
  { "callCount": <number>, "uptime": <number>, "memoryUsage": { "rss": <number>, "heapTotal": <number>, "heapUsed": <number>, "external": <number> } }
  ```
- Read from `globalThis.callCount`, `process.uptime()`, and `process.memoryUsage()`, log via `logInfo`

## GET /openapi.json
- Return OpenAPI 3.0 document describing all MCP endpoints
- Dynamically import version from `package.json`
- Build inline spec with `info` and `paths` for `/health`, `/mission`, `/features`, `/invoke`, `/stats`, `/openapi.json`
- Response: HTTP 200 JSON spec and log request with `logInfo`

# Testing
- Unit tests in `sandbox/tests/server.unit.test.js`:
  • Mock authentication header and rate-limiter behavior
  • Stub file reads, uptime, memory usage, and verify all endpoints return expected status and shape
  • Spy on `logInfo` and `logError` for middleware and error scenarios
- Integration tests in `sandbox/tests/server.integration.test.js`:
  • Start server with `createServer(app)` in Vitest hooks
  • Test end-to-end requests to each endpoint under valid and invalid conditions (unauthorized, rate limit, missing mission)

# Documentation & README
- Update `sandbox/docs/API.md`:
  • Document all endpoints with descriptions, request/response examples, authentication header, and rate limit notes
- Update `sandbox/README.md`:
  • Add "MCP HTTP API" section summarizing middleware and endpoints
  • Show startup instructions (`npm start`, `PORT`, `MCP_API_KEY`, rate limit overrides)
  • Include cURL and JavaScript `fetch` examples for each endpoint