# Objective & Scope
Extend the existing event-processing framework in a single ESM binary to provide a self-hosted HTTP server supporting secure webhook ingestion, background queue management, health and metrics endpoints, interactive API documentation, and AI-driven payload summarization. Include corresponding CLI flags for local simulation, event digest, and summarization using OpenAI.

# Value Proposition

- Deliver a one-stop binary that handles event ingestion, queueing, monitoring, documentation, and payload summarization without external frameworks.
- Empower users to obtain human-readable summaries of arbitrary event payloads directly from the CLI or an HTTP endpoint, accelerating debugging and triage.
- Leverage existing OpenAI credentials and SDK to provide AI capabilities without introducing new dependencies.
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

## CLI Extensions
- `--digest`: simulate SQS digest event as before.
- `--summarize [file]`
  - If `file` provided, read JSON from path; otherwise read JSON from STDIN.
  - Call OpenAI API with a consistent system prompt to summarize payload.
  - Print summary text to stdout.
- `--help` and `--version` remain unchanged.

## OpenAI Integration
- Use existing openai SDK and `OPENAI_API_KEY` from environment.
- Send chat completion requests with model `gpt-3.5-turbo` or fallback to default.
- Apply a Zod schema to validate response contains `choices[0].message.content`.

## Security, CORS & Rate Limiting
- Same CORS, rate limiting, and basic auth requirements apply to new /summarize endpoint.

## Testability & Stability
- Add unit tests with vitest and supertest for the new CLI and HTTP summarize functionality.
  - Mock OpenAI to return a fixed dummy summary.
  - Verify correct HTTP status codes, JSON shapes, error handling, and CORS headers.
- Add integration tests launching `--serve` and testing POST /summarize with real server instance.
- Maintain overall coverage above 90%.

## Dependencies & Constraints
- Do not introduce new dependencies beyond the existing OpenAI SDK.
- Ensure compatibility with Node 20, ESM, existing linting, and formatting.

## User Scenarios & Examples
- Local CLI:
  ```bash
  echo '{"event":"test"}' | npx agentic-lib --summarize
  ```
- File input:
  ```bash
  npx agentic-lib --summarize payload.json
  ```
- HTTP:
  ```bash
  curl -X POST http://localhost:3000/summarize -H "Content-Type: application/json" -d '{"foo":123}'
  ```

## Verification & Acceptance
- Run `npm test` covering new tests.
- Manually start server; POST /summarize and confirm response summary matches mock or real AI.
- Confirm no regressions in existing endpoints or CLI flags.