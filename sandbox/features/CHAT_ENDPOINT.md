# Chat Endpoint

## Objective & Scope
Provide an HTTP endpoint to accept user prompts for OpenAI chat completions and return the AI-generated response.

## Value Proposition
- Enable programmatic access to OpenAI's chat completion API through the existing HTTP server.
- Simplify integration tests and local development for conversational AI use cases.
- Provide a unified interface for health checks, metrics, digest processing, and AI chat in a single server.

## Success Criteria & Requirements
- POST /chat accepts JSON body matching the schema: { prompt: string, model?: string } validated with zod.
- Endpoint invokes OpenAI API using the configured OPENAI_API_KEY environment variable.
- Returns HTTP 200 with JSON { response: string } containing the AI-generated text on success.
- Returns HTTP 400 on payload validation errors, including details in the response body.
- Returns HTTP 502 on OpenAI API errors, with an error message.

## Testability & Stability
- Automated tests using supertest to verify /chat endpoint functionality in sandbox HTTP server.
- Mock openai.OpenAIApi in tests to simulate successful completions and error scenarios.
- Validate request bodies and error handling paths.

## Dependencies & Constraints
- openai library for chat completion.
- zod for request validation.
- express for HTTP routing.
- Compatible with Node 20 and ESM modules.

## Verification & Acceptance
- Unit and integration tests covering valid requests, validation failures, and API errors.
- Manual testing via curl or HTTP client to POST requests to /chat and inspect responses.