# Simulate Workflow

## Purpose
Extend the existing dry-run engine to support recursive resolution of reusable workflows and optional generation of a visual execution graph. Users can preview complete execution plans including nested workflows and output a Graphviz DOT representation for visualization.

## Value Proposition
- Provide full insight into multi-level workflows by tracing reusable workflow calls across repositories.
- Empower users to validate and document end-to-end execution paths before CI runs.
- Facilitate architecture reviews by exporting workflow dependency graphs in DOT format for external visualization tools.

## Success Criteria
1. simulateWorkflow API accepts an options object with flags `recursive` and `graph`.
2. When `recursive` is true, simulateWorkflow loads and merges all referenced reusable workflows, preserving triggers, jobs, and inter-workflow dependencies in the returned plan.
3. When `graph` is true, simulateWorkflow returns an additional `dot` field containing a valid Graphviz DOT description of the full execution plan.
4. CLI supports new flags `--recursive` and `--graph` alongside `--simulate-workflow`, printing JSON with optional dot output when requested.
5. Comprehensive tests cover single and multi-level reusable workflows, missing or invalid nested files, and graph output structure.

## Implementation Details
- Update simulateWorkflow signature to `simulateWorkflow(filePath, options)` where options.recursive and options.graph default to false.
- For recursive resolution, detect `uses` references pointing to local file paths, load those YAML files, parse and merge their jobs and calls into the main plan.
- Construct a directed graph of jobs and nested workflow calls; serialize it into DOT format when graph flag is set.
- Extend CLI entrypoint to parse `--recursive` and `--graph` flags and pass into simulateWorkflow.
- Use js-yaml for parsing and a simple DOT generation routine; no new dependencies beyond js-yaml.

## Testing
- Add tests in sandbox/tests/simulate-workflow-recursive.test.js verifying nested workflow parsing and combined plan output.
- Add tests for graph output matching expected DOT syntax for simple and multi-layer workflows.
- Mock filesystem reads for nested YAML files and ensure error handling when nested file is missing or invalid.

## Documentation
- Update sandbox/docs/SIMULATE_WORKFLOW.md to describe new options, API signature, and example of DOT output.
- Update sandbox/README.md with CLI usage examples for recursive simulation and graph export.
