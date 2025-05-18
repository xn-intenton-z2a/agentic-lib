# Mission Alignment

Unify environment configuration, structured logging, AWS SQS utilities, CLI interface, HTTP server observability endpoints, GitHub API utilities, OpenAI-driven automation, and OpenAI usage metrics into a cohesive core feature that powers autonomous, continuous agentic workflows within a single Node.js library.

# Configuration

Load and validate environment variables via dotenv and Zod. Expose a config object with:

- GITHUB_API_BASE_URL (optional base URL, defaults to GitHub public API)
- GITHUB_TOKEN (required for GitHub API calls)
- OPENAI_API_KEY (required for AI-driven operations)
- PORT (default 3000)
- CORS_ALLOWED_ORIGINS (default "*")
- RATE_LIMIT_REQUESTS (requests per minute per IP, default 60)
- METRICS_USER, METRICS_PASS (optional Basic Auth for metrics endpoint)
- DOCS_USER, DOCS_PASS (optional Basic Auth for docs endpoint)

Validate all variables with Zod, support sensible defaults in development and test modes.

# Logging Helpers

Export logInfo and logError functions emitting structured JSON logs with:

- level
- timestamp
- message
- optional error details and stack when verbose mode enabled

Ensure logs are consistent and easily parsable.

# AWS Utilities

Implement createSQSEventFromDigest to wrap a digest object into AWS SQS event format, and digestLambdaHandler to:

- iterate and parse SQS Records
- log successes and detailed failures
- collect batchItemFailures for invalid records
- return an object with batchItemFailures and handler metadata

# CLI Interface

Enhance CLI in main.js to support:

- --help: display usage instructions
- --version: print library version and timestamp
- --digest: simulate SQS digest event via createSQSEventFromDigest
- --generate-issue: call generateIssueDescription with sample context and output JSON
- --summarize-pr: call summarizePullRequest with sample diff and output JSON

Ensure flags return structured JSON and handle errors via logError.

# HTTP Server

Export startServer to launch an HTTP server with endpoints:

- GET /health: liveness probe returning { status, uptime, timestamp }
- GET /ready: readiness probe returning { status: "ready", timestamp }
- GET /metrics: Prometheus metrics for http_requests_total, http_request_failures_total; Basic Auth protected if configured
- GET /openapi.json: OpenAPI 3.0 schema for all endpoints
- GET /docs: interactive HTML docs rendered via Markdown; Basic Auth protected if configured
- GET /openai-usage: Prometheus metrics for OpenAI usage, including openai_requests_total, openai_request_failures_total, openai_tokens_consumed_total; Basic Auth protected if configured

Implement IP-based token bucket rate limiting, CORS handling, metrics recording, latency histogram measurement, and new OpenAI usage instrumentation.

# GitHub Integration

Use @octokit/rest to initialize a GitHub client. Export functions:

- createIssue(title, body)
- commentOnIssue(issueNumber, comment)
- createBranch(branchName, fromRef)
- mergePullRequest(prNumber, options)
- listOpenPullRequests()

Handle API errors with logError and rethrow. Include unit tests mocking Octokit responses.

# OpenAI Integration

Use openai library to initialize ChatCompletion client. Export functions:

- generateChatCompletion(prompt, options)
- generateIssueDescription(title, context)
- refineIssueDescription(draft)
- summarizePullRequest(diff)

Implement retry logic on failures, log errors, return structured responses. Mock openai in tests for predictable behavior.

# OpenAI Usage Metrics

Instrument OpenAI integration to record:

- openai_requests_total labeled by endpoint and status
- openai_request_failures_total labeled by endpoint
- openai_tokens_consumed_total labeled by model and endpoint

Record metrics in memory and expose via GET /openai-usage. Ensure counters reset or persist according to process lifetime.

# Testing and Success Criteria

Add vitest tests to cover:

- configuration validation in all modes
- structured logging output
- AWS utilities and SQS simulation
- CLI flags including new AI and GitHub flags
- HTTP endpoints, authentication, rate limiting, histogram metrics, and openai usage metrics
- GitHub integration utilities with mocked Octokit
- OpenAI integration and usage metrics with mocked openai client

Verify all counters, histograms, and returned payloads meet expected structure and counts.

# Documentation Updates

- Update sandbox/docs/SERVER.md to include /ready endpoint, latency histogram details, and new /openai-usage endpoint documentation
- Refresh sandbox/docs/SQS_OVERVIEW.md for AWS utilities unchanged
- Update sandbox/docs/GITHUB_API_INTEGRATION.md with usage examples for GitHub utilities
- Update sandbox/docs/OPENAI_INTEGRATION.md detailing OpenAI functions, CLI flags, and usage metrics
- Update sandbox/README.md under Key Features to include OpenAI usage metrics endpoint and instrumentation