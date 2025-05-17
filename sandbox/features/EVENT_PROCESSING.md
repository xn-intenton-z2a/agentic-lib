# Objective & Scope
Extend the HTTP server, CLI library, and AWS Lambda handler to deliver AI-driven suggestions, health monitoring, Prometheus-style metrics, secure event ingestion, and dead-letter queue support. This unified feature ensures robust event handling, real-time service health insights, operational visibility, SQS-backed ingestion, and automatic handling of failed records via a configurable DLQ.

# Value Proposition

- Provides contextual AI suggestions via the agenticHandler for GitHub issues or identifiers.
- Exposes built-in health and metrics endpoints to monitor service availability, event throughput, failure rates, and dead-letter queue usage.
- Supplies a secure HTTP ingestion endpoint that validates payloads and enqueues them into SQS.
- Automatically routes failed records to a configurable dead-letter queue (DLQ) for later inspection and reprocessing.
- Extends CLI with flags for agentic suggestions, health checks, secure event ingestion simulation, and dead-letter queue management.
- Maintains a minimal dependency footprint, leveraging zod for validation and @aws-sdk/client-sqs or s3-sqs-bridge for SQS integration.

# Success Criteria & Requirements

## Agentic Handler Implementation
- Async function agenticHandler(payload) in src/lib/main.js remains as defined: calls OpenAI ChatCompletion, parses JSON response, returns { suggestion, refinement, metadata, handler }.

## Secure Event Ingestion HTTP Endpoint
- POST /ingest: validate JSON body against a zod schema (e.g., { key: string, value: string, lastModified: string }).
- Enqueue validated payload to SQS using @aws-sdk/client-sqs SendMessage or s3-sqs-bridge sendToQueue function.
- Return 202 Accepted with JSON { message: "enqueued", messageId } on success or 400/500 on error.

## Dead-Letter Queue (DLQ) Support
- Accept optional environment variable DLQ_QUEUE_URL for the dead-letter queue URL.
- In digestLambdaHandler, on JSON parse or processing error, if DLQ_QUEUE_URL is set, send the raw record body to the DLQ using SQSClient and SendMessageCommand.
- If DLQ_QUEUE_URL is not set, fallback to returning batchItemFailures so AWS can reprocess.
- Expose new Prometheus counter dead_letter_messages_total incremented for each record redirected to the DLQ.

## CLI Integration
- processAgentic(args): supports --agentic with --issueUrl or --id flags, invokes agenticHandler, logs via logInfo.
- Expose new --health flag: print JSON { status: "ok", uptime, processedEvents, failedEvents, deadLetterMessages } and return before other flags.
- Introduce --ingest flag: accepts --payload JSON string or --file path, constructs an SQS event, calls digestLambdaHandler or direct SendMessage, logs outcome, and returns true.
- Introduce --purge-dlq flag: accepts --queueUrl, retrieves all messages from the specified DLQ, deletes them, and logs the count of purged messages.

## HTTP Endpoints
- POST /agentic: validate with zod, invoke agenticHandler, return 200 with JSON payload or appropriate error codes.
- GET /health: return 200 with JSON { status: "ok", uptime: number, timestamp: string }.
- GET /metrics: return 200 with text/plain Prometheus metrics including counters processed_events_total, failed_events_total, agentic_requests_total, dead_letter_messages_total and gauge service_uptime_seconds.
- GET /dlq-metrics: return 200 with JSON { deadLetterMessages: number }.
- POST /ingest: as defined above under Secure Event Ingestion.

# Testability & Stability

- Unit tests for agenticHandler: mock OpenAIApi for valid/malformed JSON and error paths.
- Unit tests for digestLambdaHandler: mock SQSClient to verify batchItemFailures and DLQ send logic when DLQ_QUEUE_URL is set and unset.
- Unit tests for processAgentic, processHealth, processIngest, processPurgeDlq CLI flows: simulate args, mock SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand, assert logs and exit behavior.
- Integration tests using supertest for /agentic, /health, /metrics, /dlq-metrics, /ingest: cover success, validation failures, DLQ routing, and queue errors.
- Maintain coverage above 90% for new code paths.

# Dependencies & Constraints

- Use Node 20 ESM and built-in http server.
- Continue using zod for schema validation and existing logInfo/logError utilities.
- Add @aws-sdk/client-sqs for SQS message publishing, receiving, and deletion.
- Do not introduce heavyweight HTTP frameworks or telemetry tools; keep dependencies minimal.

# User Scenarios & Examples

- CLI health check: npx agentic-lib --health outputs service status, counters, and dead-letter message count.
- CLI ingest simulation: npx agentic-lib --ingest --payload '{"key": "events/1.json","value":"12345","lastModified":"2024-01-01T00:00:00Z"}'.
- CLI purge DLQ: npx agentic-lib --purge-dlq --queueUrl https://sqs.us-east-1.amazonaws.com/123456789012/my-dlq.
- Metrics scraping: GET /metrics returns Prometheus exposition format for automated monitoring including dead_letter_messages_total.
- DLQ metrics: GET /dlq-metrics returns { deadLetterMessages: 42 }.
- HTTP ingestion: POST /ingest with valid payload returns 202 and messageId; invalid payload returns 400.

# Verification & Acceptance

- Run npm test to ensure unit and integration tests for health, metrics, agentic, ingestion, and DLQ features pass.
- Manual test: start HTTP server, curl /ingest, /health, /metrics, /dlq-metrics, verify responses.
- Inspect logs for structured JSON entries at info and error levels for ingestion, health checks, and DLQ operations.
