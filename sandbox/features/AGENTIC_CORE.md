# Overview

Enhance the core agentic-lib feature to fully realize GitHub workflow integration alongside existing SQS, Lambda, CLI, and HTTP server capabilities. This update ensures end-to-end support for autonomous issue and pull request operations via both CLI flags and REST endpoints, aligned with our mission to enable continuous, agentic interactions.

# CLI Interface

Extend src/lib/main.js to support new flags in addition to --help, --version, and --digest:
• --github-list-pull-requests <owner> <repo> [state]
  List pull requests for a repository, formatted as JSON lines. Exit code 0 on success, non-zero on error.

• --github-merge-pull-request <owner> <repo> <prNumber> [method]
  Merge a pull request by number using merge, squash, or rebase. Output merge commit details. Exit code 0 on success, non-zero on error.

Preserve early-exit behavior for help, version, and digest flags. Log operations, handle errors with descriptive messages, and increment globalThis.callCount for each action when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose new REST routes alongside /health, /metrics, /openapi.json, and /docs:

• GET  /github/pull-requests    Query params: owner, repo, state. Returns JSON array of pull request objects.

• POST /github/merge-pull-request  JSON body: { owner, repo, prNumber, method }. Returns merge commit details.

Protect these routes with Basic Auth if GITHUB_USER/GITHUB_PASS environment variables are set. Validate request schema with Zod, record HTTP request and failure metrics, and enforce IP rate limiting.

# GitHub API Utilities

Export reusable functions in src/lib/main.js:

• listPullRequests(owner: string, repo: string, state?: string): Promise<Array<object>>
• mergePullRequest(owner: string, repo: string, prNumber: number, method?: "merge" | "squash" | "rebase"): Promise<object>

Implement each with fetch to GITHUB_API_BASE_URL, include retry logic on rate limits, structured logging, and descriptive error handling.

# Success Criteria & Testing

• All existing tests continue passing without modification.

• Add unit tests mocking fetch for listPullRequests and mergePullRequest to simulate success and failure.

• Add unit tests for new CLI flags, verifying console output, exit codes, and error conditions.

• Add sandbox tests for GET /github/pull-requests and POST /github/merge-pull-request, validating status codes, authentication, rate limiting, and response schema.

# Documentation & README Updates

• Update sandbox/README.md Key Features to list new GitHub pull request CLI flags and HTTP endpoints.

• Add usage examples for the new CLI commands in sandbox/docs/SERVER.md under the "CLI Examples" section.

• Update openapi.json to define /github/pull-requests and /github/merge-pull-request operations and schemas.

• Document listPullRequests and mergePullRequest utilities in sandbox/docs/GITHUB_API.md with example JSON payloads and responses.

# Dependencies & Constraints

• Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and openapi.json.

• Use global fetch and no additional dependencies.

• Maintain ESM compatibility, existing coding style, and mission alignment.