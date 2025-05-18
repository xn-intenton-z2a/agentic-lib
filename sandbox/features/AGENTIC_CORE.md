# Mission Alignment

This feature extends the built-in HTTP server to provide essential observability and core GitHub operations, enabling autonomous workflows to manage issues, branches, and pull requests directly through a REST interface.

# Overview

The HTTP server exposes health checks, metrics, documentation, and programmatic GitHub interaction endpoints. All operations are validated, rate-limited, and instrumented to support reliable, observability-driven automation aligned with the agentic-lib mission.

# Endpoints

- GET /health
  Returns JSON with status, uptime, and timestamp for liveness checks.

- GET /metrics
  Returns Prometheus-formatted metrics: http_requests_total, http_request_failures_total, github_issue_summaries_total, github_issues_created_total, github_branches_created_total, github_pulls_created_total.  Protected by Basic Auth when METRICS_USER and METRICS_PASS are set.

- GET /openapi.json
  Returns the updated OpenAPI 3.0 schema reflecting all endpoints.

- GET /docs
  Renders interactive HTML documentation from the OpenAPI schema.  Protected by Basic Auth when DOCS_USER and DOCS_PASS are set.

- POST /issues/summarize
  Request JSON: owner:string, repo:string, issueNumbers:number[].  Validated with Zod.  Fetches issue data via GitHub REST API, calls OpenAI chat for concise summaries, returns summaries array.

- POST /issues/create
  Request JSON: owner:string, repo:string, title:string, body?:string.  Validated with Zod.  Creates a new issue via GitHub REST API, returns URL and number.

- POST /branches
  Request JSON: owner:string, repo:string, branchName:string, baseRef?:string.  Validated.  Creates a branch via GitHub REST API, returns owner, repo, branch.

- POST /pulls
  Request JSON: owner:string, repo:string, head:string, base:string, title:string, body:string.  Validated.  Opens a pull request via GitHub REST API, returns URL and number.

# Validation & Security

1. All request bodies are validated with Zod schemas.
2. CORS headers enforced using CORS_ALLOWED_ORIGINS.
3. IP-based token bucket rate limiter with limit from RATE_LIMIT_REQUESTS.
4. Basic Auth protection for /metrics and /docs when credentials are configured.

# Metrics & Instrumentation

- Use recordRequest and recordFailure utilities for every route.
- Counters:
  • http_requests_total
  • http_request_failures_total
  • github_issue_summaries_total
  • github_issues_created_total
  • github_branches_created_total
  • github_pulls_created_total
- Expose all counters in /metrics.

# Testing & Success Criteria

- Add tests covering:
  • GET /health returns status ok.
  • GET /metrics returns metrics and enforces auth when configured.
  • Validation errors for missing or invalid fields on all POST endpoints.
  • Successful responses for each POST endpoint with mocked GitHub and OpenAI APIs.
  • Rate limit behavior returning 429 status when exceeded.
- Verify existing tests continue passing.
- Ensure metrics counters increment correctly for each operation.

# Documentation & README Updates

- Update sandbox/docs/SERVER.md to document new endpoints and metrics.
- Refresh OpenAPI schema to include GitHub routes.
- Amend sandbox/README.md Key Features section to list GitHub issue summarization, issue creation, branch creation, and pull request creation endpoints.
