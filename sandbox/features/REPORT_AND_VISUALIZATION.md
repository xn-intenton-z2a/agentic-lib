# Objective & Scope

Extend the existing JSON reporting feature to also generate a visual diagram of agentic-lib workflow interactions via a new CLI flag. This consolidated feature provides:

- Unified machine-readable JSON output for all commands and tests.
- Automated code coverage enforcement and badge integration.
- A new --report flag that emits a JSON summary of repository state.
- A new --diagram flag that scans GitHub workflow definitions and outputs a Mermaid flowchart describing workflow_call triggers and interactions.

# Value Proposition

- Simplifies CI/CD integration by offering both a structured JSON report and a human-friendly visualization in one command suite.
- Helps developers and maintainers quickly understand how individual workflows interconnect and depend on each other.
- Reduces context switching by providing diagnostics and architectural insights in the same tool.

# Success Criteria & Requirements

- JSON reporting and coverage enforcement remain unchanged and pass existing tests.
- --diagram flag outputs valid Mermaid syntax representing workflows and their triggers:
  - Nodes represent individual workflow files by basename.
  - Directed edges represent workflow_call relationships between workflows.
- Outputs can be piped to common Mermaid renderers or inspected in plain text.
- The --diagram flag automatically discovers YAML files under .github/workflows.
- The --json, --report, and --diagram flags should not conflict and can be combined (e.g., --diagram --json produces a JSON object with a mermaid diagram string).

# Implementation Details

1. package.json updates
   • Add a "diagram" script alias: "npm run diagram" invoking the CLI with --diagram.
   • Ensure test scripts support --diagram and --json combinations.
2. src/lib/main.js
   • Introduce async function processDiagram(args) to detect --diagram.
   • Use fs and js-yaml to load each .github/workflows/*.yml and parse trigger sections.
   • Build a Mermaid graph:
     ```
     graph TD
       A[workflowA] --> B[workflowB]
       C[workflowC]
     ```
   • If --json is also set, wrap the diagram string in a JSON object with key "mermaidDiagram".
   • Ensure processDiagram runs before existing report logic.
3. README.md updates
   • Document the --diagram flag, show sample Mermaid output, and explain how to render with Mermaid CLI or online tools.
   • Update badges and usage examples to include diagram generation.
4. Tests
   • Add unit tests mocking fs and js-yaml to simulate workflow files and verify correct Mermaid output.
   • Test combinations: --diagram alone, --diagram --json, and ensure no side effects on report.
   • Confirm existing JSON reporting and coverage tests remain green.

# Verification & Acceptance Criteria

- npm run diagram outputs valid Mermaid Flowchart text and exits zero.
- npm run diagram --json outputs a JSON object containing the mermaidDiagram string.
- All existing tests and new tests pass with npm test and npm run test:unit.
- README examples render correctly when used in a Mermaid renderer.