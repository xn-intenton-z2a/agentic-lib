# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a JavaScript/Node.js library that powers AWS SQS-based digest workflows and provides a CLI interface for simulating and processing events. It includes utilities for generating SQS events, Lambda handlers for processing JSON digests, and structured logging to simplify debugging and monitoring.

## Features

- Environment-configured logging and error handling
- Utility to create AWS SQS events from digest objects (`createSQSEventFromDigest`)
- Lambda handler for digest processing (`digestLambdaHandler`) with batch failure reporting
- CLI commands for help (`--help`), version info (`--version`), and digest simulation (`--digest`)
- Configuration via environment variables or `.env` file

## Installation

```bash
npm install @xn-intenton-z2a/agentic-lib
```

## Environment Variables

- `GITHUB_API_BASE_URL` (optional): Base URL for GitHub API (default in development/test: https://api.github.com.test/)
- `OPENAI_API_KEY` (optional): API key for OpenAI (used in tests/development)

Create a `.env` file to set these variables:

```env
OPENAI_API_KEY=your_openai_api_key
GITHUB_API_BASE_URL=https://api.github.com/
```

## Logging Utilities

The library provides structured JSON logging helpers to standardize logs across your application:

```js
import { logConfig, logInfo, logError } from "@xn-intenton-z2a/agentic-lib";

// Log the loaded configuration (automatically called on import)
logConfig();

// Log informational messages
logInfo("User login successful");

// Log errors with optional error object or message
logError("Failed to process request", new Error("Invalid data"));
```

These functions produce logs in JSON format, for example:

- `logConfig`: `{ level: "info", message: "Configuration loaded", config: { ... } }`
- `logInfo`: `{ level: "info", message: "…", timestamp: "…" }`
- `logError`: `{ level: "error", message: "…", error: "Error: …" }`

## CLI Usage

After installation (or using `npx`):

```bash
npx agentic-lib --help
```

```plaintext
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

Simulate a digest processing:

```bash
npx agentic-lib --digest
```

Show version:

```bash
npx agentic-lib --version
```

## Programmatic Usage

Import and use the library in your Node.js code:

```js
import { createSQSEventFromDigest, digestLambdaHandler } from "@xn-intenton-z2a/agentic-lib";

const digest = {
  key: "events/1.json",
  value: "12345",
  lastModified: new Date().toISOString(),
};

const sqsEvent = createSQSEventFromDigest(digest);

(async () => {
  const result = await digestLambdaHandler(sqsEvent);
  console.log(result);
})();
```

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributions.

## License

This project is licensed under [GPL-3.0](https://opensource.org/licenses/GPL-3.0) (or MIT in parts). See `package.json` for details.
