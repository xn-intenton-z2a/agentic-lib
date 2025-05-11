# Simulate and Compare Workflows

## Purpose
Provide a unified engine for dry-run simulation of GitHub Actions workflows and structured comparison between two workflow definitions, enabling users to explore triggers, jobs, dependencies, and reusable calls before running in CI.

## Value Proposition
- Extract triggers, jobs, and reusable workflow calls without executing steps
- Support recursive resolution of reusable workflows and matrix expansion for accurate planning
- Offer visual representations of execution graphs in DOT or Mermaid formats
- Enable side-by-side and structured diff of two workflow versions to identify added, removed, or modified elements
- Accessible via CLI and HTTP API for integration in diverse tooling and automation pipelines

## Success Criteria
1. Export simulateWorkflow(path, options) with options:
   - recursive: boolean (default false)
   - expandMatrix: boolean (default false)
   - graphFormat: string (default none, values dot, mermaid)
2. Export compareWorkflows(pathA, pathB, options) with options:
   - diffFormat: string (default json, values json, text)
   - inherit simulateWorkflow options for graph output in base and head
3. CLI enhancements:
   - --simulate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>]
   - --compare-workflows <fileA> <fileB> [--diff-format <json|text>] plus graph flags
   - Output JSON or formatted text to stdout, exit code 0 on success, 1 on error
4. HTTP API endpoints:
   - GET /simulate-workflow?file=<path>&recursive=&expandMatrix=&graphFormat=
   - GET /compare-workflows?fileA=&fileB=&diffFormat=&recursive=&expandMatrix=&graphFormat=
   - Respond with JSON bodies containing parsed data, graphs, and diffs; return HTTP 400/500 on errors
5. Maintain backward compatibility: existing simulateWorkflow(path) calls and tests continue to pass unchanged

## Implementation Details
1. In sandbox/source/main.js:
   - Extend simulateWorkflow signature to accept options object and implement matrix expansion and graph generation using existing or new helpers
   - Implement compareWorkflows by invoking simulateWorkflow on each file and computing added, removed, and changed triggers, jobs, and calls
   - Enhance CLI argument parser to recognize new flags and dispatch to simulate or compare logic
2. Introduce a lightweight HTTP server (e.g., using native http or a minimal framework) to serve the two new endpoints, parsing query parameters and returning JSON
3. Add or extend utility functions for generating DOT and Mermaid graphs from the job dependency graph
4. Ensure error handling returns clear messages in both CLI and HTTP contexts
5. No new file paths beyond sandbox/source, sandbox/tests, sandbox/docs, sandbox/README.md, and sandbox/package.json modifications

## Testing
- Update sandbox/tests/simulateWorkflow.test.js to cover options parsing, matrix expansion, and graphFormat outputs
- Create sandbox/tests/compareWorkflows.test.js to validate diff results in both JSON and text formats and error scenarios
- Add tests for CLI flags in sandbox/tests/cli.test.js simulating process.argv and capturing stdout/stderr
- Add HTTP API tests in sandbox/tests/api.test.js using a simple HTTP client to call endpoints and validate JSON responses and status codes

## Documentation
- Update sandbox/docs/SIMULATE_WORKFLOW.md with usage examples for new CLI flags and HTTP endpoints, showing sample outputs
- Add a “Compare Workflows” section illustrating diffFormat=json and diffFormat=text
- Update sandbox/README.md with overview of features, CLI usage, HTTP API reference, and links to MISSION.md and CONTRIBUTING.md
