# Objective & Scope
Extend the existing event ingestion and processing framework in a single ESM binary to provide a self-hosted HTTP server and CLI enhancements. The HTTP server must support secure webhook ingestion, generic payload ingestion, background queue management, dead-letter queue controls, health checks, metrics, status reporting, interactive API documentation, and AI-driven payload summarization. CLI flags must enable local simulation of SQS events, payload summarization, dead-letter queue operations, and status reporting.

# Value Proposition
- All-in-one binary for event ingestion, queue management, DLQ operations, monitoring, and AI summarization without external frameworks.
- Secure webhook and generic ingestion workflows with GitHub signature validation.
- Real-time health, status, and metrics endpoints for improved observability and operational resilience.
- Interactive OpenAPI documentation and CLI tools for on-demand testing and debugging.
- Leverage existing AWS SDK and OpenAI SDK credentials without adding dependencies.

# Success Criteria & Requirements
## HTTP Server Implementation
- Use Node.js built-in http module; no new frameworks.
- CLI flag --serve starts server on PORT or default 3000; ignores other flags when serving.
- Log startup info: port, enabled routes, CORS origins, rate limits, AI availability.

### Exposed Endpoints
- GET /status: return JSON { uptime, memoryUsage, callCount }.
- GET /health: return status 200 or 503 on failure.
- GET /metrics: expose Prometheus-style metrics for uptime, invocation counts, error rates.
- POST /webhook: validate GitHub signature, JSON payload, enqueue to SQS.
- POST /ingest: validate generic JSON payload, enqueue to SQS.
- POST /summarize: accept JSON payload, forward to OpenAI chat completion, return { summary } or 502 on AI errors.
- GET /dlq: peek DLQ messages, return array of { messageId, body, timestamp }.
- POST /dlq/replay: replay specified or all DLQ messages, return { replayedCount, failedCount }.
- POST /dlq/purge: purge DLQ messages, return { purgedCount }.
- GET /dlq/stats: return { totalMessages, oldestMessageAgeSeconds }.
- GET /openapi.json: return OpenAPI spec.
- GET /docs: return interactive API documentation.

### CLI Extensions
- --status: print JSON status with uptime, memory usage, callCount.
- --digest: simulate SQS digest event.
- --summarize [file]: summarize payload from file or STDIN.
- --replay-dlq [ids]: replay specified or all DLQ messages.
- --help, --version remain unchanged.

# Testability & Stability
- Unit tests with vitest and supertest covering all HTTP endpoints and CLI flags.
- Mock AWS SDK SQS client for DLQ operations and OpenAI API for summarization.
- Integration tests launching --serve and validating endpoints and CLI commands.
- Maintain coverage above 90%.

# Dependencies & Constraints
- No new dependencies beyond existing AWS SDK and OpenAI SDK.
- Compatible with Node 20, ESM standards, existing linting and formatting rules.

# User Scenarios & Examples
- Start server: npx agentic-lib --serve
- Query status: curl http://localhost:3000/status
- Summarize file: npx agentic-lib --summarize payload.json
- Replay DLQ: echo '{}' | npx agentic-lib --replay-dlq

# Verification & Acceptance
- All tests pass with npm test.
- Manual end-to-end validation of HTTP server and CLI operations.
- No regressions in existing CLI flags and digestLambdaHandler functionality.