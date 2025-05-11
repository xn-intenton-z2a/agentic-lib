# Simulate Workflow

## Purpose
Enable users to generate a dry-run execution plan for a GitHub Actions workflow, enumerating triggers, jobs, and reusable workflow calls without running actual CI.

## Value Proposition
- Preview and document any workflow execution path before CI execution.
- Improve confidence and catch configuration issues early.

## Success Criteria
- Function simulateWorkflow takes a file path and returns a JSON object with
  triggers: array of event names,
  jobs: array of job names and dependencies,
  calls: array of reusable workflows used in steps.
- Automated tests cover typical workflows and edge cases.

## Implementation Details
- Add simulateWorkflow(workflowFilePath) in src/lib/main.js.
- Use js-yaml to parse YAML file content.
- Extract on, jobs, and uses within steps.
- Extend CLI with --simulate-workflow <file> option to call simulateWorkflow.

## Testing
- Create tests in sandbox/tests/simulate-workflow.test.js.
- Mock filesystem reads with example YAML files to validate output structure.
- Verify error handling for missing or invalid YAML.

## Documentation
- Update README to include simulateWorkflow API and CLI usage with examples.
