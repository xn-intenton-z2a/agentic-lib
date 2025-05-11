# Purpose
Extend and unify the core functionality of agentic-lib to support workflow simulation, validation, comparison, HTTP API, AWS SQS utilities, and a comprehensive CLI in a single cohesive feature.

# Value Proposition
- Provide a complete dry-run analysis of GitHub Actions workflows with matrix expansion and execution graph generation.
- Offer structured semantic validation to surface missing needs, circular dependencies, unsupported triggers, and duplicate job names before CI/CD runs.
- Enable side-by-side workflow comparison with JSON or text diffs and optional graph outputs.
- Expose HTTP endpoints for programmatic integration of simulate, validate, and compare operations.
- Deliver AWS SQS utilities for generating and processing digest events via Lambda, ensuring robust message handling.
- Present a unified CLI interface covering simulation, validation, comparison, SQS operations, version info, and help.

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
4. HTTP API in sandbox/source/main.js:
   - GET /simulate-workflow?file=&recursive=&expandMatrix=&graphFormat=&validate=
   - GET /validate-workflow?file=
   - GET /compare-workflows?fileA=&fileB=&diffFormat=&recursive=&expandMatrix=&graphFormat=&validate=
   Respond with JSON body, status 200 on success, 400 on invalid input, 500 on server error.
5. AWS SQS utilities in src/lib/main.js:
   - createSQSEventFromDigest(digest) outputs a valid SQS Records array.
   - digestLambdaHandler(event) logs each record, collects batchItemFailures with correct itemIdentifier, and returns { batchItemFailures, handler }.
6. CLI commands in sandbox/source/main.js and src/lib/main.js support:
   - --simulate-workflow <file>
   - --validate-workflow <file> [--recursive] [--expand-matrix] [--graph-format <dot|mermaid>]
   - --compare-workflows <fileA> <fileB> [--diff-format <json|text>] plus recursive, expandMatrix, graphFormat, validate flags
   - --digest
   - --version
   - --help
   Exit codes: 0 on success; 1 on error or validation issues.
7. Documentation and examples updated for all capabilities.

# Implementation Details
- Extend sandbox/source/main.js simulateWorkflow to accept options, add matrix expansion, graph generation, and validation. Hook into a lightweight HTTP server to implement the specified routes.
- Write validateWorkflow and compareWorkflows functions in sandbox/source/main.js, reusing simulateWorkflow and lodash for diffing.
- Enhance CLI argument parsing in both sandbox/source/main.js and src/lib/main.js to dispatch to the respective functions and format output and exit codes.
- Retain logging utilities (logInfo, logError) in src/lib/main.js for consistency.
- Implement createSQSEventFromDigest and digestLambdaHandler in src/lib/main.js, ensuring robust JSON parsing and error reporting with batchItemFailures.

# Testing
- Update sandbox/tests/simulateWorkflow.test.js to cover expandMatrix, graphFormat, and validate options.
- Add sandbox/tests/validateWorkflow.test.js for semantic validation scenarios.
- Create sandbox/tests/compareWorkflows.test.js covering diff formats, graph outputs, and validation.
- Extend sandbox/tests/cli.test.js for --validate-workflow and --compare-workflows flags, checking stdout, exit codes, and errors.
- Add sandbox/tests/api.test.js to exercise each HTTP endpoint and assert JSON structure and HTTP status codes.
- Ensure tests in tests/unit/ cover createSQSEventFromDigest and digestLambdaHandler behaviors, as well as CLI flags --digest, --version, and --help.

# Documentation
- Update sandbox/docs/SIMULATE_WORKFLOW.md with sections for Validation, Comparison, and HTTP API usage examples.
- Create sandbox/docs/SQS_UTILITIES.md detailing createSQSEventFromDigest and digestLambdaHandler usage, edge cases, and examples.
- Modify sandbox/README.md to document new CLI flags, API endpoints, and SQS utilities, linking to MISSION.md and CONTRIBUTING.md.