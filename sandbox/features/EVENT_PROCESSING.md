# Objective & Scope
Extend the library to unify event ingestion and dispatch for AWS SQS digest events, AWS SNS notifications, GitHub webhooks, and GitHub Actions workflow_call events. Provide flexible invocation via CLI flags, GitHub Actions mode auto-dispatch, and an HTTP server API. When a GITHUB_TOKEN is supplied, enrich GitHub payloads with repository metadata and pull request context.

# Value Proposition
- Single library entrypoint for SQS, SNS, and GitHub event handling
- Local simulation of events for development and testing via CLI
- Seamless integration in GitHub Actions with automatic dispatch based on GITHUB_EVENT_NAME
- HTTP API endpoints for remote event delivery and operational health checks
- Optional payload enrichment using GitHub API when authentication is configured

# Success Criteria & Requirements

## Configuration Schema
- Detect and validate AWS_SNS_TOPIC_ARN for SNS mode
- Detect GITHUB_ACTIONS, GITHUB_EVENT_NAME, and GITHUB_EVENT_PATH for Actions mode
- Allow optional GITHUB_TOKEN for enrichment; require token when enrichment is enabled
- Preserve existing config parsing with Zod and environment fallbacks

## Event Handlers
- digestLambdaHandler: process SQS Records array or single record; record failures in batchItemFailures
- snsNotificationHandler: parse each record.Sns.Message and dispatch to digestLambdaHandler
- gitHubEventHandler: handle issue, pull_request, and workflow_call events; attach enrichment when requested

## Invocation Modes
- CLI Flags:
  --digest to replay an example SQS digest
  --sns-notification <payloadFile> to simulate an SNS event
  --github-event <type> <payloadFile> to simulate a GitHub webhook or workflow_call event
  --enrich to fetch and attach GitHub metadata when simulating events locally
  --actions-simulate to mimic GitHub Actions environment locally
- GitHub Actions Mode: detect GITHUB_ACTIONS, read event name and payload from env; auto-dispatch to appropriate handler
- HTTP Server (when HTTP_ENABLED=true):
  POST /events/digest → digestLambdaHandler
  POST /events/sns → snsNotificationHandler
  POST /events/github → gitHubEventHandler (use X-GitHub-Event header or explicit type field; support X-Enrich: true)
  GET /healthz → return service status and version

# Testability & Stability
- Unit tests for each handler with mock payloads and failure simulation
- Mock GitHub API endpoints to verify enrichment logic
- Integration tests for CLI flags and HTTP endpoints returning expected status and payload
- Maintain coverage on existing logConfig, logInfo, and logError functions

# Dependencies & Constraints
- Node 20, ESM module standard, use native http and fetch
- No additional dependencies beyond existing AWS SDK, OpenAI, and Zod
- Respect GitHub API rate limits and handle fetch errors gracefully

# User Scenarios & Examples
- Simulate an SNS event: node src/lib/main.js --sns-notification path/to/sns.json
- Run in Actions mode with enrichment: set GITHUB_ACTIONS=true, GITHUB_EVENT_NAME=pull_request, GITHUB_EVENT_PATH=pr.json, GITHUB_TOKEN=token; node src/lib/main.js
- Send a GitHub event over HTTP: curl -X POST -H "X-GitHub-Event: pull_request" -H "X-Enrich: true" -d @pr.json http://localhost:3000/events/github

# Verification & Acceptance
- npm test passes all new and existing tests
- README updated with CLI, HTTP, and Actions usage examples
- Backward compatibility preserved for existing digest workflows