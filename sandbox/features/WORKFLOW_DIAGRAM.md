# Objective & Scope

Enable users to generate and visualize workflow interaction diagrams through the CLI, illustrating the sequence of steps from command invocation to SQS Lambda handlers and feature processing modules.

# Value Proposition

- Provide developers with clear, up-to-date diagrams showcasing internal CLI workflows and data flows.
- Support both markdown mermaid diagrams for quick inspection and JSON structures for integration into dashboards or automated tools.
- Improve onboarding and debugging by making interaction flows explicit and accessible.

# Success Criteria & Requirements

- The CLI exposes a new flag `--diagram [--format=json|markdown]` that outputs:
  - In markdown mode: a mermaid flowchart block showing nodes and links of core modules (CLI, main, processDiagram, generateDiagram, processFeaturesOverview, generateFeaturesOverview).
  - In JSON mode: an object with `nodes` (array of strings) and `links` (array of `{ from, to }` objects).
- The CLI must handle concurrent flags gracefully (e.g., when both `--diagram` and other flags are present, processDiagram takes precedence if triggered first).
- Unit tests cover default markdown output, JSON output structure, and CLI invocation via `processDiagram(args)`.
- Integration test in `main` ensures combined handling of `--diagram` and `--features-overview` with `--format=json` produces a merged JSON output containing `nodes`, `links`, and `featuresOverview`.
- Documentation in CLI_TOOLKIT.md and sandbox/README.md includes usage examples for both formats.

# Implementation Details

1. Source Changes:
   - In `sandbox/source/main.js`, ensure `generateDiagram(format)` and `processDiagram(args)` accurately reflect the node/link structure as defined.
   - Update `generateUsage()` to list the `--diagram` flag with its format options and examples.
2. Tests:
   - In `sandbox/tests/cli.test.js`, add or refine tests for:
     - Default markdown output matching mermaid syntax.
     - JSON output containing correct `nodes` and `links` arrays.
     - `processDiagram(['--diagram'])` returns true and logs markdown.
     - `processDiagram(['--diagram','--format=json'])` returns true and logs JSON.
   - Integration test in the same file validates `main(['--diagram','--features-overview','--format=json'])` includes `nodes` and `featuresOverview` keys.
3. Documentation:
   - Update `sandbox/docs/CLI_TOOLKIT.md` to document `--diagram` usage.
   - Revise `sandbox/README.md` to include examples of markdown and JSON diagram outputs and link to CLI_TOOLKIT.md.

# Verification & Acceptance

- `npm test` passes with new tests covering diagram functionality.
- Manual CLI verification shows correct mermaid block and JSON structures.
- Documentation examples render a valid mermaid diagram and JSON when used in practice.
