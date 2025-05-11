# Simulate Workflow

## Purpose
Enhance the dry-run engine to support recursive evaluation of reusable workflows and generate workflow visualizations in Graphviz DOT format alongside the existing CLI, library, and HTTP API interfaces.

## Value Proposition
- Resolve nested reusable workflows automatically, providing complete execution plans across all levels.
- Produce a DOT graph output for integration with visualization tools and documentation.
- Extend programmatic access via HTTP endpoint while preserving existing CLI and library interfaces.
- Maintain backward compatibility with current flags and behaviors.

## Success Criteria
1. The function simulateWorkflow accepts an optional options object with fields recursive (default false) and graph (default false).
2. When recursive is true, nested workflow files referenced via step uses are located, parsed, and merged into the triggers, jobs, and calls lists.
3. When graph is true, a valid Graphviz DOT string is produced reflecting jobs as nodes and needs relationships as directed edges.
4. CLI supports flags --simulate-workflow, --recursive, --graph, and --serve-api [port] without altering existing flag behavior.
5. A new export startSimulationServer(port) starts an HTTP server exposing GET /simulate-workflow with query parameters file, recursive, and graph; response includes triggers, jobs, calls, and optional dot field.
6. File read or YAML parse errors return HTTP 400 with descriptive JSON error; unexpected errors return HTTP 500.
7. All legacy tests remain passing; new tests cover recursive resolution, graph output, and HTTP API with recursive and graph options.

## Implementation Details
1. Update simulateWorkflow signature to accept (filePath, options) and return an object with triggers, jobs, calls, and optional dot string.
2. Implement a recursive loader that resolves local workflow paths or reusable workflow references and merges summaries.
3. Build a graph generator that constructs a DOT representation of jobs and dependencies, including nested jobs.
4. In sandbox/source/main.js, parse new CLI flags --recursive and --graph and pass options into simulateWorkflow; print JSON when graph is false and raw DOT when graph is true.
5. Export startSimulationServer in sandbox/source/main.js using a minimal HTTP server to handle /simulate-workflow requests.
6. Avoid introducing new dependencies beyond express or the built-in http module and js-yaml.

## Testing
- Create tests under sandbox/tests covering nested workflows, graph generation, and HTTP API endpoints with recursive and graph parameters.
- Mock filesystem reads for nested files and simulate error cases to verify HTTP status codes.

## Documentation
- Update sandbox/README.md to include usage examples for flags --recursive, --graph, and --serve-api.
- Enhance sandbox/docs/SIMULATE_WORKFLOW.md with sections on recursive resolution and graph output, including sample HTTP responses and CLI outputs.