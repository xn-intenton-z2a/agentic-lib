# Environment Configuration

Load environment variables from .env and runtime environment using dotenv. Validate required variables with Zod to ensure GITHUB_API_BASE_URL and OPENAI_API_KEY conform to expected formats. Expose a parsed config object for use by all components.

# Structured Logging

Export logConfig, logInfo, and logError functions to produce structured JSON logs. Each entry includes a timestamp, log level, message, and optional metadata. Support a verbose mode for additional context and stack traces.

# AWS Utilities & Lambda Handlers

Provide createSQSEventFromDigest(digest) to wrap a digest object into an SQS compatible event for testing. Implement digestLambdaHandler to process SQS records, parse JSON bodies, log successes and errors, and return batchItemFailures to enable AWS retry semantics. Instrument metrics counters for processed events and failure counts.

# CLI Interface

Extend the main CLI with flags:
- --help: display usage instructions
- --version: print library version and timestamp
- --digest: simulate SQS event processing with an example digest
Ensure structured logging, error handling, and optional verbose statistics for each command.

# HTTP Server Endpoints

Enhance startServer to expose:
- GET /health: liveness probe returning status, uptime, and timestamp
- GET /metrics: Prometheus formatted metrics including http_requests_total, http_request_failures_total, agentic_sqs_processed_total, and agentic_sqs_failures_total; protected by basic authentication when configured
- GET /openapi.json: serve the OpenAPI 3.0 schema
- GET /docs: render interactive HTML docs using Markdown; protected by basic authentication when configured
- POST /branches: create a branch given owner, repo, branchName, and optional baseRef; validate GITHUB_API_TOKEN, enforce rate limiting and CORS, respond with HTTP status 201 and JSON payload with keys owner, repo, branch
- POST /pulls: open a pull request given owner, repo, head, base, title, and body; validate GITHUB_API_TOKEN, enforce rate limiting, respond with HTTP status 201 and JSON payload containing pull request URL and number

Maintain existing endpoints unchanged, including authentication, rate limiting, and metrics recording.

# GitHub Issue Summarization & Branch/PR Management

Implement reusable functions in src/lib/main.js and wire them into the CLI and HTTP routes:
- summarizeIssues(owner, repo): fetch open issues, call OpenAI chat completions to generate concise summaries, and return structured JSON
- postIssueComment(owner, repo, issueNumber, summary): post a comment containing summary to the specified issue
- createBranch(owner, repo, branchName, baseRef?): create a branch reference via GitHub REST API and return the new branch name
- createPullRequest(owner, repo, head, base, title, body): open a pull request via GitHub REST API and return the API response

# SQS Processing Metrics Integration

Instrument the digestLambdaHandler to record metrics counters for total processed messages and failures. Expose these counters as agentic_sqs_processed_total and agentic_sqs_failures_total in the GET /metrics endpoint.

# Success Criteria & Testing

- All existing tests must pass without modification
- Add unit tests to verify SQS metrics counters in digestLambdaHandler success and failure paths
- Add HTTP server tests for GET /metrics covering presence of new metrics, authentication failures, rate limiting, validation errors, and successful responses
- Add CLI tests for new flags, verifying exit codes, JSON output, and error handling for invalid input

# Documentation & README Updates

- Update sandbox/README.md Key Features section to include SQS metrics integration
- Amend sandbox/docs/SERVER.md to document inclusion of agentic_sqs_processed_total and agentic_sqs_failures_total in /metrics output
- Ensure documentation examples reflect new metrics in output

# Dependencies & Constraints

- Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and package.json
- Introduce no new runtime dependencies; use existing libraries such as fetch, dotenv, zod, openai
- Maintain ESM compatibility, existing coding style, and alignment with the mission statement