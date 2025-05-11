# Simulate and Compare Workflows

## Purpose
Provide a unified engine to perform dry-run simulation of GitHub Actions workflows and compare two workflow definitions side by side.  Users can enumerate triggers, jobs, and calls of a single workflow or generate a structured diff between two versions to identify changes before running in CI.

## Value Proposition

- Allow full recursive resolution of reusable workflows, matrix expansion, and graph visualizations.
- Enable side-by-side comparison of workflows to highlight added, removed, or modified triggers, jobs, and reusable calls.
- Support both JSON and human-readable diff formats in CLI and HTTP API interfaces.
- Maintain backward compatibility with existing simulateWorkflow behavior while extending into comparison.

## Success Criteria

1. The function simulateWorkflow(filePath, options) remains available with options fields:
   - recursive (boolean, default false)
   - expandMatrix (boolean, default false)
   - graphFormat (string, default dot, values dot or mermaid)
2. Introduce compareWorkflows signature compareWorkflows(filePathA, filePathB, options) where options include:
   - diffFormat (string, default json, values json or text)
3. compareWorkflows returns an object:
   {
     base: { triggers, jobs, calls, graph?},
     head: { triggers, jobs, calls, graph?},
     diff: { triggers: { added, removed }, jobs: { added, removed, changed }, calls: { added, removed } }
   }
4. CLI flags added:
   - --compare-workflows <fileA> <fileB>
   - --diff-format <json|text>
   - --text (alias for --diff-format text)
   compare outputs JSON or formatted text diff.
5. HTTP API endpoint GET /compare-workflows supports query parameters fileA, fileB, diffFormat. Responds with JSON including base, head, diff fields. Errors return HTTP 400/500 with descriptive JSON errors.
6. All existing simulateWorkflow tests remain passing; new tests cover compareWorkflows pure function, CLI invocations for comparison flags, and HTTP API for compare.

## Implementation Details

1. Expand sandbox/source/main.js:
   - Add compareWorkflows function that calls simulateWorkflow for each file and computes diff.
   - Enhance CLI parser to detect --compare-workflows and pass arguments to compareWorkflows, printing JSON or text.
   - Register HTTP route /compare-workflows alongside /simulate-workflow in startSimulationServer, parsing query params and returning comparison result.
2. Use existing graph generators generateDotGraph and generateMermaidGraph when options.graphFormat is provided in compare output for base and head.
3. Compute job changes by comparing names and needs arrays; mark changed when needs differ.
4. Avoid new dependencies beyond built-ins, js-yaml, lodash.

## Testing

- Add tests in sandbox/tests/compareWorkflows.test.js covering:
  - compareWorkflows on simple workflows showing correct added/removed triggers, jobs, calls.
  - CLI: --compare-workflows pair of YAML files returning correct diffFormat=json and diffFormat=text outputs and exit codes.
  - HTTP API GET /compare-workflows responding with correct JSON structure and error status codes.

## Documentation

- Update sandbox/README.md with CLI and HTTP examples for comparison mode, illustrating json and text formats.
- Enhance sandbox/docs/SIMULATE_WORKFLOW.md with new section "Compare Workflows Example" showing sample responses for diffFormat json and text.
- Reference compareWorkflows in API usage examples.