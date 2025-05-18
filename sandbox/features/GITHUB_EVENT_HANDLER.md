# GitHub Event Handler

This feature adds a unified HTTP handler to process GitHub events, including both standard webhook events and workflow_call events. It parses incoming HTTP requests, validates headers and payloads, constructs digest messages, and invokes the existing digestLambdaHandler for downstream processing.

# Value Proposition

- Provides a single integration point for all GitHub-driven workflows, reducing the need for multiple handlers or glue code.
- Supports both webhook events (e.g. push, pull_request) and workflow_call events to enable agentic workflows in serverless or HTTP server environments.
- Leverages existing SQS event simulation and digestLambdaHandler to maintain consistency and reuse core processing logic.

# Success Criteria & Requirements

- Expose an HTTP handler function that accepts a raw HTTP request object with headers and JSON body.
- Detect event type by inspecting the X-Github-Event header or the body.event field for workflow_call events.
- Validate required GitHub headers (X-Github-Event, X-Github-Delivery) for webhook events and required body properties for workflow_call events (workflow, action, inputs).
- Emit structured log entries indicating event type, delivery identifier, and workflow inputs when applicable.
- Construct a digest object containing eventType, deliveryId, payload, and workflowCallData (for workflow_call events).
- Use createSQSEventFromDigest to create an SQS-style event and invoke digestLambdaHandler with it.
- Return an HTTP response object with statusCode and JSON body indicating success or detailed error information.

# Usage Example

Import and use within an HTTP framework or serverless function:

const { githubEventHandler } = require('@xn-intenton-z2a/agentic-lib');

async function handler(req, res) {
  const result = await githubEventHandler({ headers: req.headers, body: req.body });
  res.status(result.statusCode).send(result.body);
}

# Verification & Acceptance

- Unit tests cover valid webhook and workflow_call event conversions, invocation of digestLambdaHandler, and correct HTTP response formatting.
- Simulate missing or invalid headers, invalid JSON, and missing workflow_call fields to assert appropriate 400 or 422 responses with error logs.
- Tests verify that workflow inputs are included in the digest for workflow_call events.
- Code adheres to ESM standards, runs on Node 20+, and passes lint and formatting rules.
