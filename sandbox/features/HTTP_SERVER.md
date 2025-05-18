# HTTP Server Feature Expansion

## Mission Alignment

The HTTP Server feature provides critical self-hosted observability and diagnostics endpoints to support continuous monitoring and autonomous agentic workflows. By adding a `/version` endpoint alongside existing health, metrics, OpenAPI, docs, and config endpoints, users gain insights into deployed version metadata, enabling more precise debugging and traceability in production environments.

## Feature Overview

The HTTP Server now exposes six core endpoints over HTTP, all supporting CORS and Basic Auth where configured:

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

- **GET /version**
  Returns JSON with service version and build timestamp. Reads `VERSION` and `BUILD_TIMESTAMP` environment variables or falls back to package.json version and current timestamp. Protected by Basic Auth if VERSION_USER/VERSION_PASS are set.

## Configuration

Environment variables:

- `PORT` (default 3000)
- `CORS_ALLOWED_ORIGINS` (default `*`)
- `RATE_LIMIT_REQUESTS` (requests per minute per IP, default 60)
- `METRICS_USER`, `METRICS_PASS` (Basic Auth for `/metrics`)
- `DOCS_USER`, `DOCS_PASS` (Basic Auth for `/docs`)
- `CONFIG_USER`, `CONFIG_PASS` (Basic Auth for `/config`)
- `VERSION_USER`, `VERSION_PASS` (Basic Auth for `/version`)
- `VERSION` (service version, fallback to package.json version)
- `BUILD_TIMESTAMP` (build timestamp, fallback to current UTC timestamp)

## Success Criteria & Acceptance

- GET `/version` responds with status 200 and payload:
  ```json
  { "version": "<semver>", "buildTimestamp": "<ISO>" }
  ```
- Basic Auth protects `/version` when VERSION_USER/VERSION_PASS are set, returning 401 otherwise.
- `/version` appears in OpenAPI schema and rendered interactive docs.
- All existing endpoints continue to function with unchanged behavior.

## Testability & Stability

- Add Vitest coverage in `sandbox/tests/server.test.js` for `/version`, including:
  - Response structure when unprotected.
  - 401 response when auth is set but credentials are invalid.
  - Successful response when valid credentials are provided.
- Maintain existing tests for health, metrics, openapi.json, docs, and config.
- Fail-safe error handling returning 500 on unexpected failures.
