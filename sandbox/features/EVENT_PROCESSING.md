# Core Event Processing and AI Augmentation

## Objective & Scope
Extend the existing digest event handler to also process GitHub webhook events for issues and pull requests, performing schema validation, robust error handling, and optional AI-driven comment generation and posting.

## Value Proposition
- Enable agentic-lib to autonomously handle GitHub issue and pull request events alongside SQS digest events.
- Validate incoming GitHub webhook payloads to prevent unexpected failures and ensure predictable processing.
- Provide optional AI-powered comment suggestions or reviews using the OpenAI API.
- Safely post comments back to GitHub via its REST API using a configurable base URL and authentication token.

## Success Criteria & Requirements
- Extend the configuration schema to include GITHUB_TOKEN as a required string.
- Implement a new function `gitHubEventHandler(eventType, payload)` in the main source file:
  - Accept an `eventType` string (`issues` or `pull_request`) and a payload object.
  - Define Zod schemas for `GitHubIssueEvent` (fields: action, issue.number, repository.owner.login, repository.name) and `GitHubPullRequestEvent` (fields: action, pull_request.number, repository.owner.login, repository.name).
  - Parse and validate payload against the appropriate schema.
  - On validation failure, log errors using `logError` and record the eventType and identifying fields in a failures array.
  - If `OPENAI_API_KEY` is configured and validation succeeds, call `OpenAIApi.createChatCompletion` to generate a comment message based on the event details.
  - Post the AI-generated comment to GitHub using `fetch` to `${config.GITHUB_API_BASE_URL}/repos/{owner}/{repo}/issues/{number}/comments` with `Authorization: Bearer ${config.GITHUB_TOKEN}`.
  - Handle and log any fetch or API errors, recording them in the failures array.
  - Return an object with handledEvents, failures, and handler identifier.
- Update CLI to recognize a new flag `--github-event <type> <payloadFile>` to simulate and invoke `gitHubEventHandler` for manual testing.

## Testability & Stability
- Add unit tests for:
  - Valid issue event without AI key.
  - Valid pull request event with AI comment generation.
  - Invalid payload structure for both event types.
  - GitHub API error scenarios when posting comments (mock fetch to return non-2xx responses).
  - OpenAI API error handling (mock `openai` to throw).
- Use Vitest and `vi.mock` to simulate `fetch` and OpenAI responses.

## Dependencies & Constraints
- Utilize existing dependencies: `zod` for validation, `openai` for AI integration.
- Leverage Node 20 global `fetch` for GitHub API calls; no additional HTTP libraries.
- Extend `dotenv` configuration to load `GITHUB_TOKEN` from environment.
- Maintain ESM compatibility and Node 20 support.

## User Scenarios & Examples
- Scenario: New issue opened, no AI key configured; handler validates payload and returns no failures, but skips comment generation.
- Scenario: Pull request synchronized, AI key configured; handler generates review comment via OpenAI, posts to GitHub, and logs success.
- Scenario: Malformed issue payload arrives; handler logs validation errors and returns failure entry.
- Scenario: Fetch returns 401 due to invalid `GITHUB_TOKEN`; handler logs error and records failure.

## Verification & Acceptance
- All existing and new tests pass under `npm test`.
- README updated to document `gitHubEventHandler`, new CLI flag, required environment variables, and usage examples.
- Contributing guidelines updated if necessary to reflect GitHub event handler implementation.