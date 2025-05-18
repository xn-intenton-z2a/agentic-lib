# Objective
Extend the existing command-line interface to support a persistent HTTP server that exposes core handlers (digest, version, and agent) over REST endpoints, enabling easy local testing and integration with other services.

# Value Proposition
Running an HTTP server alongside the CLI unlocks lightweight local or containerized deployments, allows workflows or other systems to invoke library functions via HTTP, and accelerates iterative development and testing by avoiding CLI flags for every invocation.

# Requirements
1. Add a new function processServe(args) that:
   • Detects a --serve flag and an optional --port <number> argument (default port 3000).
   • Imports Node's http module and creates an HTTP server.
   • Defines endpoints:
     - GET /version: returns JSON with version and timestamp (reuse processVersion logic).
     - POST /digest: accepts a JSON payload, calls digestLambdaHandler, and responds with JSON { batchItemFailures, handler }.
     - POST /agent: accepts { prompt: string } in the body, invokes OpenAI chat completion (reuse processAgent logic), and sends parsed JSON response.
   • Increments globalThis.callCount on each incoming request.
   • Handles errors by returning HTTP 500 with JSON { error, message } using logError internally.
   • Listens on the specified port and logs a startup INFO log entry.
2. Extend main(args) to call processServe before other CLI handlers and return when server starts.
3. Add automated tests in tests/unit/main.test.js to verify:
   • processServe starts a server on the default and custom ports.
   • GET /version responds with the same JSON as --version flag.
   • POST /digest with a sample payload invokes digestLambdaHandler and returns expected structure.
   • POST /agent with sample prompt invokes OpenAI API mock and returns parsed JSON.
   • Server returns HTTP 500 when handlers throw errors, and logError is called.
4. Update sandbox/README.md:
   • Document the --serve flag, optional --port argument, and REST endpoints with examples (curl commands).
   • Show sample responses for each endpoint.

# Implementation
• Modify src/lib/main.js:
  • Import http from Node.
  • Implement processServe as described.
  • Integrate processServe into main() before existing flag processors.
  • Ensure globalThis.callCount increments for each request.
• Update tests/unit/main.test.js:
  • Use a testing HTTP client (e.g., fetch or axios) against a started server instance.
  • Mock handlers to produce predictable results.
• Update sandbox/README.md with the new server usage.

# Verification & Acceptance
• CI passes all existing and new tests without modification failures.
• Manually start the server: node src/lib/main.js --serve --port 4000; verify endpoints respond correctly.
• Ensure globalThis.callCount reflects the number of HTTP requests processed.