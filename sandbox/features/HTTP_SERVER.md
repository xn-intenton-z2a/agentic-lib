# Purpose
Add an embedded HTTP server to src/lib/main.js that provides health and metrics endpoints for agentic-lib, enabling external systems to monitor service status and call counts without embedding the library directly.

# Value Proposition
Expose operational insights and allow health checks of agentic-lib in containerized or microservice environments. Simplifies integration with monitoring tools and supports automated orchestration by providing a lightweight HTTP interface.

# Success Criteria & Requirements
* Define a function startHttpServer(options?) exported from src/lib/main.js.
* Accept options.port number or read from environment variable HTTP_PORT, default to 3000 if neither is provided.
* Use Node's built-in http module to create a server.
* Expose two GET endpoints:
  - /health: returns HTTP 200 with JSON { status: "ok" }.
  - /metrics: returns HTTP 200 with JSON { callCount: globalThis.callCount, uptime: process.uptime() }.
* Any other request path returns HTTP 404 with JSON { error: "Not Found" }.
* Increment globalThis.callCount when processing /metrics requests only.
* Handle server errors by logging via logError and shutting down gracefully.
* No additional dependencies should be added.

# Implementation Details
1. In src/lib/main.js after existing exports, import http from "http".
2. Define startHttpServer(options = {}):
   - Determine port: options.port || process.env.HTTP_PORT parsed to integer || 3000.
   - Create server with http.createServer((req, res) => { route handling }).
   - In request handler inspect req.url and req.method:
     * If GET /health respond with JSON and status 200.
     * If GET /metrics increment callCount and respond with metrics JSON and status 200.
     * Else respond with JSON error and status 404.
   - Start listening on port and logInfo with server listening message.
   - Return the server instance to allow shutdown in tests.
3. Update main(args) to detect --serve flag before processHelp:
   - If args includes --serve call await startHttpServer() and return to keep server running.
   - Document exit behavior in logs.
4. Update README.md under CLI Usage to include:
   - --serve: start HTTP server for health and metrics.
   - Example invocation: npx agentic-lib --serve and sample output log.
5. Add Vitest tests in tests/unit/main.test.js:
   - Import startHttpServer, start on ephemeral port (e.g., 0), use server.address().port.
   - Use fetch to GET /health and verify status 200 and body { status: 'ok' }.
   - Use fetch to GET /metrics and verify status 200 and body includes callCount and uptime fields.
   - Test 404 behavior for unknown path.
   - Ensure server.close() is called after tests.

# Verification & Acceptance
* Unit tests cover health, metrics, and not found endpoints and callCount increment.
* npm test passes with no regressions.
* README.md reflects new CLI flag and usage examples.
* No new dependencies are added and code style matches existing patterns.