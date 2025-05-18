# Agentic Core Feature Specification

## 1. Overview
This feature delivers essential building blocks for autonomous, agentic workflows. It consolidates environment configuration, structured logging, AWS SQS utilities and queue management, Lambda handler, CLI interface, HTTP server endpoints, and GitHub API integrations into a single cohesive module. Each component is designed for high reliability, testability, and seamless integration in Node.js projects.

## 2. Environment Configuration
- Load environment variables using dotenv.
- Validate required and optional variables with Zod schema:
  • GITHUB_API_BASE_URL (string, optional, default https://api.github.com)
  • GITHUB_TOKEN (string, required for GitHub API calls)
  • OPENAI_API_KEY (string, required for chat utilities)
  • PORT, CORS_ALLOWED_ORIGINS, RATE_LIMIT_REQUESTS, METRICS_USER, METRICS_PASS, DOCS_USER, DOCS_PASS
  • AWS_SQS_QUEUE_URLS (array of string, optional) for direct queue operations

## 3. Structured Logging Helpers
- Export logInfo(message: string): void and logError(message: string, error?: any): void.
- Format logs as JSON with level, timestamp, message, and optional context or stack.
- Allow verbose mode through environment variable for additional diagnostics.

## 4. AWS SQS Utilities, Queue Management & Lambda Handler
- Event utilities:
  • createSQSEventFromDigest(digest: object): SqsEvent to construct mock SQS event records.
- Lambda handler:
  • digestLambdaHandler(event: SqsEvent): Promise<{ batchItemFailures: Array<{ itemIdentifier: string }>, handler: string }>
    - Parse each record body as JSON, log successes and errors, return batch failures list.
- Queue management utilities (using @aws-sdk/client-sqs):
  • sendMessageToQueue(queueUrl: string, messageBody: object, options?: { delaySeconds?: number, messageAttributes?: Record<string, any> }): Promise<{ MessageId: string }>
  • receiveMessages(queueUrl: string, maxMessages?: number, waitTimeSeconds?: number): Promise<Array<{ MessageId: string, Body: string, Attributes: Record<string, any> }>>
  • purgeQueue(queueUrl: string): Promise<void> to remove all messages from the queue.
  • configureDeadLetterQueue(sourceQueueUrl: string, deadLetterQueueArn: string, maxReceiveCount: number): Promise<void> to set redrive policy on a queue.
- Log all SQS requests and responses. Throw descriptive errors on invalid inputs or AWS failures.

## 5. CLI Interface
- Support flags in main(args: string[]):
  • --help: print usage instructions and exit.
  • --version: print version and timestamp from package.json.
  • --digest: simulate SQS digest using createSQSEventFromDigest and digestLambdaHandler.
- Exit early on handled flags; default to usage instructions if no flags.

## 6. HTTP Server Endpoints
- Function startServer(options?: { port?: number }): http.Server:
  • GET /health: returns JSON { status, uptime, timestamp }.
  • GET /metrics: returns Prometheus metrics, protected by Basic Auth if configured.
  • GET /openapi.json: returns OpenAPI 3.0 spec for all endpoints.
  • GET /docs: returns HTML-rendered OpenAPI spec via MarkdownIt, protected by Basic Auth if configured.
- Enforce IP-based rate limiting with token bucket algorithm per minute.
- Record request counts and failure counts in memory.

## 7. GitHub API Utilities
- Export async functions using octokit or fetch:
  • createIssue(repo: string, title: string, body: string, labels?: string[]): Promise<object>
  • listIssues(repo: string, filters?: Record<string, any>): Promise<object[]>
  • createBranch(repo: string, baseBranch: string, newBranch: string): Promise<object>
  • commitFile(repo: string, branch: string, filePath: string, content: string, commitMessage: string): Promise<object>
  • createPullRequest(repo: string, title: string, head: string, base: string, body?: string): Promise<object>
- Authenticate with GITHUB_TOKEN and log requests and responses. Throw descriptive errors on failures.

## 8. Success Criteria & Testing
- All existing Vitest tests continue passing.
- Add tests mocking AWS SDK SQS client to verify new queue functions:
  • sendMessageToQueue resolves with MessageId for valid inputs.
  • receiveMessages returns parsed messages and handles empty queue.
  • purgeQueue resolves successfully and errors on invalid queue URL.
  • configureDeadLetterQueue applies correct redrive policy and handles errors.
- Mock HTTP and GitHub functions remain unchanged in their tests. Ensure backward compatibility.

## 9. Documentation & README Updates
- Update README key features to include SQS queue management utilities.
- Add usage examples for new queue management functions in sandbox/docs/SERVER.md or new sandbox/docs/SQS_QUEUE_MANAGEMENT.md.
- Ensure openapi.json reflects any server changes if applicable.

## 10. Dependencies & Constraints
- Only modify sandbox/source, sandbox/tests, sandbox/docs, sandbox/README.md, and package.json.
- Add dependency "@aws-sdk/client-sqs".
- Maintain Node 20+ ESM compatibility and align with existing coding standards.