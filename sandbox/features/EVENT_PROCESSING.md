# Objective & Scope
Extend the existing event-processing framework in a single ESM binary to provide a self-hosted HTTP server supporting secure webhook ingestion, background queue management, dead-letter queue (DLQ) controls, health, metrics, and status endpoints, interactive API documentation, and AI-driven payload summarization. Include corresponding CLI flags for local simulation, event digest, summarization, DLQ replay, and status reporting using OpenAI and AWS SDK.

# Value Proposition

- Deliver a one-stop binary that handles event ingestion, queueing, monitoring, documentation, DLQ management, payload summarization, and runtime status reporting without external frameworks.
- Empower users to inspect, replay, purge dead-lettered messages, and query service status directly via HTTP or CLI, improving operational resilience, debugging, and observability.
- Provide real-time metrics and status including uptime, memory usage, and invocation counts for rapid incident response.
- Leverage existing AWS SDK and OpenAI credentials to provide queue operations and AI capabilities without introducing new dependencies.
- Maintain minimal dependencies by using built-in http, zod, crypto, markdown-it, markdown-it-github, and the installed OpenAI SDK.

# Success Criteria & Requirements

## HTTP Server Implementation
- Use Node.js built-in http module; do not introduce additional frameworks.
- CLI flag `--serve` starts server on `PORT` or default 3000; when active, ignore other flags.
- Log startup information: port, enabled routes, CORS origins, rate limit, AI endpoint availability.

### Exposed Endpoints
- GET /status
  - Return JSON containing process uptime (seconds), memory usage (rss, heapTotal, heapUsed), and global callCount.
  - Respond with 200 and JSON on success.
- POST /webhook
  - Validate GitHub signature, JSON payload, and enqueue to SQS as before.
- POST /ingest
  - Validate generic payload and enqueue to SQS.
- POST /summarize
  - Accept any JSON payload in body.
  - Forward payload to OpenAI chat completion with a system prompt to generate a concise summary.
  - Respond with JSON `{ summary: string }` or 502 on AI errors.
- GET /health, GET /metrics, POST /dlq/purge, GET /openapi.json, GET /docs as specified.

#### Dead-Letter Queue Management
- GET /dlq
  - Return a JSON array of messages currently in the DLQ with `messageId`, `body`, `timestamp`.
  - Use AWS SDK to peek DLQ messages without removing them.
- POST /dlq/replay
  - Accept optional JSON listing `messageIds`; if omitted, replay all.
  - Send selected messages back to main SQS queue, then remove from DLQ.
  - Respond with `{ replayedCount: number, failedCount: number }`.
- GET /dlq/stats
  - Return `{ totalMessages: number, oldestMessageAgeSeconds: number }`.

## CLI Extensions
- `--status`
  - Print JSON to stdout containing uptime (seconds), memory usage, and callCount.
- `--digest`
  - Simulate SQS digest event as before.
- `--summarize [file]`
  - Summarize JSON payload from file or STDIN via OpenAI; print summary.
- `--replay-dlq [ids]`
  - Replay specified DLQ messages or all; print JSON result.
- `--help` and `--version` remain unchanged.

## OpenAI Integration
- Use existing openai SDK and `OPENAI_API_KEY` from environment.
- Send chat completion requests with model `gpt-3.5-turbo` or fallback to default.
- Apply a Zod schema to validate response contains `choices[0].message.content`.

## Security, CORS & Rate Limiting
- Same CORS, rate limiting, and basic auth requirements apply to new endpoints including /status.

## Testability & Stability
- Add unit tests with vitest and supertest for GET /status, CLI `--status`, new DLQ endpoints, and CLI replay functionality.
  - Mock AWS SDK SQS client to return fixed DLQ messages.
  - Verify HTTP status codes, JSON shapes, error handling, CORS headers, and CLI output.
- Add integration tests launching `--serve` and testing GET /status, GET /dlq, POST /dlq/replay, and GET /dlq/stats with a real server instance.
- Maintain overall coverage above 90%.

## Dependencies & Constraints
- Do not introduce new dependencies beyond the existing AWS SDK and OpenAI SDK.
- Ensure compatibility with Node 20, ESM, existing linting, and formatting.

## User Scenarios & Examples
- Query runtime status via CLI:
  npx agentic-lib --status
- Query HTTP status endpoint:
  curl http://localhost:3000/status
- Local CLI replay all DLQ messages:
  echo '{}' | npx agentic-lib --replay-dlq
- HTTP peek DLQ:
  curl http://localhost:3000/dlq

## Verification & Acceptance
- Run `npm test` covering new unit and integration tests.
- Manually start server; test /status, DLQ endpoints and confirm expected JSON responses.
- Confirm no regressions in existing endpoints or CLI flags.