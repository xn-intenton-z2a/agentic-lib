# HTTP Server Feature

This document describes the `--serve` mode for the Agentic-lib CLI, which launches a self-hosted HTTP server exposing key endpoints.

## Usage

Start the server on the configured port (default 3000):

```bash
npx agentic-lib --serve
```

## Endpoints

- **GET /health**: Liveness probe. Returns `{ status: "ok", uptime: <seconds>, timestamp: <ISO> }`.
- **GET /metrics**: Prometheus-formatted metrics. Exposes `http_requests_total{method,route,status}` and `http_request_failures_total{route}`. Protected by Basic Auth if `METRICS_USER`/`METRICS_PASS` are set.
- **GET /openapi.json**: Returns the OpenAPI 3.0 schema for all endpoints.
- **GET /docs**: Renders the OpenAPI schema as HTML via Markdown. Protected by Basic Auth if `DOCS_USER`/`DOCS_PASS` are set.

## Configuration

Environment variables:

- `PORT` (default `3000`)
- `CORS_ALLOWED_ORIGINS` (default `*`)
- `RATE_LIMIT_REQUESTS` (requests per minute, default `60`)
- `METRICS_USER`, `METRICS_PASS` (for `/metrics`)
- `DOCS_USER`, `DOCS_PASS` (for `/docs`)

## Rate Limiting

IP-based token bucket. Exceeding the limit returns `429 Too Many Requests`.
