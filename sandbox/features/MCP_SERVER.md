# Objective
Fully implement and consolidate the Model Contact Protocol (MCP) HTTP server in sandbox/source/server.js, including health checks, mission retrieval, command invocation, and real-time statistics, to expose core agentic-lib functionality over a unified Express API.

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
- Behavior:
  • Read globalThis.callCount (total successful POST /invoke calls since server start).
  • Call process.uptime() for seconds since start.
  • Call process.memoryUsage() for memory details.
  • Use logInfo to record the metrics.
  • Return HTTP 200 with JSON:
    {
      "callCount": <number>,
      "uptime": <number>,
      "memoryUsage": { "rss": <number>, "heapTotal": <number>, "heapUsed": <number>, "external": <number> }
    }.

# Logging & Startup
- Use logInfo middleware to log every request method and path.
- Use logError to capture handler errors with optional stack when verbose.
- Export default Express app from sandbox/source/server.js.
- When process.env.NODE_ENV !== 'test', app.listen() on PORT or default 3000.
- Initialize globalThis.callCount = 0 in src/lib/main.js before server load.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock fs/promises.readFile for /mission.
- Mock globalThis.callCount, process.uptime(), and process.memoryUsage().
- Verify GET /health, GET /mission (success and failure), GET /features, POST /invoke (each command and unsupported), GET /stats returns matching mocked metrics and logs via logInfo.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Verify /health, /features, GET /mission returns real mission text, POST /invoke for digest, version, help, and GET /stats after several invokes yields correct callCount, positive uptime, and non-negative memoryUsage values.

# Documentation

## sandbox/docs/API.md
- Document all endpoints (/health, /mission, /features, /invoke, /stats) with descriptions, request/response examples (cURL and JavaScript fetch).

## sandbox/README.md
- Add "MCP HTTP API" section summarizing available endpoints.
- Include startup instructions (npm start, PORT env).
- Add "Statistics" subsection with usage examples:
  ```bash
  curl http://localhost:3000/stats
  ```
  ```js
  const res = await fetch('http://localhost:3000/stats');
  console.log(await res.json());
  ```

# Dependencies & Constraints
- Use express for routing, supertest for integration tests, vitest for unit tests.
- Maintain Node 20 ESM compatibility.
- All implementation within sandbox/source, tests in sandbox/tests, docs in sandbox/docs.

# Verification & Acceptance
- `npm test` passes without failures.
- Coverage for sandbox/source/server.js ≥ 90%.
- Manual smoke tests for all endpoints confirm behavior.