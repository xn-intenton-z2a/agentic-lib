# agentic-lib

**agentic-lib** is a JavaScript library designed to power autonomous workflows in GitHub Actions. It provides utilities for capturing console output, generating AWS SQS events, Lambda handlers, CLI tools, and more—enabling continuous code evolution through reusable SDK components.

[Mission Statement](../MISSION.md) | [Contributing](../CONTRIBUTING.md) | [License](../LICENSE.md) | [GitHub](https://github.com/xn-intenton-z2a/agentic-lib)

## Installation

Install via npm:

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Configuration

Set your environment variables via a `.env` file or system environment:

- `OPENAI_API_KEY`: API key for OpenAI.
- `GITHUB_API_BASE_URL` (optional): Base URL for GitHub API (defaults to https://api.github.com).

## Quick Start

Import and use core utilities in your code:

```js
import { startConsoleCapture, stopConsoleCapture, getCapturedOutput } from '@xn-intenton-z2a/agentic-lib/consoleCapture.js';

// Capture logs
startConsoleCapture();
console.log('Hello World');
console.error('Oops!');
stopConsoleCapture();

const logs = getCapturedOutput();
console.table(logs);
``` 

## Command Line Interface

The library includes a CLI entry point with these options:

```bash
node src/lib/main.js [options]
```

- `--help`  
  Display usage instructions.

- `--version`  
  Output version information and timestamp.

- `--digest`  
  Run a sample digest simulation by generating an AWS SQS event and invoking the digest Lambda handler.

Example:

```bash
node src/lib/main.js --digest
```

## Core Utilities

### Console Capture

Buffer `console.log` and `console.error` calls for inspection in tests or runtime diagnostics. See detailed docs: [Console Capture Utility](docs/CONSOLE_CAPTURE.md).

### AWS SQS Event Generation

Generate a simulated AWS SQS event from a digest object:

```js
import { createSQSEventFromDigest } from '@xn-intenton-z2a/agentic-lib';

const event = createSQSEventFromDigest({ key: 'path/to/event.json', value: '12345', lastModified: new Date().toISOString() });
```

### Digest Lambda Handler

Process SQS events and handle JSON parsing errors, returning any failed record identifiers for retry:

```js
import { digestLambdaHandler } from '@xn-intenton-z2a/agentic-lib';

const result = await digestLambdaHandler(event);
console.log(result.batchItemFailures);
```

## Running Tests

```bash
npm test
```

Enable grouped console capture in Vitest:

```bash
VITEST_CONSOLE_CAPTURE=true npm test
```

## Scripts

- `npm start`: Run the CLI with no arguments.
- `npm test`: Run all tests with Vitest.
- `npm run test:unit`: Run tests with coverage.
