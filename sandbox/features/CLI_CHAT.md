# Objective & Scope

Extend the existing CLI driver to include a new --chat flag that enables interactive or non-interactive exchanges with the OpenAI ChatCompletion API.  Maintain all current flags (--help, --version, --digest) while adding messaging capabilities to transform agentic-lib into a lightweight chat client for prototyping autonomous workflows.

# Value Proposition

- Provides users with a built-in interface to experiment with agent prompts without writing additional scripts.
- Leverages the existing OpenAI SDK dependency, requiring no new external libraries.
- Bridges the gap between library utilities and real-world agent conversations, aligning with the mission to power autonomous GitHub workflows.

# Success Criteria & Requirements

- Introduce a new --chat <message> CLI flag.
- If --chat is provided with a single string argument, send that message as a chat prompt to the OpenAI createChatCompletion endpoint and print the response content to stdout as JSON.
- If --chat is provided without an inline message, read lines from stdin until EOF, concatenate into a prompt, and then send to OpenAI.
- Preserve global callCount and (optionally) surface uptime and callCount in verbose stats mode if VERBOSE_STATS is enabled.
- Return an exit code of 0 on success, non-zero on API errors.

# Testability & Stability

- Add unit tests for processChat, mocking OpenAI API to return a canned completion.
- Add an integration test invoking the CLI with --chat "hello world" and asserting JSON output contains the dummy response.
- Ensure no external network calls by mocking openai.OpenAIApi in vitest.

# Dependencies & Constraints

- No new dependencies; reuse openai package already specified.
- Compatible with Node 20, ESM, and existing linting and formatting rules.
- CLI behavior must remain non-blocking for other flags.

# User Scenarios & Examples

- Single-shot chat:
```
npx agentic-lib --chat "What is the best practice for rate limiting?"
```
- Piped prompt from a file:
```
cat prompt.txt | npx agentic-lib --chat
```

# Verification & Acceptance

- All new tests pass under npm test, maintaining >90% coverage.
- Manual CLI runs produce valid JSON responses matching expected structure.
- No regressions in existing CLI flags or Lambda handlers.
