# Summarize Content

This feature extends the CLI summarization capabilities to support both SQS digest payloads and GitHub pull request diffs. With a single `--summarize` command mode, users can generate concise, AI-powered summaries of event data or code changes without manual inspection.

# Value Proposition

A unified summarization command helps developers and CI systems quickly grasp the essence of raw SQS events and pull request diffs. This reduces context-switching, accelerates code reviews, and improves documentation quality by providing human-readable summaries automatically.

# Success Criteria

- CLI accepts `--summarize-digest` with a JSON file path or inline JSON and prints a clear summary to standard output.
- CLI accepts `--summarize-pr` with a repository identifier and pull request number in the form `owner/repo#number`.
- On `--summarize-pr`, the tool fetches the PR diff via the GitHub API and calls OpenAI's `createChatCompletion` to generate a summary of changes.
- Errors in API calls to GitHub or OpenAI are logged via `logError`, and the CLI exits with a non-zero status.
- Tests mock both OpenAI and GitHub API clients to verify correct request parameters and handling of success and failure scenarios.

# Requirements

- In `src/lib/main.js`, implement two new functions: `summarizeDigest` (existing behavior) and `summarizePrDiff` to fetch PR diffs and invoke OpenAI summarization.
- Update CLI argument parsing in `main` to detect `--summarize-digest` and `--summarize-pr` flags and route to the appropriate summarization function.
- Use `@octokit/rest` or native `fetch` against `config.GITHUB_API_BASE_URL` for PR diff retrieval.
- Add Vitest tests in `sandbox/tests` to:
  - Mock OpenAI client responses for summary generation.
  - Mock GitHub API responses for PR diffs.
  - Assert that the CLI flags invoke correct functions and output expected summaries.
- Update `sandbox/README.md` with usage examples for both summarization modes.

# User Scenarios

1. A developer runs `agentic-lib --summarize-digest event.json` to obtain a human-readable summary of an SQS digest before diagnosing a production issue.
2. A reviewer runs `agentic-lib --summarize-pr xn-org/repo#42` to quickly understand the scope of code changes in a pull request without reading the full diff.
3. A CI workflow invokes `agentic-lib --summarize-pr owner/repo#123` and posts the summary to a pull request comment for automated context provisioning.

# Verification & Acceptance

- **Unit Tests**: Vitest mocks for OpenAI and GitHub API clients should cover success and error paths for both digest and PR summarization.
- **Integration Tests**: A sample JSON file and a recorded PR diff fixture should be used to verify end-to-end CLI output against known summaries.
- **Manual Acceptance**: Run both summarization commands against real SQS payloads and live GitHub PRs, review summary accuracy, and error handling.