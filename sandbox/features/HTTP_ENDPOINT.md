# HTTP Endpoint Feature

# Description
Provide an integrated HTTP server that exposes the existing digestLambdaHandler as a RESTful endpoint. Users can send POST requests to trigger the same processing logic used in the CLI and AWS Lambda contexts.

# Value Proposition
Deliver a direct HTTP API to invoke digest logic without requiring AWS infrastructure or CLI commands. Simplifies local development, testing, and integration with external services.

# Success Criteria & Requirements
- Launch an HTTP server when invoked with the --serve flag.
- Default to port 3000 or honor the PORT environment variable.
- Accept POST requests at the /digest endpoint with a JSON body matching the SQS event schema.
- Return HTTP 200 with a JSON body listing any batchItemFailures.
- Graceful shutdown on SIGINT or SIGTERM.

# API Specification
Endpoint: POST /digest
Request Body: JSON object with either Records array or single event record. Matches SQS event format.
Response:
  status: 200
  body: { batchItemFailures: Array }

# CLI Integration
Extend main() to process a new --serve flag:
  node src/lib/main.js --serve [--port <number>]
When --serve is present, start HTTP server instead of running CLI commands.

# Verification & Acceptance
- Unit tests simulate POST /digest requests and validate JSON responses.
- Tests cover valid and invalid JSON payloads and error handling.
- Manual test using curl or HTTP client to verify behavior.
