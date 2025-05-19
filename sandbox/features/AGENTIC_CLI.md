# Value Proposition
Extend the sandbox CLI and HTTP interface to not only summarize GitHub issues and pull requests but also post those summaries back to GitHub as comments. This streamlines the workflow by providing automated feedback directly in the GitHub UI, closing the loop on summarization and enabling faster collaboration.

# Success Criteria & Requirements
- CLI Flags:
  - --summarize-issue <owner>/<repo>#<issue-number>: Retrieve and summarize issue body and comments, print summary to stdout.
  - --summarize-pr <owner>/<repo>#<pr-number>: Retrieve and summarize pull request metadata, diff, and comments, print summary to stdout.
  - --post-issue-summary <owner>/<repo>#<issue-number>: Perform issue summarization and post the resulting summary as a new comment on the issue.
  - --post-pr-summary <owner>/<repo>#<pr-number>: Perform PR summarization and post the summary as a new comment on the pull request.
- HTTP Endpoints:
  - POST /summary: Accept JSON with owner, repo, issueNumber, optional model, maxTokens; return JSON with summary.
  - POST /pr-summary: Accept JSON with owner, repo, prNumber, optional model, maxTokens; return JSON with summary.
  - POST /issue-comment: Accept JSON with owner, repo, issueNumber, optional model, maxTokens; return JSON with summary and commentUrl.
  - POST /pr-comment: Accept JSON with owner, repo, prNumber, optional model, maxTokens; return JSON with summary and commentUrl.
- Authentication & Configuration:
  - Require GITHUB_TOKEN environment variable to authenticate comment posting.
  - Honor GITHUB_API_BASE_URL, OPENAI_API_KEY, OPENAI_API_BASE_URL, OPENAI_CHAT_MODEL default gpt-3.5-turbo, OPENAI_MAX_TOKENS default 500.
- Logging & Observability:
  - Use logInfo and logError for all incoming commands and HTTP requests, GitHub and OpenAI API calls.
  - Respect VERBOSE_MODE and VERBOSE_STATS for additional logs and statistics in CLI output and HTTP responses.
- Error Handling:
  - Validate input parameters and authentication token presence, returning exit code and messages for CLI.
  - Return HTTP 400 for invalid input, HTTP 401 for missing or invalid GITHUB_TOKEN, HTTP 502 for external API errors, with structured JSON error objects.

# Testing & Verification
- Unit Tests:
  - Mock GitHub comment API and OpenAI createChatCompletion to simulate success and failures.
  - Verify CLI flags --post-issue-summary and --post-pr-summary perform both summarization and comment posting, printing the comment URL on success, exiting code 0, non-zero on failure.
- HTTP Tests:
  - Use vitest and HTTP mocks to test /issue-comment and /pr-comment endpoints accept valid JSON, apply defaults, require GITHUB_TOKEN header or env var, return summary and commentUrl or appropriate error codes.
- Integration Checks:
  - Test behavior when GITHUB_TOKEN is missing or invalid, expecting authorization errors in both CLI and HTTP paths.

# Dependencies & Constraints
- Update sandbox/source/main.js, sandbox/tests/main.chat.test.js, sandbox/docs/USAGE.md, sandbox/README.md, and package.json scripts as needed.
- Reuse existing openai package, axios or fetch for GitHub API calls, configuration logic, and logging utilities.
- Maintain Node 20 ESM compatibility and vitest testing; no new files should be created.