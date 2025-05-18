# Objective
Extend the existing command-line interface to support a persistent HTTP server that exposes core handlers (digest, version, agent) over REST endpoints and include an observability endpoint for metrics.

# Value Proposition
Running an HTTP server alongside the CLI unlocks lightweight local or containerized deployments, allows workflows or other systems to invoke library functions via HTTP, accelerates iterative development and testing by avoiding CLI flags, and provides built-in observability via a metrics endpoint that reports call counts and uptime.

# Requirements
1. Add a new function processServe(args) that:
   • Detects a --serve flag and an optional --port <number> argument (default port 3000).
   • Imports Node http module and creates an HTTP server.
   • Defines endpoints:
     - GET /version: returns JSON with version and timestamp (reuse processVersion logic).
     - POST /digest: accepts a JSON payload, calls digestLambdaHandler, and responds with JSON { batchItemFailures, handler }.
     - POST /agent: accepts { prompt } in the body, invokes OpenAI chat completion (reuse processAgent logic), and sends parsed JSON response.
     - GET /metrics: returns JSON with fields callCount and uptime (in seconds) reflecting the total HTTP requests served and process.uptime().
   • Increments globalThis.callCount on each incoming request.
   • Handles errors by returning HTTP 500 with JSON { error, message } using logError internally.
   • Listens on the specified port and logs a startup INFO log entry.
2. Extend main(args) to call processServe before existing CLI handlers and exit after server starts.
3. Add automated tests in tests/unit/main.test.js to verify:
   • processServe starts a server on default and custom ports.
   • GET /version responds with the same output as the --version flag.
   • POST /digest with a sample payload invokes digestLambdaHandler and returns expected structure.
   • POST /agent with a sample prompt invokes the OpenAI API mock and returns parsed JSON.
   • GET /metrics returns correct callCount and uptime values, and resets callCount when globalThis.callCount is reinitialized.
   • Server returns HTTP 500 when handlers throw errors and logError is called.
4. Update sandbox/README.md to document the --serve flag, optional --port argument, and REST endpoints with curl examples and sample responses for each endpoint including /metrics.

# Implementation
Modify src/lib/main.js to implement processServe with the metrics endpoint, update tests/unit/main.test.js to cover metrics behavior, and update sandbox/README.md with usage and examples.

# Verification & Acceptance
CI passes all existing and new tests without failures. Manually start the server with node src/lib/main.js --serve --port 4000 and verify endpoints respond correctly, including metrics reflecting callCount and uptime.