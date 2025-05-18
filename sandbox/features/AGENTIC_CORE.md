# Overview

Enhance the core agentic-lib feature to fully integrate GitHub issue and pull request lifecycle management alongside OpenAI chat completions and existing SQS, Lambda, CLI, and HTTP server capabilities. This update empowers autonomous workflows to list, create, and merge GitHub issues and pull requests and to generate AI-driven refinements via CLI flags and REST endpoints, aligned with our mission to enable continuous agentic interactions.

# CLI Interface

Extend src/lib/main.js to support these flags in addition to existing ones:

- --github-list-issues <owner> <repo>  List issues in the specified repository and output as JSON. Exit code 0 on success, non-zero on error.
- --github-create-issue <owner> <repo> <title> [body]  Create a new issue and output created issue details as JSON.
- --github-list-pull-requests <owner> <repo>  List open pull requests as JSON.
- --github-create-pull-request <owner> <repo> <head> <base> <title> [body]  Create a pull request and output details as JSON.
- --github-merge-pull-request <owner> <repo> <pull_number>  Merge a pull request and output merge result as JSON.
- --agentic-chat <prompt>  Send a freeform prompt to the OpenAI Chat Completion API and output the AI response as JSON. Exit code 0 on success, non-zero on error.

Maintain existing error logging and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to expose these new routes alongside /health, /metrics, /openapi.json, and /docs:

- POST /agentic/chat  JSON body: { prompt: string }  Returns AI generated response as JSON. Protect with Basic Auth if DOCS_USER and DOCS_PASS are set.

All existing HTTP endpoints remain unchanged and continue to support rate limiting, authentication, schema validation, and metrics.

# API Utilities

Export reusable functions in src/lib/main.js:

- listIssues(owner: string, repo: string): Promise<object>
- createIssue(owner: string, repo: string, title: string, body?: string): Promise<object>
- listPullRequests(owner: string, repo: string): Promise<object>
- createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body?: string): Promise<object>
- mergePullRequest(owner: string, repo: string, pullNumber: number): Promise<object>
- chatCompletion(messages: array of chat messages): Promise<object>

Each utility uses fetch against GITHUB_API_BASE_URL or the OpenAI client with retry logic on rate limits, structured logging via logInfo and logError, and clear error messages on failure.

# Success Criteria & Testing

- All existing tests must pass without modification.
- Add unit tests mocking openai for chatCompletion to simulate success and failure scenarios.
- Add CLI tests for --agentic-chat verifying console output, exit codes, and error handling under invalid inputs.
- Add sandbox tests for POST /agentic/chat validating status codes, request and response schema, authentication failures, rate limiting, and metrics recording.

# Documentation & README Updates

- Update sandbox/README.md Key Features to include OpenAI chat CLI flag and HTTP endpoint.
- Add examples for agentic-chat in sandbox/docs/SERVER.md under CLI Examples and HTTP Examples.
- Document chatCompletion in sandbox/docs/OPENAI_API.md with example payloads and responses.

# Dependencies & Constraints

- Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and package.json.
- Use only global fetch, openai, zod, and existing dependencies. No new runtime dependencies.
- Maintain ESM compatibility, existing coding style, and alignment with the mission statement.