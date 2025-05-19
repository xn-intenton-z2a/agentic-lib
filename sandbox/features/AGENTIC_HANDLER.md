# Objective
Add a new function named agenticHandler in src/lib/main.js that serves as the primary orchestrator for an agentic operation. It will accept a structured input object, call the OpenAI chat completion API, parse the JSON response, increment and track the global call count, and handle error conditions gracefully.

# Value Proposition
This function delivers the core agentic capability of the library by providing a reusable entry point to execute one step of an automated workflow with an LLM. It ensures consistent call counting for metrics, robust error handling to avoid workflow failures, and standardized logging for observability.

# Success Criteria & Requirements
- agenticHandler accepts a single parameter inputData (any serializable object).
- It constructs a chat request using the OpenAI API, passing the JSON stringified inputData as the user message.
- It increments globalThis.callCount by one before making the API call.
- It parses the chat completion response, extracting and returning a JavaScript object by JSON.parse on the content of the first choice message.
- On API errors or JSON parse errors, it logs an error with logError including stack trace when available, and rethrows the error.
- Covered by unit tests verifying successful response parsing, callCount increment, and error logging behavior.

# User Scenarios & Examples
- As a GitHub Actions workflow author, I can invoke agenticHandler({task: 'summarize', data: '...'}), receive an object with planned actions, and continue my pipeline without manual intervention.
- In a local CLI run, I can import and call agenticHandler to prototype an agentic step in isolation.

# Verification & Acceptance
- Unit tests in tests/unit/main.test.js cover:
  - Normal case: mock OpenAI returns a valid JSON payload; agenticHandler returns the expected object and increments callCount.
  - Error case: mock OpenAI throws; agenticHandler logs error and propagates the exception.
- README.md updated with API reference for agenticHandler, including parameter description and return value.
- No regressions in existing tests for main, version, and digest commands.
- All new code follows ESM, Node 20+, and passes linting and formatting checks.
