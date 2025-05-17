# Objective & Scope
Extend event processing in the library to handle AWS SQS digest events, AWS SNS notifications, GitHub webhook events, and GitHub Actions workflow_call events. Provide CLI flags, HTTP endpoints, and auto-dispatch in GitHub Actions mode for flexible invocation and integration. Introduce payload enrichment for GitHub events by fetching and attaching additional repository and pull request context when GITHUB_TOKEN is available.

# Value Proposition
- Unify SQS digest, SNS notifications, GitHub webhooks, and Actions workflow dispatch in a single feature.
- Automate AI-driven comments on issues and pull requests when OPENAI_API_KEY is configured.
- Enrich GitHub events with repository metadata, pull request diff statistics, and changed files list when GITHUB_TOKEN is provided.
- Support CLI, HTTP API, and seamless GitHub Actions invocation without external wrappers.
- Provide health check endpoint for operational monitoring.

# Success Criteria & Requirements

## Configuration Schema
- Extend config schema with detection of AWS_SNS_TOPIC_ARN, GITHUB_ACTIONS (boolean), GITHUB_EVENT_NAME, and GITHUB_EVENT_PATH.
- Add optional GITHUB_TOKEN for enrichment; validate presence if enrichment is requested.
- Validate required environment variables or inputs for each invocation mode.

## AWS SNS Notifications
- Detect and parse SNS event payloads following AWS SNS Records structure.
- For each record in event.Records, parse record.Sns.Message as JSON and dispatch to digestLambdaHandler or custom snsNotificationHandler.
- Handle errors per record, collecting batchItemFailures for retry.

## GitHub Actions Mode
- Detect GITHUB_ACTIONS environment variable set to true.
- Read eventName from GITHUB_EVENT_NAME and payload path from GITHUB_EVENT_PATH.
- Dispatch to digestLambdaHandler for SQS events, snsNotificationHandler for SNS notifications, or gitHubEventHandler for GitHub issue, pull_request, and workflow_call events.
- When handling GitHub events with enrichment enabled, fetch additional context:
  - For pull_request events: fetch repository details, diff stats, and list of changed files.
  - For issue events: fetch issue timeline and labels.
- Attach enrichment data to event payload before handler invocation.
- Output JSON to stdout containing handler, handledEvents, enrichment, and failures.

## CLI Support
- Retain --digest flag for SQS digest simulation.
- Add --sns-notification <payloadFile> to simulate SNS events.
- Add --github-event <type> <payloadFile> to simulate GitHub events.
- Add --enrich flag to enable enrichment when simulating GitHub events.
- Add --actions-simulate flag to mimic Actions mode locally by reading GITHUB_EVENT_* variables.

## HTTP Server
- When HTTP_ENABLED is true, start HTTP server on HTTP_PORT.
- POST /events/digest dispatches to digestLambdaHandler.
- POST /events/sns dispatches to snsNotificationHandler.
- POST /events/github dispatches to gitHubEventHandler using X-GitHub-Event header or explicit type field; optional header X-Enrich: true for enrichment.
- GET /healthz returns 200 with basic service info and version.

# Testability & Stability
- Add unit tests simulating SNS events with fake payloads and verify handler invocation and failure recording.
- Add tests for GitHub enrichment: mock GitHub API endpoints and verify payload attachment.
- Add tests for /healthz endpoint returning expected JSON structure.
- Continue mocking fetch and OpenAIApi for event handler tests.

# Dependencies & Constraints
- Use Node 20 native http and fetch modules; no new dependencies.
- Maintain ESM compatibility and existing coding style.
- Respect rate limits on GitHub API when fetching enrichment data.

# User Scenarios & Examples
- AWS SNS: node src/lib/main.js --sns-notification path/to/sns.json to simulate an SNS invocation.
- GitHub Workflow: set GITHUB_ACTIONS, GITHUB_EVENT_NAME, GITHUB_EVENT_PATH, and GITHUB_TOKEN; run node src/lib/main.js; workflow parses JSON output including enrichment.
- CLI: node src/lib/main.js --github-event pull_request path/to/pr.json --enrich
- HTTP: curl -H "X-GitHub-Event: pull_request" -H "X-Enrich: true" -d @pr.json http://localhost:3000/events/github

# Verification & Acceptance
- All existing and new tests pass with npm test.
- README updated with SNS section, enrichment usage, CLI flags, and HTTP endpoints details.
- Backward compatibility maintained for existing digest workflows.
