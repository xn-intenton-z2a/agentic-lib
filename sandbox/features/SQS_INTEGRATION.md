# Objective

Expand the library and CLI to fully integrate with AWS SQS end-to-end and add a lightweight HTTP API server that exposes REST endpoints to send digests to SQS and trigger the digest handler locally. This enables developers to interact with the message lifecycle via both CLI and HTTP, simplifying integration and testing.

# Value Proposition

Provide a unified interface for SQS message operations and an HTTP API for easy programmatic and local interaction. The HTTP endpoints eliminate boilerplate and allow clients or workflows to enqueue and process digests without custom scripts or CLI invocations.

# Requirements

1. Dependencies
   - Add or update dependency on @aws-sdk/client-sqs in package.json.
   - Add express to dependencies in package.json.
2. SQS Functions
   - sendMessageToQueue(digest: object): unchanged implementation reading QUEUE_URL, constructing SendMessageCommand, sending message, and returning result.
   - createSQSEventFromDigest(digest): unchanged wrapper returning a valid SQS event record.
   - digestLambdaHandler(sqsEvent): unchanged handler logging events, parsing JSON bodies, collecting batchItemFailures, and returning failures list.
3. HTTP Server
   - In src/lib/main.js, import and configure express.
   - Implement and export async function startHttpServer(port: number):
     - Create an express app with JSON body parsing.
     - POST /send-queue: accept JSON body as digest, call sendMessageToQueue, and respond with { messageId, status } or error with HTTP 400/500.
     - POST /digest: accept JSON body as digest, wrap via createSQSEventFromDigest, call digestLambdaHandler, and respond with { batchItemFailures }.
     - On server start, log info with listening port.
4. CLI Enhancements
   - Add flag --serve [port]: start the HTTP server on the specified port (default 3000).
   - Update generateUsage() to include serve command.
5. Tests
   - Write sandbox/tests for HTTP endpoints:
     - Mock sendMessageToQueue to test POST /send-queue success and error paths.
     - Test POST /digest returns correct batchItemFailures for valid and invalid JSON payloads.
   - Ensure existing unit tests for sendMessageToQueue, createSQSEventFromDigest, digestLambdaHandler, and CLI flags continue to pass.
6. Documentation
   - Update sandbox/README.md:
     - Document startHttpServer API and HTTP endpoints with example curl commands.
     - Add CLI usage section for --serve with examples.

# User Scenarios and Examples

- As a CI workflow, POST a JSON digest to http://localhost:3000/send-queue and receive confirmation with messageId.
- As a developer, run npm start -- --serve 8080 to start the server and send digests via HTTP.
- As a tester, POST an invalid JSON body to /digest and verify batchItemFailures in the response.

# Verification & Acceptance

1. All unit tests and HTTP endpoint tests pass with coverage for new code paths.
2. POST /send-queue uses correct QueueUrl and payload, responding with a 200 status and message details or 4xx/5xx on errors.
3. POST /digest returns a JSON response with batchItemFailures and HTTP 200.
4. CLI flag --serve starts the server, logs the listening port, and handles stop signals gracefully.
5. sandbox/README.md examples execute successfully against the live HTTP server.
6. Linting, formatting, and dependency installation succeed without errors.