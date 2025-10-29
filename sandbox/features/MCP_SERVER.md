# Objective

Provide a unified Express-based HTTP server in sandbox/source/server.js that implements the Model Contact Protocol (MCP) and exposes core agentic-lib functionality over HTTP.  This server will support health checks, mission retrieval, feature discovery, secure command invocation, real-time statistics, GitHub issue management, CORS, request validation, a machine-readable OpenAPI spec, and an interactive Swagger UI, all protected by API-key authentication.

# Endpoints

## GET /health
- Verify service health.  Respond HTTP 200 with JSON `{ status: "ok", timestamp: "<ISO 8601>" }`.

## GET /mission
- Return the contents of sandbox/MISSION.md.  On success HTTP 200 `{ mission: "<file content>" }`; on missing file HTTP 404 `{ error: "Mission file not found" }`.

## GET /features
- List available library commands (e.g. digest, version, help).  Respond HTTP 200 JSON array.

## POST /invoke
- Accept JSON body `{ command: string, args?: string[] }`.
- Validate payload with Zod schema; on failure HTTP 400 `{ error: "<message>" }`.
- Supported commands:
  - **digest**: parse args[0] or default `{}`, call createSQSEventFromDigest(), await digestLambdaHandler(); increment invocation counter; respond HTTP 200 `{ result: <handler output> }`.
  - **version**: read version from package.json; increment counter; respond HTTP 200 `{ version: <string>, timestamp: <ISO> }`.
  - **help**: call generateUsage(); increment counter; respond HTTP 200 with usage text or JSON.
- Unsupported command HTTP 400 `{ error: "Unsupported command" }`.

## GET /stats
- Return metrics: total successful /invoke calls, uptime, and process.memoryUsage().
- Respond HTTP 200 with JSON `{ callCount, uptime, memoryUsage }`.

## GET /issues
- Call listIssues() from src/lib/main.js; respond HTTP 200 JSON array of `{ number, title, body, state, url }`; on error HTTP 500 `{ error: <message> }`.

## POST /issues
- Accept JSON `{ title: string, body?: string }`.
- Validate title is non-empty; on failure HTTP 400 `{ error: "Title is required" }`.
- Call createIssue(); on success HTTP 201 with created issue object; on error HTTP 500 `{ error: <message> }`.

## GET /openapi.json
- Serve an inline OpenAPI 3.0 document describing all endpoints and schemas.
- Respond HTTP 200 with JSON spec; log each request.

## GET /docs
- Serve interactive Swagger UI at /docs via swagger-ui-express, based on the /openapi.json spec.

# Security & Middleware

- **CORS**: apply cors() with origin from `process.env.CORS_ORIGIN || '*'`.
- **API Key Authentication**: require `x-api-key` header for all routes except `/health`, `/openapi.json`, `/docs`; valid keys from `API_KEYS` env var; reject with HTTP 401 `{ error: "Unauthorized" }`.
- **Request Validation**: use Zod schemas and a generic `validate()` middleware for POST /invoke and POST /issues.
- **Logging**: apply JSON-structured `logInfo` for all requests and `logError` for errors.

# Implementation & Structure

- All routing and middleware in one file: `sandbox/source/server.js`.
- Export default Express `app` for testing; listen on `process.env.PORT || 3000` when `NODE_ENV !== 'test'`.
- Initialize `globalThis.callCount = 0` in src/lib/main.js if undefined.

# Testing

- **Unit Tests** (`sandbox/tests/server.unit.test.js`): mock file reads, `process.uptime`, `process.memoryUsage`, listIssues, createIssue, swaggerUi, and auth middleware; use Supertest to assert status codes, response shapes, validation, CORS headers, OpenAPI content, and logging calls.
- **Integration Tests** (`sandbox/tests/server.integration.test.js`): start server via createServer(app); end-to-end verify all endpoints under valid and invalid conditions and assert side effects (counter increments) and correct Content-Type for JSON and HTML.

# Documentation

- Update `sandbox/docs/API.md` with detailed reference for every endpoint, request and response examples (cURL and fetch), validation schemas, auth, CORS, and OpenAPI usage.
- Update `sandbox/README.md` under “MCP HTTP API” to summarize endpoints, configuration of `API_KEYS`, `CORS_ORIGIN`, startup instructions, and links to API.md, MISSION.md, CONTRIBUTING.md, and LICENSE.