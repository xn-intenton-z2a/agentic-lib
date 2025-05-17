# Objective & Scope
Extend the existing event-processing framework to stand up a built-in HTTP server that routes GitHub webhook ingestion, secure event ingestion, health checks, metrics, and dead-letter queue management through configurable endpoints and a new CLI flag.

# Value Proposition

- Provide a single binary that can be invoked as both a CLI and a long-running HTTP server, reducing deployment complexity and removing the need for external API frameworks.
- Enable users to host a unified endpoint for GitHub webhook reception, SQS enqueueing, AI-driven suggestions, health monitoring, and Prometheus-style metrics.
- Simplify local development and testing by supporting a `--serve` CLI flag to launch the HTTP server, while preserving existing CLI digest, help, and version commands.

# Success Criteria & Requirements

## HTTP Server Implementation

- Use Node.js built-in `http` module in `src/lib/main.js` without adding heavy dependencies.
- New CLI flag `--serve`:
  - When supplied, bypass existing single-run commands and start an HTTP server listening on port from `PORT` env or default 3000.
  - Log startup information including port and enabled routes.

- Exposed Endpoints:
  - `POST /webhook`:
    - Validate `X-Hub-Signature-256` using HMAC SHA256 with `GITHUB_WEBHOOK_SECRET`.
    - Parse and validate JSON body (push, pull_request, issues) using zod.
    - Route push and pull_request to `SendMessage` for SQS.
    - Invoke `agenticHandler` for issue events and return AI suggestions.
    - Respond with 200 and `{ message: "received", eventType }` or 400 on validation or signature failure.

  - `POST /ingest`:
    - Validate JSON payload schema and enqueue to SQS.
    - Return 202 Accepted with `{ messageId }` or 400 on failure.

  - `GET /health`:
    - Return JSON `{ status: "ok", uptime: <seconds>, timestamp: <ISO> }` to signal liveness.

  - `GET /metrics`:
    - Expose Prometheus-style metrics for counters defined in the framework.

  - `POST /dlq/purge`:
    - Purge the dead-letter queue when `DLQ_QUEUE_URL` is set.
    - Return 200 with purge summary or 400 if not configured.

## CLI Integration

- Retain existing `--help`, `--version`, `--digest` flags.
- Add `--serve` flag before other flags:
  - If `--serve` is present, launch HTTP server instead of exiting after one simulated action.
  - If other flags accompany `--serve`, ignore them and warn the user.

## Testability & Stability

- Unit tests for HTTP routing using `supertest` and Vitest:
  - Mock internal handlers to simulate success and failure flows for each route.
  - Verify correct HTTP status codes, headers, and response bodies.
  - Test signature validation failures and schema errors.

- Integration tests:
  - Spawn the CLI with `--serve`, send HTTP requests to all endpoints, and assert metrics counter increments.
  - Cleanly shut down the server after tests to avoid port conflicts.

- Maintain overall coverage > 90% for new code paths.

## Dependencies & Constraints

- Do not introduce Express or other heavy web frameworks; use native `http`.
- Continue using `zod` for schema validation and built-in `crypto` for HMAC.
- Update `sandbox/tests/` and `sandbox/README.md` with new server usage examples.
- Ensure compatibility with Node 20, ESM, and existing linting and formatting rules.

## User Scenarios & Examples

- Local development: `npx agentic-lib --serve` starts server on port 3000, user can test webhooks and metrics.
- Production: container runs `agentic-lib --serve` behind a reverse proxy to receive GitHub events.
- Health check and metrics endpoints can be wired into Kubernetes or monitoring systems.

## Verification & Acceptance

- Run `npm test` including new sandbox tests to verify server behavior.
- Manually start server and send sample GitHub push, pull_request, and issue events to `/webhook`.
- Validate metrics endpoint contains updated counters and health endpoint returns correct status.
