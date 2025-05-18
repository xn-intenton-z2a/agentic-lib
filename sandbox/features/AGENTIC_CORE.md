# Agentic Core Feature Specification

## 1. Overview
This feature delivers essential building blocks for autonomous, agentic workflows in Node.js projects. It consolidates environment configuration, structured logging, AWS SQS client utilities and queue management, Lambda handler, CLI interface with SQS commands, HTTP server endpoints, and GitHub API integrations into a single cohesive module. Each component is designed for high reliability, testability, and seamless integration.

## 2. Environment Configuration
- Load environment variables using dotenv and validate with Zod:
  • GITHUB_API_BASE_URL (string, optional, default https://api.github.com)
  • GITHUB_TOKEN (string, required)
  • OPENAI_API_KEY (string, required)
  • PORT, CORS_ALLOWED_ORIGINS, RATE_LIMIT_REQUESTS, METRICS_USER, METRICS_PASS, DOCS_USER, DOCS_PASS
  • AWS_SQS_QUEUE_URLS (array of string, optional)

## 3. Structured Logging Helpers
- logInfo(message: string): void
- logError(message: string, error?: any): void
- Format logs as JSON with level, timestamp, message, and optional context or stack
- Support verbose mode for detailed diagnostics

## 4. AWS SQS Utilities & Queue Management
- Add client functions using @aws-sdk/client-sqs:
  • sendMessageToQueue(queueUrl: string, messageBody: object, options?): Promise<{ MessageId }>
  • receiveMessages(queueUrl: string, maxMessages?, waitTimeSeconds?): Promise<Array<{ MessageId, Body, Attributes }>>
  • purgeQueue(queueUrl: string): Promise<void>
  • configureDeadLetterQueue(sourceQueueUrl: string, deadLetterQueueArn: string, maxReceiveCount: number): Promise<void>
- Log each SQS request and response, throw descriptive errors on failure
- Retain createSQSEventFromDigest and digestLambdaHandler for event simulation and processing

## 5. CLI Interface
- Extend main(args) to support new flags:
  • --send-queue <url> <json-body> : send a JSON payload to SQS
  • --receive-queue <url> [max]    : fetch messages from SQS
  • --purge-queue <url>            : purge all messages from SQS
  • --dead-letter <sourceUrl> <dlqArn> <maxCount> : configure DLQ policy
- Preserve --help, --version, --digest flags and early exit behavior

## 6. HTTP Server Endpoints
- startServer(options?): http.Server with existing endpoints plus new routes:
  • POST /queue/send    accepts JSON { queueUrl, body, delaySeconds } and returns { MessageId }
  • GET  /queue/receive  query params queueUrl, maxMessages, waitTimeSeconds
  • DELETE /queue/purge  query param queueUrl
  • PUT  /queue/dead-letter accepts JSON { sourceQueueUrl, deadLetterQueueArn, maxReceiveCount }
- Protect endpoints with Basic Auth if configured
- Record HTTP request and failure metrics

## 7. GitHub API Utilities
- Export functions:
  • createIssue, listIssues, createBranch, commitFile, createPullRequest
- Authenticate with GITHUB_TOKEN, log requests and responses

## 8. Success Criteria & Testing
- All existing Vitest tests continue passing
- Add unit tests mocking SQS client:
  • sendMessageToQueue resolves with MessageId and errors on invalid inputs
  • receiveMessages returns parsed messages and handles empty queues
  • purgeQueue resolves successfully and rejects on invalid URL
  • configureDeadLetterQueue applies correct RedrivePolicy and handles errors
- Add integration tests for new CLI flags and HTTP queue routes

## 9. Documentation & README Updates
- Update README key features to include SQS client utilities and HTTP queue API
- Add usage examples for new CLI flags and HTTP endpoints in sandbox/docs/SERVER.md
- Ensure openapi.json and docs page reflect new queue endpoints

## 10. Dependencies & Constraints
- Modify src/lib/main.js, sandbox/source/server.js, tests and docs under sandbox/
- Add dependency "@aws-sdk/client-sqs" in package.json
- Maintain Node 20+ ESM compatibility and existing coding standards