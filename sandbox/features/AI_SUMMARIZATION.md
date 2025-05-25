# AI Summarization

## Objective & Scope
Add AI-powered summarization of digest events using the OpenAI API. Provide new CLI flag --summarize and HTTP endpoint POST /digest/summarize to generate concise summaries alongside batch processing.

## Value Proposition & Benefits
Users gain quick insights and summaries of digest payloads to streamline review and automated workflows, enhancing the core digest processing capability with generative AI.

## Requirements & Success Criteria
- Implement summarizeDigest function in src/lib/main.js that sends the digest payload to OpenAI ChatCompletion with appropriate system and user prompts.
- Create summarizationHandler that wraps digestLambdaHandler and summarizeDigest, returning both batchItemFailures and summary text.
- Extend CLI in src/lib/main.js to support --summarize flag. When provided with an optional file path argument or default example digest, invoke summarizationHandler and output JSON containing summary and failures.
- Extend HTTP API server in src/lib/main.js to add POST /digest/summarize endpoint. Accept JSON body, call summarizationHandler, and return JSON with fields summary and batchItemFailures.
- Add Vitest tests in tests/unit/ to mock openai and verify summarizeDigest and CLI behavior. Add Supertest tests in sandbox/tests to cover the new HTTP endpoint and edge cases.
- Update README.md with description, usage examples for CLI and HTTP summarization, and environment variable configuration for OPENAI_API_KEY.

## Dependencies & Constraints
Leverage existing openai dependency and config.OPENAI_API_KEY. Ensure ESM compatibility and Node 20 support. Follow zod validation for input payload.

## User Scenarios & Examples
A developer runs: node src/lib/main.js --summarize events.json and receives JSON with summary and failures. A monitoring tool posts JSON to POST /digest/summarize and displays the AI-generated summary.

## Verification & Acceptance
Vitest tests cover summarization logic. Supertest tests cover HTTP endpoint. Manual test with real OPENAI_API_KEY produces coherent summaries.