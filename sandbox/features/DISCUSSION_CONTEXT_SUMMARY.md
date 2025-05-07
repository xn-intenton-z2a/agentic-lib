# Objective and Scope
Expand the existing discussion summary feature to include both GitHub issue or pull request discussion context, optional CI/CD workflow reference, and detailed test console output summary. This feature will:

- Generate AI-powered summaries of discussion threads with context on workflow runs and test failures.
- Provide a consolidated reference to all agentic-lib workflows, CLI commands, and AWS Lambda handlers in the README.

# Value Proposition
Provide developers and maintainers with:

- Concise, context-rich summaries that surface test failures, anomalies, and workflow purpose.
- A single authoritative reference for workflows and CLI commands, reducing discovery time and context switching.

# Requirements

## CLI Integration

- Extend existing flags:
  - --summarize-discussion <number> alias --sd
  - --include-context alias --ic
  - --sanitize-workflows alias --sw to toggle workflow sanitization
  - --include-tests alias --it to toggle test console summarization

- Update summarizeDiscussion(discussionNumber, includeContext, sanitizeWorkflows, includeTests) to accept includeTests and include test summary when true.

## Summary Generation

- When includeTests is true, use fetchTestConsoleOutput(owner, repo, runId) to retrieve and summarize logs via octokit.actions.downloadJobLogs and OpenAI.createChatCompletion.
- Integrate sanitized workflows context when sanitizeWorkflows is true by filtering sensitive fields.
- Insert a TestConsoleSummary section before discussion comments when includeTests is enabled.

## Workflow Reference and Documentation

- Maintain fetchWorkflowContext(owner, repo) to gather workflow names, inputs, outputs, and usage examples.
- Update README.md to include a top-level "Workflow Reference" section listing:
  - All supported CLI commands, flags, and examples
  - AWS Lambda handlers and utility functions with input signatures and samples
  - Sanitized workflow definitions when sanitizeWorkflows is true

## Logging and Error Handling

- Use logInfo and logError to track fetchTestConsoleOutput start, success, and failure.
- On failure to fetch logs, proceed without test summary and log a warning.

# Dependencies and Constraints

- Depends on openai for AI summarization and @octokit/rest for workflow context and log retrieval.
- Requires GitHub API read permissions for logs and workflows.
- Must operate within a single repository without adding new files.

# User Scenarios and Examples

1. Developer reviews CI failures by running:
   npx agentic-lib --summarize-discussion 42 --include-context --include-tests

2. Maintainer consults workflow reference in README to discover CLI commands and Lambda handlers.

# Verification and Acceptance

- Unit tests mock octokit and openai to verify summary, workflow context, sanitized workflows, and test console summarization when includeTests is true.
- CLI test for node src/lib/main.js --summarize-discussion 42 --include-context --sanitize-workflows --include-tests verifies JSON output includes discussionSummary, workflowContext, sanitizedWorkflows, and testConsoleSummary.
- Manual verification confirms README.md contains a "Workflow Reference" section with accurate entries.