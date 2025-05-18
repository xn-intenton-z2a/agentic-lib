# Agentic Core Feature Specification

## 1. Overview
This feature delivers the essential building blocks for autonomous, agentic workflows. It consolidates environment configuration, structured logging, AWS SQS utilities, CLI interface, HTTP server endpoints, and GitHub API integrations into a single cohesive module. Each component is designed for high reliability, testability, and seamless integration in Node.js projects.

## 2. Environment Configuration
- Load environment variables using dotenv.
- Validate required and optional variables with Zod schema:
  • GITHUB_API_BASE_URL (string, optional, default https://api.github.com)
  • GITHUB_TOKEN (string, required for GitHub API calls)
  • OPENAI_API_KEY (string, required for chat utilities)
  • PORT, CORS_ALLOWED_ORIGINS, RATE_LIMIT_REQUESTS, METRICS_USER, METRICS_PASS, DOCS_USER, DOCS_PASS

## 3. Structured Logging Helpers
- Export `logInfo(message: string): void` and `logError(message: string, error?: any): void`.
- Format logs as JSON with `level`, `timestamp`, `message`, and optional context or stack.
- Allow verbose mode through environment variable for additional diagnostics.

## 4. AWS SQS Utilities & Lambda Handler
- `createSQSEventFromDigest(digest: object): SqsEvent` to construct mock SQS event records.
- `digestLambdaHandler(event: SqsEvent): Promise<{ batchItemFailures: Array<{ itemIdentifier: string }>, handler: string }>`:
  • Parse each record body as JSON, log successes and errors.
  • Generate fallback record identifiers for failures.
  • Return AWS-compatible batchItemFailures list.

## 5. CLI Interface
- Support flags in `main(args: string[])`:
  • `--help`: print usage instructions and exit.
  • `--version`: read version from package.json, print JSON with `version` and `timestamp`.
  • `--digest`: simulate SQS digest using createSQSEventFromDigest and digestLambdaHandler.
- Exit early on handled flags; default to usage instructions if no flags.

## 6. HTTP Server Endpoints
- Function `startServer(options?: { port?: number }): http.Server`:
  • `/health`: GET returns JSON `{ status, uptime, timestamp }`.
  • `/metrics`: GET returns Prometheus metrics, protected by Basic Auth if configured.
  • `/openapi.json`: GET returns OpenAPI 3.0 spec for all endpoints.
  • `/docs`: GET returns HTML-rendered OpenAPI spec via MarkdownIt and markdown-it-github, protected by Basic Auth if configured.
- Enforce IP-based rate limiting with token bucket algorithm per-minute.
- Record request counts and failure counts in in-memory metrics.

## 7. GitHub API Utilities
- Export async functions using @octokit/rest or fetch:
  • `createIssue(repo: string, title: string, body: string, labels?: string[]): Promise<object>`
  • `listIssues(repo: string, filters?: Record<string, any>): Promise<object[]>`
  • `createBranch(repo: string, baseBranch: string, newBranch: string): Promise<object>`
  • `commitFile(repo: string, branch: string, filePath: string, content: string, commitMessage: string): Promise<object>`
  • `createPullRequest(repo: string, title: string, head: string, base: string, body?: string): Promise<object>`
- Authenticate with GITHUB_TOKEN and log all requests and responses.
- Throw descriptive errors on HTTP or input validation failures.

## 8. Success Criteria & Testing
- All components pass existing Vitest tests and new tests:
  • Mock AWS and HTTP behavior for SQS and server endpoints.
  • Mock @octokit/rest or fetch for GitHub functions to verify request correctness and error handling.
- Environment validation errors thrown on missing required vars.
- Rate limiting and Basic Auth scenarios covered in server tests.
- CLI flags tested in unit tests for correct output and exit behavior.
- Ensure globalThis.callCount tracking remains intact for test mocks.

## 9. Documentation & README Updates
- Update README feature list to match implemented utilities.
- Add usage examples for GitHub API functions.
- Ensure sandbox/docs and sandbox/README.md reflect all endpoints and utilities.

## 10. Dependencies & Constraints
- Only modify sandbox/source, sandbox/tests, sandbox/docs, sandbox/README.md, and package.json.
- Maintain Node 20+ ESM compatibility.
