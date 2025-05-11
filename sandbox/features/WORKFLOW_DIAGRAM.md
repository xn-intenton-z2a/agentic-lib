# Objective & Scope

Extend the existing CLI toolkit diagram feature to incorporate an optional cost threshold alert capability in addition to the advanced cost modeling. Users can visualize resource cost breakdowns and identify steps that exceed a user-defined USD threshold.

# Value Proposition

Provide developers and DevOps engineers with not only structural and financial insights into their workflows but also automated alerts for expensive steps. This enables proactive optimization, budget planning, and early identification of cost hotspots within automated pipelines.

# Success Criteria & Requirements

- Enhance processDiagram to accept the flags:
  - --cost-model to generate CPU, memory, and cost metrics.
  - --cost-threshold=<USD> to specify a maximum allowed cost per step.
  - --format=json or --format=markdown; default remains markdown.

- In sandbox/source/main.js:
  - Continue to use generateCostModel(nodes) to produce an array of { step, cpuMs, memoryMb, costUsd }.
  - Implement evaluateCostThreshold(costModel, threshold) that returns an array of alerts for costUsd strictly greater than threshold. Each alert object: { step, costUsd }.
  - Update processDiagram to:
    - Parse and pass threshold argument to evaluateCostThreshold.
    - In markdown mode:
      - After the mermaid flowchart and cost table, if threshold provided and alerts non-empty, append an Alerts section:
        ## Alerts
        | Step | Cost (USD) |
        |------|------------|
        | stepA | 1.50 |
        | stepB | 2.75 |
      - If no alerts, append a line “All steps within the cost threshold of <threshold> USD.”
    - In JSON mode:
      - Include a new field alerts: array of { step, costUsd } alongside nodes, links, errors, costModel.

- Update unit tests in sandbox/tests/cli.test.js to verify:
  - evaluateCostThreshold returns correct alerts for a sample costModel and threshold.
  - processDiagram when invoked with --cost-model --cost-threshold in both markdown and JSON modes produces expected Alerts section or alerts field.

- Update integration tests in sandbox/tests/cli.test.js for combined flags --diagram --features-overview --cost-model --cost-threshold --format=... if features overview remains supported.

- Update documentation in sandbox/README.md and sandbox/docs/CLI_TOOLKIT.md with usage examples for --cost-threshold, demonstrating both markdown and JSON outputs.

# User Scenarios & Examples

Scenario: A DevOps engineer wants to flag any steps costing more than 0.5 USD. They run:

node sandbox/source/main.js --diagram --cost-model --cost-threshold=0.5

They receive a mermaid flowchart, a cost table, and an Alerts table listing any steps above 0.5 USD. If none exceed, they see a confirmation message.

Scenario: A finance auditor wants machine-readable alerts. They run:

node sandbox/source/main.js --diagram --cost-model --cost-threshold=0.5 --format=json

They receive:
{
  "nodes": [...],
  "links": [...],
  "errors": [],
  "costModel": [...],
  "alerts": [ { "step": "processDiagram", "costUsd": 0.75 }, ... ]
}

# Verification & Acceptance

- Unit tests confirm evaluateCostThreshold accuracy and correct console output for both formats.
- Integration tests verify processDiagram with various flag combinations, presence or absence of alerts, and compatibility with features overview.
- Documentation updated with clear examples and flag descriptions.