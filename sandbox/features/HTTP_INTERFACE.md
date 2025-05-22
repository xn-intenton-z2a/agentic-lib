# Objective & Scope

Provide a unified HTTP interface and complementary CLI flags to expose core agentic-lib functionality without adding new files beyond source, tests, README, and package.json. This feature covers service health, digest processing, webhook intake, mission and feature discovery, and in-memory runtime metrics in a single Express application.

# Value Proposition

- Simplify integration by allowing external systems to invoke workflows via REST or CLI
- Enable local testing and debugging alongside CI pipelines
- Offer built-in observability through uptime and invocation metrics without external dependencies
- Maintain all logic within existing sandbox source, tests, documentation, and dependencies

# API Endpoints

## GET /health

Return a JSON object with service status and uptime in seconds. Useful for readiness and liveness checks.

## POST /digest

Accept a JSON payload matching the digest schema (key, value, lastModified). Internally invoke createSQSEventFromDigest and digestLambdaHandler. Return batchItemFailures and handler info on success or a 400 error with a detailed message on failure.

## POST /webhook

Receive any JSON payload, log the content via logInfo, and respond with status received. Always return HTTP 200.

## GET /mission

Read and return the full contents of MISSION.md as a JSON string. Allow tools to discover project intent programmatically.

## GET /features

List available feature files in sandbox/features. For each feature, return its name, title (first heading), and description (paragraph under the heading).

## GET /stats

Return runtime metrics including uptime and counters for digestInvocations, digestErrors, webhookInvocations, webhookErrors, featuresRequests, and missionRequests. Provide visibility into usage and error rates.

# CLI Flags

- --serve or --http: Start the HTTP server on the specified port
- --mission: Print the mission statement as JSON and exit
- --features: Print the list of features with name, title, and description as JSON and exit
- --stats: Print current uptime and metrics as JSON and exit

# Success Criteria & Requirements

- The Express app must respond correctly on all endpoints with appropriate HTTP codes and JSON shapes
- CLI flags must output valid JSON to stdout, exit code 0 on success, and no output on stderr
- All counters must increment correctly through endpoint invocations
- Integration tests using supertest and Vitest exec must cover each endpoint and CLI flag under normal and error conditions
- README and sandbox/docs must include usage examples for each endpoint and flag
- No modifications outside sandbox/source, sandbox/tests, sandbox/docs, README, or package.json

# Verification & Acceptance

1. Run npm run start:http; exercise each endpoint via curl and verify JSON responses and metrics changes
2. Execute npm test; ensure new and existing tests pass without errors
3. Run node sandbox/source/main.js --mission, --features, and --stats; verify output matches API response shapes