# SQS Digest Handler & CLI Documentation

**Configuration**

The `agentic-lib` library loads environment variables via dotenv. Supported variables:

- `OPENAI_API_KEY` (string): OpenAI API key.
- `GITHUB_API_BASE_URL` (string): Base URL for GitHub API (defaults to `https://api.github.com` or `.test` in development).

## Logging Utilities

Import structured JSON logging helpers:

```js
import { logConfig, logInfo, logError } from "@xn-intenton-z2a/agentic-lib";

// Logs configuration on import
logConfig();

// Log informational messages
logInfo("This is an info message");

// Log errors with optional Error object
logError("An error occurred", new Error("Failure"));
```

Each helper outputs a JSON object with:

- `level`: `"info"` or `"error"`
- `timestamp`: ISO timestamp
- `message`: descriptive text
- optional fields: `config`, `error`, `stack`, and `verbose` flags

## createSQSEventFromDigest(digest)

Generate an AWS SQS event with a single record:

```js
import { createSQSEventFromDigest } from "@xn-intenton-z2a/agentic-lib";

const digest = {
  key: "events/1.json",
  value: "12345",
  lastModified: new Date().toISOString(),
};
const sqsEvent = createSQSEventFromDigest(digest);
```

- `digest`: object with `key` (string), `value` (string), `lastModified` (ISO string)

**Returns:** AWS SQS event object:

```json
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:sqs",
      "eventTime": "2025-05-06T12:00:00.000Z",
      "eventName": "SendMessage",
      "body": "{\"key\":\"events/1.json\",\"value\":\"12345\",\"lastModified\":\"...\"}"
    }
  ]
}
```

## digestLambdaHandler(sqsEvent)

Lambda handler to process SQS events and report parsing failures:

```js
import { digestLambdaHandler } from "@xn-intenton-z2a/agentic-lib";

const response = await digestLambdaHandler(sqsEvent);
console.log(response);
// {
//   batchItemFailures: [...],
//   handler: "src/lib/main.digestLambdaHandler"
// }
```

- **Parameters:**
  - `sqsEvent` (object): AWS SQS event with `Records` array or a single record.
- **Returns:**
  - `batchItemFailures`: Array of objects with `itemIdentifier` for records that failed JSON parsing.
  - `handler`: string path of the handler.

**Behavior:**

- Logs each record’s digest with `logInfo`.
- Catches invalid JSON, logs via `logError` including raw message.
- Generates a fallback `itemIdentifier` if `messageId` is missing.
- Returns failed identifiers for AWS retry.

## CLI Entry Point

The library provides a CLI via the `main` function in `src/lib/main.js`. On startup, it logs configuration and processes flags:

- `--help`: Show usage instructions.
- `--version`: Display version info and timestamp.
- `--digest`: Generate and process a sample digest event.

```bash
npx @xn-intenton-z2a/agentic-lib --help
```

**Usage output:**

```
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

Example version invocation:

```bash
npx @xn-intenton-z2a/agentic-lib --version
```

Output:

```json
{"version":"6.2.1-0","timestamp":"2025-05-06T12:00:00.002Z"}
```