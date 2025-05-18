# HTTP Server Feature

## Mission Alignment

The HTTP server provides critical observability endpoints (health, readiness, metrics, OpenAPI schema, docs) to support continuous monitoring and self-hosted documentation in line with our mission to enable autonomous, agentic workflows. For mission details, see [Mission Statement](../MISSION.md).

This document describes how to launch the built-in HTTP server provided by agentic-lib, exposing key endpoints.

## Programmatic Usage

Import the `startServer` function and call it in your Node.js application:

```js
import { startServer } from "@xn-intenton-z2a/agentic-lib";

// Optionally, pass configuration options:
const options = {
  port: process.env.PORT || 3000,
  // CORS_ALLOWED_ORIGINS, RATE_LIMIT_REQUESTS, METRICS_USER, METRICS_PASS, DOCS_USER, DOCS_PASS
};

startServer(options);
```

## Endpoints

- **GET /health**  
  Liveness probe. Returns JSON:
  ```json
  { "status": "ok", "uptime": <seconds>, "timestamp": "<ISO>" }
  ```

- **GET /ready**  
  Readiness probe. Returns JSON:
  ```json
  { "status": "ready", "timestamp": "<ISO>" }
  ```

- **GET /metrics**  
  Prometheus-formatted metrics. Exposes:
  - `http_requests_total{method,route,status}`
  - `http_request_failures_total{route}`
  - `http_request_duration_seconds{method,route,status}` (request duration histogram)
  Protected by Basic Auth if `METRICS_USER`/`METRICS_PASS` are set.

- **GET /openapi.json**  
  Returns the OpenAPI 3.0 schema for all endpoints.

- **GET /docs**  
  Renders the OpenAPI schema as HTML via Markdown. Protected by Basic Auth if `DOCS_USER`/`DOCS_PASS` are set.

## Configuration

Environment variables:

- `PORT` (default `3000`)
- `CORS_ALLOWED_ORIGINS` (default `*`)
- `RATE_LIMIT_REQUESTS` (requests per minute, default `60`)
- `METRICS_USER`, `METRICS_PASS` (for `/metrics` Basic Auth)
- `DOCS_USER`, `DOCS_PASS` (for `/docs` Basic Auth)

## Rate Limiting

IP-based token bucket with the following behavior:

- Each IP has a token bucket of `RATE_LIMIT_REQUESTS` tokens per minute.
- Exceeding the limit returns `429 Too Many Requests`.
