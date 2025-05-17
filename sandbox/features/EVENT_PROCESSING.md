# Objective & Scope
Enhance the existing HTTP server and CLI library to fully implement AI-driven suggestions via an agenticHandler, alongside secure event ingestion and operational endpoints. This feature covers:

- Implementing agenticHandler using OpenAI ChatCompletion API, parsing and returning structured suggestions.
- Integrating agenticHandler into the HTTP REST endpoints and CLI flags.
- Reusing existing logging utilities and configuration.

# Value Proposition

- Empowers users with automated, contextual AI-generated suggestions for GitHub issues or identifiers.
- Unifies event processing and AI-driven workflows under a single, lightweight HTTP and CLI-based interface.
- Maintains low-dependency footprint by using built-in http, zod, and the openai SDK.

# Success Criteria & Requirements

## Agentic Handler Implementation
- Add an async function agenticHandler(payload) in src/lib/main.js.
- Initialize OpenAIApi client with OPENAI_API_KEY from config.
- Call createChatCompletion with a prompt schema wrapping payload.issueUrl or payload.id.
- Parse the assistant response as JSON; expect fields: suggestion, refinement, metadata.
- Return an object: { suggestion, refinement, metadata, handler } referencing the function path.
- On invalid JSON or API errors, throw with descriptive messages.

## CLI Integration
- Introduce processAgentic(args) complementing processDigest.
- Recognize a --agentic flag with parameters: --issueUrl or --id.
- Construct payload from args and invoke agenticHandler.
- Log results via logInfo and return true to signal handling.
- Update main() to call processAgentic in the CLI flow before default usage output.

## HTTP Endpoint
- In the built-in HTTP server, add POST /agentic validating body with zod: issueUrl (string) or id (string or number).
- Invoke agenticHandler with validated payload.
- Return 200 with JSON: { suggestion, refinement, metadata, handler } on success.
- Return 400 for validation errors and 500 for handler exceptions, with structured logs.

# Testability & Stability
- Unit tests for agenticHandler: mock OpenAIApi to return valid and malformed JSON; assert correct parsing and error paths.
- Unit tests for processAgentic(): mock args and agenticHandler; verify CLI flow and logging.
- Integration tests with supertest covering /agentic endpoint success, 400 validation, and 500 errors.
- Maintain overall coverage > 90% for new code paths.

# Dependencies & Constraints
- Use openai SDK version aligned with package.json.
- Continue Node 20 ESM compatibility; no additional HTTP frameworks beyond built-in http.
- Reuse zod for schema validation and existing logInfo/logError utilities.

# User Scenarios & Examples
- CLI: npx agentic-lib --agentic --issueUrl https://github.com/org/repo/issues/123 generates AI suggestions in terminal logs.
- HTTP: POST /agentic with { issueUrl: string } returns structured AI suggestion payload.

# Verification & Acceptance
- Run unit and integration tests with npm test; all pass.
- Manual test: start HTTP server locally; exercise POST /agentic with curl; inspect JSON response and logs.
- Review logs for structured JSON entries at info and error levels.
