# Objective & Scope
Extend the library to unify event ingestion and dispatch for AWS SQS digest events, AWS SNS notifications, GitHub webhooks, GitHub Actions workflow_call events, and agentic AI processing. Provide flexible invocation via CLI flags, GitHub Actions mode auto-dispatch, an HTTP server API, and an AI-driven handler powered by OpenAI.

# Value Proposition
- Single library entrypoint for SQS, SNS, GitHub event handling, and AI-driven processing
- Local simulation of events via CLI including AI-based workflows
- Seamless integration in GitHub Actions with automatic dispatch and AI orchestration
- HTTP API endpoints for remote event delivery, AI invocation, and health checks
- Optional payload enrichment using GitHub API and OpenAI when authentication is configured

# Success Criteria & Requirements

## Configuration Schema
- Detect and validate AWS_SNS_TOPIC_ARN for SNS mode
- Detect GITHUB_ACTIONS, GITHUB_EVENT_NAME, and GITHUB_EVENT_PATH for Actions mode
- Allow optional GITHUB_TOKEN for GitHub enrichment
- Require OPENAI_API_KEY when using agenticHandler
- Preserve existing config parsing with Zod and environment fallbacks

## Event Handlers
- digestLambdaHandler: process SQS Records array or single record; report batchItemFailures
- snsNotificationHandler: parse each record.Sns.Message and dispatch to digestLambdaHandler
- gitHubEventHandler: handle issue, pull_request, and workflow_call events; attach GitHub metadata when requested
- agenticHandler: accept a generic event payload, call OpenAI chat completion with OPENAI_API_KEY, parse assistant content as JSON, increment globalThis.callCount, and return structured AI response

## Invocation Modes
- CLI Flags:
  --digest to replay an example SQS digest
  --sns-notification <payloadFile> to simulate an SNS event
  --github-event <type> <payloadFile> to simulate a GitHub webhook or workflow_call event
  --agentic <payloadFile> to trigger AI-driven processing of an event payload
  --enrich to fetch and attach GitHub metadata when simulating events locally
  --actions-simulate to mimic GitHub Actions environment locally
- GitHub Actions Mode: detect GITHUB_ACTIONS, read event name and payload from env; auto-dispatch to appropriate handler including agenticHandler when event_name is workflow_call with AI intent
- HTTP Server (when HTTP_ENABLED=true):
  POST /events/digest → digestLambdaHandler
  POST /events/sns → snsNotificationHandler
  POST /events/github → gitHubEventHandler
  POST /events/agentic → agenticHandler
  GET /healthz → return service status and version

# Testability & Stability
- Unit tests for each handler including agenticHandler with mocked OpenAI responses
- Verify callCount increments and error handling for invalid payload or API errors
- Integration tests for CLI flags and HTTP endpoints returning expected status and payload

# Dependencies & Constraints
- Node 20, ESM module standard, use native http and fetch
- Use openai library for agenticHandler; require OPENAI_API_KEY
- Respect GitHub API rate limits and handle fetch errors gracefully

# User Scenarios & Examples
- Simulate an SNS event: node src/lib/main.js --sns-notification path/to/sns.json
- Run agentic handler locally: node src/lib/main.js --agentic path/to/event.json --enrich
- Send a GitHub event over HTTP: curl -X POST -H "X-GitHub-Event: pull_request" -H "X-Enrich: true" -d @pr.json http://localhost:3000/events/github
- Invoke agentic endpoint: curl -X POST -H "Content-Type: application/json" -d @ev.json http://localhost:3000/events/agentic

# Verification & Acceptance
- npm test passes all new and existing tests
- README updated with CLI, HTTP, and Actions usage examples including agentic workflows
- Backward compatibility preserved for existing digest and enrichment workflows