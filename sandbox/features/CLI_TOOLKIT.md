# Objective & Scope

Extend the unified command-line interface to support generating a visual workflow interaction diagram.  Ensure comprehensive automated test coverage for the new --diagram flag, in addition to existing help, version, report, and digest operations.

# Value Proposition

•  Single CLI surface remains the authoritative entry point for all operations, now including interactive workflow visualization.
•  Diagram output helps users understand event flow between CLI commands and SQS Lambda handlers.
•  Combined with --json, diagramDefinition can be consumed by other tools or CI pipelines to render sequence or graph diagrams.

# Success Criteria & Requirements

•  Invocation of `--diagram` prints a valid Mermaid or JSON diagramDefinition representing key workflow steps: processHelp, processVersion, processDigest, digestLambdaHandler.
•  Combined flags with `--json` and `--diagram` output a JSON object containing diagramDefinition and any other requested report data.
•  Default diagram format is Mermaid syntax.  Users may pass `--diagram --format=json` to receive JSON nodes/edges structure.
•  CLI help usage text updated to document `--diagram` and `--format` options.
•  Achieve at least 90% line coverage in src/lib/main.js, including new processDiagram logic and error handling.

# Implementation Details

1. Add `processDiagram(args)` helper in main.js:
   • Detect `--diagram` flag and optional `--format=json` flag.
   • Call new `generateWorkflowDiagram(format)` utility to produce either a Mermaid string or JSON object.
   • Log diagram output via console.log and return true.
2. Export `generateWorkflowDiagram` for direct testing:
   • If format is "mermaid", return a string starting with `sequenceDiagram` and listing interactions.
   • If format is "json", return an object with `nodes` and `edges` arrays capturing workflow steps and transitions.
3. Update `generateUsage()` to include:
   • --diagram                     Generate a workflow interaction diagram.
   • --format=<mermaid|json>       Select diagram output format (requires --diagram).
4. In `main()`, insert `await processDiagram(args)` after version and before fallback usage.

# Testing & Verification

• Create Vitest tests under sandbox/tests/ for:
  – `processDiagram(["--diagram"])` produces a Mermaid diagram string containing expected steps.
  – `processDiagram(["--diagram","--format=json"])` returns a JSON object with nodes and edges matching spec.
  – Combined invocation `main(["--diagram","--json"])` yields a single JSON object with diagramDefinition and existing reportData when `--json` is implied.
  – Invalid format value (e.g. `--format=xml`) logs an error and returns non-zero exit code or `false` from processDiagram.
• Update sandbox/README.md to document new flags, usage examples for Mermaid and JSON outputs.

# Documentation Updates

• Update sandbox/README.md usage section to include `--diagram` and `--format` options with inline examples.
• Link to MISSION.md, CONTRIBUTING.md, LICENSE, and repository URL.

# Dependencies & Constraints

• No new dependencies; generate Mermaid syntax and JSON with built-in code.
• Maintain ECMAScript Module style and compatibility with Node≥20.
• Follow existing logging conventions using `formatLogEntry` utilities.

# Verification & Acceptance

• All tests pass under `npm test` and `npm run test:unit`.
• Coverage report shows ≥90% coverage for main.js.
• Manual verification by running `node src/lib/main.js --diagram` and piping to Mermaid renderer confirms correct diagram sequence.
