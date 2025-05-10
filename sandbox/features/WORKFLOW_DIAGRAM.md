# Objective & Scope

Enhance the CLI toolkit to generate a diagram illustrating the interaction between the CLI entry point and the SQS Lambda digest handler. The feature adds a new command flag to the existing sandbox source and does not introduce new files or remove existing functionality.

# Value Proposition

Provide users with a clear visual map of how the CLI commands invoke processing functions and the SQS Lambda handler. This improves understanding of the internal workflow, accelerates onboarding, and aids debugging by exposing call relationships in both markdown and JSON formats.

# Success Criteria & Requirements

- Add new CLI flag --diagram to sandbox/source/main.js
- Support optional --format=json or --format=markdown; default is markdown
- In markdown mode, output a mermaid flowchart code block describing nodes and links
- In JSON mode, output an object with arrays nodes, links, and errors
- Use the existing generateDiagram utility to assemble nodes and links
- Ensure processDiagram handles --diagram and that main integrates with other flags correctly
- Support combined invocation of --diagram and --features-overview, producing merged output in both formats
- Ensure circular relationships or errors appear in the errors array for JSON output

# User Scenarios & Examples

Scenario: A developer wants to see the CLI to Lambda handler workflow. They run:
  node sandbox/source/main.js --diagram
They receive a mermaid flowchart showing each function transition in the workflow.

Scenario: A developer wants machine-readable output. They run:
  node sandbox/source/main.js --diagram --format=json
They receive a JSON object with nodes, links, and errors.

Scenario: A developer wants a combined overview. They run:
  node sandbox/source/main.js --diagram --features-overview --format=json
They receive a merged JSON object containing diagram data and features overview.

# Verification & Acceptance

- Unit tests for generateDiagram cover default markdown and JSON output structures
- processDiagram tests ensure correct console logging and return values for triggered and non-triggered cases
- Integration tests for main confirm combined flag handling does not fall back to usage printout
- Documentation in README and sandbox/docs updated to reference --diagram flag and examples