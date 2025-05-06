# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a JavaScript SDK powering automated GitHub workflows and AWS Lambda integrations. It provides reusable CLI commands and Lambda handlers to process SQS events, integrate with OpenAI, and simulate event digests. Each workflow can be composed and invoked via GitHub’s `workflow_call` event, making it simple to build autonomous, self-evolving code pipelines.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)  
[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)  
[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

---

## Features

- **CLI Tool**: Lightweight interface offering:
  - `--help`: Display usage instructions.
  - `--digest`: Simulate an SQS event replay with a sample digest object.
  - `--version`: Show package version and timestamp.
- **AWS Lambda Handler**: `digestLambdaHandler` processes SQS messages, logs successes and failures, and reports batch item failures for reprocessing.
- **Utilities**:
  - `createSQSEventFromDigest(digest)`: Construct an SQS event from a digest object.
  - Logging functions: `logInfo`, `logError`, and `logConfig` output structured JSON logs.

## Installation

Install via npm:

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Quick Start

### CLI Usage

```bash
# Display help
npx agentic-lib --help

# Simulate a digest SQS event
npx agentic-lib --digest

# Show version information
npx agentic-lib --version
```

### As a Library

Import and invoke handlers in your code:

```js
import {
  digestLambdaHandler,
  createSQSEventFromDigest,
  logInfo,
  logError
} from '@xn-intenton-z2a/agentic-lib';

// Example: create and process an SQS event
const exampleDigest = { key: 'events/1.json', value: '12345', lastModified: new Date().toISOString() };
const sqsEvent = createSQSEventFromDigest(exampleDigest);

digestLambdaHandler(sqsEvent)
  .then(result => console.log('Batch failures:', result.batchItemFailures))
  .catch(err => logError('Handler failed', err));
```

## Configuration

Environment variables (via `.env` or system env):

- `OPENAI_API_KEY` — Your OpenAI API key (optional for tests).
- `GITHUB_API_BASE_URL` — Custom GitHub API URL (optional for tests or mocks).

Supports loading via `dotenv` for local development and `NODE_ENV=development` for default test values.

## API Reference

### `main(args)`
Entry point for CLI invocation. Processes `--help`, `--version`, and `--digest` flags.

### `createSQSEventFromDigest(digest)`
Constructs a standard AWS SQS event object given a digest payload.

### `digestLambdaHandler(sqsEvent)`
Lambda handler function to process incoming SQS events, log details, and return any record failures.

### `logInfo(message)`
Outputs an info-level JSON log with timestamp.

### `logError(message, error?)`
Outputs an error-level JSON log with optional error details and stack when verbose.

### `logConfig()`
Logs the current configuration loaded from environment variables.

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on reporting issues, submitting pull requests, and coding standards.

## License

Mixed licensing:

* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT
