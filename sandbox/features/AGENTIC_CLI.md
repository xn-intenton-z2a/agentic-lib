# Value Proposition

Extend the existing CLI to include an interactive AI assistant mode, enabling users to send custom prompts to the OpenAI chat endpoint directly from the command line and receive structured responses that can accelerate development tasks, automate content generation, or provide code suggestions.

# Success Criteria & Requirements

## 1. New --ask Flag

- CLI must recognize a new flag `--ask <prompt>` where `<prompt>` is a user-supplied string.
- When `--ask` is provided, skip other commands and invoke the OpenAI chat completion API with the prompt.
- Read the API key from the existing `config.OPENAI_API_KEY`. If missing, log an error and exit with a non-zero code.

## 2. OpenAI Chat Integration

- Import `Configuration` and `OpenAIApi` from the openai dependency.
- Instantiate OpenAIApi using the configuration built from `config.OPENAI_API_KEY`.
- Call `createChatCompletion` with a chat model (e.g., "gpt-4") and the user prompt.
- Await the response, extract `choices[0].message.content`, and print it to stdout.
- On API errors, call `logError` with a descriptive message and exit gracefully.

## 3. Usage Documentation

- Update the usage instructions in `generateUsage` to show:
  --ask "<prompt>"   Send a prompt to the OpenAI chat endpoint and print the response.

# Dependencies & Constraints

- Leverage the existing `openai` dependency; no new packages.
- Use `config.OPENAI_API_KEY` for authentication.
- Changes limited to:
  - `src/lib/main.js` to implement the feature.
  - New or updated tests in `tests/unit/` and `sandbox/tests/` to cover `--ask` behavior.
  - `sandbox/README.md` to add usage example for `--ask`.
- Maintain ESM standards, Node >=20 compatibility, and existing coding style.

# User Scenarios & Examples

- Developer runs:
  node src/lib/main.js --ask "Generate a function to reverse a string"

- CLI outputs the AI response, for example:
  function reverseString(s) { return s.split('').reverse().join(''); }

# Verification & Acceptance

1. Unit tests simulate OpenAI responses via a Vitest mock and assert that the CLI prints the mocked content.
2. When `OPENAI_API_KEY` is missing, the process logs an error and exits with a non-zero code.
3. `npm test` covers new tests without regressions.
4. Manual smoke test running the command against the real API (with a valid key) returns a human-readable response.