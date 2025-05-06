# intentïon agentic-lib

[![npm version](https://img.shields.io/npm/v/@xn-intenton-z2a/agentic-lib.svg)](https://www.npmjs.com/package/@xn-intenton-z2a/agentic-lib)

The intentïon `agentic-lib` is a Node.js library for AWS SQS-based digest workflows, structured JSON logging, and CLI utilities. It helps you generate SQS events from digest objects, process them with a Lambda handler, and integrate into your Node.js applications or CI/CD pipelines.

## Features

- Structured JSON logging utilities: `logConfig`, `logInfo`, `logError`
- Utility: `createSQSEventFromDigest(digest)` for AWS SQS event generation
- Lambda handler: `digestLambdaHandler(sqsEvent)` with batch failure reporting
- CLI: `main` function with flags:
  - `--help`: Show usage instructions
  - `--version`: Output JSON with version & timestamp
  - `--digest`: Generate and process a sample digest event via SQS

## Installation

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Quick Start

### Programmatic Usage

```js
import {
  createSQSEventFromDigest,
  digestLambdaHandler,
  logConfig,
  logInfo,
  logError,
  main
} from "@xn-intenton-z2a/agentic-lib";

// Load and log configuration
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
  // { batchItemFailures: [], handler: "src/lib/main.digestLambdaHandler" }
})();
```

### CLI Usage

Run via npx or directly with Node:

```bash
npx @xn-intenton-z2a/agentic-lib --help
# or
node src/lib/main.js --help
```

**Output:**
```
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

**Simulate a digest processing:**
```bash
npx @xn-intenton-z2a/agentic-lib --digest
```
**Example Output:**
```json
{ "level": "info", "timestamp": "2025-05-06T12:00:00.000Z", "message": "Configuration loaded", "config": {} }
{ "level": "info", "timestamp": "2025-05-06T12:00:00.001Z", "message": "Digest Lambda received event: { ... }" }
```

**Show version information:**
```bash
npx @xn-intenton-z2a/agentic-lib --version
```
**Example Output:**
```json
{ "level": "info", "timestamp": "2025-05-06T12:00:00.000Z", "message": "Configuration loaded", "config": {} }
{ "version": "6.2.1-0", "timestamp": "2025-05-06T12:00:00.002Z" }
```

## Configuration

The library reads environment variables (optionally via a `.env` file) for configuration:

- `GITHUB_API_BASE_URL` (optional)
- `OPENAI_API_KEY` (optional)

Example `.env`:
```env
OPENAI_API_KEY=your_openai_api_key
GITHUB_API_BASE_URL=https://api.github.com/
```

## Logging

All logging utilities produce structured JSON entries with fields such as:

- `level`: log level (`info`, `error`)
- `timestamp`: ISO timestamp
- `message`: descriptive message
- optional details: error stack, config data, etc.

## Documentation

For full API reference and advanced examples, see [SQS Digest Handler & CLI Documentation](docs/agenticHandler.md).

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing, testing, and documentation updates.

## License

Dual-licensed under GPL-3.0 and MIT. See [LICENSE](../LICENSE) for details.
