# Value Proposition
Extend the sandbox CLI into a combined HTTP server and interactive chat interface powered by OpenAI. Enable both programmatic and CLI-driven chat completions to support summarization, refinement, and automated agentic workflows.

# Success Criteria & Requirements
- CLI Flag: Support a new --chat <prompt> flag that sends the given prompt to OpenAI’s createChatCompletion API, parses the JSON response content, and prints it to stdout.
- HTTP Endpoint: Extend the existing --serve HTTP server with a new POST /chat endpoint that accepts JSON { prompt: string, model?: string, maxTokens?: number } and returns JSON { response: string }.
- Configuration: Honor environment variables OPENAI_API_KEY, OPENAI_API_BASE_URL (override), OPENAI_CHAT_MODEL (default gpt-3.5-turbo), and OPENAI_MAX_TOKENS (default 500).
- Logging & Observability: Use logInfo and logError to record incoming prompts, model selection, and OpenAI responses. Respect VERBOSE_MODE and VERBOSE_STATS flags for additional logging and stats in HTTP responses.
- Error Handling: Validate prompt presence and type, return HTTP 400 on invalid input, and HTTP 502 on OpenAI API failures with structured error messages.

# Testing & Verification
- Unit Tests: Mock openai.OpenAIApi to simulate successful chat responses and errors. Verify CLI --chat prints correct output and exits with code 0 on success and non-zero on failure.
- HTTP Tests: Use vitest and Node http mocks to verify POST /chat accepts valid JSON, applies defaults, handles missing prompt, and returns expected JSON or error codes.
- Integration Checks: Test behavior when OPENAI_API_KEY is missing, expecting validation errors both in CLI and HTTP paths.

# Dependencies & Constraints
- Update sandbox/source/main.js, sandbox/tests/main.chat.test.js, sandbox/docs/USAGE.md, sandbox/README.md, and package.json scripts as needed.
- Reuse the existing openai package and configuration logic. No new files should be created.
- Maintain Node 20 ESM compatibility and vitest testing.

# User Scenarios & Examples
## CLI Chat Completion
node sandbox/source/main.js --chat "Summarize recent pull requests."

## HTTP Chat Completion
curl -X POST http://localhost:3000/chat -H 'Content-Type: application/json' -d '{ "prompt":"Generate issue summary" }'
