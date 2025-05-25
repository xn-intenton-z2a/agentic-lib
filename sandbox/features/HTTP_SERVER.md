# Objective

Provide an HTTP server interface to the existing CLI and Lambda functionality, allowing external systems to health-check, monitor, and submit digest payloads via REST endpoints. The server will use Express to expose a lightweight API without altering core Lambda logic.

# Value Proposition

- Enables integration with HTTP-based workflows and monitoring tools
- Simplifies testing and orchestration by allowing direct POST of digest events
- Offers observability through health and metrics endpoints, improving operational visibility

# Requirements & Success Criteria

1. Add a `--serve` CLI flag that starts an HTTP server using Express on a configurable port (default 3000).
2. Expose a GET `/health` endpoint returning HTTP 200 and JSON `{ status: "ok" }`.
3. Expose a GET `/metrics` endpoint returning JSON with `callCount`, `uptime`, and optionally other stats.
4. Expose a POST `/digest` endpoint accepting a JSON body matching a digest object, invoking `digestLambdaHandler` internally and returning the same batchItemFailures response in JSON.
5. Support configurable port via environment variable `HTTP_PORT` and CLI option `--port <number>`.
6. Include automated tests covering each endpoint, using Supertest in sandbox/tests.
7. Update sandbox/README.md with API reference and usage examples for HTTP mode.
8. Ensure no breaking changes to existing CLI flags and default behavior when `--serve` is not supplied.

# Dependencies & Constraints

- Express must be imported but kept as a dev dependency only if tree-shaken; otherwise as a runtime dependency.
- Must maintain ESM module standards and Node 20 compatibility.
- Tests should reside under sandbox/tests and use Vitest and Supertest.

# User Scenarios

1. Operations engineer checks service health via curl GET http://localhost:3000/health.
2. Monitoring system scrapes metrics GET http://localhost:3000/metrics for callCount and uptime.
3. Downstream system POSTs a digest event to http://localhost:3000/digest and processes the returned batch failures.

# Verification & Acceptance

- Unit tests for each endpoint return expected status codes and JSON schemas.
- Manual test: start with `node src/lib/main.js --serve`, verify end-to-end behavior.
- No regressions in existing CLI flags `--help`, `--version`, `--digest` when used without `--serve`.