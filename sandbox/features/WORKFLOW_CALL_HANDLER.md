# Workflow Call Handler

## Objective & Scope
- Introduce a new async function workflowCallHandler to handle GitHub Actions workflow_call events.
- Accept an inputs object matching Action inputs: key, value, lastModified.
- Validate required inputs and throw or log errors for missing or malformed values.
- Construct a digest payload and delegate processing to createSQSEventFromDigest and digestLambdaHandler.

# Value Proposition
- Enables seamless integration of agentic-lib into GitHub Actions using the workflow_call event.
- Simplifies enqueuing digests from Action inputs without custom scripts.
- Maintains consistency with existing SQS and Lambda handler abstractions.

# Specification
- Export async function workflowCallHandler(event) from src/lib/main.js.
- Parameter event must contain event.inputs with fields:
  - key: string (required)
  - value: string (required)
  - lastModified: ISO timestamp string (required)
- Validate inputs using Zod or manual checks, log error and throw if invalid.
- Internally call createSQSEventFromDigest with the parsed digest object.
- Await digestLambdaHandler and return its response to the caller.
- Write unit tests in tests/unit/main.test.js covering:
  - Successful invocation with valid inputs.
  - Error path when inputs are missing or invalid.
- Update README.md to document the new export, including:
  - API reference for workflowCallHandler.
  - Example snippet of a GitHub Action using workflow_call.

# Verification & Acceptance
- Unit tests achieve coverage for the happy path and error handling.
- Documentation updated in README.md with clear usage examples.
- Manual acceptance: simulate workflow_call inputs through CLI in sandbox/tests/.