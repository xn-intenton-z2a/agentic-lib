# Overview

Enhance the core agentic-lib feature to fully integrate GitHub issue and pull request lifecycle management alongside existing SQS, Lambda, CLI, and HTTP server capabilities. This update empowers autonomous workflows to list, create, and merge GitHub issues and pull requests via CLI flags and REST endpoints, aligned with our mission to enable continuous agentic interactions.

# CLI Interface

Extend src/lib/main.js to support new flags in addition to --help, --version, --digest, --github-list-pull-requests, --github-merge-pull-request, --github-list-issues, and --github-create-issue:

• --github-create-pull-request <owner> <repo> <head> <base> <title> [body]
  Create a new pull request from branch head into base branch with title and optional body. Output created pull request details as JSON. Exit code 0 on success, non-zero on error.

Maintain existing flag behavior, error logging, and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose new REST routes alongside existing /health, /metrics, /openapi.json, /docs, /github/issues, /github/pull-requests, and /github/merge-pull-request:

• POST /github/pull-requests
  JSON body: { owner, repo, head, base, title, body }
  Creates a new pull request on the specified repository. Returns created pull request details as JSON. Exit code 200 on success, 4xx or 5xx on error.

Protect this route with Basic Auth if GITHUB_USER/GITHUB_PASS are set. Validate request schema with Zod, record HTTP request and failure metrics, and enforce IP rate limiting.

# GitHub API Utilities

Export reusable functions in src/lib/main.js for pull request creation:

• createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body?: string): Promise<object>

Reuse fetch to GITHUB_API_BASE_URL with retry logic on rate limits, structured logging, and descriptive error handling. Ensure existing listIssues, createIssue, listPullRequests, and mergePullRequest utilities remain available.

# Success Criteria & Testing

• All existing tests continue passing without modification.
• Add unit tests mocking fetch for createPullRequest to simulate success and failure.
• Add unit tests for new CLI flag, verifying console output, exit code, and error conditions.
• Add sandbox tests for POST /github/pull-requests, validating status codes, authentication, rate limiting, and response schema.

# Documentation & README Updates

• Update sandbox/README.md Key Features to list new GitHub CLI flag and HTTP endpoint for create pull request.
• Add usage examples for --github-create-pull-request in sandbox/docs/SERVER.md under CLI Examples and HTTP Examples.
• Update openapi.json to define POST /github/pull-requests operation and request/response schemas.
• Document createPullRequest utility in sandbox/docs/GITHUB_API.md with example JSON payloads and responses.

# Dependencies & Constraints

• Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and openapi.json.
• Use global fetch and no additional dependencies.
• Maintain ESM compatibility, existing coding style, and mission alignment.