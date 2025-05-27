# Objective
Provide a robust HTTP server implementing the Model Contact Protocol (MCP) to expose core agentic-lib functionality over a simple Express-based API. Clients can check health, retrieve the mission, list commands, and invoke library actions remotely.

# Endpoints

1. GET /health
   - Description: Verify server is running.
   - Response: HTTP 200 with JSON
     {
       "status": "ok",
       "timestamp": "2025-01-01T00:00:00.000Z"
     }
   - Requirements: timestamp must be valid ISO 8601.

2. GET /mission
   - Description: Return the content of sandbox/MISSION.md.
   - Behavior:
     • Read file at process.cwd()/sandbox/MISSION.md using fs/promises.
     • On success: HTTP 200 and JSON { "mission": <file content> }.
     • On failure: HTTP 404 and JSON { "error": "Mission file not found" }.

3. GET /features
   - Description: List available commands for invocation.
   - Response: HTTP 200 and JSON array ["digest", "version", "help"].

4. POST /invoke
   - Description: Invoke a library command remotely.
   - Request: JSON { "command": string, "args"?: string[] }.
   - Validation: command must be one of digest, version, help; otherwise HTTP 400 { "error": "Unsupported command" }.
   - Behavior:
     • digest:
       - If args[0] exists and is parsable JSON, use parsed object; else default to {}.
       - Create SQS event via createSQSEventFromDigest(payload).
       - Await digestLambdaHandler(event) and return HTTP 200 { "result": <handler output> }.
     • version:
       - Import version from package.json via ESM JSON assert.
       - Return HTTP 200 { "version": <version>, "timestamp": <ISO timestamp> }.
     • help:
       - Call generateUsage() imported from main.js.
       - If returns string, send as plain text; else return JSON.
   - Error handling: logError on exceptions and return HTTP 500 { "error": <message> }.

# Logging & Startup

- Use logInfo middleware to log every request method and path.
- Use logError to capture handler errors.
- Export default Express app.
- When process.env.NODE_ENV !== 'test', listen on PORT from env or default 3000.
- Entry point: sandbox/source/server.js; update package.json start script to "node sandbox/source/server.js".

# Testing

- Unit Tests (sandbox/tests/server.unit.test.js):
  • Mock fs/promises.readFile for GET /mission.
  • Verify status codes, response bodies, and timestamp formats.
  • Test unsupported commands return 400.

- Integration Tests (sandbox/tests/server.integration.test.js):
  • Start HTTP server via createServer(app) with Vitest async hooks.
  • Verify /health, /features, POST /invoke for version and help.

# Documentation

- sandbox/docs/API.md must describe all endpoints with sample cURL and fetch examples.
- Update sandbox/README.md to include an "MCP HTTP API" section referencing API.md, MISSION.md, and usage instructions.

# Dependencies & Constraints

- Use express for routing and supertest for integration tests.
- Maintain Node 20 ESM compatibility.
- Keep implementation within sandbox/source, tests in sandbox/tests, and docs in sandbox/docs.
