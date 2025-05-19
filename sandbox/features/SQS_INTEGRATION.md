# Objective

Expand the library and CLI to fully integrate with AWS SQS end to end and add a lightweight HTTP API server exposing REST endpoints to send digests to SQS and trigger the digest handler locally

# Value Proposition

Provide a unified interface for SQS message operations via both CLI and HTTP, simplifying integration and testing and eliminating boilerplate script work

# Requirements

1 Dependencies
   - Add or update dependency on @aws-sdk/client-sqs in package json
   - Add express to dependencies in package json

2 SQS Functions
   - sendMessageToQueue(digest : object) reads QUEUE_URL environment variable constructs a SendMessageCommand with the JSON digest and sends the message returning the command result
   - createSQSEventFromDigest(digest) returns a valid SQS event record wrapping the digest in Records array
   - digestLambdaHandler(sqsEvent) logs the incoming event parses JSON bodies collects batchItemFailures and returns the list with handler identifier

3 HTTP Server
   - Implement startHttpServer(port : number) that creates an express app with JSON body parsing
   - Add endpoint POST /send queue that accepts a JSON digest body calls sendMessageToQueue and responds with message id and status or error with status code 400 or 500
   - Add endpoint POST /digest that accepts a JSON digest body creates an SQS event via createSQSEventFromDigest calls digestLambdaHandler and responds with batch item failures list and status 200
   - On server start log an info message with the listening port

4 CLI Enhancements
   - Add the flag serve [port] to start the HTTP server on the specified port defaulting to 3000
   - Update usage instructions to include serve flag details

5 Tests
   - Write sandbox tests for HTTP endpoints mocking sendMessageToQueue to verify success and error paths for POST /send queue
   - Test POST /digest endpoint returns correct batch item failures for valid and invalid JSON payloads
   - Ensure existing unit tests for sendMessageToQueue createSQSEventFromDigest digestLambdaHandler and CLI flags continue to pass

6 Documentation
   - Update sandbox README to document startHttpServer API and HTTP endpoints with example curl commands
   - Add CLI usage section for serve flag with examples

# User Scenarios and Examples

As a CI workflow post a JSON digest to localhost colon 3000 slash send queue and receive confirmation with message id
As a developer run npm start with serve 8080 to start the server and send digests via HTTP
As a tester post an invalid JSON body to slash digest and verify batch item failures in the response

# Verification and Acceptance

All tests pass with coverage for new code paths
POST slash send queue uses correct queue URL and payload responding with status 200 and message details or status 4xx or 5xx on errors
POST slash digest returns a JSON response with batch item failures and status 200
CLI serve flag starts the server logs the listening port and handles stop signals gracefully
Sandbox README examples execute successfully against a live HTTP server
Linting formatting and dependency installation succeed without errors