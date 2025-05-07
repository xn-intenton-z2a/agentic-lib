# Objective and Scope
Expand the existing discussion summary feature to include both test output context and a comprehensive workflow reference section in the project documentation. This feature will:

• Generate AI-powered summaries of GitHub issue or pull request discussions with optional CI/CD workflow and test console output context.
• Provide maintainers with a consolidated reference to all agentic-lib workflows, their purpose, inputs, outputs, and usage examples directly in the README.

# Value Proposition
Provide developers and maintainers with:

• Concise, context-rich summaries of discussion threads that surface test failures and anomalies.
• A single, authoritative reference for all supported workflows and CLI commands, reducing discovery time and context switching.

# Requirements

## CLI Integration

• Extend existing flags:
  – --summarize-discussion <discussionNumber> alias --sd
  – --include-context alias --ic
  – --sanitize-workflows alias --sw
  – --include-tests alias --it to toggle test console summarization

• Update async function summarizeDiscussion(discussionNumber, includeContext, sanitizeWorkflows, includeTests) to accept includeTests and include test summary when true.

## Summary Generation

• When includeTests is true, call fetchTestConsoleOutput(owner, repo, workflowRunId) and integrate returned summary in the discussion prompt under TestConsoleSummary.

## Workflow Context and Test Output Fetch

• Maintain fetchWorkflowContext(owner, repo) for workflow run context.
• Implement fetchTestConsoleOutput(owner, repo, runId) to download logs via octokit.actions.downloadJobLogs, extract key test failures and anomalies, and summarize via OpenAI.createChatCompletion.

## Prompt Assembly

• Insert TestConsoleSummary section before discussion comments when includeTests is enabled.

## Logging and Error Handling

• Use logInfo and logError around fetchTestConsoleOutput start, success, and failure.
• On failure to fetch logs, proceed without test summary and log a warning.

# Tests

• Unit tests mocking octokit.actions.downloadJobLogs and openai to verify fetchTestConsoleOutput and summarizeDiscussion behavior when includeTests is true.
• CLI test invoking: node src/lib/main.js --summarize-discussion 42 --include-context --sanitize-workflows --include-tests and verifying JSON output includes testConsoleSummary.

# Documentation Updates

• Update README.md to document the new --include-tests flag with usage example.
• Add a consolidated "Workflow Reference" section in README.md listing:
  – All supported CLI commands (--help, --version, --digest, --summarize-discussion) with descriptions and examples.
  – AWS Lambda handlers and utility functions (createSQSEventFromDigest, digestLambdaHandler) with input signature and sample code.
  – Links to API reference for config, logConfig, logInfo, logError.
• Ensure the consolidated reference is under a top-level heading "Workflow Reference" and appears after the CLI Usage section.

# Verification and Acceptance

• All existing and new unit tests pass.
• Manual verification: run node src/lib/main.js --summarize-discussion 123 --include-context --sanitize-workflows --include-tests and confirm output includes summary, workflowContext, sanitizedWorkflows, and testConsoleSummary.
• Confirm README.md includes the new Workflow Reference section with accurate command listings and examples.