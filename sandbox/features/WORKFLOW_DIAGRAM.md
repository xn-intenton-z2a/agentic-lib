# Purpose & Scope

Introduce a new CLI flag to render an interactive diagram illustrating the sequence and interactions of core agentic-lib workflows. This feature generates a visual representation (Mermaid syntax or ASCII) of the standard workflow calls (help, version, digest, test-summary) and their data flows, enabling users to quickly comprehend how CLI modes interconnect and when each step is invoked.

# Value Proposition

- Provides immediate, visual understanding of workflow interactions without reading code or documentation.
- Aids new users in learning the CLI modes and their relationships, reducing onboarding time.
- Supports documentation and training by exporting diagrams that can be embedded in README or wiki pages.
- Aligns with the mission to expose reusable workflows and demonstrates how commands compose.

# Success Criteria & Requirements

1. Flag Definition
   - --workflow-diagram: when passed, CLI prints a diagram of workflow interactions and exits with code 0.
   - --diagram-format:<mermaid|ascii>: optional modifier to select output format (default mermaid).
   - Supports combining with --json: emits diagram as a JSON object containing the diagram string and format.

2. Diagram Generation
   - Define a static model of core commands (help, version, digest, test-summary) and their invocation sequence.
   - Generate Mermaid flowchart syntax representing nodes and edges for each command and internal handler.
   - For ASCII mode, convert Mermaid to a basic text-art flowchart or fallback to plain list of steps.

3. Output and Integration
   - Write output to stdout. No file modifications.
   - Ensure output is self-contained and valid Mermaid syntax or ASCII.
   - In JSON mode, wrap diagram in { format: string, diagram: string }.

4. Testing
   - Unit tests for flag parsing: --workflow-diagram alone, with --diagram-format, with --json.
   - Snapshot tests for generated Mermaid and ASCII outputs.
   - Error case: invalid diagram-format value should exit with code 1 and error log.

# Dependencies & Constraints

- Use a small diagramming helper library (e.g., mermaid.cli) or implement a minimal string template for Mermaid.
- Do not introduce heavy dependencies—prefer string templates and minimal formatting code.
- Maintain ESM compatibility on Node 20.
- Update sandbox/README.md CLI Features section to include documentation of --workflow-diagram and format options.
- Add tests under sandbox/tests/ for diagram functionality.