# Core Event Processing with GitHub Integration and HTTP API

## Objective & Scope
Extend event processing in the library to handle both AWS SQS digest events and GitHub webhook events for issues and pull requests. Provide both CLI and native HTTP API endpoints to invoke these handlers for local testing or serverless deployment.

## Value Proposition
- Unify SQS digest handling and GitHub webhook processing in a single feature set.
- Enable optional AI-driven comment generation on GitHub issues and pull requests when OPENAI_API_KEY is configured.
- Offer both CLI flags and lightweight HTTP endpoints to trigger event handlers, increasing flexibility for integration and local development.
- Maintain robust schema validation with clear error reporting and failure tracking.

## Success Criteria & Requirements
- Configuration Schema
  - Add optional string GITHUB_TOKEN for GitHub API authentication.
  - Add optional boolean HTTP_ENABLED (default false) and number HTTP_PORT (default 3000).

- GitHub Event Handler
  - Implement `async function gitHubEventHandler(eventType, payload)` in src/lib/main.js.
  - Define Zod schemas for GitHubIssueEvent and GitHubPullRequestEvent with required fields.
  - On validation failure, log errors and record failures array entries.
  - On success with OPENAI_API_KEY, call OpenAIApi.createChatCompletion to generate a comment.
  - Post generated comment to GitHub using fetch with GITHUB_TOKEN.
  - Return object `{ handledEvents, failures, handler: 'gitHubEventHandler' }`.

- AWS SQS Digest Handler
  - Retain `digestLambdaHandler` to process SQS events and report batchItemFailures.

- CLI Support
  - Add `--github-event <type> <payloadFile>` to simulate GitHub events from JSON files.
  - Retain existing `--digest` flag.

- HTTP Server
  - When HTTP_ENABLED is true, start a Node HTTP server on HTTP_PORT.
  - Accept POST requests to `/events/digest` and `/events/github` with JSON bodies.
  - Dispatch to digestLambdaHandler or gitHubEventHandler based on path and GitHub event header or explicit type field.
  - Respond with JSON payload containing handler results and appropriate HTTP status codes.

## Testability & Stability
- Add unit tests in sandbox/tests for:
  - Valid and invalid issue and pull request payloads without AI key.
  - AI comment generation success and OpenAI API failures.
  - GitHub fetch error scenarios.
  - HTTP server routes responding with correct status and payloads (mock fetch and OpenAIApi).
  - CLI flags `--github-event` invoking gitHubEventHandler correctly.

## Dependencies & Constraints
- Use Node 20 native http module for HTTP server; no additional HTTP libraries.
- Continue using zod, openai, dotenv, and global fetch.
- Maintain ESM compatibility and adhere to existing coding style.

## User Scenarios & Examples
- CLI: `node src/lib/main.js --github-event issues path/to/issue.json` prints handler output.
- HTTP: Send POST to http://localhost:3000/events/github with header X-GitHub-Event: pull_request; server validates and processes event.

## Verification & Acceptance
- All new and existing tests pass with `npm test`.
- README updated with documentation for gitHubEventHandler, CLI flag, HTTP API endpoints and required env variables.
- Ensure backward compatibility with existing digest CLI workflow.