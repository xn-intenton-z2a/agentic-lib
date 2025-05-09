# Objective
Generate a visual diagram of GitHub Actions workflow interactions by parsing existing YAML definitions and embedding the result in project documentation.

# Value Proposition
A clear, auto-generated diagram helps developers and maintainers quickly understand the relationships, dependencies, and triggers among workflows and jobs. It reduces onboarding time and avoids outdated manual diagrams.

# Scope
- Update src/lib/main.js: Add a new CLI flag `--diagram` to trigger diagram generation.
- Implement a function `generateWorkflowDiagram` that:
  - Uses globby to discover `.github/workflows/*.yml` files.
  - Parses each YAML file with js-yaml to extract jobs, needs relationships, and triggers.
  - Constructs a Mermaid flowchart graph representing workflows and job dependencies.
- When `--diagram` is passed:
  - Invoke `generateWorkflowDiagram` and write the Mermaid markdown to `sandbox/docs/WORKFLOW_INTERACTION_DIAGRAM.md`.
  - Print a confirmation message to stdout.
- Update package.json dependencies: add `globby` and `js-yaml`.
- Add unit tests in `tests/unit/diagramGenerator.test.js` to validate that given sample workflow definitions, the Mermaid output matches expected graph syntax.
- Update `sandbox/README.md` and documentation to include instructions and an example of the workflow interaction diagram.

# Requirements
- Diagram generator must run in Node 20 ESM context.
- Output file must begin with ```mermaid
flowchart TB
...``` and end with closing code fence.
- Tests must cover parsing of single-file and multi-file workflows, including job dependencies and triggers.

# Success Criteria
- Running `node src/lib/main.js --diagram` creates or updates `sandbox/docs/WORKFLOW_INTERACTION_DIAGRAM.md` with valid Mermaid syntax.
- Unit tests for `generateWorkflowDiagram` pass with 100% coverage for parsing logic.
- Documentation updates show an example diagram and instructions for regeneration.

# Verification
1. Install new dependencies and run `npm test` to ensure all tests pass.
2. Run `node src/lib/main.js --diagram` and inspect `sandbox/docs/WORKFLOW_INTERACTION_DIAGRAM.md` for a valid Mermaid flowchart.
3. Render the Mermaid diagram in Markdown preview to confirm correct visualization of workflows.