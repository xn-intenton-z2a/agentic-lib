# intentïon agentic-lib

[![npm version](https://img.shields.io/npm/v/@xn-intenton-z2a/agentic-lib.svg)](https://www.npmjs.com/package/@xn-intenton-z2a/agentic-lib)

The intentïon `agentic-lib` is a Node.js library for AWS SQS-based digest workflows, structured JSON logging, and CLI utilities. It helps you generate SQS events from digest objects, process them with a Lambda handler, and integrate into your Node.js applications or CI/CD pipelines.

## Features

- Structured JSON logging utilities: `logConfig`, `logInfo`, `logError`
- Generate AWS SQS events: `createSQSEventFromDigest(digest)`
- Lambda handler: `digestLambdaHandler(sqsEvent)` with batch failure reporting
- CLI entry point: `main` function with `--help`, `--version`, `--digest` flags

## Installation

Install from npm:

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Configuration

Load optional environment variables via a `.env` file or your environment:

| Variable               | Description                          | Default                                                                            |
|------------------------|--------------------------------------|------------------------------------------------------------------------------------|
| `OPENAI_API_KEY`       | API key for OpenAI calls             | _undefined_ (must be provided for OpenAI-related functionality)                    |
| `GITHUB_API_BASE_URL`  | Base URL for GitHub API              | _undefined_; in development or tests (`VITEST` or `NODE_ENV=development`), defaults to `https://api.github.com.test/` |

Example `.env`:

```env
OPENAI_API_KEY=your_openai_api_key
GITHUB_API_BASE_URL=https://api.github.com/
```

## Quick Start

### Programmatic Usage

```js
import {
  logConfig,
  logInfo,
  logError,
  createSQSEventFromDigest,
  digestLambdaHandler,
  main
} from "@xn-intenton-z2a/agentic-lib";

// Logs configuration on import
logConfig();

// Generate an SQS event from a digest object
const digest = {
  key: "events/1.json",
  value: "12345",
  lastModified: new Date().toISOString(),
};
const sqsEvent = createSQSEventFromDigest(digest);

// Process with the Lambda handler
(async () => {
  const result = await digestLambdaHandler(sqsEvent);
  console.log(result);
  // => { batchItemFailures: [], handler: "src/lib/main.digestLambdaHandler" }
})();
```

### CLI Usage

Run via `npx` or directly with Node:

```bash
npx @xn-intenton-z2a/agentic-lib --help
# or
node src/lib/main.js --help
```

Output:

```
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

Simulate a digest processing:

```bash
npx @xn-intenton-z2a/agentic-lib --digest
```

Example output (structured logs):

```json
{"level":"info","timestamp":"2025-05-06T12:00:00.000Z","message":"Configuration loaded","config":{}}
{"level":"info","timestamp":"2025-05-06T12:00:00.001Z","message":"Digest Lambda received event: {...}"}
```

Show version information:

```bash
npx @xn-intenton-z2a/agentic-lib --version
```

Example output:

```json
{"version":"6.2.1-0","timestamp":"2025-05-06T12:00:00.002Z"}
```

## Logging

All logging utilities emit structured JSON entries with these fields:

- `level`: log level (`info` or `error`)
- `timestamp`: ISO 8601 timestamp
- `message`: descriptive text
- optional: `config`, `error`, `stack`, `verbose` flags

## Documentation

For detailed API reference and advanced examples, see [SQS Digest Handler & CLI Documentation](docs/agenticHandler.md).

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing, testing, and documentation updates.

## License

Dual-licensed under GPL-3.0 and MIT. See [LICENSE](../LICENSE) for details.
