# Value Proposition

- Add a dedicated CLI flag `--agentic` to trigger an agentic workflow using the core library’s planning and execution pipeline.
- Leverage the existing OpenAI integration to generate an AI-driven plan and execute each step, providing a self-evolving code review and update mechanism via GitHub.
- Combine with `--verbose` and `--stats` flags to give users fine-grained control over logging detail and runtime metrics for agentic executions.

# Success Criteria & Requirements

- Extend sandbox/source/main.js and src/lib/main.js to recognize the `--agentic` flag prior to all other processing.
  - In sandbox/source/main.js, implement `processAgentic(args)`:
    - When `--agentic` is present, read a JSON event payload from stdin.
    - Import and invoke `agenticLambdaHandler` from `src/lib/main.js` with the parsed payload.
    - Ensure `VERBOSE_MODE` controls inclusion of extra debug data in logs and `VERBOSE_STATS` prints `{ callCount, uptime }` after completion.
  - In src/lib/main.js, export `agenticLambdaHandler(event)`:
    - Log the start of the agentic workflow with `logInfo`.
    - Use the OpenAI client to call `createChatCompletion` with a prompt derived from the event.
    - Parse the AI response as a JSON plan containing an ordered list of tasks.
    - For each task, log execution with `logInfo` and include any `verbose` details if enabled.
    - Return a summary object with completed tasks and any errors.
- Update `generateUsage()` in both sandbox and core to include `--agentic`, `--verbose`, and `--stats` in the usage instructions.
- Update `README.md` in sandbox to document the `--agentic` option with examples combining flags.

# User Scenarios & Examples

## Agentic Workflow Invocation
Run an agentic workflow reading a GitHub workflow call event from stdin:

$ echo '{"headers":{"x-github-event":"workflow_call"},"body":{"event":"workflow_call"}}' \
  | node sandbox/source/main.js --agentic --verbose --stats

Expect detailed AI planning traces in logs and a final JSON line with runtime metrics when `--stats` is set.

# Verification & Acceptance

- Add unit tests in `sandbox/tests` to:
  - Mock stdin with a sample event JSON and verify that `agenticLambdaHandler` is invoked.
  - Spy on `console.log` and `console.error` to assert:
    - `logInfo` is called for start, each task, and completion, with extra fields when `--verbose`.
    - A final metrics JSON line is printed when `--stats` is present.
- Add unit tests in `tests/unit` for `agenticLambdaHandler`:
  - Mock the OpenAI API to return a fixed plan.
  - Ensure the handler logs each plan step and returns the expected summary object.
- Ensure existing tests for mission, help, version, and digest continue to pass without regression.
