# Value Proposition
Extend the sandbox CLI into a combined HTTP server and interactive chat interface powered by OpenAI. Additionally, provide issue summarization capability by fetching GitHub issue data and generating concise summaries.

# Success Criteria & Requirements
- CLI Flag: Support a new --summarize-issue <owner>/<repo>#<issue-number> flag that retrieves the issue body and comments via GITHUB_API_BASE_URL, sends the aggregated content to OpenAI createChatCompletion, and prints the summary to stdout.
- HTTP Endpoint: Extend the existing HTTP server with a new POST /summary endpoint that accepts JSON { owner: string, repo: string, issueNumber: number, model?: string, maxTokens?: number } and returns JSON { summary: string }.
- Configuration: Honor environment variables GITHUB_API_BASE_URL, OPENAI_API_KEY, OPENAI_API_BASE_URL (override), OPENAI_CHAT_MODEL (default gpt-3.5-turbo), and OPENAI_MAX_TOKENS (default 500).
- Logging & Observability: Use logInfo and logError to record incoming requests, GitHub API calls, and OpenAI responses. Respect VERBOSE_MODE and VERBOSE_STATS flags for additional logging and stats in HTTP responses.
- Error Handling: Validate presence and types of owner, repo, and issueNumber; return HTTP 400 on invalid input and HTTP 502 on GitHub or OpenAI API errors with structured error messages.

# Testing & Verification
- Unit Tests: Mock openai.OpenAIApi and GitHub API calls to simulate successful summarization and failures. Verify CLI --summarize-issue prints the correct summary and exits with code 0 on success and non-zero on failure.
- HTTP Tests: Use vitest and Node http mocks to verify POST /summary accepts valid JSON, applies defaults, handles missing parameters, and returns expected JSON or error codes.
- Integration Checks: Test behavior when OPENAI_API_KEY or GITHUB_API_BASE_URL is missing, expecting validation errors in both CLI and HTTP paths.

# Dependencies & Constraints
- Update sandbox/source/main.js, sandbox/tests/main.chat.test.js, sandbox/docs/USAGE.md, sandbox/README.md, and package.json scripts as needed.
- Reuse the existing openai package, axios or fetch for GitHub API calls, and configuration logic. No new files should be created.
- Maintain Node 20 ESM compatibility and vitest testing.

# User Scenarios & Examples
## CLI Issue Summarization
node sandbox/source/main.js --summarize-issue octocat/Hello-World#42

## HTTP Issue Summarization
curl -X POST http://localhost:3000/summary -H 'Content-Type: application/json' -d '{ "owner":"octocat","repo":"Hello-World","issueNumber":42 }'