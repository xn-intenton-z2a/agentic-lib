# Workflow Input Handler

## Objective & Scope
- Consolidate handling of GitHub Actions input events into unified handlers.
- Introduce workflowDispatchHandler to process workflow_dispatch events in addition to workflow_call.
- Ensure both handlers accept an inputs object with key, value, lastModified and enqueue messages for SQS processing via createSQSEventFromDigest and digestLambdaHandler.

## Value Proposition
- Simplifies integration of agentic-lib with GitHub Actions by supporting both workflow_call and workflow_dispatch events.
- Provides consistent input validation and error handling across event types.
- Reduces code duplication and maintenance overhead by unifying logic.

## Specification
- Export async functions workflowCallHandler(event) and workflowDispatchHandler(event) from src/lib/main.js.
- Both functions expect an event object containing inputs with fields:
  - key: string (required)
  - value: string (required)
  - lastModified: ISO timestamp string (required)
- Validate inputs using Zod. On validation failure, log error and throw exception.
- Construct SQS event payload via createSQSEventFromDigest and invoke digestLambdaHandler, returning its response.
- Write unit tests in tests/unit/main.test.js covering:
  - Successful invocation with valid inputs for both handlers.
  - Error paths when inputs are missing or invalid.
- Update README.md to document both exports, including API reference and usage examples for workflow_call and workflow_dispatch event handlers.

## Verification & Acceptance
- Unit tests cover valid and invalid inputs for both handlers.
- README updated with clear API reference and examples.
- Manual acceptance by simulating both workflow_call and workflow_dispatch events via CLI or Node invocation.