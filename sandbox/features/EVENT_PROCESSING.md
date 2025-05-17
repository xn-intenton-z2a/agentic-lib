# Objective & Scope
Extend the existing event-processing framework in a single ESM binary to provide a self-hosted HTTP server supporting secure webhook ingestion, background queue management, dead-letter queue (DLQ) controls, health and metrics endpoints, interactive API documentation, and AI-driven payload summarization. Include corresponding CLI flags for local simulation, event digest, summarization, and DLQ replay using OpenAI and AWS SDK.

# Value Proposition

- Deliver a one-stop binary that handles event ingestion, queueing, monitoring, documentation, DLQ management, and payload summarization without external frameworks.
- Empower users to inspect, replay, and purge dead-lettered messages directly via HTTP or CLI, improving operational resilience and debugging.
- Leverage existing AWS SDK and OpenAI credentials to provide queue operations and AI capabilities without introducing new dependencies.
- Maintain minimal dependencies by using built-in http, zod, crypto, markdown-it, markdown-it-github, and the installed OpenAI SDK.

# Success Criteria & Requirements

## HTTP Server Implementation
- Use Node.js built-in http module; do not introduce additional frameworks.
- CLI flag `--serve` starts server on `PORT` or default 3000; when active, ignore other flags.
- Log startup information: port, enabled routes, CORS origins, rate limit, AI endpoint availability.

### Exposed Endpoints
- POST /webhook
  - Validate GitHub signature, JSON payload, and enqueue to SQS as before.
- POST /ingest
  - Validate generic payload and enqueue to SQS.
- POST /summarize
  - Accept any JSON payload in body.
  - Forward payload to OpenAI chat completion with a system prompt to generate a concise summary.
  - Respond with JSON `{ summary: string }` on success or 502 on AI errors.
- GET /health, GET /metrics, POST /dlq/purge, GET /openapi.json, GET /docs as specified.

#### Dead-Letter Queue Management
- GET /dlq
  - Return a JSON array of messages currently in the DLQ with fields `messageId`, `body`, and `timestamp`.
  - Use AWS SDK to peek DLQ messages without removing them.
- POST /dlq/replay
  - Accept optional JSON body listing `messageIds` to replay; if omitted, replay all messages.
  - Send selected messages back to the main SQS queue, then remove them from the DLQ.
  - Respond with JSON `{ replayedCount: number, failedCount: number }`.
- GET /dlq/stats
  - Return JSON `{ totalMessages: number, oldestMessageAgeSeconds: number }`.

## CLI Extensions
- `--digest`: simulate SQS digest event as before.
- `--summarize [file]`
  - If `file` provided, read JSON from path; otherwise read JSON from STDIN.
  - Call OpenAI API with a consistent system prompt to summarize payload.
  - Print summary text to stdout.
- `--replay-dlq [ids]`
  - If `ids` provided as comma-separated list, replay those DLQ messages; otherwise replay all.
  - Print JSON result of replay operation to stdout.
- `--help` and `--version` remain unchanged.

## OpenAI Integration
- Use existing openai SDK and `OPENAI_API_KEY` from environment.
- Send chat completion requests with model `gpt-3.5-turbo` or fallback to default.
- Apply a Zod schema to validate response contains `choices[0].message.content`.

## Security, CORS & Rate Limiting
- Same CORS, rate limiting, and basic auth requirements apply to new DLQ management endpoints.

## Testability & Stability
- Add unit tests with vitest and supertest for the new DLQ endpoints and CLI replay functionality.
  - Mock AWS SDK SQS client to return fixed DLQ messages.
  - Verify correct HTTP status codes, JSON shapes, error handling, and CORS headers.
- Add integration tests launching `--serve` and testing GET /dlq, POST /dlq/replay, and GET /dlq/stats with a real server instance.
- Maintain overall coverage above 90%.

## Dependencies & Constraints
- Do not introduce new dependencies beyond the existing AWS SDK and OpenAI SDK.
- Ensure compatibility with Node 20, ESM, existing linting, and formatting.

## User Scenarios & Examples
- Local CLI replay all DLQ messages:
  echo '{}' | npx agentic-lib --replay-dlq
- Selective replay:
  npx agentic-lib --replay-dlq id1,id2
- HTTP peek DLQ:
  curl http://localhost:3000/dlq
- HTTP replay specific messages:
  curl -X POST http://localhost:3000/dlq/replay -H 'Content-Type: application/json' -d '{"messageIds":["id1","id2"]}'

## Verification & Acceptance
- Run `npm test` covering new unit and integration tests.
- Manually start server; test DLQ endpoints and confirm expected JSON responses.
- Confirm no regressions in existing endpoints or CLI flags.
