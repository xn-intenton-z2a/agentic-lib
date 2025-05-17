# Objective & Scope
Extend the library’s core event handling capabilities to include a lightweight HTTP API interface alongside existing CLI support. Provide a consistent foundation for SQS event simulation, discussion statistics retrieval, and HTTP endpoints for integration within automated workflows and local development.

# Value Proposition
- Simplify integration into CI/CD pipelines and GitHub workflow_call events via HTTP endpoints.
- Maintain existing CLI workflows for local debugging and ad-hoc analysis.
- Enable HTTP-based event replay and discussion metrics retrieval for external tools or orchestrators.
- Ensure consistent JSON logging across CLI, Lambda handler, and HTTP server for observability.

# Success Criteria & Requirements

## Event Handler
- createSQSEventFromDigest: generate a valid AWS SQS Records array from a digest object.
- digestLambdaHandler: process SQS event records, parse JSON bodies, log info, collect and return batchItemFailures.

## GitHub Discussion Statistics
- fetchDiscussionComments(input): retrieve all comments via GitHub API using configured base URL and authentication token.
- analyzeDiscussionStatistics(comments): compute total comment count, unique author count, average comment length, optional sentiment summary via OpenAI API.

## CLI Commands
- --help: display usage instructions and exit.
- --version: output package version and timestamp as JSON.
- --digest: simulate an SQS digest event and dispatch to digestLambdaHandler.
- --stats <discussion-url|id>: fetch and compute discussion metrics, output structured JSON.

## HTTP API Endpoints
- POST /digest
  * Accept JSON body as digest object, convert to SQS event via createSQSEventFromDigest, invoke digestLambdaHandler, respond with batchItemFailures and handler identifier.
- POST /stats
  * Accept JSON body with discussionUrl or id, run fetchDiscussionComments and analyzeDiscussionStatistics, respond with metrics JSON.
- GET /health
  * Return a simple JSON payload with service name and uptime.

# Testability & Stability
- Unit tests for HTTP handlers, ensuring valid responses, error handling for invalid payloads, network failures, and missing parameters.
- Integration tests for HTTP endpoints using built-in http module or supertest mocks to validate JSON responses and status codes.
- Retain and extend existing unit and integration tests for CLI, event handler, and discussion utilities.

# Dependencies & Constraints
- Node 20 and ESM module standard.
- Use built-in http module; no new external dependencies required.
- HTTP server entrypoint integrated into src/lib/main.js, toggled by flag or environment variable (e.g., HTTP_PORT).
- Configurable via environment variables: HTTP_PORT, GITHUB_API_BASE_URL, OPENAI_API_KEY.

# User Scenarios & Examples
- Run HTTP server: HTTP_PORT=3000 node src/lib/main.js --serve
- Replay SQS digest via HTTP: POST http://localhost:3000/digest with JSON body { key: "events/1.json", value: "12345", lastModified: "..." }
- Retrieve discussion stats via HTTP: POST http://localhost:3000/stats with JSON body { discussionUrl: "https://github.com/.../discussions/456" }

# Verification & Acceptance
- npm test passes all existing and new tests, covering CLI, HTTP endpoints, event handlers, and statistics utilities.
- HTTP endpoints respond with correct status codes (200 for success, 400 for invalid input, 500 for server errors) and JSON payloads matching defined schemas.
- No unhandled exceptions or process crashes during CLI or HTTP invocation.
