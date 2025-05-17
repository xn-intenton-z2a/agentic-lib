# Mission Alignment

The HTTP Server feature implements self-hosted observability and documentation endpoints, empowering autonomous, agentic workflows with real-time health checks, metrics, and interactive API docs. It advances our mission by providing critical insights into long-running processes and seamless integration points for monitoring and continuous automation.

# Feature Overview

The HTTP Server exposes four core endpoints over HTTP, supporting CORS and Basic Auth where configured:

- **GET /health**
  Returns JSON with service status, uptime, and timestamp.

- **GET /metrics**
  Prometheus-compatible metrics for request counts and failure counts, protected by Basic Auth if METRICS_USER/METRICS_PASS are set.

- **GET /openapi.json**
  Serves the OpenAPI 3.0 schema describing all available endpoints and methods.

- **GET /docs**
  Renders the OpenAPI schema as interactive HTML via Markdown, protected by Basic Auth if DOCS_USER/DOCS_PASS are set.

# Configuration

Environment variables:

- `PORT` (default 3000)
- `CORS_ALLOWED_ORIGINS` (default `*`)
- `RATE_LIMIT_REQUESTS` (requests per minute per IP, default 60)
- `METRICS_USER`, `METRICS_PASS` (Basic Auth credentials for `/metrics`)
- `DOCS_USER`, `DOCS_PASS` (Basic Auth credentials for `/docs`)

# Usage

Import and start the server programmatically:

```js
import { startServer } from "@xn-intenton-z2a/agentic-lib";
startServer({ port: 3000 });
```

Or via CLI mode sandbox under `sandbox/source/server.js`, which listens on `PORT` or provided options object.

# Success Criteria & Acceptance

- All four endpoints respond with correct status codes and payloads.
- Basic Auth protects `/metrics` and `/docs` endpoints when credentials are set.
- Rate limiting returns 429 after exceeding configured requests per minute per IP.
- CORS headers allow origins defined by `CORS_ALLOWED_ORIGINS`.
- Interactive docs render cleanly in a browser.

# Testability & Stability

- Covered by Vitest in `sandbox/tests/server.test.js`.
- Simulate unauthorized access, rate limits, and valid requests.
- Fail-safe on internal errors returning 500.
