# Overview

The HTTP API feature exposes an Express server that allows clients to invoke agentic-lib functions via HTTP, enabling local testing and integration with external services.

# Endpoints

GET /health
Return a 200 OK with JSON containing { status: 'ok' }.

GET /version
Return version and timestamp JSON from package.json.

POST /digest
Accept a JSON body matching the AWS SQS event schema, invoke digestLambdaHandler, and return a JSON response with batchItemFailures and handler.

# Configuration

PORT
Environment variable or CLI flag --port to configure the server port (default: 3000).

--serve-api
CLI flag to start the HTTP server instead of default CLI behavior.

# Usage Examples

To start the server:
    node src/lib/main.js --serve-api --port 3000

Health check:
    curl http://localhost:3000/health

Version:
    curl http://localhost:3000/version

Submit digest event:
    curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{ JSON SQS event }'

# Success Criteria & Requirements

- Express server starts and listens on the configured port.
- Health endpoint returns status ok.
- Version endpoint returns valid version and timestamp.
- digest endpoint invokes digestLambdaHandler and returns expected JSON response.
- Existing logging and error handling behavior is maintained for HTTP requests.

# Testing

- Add supertest based tests to verify each endpoint for success and error scenarios.
- Ensure invalid JSON payloads to /digest return a 400 status with error details.
- Verify that health and version endpoints respond correctly under test conditions.
