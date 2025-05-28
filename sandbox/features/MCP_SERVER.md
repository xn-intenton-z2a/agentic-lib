# Objective
Consolidate and extend the sandbox MCP HTTP server (`sandbox/source/server.js`) to expose core agentic-lib functionality over HTTP. This unified feature will include service health checks, mission retrieval, command discovery, invocation of digest/version/help commands with request validation, real-time statistics, a machine-readable OpenAPI 3.0 specification, and an interactive Swagger UI.

# Endpoints

## GET /health
- Purpose: Verify the server is running.
- Response: HTTP 200 JSON:
  {
    "status": "ok",
    "timestamp": "<ISO 8601 timestamp>"
  }

## GET /mission
- Purpose: Return the contents of `sandbox/MISSION.md`.
- Success: HTTP 200 JSON `{ "mission": "<file content>" }`.
- Failure: HTTP 404 JSON `{ "error": "Mission file not found" }`.

## GET /features
- Purpose: List available commands for remote invocation.
- Response: HTTP 200 JSON array `["digest","version","help"]`.

## POST /invoke
- Purpose: Invoke a library command remotely.
- Request: JSON body validated against InvocationSchema:
    • command: one of "digest","version","help"
    • args: optional array of strings
- Behavior:
  • digest: parse `args[0]` as JSON or default to `{}`; create SQS event via `createSQSEventFromDigest`, call `digestLambdaHandler`, respond HTTP 200 JSON `{ "result": <handler output> }`, increment globalThis.callCount.
  • version: respond HTTP 200 JSON `{ "version": <pkg.version>, "timestamp": <ISO> }`, increment globalThis.callCount.
  • help: return usage from `generateUsage()` as plain text or JSON, HTTP 200, increment globalThis.callCount.
- Validation: invalid bodies or unsupported `command` yield HTTP 400 JSON `{ "error": <detailed Zod message> }`.

## GET /stats
- Purpose: Expose runtime metrics for monitoring.
- Response: HTTP 200 JSON:
  {
    "callCount": <number>,        // successful POST /invoke calls since start
    "uptime": <number>,           // seconds since start
    "memoryUsage": {              // from process.memoryUsage()
      "rss": <number>,
      "heapTotal": <number>,
      "heapUsed": <number>,
      "external": <number>
    }
  }
- Behavior: read `globalThis.callCount`, `process.uptime()`, `process.memoryUsage()`, log via `logInfo`.

## GET /openapi.json
- Purpose: Provide an OpenAPI 3.0 document for programmatic integration.
- Response: HTTP 200 JSON with fields:
  • openapi: "3.0.0"
  • info: { title, version from package.json, description }
  • paths: definitions for `/health`, `/mission`, `/features`, `/invoke`, `/stats`, `/openapi.json`.
- Behavior: build spec inline, import `version` via ESM JSON assert, log via `logInfo`.

## GET /docs
- Purpose: Serve an interactive Swagger UI for the MCP API.
- Behavior: mount `swagger-ui-express` middleware at `/docs`, using the OpenAPI spec; return HTML UI with `Content-Type: text/html`.

# Validation Middleware
- Define Zod schemas (`InvocationSchema`) and a reusable validation middleware that parses `req.body`, rejects invalid input with HTTP 400 JSON `{ error: <Zod message> }` and logs via `logError`.
- Apply to POST /invoke (and any future JSON endpoints).

# Logging & Startup
- Use `logInfo` middleware to log every request method and path.
- Use `logError` to capture handler errors.
- Initialize `globalThis.callCount = 0` in `src/lib/main.js` if undefined.
- Export default Express `app` from `sandbox/source/server.js`.
- When `NODE_ENV !== 'test'`, `app.listen()` on `process.env.PORT || 3000`.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `fs/promises.readFile` for GET /mission tests.
- Mock `globalThis.callCount`, `process.uptime()`, `process.memoryUsage()`.
- Mock OpenAPI builder and Swagger UI for `/openapi.json` and `/docs`.
- Use Supertest to test each endpoint, including validation failures for POST /invoke.
- Spy on `logInfo` and `logError` to verify logging.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server via `createServer(app)` in Vitest hooks.
- End-to-end verify: `/health`, `/mission`, `/features`, POST `/invoke` (digest/version/help/invalid), `/stats` after invokes, GET `/openapi.json`, GET `/docs` returns HTML UI.

# Documentation

## `sandbox/docs/API.md`
- Document all endpoints with request/response examples (cURL and JavaScript `fetch`).
- Include schemas for request validation and OpenAPI example.

## `sandbox/README.md`
- Add or update "MCP HTTP API" section:
  • Overview of endpoints and validation behavior.
  • Startup instructions (`npm start`, `PORT` env var).
  • Links to `sandbox/docs/API.md`, `sandbox/MISSION.md`, `CONTRIBUTING.md`, `LICENSE-MIT`.
  • Bullets for `/stats`, `/openapi.json`, and `/docs`.
