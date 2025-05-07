# Objective and Scope
Extend the CLI toolkit to generate AI-powered summaries for GitHub issue or pull request discussions and enrich those summaries with recent workflow run context when requested.

# Value Proposition
Provide maintainers concise, context-aware overviews of discussion threads that include the current state of CI/CD workflows, reducing context switching and accelerating issue resolution.

# Requirements

## CLI Integration
- Introduce flags --summarize-discussion <discussionNumber> alias --sd and --include-context alias --ic into main CLI.
- Ensure these flags are processed before existing behavior and return after summary is printed.

## Summary Generation
- Implement an async function summarizeDiscussion(discussionNumber, includeContext) that:
  - Uses @octokit/rest to fetch all comments and metadata for the specified issue or PR discussion in the current repository.
  - Aggregates comment bodies and thread metadata into a single prompt.
  - Calls OpenAI createChatCompletion with the assembled prompt and parses the JSON response.

## Workflow Context Fetch
- When includeContext is true, implement fetchWorkflowContext(owner, repo) that:
  - Invokes GitHub Actions API via octokit to list the latest workflow runs on default branch.
  - Extracts run identifiers, statuses, and conclusion of the most recent N runs.
  - Formats this context and injects it into the summarization prompt prior to summarizing comments.

## Logging and Error Handling
- Reuse logInfo and logError for start, success, and failure of API calls.
- Provide clear error messages if GitHub API or OpenAI requests fail.

## Tests
- Add unit tests in tests/unit/main.test.js mocking @octokit/rest and openai to verify:
  - summarizeDiscussion returns parsed JSON summary.
  - includeContext toggles fetchWorkflowContext calls.
- Add CLI tests invoking node src/lib/main.js --summarize-discussion 42 --include-context and verifying JSON output includes context field.

## Documentation Updates
- Update README to document new flags and usage examples for discussion summarization.
- Include sample code snippet showing programmatic use of summarizeDiscussion from the library.

# Verification and Acceptance
- All new and existing unit tests pass.
- Manual test: run node src/lib/main.js --summarize-discussion 123 --include-context and confirm the output includes summary and workflowContext sections.