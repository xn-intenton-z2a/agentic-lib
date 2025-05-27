# Objective
Consolidate and fully implement the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js. Expose core agentic-lib functionality via a single Express API including health checks, mission retrieval, command invocation, real-time statistics, and a machine-readable OpenAPI specification.

# Endpoints

## GET /health
- Purpose: Verify server is running.
- Response: HTTP 200 JSON with keys:
  {
    "status": "ok",
    "timestamp": "<ISO 8601>"
  }

## GET /mission
- Purpose: Retrieve sandbox/MISSION.md content.
- Behavior:
  • Read file at process.cwd()/sandbox/MISSION.md.
  • On success: HTTP 200 JSON { "mission": <content> }.
  • On failure: HTTP 404 JSON { "error": "Mission file not found" }.

## GET /features
- Purpose: List available commands.
- Response: HTTP 200 JSON array ["digest","version","help"].

## POST /invoke
- Purpose: Invoke a library command remotely.
- Request: JSON { "command": string, "args"?: string[] }.
- Validation: Reject unsupported commands with HTTP 400 JSON { "error": "Unsupported command" }.
- Behavior:
  • digest: parse args[0] as JSON or use {}. Create SQS event via createSQSEventFromDigest, await digestLambdaHandler, respond HTTP 200 JSON { "result": <handler output> }.
  • version: import version from package.json, respond HTTP 200 JSON { "version": <string>, "timestamp": <ISO> }.
  • help: call generateUsage(), respond HTTP 200 plain text or JSON usage.
  • After any successful command, increment globalThis.callCount.

## GET /stats
- Purpose: Expose runtime metrics for monitoring.
- Response: HTTP 200 JSON:
  {
    "callCount": <number>,       // total successful POST /invoke
    "uptime": <number>,          // process.uptime()
    "memoryUsage": {             // from process.memoryUsage()
      "rss": <number>,
      "heapTotal": <number>,
      "heapUsed": <number>,
      "external": <number>
    }
  }
- Behavior: Read globalThis.callCount, process.uptime(), process.memoryUsage() and log via logInfo.

## GET /openapi.json
- Purpose: Provide a machine-readable OpenAPI 3.0 spec.
- Response: HTTP 200 JSON with fields:
  {
    "openapi": "3.0.0",
    "info": { "title": "Agentic-lib MCP API", "version": <pkg.version>, "description": "MCP HTTP API spec" },
    "paths": { "/health": {...}, "/mission": {...}, "/features": {...}, "/invoke": {...}, "/stats": {...}, "/openapi.json": {...} }
  }
- Behavior: Dynamically import pkg.version, build spec inline, log each request via logInfo.

# Logging & Startup
- Use logInfo middleware for every request and logError for handler errors.
- Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
- Export default Express app from sandbox/source/server.js.
- When NODE_ENV !== 'test', listen on process.env.PORT || 3000.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock fs/promises.readFile for /mission tests.
- Stub globalThis.callCount, process.uptime(), process.memoryUsage().
- Test GET /health, /mission success and failure, /features, POST /invoke (digest, version, help, unsupported), GET /stats with mocked metrics, GET /openapi.json structure.
- Verify logInfo and logError calls via spies.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- E2E verify /health, /mission (real file), /features, POST /invoke (digest yields batchItemFailures array, version and help output), GET /stats after several invoke calls yields correct count and metrics, GET /openapi.json returns spec with expected top-level keys.

# Documentation
- Update sandbox/docs/API.md to document all six endpoints with request and response examples (cURL and JavaScript fetch).
- Update sandbox/README.md under "MCP HTTP API": overview of endpoints including a "Statistics" subsection and a note about /openapi.json for programmatic integration.

# Dependencies & Constraints
- Use express for routing and supertest for integration tests.
- Maintain Node 20 ESM compatibility.
- Implement all code changes within sandbox/source, tests in sandbox/tests, docs in sandbox/docs.

# Verification & Acceptance
- `npm test` passes all new and existing tests.
- Coverage report for sandbox/source/server.js ≥ 90%.
- Manual smoke tests confirm behavior for each endpoint.