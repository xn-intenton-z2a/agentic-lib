# Overview

Extend the core agentic-lib feature to support AI-driven GitHub issue summarization and commentary, building upon existing webhook ingestion, SQS, Lambda, CLI, and HTTP server capabilities. This addition enables users to fetch open issues from a repository, generate natural language summaries via OpenAI chat completions, and optionally post summaries as comments on GitHub issues, all through CLI flags or HTTP endpoints.

# CLI Interface

Extend src/lib/main.js with two new flags alongside existing ones:

- --summarize-issues <owner/repo>  Fetch all open issues from the specified repository using GITHUB_API_BASE_URL and GITHUB_API_TOKEN, call summarizeIssues utility, and output the summary text as JSON to stdout. Exit code 0 on success, non-zero on error.
- --post-comment <issueNumber>  When used together with --summarize-issues, post the generated summary as a comment to the specified issue number via GitHub REST API. Use GITHUB_API_TOKEN for authentication.

Maintain existing error logging, structured output, and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose a new route alongside existing endpoints:

- GET /issues/summary  Query parameters: repo=<owner/repo>, token=<GITHUB_API_TOKEN>. Workflow:
  1. Reject if token or repo parameter missing or if token does not match GITHUB_API_TOKEN in environment; respond 401 Unauthorized.
  2. Validate rate limit by IP; on exceed respond 429.
  3. On valid request, record metric http_requests_total{method="GET",route="issues/summary",status="200"}.
  4. Invoke summarizeIssues(owner, repo) utility to generate a summary.
  5. Respond 200 with JSON { repo: "owner/repo", summary: <string> }.

Ensure existing HTTP endpoints remain unchanged, including rate limiting, authentication, schema validation, and metrics.

# GitHub Issue Summarization Utilities

Export new reusable functions in src/lib/main.js:

- summarizeIssues(owner: string, repo: string): Promise<string>  Fetch open issues via REST API, construct a prompt listing issue titles and bodies, call OpenAIApi.createChatCompletion to generate a concise summary, and return the summary text.
- postIssueComment(owner: string, repo: string, issueNumber: number, body: string): Promise<object>  Post a comment to the specified issue via GitHub REST API, using fetch and GITHUB_API_TOKEN, and return the API response object.

Use structured logging via logInfo and logError, clear error messages on failure, and built-in crypto or fetch for HTTP calls.

# Success Criteria & Testing

- All existing tests must pass without modification.
- Add unit tests for summarizeIssues mocking GitHub API and OpenAIApi behavior, verifying prompt construction and summary return.
- Add unit tests for postIssueComment mocking fetch to GitHub, verifying correct payload and URL.
- Add CLI tests for --summarize-issues and --summarize-issues with --post-comment, verifying output, exit codes, and error handling under invalid inputs.
- Add sandbox tests for GET /issues/summary validating status codes for missing parameters, authentication failures, rate limiting, metrics recording, and successful summary response.

# Documentation & README Updates

- Update sandbox/README.md Key Features to include GitHub Issue Summarization capability.
- Add examples for summarize-issues and post comments under CLI Examples in sandbox/docs/SERVER.md.
- Create sandbox/docs/ISSUE_SUMMARIES.md with API reference, usage scenarios, sample request and response, and environment variable requirements.

# Dependencies & Constraints

- Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and package.json.
- Introduce no new runtime dependencies; use existing openai, fetch, and built-in crypto if needed. If fetch is not globally available, use node's experimental fetch or add isomorphic-fetch as dev dependency.
- Maintain ESM compatibility, existing coding style, and alignment with the mission statement.