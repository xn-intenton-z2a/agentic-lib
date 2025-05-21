# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-21T23:53:05.788Z

Maintained feature HTTP_INTERFACE.

Feature spec:

# Objective & Scope

Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows.

# Value Proposition

- Enables easy integration with third-party tools by issuing HTTP requests instead of CLI calls
- Simplifies local testing and debugging through a listen-and-serve model
- Supports health checks and secure webhook ingestion for automated pipelines

# API Endpoints

## GET /health

Returns a JSON object indicating service health and uptime. Useful for readiness and liveness probes in containerized environments.

## POST /digest

Accepts a JSON payload matching the existing digest schema. Internally calls createSQSEventFromDigest and digestLambdaHandler, returning batchItemFailures and handler info.

## POST /webhook

Receives arbitrary JSON (e.g., GitHub webhook payload), logs the payload, and responds with a 200 status. Provides an extensibility point for future event handling or routing logic.

# Success Criteria & Requirements

- Service starts when invoked with a new CLI flag --serve or --http
- Endpoints respond with appropriate HTTP status codes and JSON payloads
- Integration tests using supertest validate each endpoint under normal and error conditions
- No changes outside main source, test suite, README, or package.json

# Verification & Acceptance

- Unit tests cover handler logic via supertest against the live Express app
- README updated with usage instructions for HTTP mode, including example curl commands
- package.json scripts updated (for example, "start:http": "node src/lib/main.js --serve")


Git diff:

```diff
\n\n// New [sandbox/features/HTTP_INTERFACE.md]:\n# Objective & Scope

Provide a built-in HTTP interface that allows external systems (for example, CI pipelines or webhook providers) to invoke core agentic-lib functionality via REST endpoints. This feature leverages the existing Express dependency without introducing new files beyond source, test, README, and package.json, and it remains fully compatible with GitHub Actions workflows.

# Value Proposition

- Enables easy integration with third-party tools by issuing HTTP requests instead of CLI calls
- Simplifies local testing and debugging through a listen-and-serve model
- Supports health checks and secure webhook ingestion for automated pipelines

# API Endpoints

## GET /health

Returns a JSON object indicating service health and uptime. Useful for readiness and liveness probes in containerized environments.

## POST /digest

Accepts a JSON payload matching the existing digest schema. Internally calls createSQSEventFromDigest and digestLambdaHandler, returning batchItemFailures and handler info.

## POST /webhook

Receives arbitrary JSON (e.g., GitHub webhook payload), logs the payload, and responds with a 200 status. Provides an extensibility point for future event handling or routing logic.

# Success Criteria & Requirements

- Service starts when invoked with a new CLI flag --serve or --http
- Endpoints respond with appropriate HTTP status codes and JSON payloads
- Integration tests using supertest validate each endpoint under normal and error conditions
- No changes outside main source, test suite, README, or package.json

# Verification & Acceptance

- Unit tests cover handler logic via supertest against the live Express app
- README updated with usage instructions for HTTP mode, including example curl commands
- package.json scripts updated (for example, "start:http": "node src/lib/main.js --serve")
```

LLM API Usage:

```json
{"prompt_tokens":6158,"completion_tokens":1194,"total_tokens":7352,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":768,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

