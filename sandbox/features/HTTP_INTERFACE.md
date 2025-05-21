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
