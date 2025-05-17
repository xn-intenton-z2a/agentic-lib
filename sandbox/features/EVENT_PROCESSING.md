# Objective & Scope
Extend the existing event-processing framework to include secure GitHub webhook ingestion, in addition to AI-driven suggestions, health monitoring, Prometheus-style metrics, secure event ingestion, and dead-letter queue support. Provide end-to-end handling of GitHub push, pull_request, and issue events through HTTP endpoints, SQS routing, and CLI simulation.

# Value Proposition

- Seamless ingestion of GitHub webhook events with HMAC signature verification to trigger automated, agentic workflows.
- Unified HTTP server exposing endpoints for agentic suggestions, health, metrics, SQS ingestion, webhook reception, and dead-letter queue management.
- Secure enqueueing of GitHub events into SQS with configurable retry and DLQ behavior.
- CLI commands for local simulation of GitHub events, health checks, SQS ingestion, and DLQ purging for developer workflows.
- Maintains minimal dependencies using Node.js built-in crypto for signature verification, zod for schema validation, and @aws-sdk/client-sqs or s3-sqs-bridge for SQS integration.

# Success Criteria & Requirements

## GitHub Webhook HTTP Endpoint
- HTTP POST /webhook endpoint
  - Validate X-Hub-Signature-256 header against payload using HMAC SHA256 and environment variable GITHUB_WEBHOOK_SECRET.
  - Parse JSON body and validate event schema (e.g., push, pull_request, issues) with zod.
  - For push and pull_request events, enqueue the event payload to SQS via SendMessage or s3-sqs-bridge.
  - For issue events (opened or edited), invoke agenticHandler to generate suggestions, then log and return the AI response.
  - Return 200 OK with JSON { message: "received", eventType } on success or 400 on signature or validation failure.

## Secure Event Ingestion HTTP Endpoint (unchanged)
- POST /ingest: validate payload, enqueue to SQS, return 202 Accepted with messageId or appropriate error.

## Dead-Letter Queue (DLQ) Support (unchanged)
- Same behavior: redirect failed records in digestLambdaHandler to DLQ if DLQ_QUEUE_URL is set, increment dead_letter_messages_total counter.

## Prometheus Metrics & Health
- Expose /metrics with counters: processed_events_total, failed_events_total, agentic_requests_total, dead_letter_messages_total, webhook_requests_total, webhook_signature_failures_total, webhook_validation_failures_total, gauge service_uptime_seconds.
- Expose /health returning status, uptime, timestamp.

## CLI Integration
- Introduce --webhook-test flag:
  - Accepts --eventType (push|pull_request|issues) and --payload JSON string or --file path.
  - Computes HMAC signature using GITHUB_WEBHOOK_SECRET and posts to local /webhook handler via HTTP or calls handler directly.
  - Logs success or failure.
- Existing flags (--agentic, --health, --ingest, --purge-dlq) remain and operate as before.

# Testability & Stability

- Unit tests for webhookHandler:
  - Mock Node.js crypto to verify valid and invalid signatures.
  - Test payload schema validation errors and signature failures increment counters.
  - Simulate push, pull_request and issue events and assert correct routing (SQS enqueue or agenticHandler invocation).
- Integration tests with supertest for /webhook, verifying 200 on valid signature, 400 on invalid signature or bad payload.
- Coverage maintained at or above 90% for new code paths.

# Dependencies & Constraints

- Node 20 ESM, built-in crypto for HMAC verification.
- Continue using zod, @aws-sdk/client-sqs or s3-sqs-bridge.
- Do not introduce heavy HTTP frameworks; use built-in http server.

# User Scenarios & Examples

- GitHub Webhook Setup: configure repository webhook to POST to /webhook with secret.
- On push: service enqueues event to SQS and returns 200.
- On issue opened: service invokes agenticHandler and responds with suggestion JSON.
- Local simulation: npx agentic-lib --webhook-test --eventType push --payload '{"ref":"refs/heads/main"}'.

# Verification & Acceptance

- Run npm test to ensure unit and integration tests for webhookHandler, signature verification, and event routing pass.
- Manual test: start HTTP server, curl /webhook with valid signature and payload, verify SQS receive and logs.
- Inspect metrics endpoint for webhook request counters and failure metrics.