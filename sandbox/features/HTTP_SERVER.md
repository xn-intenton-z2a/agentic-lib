# HTTP Server

Adds HTTP API server mode to the sandbox CLI, enabling remote workflow invocation, health monitoring, and metrics reporting. The server activates when invoked with --serve or HTTP_MODE=server and listens on a configurable port.

# Endpoints

## GET /health
Responds with HTTP 200 and JSON { status: 'ok' }.

## POST /execute
Accepts a JSON body containing command and args. Validates that the command matches one of the supported CLI flags. Invokes the existing CLI process function for the command, captures its JSON logs and exit code, and returns HTTP 200 with success and output fields when the exit code is 0, or HTTP 500 with error details and logs when the exit code is non-zero.

## GET /metrics
Responds with HTTP 200 and JSON { uptime, totalRequests, successCount, failureCount }. Maintains in-memory counters for all /health and /execute requests, classifying responses by status code.

# Implementation

Implement a new processServe function in sandbox/source/main.js that:
- Detects --serve flag or HTTP_MODE=server environment variable.
- Uses Node built-in http module to create a server listening on --port or PORT (default 3000).
- Applies CORS header for all responses.
- Routes requests to /health, /execute, and /metrics as specified.
- Parses JSON request bodies and handles errors gracefully.
- Integrates existing CLI flag handlers without exiting the process.
- Increments request counters and computes uptime.

Add unit tests in sandbox/tests/serve-api.test.js to verify each endpoint’s behavior, CORS support, and counter updates.

Update sandbox/README.md and sandbox/docs/USAGE.md to document the --serve flag and HTTP endpoints.