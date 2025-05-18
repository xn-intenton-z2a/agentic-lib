# Mission Alignment

Unify environment configuration, structured logging, AWS SQS utilities, CLI interface, HTTP server endpoints, and GitHub API integration into a cohesive core feature that powers autonomous, continuous agentic workflows.

# Configuration

Load environment variables via dotenv with Zod validation. Expose a config object with the following keys:
- GITHUB_API_BASE_URL (default to GitHub’s public API or test URL in development)
- GITHUB_TOKEN (GitHub personal access token for API calls, required for GitHub Integration)
- OPENAI_API_KEY (for future AI-driven operations)
Ensure sensible defaults are set for test and development modes.

# Logging Helpers

Provide logInfo and logError functions for structured JSON logs. Include level, timestamp, message, and optional error details or verbose data when enabled.

# AWS Utilities

Offer createSQSEventFromDigest to wrap a digest object into an AWS SQS event shape. Provide digestLambdaHandler to process SQS records, parse payloads, log successes and errors, and return batchItemFailures for failed messages.

# CLI Interface

Implement flags:
- help: prints usage instructions.
- version: reads package.json version and outputs version and timestamp.
- digest: simulates an SQS event with an example digest and invokes digestLambdaHandler.

# HTTP Server

Expose startServer that launches an HTTP server with endpoints:
- GET /health for liveness checks.
- GET /metrics for Prometheus metrics with optional Basic Auth.
- GET /openapi.json for OpenAPI schema.
- GET /docs for interactive HTML docs with optional Basic Auth.
Apply IP-based rate limiting, CORS handling, and record metrics http_requests_total and http_request_failures_total.

# GitHub Integration

Use the @octokit/rest library to provide GitHub API client functionality. Initialize the Octokit client with GITHUB_TOKEN and GITHUB_API_BASE_URL. Export utility functions:
- createIssue({owner, repo, title, body}): create a new issue in the specified repository.
- commentOnIssue({owner, repo, issueNumber, comment}): add a comment to an existing issue.
- createBranch({owner, repo, branchName, fromBranch}): create a new branch from an existing branch.
- mergePullRequest({owner, repo, pullNumber}): merge an open pull request.
- listOpenPullRequests({owner, repo}): retrieve open pull requests for monitoring workflows.
Ensure errors are logged with logError and rethrown for caller handling.

# Testing and Success Criteria

Add unit tests covering:
- Configuration parsing including GitHub token and base URL validation.
- Logging output format.
- AWS utility functions and SQS simulation.
- CLI flags retaining existing behavior.
- HTTP endpoints with authentication failure and rate limiting.
- GitHub Integration utilities using mocked Octokit responses.
Verify that metrics counters increment appropriately and existing tests continue to pass.

# Documentation Updates

Update sandbox/docs/SERVER.md to reflect HTTP server behavior and configuration. Update sandbox/docs/SQS_OVERVIEW.md for AWS utilities. Create sandbox/docs/GITHUB_API_INTEGRATION.md describing GitHub utilities with usage examples. Refresh sandbox/README.md Key Features to list environment configuration, logging helpers, AWS utilities, CLI interface, HTTP server endpoints, and GitHub Integration.