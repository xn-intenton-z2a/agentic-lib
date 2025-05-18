# Feature Overview

- Environment Configuration
  Load and validate environment variables using dotenv and Zod to ensure consistent, reproducible conditions in autonomous workflows.
- Structured Logging Helpers
  Export logInfo and logError functions producing JSON-formatted logs with levels, timestamps, messages, and optional context for transparent audit trails.
- OpenAI Chat Utilities
  Export async chatCompletion function to call the OpenAI API with a messages array, process responses, and return parsed JSON content.
- AWS SQS Utilities & Lambda Handler
  Provide createSQSEventFromDigest to craft mock SQS events and digestLambdaHandler to process records with error handling, failure reporting, and support for AWS batchItemFailures semantics.
- CLI Interface
  Support --help, --version, and --digest flags in main CLI, enabling users to display usage instructions, version information with timestamp, and simulate SQS digest events.
- HTTP Server
  startServer function exposing critical endpoints: /health, /metrics, /openapi.json, /docs, all supporting CORS, Basic Auth when configured, and integrated rate-limit headers.
- GitHub API Utilities
  Export functions to interact with GitHub repositories and issues, including createIssue, listIssues, createBranch, commitFile, and createPullRequest, leveraging authenticated REST API calls to enable agentic workflows through issues and branches.

# GitHub API Utilities

Implement a set of asynchronous functions for seamless integration with GitHub APIs:

- createIssue(repo, title, body, labels?):
  Create a GitHub issue in the specified repository with title, body, and optional labels.
- listIssues(repo, filters?):
  Retrieve a list of issues matching optional filters (state, labels, assignee).
- createBranch(repo, baseBranch, newBranch):
  Create a new branch from a specified base branch in the repository.
- commitFile(repo, branch, filePath, content, commitMessage):
  Create or update a file in the given branch, committing changes with the provided message.
- createPullRequest(repo, title, head, base, body?):
  Open a pull request from head branch into base branch with title and optional description.

Each function must:

- Use @octokit/rest or Fetch with config.GITHUB_API_BASE_URL and GITHUB_TOKEN for authentication.
- Log request and response details via logInfo; log errors via logError.
- Throw descriptive errors for HTTP failures or invalid inputs.

# Configuration & Environment Variables

- GITHUB_API_BASE_URL (optional)  Base URL for GitHub API requests; defaults to api.github.com.
- GITHUB_TOKEN (required for GitHub API Utilities)  Personal access token or GitHub App token with repo scope.
- OPENAI_API_KEY (required for chatCompletion)
- PORT
- CORS_ALLOWED_ORIGINS
- RATE_LIMIT_REQUESTS
- METRICS_USER, METRICS_PASS
- DOCS_USER, DOCS_PASS

# Success Criteria & Acceptance

- All existing core features continue to function and pass existing tests.
- GitHub API Utilities functions successfully call mocked API endpoints with correct parameters in Vitest tests.
- createIssue and createPullRequest return parsed JSON responses when API returns success.
- Error paths such as authentication failures or missing parameters throw and log descriptive exceptions.
- Implementation uses only allowed sandbox paths (source, tests, docs, readme, dependencies).

# Testability & Stability

- Add Vitest tests in sandbox/tests/server.test.js and tests/unit/main.test.js to mock @octokit/rest and validate both success and error scenarios.
- Ensure required GITHUB_TOKEN missing triggers startup validation error.
- Verify GitHub API functions integrate correctly with logInfo/logError helpers and global callCount when used in CLI scenarios.
- Maintain existing fail-safe mechanisms: unexpected errors in new utilities are captured and reported without crashing other functionality.