# HTTP Server Feature Expansion

## Mission Alignment

The HTTP Server feature provides critical self-hosted observability and diagnostics endpoints to support continuous monitoring and autonomous agentic workflows. By extending rate-limiting capabilities to include standard rate-limit headers, clients gain transparency into usage limits and remaining capacity, enabling better resilience and adaptive behavior in distributed environments.

## Feature Overview

The HTTP Server exposes the following core endpoints over HTTP, all supporting CORS and Basic Auth where configured, with integrated rate-limit headers:

- **GET /health**
  Returns JSON with service status, uptime, and timestamp. Responses include headers X-RateLimit-Limit and X-RateLimit-Remaining.

- **GET /metrics**
  Prometheus-compatible metrics for request counts and failure counts, protected by Basic Auth if configured. Responses include rate-limit headers.

- **GET /openapi.json**
  Serves the OpenAPI 3.0 schema describing all available endpoints. Responses include rate-limit headers.

- **GET /docs**
  Renders the OpenAPI schema as interactive HTML via Markdown, protected by Basic Auth if configured. Responses include rate-limit headers.

- **GET /config**
  Returns JSON containing the effective runtime configuration. Protected by Basic Auth if configured. Responses include rate-limit headers.

- **GET /version**
  Returns JSON with service version and build timestamp. Protected by Basic Auth if configured. Responses include rate-limit headers.

## Configuration

Environment variables:

- `PORT` (default 3000)
- `CORS_ALLOWED_ORIGINS` (default `*`)
- `RATE_LIMIT_REQUESTS` (requests per minute per IP, default 60)
- `RATE_LIMIT_HEADERS_ENABLED` (boolean, include rate-limit headers in all responses, default true)
- `METRICS_USER`, `METRICS_PASS`
- `DOCS_USER`, `DOCS_PASS`
- `CONFIG_USER`, `CONFIG_PASS`
- `VERSION_USER`, `VERSION_PASS`
- `VERSION` (service version, fallback to package.json)
- `BUILD_TIMESTAMP` (build timestamp, fallback to current UTC timestamp)

## Success Criteria & Acceptance

- All responses include `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers reflecting the configured limit and remaining tokens for the client IP.
- Rate-limit behavior remains unchanged (429 status when exceeded).
- Existing endpoints continue to function with unchanged behavior, including Basic Auth enforcement and response payloads.
- Rate-limit headers appear in OpenAPI schema and interactive docs.

## Testability & Stability

- Add Vitest coverage in sandbox/tests/server.test.js to verify:
  - Presence and correctness of rate-limit headers on all endpoints under normal and authenticated scenarios.
  - Rate-limit exhaustion scenarios still return 429 without headers or with zero remaining.
  - Existing tests for health, metrics, openapi.json, docs, config, and version continue to pass.
- Fail-safe error handling with headers included on error responses where appropriate.