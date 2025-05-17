# Objective & Scope
Extend the HTTP server, CLI library, and AWS Lambda handler to deliver AI-driven suggestions, health monitoring, Prometheus-style metrics, and secure event ingestion. This unified feature ensures robust event handling, real-time service health insights, operational visibility, and SQS-backed ingestion through a single lightweight SDK.

# Value Proposition

- Provides contextual AI suggestions via the agenticHandler for GitHub issues or identifiers.
- Exposes built-in health and metrics endpoints to monitor service availability, event throughput, and failure rates.
- Supplies a secure HTTP ingestion endpoint that validates payloads and enqueues them into SQS.
- Extends CLI with flags for agentic suggestions, health checks, and secure event ingestion simulation.
- Maintains a minimal dependency footprint, leveraging zod for validation and @aws-sdk/client-sqs or s3-sqs-bridge for SQS integration.

# Success Criteria & Requirements

## Agentic Handler Implementation
- Async function agenticHandler(payload) in src/lib/main.js remains as defined: calls OpenAI ChatCompletion, parses JSON response, returns { suggestion, refinement, metadata, handler }.

## Secure Event Ingestion HTTP Endpoint
- POST /ingest: validate JSON body against a zod schema (e.g., { key: string, value: string, lastModified: string }).
- Enqueue validated payload to SQS using @aws-sdk/client-sqs SendMessage or s3-sqs-bridge sendToQueue function.
- Return 202 Accepted with JSON { message: "enqueued", messageId } on success or 400/500 on error.

## CLI Integration
- processAgentic(args): supports --agentic with --issueUrl or --id flags, invokes agenticHandler, logs via logInfo.
- Expose new --health flag: print JSON { status: "ok", uptime, processedEvents, failedEvents } and return before other flags.
- Introduce --ingest flag: accepts --payload JSON string or --file path, constructs an SQS event, calls digestion or direct SendMessage, logs outcome, and returns true.

## HTTP Endpoints
- POST /agentic: validate with zod, invoke agenticHandler, return 200 with JSON payload or appropriate error codes.
- GET /health: return 200 with JSON { status: "ok", uptime: number, timestamp: string }.
- GET /metrics: return 200 with text/plain Prometheus metrics including counters processed_events_total, failed_events_total, agentic_requests_total and gauge service_uptime_seconds.
- POST /ingest: as defined above under Secure Event Ingestion.

# Testability & Stability

- Unit tests for agenticHandler: mock OpenAIApi for valid/malformed JSON and error paths.
- Unit tests for processAgentic, processHealth, and processIngest CLI flows: simulate args, assert logs and exit behavior.
- Integration tests using supertest for /agentic, /health, /metrics, /ingest: cover success, validation failures, and queue errors.
- Maintain coverage above 90% for new code paths.

# Dependencies & Constraints

- Use Node 20 ESM and built-in http server.
- Continue using zod for schema validation and existing logInfo/logError utilities.
- Add @aws-sdk/client-sqs (or leverage existing @xn-intenton-z2a/s3-sqs-bridge) for SQS message publishing.
- Do not introduce heavyweight HTTP frameworks or telemetry tools; keep dependencies minimal.

# User Scenarios & Examples

- CLI health check: npx agentic-lib --health outputs service status and counters.
- CLI ingest simulation: npx agentic-lib --ingest --payload '{"key": "events/1.json","value":"12345","lastModified":"2024-01-01T00:00:00Z"}'.
- Metrics scraping: GET /metrics returns Prometheus exposition format for automated monitoring.
- HTTP ingestion: POST /ingest with valid payload returns 202 and messageId; invalid payload returns 400.

# Verification & Acceptance

- Run npm test to ensure unit and integration tests for health, metrics, agentic, and ingestion features pass.
- Manual test: start HTTP server, curl /ingest, /health, /metrics, verify responses and underlying SQS queue receives messages.
- Inspect logs for structured JSON entries at info and error levels for ingestion and health checks.