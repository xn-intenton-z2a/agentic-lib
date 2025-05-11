# Purpose
Provide a unified engine for dry-run simulation and semantic validation of GitHub Actions workflows, along with structured comparison between two workflow definitions. Enable users to explore triggers, jobs, dependencies, reusable calls, and detect workflow definition issues before running in CI/CD.

# Value Proposition
- Extract triggers, jobs, dependencies without executing steps
- Resolve reusable workflows recursively and expand matrix configurations for accurate planning
- Visualize execution graphs in DOT and Mermaid formats to aid understanding
- Compare two workflows side-by-side with JSON and text diff formats to highlight changes
- Validate workflow semantics: detect missing job dependencies, circular dependencies, unsupported trigger types, and duplicate job names
- Accessible via CLI and HTTP API to integrate into automation pipelines and custom tooling

# Success Criteria
1. simulateWorkflow(filePath, options) signature supports:
   - recursive: boolean (default false)
   - expandMatrix: boolean (default false)
   - graphFormat: 'dot' | 'mermaid' | none
   - validate: boolean (default false) to enable semantic validation
2. validateWorkflow(filePath, options) returns:
   - issues: array of { type, message, location } for each detected problem
3. compareWorkflows(fileA, fileB, options) returns structured diffs and reuses simulateWorkflow and validateWorkflow options
4. CLI enhancements:
   - --simulate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>] [--validate]
   - --validate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>]
   - --compare-workflows <fileA> <fileB> [--diff-format <json|text>] plus graph and validate flags
   - Exit code 0 on success, 1 on errors or validation issues
5. HTTP API endpoints:
   - GET /simulate-workflow?file=&recursive=&expandMatrix=&graphFormat=&validate=
   - GET /validate-workflow?file=&recursive=&expandMatrix=&graphFormat=
   - GET /compare-workflows?fileA=&fileB=&diffFormat=&recursive=&expandMatrix=&graphFormat=&validate=
   - Return JSON with parsed data, graphs, diffs, and validation issues; HTTP 400 on bad input, 500 on server error

# Implementation Details
1. Extend simulateWorkflow in sandbox/source/main.js to accept an options object and implement matrix expansion, graph generation, and validation invocation
2. Implement validateWorkflow in sandbox/source/main.js that:
   - Parses the workflow
   - Runs semantic checks: missingNeeds, circularDependencies, unsupportedTriggers, duplicateJobNames
   - Returns an array of issue objects with type, message, and location details
3. Enhance compareWorkflows to invoke validateWorkflow on each version and include issues in diff report
4. Update CLI argument parser in sandbox/source/main.js to recognize new flags (--validate-workflow and --validate) and dispatch appropriately
5. Add HTTP routes in sandbox/source/main.js for /validate-workflow that parse query parameters and return JSON validation results
6. Introduce utility functions for validation rules and reuse existing YAML parsing logic

# Testing
- Create sandbox/tests/validateWorkflow.test.js to cover valid and invalid workflows, checking issue types and messages
- Update sandbox/tests/simulateWorkflow.test.js to include scenarios with --validate flag
- Extend sandbox/tests/cli.test.js to simulate --validate-workflow and --validate usage and verify exit codes, stdout, and stderr
- Add sandbox/tests/api.test.js to call /validate-workflow endpoints and assert JSON structure and HTTP status codes

# Documentation
- Revise sandbox/docs/SIMULATE_WORKFLOW.md with new Validation section and examples for both CLI and HTTP API
- Update sandbox/README.md to document --validate-workflow, --validate flags, and validation endpoint details