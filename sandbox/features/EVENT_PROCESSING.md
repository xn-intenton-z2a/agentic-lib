# Objective & Scope
Extend the existing event-processing framework to include interactive API documentation alongside the HTTP server for webhook ingestion, secure event ingestion, health checks, metrics, dead-letter queue management, and CLI integration. Provide both a machine-readable OpenAPI schema and a simple HTML-based documentation interface without adding heavy web frameworks.

# Value Proposition
- Offer a self-documenting HTTP API for all routes, reducing onboarding friction and eliminating the need for external API docs.
- Enable users and integrators to explore endpoints, request schemas, and response formats directly from the library binary.
- Maintain a single binary serving API, metrics, health, and documentation, simplifying deployment and local development.

# Success Criteria & Requirements

## HTTP Server Implementation
- Use Node.js built-in http module. Do not introduce Express or similar frameworks.
- CLI flag serve remains --serve, launching the HTTP server on PORT or default 3000.
- Log startup information including port, enabled routes, and documentation endpoints.

- Exposed Endpoints:
  - POST /webhook to handle GitHub events with signature validation, JSON schema checks, SQS enqueueing, and AI suggestions.
  - POST /ingest to validate JSON payload and enqueue to SQS.
  - GET /health to return status, uptime, and timestamp.
  - GET /metrics to expose Prometheus-style counters.
  - POST /dlq/purge to purge dead-letter queue when configured.
  - GET /openapi.json to serve an OpenAPI 3.0 compliant JSON schema describing all routes, methods, request bodies, and response formats.
  - GET /docs to serve a minimal HTML page that renders the OpenAPI schema in a readable form using markdown-it and markdown-it-github, no client-side frameworks.

## CLI Integration
- Retain --help, --version, --digest flags.
- --serve launches HTTP server; ignore other flags when --serve is present and warn the user.
- Add a warning in usage output indicating documentation endpoints at /docs and /openapi.json when in serve mode.

## Testability & Stability
- Unit tests with supertest and vitest for new documentation endpoints:
  - Verify GET /openapi.json returns valid JSON matching declared schema.
  - Verify GET /docs returns HTML containing key sections for each endpoint.
- Integration tests launching CLI with --serve, then:
  - Request /openapi.json and assert response content-type and schema structure.
  - Request /docs and assert HTML contains route summaries and examples.
  - Ensure existing tests for /webhook, /ingest, /health, /metrics, /dlq/purge still pass.
- Maintain coverage above 90% for new code paths.

## Dependencies & Constraints
- Do not add heavy frameworks; rely on markdown-it and markdown-it-github already in dependencies.
- Continue using zod for schema validation and built-in crypto for HMAC.
- Update sandbox/tests and sandbox/README.md with examples for documentation endpoints.
- Ensure compatibility with Node 20, ESM, and existing linting and formatting rules.

## User Scenarios & Examples
- Local development: run npx agentic-lib --serve; navigate to http://localhost:3000/docs to explore API and schemas.
- CI integration: use GET /openapi.json to generate client bindings or validate request contracts.
- Production: host documentation behind authentication or proxy; integrate /metrics with Prometheus and healthchecks with Kubernetes.

## Verification & Acceptance
- Run npm test including sandbox tests for documentation endpoints.
- Manually start server, fetch /openapi.json and validate its structure against an OpenAPI validator.
- Open /docs in a browser and confirm that documentation for each route is visible, including request and response examples.
- Confirm no regressions in existing event processing, health, metrics, and DLQ routes.