# Objective
Consolidate the Model Contact Protocol (MCP) HTTP server into a unified Express application that supports core repository actions with enhanced security, observability, and programmatic integration.
Clients can perform health checks, retrieve the mission, list available features, invoke commands, view runtime statistics, download the OpenAPI specification, and are protected by API key authentication and rate limiting.

# Middleware
## API Key Authentication
• Read `MCP_API_KEY` from environment at startup.  
• Reject requests without header `Authorization: Bearer <MCP_API_KEY>` with HTTP 401 and JSON `{ error: "Unauthorized" }`.

## Rate Limiting
• Use `express-rate-limit` to enforce a default window of 15 minutes and 100 requests per IP.  
• Allow override via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` environment variables.  
• Reject excess requests with HTTP 429 and JSON `{ error: "Too many requests, please try again later." }`.

# Endpoints
## GET /health
Description: Verify the server is running.  
Response: HTTP 200 and JSON `{ status: "ok", timestamp: <ISO 8601> }`.

## GET /mission
Description: Return the content of `sandbox/MISSION.md`.  
Success: HTTP 200 and JSON `{ mission: <file content> }`.  
Failure: HTTP 404 and JSON `{ error: "Mission file not found" }`.

## GET /features
Description: List available commands.  
Response: HTTP 200 and JSON array `["digest","version","help"]`.

## POST /invoke
Description: Invoke a repository command.  
Request: JSON `{ command: string, args?: string[] }`.  
Validation: supported commands are `digest`, `version`, `help`; else return HTTP 400 `{ error: "Unsupported command" }`.

Behavior:
• `digest`: parse `args[0]` as JSON or use `{}`; create SQS event via `createSQSEventFromDigest`; await `digestLambdaHandler(event)`; return HTTP 200 `{ result: <handler output> }`.
• `version`: import `version` from `package.json`; return HTTP 200 `{ version: <string>, timestamp: <ISO 8601> }`.
• `help`: call `generateUsage()`; return plain text or JSON usage output via HTTP 200.

After any successful invocation, increment `globalThis.callCount`.

## GET /stats
Description: Retrieve runtime metrics.  
Response: HTTP 200 and JSON:
```
{
  "callCount": <number>,      // total successful POST /invoke calls since start
  "uptime": <number>,         // seconds since start (process.uptime())
  "memoryUsage": {            // values from process.memoryUsage()
    "rss": <number>,
    "heapTotal": <number>,
    "heapUsed": <number>,
    "external": <number>
  }
}
```
Logs metrics with `logInfo`.

## GET /openapi.json
Description: Download the OpenAPI 3.0 document for the MCP API.  
Response: HTTP 200 and JSON with keys `openapi`, `info` (including `version` from `package.json`), and `paths` for `/health`, `/mission`, `/features`, `/invoke`, `/stats`, and `/openapi.json`.
Log each request with `logInfo`.

# Logging & Startup
• Apply authentication and rate limiting middleware globally before routes.  
• Use `logInfo` for every request and `logError` for errors.  
• Initialize `globalThis.callCount = 0` in `src/lib/main.js`.  
• Export the Express `app`; when `process.env.NODE_ENV !== 'test'`, listen on `process.env.PORT || 3000`.

# Testing
**Unit Tests** (`sandbox/tests/server.unit.test.js`):
• Mock authentication header and verify 401 for missing or invalid API key.  
• Simulate rate limit threshold and verify HTTP 429.  
• Mock `fs/promises.readFile`, `process.uptime()`, `process.memoryUsage()` and test `/mission`, `/stats`, and `/openapi.json`.  
• Test `/invoke` for each command and unsupported commands.  

**Integration Tests** (`sandbox/tests/server.integration.test.js`):
• Start server with valid `MCP_API_KEY` and rate limit settings.  
• Exercise `/health`, `/mission`, `/features`, `/invoke`, `/stats`, `/openapi.json` with correct credentials.  
• Verify unauthorized requests return HTTP 401 and rate limit exceed returns HTTP 429.

# Documentation
• Update `sandbox/docs/API.md` with sections for authentication, rate limiting, and each endpoint including examples (cURL and JavaScript `fetch`).  
• Update `sandbox/README.md` under "MCP HTTP API" to describe environment variables (`MCP_API_KEY`, `PORT`, rate limit overrides), how to start the server, and sample requests for all endpoints.