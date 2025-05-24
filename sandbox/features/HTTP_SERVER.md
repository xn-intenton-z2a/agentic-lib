# Overview
Add an HTTP server module to expose core functionality via REST endpoints. Leverage the existing express dependency and integrate with digestLambdaHandler to allow event processing over HTTP.

# API Endpoints

1. GET /health
   - Returns HTTP 200 with JSON payload { status: "ok" } to confirm server is running.

2. POST /events
   - Accepts a JSON body representing an SQS event or a single record.
   - Invokes digestLambdaHandler with the parsed event payload.
   - Returns HTTP 200 with JSON payload from digestLambdaHandler, including any batchItemFailures and handler identification.

# CLI Integration

- Introduce a new flag `--serve` in main CLI.
- When `--serve` is supplied, start the express server on port specified by `HTTP_PORT` environment variable or default to 3000.
- Ensure process remains alive and logs server start information via logInfo.

# Tests

- Create tests using supertest in sandbox/tests/http.server.test.js.
- Test that GET /health returns 200 and correct JSON.
- Test that POST /events with valid payload triggers digestLambdaHandler and returns expected structure.
- Simulate a malformed JSON body and verify a 400 Bad Request response.

# Success Criteria

- Running `node sandbox/source/main.js --serve` starts the HTTP server on the correct port.
- Endpoints behave as specified and integrate with existing handler logic.
- All new routes and behaviors are covered by automated tests and pass under `npm test`.