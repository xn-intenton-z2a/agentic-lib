# Objective and Scope
Extend the CLI toolkit to generate AI-powered summaries for GitHub issue or pull request discussions, enriched not only with recent workflow run context and sanitized workflows, but now also with summarized test console output when requested. This enhancement supports scheduled discussion summaries that include both discussion and test result insights.

# Value Proposition
Provide maintainers with concise, context-aware overviews of discussion threads that include:

- Recent CI/CD workflow run identifiers, statuses, and conclusions
- Sanitized workflow definitions
- Summarized test console output (logs and errors)

Reducing context switching, revealing test failures or flaky behavior directly in discussion summaries, and safeguarding sensitive information.

# Requirements

## CLI Integration

- Extend existing flags:  
  • --summarize-discussion <discussionNumber> alias --sd  
  • --include-context alias --ic  
  • --sanitize-workflows alias --sw  
  • **--include-tests alias --it** to toggle test console summarization
- Process --include-tests before summary generation and include test context in the prompt when enabled.

## Summary Generation

- Update `async function summarizeDiscussion(discussionNumber, includeContext, sanitizeWorkflows, includeTests)` to:
  - Accept `includeTests` boolean argument.
  - When includeTests is true, call `fetchTestConsoleOutput(owner, repo, workflowRunId)` and include returned summary in the assembled prompt before comments.

## Workflow Context Fetch

- Retain `fetchWorkflowContext(owner, repo)` implementation to list the latest N workflow runs and format context.
- Supply a `workflowRunId` from the latest workflow context for test log retrieval.

## Test Console Output Fetch

- Implement `async function fetchTestConsoleOutput(owner, repo, runId)` that:
  - Uses GitHub Actions API via `octokit` to download logs for the specified runId.
  - Extracts relevant test output (console logs, errors, stack traces) up to a configurable size limit.
  - Calls `OpenAI.createChatCompletion` with a prompt summarizing test execution, failures, and anomalies, returning a concise summary string.

## Prompt Assembly

- When includeTests is true, inject a new section `TestConsoleSummary:` in the summarization prompt before aggregating discussion comments.

## Logging and Error Handling

- Reuse `logInfo` and `logError` around `fetchTestConsoleOutput` start, success, and failure.
- On failure to fetch logs, proceed without test summary and log a warning.

# Tests

- Add unit tests mocking `octokit.actions.downloadJobLogs` and `openai` to verify:
  - `fetchTestConsoleOutput` returns a parsed summary when logs contain sample failures.
  - `summarizeDiscussion` includes `TestConsoleSummary` field in returned JSON when includeTests=true.
- Add CLI test invoking:
  node src/lib/main.js --summarize-discussion 42 --include-context --sanitize-workflows --include-tests
  and verify JSON output includes `testConsoleSummary` alongside summary and workflowContext.

# Documentation Updates

- Update README to document new `--include-tests` flag and usage example.
- Provide sample snippet showing programmatic use of `fetchTestConsoleOutput` and `summarizeDiscussion` with includeTests.

# Verification and Acceptance

- All new and existing unit tests pass.
- Manual test: run node src/lib/main.js --summarize-discussion 123 --include-context --sanitize-workflows --include-tests and confirm output includes summary, workflowContext, sanitizedWorkflows, and testConsoleSummary.