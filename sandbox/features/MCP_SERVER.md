# Objective
Consolidate and fully implement the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js to expose core agentic-lib functionality via a unified Express API. This includes health checks, mission retrieval, feature listing, command invocation, real-time statistics, and a machine-readable OpenAPI specification.

# Middleware Configuration
- **API Key Authentication**
  • Read `MCP_API_KEY` from environment at startup.
  • Validate `Authorization: Bearer <MCP_API_KEY>` header; on failure respond 401 Unauthorized with `{ error: "Unauthorized" }` and log via `logError`.
- **Rate Limiting**
  • Use `express-rate-limit` globally before routes (default window 15m, max 100 requests/IP; override via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX`).
  • On limit exceeded respond 429 with `{ error: "Too many requests, please try again later." }` and log via `logInfo`.
- **Request Logging**
  • Use `logInfo` middleware to record method, path, and timestamp for every request.

# Endpoints
## GET /health
- **Description**: Check server health.
- **Response**: 200 JSON `{ status: "ok", timestamp: "<ISO 8601>" }`.

## GET /mission
- **Description**: Retrieve sandbox/MISSION.md content.
- **Behavior**: Read file at `process.cwd()/sandbox/MISSION.md` via `fs/promises`.
  • On success: 200 JSON `{ mission: "<file content>" }`.
  • On failure: 404 JSON `{ error: "Mission file not found" }`.

## GET /features
- **Description**: List invocable commands.
- **Response**: 200 JSON array `["digest", "version", "help"]`.

## POST /invoke
- **Description**: Invoke a library command remotely.
- **Request**: JSON `{ command: string, args?: string[] }`.
- **Validation**: `command` must be one of `digest`, `version`, `help`; otherwise 400 JSON `{ error: "Unsupported command" }`.
- **Behavior**:
  • **digest**: parse `args[0]` as JSON or default to `{}`; create SQS event via `createSQSEventFromDigest`, await `digestLambdaHandler(event)`, respond 200 JSON `{ result: <handler output> }`.
  • **version**: import version from `package.json`, respond 200 JSON `{ version: string, timestamp: "<ISO>" }`.
  • **help**: call `generateUsage()`, respond 200 plain text or JSON usage.
- **Post-Processing**: After any successful command invoke, increment `globalThis.callCount`.

## GET /stats
- **Description**: Retrieve runtime metrics for monitoring.
- **Behavior**: read `globalThis.callCount`, `process.uptime()`, and `process.memoryUsage()`.
- **Response**: 200 JSON object `{ callCount: number, uptime: number, memoryUsage: { rss: number, heapTotal: number, heapUsed: number, external: number } }`.
- **Logging**: Log metrics object via `logInfo`.

## GET /openapi.json
- **Description**: Provide an OpenAPI 3.0 document for all MCP endpoints.
- **Behavior**: dynamically import version from `package.json`, build spec inline with `openapi`, `info`, and `paths` for `/health`, `/mission`, `/features`, `/invoke`, `/stats`, `/openapi.json`.
- **Response**: 200 JSON spec; log each request via `logInfo`.

# Logging & Startup
- Export default Express `app` from `sandbox/source/server.js`.
- When `NODE_ENV !== 'test'`, listen on `process.env.PORT || 3000`.

# Testing
- **Unit Tests (`sandbox/tests/server.unit.test.js`)**:
  • Mock filesystem reads, authentication header, rate limiter, `process.uptime()`, `process.memoryUsage()`, and core handlers.
  • Verify status codes, response bodies, JSON schemas, error cases (401, 429, 400, 404), and call counts.
  • Spy on `logInfo` and `logError` for middleware and handlers.

- **Integration Tests (`sandbox/tests/server.integration.test.js`)**:
  • Start server via `createServer(app)` in Vitest hooks.
  • End-to-end verification for all endpoints under valid and invalid conditions (auth missing/invalid, rate-limit exceed, absent mission file, unsupported command).
  • Assert correct HTTP status and JSON shape, and that `callCount` increments across multiple invokes.

# Documentation
- **`sandbox/docs/API.md`**: Document all endpoints with descriptions, request/response examples (cURL and JavaScript fetch), authentication header, and rate limit notes.
- **`sandbox/README.md`**: In “MCP HTTP API” section, summarize middleware requirements (`MCP_API_KEY`, rate-limit overrides), list endpoints, show startup instructions (`npm start`, `PORT`, `MCP_API_KEY`), and link to API.md, MISSION.md, and OpenAPI spec.
