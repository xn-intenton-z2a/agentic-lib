# Value Proposition

Extend the existing sandbox CLI to also operate as an HTTP server for programmatic integration. This empowers developers and automated systems to invoke digest handling, S3 replay, and health checks via HTTP endpoints alongside the interactive CLI.

# Success Criteria & Requirements

- Support a new --serve <port> flag to launch a built-in HTTP server on the specified port (default 3000).
- Expose the following endpoints:
  - GET /health: perform connectivity checks against the GitHub API and OpenAI key endpoint, returning a structured JSON array of check results.
  - POST /digest: accept a JSON body representing a digest payload, wrap it into an SQS event, invoke digestLambdaHandler, and return a JSON response containing batchItemFailures.
  - POST /replay: accept a JSON body with { bucket: string, prefix?: string, batchSize?: number }, list objects from the specified S3 bucket via s3-sqs-bridge, chunk them according to batchSize (default 10), invoke or plan digestLambdaHandler for each batch, and return a summary JSON including total objects, total batches, successes, and failures.
- Handle graceful shutdown on SIGINT and SIGTERM, closing the HTTP server and reporting uptime if VERBOSE_STATS is enabled.
- Honor existing global flags VERBOSE_MODE and VERBOSE_STATS in HTTP responses and logs.

# Testing & Verification

- Unit tests for HTTP server startup and route handling using vitest and Node’s http module mocks.
- Test GET /health returns a JSON array matching the CLI --health output format for both success and simulated failure scenarios.
- Test POST /digest with valid and invalid payloads to verify batchItemFailures and HTTP status codes.
- Test POST /replay by mocking s3-sqs-bridge list behavior and digestLambdaHandler, verifying summary output and error handling.
- Verify that --serve flag preempts CLI-only commands and that help, version, and mission flags are still supported when not running as a server.

# Dependencies & Constraints

- Use only built-in Node http module; no new external dependencies.
- Reuse existing modules: fs/promises, s3-sqs-bridge, logging helpers, zod, dotenv.
- Maintain compatibility with Node 20 ESM and the vitest testing framework.
- No new files should be created; update sandbox/source/main.js, sandbox/tests/main.http.test.js, sandbox/README.md, and package.json scripts if necessary.

# User Scenarios & Examples

## Run HTTP Server

node sandbox/source/main.js --serve 8080

## Invoke Health Endpoint

curl http://localhost:8080/health

## Send Digest via HTTP

curl -X POST http://localhost:8080/digest -H 'Content-Type: application/json' -d '{"key":"events/1.json","value":"12345","lastModified":"2023-01-01T00:00:00.000Z"}'

## Replay S3 Bucket via HTTP

curl -X POST http://localhost:8080/replay -H 'Content-Type: application/json' -d '{"bucket":"my-bucket","prefix":"events/","batchSize":5}'