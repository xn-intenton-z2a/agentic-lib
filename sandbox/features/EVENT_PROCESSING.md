# Objective & Scope
Extend the existing HTTP server, CLI library, and AWS Lambda handler to include comprehensive health monitoring and Prometheus-style metrics alongside AI-driven suggestions and secure event ingestion. This unified feature ensures robust event handling, real-time service health insights, and operational visibility in a single lightweight SDK.

# Value Proposition

- Delivers automated, contextual AI suggestions for GitHub issues or identifiers via the agenticHandler.
- Provides built-in health and metrics endpoints to monitor service availability, event throughput, and failure rates.
- Maintains a minimal dependency footprint using built-in http, zod, and optional prom-client for metrics collection.

# Success Criteria & Requirements

## Agentic Handler Implementation
- Async function agenticHandler(payload) in src/lib/main.js remains as defined: calls OpenAI ChatCompletion, parses JSON response, returns { suggestion, refinement, metadata, handler }.

## CLI Integration
- processAgentic(args) supports --agentic with --issueUrl or --id flags, invokes agenticHandler, logs results via logInfo.
- Expose new --health flag in CLI: when supplied, print JSON { status: "ok", uptime, processedEvents, failedEvents } and return true before other flags.

## HTTP Endpoints
- POST /agentic: validate body with zod, invoke agenticHandler, return 200 with JSON payload or 400/500 on error.
- GET /health: no request body, return 200 with JSON { status: "ok", uptime: number, timestamp: string }.
- GET /metrics: no request body, return 200 with text/plain metrics in Prometheus exposition format including counters processed_events_total, failed_events_total, agentic_requests_total and a gauge service_uptime_seconds.

# Testability & Stability

- Unit tests for agenticHandler: mock OpenAIApi for valid/malformed JSON and error paths.
- Unit tests for processAgentic and processHealth CLI flows: simulate args, assert output and exit behavior.
- Integration tests using supertest for /agentic, /health, and /metrics: cover success, validation failures, and error handling.
- Maintain coverage above 90% for all new code paths.

# Dependencies & Constraints

- Continue using Node 20 ESM and built-in http server; add prom-client as optional dependency for metrics or implement minimal counter logic without new libraries.
- Reuse zod for schema validation and existing logInfo/logError utilities.
- Do not introduce additional HTTP frameworks or heavyweight telemetry tools.

# User Scenarios & Examples

- CLI health check: npx agentic-lib --health outputs service status and counters.
- Metrics scraping: GET /metrics returns text/plain Prometheus metrics for automated monitoring.
- HTTP agentic call: POST /agentic with { issueUrl: string } returns AI suggestions.

# Verification & Acceptance

- Run npm test to ensure unit and integration tests for health, metrics, and agentic features pass.
- Manual test: start HTTP server, curl /health and /metrics, verify correct JSON and metrics format; test agentic endpoint with valid and invalid payloads.
- Inspect logs for structured JSON entries at info and error levels for event processing and health checks.