# Objective and Scope
Expand the existing discussion summary feature to include GitHub issue or pull request discussion context, optional CI/CD workflow reference, detailed test console output summary, and enhanced error context with stack traces for failing tests. This feature will:

- Generate AI-powered summaries of discussion threads with context on workflow runs, test failures, and error stack traces.
- Provide a consolidated reference to all agentic-lib workflows, CLI commands, and AWS Lambda handlers in the README.

# Value Proposition
Provide developers and maintainers with:

- Concise, context-rich summaries that surface test failures, error messages, and full stack traces.
- Ability to diagnose failure causes faster by reviewing error context inline with discussion and workflow details.
- A single authoritative reference for workflows and CLI commands, reducing discovery time and context switching.

# Requirements

## CLI Integration

- Extend existing flags:
  - --summarize-discussion <number> alias --sd
  - --include-context alias --ic
  - --sanitize-workflows alias --sw to toggle workflow sanitization
  - --include-tests alias --it to toggle test console summarization
  - --include-stack-traces alias --ist to toggle inclusion of detailed stack trace context

- Update function signature:
  ```js
  summarizeDiscussion(discussionNumber, includeContext, sanitizeWorkflows, includeTests, includeStackTraces)
  ```
  to accept includeStackTraces and produce enhanced summaries when true.

## Summary Generation

- When includeTests is true:
  - Use fetchTestConsoleOutput(owner, repo, runId) to retrieve raw console logs via octokit.actions.downloadJobLogs.
  - Parse the log for failed test entries, extracting error messages, file paths, and stack trace lines.
  - When includeStackTraces is true, include the full stack trace context, limited to the first 10 stack frames per failure.
  - Summarize test outcomes in a TestConsoleSummary section, grouping by test suite, and annotate failures with error context and stack traces.

- Integrate sanitized workflows context when sanitizeWorkflows is true by filtering sensitive fields.

- Insert a TestConsoleSummary section before discussion comments when includeTests or includeStackTraces is enabled.

# Workflow Reference and Documentation

- Maintain fetchWorkflowContext(owner, repo) to gather workflow names, inputs, outputs, and usage examples.
- Update README.md to include a top-level "Workflow Reference" section listing:
  - All supported CLI commands, flags (including --include-stack-traces), and examples
  - AWS Lambda handlers and utility functions with input signatures and samples
  - Sanitized workflow definitions when sanitizeWorkflows is true

# Logging and Error Handling

- Use logInfo and logError to track:
  - fetchTestConsoleOutput start, success, and failure
  - Parsing of log entries and extraction of stack traces
- On failure to fetch logs or parse stack traces, proceed without detailed test summary and log a warning including the error context.

# Dependencies and Constraints

- Depends on openai for AI summarization and @octokit/rest for workflow context and log retrieval.
- Requires GitHub API read permissions for logs and workflows.
- Must operate within a single repository without adding new files.

# Verification and Acceptance

- Unit tests mock octokit and openai to verify summary, workflow context, sanitized workflows, test console summarization, and stack trace inclusion when includeStackTraces is true.
- CLI tests for:
  ```bash
  node src/lib/main.js --summarize-discussion 42 --include-context --sanitize-workflows --include-tests --include-stack-traces
  ```
  should verify JSON output includes discussionSummary, workflowContext, sanitizedWorkflows, testConsoleSummary, and errorStackTraces sections.
- Manual verification confirms README.md contains a "Workflow Reference" section with accurate CLI flags and examples.
