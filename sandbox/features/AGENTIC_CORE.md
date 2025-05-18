# Overview

Extend the core agentic-lib feature to support both AI-driven GitHub issue summarization and automated branch and pull request management. Building on existing webhook ingestion, SQS, Lambda, CLI, and HTTP server capabilities, this feature enables users to fetch open issues and generate concise summaries, create new branches from a base reference, and open pull requests through both CLI flags and HTTP endpoints.

# CLI Interface

Enhance src/lib/main.js with the following flags alongside existing ones:

-  --summarize-issues <owner/repo>  Fetch all open issues, generate a summary using OpenAI chat completions, and output JSON summary to stdout.
-  --post-comment <issueNumber>  Post a generated summary to the specified issue when used with summarize-issues.
-  --create-branch <owner/repo> <branchName> [baseRef]  Create a new branch named branchName from baseRef (default default branch) using the GitHub REST API.
-  --create-pr <owner/repo> <branchName> --pr-title <title> --pr-body <body>  Open a pull request from branchName to the repository default branch, setting title and body as given.

All commands should maintain structured logging, error handling, exit codes, and call counting when VERBOSE_STATS is enabled.

# HTTP Server Endpoints

Extend sandbox/source/server.js to add two new routes alongside existing endpoints:

-  POST /branches
   Accept JSON body with owner, repo, branchName, and optional baseRef. Validate authentication token matches GITHUB_API_TOKEN. Enforce rate limiting. On success, respond 201 with JSON { owner, repo, branch: branchName }.
-  POST /pulls
   Accept JSON body with owner, repo, head (branchName), base (default branch), title, and body. Validate authentication token. Enforce rate limiting. On success, respond 201 with JSON containing pull request URL and number.

Ensure existing endpoints remain unchanged, including rate limiting, authentication, validation, and metrics.

# GitHub Management Utilities

Export new reusable functions in src/lib/main.js:

-  createBranch(owner: string, repo: string, branchName: string, baseRef?: string): Promise<string>  Call GitHub REST API to create a branch reference ref heads/branchName from baseRef or default branch and return the branch name.
-  createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body: string): Promise<object>  Call GitHub REST API to open a pull request and return the API response object.

Retain existing functions summarizeIssues and postIssueComment. Use structured logging via logInfo and logError and fetch for HTTP calls.

# Success Criteria & Testing

-  All existing tests must pass without modification.
-  Add unit tests for createBranch and createPullRequest mocking GitHub API, verifying correct URL, payload, and return value.
-  Add CLI tests for --create-branch and --create-pr flags, verifying exit codes, JSON output, and error handling for missing or invalid parameters.
-  Add sandbox tests for POST /branches and POST /pulls covering authentication failures, rate limiting, validation errors, and successful responses.

# Documentation & README Updates

-  Update sandbox/README.md Key Features to include branch and pull request management.
-  Amend sandbox/docs/SERVER.md to document POST /branches and POST /pulls endpoints with request and response schemas.
-  Create sandbox/docs/BRANCH_PR.md with API reference, CLI examples, and usage scenarios.

# Dependencies & Constraints

-  Modify only src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, sandbox/README.md, and package.json.
-  Introduce no new runtime dependencies; use existing fetch and dotenv. If fetch is not global, use node experimental fetch.
-  Maintain ESM compatibility, existing coding style, and alignment with the mission statement.