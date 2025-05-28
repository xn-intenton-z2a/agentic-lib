# Objective
Consolidate all Model Contact Protocol (MCP) HTTP server functionality in a single Express-based implementation under `sandbox/source/server.js`. Provide remote clients with health checks, mission retrieval, command invocation, issue management, runtime statistics, machine-readable OpenAPI documentation, and an interactive Swagger UI, secured by API key authentication, rate limiting, and request validation.

# Endpoints

## GET /health
- Verify server availability.
- Response: HTTP 200 JSON
  {
    "status": "ok",
    "timestamp": "<ISO 8601 timestamp>"
  }

## GET /mission
- Return the contents of `sandbox/MISSION.md`.
- Success: HTTP 200 JSON { "mission": "<file content>" }
- Failure: HTTP 404 JSON { "error": "Mission file not found" }

## GET /features
- List available commands for invocation.
- Response: HTTP 200 JSON ["digest","version","help"]

## POST /invoke
- Invoke core library commands remotely via JSON body { command: string, args?: string[] }.
- Validate request against Zod schema; return HTTP 400 with error details on invalid payload.
- Supported commands:
  • **digest**: parse `args[0]` as JSON or use an empty object, generate an SQS event, call `digestLambdaHandler`, increment invocation counter, and return HTTP 200 JSON { "result": <handler output> }.
  • **version**: return HTTP 200 JSON { "version": <pkg.version>, "timestamp": <ISO timestamp> } and increment counter.
  • **help**: return usage text or JSON from `generateUsage()`, HTTP 200, and increment counter.
- Unsupported commands: HTTP 400 JSON { "error": "Unsupported command" }.

## GET /issues
- List open GitHub issues for the configured repository.
- Read `GITHUB_API_BASE_URL` and `GITHUB_API_TOKEN` from environment; fail-fast on missing configuration.
- Call GitHub API, return HTTP 200 JSON array of issues with fields `id`, `number`, `title`, `state`, `html_url`.
- On error: HTTP 502 JSON { "error": "Failed to fetch issues" }.

## POST /issues
- Create a new GitHub issue via JSON body { title: string, body?: string }.
- Validate that `title` is non-empty; HTTP 400 on validation failure.
- Call GitHub API, return HTTP 201 JSON representation of the created issue.
- On error: HTTP 502 JSON { "error": "Failed to create issue" }.

## GET /stats
- Retrieve runtime metrics.
- Response: HTTP 200 JSON
  {
    "callCount": <number>,      // total successful POST /invoke calls
    "uptime": <number>,         // seconds since server start
    "memoryUsage": {            // output of process.memoryUsage()
      "rss": <bytes>,
      "heapTotal": <bytes>,
      "heapUsed": <bytes>,
      "external": <bytes>
    }
  }

## GET /openapi.json
- Return an OpenAPI 3.0 document for all MCP endpoints.
- Dynamically import version from `package.json`.
- Response: HTTP 200 JSON with standard OpenAPI fields: `openapi`, `info`, `paths`.

## GET /docs
- Serve an interactive Swagger UI based on the OpenAPI spec.
- Response: HTTP 200 HTML (`Content-Type: text/html`).

# Middleware & Security

1. **JSON Body Parsing**: `app.use(express.json())`.
2. **Rate Limiting**: apply `express-rate-limit` globally using env vars `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`; on limit exceed, HTTP 429 JSON { "error": "Too many requests, please try again later." } and log event.
3. **API Key Authentication**: require header `Authorization: Bearer <MCP_API_KEY>`; on missing/invalid key, HTTP 401 JSON { "error": "Unauthorized" } and log error.
4. **Request Validation**: use Zod schemas to validate bodies for POST `/invoke` and POST `/issues`; reject invalid payloads with HTTP 400 JSON containing detailed Zod messages.
5. **Logging**: use `logInfo` middleware to record all requests (method, path, timestamp) and `logError` for handler errors.

# Logging & Startup

- Export default Express `app` from `sandbox/source/server.js`.
- When `NODE_ENV !== 'test'`, listen on `process.env.PORT || 3000`.
- Initialize `globalThis.callCount = 0` in `src/lib/main.js` before server load to support statistics and test mocks.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock file reads for `/mission`.
- Mock and stub `fetch` for GitHub issue endpoints.
- Mock `process.uptime()` and `process.memoryUsage()` for `/stats`.
- Test each endpoint for valid and invalid inputs, status codes, response shapes, and logging side effects.
- Test rate limiting, authentication failure, and validation errors.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server via `createServer(app)` in Vitest async hooks.
- E2E verify all endpoints with real and mock configurations:
  • `/health`, `/mission`, `/features`, POST `/invoke` (digest, version, help, invalid), GET/POST `/issues`, GET `/stats`, GET `/openapi.json`, GET `/docs`.
  • Assert correct HTTP statuses, JSON or HTML content, and behavior under rate limits and auth rules.

# Documentation

1. **`sandbox/docs/API.md`**: document all endpoints with descriptions, request/response examples (cURL and JavaScript `fetch`), authentication, rate limiting, and error cases.
2. **`sandbox/README.md`**: update MCP HTTP API section to reference API.md, MISSION.md, CONTRIBUTING.md, LICENSE, repository URL; include subsections for security & rate limiting, statistics, OpenAPI, and interactive docs.
