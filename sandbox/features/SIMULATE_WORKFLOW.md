# Purpose
Provide a unified engine for dry-run simulation of GitHub Actions workflows and structured comparison between two workflow definitions, enabling users to explore triggers, jobs, dependencies, and reusable calls before running in CI/CD.

# Value Proposition
- Extract triggers, jobs, dependencies without executing any steps
- Resolve reusable workflows recursively and expand matrix configurations for accurate planning
- Visualize execution graphs in DOT and Mermaid formats to aid understanding
- Compare two workflows side-by-side with JSON and text diff formats to highlight added, removed, or modified elements
- Accessible via CLI and HTTP API to integrate into automation pipelines and custom tooling

# Success Criteria
1. simulateWorkflow(filePath, options) signature supports:
   - recursive: boolean (default false)
   - expandMatrix: boolean (default false)
   - graphFormat: 'dot' | 'mermaid' | none
2. compareWorkflows(fileA, fileB, options) returns structured diff results:
   - diffFormat: 'json' | 'text'
   - reuses simulateWorkflow options for graph generation on both versions
3. CLI enhancements:
   - --simulate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>]
   - --compare-workflows <fileA> <fileB> [--diff-format <json|text>] plus graph flags
   - Output JSON or formatted text to stdout; exit code 0 on success, 1 on error
4. HTTP API endpoints:
   - GET /simulate-workflow?file=&recursive=&expandMatrix=&graphFormat=
   - GET /compare-workflows?fileA=&fileB=&diffFormat=&recursive=&expandMatrix=&graphFormat=
   - Return JSON responses with parsed data, graphs, and diffs; HTTP 400/500 on error

# Implementation Details
1. Extend simulateWorkflow in sandbox/source/main.js to accept options object and implement matrix expansion and graph generation using utility functions
2. Implement compareWorkflows by invoking simulateWorkflow on each file, computing added, removed, and changed triggers, jobs, and calls
3. Enhance CLI argument parser in sandbox/source/main.js to recognize new flags and dispatch to proper workflows
4. Introduce a minimal HTTP server in sandbox/source/main.js to serve endpoints, parse query parameters, and return JSON
5. Add utility functions for generating DOT and Mermaid graphs from job dependency structures

# Testing
- Update sandbox/tests/simulateWorkflow.test.js to cover options parsing, matrix expansion, and graphFormat outputs
- Create sandbox/tests/compareWorkflows.test.js to verify diffFormat=json and text scenarios, including error handling
- Extend sandbox/tests/cli.test.js to simulate CLI flags for both simulation and comparison and validate stdout, stderr, and exit codes
- Add sandbox/tests/api.test.js using a lightweight HTTP client to call endpoints and assert JSON responses and status codes

# Documentation
- Revise sandbox/docs/SIMULATE_WORKFLOW.md with examples for new CLI flags and HTTP endpoints, demonstrating JSON, graph, and diff outputs
- Add a Compare Workflows section illustrating diffFormat=json and diffFormat=text outputs
- Update sandbox/README.md with feature overview, CLI usage, HTTP API reference, and links to MISSION.md and CONTRIBUTING.md