# GitHub Webhook Handler

This feature adds a handler to process GitHub webhook HTTP events. It converts the incoming webhook payload and headers into a digest message, wraps it in an SQS-style event, and invokes the existing digestLambdaHandler to process it. This enables direct integration of agentic-lib with GitHub event webhooks in serverless environments or HTTP servers.

# Value Proposition

- Simplifies direct handling of GitHub webhooks without external glue code
- Enables agentic workflows to trigger digest processing from real GitHub events
- Provides consistency by using existing SQS event simulation and Lambda handler

# Success Criteria & Requirements

- Accept raw HTTP request object with headers and JSON body object
- Validate common GitHub webhook headers: X-Github-Event and X-Github-Delivery
- Emit structured log entry indicating event type and delivery identifier
- Construct a digest object including eventType, deliveryId, and payload
- Create an SQS event via createSQSEventFromDigest and invoke digestLambdaHandler
- Return an HTTP response object with statusCode and JSON body containing success or error details

# Usage Example

Import and use within an HTTP server framework or serverless function:

const { githubWebhookHandler } = require('@xn-intenton-z2a/agentic-lib');

async function handler(req, res) {
  const result = await githubWebhookHandler({ headers: req.headers, body: req.body });
  res.status(result.statusCode).send(result.body);
}

# Verification & Acceptance

- Unit tests cover valid webhook conversion, invocation of digestLambdaHandler, and correct response format
- Tests simulate missing headers or invalid JSON and assert 400 response with error log entries
- Code adheres to ESM standards, runs on Node 20+, and passes existing lint and formatting rules
