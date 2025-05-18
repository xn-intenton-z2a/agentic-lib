# Overview

Enhance the core agentic-lib feature to fully integrate GitHub issue and pull request lifecycle management alongside existing SQS, Lambda, CLI, and HTTP server capabilities. This update empowers autonomous workflows to list, create, and merge GitHub issues and pull requests via CLI flags and REST endpoints, aligned with our mission to enable continuous agentic interactions.

# CLI Interface

Extend src/lib/main.js to support new flags in addition to --help, --version, --digest, --github-list-pull-requests, and --github-merge-pull-request:
• --github-list-issues <owner> <repo> [state]
  List issues for a repository, formatted as JSON lines. Exit code 0 on success, non-zero on error.

• --github-create-issue <owner> <repo> <title> [body]
  Create a new issue with title and optional body. Output created issue details as JSON. Exit code 0 on success, non-zero on error.

Maintain existing flag behavior, error logging, and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose new REST routes alongside existing /health, /metrics, /openapi.json, /docs, /github/pull-requests, and /github/merge-pull-request:

• GET  /github/issues    Query params: owner, repo, state
  Returns JSON array of issue objects.

• POST /github/issues    JSON body: { owner, repo, title, body }
  Returns created issue details as JSON.

Protect these routes with Basic Auth if GITHUB_USER/GITHUB_PASS are set. Validate request schema with Zod, record HTTP request and failure metrics, and enforce IP rate limiting.

# GitHub API Utilities

Export reusable functions in src/lib/main.js for issue management:
• listIssues(owner: string, repo: string, state?: string): Promise<Array<object>>
• createIssue(owner: string, repo: string, title: string, body?: string): Promise<object>

Implement API calls using fetch to GITHUB_API_BASE_URL with retry logic on rate limits, structured logging, and descriptive error handling.

# Success Criteria & Testing

• All existing tests continue passing without modification.
• Add unit tests mocking fetch for listIssues and createIssue to simulate success and failure.
• Add unit tests for new CLI flags, verifying console output, exit codes, and error conditions.
• Add sandbox tests for GET /github/issues and POST /github/issues, validating status codes, authentication, rate limiting, and response schema.

# Documentation & README Updates

• Update sandbox/README.md Key Features to list new GitHub issue CLI flags and HTTP endpoints.
• Add usage examples for new CLI commands in sandbox/docs/SERVER.md under CLI Examples.
• Update openapi.json to define /github/issues GET and POST operations and schemas.
• Document listIssues and createIssue utilities in sandbox/docs/GITHUB_API.md with example JSON payloads and responses.

# Dependencies & Constraints

• Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and openapi.json.
• Use global fetch and no additional dependencies.
• Maintain ESM compatibility, existing coding style, and mission alignment.