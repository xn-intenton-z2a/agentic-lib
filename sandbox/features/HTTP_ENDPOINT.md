# HTTP API Server

## Objective & Scope
Provide an HTTP API using Express that wraps the existing digestLambdaHandler logic. The server will expose a POST endpoint at `/digest` that accepts a JSON payload representing a digest, transforms it into an SQS event, and invokes the digest handler. The implementation will live in `src/lib/main.js`, and related tests and README updates will be added.

## Value Proposition
This feature allows users to run the digest processing logic behind an accessible HTTP endpoint, making it easy to integrate with webhooks, local testing, or microservice environments. It fulfills the mission to enable autonomous workflows by exposing behavior as a reusable API.

## Requirements & Success Criteria
1. Express must be added as a dependency and an HTTP server instantiated in `main.js` under a new function `startHttpServer(port)`.
2. The server listens for POST requests at `/digest`, validates that the request body is a JSON object, and responds with 200 on success or 400 on invalid input.
3. On receiving a valid digest payload, the server calls `createSQSEventFromDigest` and `digestLambdaHandler`, then returns the handler result as JSON.
4. Include tests in `sandbox/tests/http-endpoint.test.js` covering:
   - Successful POST with valid digest returns expected batchItemFailures.
   - Malformed JSON payload returns 400 error.
5. Document the new endpoint in `sandbox/README.md` under a new HTTP API Usage section, including example curl commands.
6. Ensure code style and existing tests (`tests/unit/main.test.js`) continue to pass and that new tests are included in the test script.

## User Scenarios & Examples
- A local developer can run `node src/lib/main.js --start-server 3000`, then POST `{"key":"events/1.json","value":"12345"}` to `http://localhost:3000/digest` to trigger digest processing.
- A GitHub Actions workflow can invoke this endpoint on a self-hosted runner to simulate SQS events without AWS.

## Verification & Acceptance
- Unit and integration tests pass with coverage above 90% for the new code paths.
- Manual test: start the server, send valid and invalid requests, and observe correct HTTP status codes and logs.
- Code conforms to ESLint and Prettier standards.
