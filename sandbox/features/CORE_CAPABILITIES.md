# Purpose
Extend and unify the core functionality of agentic-lib to support workflow simulation, validation, comparison, HTTP API, AWS SQS utilities, documentation export, and a comprehensive CLI in a single cohesive feature.

# Value Proposition
- Provide a complete dry-run analysis of GitHub Actions workflows with matrix expansion and execution graph generation.
- Offer structured semantic validation to surface missing needs, circular dependencies, unsupported triggers, and duplicate job names before CI/CD runs.
- Enable side-by-side workflow comparison with JSON or text diffs and optional graph outputs.
- Generate workflow documentation in Markdown or HTML with embedded visual graphs, job summaries, and dependency tables for easy sharing and review.
- Expose HTTP endpoints for programmatic integration of simulate, validate, compare, and documentation export operations.
- Deliver AWS SQS utilities for generating and processing digest events via Lambda, ensuring robust message handling.
- Present a unified CLI interface covering simulation, validation, comparison, documentation export, SQS operations, version info, and help.

# Success Criteria
1. simulateWorkflow(filePath, options) supports:
   - recursive: boolean (default false)
   - expandMatrix: boolean (default false)
   - graphFormat: 'dot' | 'mermaid' | none
   - validate: boolean (default false)
   and returns triggers, jobs, calls, plus optional matrix expansions, graph, validation issues.
2. validateWorkflow(filePath) returns an array of issues { type, message, location }.
3. compareWorkflows(fileA, fileB, options) returns:
   - summary diff of triggers, jobs, calls
   - optional graph for each version
   - validation issues per version
   - JSON or text diff based on diffFormat option.
4. exportWorkflowDoc(filePath, options) supports:
   - graphFormat: 'dot' | 'mermaid' | none
   - outputFormat: 'markdown' | 'html'
   and returns a string containing formatted documentation including sections for triggers, jobs, calls, dependency tables, and an embedded graph.
5. HTTP API in sandbox/source/main.js:
   - GET /simulate-workflow?file=&recursive=&expandMatrix=&graphFormat=&validate=
   - GET /validate-workflow?file=
   - GET /compare-workflows?fileA=&fileB=&diffFormat=&recursive=&expandMatrix=&graphFormat=&validate=
   - GET /export-workflow-doc?file=&graphFormat=&outputFormat=
   Respond with JSON or HTML body, status codes 200 on success, 400 on invalid input, 500 on server error.
6. AWS SQS utilities in src/lib/main.js:
   - createSQSEventFromDigest(digest) outputs a valid SQS Records array.
   - digestLambdaHandler(event) logs each record, collects batchItemFailures with correct itemIdentifier, and returns { batchItemFailures, handler }.
7. CLI commands in sandbox/source/main.js and src/lib/main.js support:
   - --simulate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>] [--validate]
   - --validate-workflow <file>
   - --compare-workflows <fileA> <fileB> [--diff-format <json|text>] [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>] [--validate]
   - --export-doc <file> [--graph-format <dot|mermaid>] [--output-format <markdown|html>] [--output <path>]
   - --digest
   - --version
   - --help
   Exit codes: 0 on success; 1 on error or validation issues.
8. Documentation and examples updated for all capabilities including exportWorkflowDoc usage.

# Implementation Details
- Extend sandbox/source/main.js to add exportWorkflowDoc function that parses workflows, builds a dependency table, and uses Graphviz or Mermaid to generate diagrams, then formats a Markdown or HTML document.
- Update HTTP server to handle /export-workflow-doc route, invoking exportWorkflowDoc and returning the result with appropriate content-type.
- Enhance CLI argument parsing to handle --export-doc, format output to stdout or write to file if --output is specified.
- Leverage existing simulateWorkflow, validateWorkflow, compareWorkflows utilities and lodash for data formatting.
- Use markdown-it or a lightweight templating approach for HTML output when requested.
- Retain existing logging utilities and error handling patterns.

# Testing
- Update sandbox/tests/simulateWorkflow.test.js to cover expandMatrix, graphFormat, and validate options.
- Add sandbox/tests/validateWorkflow.test.js for semantic validation scenarios.
- Create sandbox/tests/compareWorkflows.test.js covering diff formats, graph outputs, and validation.
- Add sandbox/tests/exportWorkflowDoc.test.js covering Markdown and HTML output, embedded graph, and dependency tables.
- Extend sandbox/tests/cli.test.js for --validate-workflow, --compare-workflows, and --export-doc flags, checking stdout, file output, exit codes, and errors.
- Add sandbox/tests/api.test.js to exercise each HTTP endpoint and assert JSON, markdown, or HTML structure and HTTP status codes.
- Ensure tests in tests/unit/ cover createSQSEventFromDigest and digestLambdaHandler behaviors, as well as CLI flags --digest, --version, and --help.

# Documentation
- Update sandbox/docs/SIMULATE_WORKFLOW.md to reference new HTTP API exports.
- Create sandbox/docs/EXPORT_WORKFLOW_DOC.md detailing exportWorkflowDoc usage, examples for Markdown and HTML, graph embedding, and section layouts.
- Modify sandbox/README.md to document new CLI flags, API endpoints, and export workflow documentation feature, linking to MISSION.md and CONTRIBUTING.md.