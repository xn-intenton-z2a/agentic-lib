# HTTP_SERVER
## Objective & Scope
Add a new CLI flag --serve to launch a lightweight HTTP server for receiving digest events via POST
requests. The server reuses existing digestLambdaHandler for processing.

## Value Proposition
Enable direct HTTP integration and local testing of digest workflows without requiring SQS or CLI flags.
Simplifies invocation from other systems and local debugging.

## Success Criteria & Requirements
- Accept a --serve flag in main that starts the HTTP server.
- Listen on port defined by HTTP_SERVER_PORT or default 3000.
- Expose POST /digest endpoint that accepts valid JSON and invokes digestLambdaHandler
- Respond with JSON containing batchItemFailures and handler name on success
- Return status 400 with error message on invalid JSON
- Log each request and any errors using logInfo and logError
- Handle SIGINT and SIGTERM for graceful shutdown

## Dependencies & Constraints
Use built in http module to avoid new dependencies. Compatible with Node 20 and ESM.
Should not interfere with existing CLI flags or tests.

## Verification & Acceptance
Provide unit tests that
- Start and stop the server programmatically
- Send valid JSON and assert the response matches expected batchItemFailures and handler name
- Send invalid JSON and assert a 400 response

Manual test example
curl -X POST http://localhost:3000/digest -d '{"key":"value"}' -H 'Content-Type: application/json'