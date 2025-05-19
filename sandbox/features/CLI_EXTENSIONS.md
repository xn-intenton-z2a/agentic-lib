# Usage Statistics Enhancement

## Purpose
Extend the CLI to provide built-in runtime statistics reporting for invocation count and uptime using a simple flag.

## Value Proposition
Operators gain immediate insight into how often commands run and how long the process lives without external monitoring or infrastructure changes.

## Success Criteria & Requirements
1. Add a `--stats` CLI flag recognized in any command path (`--help`, `--version`, `--digest`, or default) that triggers printing of a JSON object after primary output.
2. Maintain a global invocation counter in `globalThis.callCount`, incremented at each entry point: `main()`, `processHelp()`, `processVersion()`, `processDigest()`, and `digestLambdaHandler()`.
3. Compute uptime with `process.uptime()` at the moment of stats printing.
4. Stats output JSON must include:
   - `callCount`: integer
   - `uptime`: number of seconds (millisecond precision)
5. No behavior change or extra output when `--stats` is not provided.
6. No new external dependencies.

## Implementation Details
- In `src/lib/main.js`:
  1. Initialize `globalThis.callCount = 0` if undefined at module load.
  2. At start of each public function entry (`main()`, `processHelp()`, `processVersion()`, `processDigest()`, `digestLambdaHandler()`), increment `callCount`.
  3. Detect `--stats` in arguments and after primary output, log JSON via `console.log(JSON.stringify({ callCount, uptime }))`.
  4. Extract flag detection into a helper `shouldPrintStats(args)`.
  5. Update `generateUsage()` to describe the `--stats` flag.

- In `tests/unit/main.test.js` and sandbox tests:
  1. Mock `process.uptime()` to a fixed value.
  2. Write tests for each command scenario with `--stats`, verifying primary output first, then JSON stats.
  3. Test direct invocation of `digestLambdaHandler()` increments `callCount` and reflected in subsequent CLI runs with `--stats`.

- In `sandbox/README.md`:
  1. Document `--stats` usage, JSON schema, example invocations.
  2. Link to MISSION.md and CONTRIBUTING.md.

---

# Chat Completion CLI Command

## Purpose
Provide a built-in CLI command to submit a prompt to the OpenAI chat API and display the response, enabling quick experimentation and integration in workflows.

## Value Proposition
Users can interact directly with the AI model from the CLI for prototyping, debugging, or embedding responses in automation scripts, without writing custom code or separate HTTP clients.

## Success Criteria & Requirements
1. Add a `--chat <prompt>` CLI flag that passes the provided prompt string to the OpenAI chat completion endpoint.
2. Use the existing `openai` dependency to call `createChatCompletion` with model `gpt-3.5-turbo` and given prompt.
3. Print the AI response content to stdout in plain text.
4. Support an optional `--chat-json` flag that outputs raw JSON response.
5. CLI should return a non-zero exit code on API errors, with a clear error message logged via `logError`.
6. The feature must work within Node 20 and use only existing dependencies.

## Implementation Details
- In `src/lib/main.js`:
  1. Import `OpenAIApi` and `Configuration` from `openai`.
  2. Implement a `processChat(args)` function:
     - Detect `--chat` or `--chat-json` flags.
     - Extract prompt text following the flag.
     - Configure OpenAI client with `OPENAI_API_KEY` from env.
     - Call `createChatCompletion` and await response.
     - On success, output either plain text or raw JSON.
     - On failure, call `logError` and exit with code 1.
  3. In `main()`, before default fallback, run `await processChat(args)` and return true if processed.
  4. Add usage text for `--chat` and `--chat-json` in `generateUsage()`.

- In `tests/unit/main.test.js` and new sandbox tests:
  1. Mock `openai` client to simulate a successful chat completion and an error.
  2. Test normal `node main.js --chat "Hello world"` prints expected message.
  3. Test `--chat-json` outputs full JSON.
  4. Test error path prints error message and exit code.

- In `sandbox/README.md`:
  1. Document CLI syntax for chat commands.
  2. Show plain and JSON output examples.

## Dependencies & Constraints
- Uses existing `openai` package.
- No additional dependencies added.

## Verification & Acceptance
- All tests pass under `npm test`.
- CLI commands behave as documented.
- ESLint, Prettier, and existing CI checks remain green.