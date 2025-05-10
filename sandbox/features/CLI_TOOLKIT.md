# Objective & Scope

Define a unified command-line interface that consolidates all existing and planned flags into a single toolkit. This CLI shall support the following coordinated flags:

• --help           Display comprehensive usage instructions for all features.
• --version        Show current package version and runtime timestamp in JSON form.
• --report         Produce a machine-readable JSON summary of repository state and workflow definitions.
• --diagram        Generate a Mermaid flowchart of workflow interactions.
• --summarize      Create concise, human-readable summaries of workflows, triggers, jobs, steps, and environment variables.
• --digest         Simulate an AWS SQS event by replaying a sample digest, invoking the digest Lambda handler.

All flags can be used independently or combined in any order. When combined, outputs shall be merged into a single JSON object or sequenced text output without conflict.

# Value Proposition

• Single entry point for all inspection, visualization, narrative summarization, and event simulation capabilities.
• Consistent JSON logging format for integration with monitoring or automation pipelines.
• Reduces cognitive load by centralizing help and version information alongside advanced workflows analysis and simulation.
• Enables repository maintainers to both understand and test workflow logic and SQS event handling from one CLI.

# Success Criteria & Requirements

• --help prints full usage instructions covering all flags and exits with status 0.
• --version prints a JSON object with keys version and timestamp.
• --report, --diagram, --summarize, and --digest each execute expected behavior without altering existing report and diagram tests.
• Combining --summarize with --json returns a JSON object with key workflowSummaries.
• Combining any flags results in a valid JSON output when --json is specified, merging keys: reportData, diagramDefinition, workflowSummaries, and digestEventLog.
• No existing test regressions; new tests added for --digest and combined-flag scenarios.

# Implementation Details

1. src/lib/main.js
   • Refactor main to dispatch flags in the following sequence: help, version, report, diagram, summarize, digest.
   • Each processX function returns its result object; main aggregates into a single output when multiple flags are set.
   • Preserve existing JSON report and diagram logic.
   • Enhance processSummarize to return summaries under a workflowSummaries key when --json is used.
   • Extend processDigest to return a digestEventLog array containing log entries from digestLambdaHandler.

2. sandbox/tests/
   • Add tests for --digest alone, verifying that digestLambdaHandler is invoked and handler returns expected batchItemFailures along with correct handler name.
   • Add tests for combinations: --digest --report, --version --help, --report --diagram --summarize --json, ensuring output JSON merges all keys.

3. sandbox/README.md
   • Document the unified CLI usage, flag list, and sample JSON output with multiple combined flags.

4. package.json
   • No new dependencies; ensure sandbox tests are included in the test script.

# Verification & Acceptance Criteria

• Running npm start --digest logs the simulated SQS event and returns status 0.
• Running npm run start --report --diagram --summarize --digest --json prints a JSON object with keys: reportData, diagramDefinition, workflowSummaries, digestEventLog.
• New and existing tests pass with npm test and npm run test:unit.
