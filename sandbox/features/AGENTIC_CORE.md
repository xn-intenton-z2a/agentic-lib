# Mission Alignment

Unify environment configuration, structured logging, AWS SQS utilities, CLI interface, HTTP server endpoints (including a new readiness probe), and GitHub API integration into a cohesive core feature that powers autonomous, continuous agentic workflows.

# Configuration

Load environment variables via dotenv with Zod validation. Expose a config object with the following keys:
- GITHUB_API_BASE_URL (default to GitHub’s public API or a test URL in development)
- GITHUB_TOKEN (required for GitHub Integration)
- OPENAI_API_KEY (for future AI-driven operations)
- PORT (default 3000)
- CORS_ALLOWED_ORIGINS (default "*")
- RATE_LIMIT_REQUESTS (requests per minute per IP, default 60)
- METRICS_USER, METRICS_PASS (optional Basic Auth for metrics endpoint)
- DOCS_USER, DOCS_PASS (optional Basic Auth for docs endpoint)

Ensure sensible defaults and proper validation in test and development modes.

# Logging Helpers

Provide logInfo and logError functions for structured JSON logs. Include:
- level
- timestamp
- message
- optional error details and stack when verbose

# AWS Utilities

Offer createSQSEventFromDigest to wrap a digest object into an AWS SQS event shape. Provide digestLambdaHandler to:
- process SQS records
- parse payloads and log successes
- collect and return batchItemFailures for invalid records

# CLI Interface

Implement flags:
- --help: prints usage instructions
- --version: reads package.json version and outputs version and timestamp
- --digest: simulates an SQS event with an example digest and invokes digestLambdaHandler

# HTTP Server

Expose startServer that launches an HTTP server with these endpoints:

- GET /health
  Liveness probe returning JSON with status, uptime, and timestamp.
- GET /ready
  Readiness probe returning JSON with status "ready" and timestamp. Suitable for readiness checks in orchestration environments.
- GET /metrics
  Prometheus metrics in text format. Exposes http_requests_total and http_request_failures_total. Protected by Basic Auth if METRICS_USER and METRICS_PASS are set.
- GET /openapi.json
  Returns the OpenAPI 3.0 schema for all endpoints.
- GET /docs
  Renders the OpenAPI schema as interactive HTML via Markdown. Protected by Basic Auth if DOCS_USER and DOCS_PASS are set.

Apply IP-based token bucket rate limiting per IP. Handle CORS, record metrics for each request and failure, and introduce a request duration histogram for HTTP request latency.

# GitHub Integration

Use the @octokit/rest library to provide GitHub API client functionality. Initialize the client with GITHUB_TOKEN and GITHUB_API_BASE_URL. Export utility functions:
- createIssue
- commentOnIssue
- createBranch
- mergePullRequest
- listOpenPullRequests

Log errors with logError and rethrow for caller handling.

# Testing and Success Criteria

Add unit and integration tests covering:

- Environment configuration and validation
- Logging output and error logging behavior
- AWS utility functions and SQS simulation
- CLI flags behavior
- HTTP endpoints (/health, /ready, /metrics, /openapi.json, /docs) including authentication failures, rate limiting, and metrics recording
- GitHub integration utilities with mocked Octokit responses
- Verify metrics counters and latency histogram increment correctly

# Documentation Updates

- Update sandbox/docs/SERVER.md to document the /ready endpoint and latency metrics
- Refresh sandbox/docs/SQS_OVERVIEW.md for AWS utilities
- Create or update sandbox/docs/GITHUB_API_INTEGRATION.md with usage examples
- Update sandbox/README.md to include the readiness endpoint and latency histogram metrics under Key Features