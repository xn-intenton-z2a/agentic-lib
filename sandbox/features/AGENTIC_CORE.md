# Mission Alignment

Extend the built-in HTTP server to deliver full GitHub automation and observability. Provide endpoints for health, metrics, OpenAPI, interactive docs, GitHub issue summarization, issue and branch lifecycle operations, pull request management, and GitHub webhook event handling. Aligns with the mission to enable continuous, autonomous workflows via GitHub API interactions.

# Overview

Enhance the existing HTTP server in sandbox/source/server.js to offer a comprehensive REST interface for automated GitHub operations, with full request validation, security controls, rate limiting, and observability. Provide programmatic access to create and manage issues, branches, pull requests, merges, and process incoming GitHub webhooks to trigger automated reactions.

# Endpoints

- GET /health
  Returns service status, uptime, and timestamp for liveness checks.

- GET /metrics
  Returns Prometheus metrics including http_requests_total, http_request_failures_total, github_issue_summaries_total, github_issues_created_total, github_branches_created_total, github_pulls_created_total, github_pulls_merged_total, github_webhooks_received_total, github_webhooks_processed_total, github_webhook_failures_total. Protected by Basic Auth when METRICS_USER and METRICS_PASS are configured.

- GET /openapi.json
  Returns the OpenAPI 3.0 schema covering all endpoints.

- GET /docs
  Renders interactive HTML documentation from the OpenAPI schema. Protected by Basic Auth when DOCS_USER and DOCS_PASS are configured.

- POST /issues/summarize
  Accepts JSON payload with repository owner, name, and array of issue numbers. Summarizes issue bodies using OpenAI. Increments github_issue_summaries_total.

- POST /issues/create
  Accepts JSON payload with repository owner, name, title, and body. Creates a GitHub issue via REST API. Increments github_issues_created_total.

- POST /issues/update
  Accepts JSON payload with owner, repo, issue_number, state or body fields. Updates issue state or body. Increments github_issues_created_total for state changes.

- POST /branches
  Accepts JSON payload with owner, repo, base, and newBranchName. Creates a new branch off base. Increments github_branches_created_total.

- POST /pulls
  Accepts JSON payload with owner, repo, head, base, title, and body. Creates a pull request. Increments github_pulls_created_total.

- POST /pulls/merge
  Accepts JSON payload with owner, repo, pull_number, merge_method. Merges the specified pull request. Increments github_pulls_merged_total.

- POST /webhooks/github
  Listens for GitHub webhook events: push, issues, pull_request. Validates X-Hub-Signature-256 header; rejects invalid signatures. Emits metrics: github_webhooks_received_total, github_webhooks_processed_total, github_webhook_failures_total. Dispatches to internal handlers to trigger automated workflows (e.g., branch creation on push, issue summarization on issue open).

# Validation & Security

1. Validate all request bodies using Zod schemas.
2. Verify webhook signatures with HMAC SHA256 using GITHUB_WEBHOOK_SECRET; invalid signatures return 401.
3. Enforce CORS using CORS_ALLOWED_ORIGINS.
4. Apply IP-based token bucket rate limiter configured by RATE_LIMIT_REQUESTS; excess requests return 429.
5. Protect /metrics and /docs with Basic Auth when credentials are set.

# Metrics & Instrumentation

- Use recordRequest and recordFailure utilities for every route.
- Add counters for GitHub interactions and webhook handling:
  • github_issue_summaries_total
  • github_issues_created_total
  • github_branches_created_total
  • github_pulls_created_total
  • github_pulls_merged_total
  • github_webhooks_received_total
  • github_webhooks_processed_total
  • github_webhook_failures_total
- Expose all counters in /metrics.

# Testing & Success Criteria

- Add unit tests for each new endpoint verifying:
  • Successful responses with mocked GitHub and OpenAI clients.
  • Validation errors for malformed payloads.
  • Authentication failures for metrics/docs.
  • Rate limit enforcement.
  • Webhook signature validation errors and processing flows.
- Verify metrics counters increment correctly under both success and failure scenarios.
- Ensure existing GET endpoint tests continue passing.

# Documentation & README Updates

- Update sandbox/docs/SERVER.md to document all new endpoints, their payloads, response formats, and required headers.
- Refresh OpenAPI schema in code and documentation to include new routes and components.
- Amend sandbox/README.md Key Features section to list GitHub issue summarization, issue/branch/pull request management, and webhook-driven automation.