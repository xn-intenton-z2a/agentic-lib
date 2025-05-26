# HTTP API Endpoint

## Objective & Scope
Provide an HTTP server interface to receive digest events over a RESTful POST endpoint and invoke the existing digestLambdaHandler logic.

## Value Proposition
Allow external crawlers and orchestrators to push digest payloads directly via HTTP, simplifying integration without requiring raw AWS SQS event simulation. Enables lightweight deployments and rapid testing of ingestion flows.

## Success Criteria & Requirements
- Introduce an Express server listening on a port defined by environment variable PORT (default 3000).
- Define a POST endpoint at /digest that accepts JSON payloads matching the digest schema.
- Invoke digestLambdaHandler with the incoming payload wrapped in an SQS-style event record.
- Respond with HTTP 200 and JSON containing batchItemFailures array returned by digestLambdaHandler.
- Handle and log errors, responding with HTTP 400 for invalid JSON and HTTP 500 for internal failures.

## Testability & Verification
- Add supertest-based tests to sandbox/tests/main-api.test.js covering:
  - Successful POST /digest with valid digest payload returns HTTP 200 and expected batchItemFailures array.
  - POST /digest with invalid JSON returns HTTP 400 and error message.
  - Simulate digestLambdaHandler error to verify HTTP 500 response.

## Dependencies & Constraints
- Leverage existing express and supertest dev dependency. No new dependencies.
- Keep middleware and route definitions in src/lib/main.js alongside CLI logic.

## API Usage Examples
The server is started via npm run start. Example request:
  Use HTTP POST to http://localhost:3000/digest with JSON body { key, value, lastModified }.
  The response body will be JSON with field batchItemFailures.