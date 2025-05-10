# Objective & Scope

Extend the existing CLI toolkit diagram feature to include an advanced cost modeling capability that tracks and visualizes resource consumption (CPU time, memory usage) and estimated cost in USD across the same workflow steps.

No new files are introduced. The changes live in sandbox/source/main.js, associated tests in sandbox/tests, the README in sandbox/README.md, and the CLI guide in sandbox/docs/CLI_TOOLKIT.md.

# Value Proposition

Provide users with both structural and financial insights into their workflows. Developers and DevOps engineers can visualize not only how steps connect but also how much compute resources each step consumes and the associated cost, enabling optimization and budget planning.

# Success Criteria & Requirements

- Extend processDiagram to recognize a new flag `--cost-model` (or `--diagram --cost-model`).  
- Support optional `--format=json` or `--format=markdown`; default remains markdown.  
- In markdown mode, after the mermaid flowchart, append a Markdown table with headers: Step | CPU Time (ms) | Memory (MB) | Cost (USD).  Rows must correspond to each node in the diagram.  
- In JSON mode, include a new field `costModel` alongside `nodes`, `links`, and `errors`.  `costModel` is an array of objects with properties: `step`, `cpuMs`, `memoryMb`, `costUsd`.  
- Implement a new helper `generateCostModel(nodes)` in sandbox/source/main.js that returns synthetic or collected metrics for each step.  
- Update unit tests in sandbox/tests/cli.test.js to verify:  
  - `generateCostModel` returns a properly structured array.  
  - `processDiagram` when invoked with `--cost-model` logs the merged diagram and cost output correctly in both markdown and JSON modes.  
- Update integration tests in sandbox/tests/cli.test.js for combined flags `--diagram --cost-model --features-overview --format=...` if features overview is still supported.  

# User Scenarios & Examples

Scenario: A team lead wants to see resource and cost breakdown of the CLI to Lambda workflow. They run:
```
node sandbox/source/main.js --diagram --cost-model
```
They receive a mermaid flowchart followed by:

| Step                     | CPU Time (ms) | Memory (MB) | Cost (USD) |
|--------------------------|---------------|-------------|------------|
| CLI                      |  12           |     5       |  0.0006    |
| main                     |  30           |    15       |  0.0018    |
| processDiagram           |  20           |    10       |  0.0012    |
| ...                      |  ...          |    ...      |   ...      |

Scenario: A financial auditor wants machine-readable metrics. They run:
```
node sandbox/source/main.js --diagram --cost-model --format=json
```
They receive:
```
{
  "nodes": [...],
  "links": [...],
  "errors": [],
  "costModel": [
    { "step": "CLI", "cpuMs": 12, "memoryMb": 5, "costUsd": 0.0006 },
    ...
  ]
}
```

# Verification & Acceptance

- Unit tests cover both `generateDiagram` with and without cost-model flag.  
- Unit tests for `generateCostModel` ensure correct array shape and field types.  
- `processDiagram` tests assert `console.log` output of combined diagram and cost for both formats.  
- Integration test for main ensures diagram and cost are merged correctly when both `--diagram` and `--cost-model` are provided.  
- Documentation in README and sandbox/docs/CLI_TOOLKIT.md updated with usage examples and descriptions of `--cost-model` flag and output formats.
