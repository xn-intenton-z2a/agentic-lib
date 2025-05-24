# Overview
Add an HTTP server module to expose core functionality via REST endpoints. Leverage the existing express dependency and integrate with digestLambdaHandler to allow event processing over HTTP while enforcing optional authentication.

# Security & Authentication
If the environment variable HTTP_API_TOKEN is set the server must require an Authorization header with value Bearer <token>. Requests missing or with an incorrect token receive HTTP 401. If HTTP_API_TOKEN is not configured authentication is disabled.

# API Endpoints
1. GET /health
   - Returns HTTP 200 with payload { status: ok } to confirm the server is running.

2. POST /events
   - Protected by authentication when enabled
   - Accepts JSON body representing an SQS event or a single record
   - Invokes digestLambdaHandler with the parsed event payload
   - Returns HTTP 200 with a JSON payload including batchItemFailures and handler identification
   - Returns HTTP 400 on malformed JSON

# CLI Integration
- Introduce a new flag --serve in the main CLI
- When --serve is supplied, start the express server on the port specified by HTTP_PORT or default to 3000
- Log server start information via logInfo
- Enforce authentication behavior based on HTTP_API_TOKEN

# Tests
- Verify that GET /health returns 200 with the correct payload
- Verify that POST /events with a valid token returns 200 and the expected structure
- Verify that POST /events without a token when authentication is enabled returns 401
- Verify that POST /events with malformed JSON returns 400

# Success Criteria
- Running node sandbox/source/main.js --serve starts the HTTP server on the correct port
- HTTP_API_TOKEN enforcement works as specified
- Endpoints behave correctly and integrate with the existing handler logic
- All new routes and behaviors are covered by automated tests and pass under npm test