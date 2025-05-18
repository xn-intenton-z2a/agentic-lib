# Mission Alignment

This feature extends the built-in HTTP server to provide essential observability, core GitHub operations, webhook-driven event handling, and autonomous workflow management. It enables summarization, creation, update, and full lifecycle control of GitHub issues, branches, pull requests, merges, and automated reactions to webhook events directly through a REST interface.

# Overview

The HTTP server exposes health checks, metrics, documentation, programmatic GitHub interaction endpoints, and a secure GitHub webhook listener. All operations are validated, rate-limited, signature-verified, and instrumented to support reliable, observability-driven automation aligned with the agentic-lib mission.

# Endpoints

- GET /health
  Returns JSON with status, uptime, and timestamp for liveness checks.

- GET /metrics
  Returns Prometheus-formatted metrics: http_requests_total, http_request_failures_total, github_issue_summaries_total, github_issues_created_total, github_branches_created_total, github_pulls_created_total, github_pulls_merged_total, github_webhooks_received_total, github_webhooks_processed_total, github_webhook_failures_total. Protected by Basic Auth when METRICS_USER and METRICS_PASS are set.

- GET /openapi.json
  Returns the updated OpenAPI 3.0 schema reflecting all endpoints.

- GET /docs
  Renders interactive HTML documentation from the OpenAPI schema. Protected by Basic Auth when DOCS_USER and DOCS_PASS are set.

- POST /issues/summarize
  Summarizes GitHub issues via OpenAI for concise descriptions.

- POST /issues/create
  Creates a new GitHub issue.

- POST /issues/update
  Updates issue state or body.

- POST /branches
  Creates a new Git branch.

- POST /pulls
  Opens a new pull request.

- POST /pulls/merge
  Merges an existing pull request using merge, squash, or rebase.

- POST /webhooks/github
  Receives GitHub webhook events. Validates X-Hub-Signature-256 header using GITHUB_WEBHOOK_SECRET. Supports push events (to trigger branch or CI workflows), issues events (opened, edited, closed), pull_request events (opened, reopened, closed, merged). Parses payload, records metrics, and dispatches to internal handlers for automated workflows.

# Validation & Security

1. All request bodies are validated with Zod schemas.
2. Webhook payload signatures verified using HMAC SHA256 against GITHUB_WEBHOOK_SECRET; invalid signatures yield 401 Unauthorized.
3. CORS headers enforced using CORS_ALLOWED_ORIGINS.
4. IP-based token bucket rate limiter with limit from RATE_LIMIT_REQUESTS.
5. Basic Auth protection for /metrics and /docs when credentials are configured.

# Metrics & Instrumentation

- Use recordRequest and recordFailure utilities for every route.
- Additional counters for webhooks:
  • github_webhooks_received_total
  • github_webhooks_processed_total
  • github_webhook_failures_total
- Expose all counters in /metrics.

# Testing & Success Criteria

- Add tests covering:
  • GET /health returns status ok.
  • GET /metrics returns full set of metrics and enforces auth when configured.
  • Validation and signature errors for POST /webhooks/github: missing header, invalid signature.
  • Successful processing of push, issues, and pull_request webhook payloads with mocked event handlers.
  • Metrics counters increment correctly for webhook events and failure scenarios.
  • All existing POST endpoint tests continue passing with mocks for GitHub and OpenAI.
  • Rate limit behavior returning 429 when exceeded.

# Documentation & README Updates

- Update sandbox/docs/SERVER.md to document the /webhooks/github endpoint, its headers, and supported event types.
- Refresh OpenAPI schema to include the webhook listener route and its security scheme.
- Amend sandbox/README.md Key Features section to list GitHub webhook support and the new metrics counters.
