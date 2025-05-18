# HTTP Server with GitHub Integration

## Mission Alignment

This feature extends the existing HTTP server to expose core GitHub operations alongside observability endpoints, enabling autonomous workflows to interact with GitHub issues, branches, and pull requests programmatically.

## Endpoints

- GET /health  
  Returns JSON with status, uptime, and timestamp for liveness checks.

- GET /metrics  
  Protected by Basic Auth if METRICS_USER and METRICS_PASS are set. Returns Prometheus-formatted metrics including http_requests_total, http_request_failures_total, github_issue_summaries_total, github_branches_created_total, and github_pulls_created_total.

- GET /openapi.json  
  Returns updated OpenAPI 3.0 schema reflecting all endpoints.

- GET /docs  
  Protected by Basic Auth if DOCS_USER and DOCS_PASS are set. Renders interactive HTML documentation from the OpenAPI schema.

- POST /issues/summarize  
  Request JSON: { owner: string, repo: string, issueNumbers: number[] }  
  Validates input with Zod. Fetches issue data via GitHub REST API. Calls OpenAI chat to generate concise summaries. Returns { summaries: { issueNumber: number, summary: string }[] }.

- POST /branches  
  Request JSON: { owner: string, repo: string, branchName: string, baseRef?: string }  
  Validates input. Creates a new branch via GitHub REST API. Returns { owner: string, repo: string, branch: string }.

- POST /pulls  
  Request JSON: { owner: string, repo: string, head: string, base: string, title: string, body: string }  
  Validates input. Opens a pull request via GitHub REST API. Returns { url: string, number: number }.

## Validation & Security

1. All request bodies are validated with Zod schemas.  
2. Enforce Access-Control-Allow-Origin header using CORS_ALLOWED_ORIGINS.  
3. IP-based token bucket rate limiter per RATE_LIMIT_REQUESTS.  
4. Protect /metrics and /docs with Basic Auth when credentials are configured.

## Metrics & Instrumentation

- Use recordRequest and recordFailure utilities for all routes.  
- Introduce counters: github_issue_summaries_total, github_branches_created_total, github_pulls_created_total.  
- Expose all counters in the /metrics response.

## Testing & Success Criteria

- Add tests in sandbox/tests/server.test.js for POST /issues/summarize, POST /branches, and POST /pulls covering:  
  • Successful responses with valid inputs.  
  • Validation errors for missing or invalid fields.  
  • Authentication failures on protected endpoints.  
  • Rate limiting behavior returning 429 status.  
- Verify existing tests for GET /health and GET /metrics continue to pass.  
- Confirm metrics counters increment correctly for each endpoint.

## Documentation & README Updates

- Update sandbox/docs/SERVER.md to document the new GitHub integration endpoints and new metrics counters.  
- Refresh OpenAPI schema in code to include new routes and ensure /openapi.json and /docs reflect updates.  
- Amend sandbox/README.md Key Features section to list HTTP endpoints for issue summarization, branch creation, and pull request creation.