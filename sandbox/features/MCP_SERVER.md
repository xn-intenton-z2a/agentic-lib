# Objective
Provide a lightweight HTTP API server implementing the Model Contact Protocol (MCP) to expose core agentic-lib functionality. Remote clients can check service health, retrieve mission details, discover available commands, and invoke library actions over HTTP.

# Endpoints
1. GET /health
   - Description: Verify the server is running.
   - Response: HTTP 200 with JSON {
       status: "ok",
       timestamp: "<ISO 8601>"
     };
2. GET /mission
   - Description: Return the contents of sandbox/MISSION.md.
   - Success: HTTP 200 with JSON { mission: "<file content>" };
   - Failure: HTTP 404 with JSON { error: "Mission file not found" };
3. GET /features
   - Description: List available commands for remote invocation.
   - Response: HTTP 200 with JSON array ["digest","version","help"];
4. POST /invoke
   - Description: Invoke a core library command remotely via JSON body { command: string, args?: string[] };
   - Validation: Reject unsupported commands with HTTP 400 and JSON { error: "Unsupported command" };
   - digest: parse args[0] as JSON or use empty object, call createSQSEventFromDigest(), await digestLambdaHandler(), return HTTP 200 { result: <handler output> };
   - version: read version from package.json, return HTTP 200 { version: <string>, timestamp: <ISO> };
   - help: return usage from generateUsage() as plain text or JSON via HTTP 200;

# Testing
- Unit tests (Vitest + Supertest) under sandbox/tests:
  • Test each route handler for valid and invalid inputs;
  • Mock file reads for /mission;
  • Validate error responses for unsupported commands;
- Integration tests using Supertest start the server via createServer(app) and verify end-to-end behavior for all endpoints;

# Documentation
- Update sandbox/README.md with an "MCP HTTP API" section:
  • Describe each endpoint with sample cURL and JavaScript fetch examples;
  • Show how to start the server with npm start and configure PORT;
- Update sandbox/docs/API.md to include full endpoint reference;

# Dependencies & Startup
- Add express to dependencies;
- In sandbox/source/server.js implement routes and export default app;
- In package.json update "start" script to "node sandbox/source/server.js";
- Server listens on process.env.PORT or default 3000;

# Verification & Acceptance
- Run npm test and confirm all new tests pass;
- Manual smoke tests via curl for /health, /mission, /features, /invoke;
- Code review ensures alignment with CONTRIBUTING.md guidelines.