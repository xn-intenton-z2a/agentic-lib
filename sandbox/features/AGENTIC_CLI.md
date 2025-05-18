# Objective
Extend the existing command-line interface to support a long-running HTTP server that exposes the core handlers over REST and provides built-in metrics for observability.

# Value Proposition
Running a local HTTP server alongside the CLI commands unlocks lightweight containerized deployments, simplifies integration in CI/CD pipelines, accelerates iterative development by avoiding process spawning, and offers real-time insights into usage via a metrics endpoint.

# Requirements
1. Add a new function processServe(args) in sandbox/source/main.js that:
   • Detects a --serve flag and optional --port <number> argument (default port 3000).
   • Imports the Node http module to create an HTTP server instance.
   • Defines the following endpoints:
     - GET /version: mirrors the CLI --version output (json with version and timestamp).
     - POST /digest: accepts a JSON payload, invokes digestLambdaHandler, and returns { batchItemFailures, handler }.
     - POST /agent: accepts { prompt } in the JSON body, increments globalThis.callCount, invokes processAgent logic, and returns parsed JSON response or error details.
     - GET /metrics: returns JSON { callCount, uptime } reflecting total HTTP requests served and process.uptime().
   • Increments globalThis.callCount for each incoming HTTP request.
   • Handles errors by responding with HTTP 500 and JSON { level: "error", message, error } using logError internally.
   • Listens on the configured port and emits an INFO log on startup.
2. Modify main(args) in sandbox/source/main.js to invoke processServe when --serve is detected and prevent existing CLI handlers from running in serve mode.
3. Update sandbox/tests/main.test.js to cover:
   • Server startup on default and custom ports.
   • GET /version returns the same JSON as CLI --version.
   • POST /digest with sample payload triggers digestLambdaHandler and returns expected structure.
   • POST /agent returns parsed JSON on valid responses, logs errors on failures, and increments callCount.
   • GET /metrics reports accurate callCount and uptime and resets callCount when reinitialized.
   • HTTP 500 responses when handlers throw exceptions and verifying logError invocation.
4. Update sandbox/README.md to document the new --serve flag, optional --port argument, all REST endpoints with curl examples, sample responses, and metrics usage.

# Dependencies & Constraints
- Rely only on built-in Node http module, existing OpenAI and AWS handler logic in sandbox/source/main.js.
- Tests must use vitest and existing mock patterns for OpenAI.
- No changes outside sandbox/source, sandbox/tests, sandbox/README.md.

# Verification & Acceptance
- All new and existing tests pass under npm test.
- Manual validation: start server with node sandbox/source/main.js --serve --port 4000 and verify endpoints behave as specified, including metrics resets.