# Environment Configuration

Load environment variables from .env and runtime environment using dotenv. Validate required variables with Zod to ensure GITHUB_API_BASE_URL and OPENAI_API_KEY conform to expected formats. Expose a parsed config object for use by all components.

# Structured Logging

Export logConfig, logInfo, and logError functions to produce structured JSON logs. Each entry includes a timestamp, log level, message, and optional metadata. Support a verbose mode for additional context and stack traces.

# AWS Utilities & Lambda Handlers

Provide createSQSEventFromDigest(digest) to wrap a digest object into an SQS-compatible event for testing. Implement digestLambdaHandler to process SQS records, parse JSON bodies, log successes and errors, and return batchItemFailures to enable AWS retry semantics.

# CLI Interface

Extend the main CLI with flags:

- --help: Display usage instructions.
- --version: Print library version and timestamp.
- --digest: Simulate SQS event processing with an example digest.
- --summarize-issues <owner/repo>: Fetch open issues, generate summaries via OpenAI chat completions, and output JSON.
- --post-comment <issueNumber>: Post a generated summary as a comment when used with summarize-issues.
- --create-branch <owner/repo> <branchName> [baseRef]: Create a new branch via the GitHub REST API.
- --create-pr <owner/repo> <branchName> --pr-title <title> --pr-body <body>: Open a pull request from branchName to the default branch.

Ensure structured logging, error handling, and optional verbose statistics for each command.

# HTTP Server Endpoints

Enhance startServer to expose:

- GET /health: Liveness probe returning status, uptime, and timestamp.
- GET /metrics: Prometheus-formatted metrics, protected by Basic Auth when configured.
- GET /openapi.json: Serve the OpenAPI 3.0 schema.
- GET /docs: Render interactive HTML docs using Markdown, protected by Basic Auth when configured.
- POST /branches: Create a branch given owner, repo, branchName, and optional baseRef. Validate GITHUB_API_TOKEN, enforce rate limiting and CORS, respond 201 with JSON { owner, repo, branch }.
- POST /pulls: Create a pull request given owner, repo, head, base, title, and body. Validate GITHUB_API_TOKEN, enforce rate limiting, respond 201 with JSON containing pull request URL and number.

Maintain existing endpoints unchanged, including authentication, rate limiting, and metrics recording.

# GitHub Issue Summarization & Branch/PR Management

Implement reusable functions:

- summarizeIssues(owner: string, repo: string): Promise<object>  Fetch open issues, call OpenAI chat completions to generate concise summaries, and return structured JSON.
- postIssueComment(owner: string, repo: string, issueNumber: number, summary: string): Promise<object>  Post a comment containing summary to the specified issue.
- createBranch(owner: string, repo: string, branchName: string, baseRef?: string): Promise<string>  Create a branch reference via GitHub REST API and return the new branch name.
- createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body: string): Promise<object>  Open a pull request via GitHub REST API and return the API response.

Expose these functions in src/lib/main.js and wire them into the CLI and HTTP routes.

# Success Criteria & Testing

- All existing tests must pass without modification.
- Add unit tests for new utilities: createSQSEventFromDigest, digestLambdaHandler error and success paths, GitHub utilities (summarizeIssues, postIssueComment, createBranch, createPullRequest) with mocked API calls.
- Add CLI tests for new flags, verifying exit codes, JSON output, and error handling for invalid input.
- Add HTTP server tests for POST /branches and POST /pulls covering authentication failures, rate limiting, validation errors, and successful responses.

# Documentation & README Updates

- Update sandbox/README.md Key Features to reflect full feature set including config, logging, AWS utilities, CLI flags, HTTP endpoints, and GitHub management.
- Amend sandbox/docs/SERVER.md to include POST /branches and POST /pulls schemas and examples.
- Create sandbox/docs/BRANCH_PR.md with API reference, CLI examples, and usage scenarios for issue summarization, branch creation, and pull requests.

# Dependencies & Constraints

- Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and package.json.
- Introduce no new runtime dependencies; use existing libraries: fetch, dotenv, zod, openai.
- Maintain ESM compatibility, existing coding style, and alignment with the mission statement.