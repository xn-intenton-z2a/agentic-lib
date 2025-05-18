# Overview
This feature delivers the essential building blocks for autonomous, agentic workflows in Node.js projects. It unifies environment configuration, structured logging, AWS SQS utilities, Lambda event handling, CLI interfaces, HTTP server endpoints, and GitHub API integrations into a cohesive module. Each component is designed for reliability, testability, and seamless integration.

# CLI Interface
Extend the main(args) function in src/lib/main.js to support these flags in addition to --help, --version, and --digest:
• --send-queue <queueUrl> <json-body>           : send a JSON payload to an AWS SQS queue
• --receive-queue <queueUrl> [max]               : fetch messages from an AWS SQS queue
• --purge-queue <queueUrl>                       : purge all messages from an AWS SQS queue
• --dead-letter <sourceUrl> <dlqArn> <maxCount>   : configure Dead Letter Queue policy
• --github-create-issue <owner> <repo> <title> [body]
                                                     : create a new GitHub issue
• --github-list-issues <owner> <repo> [state]     : list issues for a repository
• --github-create-branch <owner> <repo> <branchName> <fromSha>
                                                     : create a new branch from a given commit SHA
• --github-commit-file <owner> <repo> <branch> <path> <content> <message>
                                                     : commit or update a file on a branch
• --github-create-pull-request <owner> <repo> <head> <base> <title> [body]
                                                     : open a pull request
Preserve early-exit behavior for help, version, and digest flags. Log each operation and handle errors with descriptive messages.

# HTTP Server Endpoints
Extend sandbox/source/server.js to expose new REST routes in addition to /health, /metrics, /openapi.json, and /docs:
• POST /queue/send           accepts JSON { queueUrl, body, delaySeconds } and returns { MessageId }
• GET  /queue/receive        accepts query params queueUrl, maxMessages, waitTimeSeconds and returns messages array
• DELETE /queue/purge        accepts query param queueUrl and returns purge result
• PUT  /queue/dead-letter    accepts JSON { sourceQueueUrl, deadLetterQueueArn, maxReceiveCount } and returns updated policy

• POST /github/issues        accepts JSON { owner, repo, title, body } and returns issue details
• GET  /github/issues        accepts query params owner, repo, state and returns list of issues
• POST /github/branches      accepts JSON { owner, repo, branchName, fromSha } and returns branch info
• POST /github/commit        accepts JSON { owner, repo, branch, path, content, message } and returns commit result
• POST /github/pull-request  accepts JSON { owner, repo, head, base, title, body } and returns pull request details

Protect queue routes and GitHub routes with Basic Auth if configured via environment variables. Record HTTP request and failure metrics per route.

# GitHub API Utilities
Export reusable functions in src/lib/main.js for interacting with GitHub using global fetch:
• createIssue(owner: string, repo: string, title: string, body?: string): Promise<object>
• listIssues(owner: string, repo: string, state?: string): Promise<Array<object>>
• createBranch(owner: string, repo: string, branchName: string, fromSha: string): Promise<object>
• commitFile(owner: string, repo: string, branch: string, path: string, content: string, message: string): Promise<object>
• createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body?: string): Promise<object>

Log each request and response, implement retry logic for rate limits, and surface descriptive errors.

# Success Criteria & Testing
• All existing Vitest tests continue passing without modification.
• Add unit tests mocking fetch for GitHub functions to simulate success and failure scenarios.
• Add unit tests for new CLI flags, verifying console output, exit codes, and error handling.
• Add sandbox tests for each new HTTP /queue and /github route, verifying status codes, response bodies, authentication, and rate limiting.

# Documentation & README Updates
• Update sandbox/README.md Key Features to include new CLI commands and HTTP routes.
• Add usage examples for GitHub CLI flags and queue operations in sandbox/docs/SERVER.md.
• Update openapi.json to describe new /queue and /github endpoints and payload schemas.
• Document GitHub utilities in docs/GITHUB_API.md with usage scenarios.

# Dependencies & Constraints
• Modify src/lib/main.js, sandbox/source/server.js, sandbox/tests/, sandbox/docs/, and sandbox/README.md only.
• Use built-in fetch in Node 20+; no new dependencies required.
• Maintain ESM compatibility and existing coding style conventions.