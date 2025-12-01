# Objective
Provide a unified, secure Express-based HTTP server in sandbox/source/server.js that implements the Model Contact Protocol (MCP) and exposes the core agentic-lib functionality over HTTP.  This feature covers health checks, mission retrieval, feature discovery, secure command invocation, real-time statistics, issue management, CORS support, request validation, a machine-readable OpenAPI specification, an interactive Swagger UI, and API-key authentication.

# Endpoints

## GET /health
- Verify server health.
- Response: HTTP 200 with JSON
  ```json
  { "status": "ok", "timestamp": "<ISO 8601>" }
  ```

## GET /mission
- Return contents of sandbox/MISSION.md.
- Success: HTTP 200 and JSON `{ "mission": "<file content>" }`.
- Failure: HTTP 404 and JSON `{ "error": "Mission file not found" }`.

## GET /features
- List available commands for invocation.
- Response: HTTP 200 with JSON array `["digest","version","help"]`.

## POST /invoke
- Accept JSON body `{ command: string, args?: string[] }`.
- Validate payload against a Zod schema; on failure respond HTTP 400 `{ "error": "<message>" }`.
- Supported commands:
  - **digest**: parse `args[0]` as JSON or default to `{}`, create an SQS event via `createSQSEventFromDigest()`, await `digestLambdaHandler()`, increment the invocation counter, and respond HTTP 200 `{ "result": <handler output> }`.
  - **version**: read version from package.json, increment the counter, and respond HTTP 200 `{ "version": <string>, "timestamp": <ISO> }`.
  - **help**: call `generateUsage()`, increment the counter, and respond HTTP 200 with usage text or JSON.
- Unsupported commands respond HTTP 400 `{ "error": "Unsupported command" }`.

## GET /stats
- Return real-time server metrics for monitoring.
- Behavior:
  • Read `globalThis.callCount` (total successful `/invoke` calls).  
  • Compute uptime via `process.uptime()`.  
  • Gather memory usage via `process.memoryUsage()`.  
  • Log the metrics with `logInfo`.
- Response: HTTP 200 with JSON:
  ```json
  {
    "callCount": <number>,
    "uptime": <number>,
    "memoryUsage": {
      "rss": <number>,
      "heapTotal": <number>,
      "heapUsed": <number>,
      "external": <number>
    }
  }
  ```

## GET /issues
- List repository issues via `listIssues()` from core library.
- Success: HTTP 200 and JSON array of issue objects `{ number, title, body, state, url }`.
- Error: HTTP 500 and JSON `{ "error": "<message>" }`.

## POST /issues
- Accept JSON body `{ title: string, body?: string }`.
- Validate title is non-empty; on failure respond HTTP 400 `{ "error": "Title is required" }`.
- Call `createIssue()`; on success respond HTTP 201 with the created issue; on error respond HTTP 500 `{ "error": "<message>" }`.

## GET /openapi.json
- Serve an inline OpenAPI 3.0 spec describing all endpoints and schemas.
- Response: HTTP 200 with JSON spec; version from package.json; log via `logInfo`.

## GET /docs
- Serve an interactive Swagger UI at `/docs` using `swagger-ui-express` and the OpenAPI spec.
- Response: HTTP 200 HTML; preserve existing routes.

# Security & Middleware
- **CORS**: apply `cors()` with `origin` from `process.env.CORS_ORIGIN || '*'`.
- **API Key Auth**: require `x-api-key` header for all protected routes except `/health`, `/openapi.json`, and `/docs`; valid keys loaded from `API_KEYS` env var; reject unauthorized with HTTP 401 `{ "error": "Unauthorized" }`.
- **Request Validation**: use Zod schemas and a generic `validate()` middleware for POST `/invoke` and POST `/issues`.
- **Logging**: use `logInfo` middleware to record each request and `logError` for errors.

# Implementation
- All routing and middleware live in `sandbox/source/server.js`.
- Export default Express `app` for testing; call `app.listen()` on `process.env.PORT || 3000` when `NODE_ENV !== 'test'`.
- Initialize `globalThis.callCount = 0` in `src/lib/main.js` if undefined.
