# Simulate Workflow

## Purpose
Enhance the dry-run engine to support recursive evaluation of reusable workflows, matrix job expansion, and generate workflow visualizations in Graphviz DOT format alongside the existing CLI, library, and HTTP API interfaces.

## Value Proposition
- Resolve nested reusable workflows automatically, providing complete execution plans across all levels.
- Expand matrix jobs into individual job entries for each matrix combination, enabling accurate simulation of parallel job variants.
- Produce a DOT graph output for integration with visualization tools and documentation.
- Extend programmatic access via HTTP endpoint while preserving existing CLI and library interfaces.
- Maintain backward compatibility with current flags and behaviors.

## Success Criteria
1. The function simulateWorkflow accepts an optional options object with fields recursive (default false), expandMatrix (default false), and graph (default false).
2. When recursive is true, nested workflow files referenced via step uses are located, parsed, and merged into the triggers, jobs, and calls lists.
3. When expandMatrix is true, for each job with a strategy.matrix definition, simulateWorkflow generates separate job entries for all combinations of matrix variables, appending combination identifiers to job names and preserving dependencies.
4. When graph is true, a valid Graphviz DOT string is produced reflecting jobs as nodes and needs relationships as directed edges, including expanded matrix job nodes.
5. CLI supports flags --simulate-workflow, --recursive, --expand-matrix, --graph, and --serve-api [port] without altering existing flag behavior.
6. A new export startSimulationServer(port) starts an HTTP server exposing GET /simulate-workflow with query parameters file, recursive, expandMatrix, and graph; response includes triggers, jobs, calls, and optional dot field.
7. File read or YAML parse errors return HTTP 400 with descriptive JSON error; unexpected errors return HTTP 500.
8. All legacy tests remain passing; new tests cover matrix expansion, recursive resolution, graph output, and HTTP API with recursive, expandMatrix, and graph options.

## Implementation Details
1. Update simulateWorkflow signature to accept (filePath, options) and return an object with triggers, jobs, calls, and optional dot string.
2. Implement a recursive loader that resolves local workflow paths or reusable workflow references and merges summaries when recursive is true.
3. Implement a matrix expander that takes jobs with strategy.matrix definitions and, when expandMatrix is true, computes the cartesian product of matrix variables and generates distinct job entries with modified names and needs, preserving the original job's dependencies.
4. Build a graph generator that constructs a DOT representation of jobs and dependencies, including expanded matrix job nodes.
5. In sandbox/source/main.js, parse new CLI flags --recursive, --expand-matrix, and --graph and pass options into simulateWorkflow; print JSON when graph is false and raw DOT when graph is true.
6. Export startSimulationServer in sandbox/source/main.js using a minimal HTTP server to handle /simulate-workflow requests.
7. Avoid introducing new dependencies beyond express or the built-in http module, js-yaml, and lodash for matrix expansion.

## Testing
- Create tests under sandbox/tests covering matrix expansion, nested workflows, graph generation, and HTTP API endpoints with recursive, expandMatrix, and graph parameters.
- Mock filesystem reads for nested files and simulate error cases to verify HTTP status codes and matrix expansion logic.

## Documentation
- Update sandbox/README.md to include usage examples for flags --recursive, --expand-matrix, --graph, and --serve-api.
- Enhance sandbox/docs/SIMULATE_WORKFLOW.md with sections on matrix expansion, recursive resolution, and graph output, including sample HTTP responses and CLI outputs.