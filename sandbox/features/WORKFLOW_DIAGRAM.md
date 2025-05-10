# Objective & Scope

Enable developers to generate detailed visualizations of workflow interactions within the CLI and AWS Lambda integration. The feature diagrams the sequence of steps from CLI invocation through main processing, feature overview handling, SQS event creation, Lambda invocation, and error handling paths.

# Value Proposition

- Provides a clear, up-to-date representation of module interactions to aid onboarding, debugging, and documentation.
- Supports both a markdown mermaid flowchart for quick human inspection and a JSON structure for automated analysis or integration into dashboards.
- Incorporates error handling flows to make failure scenarios visible and support reliability improvements.

# Success Criteria & Requirements

- Introduce a new CLI flag `--diagram [--format=json|markdown]`:
  - Default format: markdown mermaid code block showing nodes and links.
  - JSON format: output an object with `nodes`, `links`, and optional `errors` arrays.
- Node list includes:
  - CLI, main, processDiagram, generateDiagram, processFeaturesOverview, generateFeaturesOverview, createSQSEventFromDigest, digestLambdaHandler, logError.
- Link list includes:
  - CLI → main → processDiagram → generateDiagram
  - main → processFeaturesOverview → generateFeaturesOverview
  - main → processDigest → createSQSEventFromDigest → digestLambdaHandler
  - digestLambdaHandler → logError for error paths
- CLI must handle concurrent flags; `--diagram` takes precedence when specified together with other flags.
- Unit tests in `sandbox/tests/cli.test.js` cover:
  - Default markdown output structure matching mermaid syntax.
  - JSON output containing correct `nodes`, `links`, and when simulated failures exist, an `errors` array.
  - `processDiagram(['--diagram'])` and `processDiagram(['--diagram','--format=json'])` behavior.
- Integration test in `main` ensures combined handling of `--diagram` and `--features-overview` with `--format=json` yields a merged JSON containing `nodes`, `links`, `featuresOverview`, and `errors` if any.

# Implementation Details

1. Source code updates in `sandbox/source/main.js`:
   - Extend `generateDiagram(format)` to include `createSQSEventFromDigest` and `digestLambdaHandler` nodes and their error link to `logError`.
   - Add optional `errors` output in JSON when error-handling paths are defined.
   - Update `processDiagram(args)` and CLI usage via `generateUsage()` to reflect the new capability.
2. Tests in `sandbox/tests/cli.test.js`:
   - Add cases simulating digest errors and verify the `errors` array appears in JSON output.
   - Ensure mermaid diagram includes error link notation.
3. Documentation:
   - Update `sandbox/docs/CLI_TOOLKIT.md` to document the extended diagram with error paths and examples.
   - Revise `sandbox/README.md` to show mermaid example including the error path and JSON output with `errors`.

# Verification & Acceptance

- `npm test` passes with new tests covering both normal and error diagram outputs.
- Manual CLI verification confirms correct mermaid flowchart with all nodes and links, including error handling arrow, and valid JSON structures.