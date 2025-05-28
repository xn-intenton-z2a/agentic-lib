# Objective
Implement a unified MCP HTTP server in sandbox/source/server.js that exposes core agentic-lib operations—health checks, mission retrieval, feature listing, command invocation, runtime statistics, and an OpenAPI specification—under a single Express application.

# Middleware Configuration
- API Key Authentication  
  • Read MCP_API_KEY at startup.  
  • Reject requests missing or invalid Authorization header (Bearer token) with HTTP 401 and JSON { error: "Unauthorized" }.  
  • Log authentication failures via logError.
- Rate Limiting  
  • Apply express-rate-limit globally before routes: default window 15m, max 100 requests/IP, override via RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX.  
  • Exceeding limit returns HTTP 429 and JSON { error: "Too many requests, please try again later." } and logged via logInfo.
- Request Logging  
  • Use logInfo middleware to record method, path, and timestamp for every request.

# Endpoints
## GET /health
- Description: Verify the server is running.  
- Response: HTTP 200 JSON { status: "ok", timestamp: "<ISO 8601>" }.

## GET /mission
- Description: Return sandbox/MISSION.md content.  
- Behavior: read process.cwd()/sandbox/MISSION.md via fs/promises.  
- Success: HTTP 200 JSON { mission: "<file content>" }.  
- Failure: HTTP 404 JSON { error: "Mission file not found" }.

## GET /features
- Description: List invocable commands.  
- Response: HTTP 200 JSON ["digest","version","help"].

## POST /invoke
- Description: Invoke a library command remotely via JSON { command: string, args?: string[] }.  
- Validation: command must be one of digest, version, help.  
- Behavior:
  • digest: parse args[0] as JSON or default to {}.  Create SQS event via createSQSEventFromDigest, await digestLambdaHandler(event), respond HTTP 200 JSON { result: <handler output> }.
  • version: import version from package.json, respond HTTP 200 JSON { version: "<version>", timestamp: "<ISO 8601>" }.
  • help: call generateUsage(), respond HTTP 200 plain text or JSON usage.
- After any successful invocation, increment globalThis.callCount.

## GET /stats
- Description: Retrieve runtime metrics for monitoring.  
- Behavior: read globalThis.callCount, process.uptime(), process.memoryUsage().  
- Response: HTTP 200 JSON { callCount: number, uptime: number, memoryUsage: { rss, heapTotal, heapUsed, external } }.
- Log metrics object via logInfo.

## GET /openapi.json
- Description: Provide an OpenAPI 3.0 spec for all MCP endpoints.  
- Behavior: dynamically import version from package.json, build spec inline with info and paths for /health, /mission, /features, /invoke, /stats, /openapi.json.  
- Response: HTTP 200 JSON spec.  
- Use logInfo to record each request.

# Testing
- Unit Tests (sandbox/tests/server.unit.test.js):
  • Mock authentication and rate limiter to verify 401 and 429 behaviors.  
  • Stub fs/promises.readFile for /mission tests.  
  • Stub process.uptime and process.memoryUsage for /stats.  
  • Mock createSQSEventFromDigest and digestLambdaHandler for /invoke.  
  • Test GET /openapi.json returns valid spec fields.  
  • Spy on logInfo and logError for middleware and handlers.
- Integration Tests (sandbox/tests/server.integration.test.js):
  • Start server via createServer(app).  
  • End-to-end tests for all endpoints under valid and invalid conditions (unauthorized, rate-limit, missing mission).  
  • Assert correct HTTP status codes, response shapes, and behavior of globalThis.callCount across multiple invokes.

# Documentation
- sandbox/docs/API.md: document all endpoints with descriptions, request/response examples (cURL, fetch), authentication header, rate-limit notes.
- sandbox/README.md: update “MCP HTTP API” section: summarize middleware requirements (MCP_API_KEY, rate limit overrides), list endpoints, show startup (npm start, PORT, MCP_API_KEY), and code examples for each endpoint.

# Dependencies & Constraints
- Add dependencies: express-rate-limit.  
- Maintain ESM and Node ≥20 compatibility.  
- Implementation limited to sandbox/source, tests under sandbox/tests, and docs under sandbox/docs.  
- No new files outside permitted sandbox paths.

# Verification & Acceptance
- npm test passes all new and existing tests.  
- Coverage report: sandbox/source/server.js ≥90%.  
- Manual smoke tests for each endpoint including unauthorized and rate-limit scenarios.  
- Code review confirms alignment with CONTRIBUTING.md guidelines.