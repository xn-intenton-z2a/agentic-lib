# agentic-lib

[![npm version](https://img.shields.io/npm/v/@xn-intenton-z2a/agentic-lib)](https://www.npmjs.com/package/@xn-intenton-z2a/agentic-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE.md)

Agentic-lib is a JavaScript SDK for simulating and orchestrating GitHub Actions workflows, enabling you to perform dry-run analysis, manage SQS events, and integrate into your CI/CD pipelines in an “agentic” manner.

Refer to the [Mission Statement](../MISSION.md) to learn more about the vision and goals of this project.

Repository: https://github.com/xn-intenton-z2a/agentic-lib

## Key Features

- **Workflow Simulation**  
  Parse GitHub Actions workflow YAML files to extract triggers, jobs, and reusable workflow calls without executing steps.  
- **SQS Utilities**  
  Create and process AWS SQS events for Lambda functions:  
  - `createSQSEventFromDigest(digest)`  
  - `digestLambdaHandler(event)`  
- **Command-Line Interface (CLI)**  
  Use the CLI to access core functionality:  
  - `--simulate-workflow <path>`: Dry-run a workflow and output JSON summary.  
  - `--digest`: Simulate processing of a sample SQS digest event.  
  - `--version`: Show library version and timestamp.  
  - `--help`: Display usage instructions.

## Installation

```bash
npm install @xn-intenton-z2a/agentic-lib
```

Or, run directly with npx:

```bash
npx agentic-lib --simulate-workflow path/to/workflow.yml
```

## Usage

### API

```javascript
import { simulateWorkflow, createSQSEventFromDigest, digestLambdaHandler } from '@xn-intenton-z2a/agentic-lib';

(async () => {
  // Workflow simulation
  const result = await simulateWorkflow('.github/workflows/ci.yml');
  console.log(result);

  // SQS event generation and handling
  const digest = { key: 'events/1.json', value: '12345', lastModified: new Date().toISOString() };
  const sqsEvent = createSQSEventFromDigest(digest);
  const handlerResult = await digestLambdaHandler(sqsEvent);
  console.log(handlerResult);
})();
```

### CLI

```bash
npx agentic-lib --simulate-workflow .github/workflows/ci.yml
npx agentic-lib --digest
npx agentic-lib --version
npx agentic-lib --help
```

## Documentation

- Detailed workflow simulation: [Simulate Workflow](docs/SIMULATE_WORKFLOW.md)  
- Contributing guidelines: [CONTRIBUTING.md](../CONTRIBUTING.md)  
- License information: [LICENSE.md](../LICENSE.md)

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](../CONTRIBUTING.md) before submitting PRs.

## License

This project is dual-licensed under the MIT and GPL-3.0 licenses. See [LICENSE.md](../LICENSE.md) for details.