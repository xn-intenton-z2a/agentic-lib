# Value Proposition

Unify and extend the existing CLI across both sandbox and library entry points to include a new --ask interactive AI assistant mode. Users can now send custom prompts to the OpenAI chat endpoint directly from either CLI and receive structured responses that accelerate development tasks, automate content generation, or provide code suggestions.

# Success Criteria & Requirements

## 1. New --ask Flag in Both Entry Points

- CLI must recognize a new flag `--ask <prompt>` in both `src/lib/main.js` and `sandbox/source/main.js`.
- When `--ask` is provided, skip any other commands and invoke the OpenAI chat completion API with the prompt.
- Read the API key from the existing `config.OPENAI_API_KEY`. If missing, log an error with `logError` and exit with a non-zero code.

## 2. OpenAI Chat Integration

- Import `Configuration` and `OpenAIApi` from the openai dependency in both entry files.
- Instantiate `OpenAIApi` using the configuration built from `config.OPENAI_API_KEY`.
- Call `createChatCompletion` with a chat model (e.g., "gpt-4") and the user prompt.
- Await the response, extract `choices[0].message.content`, and print it to stdout.
- On API errors, call `logError` with a descriptive message and exit gracefully.

## 3. Tests Coverage

- Add unit tests in `tests/unit/main.cli.test.js` to simulate OpenAI responses via a Vitest mock and assert that the library CLI prints the mocked content for `--ask`.
- Add tests in `sandbox/tests/cli.ask.test.js` to cover the sandbox CLI `--ask` behavior, mocking `fs/promises` and OpenAI.
- Ensure tests cover both successful completion and missing API key error scenarios.

## 4. Usage Documentation

- Update the `generateUsage` function in both entry files to include:
    --ask "<prompt>"     Send a prompt to the OpenAI chat endpoint and print the response.
- Update `README.md` and `sandbox/README.md` to show usage examples for `--ask` in both contexts.

# Dependencies & Constraints

- Leverage the existing `openai` dependency; no new packages.
- Use only existing configuration via `config.OPENAI_API_KEY` for authentication.
- Changes limited to:
  - `src/lib/main.js` and `sandbox/source/main.js` to implement the feature.
  - New or updated tests in `tests/unit/` and `sandbox/tests/` to cover `--ask` behavior.
  - `README.md` and `sandbox/README.md` to add usage example for `--ask`.
- Maintain ESM standards, Node >=20 compatibility, and existing coding style.

# User Scenarios & Examples

- Developer runs:
  node src/lib/main.js --ask "Generate a function to reverse a string"

  CLI outputs the AI response, for example:
  function reverseString(s) { return s.split('').reverse().join(''); }

- Developer runs in sandbox:
  node sandbox/source/main.js --ask "Create a GitHub issue draft for vulnerability"

# Verification & Acceptance

1. Unit tests simulate OpenAI responses via Vitest mock and assert that both CLI prints the mocked content.
2. When `OPENAI_API_KEY` is missing, the process logs an error and exits with a non-zero code in both contexts.
3. `npm test` covers new tests without causing regressions in existing tests.
4. Manual smoke test running the command against the real API (with a valid key) returns a human-readable response.