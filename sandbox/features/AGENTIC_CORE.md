# Overview

Enhance the core agentic-lib feature to fully integrate GitHub issue and pull request lifecycle management alongside existing SQS, Lambda, CLI, and HTTP server capabilities. This update empowers autonomous workflows to list, create, and merge GitHub issues and pull requests via CLI flags and REST endpoints, aligned with our mission to enable continuous agentic interactions.

# CLI Interface

Extend src/lib/main.js to support these new flags in addition to --help, --version, and --digest:

• --github-list-issues <owner> <repo>  List issues in the specified repository and output as JSON. Exit code 0 on success, non-zero on error.

• --github-create-issue <owner> <repo> <title> [body]  Create a new issue with given title and optional body. Output created issue details as JSON.

• --github-list-pull-requests <owner> <repo>  List open pull requests in the specified repository. Output as JSON.

• --github-create-pull-request <owner> <repo> <head> <base> <title> [body]  Create a pull request from head into base branch with title and optional body. Output created pull request details as JSON.

• --github-merge-pull-request <owner> <repo> <pull_number>  Merge the specified pull request. Output merge result as JSON.

Maintain existing error logging and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose new routes alongside /health, /metrics, /openapi.json, and /docs:

• GET /github/issues?owner={owner}&repo={repo}
  Returns list of issues as JSON. Validates query schema with Zod. Records request and failure metrics. Enforces IP rate limiting.

• POST /github/issues
  JSON body: { owner, repo, title, body }
  Creates a new issue and returns created issue details as JSON. Protect with Basic Auth if GITHUB_USER/GITHUB_PASS are set.

• GET /github/pull-requests?owner={owner}&repo={repo}
  Returns list of open pull requests as JSON. Validates query schema and records metrics.

• POST /github/pull-requests
  JSON body: { owner, repo, head, base, title, body }
  Creates a new pull request and returns details as JSON. Basic Auth and schema validation required.

• POST /github/merge-pull-request
  JSON body: { owner, repo, pull_number }
  Merges the specified pull request and returns merge outcome as JSON. Basic Auth and schema validation required.

# GitHub API Utilities

Export reusable functions in src/lib/main.js:

• listIssues(owner: string, repo: string): Promise<object>

• createIssue(owner: string, repo: string, title: string, body?: string): Promise<object>

• listPullRequests(owner: string, repo: string): Promise<object>

• createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body?: string): Promise<object>

• mergePullRequest(owner: string, repo: string, pullNumber: number): Promise<object>

Each utility uses fetch against GITHUB_API_BASE_URL with retry logic on rate limits, structured logging via logInfo and logError, and clear error messages on failure.

# Success Criteria & Testing

• All existing tests must pass without modification.

• Add unit tests mocking fetch for each new utility function to simulate success and failure scenarios.

• Add CLI tests for each new flag, verifying console output, exit codes, and error handling under invalid inputs.

• Add sandbox tests for each HTTP route, validating status codes, request and response schema, authentication failures, rate limiting, and metrics recording.

# Documentation & README Updates

• Update sandbox/README.md Key Features to include new GitHub CLI flags and HTTP endpoints for issues and pull requests.

• Add examples for each CLI flag in sandbox/docs/SERVER.md under CLI Examples.

• Add HTTP examples for the new routes in sandbox/docs/SERVER.md under HTTP Examples.

• Update openapi.json paths object to define the new GitHub operations with request and response schemas.

• Document each GitHub API utility in sandbox/docs/GITHUB_API.md with example payloads and responses.

# Dependencies & Constraints

• Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and openapi.json.

• Use only global fetch, zod, and existing dependencies. No new runtime dependencies.

• Maintain ESM compatibility, existing coding style, and alignment with the mission statement.