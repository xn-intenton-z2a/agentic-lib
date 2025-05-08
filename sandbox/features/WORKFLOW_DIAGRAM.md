# Objective
Generate a MERMAID sequence diagram illustrating interactions between workflows, AWS SQS events, and handlers directly from the CLI.

# Value Proposition
Developers can visualize end-to-end message flows and handler invocations in agentic workflows without leaving the terminal or manually crafting diagrams. This accelerates understanding of workflow structure and aids troubleshooting.

# Scope
- Add a new CLI flag --workflow-diagram to src/lib/main.js to trigger diagram generation.
- Implement parseWorkflowDefinitions and generateMermaidDiagram functions in src/lib/main.js.
- Accept an optional JSON representation of workflow interactions or derive definitions from createSQSEventFromDigest and digestLambdaHandler semantics.
- Output the generated MERMAID sequence diagram to stdout or write to a specified file path.
- Enhance generateUsage in src/lib/main.js to document the --workflow-diagram flag.
- Update sandbox/README.md to describe the flag, show a sample command, and include a sample MERMAID diagram snippet.
- Add unit tests for parseWorkflowDefinitions and generateMermaidDiagram in sandbox/tests/diagram.test.js.

# Requirements
- Diagram must follow MERMAID sequence diagram syntax.
- parseWorkflowDefinitions must accept an array of objects each describing an actor, target, and message label.
- generateMermaidDiagram must return a string containing valid MERMAID text starting with sequenceDiagram.
- Use only existing dependencies and pure JavaScript; no new external libraries.
- Maintain ESM compatibility and support Node version 20 and above.

# Success Criteria
- Running node src/lib/main.js --workflow-diagram outputs a MERMAID formatted sequence diagram representing the provided interactions.
- Unit tests for parsing and diagram generation achieve at least 90% coverage of new code.
- sandbox/README.md clearly documents usage and includes a working example diagram snippet.

# Verification
1. Execute node src/lib/main.js --workflow-diagram and confirm stdout is valid MERMAID text.
2. Paste the output into a MERMAID-enabled markdown viewer and confirm correct rendering.
3. Run npm test to ensure all tests pass and coverage thresholds are met.