# Value Proposition
Extend the existing sandbox CLI to operate as an HTTP server for programmatic integration, including a new metrics endpoint for runtime monitoring and observability.

# Success Criteria & Requirements
- Support a new --serve <port> flag to launch a built-in HTTP server on the specified port (default 3000).
- Expose the following endpoints:
  - GET /health: perform connectivity checks against the GitHub API and OpenAI key endpoint, returning a structured JSON array of check results.
  - POST /digest: accept a JSON body representing a digest payload, wrap it into an SQS event, invoke digestLambdaHandler, and return a JSON response containing batchItemFailures.
  - POST /replay: accept a JSON body with { bucket: string, prefix?: string, batchSize?: number }, list objects from the specified S3 bucket via s3-sqs-bridge, chunk them according to batchSize (default 10), invoke or plan digestLambdaHandler for each batch, and return a summary JSON including total objects, total batches, successes, and failures.
  - GET /metrics: expose Prometheus-compatible metrics in plain text format, including uptime, totalDigestsReceived, totalBatchesProcessed, totalBatchFailures, and HTTP request counts per route.
- Handle graceful shutdown on SIGINT and SIGTERM, closing the HTTP server and reporting uptime if VERBOSE_STATS is enabled.
- Honor existing global flags VERBOSE_MODE and VERBOSE_STATS in HTTP responses and logs.

# Testing & Verification
- Unit tests for HTTP server startup and route handling using vitest and Node’s http module mocks.
- Test GET /health returns a JSON array matching the CLI --health output for both success and simulated failure scenarios.
- Test POST /digest with valid and invalid payloads to verify batchItemFailures and HTTP status codes.
- Test POST /replay by mocking s3-sqs-bridge list behavior and digestLambdaHandler, verifying summary output and error handling.
- Test GET /metrics returns correctly formatted metrics text, including expected metric names and sample values under different load scenarios.
- Verify that --serve flag preempts CLI-only commands and that help, version, and mission flags are still supported when not running as a server.

# Dependencies & Constraints
- Use only built-in Node http module; no new external dependencies.
- Reuse existing modules: fs/promises, s3-sqs-bridge, logging helpers, zod, dotenv.
- Maintain compatibility with Node 20 ESM and the vitest testing framework.
- No new files should be created; update sandbox/source/main.js, sandbox/tests/main.http.test.js, sandbox/README.md, and package.json scripts if necessary.

# User Scenarios & Examples
## Run HTTP Server with Metrics
node sandbox/source/main.js --serve 8080

## Invoke Metrics Endpoint
curl http://localhost:8080/metrics