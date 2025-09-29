# Objective
Consolidate and extend the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js to expose all agentic-lib core functions via a unified Express API. This single feature will implement health checks, mission retrieval, command discovery, secure invocation, runtime statistics, GitHub issue management, a machine-readable OpenAPI specification, and an interactive Swagger UI, all with validation and API key protection.

# Endpoints

## GET /health
- Verify server health. Returns HTTP 200 JSON `{ status: "ok", timestamp: "<ISO 8601>" }`.

## GET /mission
- Read sandbox/MISSION.md. On success HTTP 200 `{ mission: "<file content>" }`. On failure HTTP 404 `{ error: "Mission file not found" }`.

## GET /features
- List available commands for `/invoke`. HTTP 200 JSON array `["digest","version","help"]`.

## POST /invoke
- Securely invoke core commands via JSON body validated by Zod:
  {
    command: one of "digest","version","help",
    args?: string[]
  }
- On invalid payload or unsupported command HTTP 400 `{ error: "<message>" }`.
- **digest**: parse `args[0]` as JSON or default `{}`, create an SQS event with `createSQSEventFromDigest()`, call `digestLambdaHandler()`, increment `globalThis.callCount`, respond HTTP 200 `{ result: <handler output> }`.
- **version**: import version from package.json, increment `callCount`, respond HTTP 200 `{ version: <string>, timestamp: <ISO> }`.
- **help**: call `generateUsage()`, increment `callCount`, respond HTTP 200 with plain text or JSON usage instructions.

## GET /stats
- Return runtime metrics HTTP 200 JSON:
  {
    callCount: <number>,
    uptime: <seconds>,
    memoryUsage: { rss, heapTotal, heapUsed, external }
  }
- Reads `globalThis.callCount`, `process.uptime()`, `process.memoryUsage()`, logs metrics with `logInfo`.

## GET /issues
- List open repository issues. Call `listIssues()` from core library. HTTP 200 with JSON array of `{ number, title, body, state, url }`. On error HTTP 500 `{ error: <message> }`.

## POST /issues
- Create a new GitHub issue. JSON body `{ title: string, body?: string }` validated by Zod. Missing or empty title HTTP 400 `{ error: "Title is required" }`. On success HTTP 201 with created issue object. On error HTTP 500 `{ error: <message> }`.

## GET /openapi.json
- Provide OpenAPI 3.0 spec for all above endpoints. HTTP 200 JSON document with `openapi`, `info.version`, and `paths` definitions. Logs requests via `logInfo`.

## GET /docs
- Serve interactive Swagger UI at `/docs` using `swagger-ui-express` and the inline OpenAPI spec. Returns HTTP 200 HTML without disrupting other routes.

# Security & Validation
- **API Key Middleware**: Require `x-api-key` header for all protected routes except `/health`, `/openapi.json`, `/docs`. Valid keys loaded from `API_KEYS` environment variable.
- **Request Validation**: Use Zod schemas for POST `/invoke` and POST `/issues`. Invalid payloads are rejected with detailed HTTP 400 error messages and logged via `logError`.

# Testing
- **Unit Tests** (`sandbox/tests/server.unit.test.js`): Mock file reads, handlers, `process.uptime()`, `process.memoryUsage()`, listIssues, createIssue, swaggerUi and authentication middleware. Verify each endpoint’s status codes, response shapes, validation and logging behavior via spies on `logInfo` and `logError`.
- **Integration Tests** (`sandbox/tests/server.integration.test.js`): Start server via `createServer(app)` in Vitest hooks. Perform end-to-end requests for all endpoints (valid and invalid cases) and assert status, JSON or HTML content, and side effects like `callCount` increments.

# Documentation
- Update `sandbox/docs/API.md` to document every endpoint with request/response examples (cURL and JavaScript `fetch`) and schema definitions.
- Update `sandbox/README.md` under “MCP HTTP API” to summarize endpoints, configuration (including `API_KEYS`), and links to API.md, MISSION.md, CONTRIBUTING.md, and LICENSE.