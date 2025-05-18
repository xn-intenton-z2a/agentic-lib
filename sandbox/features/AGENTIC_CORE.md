# Mission Alignment

Unify environment configuration, structured logging, AWS SQS utilities, CLI interface, and HTTP server endpoints into a cohesive core feature that powers autonomous, continuous agentic workflows.

# Configuration

Load environment variables via dotenv with Zod validation. Expose a config object with GITHUB_API_BASE_URL and OPENAI_API_KEY. Ensure defaults are set for test and development modes.

# Logging Helpers

Provide logInfo and logError functions for structured JSON logs. Include level, timestamp, message, error details, and optional verbose data when enabled.

# AWS Utilities

Offer createSQSEventFromDigest to wrap a digest object into an AWS SQS event shape. Provide digestLambdaHandler to process SQS records, parse payloads, log successes and errors, and return batchItemFailures for failed messages.

# CLI Interface

Implement flags help, version, and digest. help prints usage instructions. version reads package.json version and outputs version and timestamp. digest simulates an SQS event with an example digest and invokes digestLambdaHandler.

# HTTP Server

Expose startServer that launches an HTTP server with endpoints:
- GET /health for liveness checks
- GET /metrics for Prometheus metrics with optional Basic Auth
- GET /openapi.json for OpenAPI schema
- GET /docs for interactive HTML docs with optional Basic Auth
Apply IP based rate limiting, CORS handling, and record metrics http_requests_total and http_request_failures_total.

# Testing and Success Criteria

Add unit tests covering configuration parsing, logging output, AWS utilities, CLI flags, HTTP endpoints, authentication failures, and rate limiting. Ensure existing server and main module tests continue to pass and metrics counters increment correctly.

# Documentation Updates

Update sandbox/docs/SERVER.md to reflect HTTP server behavior and configuration. Update sandbox/docs/SQS_OVERVIEW.md for AWS utilities. Refresh sandbox/README.md Key Features to list environment configuration, logging helpers, AWS utilities, CLI interface, and HTTP server endpoints.