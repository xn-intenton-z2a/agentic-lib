# Purpose
Enhance the existing workflow simulation engine to provide configurable matrix expansion, execution graph generation, semantic validation, structured diff comparisons, and a lightweight HTTP API alongside the CLI. This empowers users to fully analyze, compare, and validate GitHub Actions workflows without executing them.

# Value Proposition
- Allow users to expand matrix job configurations for accurate planning.
- Generate execution graphs in DOT and Mermaid formats to visualize job dependencies.
- Perform semantic validation to catch missing needs, circular dependencies, unsupported triggers, and duplicate job names before CI/CD runs.
- Compare two workflow definitions side-by-side, highlighting structural and semantic changes in JSON or text diff formats.
- Expose HTTP endpoints for programmatic integration in automation pipelines and custom tooling.

# Success Criteria
1. simulateWorkflow(filePath, options) accepts:
   - recursive: boolean (default false)
   - expandMatrix: boolean (default false)
   - graphFormat: 'dot' | 'mermaid' | none
   - validate: boolean (default false)
   and returns triggers, jobs, calls, plus optional graph and validation issues.
2. validateWorkflow(filePath) returns array of issues { type, message, location }.
3. compareWorkflows(fileA, fileB, options) returns:
   - summary diff of triggers, jobs, calls
   - optional graph for each version
   - validation issues for each version
   - JSON or text diff output based on options.diffFormat.
4. CLI commands:
   - --validate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>]
   - --compare-workflows <fileA> <fileB> [--diff-format <json|text>] plus recursive, expandMatrix, graphFormat, validate flags
   - Exit codes: 0 on success, 1 on error or validation issues.
5. HTTP API endpoints in sandbox/source/main.js:
   - GET /simulate-workflow?file=&recursive=&expandMatrix=&graphFormat=&validate=
   - GET /validate-workflow?file=&recursive=&expandMatrix=&graphFormat=
   - GET /compare-workflows?fileA=&fileB=&diffFormat=&recursive=&expandMatrix=&graphFormat=&validate=
   Respond with JSON body and status 200 on success, 400 on invalid input, 500 on server error.

# Implementation Details
- Extend simulateWorkflow to support options and integrate matrix expansion, graph generation, and validation.
- Implement validateWorkflow using existing YAML parser and new rule functions for needs, circular dependencies, triggers, duplicate names.
- Enhance compareWorkflows to reuse simulateWorkflow and validateWorkflow, merge results, compute diffs using a JSON diff library (e.g., lodash).
- Update CLI parser to handle new flags and dispatch to appropriate functions, formatting output and exit codes.
- Add HTTP routes to sandbox/source/main.js using a lightweight server (e.g., Express or built-in http module) to map query parameters to function calls.

# Testing
- Add sandbox/tests/validateWorkflow.test.js for valid and invalid workflows, verifying issue arrays.
- Update sandbox/tests/simulateWorkflow.test.js for expandMatrix, graphFormat, and validate options.
- Create sandbox/tests/compareWorkflows.test.js covering diff formats, graphs, and validation in compareWorkflows.
- Extend sandbox/tests/cli.test.js to cover --validate-workflow and --compare-workflows, checking exit codes and output.
- Add sandbox/tests/api.test.js to call each HTTP endpoint, assert JSON structure and HTTP status codes.

# Documentation
- Update sandbox/docs/SIMULATE_WORKFLOW.md with sections for Validation, Comparison, and HTTP API examples.
- Modify sandbox/README.md to document --validate-workflow, --compare-workflows flags and API endpoints.
- Ensure README links to MISSION.md, CONTRIBUTING.md, and sandbox/docs/SIMULATE_WORKFLOW.md.