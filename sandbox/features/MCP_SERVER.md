# Objective
Provide a lightweight HTTP API server implementing the Model Contact Protocol (MCP) to expose core agentic-lib functionality. This server will allow remote clients to check server health, retrieve mission details, list available features, and invoke existing library actions over HTTP.

# Endpoints

1. **GET /health**
   - Returns HTTP 200 with JSON `{ status: "ok", timestamp: ISOString }`.
   - Verifies that the server is running and can respond.

2. **GET /mission**
   - Reads sandbox/MISSION.md and returns its content as plain text or JSON `{ mission: string }`.
   - Validates that the mission file exists and is readable.

3. **GET /features**
   - Returns JSON list of supported actions based on the current source exports. For now, returns static array `["digest", "version", "help"]`.
   - Provides clients with discoverable commands.

4. **POST /invoke**
   - Accepts JSON payload `{ command: string, args?: string[] }`.
   - Validates `command` against allowed values (`digest`, `version`, `help`).
   - Internally calls `main([--commandFlag])` or direct library functions and streams back JSON result.
   - Responds with HTTP 200 and JSON `{ result: any }` on success or HTTP 4xx/5xx with error details.

# Success Criteria & Requirements

- Express is configured in a single new source file under `src/lib/server.js`.
- Server listens on port configured by `process.env.PORT` or default 3000.
- All endpoints are covered by unit and integration tests (Vitest and Supertest).
- README is updated to document HTTP API usage examples (cURL and code snippets).
- No other existing features are removed or modified beyond adding invocation logic.
- Environment configuration (`dotenv`) supports loading `PORT`.
- Endpoint handlers must use existing logging utilities (`logInfo`, `logError`) for request and error logging.

# Testing

- Unit tests for each route handler to simulate valid and invalid requests.
- Integration tests with Supertest: start server and verify responses for `/health`, `/mission`, `/features`, `/invoke`.
- Mock file reading for `/mission` tests to isolate file system.

# Documentation & README

- Add HTTP API section in `sandbox/README.md`:
  - Overview of MCP protocol.
  - Endpoint reference with sample requests and responses.
  - Instructions for starting the server (`npm start`) and specifying `PORT`.

# Dependencies & Constraints

- Use `express` for routing.
- Use `supertest` for integration tests.
- Ensure Node 20 compatibility and ESM.
- Keep feature implementation within existing repository boundaries (one new file plus updates to README and tests).

# Verification & Acceptance

- `npm test` passes with new tests included.
- Manual test: start server and exercise each endpoint.
- Code review confirms alignment with CONTRIBUTING.md guidelines.