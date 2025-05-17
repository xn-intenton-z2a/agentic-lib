# Objective & Scope
Extend the existing event-processing framework in a single ESM binary to provide a self-hosted HTTP server supporting secure webhook ingestion, background queue management, health and metrics endpoints, and interactive API documentation. Ensure minimal dependencies by using Node.js built-in http module, zod for validation, crypto for HMAC, and existing markdown-it libraries for docs rendering.

# Value Proposition
- Deliver a one-stop binary that handles event ingestion, queueing, monitoring, and documentation without external frameworks.
- Reduce onboarding and integration friction by exposing a machine-readable OpenAPI schema and an HTML interface at runtime.
- Improve operational visibility with health checks, Prometheus-style metrics, DLQ management, CORS support, rate limiting, and optional basic authentication for sensitive endpoints.

# Success Criteria & Requirements

## HTTP Server Implementation
- Use Node.js built-in http module only; do not introduce Express or other frameworks.
- CLI flag `--serve` starts the server on `PORT` or default 3000; when serve mode is active, ignore other flags and warn the user.
- Log startup information: chosen port, enabled routes, CORS origins, rate limit settings, and docs endpoints.

### Exposed Endpoints
- POST /webhook
  - Validate GitHub signature using built-in crypto HMAC with secret from `WEBHOOK_SECRET`.
  - Validate JSON payload against a Zod schema and enqueue valid events to SQS via existing AWS utilities.
  - On validation failure respond with 400 and JSON error details.
- POST /ingest
  - Validate generic JSON payload and enqueue to SQS.
- GET /health
  - Return JSON status, uptime, timestamp, and SQS connectivity check.
- GET /metrics
  - Expose Prometheus-style counters (requests, failures, queue length) with optional basic auth using `METRICS_USER` and `METRICS_PASS`.
- POST /dlq/purge
  - Purge dead-letter queue when configured; require basic auth.
- GET /openapi.json
  - Serve a fully compliant OpenAPI 3.0 JSON schema for all routes.
- GET /docs
  - Serve a minimal HTML page rendering the OpenAPI schema using markdown-it and markdown-it-github; require basic auth if `DOCS_USER`/`DOCS_PASS` set.

### Security, CORS & Rate Limiting
- Allow CORS origins configured via `CORS_ALLOWED_ORIGINS` (comma-separated), default `*`.
- Implement simple IP-based token bucket rate limiter: configurable `RATE_LIMIT_REQUESTS` per minute; respond 429 when exceeded.
- Basic authentication on docs, metrics, and DLQ purge endpoints when credentials are provided via env.

## Testability & Stability
- Unit tests with vitest and supertest for all endpoints, including CORS headers, rate limiting, basic auth, OpenAPI response structure, and HTML docs content.
- Integration tests launch CLI with `--serve`, then verify each endpoint behavior, security, and metrics counters.
- Maintain coverage above 90% on new code.

## Dependencies & Constraints
- Do not add heavy frameworks; rely on built-in http, zod, crypto, markdown-it, markdown-it-github, and existing AWS SDK utilities.
- Ensure compatibility with Node 20, ESM, current linting and formatting rules.
- Update sandbox/tests for new endpoints and sandbox/README.md with usage examples.

## User Scenarios & Examples
- Local development: `npx agentic-lib --serve`; open `http://localhost:3000/docs`; test rate limiting and CORS via curl.
- CI: fetch `/openapi.json` for contract validation; integrate `/metrics` with Prometheus.
- Production: run behind reverse proxy handling TLS and authentication if needed.

## Verification & Acceptance
- Run `npm test` including sandbox tests for HTTP server.
- Manually start server, fetch `/openapi.json`, validate with an OpenAPI validator.
- Browse `/docs` in a browser and confirm interactive documentation is rendered.
- Confirm CORS headers, rate limiting, and basic auth function as configured.
- Verify no regressions in existing queueing and CLI flags.