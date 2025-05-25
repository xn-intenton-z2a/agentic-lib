# CLI Chat Command

## Objective & Scope

Implement a new CLI flag to send chat prompts directly from the command line. This feature extends the existing CLI to accept a `--chat` argument followed by a message, invokes the OpenAI chat completion API, and prints the response to stdout without requiring an HTTP server.

## Value Proposition

- Provide direct access to conversational AI from the terminal, simplifying ad hoc queries and scripting scenarios.
- Eliminate the need to spin up the HTTP server for simple chat interactions, improving developer productivity.
- Seamlessly integrate with existing CI/CD and automation workflows that leverage the CLI.

## Success Criteria & Requirements

- Recognize a `--chat` flag followed by a non-empty prompt string.
- Validate that the prompt argument is provided; if missing, display the usage instructions and exit gracefully.
- Use the configured `OPENAI_API_KEY` and optional `OPENAI_MODEL` environment variable or default model to create a chat completion request via the OpenAI client.
- On successful response, print a JSON object `{ response: string }` to stdout and exit with code 0.
- On validation errors (e.g., empty prompt), return exit code 1 with an explanatory error message.
- On OpenAI API errors, log detailed error information to stderr and exit with code 1.
- Ensure existing CLI flags (`--help`, `--version`, `--digest`) remain functional and unchanged.

## Testability & Stability

- Write Vitest unit tests mocking `openai.OpenAIApi` to simulate success and failure scenarios.
- Test cases should cover:
  - Valid `--chat "Hello world"` invocation printing expected JSON and exit code 0.
  - Invocation of `--chat` without a prompt prints usage and exit code 1.
  - Simulated API failure logs error and exit code 1.
- Confirm that other CLI flags behave as before when combined with verbose stats settings.

## Dependencies & Constraints

- `openai` for chat completions (already a dependency).
- `zod` for prompt string validation.
- Node 20+ environment, ESM module support.
- No additional external services beyond OpenAI.

## Verification & Acceptance

- All new tests pass with `npm test` and maintain 100% coverage on new code paths.
- Manual validation by running `npm start -- --chat "Test prompt"` and inspecting stdout for correct JSON.
- Code review to ensure consistency with project style and no regressions in existing CLI behavior.