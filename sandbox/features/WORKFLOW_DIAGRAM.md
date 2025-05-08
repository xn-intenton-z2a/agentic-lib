# Purpose & Scope

Enhance the CLI with a dedicated flag that outputs a clear, interactive diagram of the core workflows in agentic-lib. The diagram will illustrate the sequence, branching, and data exchanges between commands (help, version, digest, test-summary), enabling users and automation scripts to understand how each mode interconnects and triggers downstream handlers.

# Value Proposition

- Accelerates onboarding by letting users visualize workflows without reading code.
- Eases debugging and documentation by exporting diagrams directly into Markdown or ASCII art.
- Supports integration into CI/CD pipelines and wikis with JSON-wrapped outputs.

# Success Criteria & Requirements

## Flag Definition

- `--workflow-diagram` prints the diagram and exits 0.
- `--diagram-format:<mermaid|ascii>` selects output style (default: mermaid).
- `--workflow-diagram --json` wraps output in JSON with fields `format` and `diagram`.

## Diagram Generation

- Model core commands and handlers as nodes and edges.
- Produce valid Mermaid flowchart syntax describing nodes for help, version, digest, test-summary, and their invocation order.
- Convert Mermaid to ASCII flowchart for terminal-friendly view without external dependencies.

## Output and Integration

- Write diagram to stdout; no file writes by default.
- JSON mode emits `{ "format": string, "diagram": string }` to stdout.
- Non-JSON mode prints raw diagram.

## Testing

- Unit tests for flag parsing combinations: alone, with format, with JSON.
- Snapshot tests for mermaid and ascii outputs.
- Error path when an invalid format is provided must exit 1 and log a descriptive error.

# User Scenarios

- A new contributor runs `node src/lib/main.js --workflow-diagram` to see a flowchart in Mermaid.
- In a CI job, `node src/lib/main.js --workflow-diagram --json` generates JSON for automated documentation updates.
- On a text-only console, `--diagram-format:ascii` provides an immediate ASCII diagram.

# Dependencies & Constraints

- Implement diagram templates with string generation; avoid heavy diagram libraries.
- Maintain compatibility with Node 20 ESM environment.
- No additional files; updates confined to main source, tests, README, and package.json dependencies.