# Simulate Workflow

## Purpose
Enhance the dry-run engine to support recursive evaluation of reusable workflows, matrix job expansion, and generate workflow visualizations in both Graphviz DOT and Mermaid formats alongside the existing CLI, library, and HTTP API interfaces.

## Value Proposition
- Resolve nested reusable workflows automatically, providing complete execution plans across all levels.
- Expand matrix jobs into individual job entries for each matrix combination, enabling accurate simulation of parallel job variants.
- Produce both DOT and Mermaid graph outputs for integration with documentation, wikis, and developer tools.
- Extend programmatic access via HTTP endpoint and CLI with minimal disruption to existing flags and behavior.
- Maintain backward compatibility with current flags and behaviors while offering richer visualization options.

## Success Criteria
1. The function simulateWorkflow accepts signature (filePath, options) with options fields:
   - recursive (boolean, default false)
   - expandMatrix (boolean, default false)
   - graphFormat (string, default "dot", allowed values "dot" or "mermaid").
2. When recursive is true, nested workflow files referenced via step uses are located, parsed, and merged into triggers, jobs, and calls lists.
3. When expandMatrix is true, for each job with a strategy.matrix definition, simulateWorkflow generates separate job entries for all combinations of matrix variables, appending combination identifiers to job names and preserving dependencies.
4. When graphFormat is "dot", produce a valid Graphviz DOT string reflecting jobs as nodes and needs relationships as directed edges, including expanded matrix job nodes. When graphFormat is "mermaid", produce valid Mermaid graph syntax for the same structure.
5. CLI supports flags:
   - --simulate-workflow <file>
   - --recursive
   - --expand-matrix
   - --graph-format <dot|mermaid>
   - --mermaid (alias for --graph-format mermaid)
   - --serve-api [port]
   without altering existing flag behavior.
6. A new export startSimulationServer(port) starts an HTTP server exposing GET /simulate-workflow with query parameters file, recursive, expandMatrix, graphFormat; response JSON includes triggers, jobs, calls, and a graph field containing either a dot or mermaid string.
7. File read or YAML parse errors return HTTP 400 with descriptive JSON error; unexpected errors return HTTP 500.
8. All legacy tests remain passing; new tests cover matrix expansion, recursive resolution, DOT graph output, Mermaid graph output, and HTTP API with recursive, expandMatrix, and graphFormat options.

## Implementation Details
1. Update simulateWorkflow signature in sandbox/source/main.js to accept (filePath, options).
2. Implement a recursive loader that resolves local workflow paths or reusable workflow references when recursive is true.
3. Implement a matrix expander for jobs with strategy.matrix definitions when expandMatrix is true.
4. Build two graph generators:
   - generateDotGraph(jobs) returns Graphviz DOT notation string.
   - generateMermaidGraph(jobs) returns Mermaid graph syntax string.
5. In sandbox/source/main.js, parse new CLI flags --graph-format and alias --mermaid, pass options into simulateWorkflow; print JSON when no graphFormat, raw DOT when graphFormat dot, raw Mermaid when graphFormat mermaid.
6. Export startSimulationServer in sandbox/source/main.js using a minimal HTTP server to handle /simulate-workflow requests and respond according to graphFormat.
7. Avoid introducing new dependencies beyond built-ins, js-yaml, and lodash.

## Testing
- Create tests under sandbox/tests for:
  - Mermaid output generation matching expected syntax for simple and expanded workflows.
  - CLI invocations with --graph-format dot and --mermaid producing correct outputs and exit codes.
  - HTTP API GET /simulate-workflow calls with graphFormat parameters verifying dot and mermaid fields.
- Ensure existing simulateWorkflow tests remain unchanged and pass.

## Documentation
- Update sandbox/README.md to include usage examples for --graph-format and --mermaid flags.
- Enhance sandbox/docs/SIMULATE_WORKFLOW.md with sections on Mermaid output, sample CLI and HTTP responses for both DOT and Mermaid formats.