sandbox/docs/SIMULATE_WORKFLOW.md
# sandbox/docs/SIMULATE_WORKFLOW.md
# Simulate Workflow

Detailed specification for the `simulateWorkflow` feature.

## Overview

The `simulateWorkflow` API provides a dry-run enumeration of a GitHub Actions workflow, extracting key metadata without executing any steps.

## API Usage

```javascript
import { simulateWorkflow } from '@xn-intenton-z2a/agentic-lib';

const options = {
  recursive: true,
  expandMatrix: true,
  graphFormat: 'mermaid',
  validate: true,
};
const result = await simulateWorkflow('.github/workflows/ci.yml', options);
// result -> {
//   triggers: ['push', 'pull_request'],
//   jobs: [
//     { name: 'build', needs: [] },
//     { name: 'test', needs: ['build'] },
//   ],
//   calls: ['actions/checkout@v2', './reusable/workflow.yml'],
//   matrixExpansions: {
//     build: [...],
//     test: [...],
//   },
//   graph: '<string>',
//   validationIssues: [],
// }
```

## CLI Usage

```bash
npx agentic-lib --simulate-workflow <workflow.yml> [--recursive] [--expand-matrix] [--graph-format dot|mermaid] [--validate]
```

### Flags

- `--recursive` : Traverse and merge any referenced reusable workflows recursively.
- `--expand-matrix` : Expand each job’s `strategy.matrix` into full permutations.
- `--graph-format <dot|mermaid>` : Generate a job dependency graph in the specified format.
- `--validate` : Run semantic validation to detect issues (e.g., missing dependencies).

#### Example

```bash
npx agentic-lib --simulate-workflow .github/workflows/ci.yml --expand-matrix --graph-format mermaid --validate
```

This prints a JSON document to stdout with the following structure:

- `triggers`: array of event names that trigger the workflow.
- `jobs`: list of job definitions with `name` and normalized `needs` dependencies.
- `calls`: list of all `uses` references for reusable workflows.
- `matrixExpansions` _(optional)_: object mapping job names to an array of permutations of matrix variables.
- `graph` _(optional)_: string representing the job dependency graph in the selected format.
- `validationIssues` _(optional)_: array of detected semantic issues with `type`, `message`, and `location`.

## Error Handling

- **Missing file**: throws an error with message `Failed to read file <path>: <error>`.
- **Invalid YAML**: throws an error with message `Failed to parse YAML: <error>`.

## Acceptance Criteria

1. **Triggers**: Support string, array, and object forms for the `on` field.
2. **Jobs**: Extract each job `name` and normalize `needs` into arrays.
3. **Calls**: Detect all reusable workflow `uses` references.
4. **Matrix Expansion**: When `--expand-matrix` is used, include `matrixExpansions` mapping job names to permutations.
5. **Graph Generation**: When `--graph-format` is provided, include `graph` in the specified format (`dot` or `mermaid`).
6. **Validation**: When `--validate` is used, include `validationIssues` listing semantic issues.
7. **CLI**: Recognize new flags and output extended JSON.
8. **Errors**: Provide descriptive messages for missing files and parsing failures.
