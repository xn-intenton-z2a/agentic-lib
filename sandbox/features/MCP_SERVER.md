# Objective
Fully implement and consolidate the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js, exposing core agentic-lib functionality via a unified Express API. The server should support health checks, mission retrieval, command invocation, runtime statistics, and provide a machine-readable OpenAPI specification for programmatic integration.

# Endpoints

## GET /health
- Description: Verify the server is running.
- Response: HTTP 200 with JSON:
  {
    "status": "ok",
    "timestamp": "<ISO 8601 timestamp>"
  }
- Requirements: timestamp must be a valid ISO 8601 string.

## GET /mission
- Description: Return the content of sandbox/MISSION.md.
- Behavior:
  • Read file at process.cwd()/sandbox/MISSION.md using fs/promises.
  • On success: HTTP 200 and JSON { "mission": <file content> }.
  • On failure: HTTP 404 and JSON { "error": "Mission file not found" }.

## GET /features
- Description: List available commands for remote invocation.
- Response: HTTP 200 and JSON array ["digest", "version", "help"].

## POST /invoke
- Description: Invoke a library command remotely.
- Request: JSON { "command": string, "args"?: string[] }.
- Validation: command must be one of digest, version, help; otherwise HTTP 400 { "error": "Unsupported command" }.
- Behavior:
  • digest:
    - Parse args[0] as JSON if possible; otherwise use empty object.
    - Create SQS event via createSQSEventFromDigest(payload).
    - Await digestLambdaHandler(event) and return HTTP 200 { "result": <handler output> }.
    - Increment globalThis.callCount on success.
  • version:
    - Import version from package.json via ESM JSON assert.
    - Return HTTP 200 { "version": <version>, "timestamp": <ISO timestamp> }.
    - Increment globalThis.callCount.
  • help:
    - Call generateUsage() imported from main.js.
    - Return plain text or JSON usage output via HTTP 200.
    - Increment globalThis.callCount.
- Error handling: logError on exceptions and return HTTP 500 { "error": <message> }.

## GET /stats
- Description: Retrieve real-time server metrics.
- Response: HTTP 200 with JSON:
  {
    "callCount": <number>,     // total successful POST /invoke calls since start
    "uptime": <number>,        // seconds since server start
    "memoryUsage": {           // values from process.memoryUsage()
      "rss": <number>,
      "heapTotal": <number>,
      "heapUsed": <number>,
      "external": <number>
    }
  }
- Behavior:
  • Read globalThis.callCount.
  • Call process.uptime() and process.memoryUsage().
  • Use logInfo to log the metrics.

## GET /openapi.json
- Description: Provide a machine-readable OpenAPI 3.0 document describing all MCP endpoints.
- Response: HTTP 200 with JSON body:
  {
    "openapi": "3.0.0",
    "info": {
      "title": "Agentic-lib MCP API",
      "version": "<package.json version>",
      "description": "OpenAPI spec for Model Contact Protocol HTTP API"
    },
    "paths": {
      "/health": { /* response schema */ },
      "/mission": { /* response schema */ },
      "/features": { /* response schema */ },
      "/invoke": { /* request and response schema */ },
      "/stats": { /* response schema */ }
    }
  }
- Behavior:
  • Dynamically import version from package.json.
  • Construct the OpenAPI document inline without external file reads.

# Logging & Startup
- Use logInfo middleware to log each request method and path.
- Use logError to capture handler errors with optional stack when verbose.
- Export default Express app.
- Initialize globalThis.callCount = 0 in src/lib/main.js if undefined.
- When process.env.NODE_ENV !== 'test', listen on PORT or default 3000.

# Testing
- **Unit Tests (sandbox/tests/server.unit.test.js)**:
  • Mock fs/promises.readFile for /mission.
  • Mock globalThis.callCount, process.uptime(), and process.memoryUsage().
  • Test all endpoints including /openapi.json, verifying status codes, response shapes, and logging via logInfo.

- **Integration Tests (sandbox/tests/server.integration.test.js)**:
  • Start server via createServer(app) in Vitest hooks.
  • Validate all endpoints end-to-end: /health, /mission, /features, /invoke (digest, version, help), /stats, and /openapi.json.
  • Assert correct HTTP status and JSON structure for each.

# Documentation
- Update sandbox/docs/API.md to describe all endpoints (/health, /mission, /features, /invoke, /stats, /openapi.json) with request/response examples (cURL and JavaScript fetch).
- Update sandbox/README.md under "MCP HTTP API" to reference API.md and include a bullet for /openapi.json.

# Dependencies & Constraints
- Use express for routing, supertest for integration tests, vitest for unit tests.
- Maintain Node 20 ESM compatibility.
- Keep implementation within sandbox/source, tests in sandbox/tests, and docs in sandbox/docs.
