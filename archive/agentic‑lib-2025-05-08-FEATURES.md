sandbox/features/WORKFLOW_DIAGRAM.md
# sandbox/features/WORKFLOW_DIAGRAM.md
# Purpose & Scope

Extend the CLI with a dedicated flag to generate a clear visual representation of core command and event interactions. The diagram will illustrate commands, branching logic, and handler invocations to help users and automation scripts understand the workflow structure.

# Value Proposition

- Accelerates onboarding by visualizing pipelines without reading code.
- Streamlines documentation by exporting diagrams in standard formats.
- Enhances debugging and CI/CD integration through machine-readable outputs.

# Success Criteria & Requirements

## Flag Definition
- --workflow-diagram prints the diagram and exits with code 0
- --diagram-format=<mermaid|ascii> selects output style (default: mermaid)
- --workflow-diagram --json wraps output in JSON with fields format and diagram

## Workflow Modeling
- Represent commands help, version, digest, and lambda handler as nodes
- Model edges for invocation order, conditional branches, and error flows
- Support custom labels and grouping for complex flows

## Diagram Generation
- Produce valid Mermaid flowchart syntax matching the workflow graph
- Convert Mermaid to ASCII art for terminal-friendly view without external dependencies

## Output and Integration
- Write diagram to stdout by default; no file writes
- JSON mode outputs a JSON object to stdout
- Allow piping to files or other CLI tools

## Testing
- Unit tests covering flag parsing scenarios and invalid formats
- Snapshot tests for mermaid, ascii, and JSON outputs
- Integration test simulating CLI invocation and validating output structure

# User Scenarios

1. A new contributor runs node src/lib/main.js --workflow-diagram to view a Mermaid flowchart.
2. In a CI job, node src/lib/main.js --workflow-diagram --json generates JSON for automated docs.
3. On a text-only console, node src/lib/main.js --diagram-format=ascii shows an ASCII art diagram.

# Verification & Acceptance

- npm test completes with all tests passing and coverage thresholds met
- Manual verification confirms example invocations produce expected outputs
- JSON output schema conforms to the specified format

# Dependencies & Constraints

- Implement diagram templates with in-code string generation; no external diagram libraries
- Maintain compatibility with Node 20 ESM environment
- Confine changes to src/lib/main.js, tests, README, and package.json dependencies