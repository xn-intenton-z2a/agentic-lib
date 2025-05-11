# Simulate Workflow

Detailed specification for the `simulateWorkflow` feature.

## Overview

The `simulateWorkflow` API provides a dry-run enumeration of a GitHub Actions workflow, extracting key metadata without executing any steps.

## API Usage

```javascript
import { simulateWorkflow } from '@xn-intenton-z2a/agentic-lib';

const result = await simulateWorkflow('.github/workflows/ci.yml');
// result -> {
//   triggers: ['push', 'pull_request'],
//   jobs: [
//     { name: 'build', needs: [] },
//     { name: 'test', needs: ['build'] },
//   ],
//   calls: ['actions/checkout@v2', './reusable/workflow.yml'],
// }
```

## CLI Usage

```bash
npx agentic-lib --simulate-workflow .github/workflows/ci.yml
```

This prints a JSON document to stdout with the following structure:

- `triggers`: array of event names that trigger the workflow.
- `jobs`: list of job definitions with `name` and normalized `needs` dependencies.
- `calls`: list of all `uses` references for reusable workflows.

## Error Handling

- **Missing file**: throws an error with message `Failed to read file <path>: <error>`.
- **Invalid YAML**: throws an error with message `Failed to parse YAML: <error>`.

## Acceptance Criteria

1. **Triggers**: Support string, array, and object forms for the `on` field.
2. **Jobs**: Extract each job `name` and normalize `needs` into arrays.
3. **Calls**: Detect all reusable workflow `uses` references.
4. **CLI**: Recognize `--simulate-workflow <file>` and output JSON.
5. **Errors**: Provide descriptive messages for missing files and parsing failures.
