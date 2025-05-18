# HTTP Server Feature Expansion

## Mission Alignment

The HTTP Server feature enables comprehensive self-hosted observability, configuration introspection, and documentation endpoints. By exposing a new `/config` endpoint alongside existing health, metrics, OpenAPI, and docs endpoints, users gain real-time insight into runtime settings. This enhancement furthers our mission of autonomous agentic workflows by enabling dynamic diagnostics and seamless integration with monitoring systems.

## Feature Overview

The HTTP Server now exposes five core endpoints over HTTP, supporting CORS and Basic Auth where configured:

- **GET /health**
  Returns JSON with service status, uptime, and timestamp.

- **GET /metrics**
  Prometheus-compatible metrics for request counts and failure counts, protected by Basic Auth if METRICS_USER/METRICS_PASS are set.

- **GET /openapi.json**
  Serves the OpenAPI 3.0 schema describing all available endpoints and methods.

- **GET /docs**
  Renders the OpenAPI schema as interactive HTML via Markdown, protected by Basic Auth if DOCS_USER/DOCS_PASS are set.

- **GET /config**
  Returns JSON containing the effective runtime configuration, including port, CORS origins, rate-limit settings, and enabled auth flags. Protected by Basic Auth if CONFIG_USER/CONFIG_PASS are set.

## Configuration

Environment variables:

- `PORT` (default 3000)
- `CORS_ALLOWED_ORIGINS` (default `*`)
- `RATE_LIMIT_REQUESTS` (requests per minute per IP, default 60)
- `METRICS_USER`, `METRICS_PASS` (Basic Auth credentials for `/metrics`)
- `DOCS_USER`, `DOCS_PASS` (Basic Auth credentials for `/docs`)
- `CONFIG_USER`, `CONFIG_PASS` (Basic Auth credentials for `/config`)

## Success Criteria & Acceptance

- All five endpoints respond with correct status codes and payloads.
- GET `/config` returns a JSON object reflecting active configuration keys and values.
- Basic Auth protects `/metrics`, `/docs`, and `/config` endpoints when credentials are set.
- Rate limiting returns 429 after exceeding configured requests per minute per IP.
- CORS headers allow origins defined by `CORS_ALLOWED_ORIGINS`.
- Interactive docs render cleanly in a browser.

## Testability & Stability

- Covered by Vitest in `sandbox/tests/server.test.js`, including:
  - `/config` returns config JSON when unprotected.
  - Unauthorized access returns 401 when CONFIG_USER/CONFIG_PASS are set.
  - Authorized access returns correct JSON structure.
- Fail-safe on internal errors returning 500.
- Maintain existing tests for health, metrics, openapi.json, and docs endpoints.
