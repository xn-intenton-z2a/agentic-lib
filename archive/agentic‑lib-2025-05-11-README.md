# agentic-lib

agentic-lib is a JavaScript SDK that enables autonomous GitHub workflows by providing reusable functions and handlers. It can be used as a drop-in implementation or replacement for steps, jobs, and workflows in your GitHub Actions, empowering continuous code review, fixes, and evolution.

Key benefits include:

- Drop-in SDK for GitHub Actions workflows
- Autonomous processing of SQS digest events
- Structured JSON logging for observability
- Easy CLI and programmatic integrations

## Installation

Install via npm:

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Usage

### CLI Usage

```bash
# Show help and usage instructions
npm run start -- --help

# Show version with timestamp
npm run start -- --version

# Simulate a digest Lambda execution
npm run start -- --digest
```

### Programmatic Usage

```js
import { main, digestLambdaHandler, createSQSEventFromDigest, logInfo } from 'agentic-lib';

// Log an informational message
logInfo('Hello from agentic-lib');

// Create an SQS event from a digest object and invoke the handler
const digest = { key: 'events/1.json', value: '12345', lastModified: new Date().toISOString() };
const event = createSQSEventFromDigest(digest);
await digestLambdaHandler(event);
```

## API Reference

| Function                   | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| main(args)                 | CLI entry point; processes flags (`--help`, `--version`, `--digest`).       |
| digestLambdaHandler(event) | AWS Lambda SQS handler for processing digest messages.                       |
| createSQSEventFromDigest   | Creates a mock SQS event from a digest object.                              |
| logInfo(message)           | Logs an info-level message in JSON format.                                   |
| logError(message, error)   | Logs an error-level message in JSON format, including error details.         |
| logConfig()                | Logs the loaded configuration values.                                        |

## Links

- [Mission Statement](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/MISSION.md)
- [Contributing Guidelines](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/CONTRIBUTING.md)
- [License](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/LICENSE.md)
- [GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)
