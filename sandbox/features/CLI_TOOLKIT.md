# Objective & Scope

Enhance the unified command-line interface to ensure comprehensive automated test coverage for all core flag-driven workflows and the SQS Lambda event handler.

# Value Proposition

• Centralized CLI remains the single entry point for help, version, report, diagram, summarize, and digest operations.
• Rigorous test coverage increases reliability, simplifies maintenance, and guards against regressions in both CLI flow and SQS handler logic.

# Success Criteria & Requirements

• Unit tests cover --help, --version, --digest, no-argument invocation, and combined-flag scenarios, verifying console output and exit behavior.
• Combined flags with --json produce a single JSON object merging reportData, diagramDefinition, workflowSummaries, and digestEventLog.
• digestLambdaHandler is tested for:
  – Valid single record events returning empty batchItemFailures.
  – Multiple records processed sequentially.
  – Invalid JSON payload records producing correct batchItemFailures and error logs.
• Achieve at least 90% line coverage in src/lib/main.js.

# Implementation Details

1. Refactor main.js exports to expose internal helpers: processHelp, processVersion, processDigest, digestLambdaHandler, generateUsage.
2. In sandbox/tests, add or extend tests to:
   • Verify processHelp logs usage and returns true when --help is passed.
   • Mock fs.readFileSync in processVersion tests to return a known version and assert JSON output structure.
   • Spy on digestLambdaHandler invocation in processDigest and assert handler return shape.
   • Invoke main with combinations of flags and assert merged JSON or text output.
   • Call main without args and verify fallback usage message and exit code behavior.
3. Create tests for digestLambdaHandler directly:
   • Pass an event with a valid Records array and assert batchItemFailures is empty and handler field is correct.
   • Pass an event with one record containing invalid JSON and assert batchItemFailures contains the generated fallback identifier.
   • Pass mixed valid and invalid records and assert correct grouping of failures.

# Testing & Verification

• All new tests reside under sandbox/tests/, following Vitest conventions.
• Updates to sandbox/README.md document the new tests and coverage targets.
• Executing npm test and npm run test:unit results in no failures and displays coverage metrics meeting the 90% threshold.