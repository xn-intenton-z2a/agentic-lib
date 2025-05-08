# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a JavaScript SDK and CLI toolkit for building "agentic" GitHub Actions workflows. It provides utilities for logging, environment configuration, SQS event simulation, and an out-of-the-box Lambda handler suitable for digest processing. Use it as a drop-in library or full replacement to power autonomous, self-evolving workflows in your repository.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

[Also on GitHub Pages](https://xn-intenton-z2a.github.io/agentic-lib/index.html)

[See the latest repository stats](https://xn-intenton-z2a.github.io/agentic-lib/latest.html)

Mixed licensing:

* This project is licensed under GPL-3.0 and MIT.
* See [LICENSE-MIT](LICENSE-MIT) for details.

---

## Installation

Install via npm or yarn:

```bash
npm install @xn-intenton-z2a/agentic-lib
# or
yarn add @xn-intenton-z2a/agentic-lib
```

## Environment Configuration

The library reads configuration from environment variables or a `.env` file:

- `OPENAI_API_KEY` (optional): API key for OpenAI calls.
- `GITHUB_API_BASE_URL` (optional): Base URL for GitHub API calls (defaults to `https://api.github.com/`).

During development or in test environments (`VITEST` or `NODE_ENV=development`), default test values will be applied if you omit these variables.

## CLI Usage

The package provides a simple CLI entrypoint. Run it via `npx agentic-lib` or:

```bash
node ./node_modules/@xn-intenton-z2a/agentic-lib/src/lib/main.js [options]
```

Options:
```
--help       Show help message and usage instructions.
--version    Show version information (JSON with version and timestamp).
--digest     Simulate an SQS event with an example digest payload and invoke the digest Lambda handler.
```

Example:
```bash
npx agentic-lib --digest
```

If no flag is provided, the CLI prints usage instructions and exits.

## API Reference

Import functions in your JavaScript or TypeScript code:

```js
import {
  config,
  logConfig,
  logInfo,
  logError,
  createSQSEventFromDigest,
  digestLambdaHandler,
  main,
} from '@xn-intenton-z2a/agentic-lib';
```

### config

Zod-parsed environment configuration:

```ts
interface Config {
  OPENAI_API_KEY?: string;
  GITHUB_API_BASE_URL?: string;
}
```

### logConfig()

Logs the loaded configuration as a JSON object at `info` level.

### logInfo(message: string)

Logs an informational message. When verbose mode is enabled, includes additional metadata.

### logError(message: string, error?: Error)

Logs an error with optional stack trace in verbose mode.

### createSQSEventFromDigest(digest: object)

Helper to wrap a digest object in an AWS SQS event structure:

```js
const example = {
  key: 'events/1.json',
  value: '12345',
  lastModified: new Date().toISOString(),
};
const sqsEvent = createSQSEventFromDigest(example);
```

### digestLambdaHandler(sqsEvent)

An async handler designed for AWS Lambda to process SQS messages containing JSON payloads.

- Parses each record's `.body` as JSON.
- Logs each digest at `info` level.
- Collects failures and returns an object with `batchItemFailures` for retryable records.

Example:
```js
const result = await digestLambdaHandler(sqsEvent);
console.log(result.batchItemFailures);
```

### main(args?: string[])

Entry point for the CLI. Processes `--help`, `--version`, and `--digest` flags in sequence. If no flags match, prints usage instructions.

## Examples

### As a Lambda Handler in AWS

```ts
import { digestLambdaHandler } from '@xn-intenton-z2a/agentic-lib';

export const handler = async (event) => {
  const response = await digestLambdaHandler(event);
  return response;
};
```

### Simulating an SQS Event

```js
import {
  createSQSEventFromDigest,
  digestLambdaHandler,
} from '@xn-intenton-z2a/agentic-lib';

const digest = { key: 'foo', value: 'bar', lastModified: '...' };
const sqsEvent = createSQSEventFromDigest(digest);
await digestLambdaHandler(sqsEvent);
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on reporting issues, submitting pull requests, and adding new features.

## License

This project is dual-licensed under GPL-3.0 and MIT. For details, see [LICENSE](LICENSE) and [LICENSE-MIT](LICENSE-MIT).
