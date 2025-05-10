# Objective & Scope

Enhance the existing workflow diagram feature to fully represent the end-to-end agentic-lib interactions, including SQS event creation, Lambda processing, and error paths.

# Value Proposition

- Provides developers with a comprehensive, up-to-date visualization of all major components and failure scenarios in the CLI → SQS → Lambda pipeline.
- Supports both human-readable mermaid flowcharts and machine-readable JSON output for integration into dashboards or automated tooling.
- Makes error-handling flows explicit, aiding debugging and reliability improvements.

# Success Criteria & Requirements

1. Extend CLI flag `--diagram [--format=json|markdown]`:
   - Default format: Markdown mermaid code block.
   - JSON format: Object with `nodes`, `links`, and optional `errors` arrays.

2. Node list must include:
   - CLI
   - main
   - processDiagram
   - generateDiagram
   - processFeaturesOverview
   - generateFeaturesOverview
   - createSQSEventFromDigest
   - digestLambdaHandler
   - logError

3. Link list must include the existing flows plus error path:
   - CLI → main → processDiagram → generateDiagram
   - main → processFeaturesOverview → generateFeaturesOverview
   - main → processDigest → createSQSEventFromDigest → digestLambdaHandler
   - digestLambdaHandler → logError (error scenarios)

4. When format=json, output must be a JSON object:
   {
     nodes: [...],
     links: [...],
     errors?: [...]
   }

5. CLI behavior:
   - `--diagram` takes precedence over other flags when combined.
   - Concurrent flags handling unchanged for help, version, digest, and features-overview.

6. Tests:
   - Update sandbox/tests/cli.test.js to verify JSON output contains the new nodes and an `errors` array when provided simulated failures.
   - Ensure mermaid output shows the new nodes and error link syntax.
   - Maintain existing coverage for default behaviors.

# Implementation Details

1. In `sandbox/source/main.js`:
   - Modify `generateDiagram(format)`:
     • Append createSQSEventFromDigest and digestLambdaHandler to the nodes array.
     • Append an error link entry for digestLambdaHandler → logError.
     • For JSON, include an `errors` array when error flows are detected.
   - Update `processDiagram(args)` to handle error simulation flag (if provided) and include errors in JSON output.
   - Reflect changes in CLI usage string in `generateUsage()`.

2. Tests in `sandbox/tests/cli.test.js`:
   - Add cases for simulated error conditions:
     • Call `generateDiagram('json')` with an injected error and assert `errors` property.
     • Verify mermaid syntax includes an arrow from digestLambdaHandler to logError.

3. Documentation:
   - Update `sandbox/docs/CLI_TOOLKIT.md` with examples illustrating the extended diagram, including error path and JSON output with `errors`.
   - Revise `sandbox/README.md` to reflect the new nodes in mermaid examples and JSON section.

# Verification & Acceptance

- All existing and new tests pass under `npm test`.
- Manual invocation of `node sandbox/source/main.js --diagram` displays a mermaid diagram with all nodes and error arrow.
- JSON invocation returns a valid object containing `nodes`, `links`, and `errors` when simulation is enabled.