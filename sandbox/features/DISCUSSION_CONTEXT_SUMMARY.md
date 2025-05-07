# Objective and Scope
Extend the CLI toolkit to generate AI-powered summaries for GitHub issue or pull request discussions and enrich those summaries with recent workflow run context when requested. Also sanitize GitHub workflow definition files by removing sensitive data before inclusion in discussion context.

# Value Proposition
Provide maintainers with concise, context-aware overviews of discussion threads that include the current CI/CD workflows and a sanitized view of workflow definitions, reducing context switching and safeguarding sensitive information.

# Requirements

## CLI Integration
- Introduce flags --summarize-discussion <discussionNumber> alias --sd, --include-context alias --ic, and --sanitize-workflows alias --sw
- Ensure these flags are processed before existing behavior and return after summary is printed.

## Summary Generation
- Implement an async function summarizeDiscussion(discussionNumber, includeContext, sanitizeWorkflows) that:
  - Uses @octokit/rest to fetch comments and metadata for the specified discussion.
  - Aggregates comment bodies and metadata into a single prompt.
  - Calls OpenAI createChatCompletion with the assembled prompt and parses the JSON response.

## Workflow Context Fetch
- When includeContext is true, implement fetchWorkflowContext(owner, repo) that:
  - Invokes GitHub Actions API via octokit to list the latest workflow runs on default branch.
  - Extracts run identifiers, statuses, conclusions of the most recent N runs.
  - Formats this context and injects it into the summarization prompt before comments.

## Workflow Sanitization
- When sanitizeWorkflows is true, implement fetchAndSanitizeWorkflows(repoPath) that:
  - Reads all YAML files under .github/workflows using fs and js-yaml.
  - Removes or redacts secrets, tokens, and environment variable values.
  - Strips large inline scripts or commands beyond a configured size.
  - Formats a sanitized summary of workflow file names, triggers, and major steps.
  - Injects the sanitized workflows summary into the prompt before summarizing comments.

## Logging and Error Handling
- Reuse logInfo and logError for start, success, and failure of API and filesystem operations.
- Provide clear error messages if any fetch, parse, or OpenAI requests fail.

# Tests
- Add unit tests mocking @octokit/rest, fs, js-yaml, and openai to verify:
  - summarizeDiscussion returns parsed JSON summary with workflowContext and sanitizedWorkflows when flags are enabled.
  - sanitizeWorkflows toggles fetchAndSanitizeWorkflows calls and redacts sample secrets.
- Add CLI tests invoking node src/lib/main.js --summarize-discussion 42 --include-context --sanitize-workflows and verifying JSON output includes summary, workflowContext, and sanitizedWorkflows sections.

# Documentation Updates
- Update README to document new flags and usage examples for workflow sanitization.
- Include sample code snippet showing programmatic use of sanitizeWorkflows and summarizeDiscussion.

# Verification and Acceptance
- All new and existing unit tests pass.
- Manual test: run node src/lib/main.js --summarize-discussion 123 --include-context --sanitize-workflows and confirm the output includes summary, workflowContext, and sanitizedWorkflows sections.