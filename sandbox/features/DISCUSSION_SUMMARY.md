# Objective and Scope

Add a dedicated `--summarize-discussion` CLI command to generate concise summaries of GitHub discussion transcripts with detailed cost metrics. The command will read a JSON file containing an array of discussion messages, invoke the OpenAI API to produce a summary, and include token usage and estimated dollar cost based on model pricing in the output.

# Value Proposition

By providing both a high-level summary and transparent cost reporting, teams can quickly understand the substance of long discussion threads while managing API budgets. This feature simplifies integration into CI pipelines, dashboards, or developer workflows for monitoring both content and spending on LLM calls.

# Requirements

## CLI Integration

- In `src/lib/main.js`, implement `processSummarizeDiscussion(args)`:
  - Detect the `--summarize-discussion` flag with an optional file path argument (default `discussion/input.json`).
  - Read and parse the specified JSON file of the form `{ messages: [ { role: string, content: string } ] }`.
  - Call OpenAIApi.createChatCompletion with a system prompt describing summarization and the discussion messages.
  - Extract the summary text from the response, plus token usage details (`usage.prompt_tokens`, `usage.completion_tokens`, `usage.total_tokens`).
  - Compute estimated cost as `(total_tokens / 1000) * modelPrice` (e.g., 0.002 dollars per 1K tokens).
  - Emit a JSON object via `logInfo` containing: summary, promptTokens, completionTokens, totalTokens, estimatedCost.
  - Handle API errors by calling `logError` and exiting with code 1.

- In the `main` function, invoke `await processSummarizeDiscussion(args)` after existing flag handlers.

## Source File Updates

- Import OpenAIApi and Configuration from `openai` at the top of `main.js`.
- Define `processSummarizeDiscussion` with appropriate error handling and logging.
- Use environment variable or hard-coded price constant for model cost.

## Test File Updates

- Create `tests/unit/summarizeDiscussion.test.js` with tests for:
  - Successful summary: mock OpenAI API to return known usage and summary, invoke `main(["--summarize-discussion", tempFilePath])`, capture stdout, parse JSON, and assert fields.
  - Error handling: mock API to throw or simulate invalid JSON file, capture stderr, and assert `logError` output and exit code.

- Use temporary files and Vitest mocks as in existing tests.

## README Updates

- Under CLI Usage, document the new `--summarize-discussion [file]` option, default path, parameters, and example invocation:

  npx agentic-lib --summarize-discussion discussion/input.json

- Show example output JSON including cost metrics.

## Dependencies

- No new dependencies aside from existing `openai` package.

# Verification and Acceptance

- Unit tests must cover success and failure paths with at least 90% branch coverage in `processSummarizeDiscussion`.
- Manual test: create a sample `discussion/input.json` with several messages, run `npx agentic-lib --summarize-discussion`, and verify structured JSON with summary and cost appears in stdout.
