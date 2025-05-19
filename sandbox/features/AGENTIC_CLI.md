# Value Proposition
Extend the sandbox CLI into a combined HTTP server and interactive chat interface powered by OpenAI. Provide summarization capabilities for both GitHub issues and pull requests by fetching relevant data, compiling it, and generating concise summaries.

# Success Criteria & Requirements
- CLI Flags:
  - --summarize-issue <owner>/<repo>#<issue-number>: retrieve issue body and comments via GITHUB_API_BASE_URL, send aggregated content to OpenAI createChatCompletion, print summary to stdout.
  - --summarize-pr <owner>/<repo>#<pr-number>: retrieve pull request metadata, diff and comments via GITHUB_API_BASE_URL, send aggregated content to OpenAI createChatCompletion, print summary to stdout.
- HTTP Endpoints:
  - POST /summary: accept JSON with keys owner string, repo string, issueNumber number, optional model string and maxTokens number; return JSON with key summary string.
  - POST /pr-summary: accept JSON with keys owner string, repo string, prNumber number, optional model string and maxTokens number; return JSON with key summary string.
- Configuration: honor GITHUB_API_BASE_URL, OPENAI_API_KEY, OPENAI_API_BASE_URL, OPENAI_CHAT_MODEL default gpt-3.5-turbo and OPENAI_MAX_TOKENS default 500.
- Logging & Observability: use logInfo and logError to record incoming requests, GitHub and OpenAI calls. Respect VERBOSE_MODE and VERBOSE_STATS flags for additional logs and stats in HTTP responses.
- Error Handling: validate presence and types of owner, repo, issueNumber and prNumber; return HTTP 400 on invalid input and HTTP 502 on GitHub or OpenAI API errors with structured error messages.

# Testing & Verification
- Unit Tests: mock openai.OpenAIApi and GitHub API calls to simulate successful summarization and failures. Verify CLI flags for issue and PR summarization print correct summary and exit code 0 on success and non-zero on failure.
- HTTP Tests: use vitest and Node http mocks to verify endpoints accept valid JSON, apply defaults, handle missing parameters and return expected JSON or error codes.
- Integration Checks: test behavior when OPENAI_API_KEY or GITHUB_API_BASE_URL is missing, expecting validation errors in both CLI and HTTP paths.

# Dependencies & Constraints
- Update sandbox/source/main.js, sandbox/tests/main.chat.test.js, sandbox/docs/USAGE.md, sandbox/README.md, and package.json scripts as needed.
- Reuse existing openai package, axios or fetch for GitHub API calls and configuration logic. No new files should be created.
- Maintain Node 20 ESM compatibility and vitest testing.

# User Scenarios & Examples
CLI Issue Summarization
node sandbox/source/main.js --summarize-issue octocat/Hello-World#42

CLI PR Summarization
node sandbox/source/main.js --summarize-pr octocat/Hello-World#5

HTTP Issue Summarization
curl -X POST http://localhost:3000/summary -H content-type application/json -d { owner: octocat, repo: Hello-World, issueNumber: 42 }

HTTP PR Summarization
curl -X POST http://localhost:3000/pr-summary -H content-type application/json -d { owner: octocat, repo: Hello-World, prNumber: 5 }