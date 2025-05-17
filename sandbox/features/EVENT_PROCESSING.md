# Objective & Scope
Extend the existing event-processing framework to include secure GitHub webhook ingestion, AI-driven suggestions, health monitoring, Prometheus-style metrics, dead-letter queue support, and direct invocation via GitHub Actions workflow_call events. Provide end-to-end handling of GitHub push, pull_request, and issue events through HTTP endpoints, SQS routing, CLI simulation, and GitHub Actions integration.

# Value Proposition

- Seamless ingestion of GitHub webhook events with HMAC signature verification to trigger automated, agentic workflows.
- Unified HTTP server exposing endpoints for agentic suggestions, health, metrics, SQS ingestion, webhook reception, and dead-letter queue management.
- Secure enqueueing of GitHub events into SQS with configurable retry and DLQ behavior.
- CLI commands for local simulation of GitHub events, health checks, SQS ingestion, DLQ purging, and GitHub Actions workflow_call invocation.
- Direct support for GitHub Actions: parse inputs and set outputs to enable workflow_call event handling within JavaScript workflows.
- Maintains minimal dependencies by reusing built-in modules and adding only @actions/core for workflow integration.

# Success Criteria & Requirements

## GitHub Webhook HTTP Endpoint

- HTTP POST /webhook endpoint
  - Validate X-Hub-Signature-256 header against payload using HMAC SHA256 and environment variable GITHUB_WEBHOOK_SECRET.
  - Parse JSON body and validate event schema (push, pull_request, issues) with zod.
  - Enqueue push and pull_request events to SQS via SendMessage or s3-sqs-bridge.
  - For issue events (opened or edited), invoke agenticHandler to generate suggestions, then log and return the AI response.
  - Return 200 OK with JSON { message: "received", eventType } on success or 400 on signature or validation failure.

## GitHub Actions Workflow_Call Invocation

- CLI flag --workflow-call
  - Use @actions/core to retrieve inputs: eventType (push|pull_request|issues), payload (JSON string or file path), workflowSecret (optional override).
  - Compute HMAC signature and route payload through the same internal handlers as /webhook.
  - For push and pull_request inputs, enqueue to SQS; for issues, invoke agenticHandler and capture suggestion.
  - Use core.setOutput for eventType, messageId or suggestion JSON.
  - Fail workflow if signature invalid or validation fails using core.setFailed.

## Secure Event Ingestion HTTP Endpoint

- POST /ingest: validate payload, enqueue to SQS, return 202 Accepted with messageId or appropriate error (unchanged).

## Dead-Letter Queue (DLQ) Support

- Redirect failed records in digestLambdaHandler to DLQ if DLQ_QUEUE_URL is set, increment dead_letter_messages_total counter (unchanged).

## Prometheus Metrics & Health

- Expose /metrics with counters:
  - processed_events_total
  - failed_events_total
  - agentic_requests_total
  - dead_letter_messages_total
  - webhook_requests_total
  - webhook_signature_failures_total
  - webhook_validation_failures_total
  - workflow_call_requests_total
  - workflow_call_failures_total
- Expose /health returning status, uptime, timestamp (unchanged).

## CLI Integration

- Existing flags (--agentic, --health, --ingest, --purge-dlq) remain.
- New --workflow-call flag (as above).
- --webhook-test flag remains for local webhook simulation.

# Testability & Stability

- Unit tests for workflow-call handler:
  - Mock @actions/core to simulate inputs and outputs.
  - Test valid and invalid signature flows, validation failures, and correct routing to SQS or agenticHandler.
- Integration tests with supertest for /webhook and workflow-call CLI invocation via spawn, verifying metrics increment and correct outputs.
- Coverage maintained at or above 90% for new code paths.

# Dependencies & Constraints

- Node 20 ESM, built-in crypto for HMAC verification.
- Continue using zod, @aws-sdk/client-sqs or s3-sqs-bridge.
- Add @actions/core as a dependency for GitHub Actions integration.
- Do not introduce heavy HTTP frameworks; use built-in http server.

# User Scenarios & Examples

- GitHub Webhook Setup: configure repository webhook to POST to /webhook with secret.
- On push: service enqueues event to SQS and returns 200.
- On issue opened: service invokes agenticHandler and responds with suggestion JSON.
- Local simulation: npx agentic-lib --webhook-test --eventType push --payload '{"ref":"refs/heads/main"}'.
- GitHub Actions: in workflow yml, use action with with:eventType=issues, with:payload='{"issue":{...}}', then read outputs in subsequent steps.

# Verification & Acceptance

- Run npm test to ensure unit and integration tests for webhookHandler, workflow-call, signature verification, and event routing pass.
- Manual test: commit action.yml with inputs, run in GitHub Actions to verify outputs and error handling.
- Inspect metrics endpoint for workflow_call_requests_total and failure metrics.