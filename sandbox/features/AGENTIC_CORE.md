# Overview

Enhance the core agentic-lib feature to add GitHub Webhook ingestion, extending the existing issue and pull request lifecycle management, AI chat completions, SQS, Lambda, CLI, and HTTP server capabilities. This feature enables real-time, event-driven agentic workflows by validating and processing incoming GitHub webhook events, automatically enqueuing them for downstream processing.

# CLI Interface

Extend src/lib/main.js with a new flag in addition to existing ones:

- --github-simulate-webhook <eventFile>  Read a local JSON file representing a GitHub webhook payload, sign it using GITHUB_WEBHOOK_SECRET (from environment), and POST it to http://localhost:<PORT>/webhook/github. Output HTTP response status and body as JSON. Exit code 0 on success, non-zero on error.

Maintain existing error logging and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose a new route alongside existing endpoints:

- POST /webhook/github  Headers: X-Hub-Signature-256 containing HMAC sha256 signature of the raw JSON body using GITHUB_WEBHOOK_SECRET. JSON body: any payload from GitHub events. Workflow:
  1. Reject if signature header is missing or invalid, respond 401 Unauthorized.
  2. Validate rate limit by IP; on exceed respond 429.
  3. On valid request, record a new metric http_requests_total{method="POST",route="webhook",status="200"}.
  4. Enqueue the raw payload to SQS by calling createSQSEventFromDigest or invoking digestLambdaHandler directly.
  5. Respond 200 with { delivered: true, eventType: <X-GitHub-Event header> }.

Ensure signature verification using new utility verifyWebhookSignature.
All existing HTTP endpoints remain unchanged, including rate limiting, authentication, schema validation, and metrics.

# API Utilities

Export reusable functions in src/lib/main.js:

- verifyWebhookSignature(rawPayload: string, signature: string, secret: string): boolean  Validate HMAC sha256 signature header against raw payload and secret.
- handleWebhookEvent(payload: object, headers: object): Promise<object>  Validate signature, enqueue event, and return processing result.

Each utility uses crypto HMAC sha256, structured logging via logInfo and logError, and clear error messages on failure.

# Success Criteria & Testing

- All existing tests must pass without modification.
- Add unit tests for verifyWebhookSignature covering valid and invalid signatures.
- Add unit tests for handleWebhookEvent mocking SQS and digestLambdaHandler behavior.
- Add CLI tests for --github-simulate-webhook verifying file reading, signature creation, HTTP request, console output, exit codes, and error handling under invalid inputs.
- Add sandbox tests for POST /webhook/github validating status codes, signature failures, rate limiting, metrics recording, and payload forwarding.

# Documentation & README Updates

- Update sandbox/README.md Key Features to include GitHub Webhook ingest capability.
- Add examples for simulate-webhook in sandbox/docs/SERVER.md under CLI Examples and HTTP Examples.
- Document verifyWebhookSignature and handleWebhookEvent in sandbox/docs/OPENAPI_API.md or a new sandbox/docs/WEBHOOKS.md with example payloads and usage.

# Dependencies & Constraints

- Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and package.json.
- Introduce no new runtime dependencies; use built-in crypto for HMAC sha256. Use only existing dependencies: crypto, fetch, openai, zod.
- Maintain ESM compatibility, existing coding style, and alignment with the mission statement.