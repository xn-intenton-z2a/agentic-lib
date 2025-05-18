# Agentic Core Feature Specification

# Overview
This feature delivers essential building blocks for autonomous, agentic workflows in Node.js projects. It consolidates environment configuration, structured logging, AWS SQS client utilities and queue management, Lambda handler, CLI interface with SQS and GitHub commands, HTTP server endpoints, and GitHub API integrations into a single cohesive module. Each component is designed for high reliability, testability, and seamless integration.

# CLI Interface
Extend the main(args) function in src/lib/main.js to support the following flags:
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
Preserve the existing --help, --version, and --digest flags and early exit behavior.

# HTTP Server Endpoints
Extend sandbox/source/server.js to expose new REST routes in addition to /health, /metrics, /openapi.json, and /docs:
• POST /queue/send           accepts JSON { queueUrl, body, delaySeconds } and returns { MessageId }
• GET  /queue/receive        accepts query params queueUrl, maxMessages, waitTimeSeconds
• DELETE /queue/purge        accepts query param queueUrl
• PUT  /queue/dead-letter    accepts JSON { sourceQueueUrl, deadLetterQueueArn, maxReceiveCount }
• POST /github/issues        accepts JSON { owner, repo, title, body } and returns issue details
• GET  /github/issues        accepts query params owner, repo, state and returns list of issues
• POST /github/branches      accepts JSON { owner, repo, branchName, fromSha } and returns branch info
• POST /github/commit        accepts JSON { owner, repo, branch, path, content, message } and returns commit result
• POST /github/pull-request  accepts JSON { owner, repo, head, base, title, body } and returns pull request details
Protect endpoints with Basic Auth if configured via environment variables. Record HTTP request and failure metrics per route.

# GitHub API Utilities
Export reusable functions in src/lib/main.js for interacting with GitHub using global fetch:
• createIssue(owner: string, repo: string, title: string, body?: string): Promise<object>
• listIssues(owner: string, repo: string, state?: string): Promise<Array<object>>
• createBranch(owner: string, repo: string, branchName: string, fromSha: string): Promise<object>
• commitFile(owner: string, repo: string, branch: string, path: string, content: string, message: string): Promise<object>
• createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body?: string): Promise<object>
Log each request and response, handle errors with descriptive messages, and include retry logic for rate limits.

# Success Criteria & Testing
• All existing Vitest tests continue passing without modification.
• Add unit tests mocking fetch for GitHub API functions to simulate success and error responses.
• Add integration tests for new CLI flags, verifying console output and exit codes.
• Add sandbox tests for new HTTP /queue and /github routes, verifying status codes, response bodies, and authentication behavior.

# Documentation & README Updates
• Update sandbox/README.md Key Features section to describe new GitHub CLI commands and HTTP endpoints.
• Add usage examples for GitHub flags and REST routes in sandbox/docs/SERVER.md and docs/GITHUB_API.md.
• Update openapi.json to include new /queue and /github paths and schemas.

# Dependencies & Constraints
• Modify src/lib/main.js, sandbox/source/server.js, sandbox/tests/, and sandbox/docs/ accordingly.
• Use the built-in fetch API in Node 20+; no new external dependencies required.
• Maintain ESM compatibility and existing coding standards.