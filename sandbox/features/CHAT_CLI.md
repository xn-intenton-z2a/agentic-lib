# Objective & Scope
Provide a new CLI subcommand that allows users to send arbitrary text prompts to the OpenAI API and receive structured responses. This extends the existing CLI functionality, leveraging the configured API key to perform chat completions directly from the terminal.

# Value Proposition
- Empowers developers to prototype conversational interactions or test prompt ideas without leaving the terminal.
- Demonstrates core OpenAI integration in agentic-lib, showcasing the agentic coding system in action.
- Complements the `--digest` and `--version` commands by introducing a true AI capability that can be scripted or used in CI workflows.

# Success Criteria & Requirements
- Add a new CLI flag `--chat <prompt>` in `src/lib/main.js`.
- Use the `openai` package and the existing `OPENAI_API_KEY` configuration to construct a `Configuration` and `OpenAIApi` client.
- Invoke `createChatCompletion` with a minimal chat model (gpt-3.5-turbo) and the supplied user prompt.
- Parse the API response and output the assistant's message content to stdout in JSON form.
- Handle and log errors using `logError`, returning an exit code of `1` on failure.
- Increase `globalThis.callCount` by one for each invocation and include stats when `VERBOSE_STATS` is enabled.
- Write unit tests in `tests/unit/chat-cli.test.js` using `vi.mock` to simulate the OpenAI API, verifying success and error scenarios.
- Document usage examples in `sandbox/README.md`, showing how to invoke the chat command and interpret the output.

# Test Scenarios & Examples
- Running `node src/lib/main.js --chat "Hello, AI!"` prints a JSON string with the API response message content.
- Simulating an API error causes a logged error entry and process exit code `1`.
- When `VERBOSE_STATS` is true, the output includes callCount and uptime JSON following the response.

# Verification & Acceptance
- New tests in `tests/unit/chat-cli.test.js` pass and cover success and error flows.
- Manual testing confirms the CLI flag is recognized, calls the OpenAI API, and prints the correct JSON output.
- README examples accurately reflect usage and exit codes.