# Mission Alignment

Unify environment configuration, structured logging, AWS SQS utilities, CLI interface, HTTP server endpoints (including health, readiness probe, and latency histogram), GitHub API integration, and OpenAI-driven automation into a single cohesive core feature that powers autonomous, continuous agentic workflows.

# Configuration

Load and validate environment variables via dotenv and Zod. Expose a config object with:

- GITHUB_API_BASE_URL (defaults to GitHub’s public API or a test base URL in development)
- GITHUB_TOKEN (required for GitHub integration)
- OPENAI_API_KEY (required for AI-driven operations)
- PORT (default 3000)
- CORS_ALLOWED_ORIGINS (default "*")
- RATE_LIMIT_REQUESTS (requests per minute per IP, default 60)
- METRICS_USER, METRICS_PASS (optional Basic Auth for metrics endpoint)
- DOCS_USER, DOCS_PASS (optional Basic Auth for docs endpoint)

Ensure sensible defaults and proper Zod validation in test and development modes.

# Logging Helpers

Provide logInfo and logError functions that emit structured JSON logs containing:

- level
- timestamp
- message
- optional error details and stack when verbose mode is enabled

# AWS Utilities

Implement createSQSEventFromDigest to wrap a digest object into an AWS SQS event shape and digestLambdaHandler to:

- iterate and parse SQS records
- log successes and detailed failures
- return batchItemFailures for invalid records

# CLI Interface

Support the following flags on the CLI tool (src/lib/main.js) via process arguments:

- --help: display usage instructions
- --version: read and output version from package.json along with a timestamp
- --digest: simulate an SQS event with an example digest and invoke digestLambdaHandler
- --generate-issue: use OpenAI API to generate a sample GitHub issue description from example context and output JSON
- --summarize-pr: use OpenAI API to produce a summary of a sample pull request diff and output JSON

# HTTP Server

Extend startServer to launch an HTTP server with the following endpoints:

- GET /health  
  Liveness probe returning JSON with status "ok", uptime, and timestamp.
- GET /ready  
  Readiness probe returning JSON with status "ready" and timestamp.
- GET /metrics  
  Prometheus metrics in text format for http_requests_total, http_request_failures_total, and http_request_duration_seconds histogram. Protected by Basic Auth if METRICS_USER/METRICS_PASS are set.
- GET /openapi.json  
  Returns the OpenAPI 3.0 schema for all endpoints.
- GET /docs  
  Renders the OpenAPI schema as interactive HTML via Markdown. Protected by Basic Auth if DOCS_USER/DOCS_PASS are set.

Implement IP-based token bucket rate limiting per IP, handle CORS, record metrics for each request and failure, and measure request duration to populate a latency histogram.

# GitHub Integration

Use the @octokit/rest library to initialize a GitHub API client with GITHUB_TOKEN and GITHUB_API_BASE_URL. Export utility functions:

- createIssue
- commentOnIssue
- createBranch
- mergePullRequest
- listOpenPullRequests

Log errors with logError and rethrow for upstream handling.

# OpenAI Integration

Use the openai library to initialize a ChatCompletion client with OPENAI_API_KEY. Export utility functions:

- generateChatCompletion: invoke the ChatCompletion API with a prompt and options, return structured response.
- generateIssueDescription: accept a title and context object, construct a prompt, call generateChatCompletion, and return a detailed issue body.
- refineIssueDescription: accept an existing issue draft, call generateChatCompletion to refine clarity and formatting.
- summarizePullRequest: accept a diff or PR details, call generateChatCompletion to produce a concise summary.

Handle API errors with logError, support configurable request retries, and include tests mocking openai responses.

# Testing and Success Criteria

Add unit and integration tests to cover:

- Configuration loading and validation
- Structured logging output and error cases
- AWS utilities and SQS simulation
- CLI flags behavior including new --generate-issue and --summarize-pr
- HTTP endpoints (/health, /ready, /metrics, /openapi.json, /docs), including authentication, rate limiting, and histogram population
- GitHub integration utilities with mocked Octokit responses
- OpenAI integration utilities with mocked openai responses for generateChatCompletion, generateIssueDescription, refineIssueDescription, and summarizePullRequest

Verify metrics counters and latency histogram are incremented correctly in each scenario and AI functions return expected structured outputs.

# Documentation Updates

- Update sandbox/docs/SERVER.md to document the /ready endpoint and request duration histogram
- Refresh sandbox/docs/SQS_OVERVIEW.md for AWS utilities
- Create or update sandbox/docs/GITHUB_API_INTEGRATION.md with usage examples for GitHub utilities
- Create sandbox/docs/OPENAI_INTEGRATION.md detailing OpenAI integration functions and CLI flags
- Update sandbox/README.md under Key Features to include AI integration and new CLI capabilities