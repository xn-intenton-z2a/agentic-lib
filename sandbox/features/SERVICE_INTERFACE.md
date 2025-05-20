# SERVICE_INTERFACE Feature

# Description
Provide a unified interface layer exposing the library’s core digest logic through both a CLI and an HTTP server. Users can interact via command-line flags or a RESTful API, enabling flexible integration in scripts, local development, and external services. This feature now also includes health and metrics endpoints for operational monitoring.

# Value Proposition
- Simplify access to digest processing without AWS infrastructure.
- Support automation workflows via CLI flags for help, version, mission, digest triggers, health checks, and metrics inspection.
- Enable programmatic integration via HTTP POST to digest endpoint, and HTTP GET to health and metrics endpoints.
- Facilitate observability by exposing service health status and Prometheus-compatible metrics.

# Success Criteria & Requirements
- CLI commands respond to the following flags:
  - --help: prints usage instructions and exits.
  - --version: prints package version and timestamp.
  - --mission: prints mission statement and exits.
  - --digest: simulates an SQS event and invokes digestLambdaHandler.
  - --serve [--port <number>]: starts HTTP server (default port 3000 or PORT env).
  - --health: prints service health status JSON { status: "ok" } and exits.
  - --metrics: prints basic metrics JSON { uptime, processedCount, failureCount } and exits.

- HTTP server behavior:
  - Endpoint: POST /digest
    - Accepts JSON body matching AWS SQS event schema or direct digest payload.
    - Returns HTTP 200 with JSON { batchItemFailures: [] } on success.
  - Endpoint: GET /health
    - Returns HTTP 200 with JSON { status: "ok" } when server is running.
  - Endpoint: GET /metrics
    - Returns HTTP 200 with JSON object exposing metrics: uptime (seconds), totalDigestInvocations, totalFailures.
  - Graceful shutdown on SIGINT/SIGTERM.

# CLI Specification
- Implement flags in main(): processHelp, processVersion, processMission, processDigest, processServe, processHealth, and processMetrics.
- processHealth prints JSON { status: "ok" } and exits.
- processMetrics aggregates in-memory counters for digestLambdaHandler invocations and failures, prints JSON and exits.

# HTTP API Specification
- Launch when main is invoked with --serve.
- Use Express to listen on configured port.
- Accept POST requests at /digest with JSON body. Call digestLambdaHandler and respond with batchItemFailures array.
- Accept GET requests at /health and /metrics, returning JSON status and metrics respectively.
- Cleanly close server on termination signals.

# Verification & Acceptance
- Unit tests cover CLI flags --health and --metrics behavior, verifying console output and exit flow.
- HTTP endpoint tests simulate GET /health and GET /metrics, asserting status codes and JSON shapes.
- Existing tests for POST /digest remain passing.