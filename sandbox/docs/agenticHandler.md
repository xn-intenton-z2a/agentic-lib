# SQS Digest Handler & CLI

This document describes how to generate SQS events from digest objects, process them with the Lambda handler, and use the CLI entrypoint provided by the library.

## Logging Utilities

The library exports helper functions for structured JSON logging:

```js
import { logConfig, logInfo, logError } from "@xn-intenton-z2a/agentic-lib";

// Automatically logs loaded configuration on import
logConfig();

// Log informational messages
logInfo("This is an informational message");

// Log errors with optional error object
logError("An error occurred", new Error("Something went wrong"));
```

These functions output JSON logs with fields such as `level`, `timestamp`, `message`, and optional `error` or `stack` information.

## createSQSEventFromDigest(digest)

Generates an AWS SQS event containing a single record:

```js
import { createSQSEventFromDigest } from "@xn-intenton-z2a/agentic-lib";

const digest = { key: "...", value: "...", lastModified: "..." };
const sqsEvent = createSQSEventFromDigest(digest);
```

- `digest` (object): The message payload with the fields:
  - `key` (string)
  - `value` (string)
  - `lastModified` (ISO timestamp string)

Returns an object matching the AWS SQS event schema with one record, for example:

```json
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:sqs",
      "eventTime": "2025-05-06T03:52:49.140Z",
      "eventName": "SendMessage",
      "body": "{ \"key\": \"...\", \"value\": \"...\", \"lastModified\": \"...\" }"
    }
  ]
}
```

## digestLambdaHandler(sqsEvent)

Lambda handler function to process SQS events with digests and report failures.

```js
import { digestLambdaHandler } from "@xn-intenton-z2a/agentic-lib";

const response = await digestLambdaHandler(sqsEvent);
console.log(response);
// { batchItemFailures: [...], handler: "src/lib/main.digestLambdaHandler" }
```

- `sqsEvent` (object): AWS SQS event.

Returns an object with:
- `batchItemFailures`: Array of `{ itemIdentifier }` for records that failed parsing.
- `handler`: String identifying the handler path.

### Behavior

- Logs each record's digest data in structured JSON format.
- Invalid JSON bodies are caught and logged as errors, including the raw message.
- If a record is missing a `messageId`, a fallback identifier is generated in the format `fallback-{index}-{timestamp}-{randomString}` to ensure retries.
- Reports failed records in `batchItemFailures` for SQS to attempt reprocessing.

## CLI Entry Point

The library provides a CLI interface via the `main` function. It supports the following flags:

- `--help`: Display usage instructions.
- `--digest`: Generate and process a sample digest event.
- `--version`: Display version and timestamp information in JSON.

### Usage

Using Node:
```bash
node src/lib/main.js --help
```

```plaintext
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

Or using npx:
```bash
npx agentic-lib --digest
```

### Simulate a Digest Processing

```bash
npx agentic-lib --digest
```

### Version Information

```bash
npx agentic-lib --version
```

Outputs:
```json
{
  "version": "6.2.1-0",
  "timestamp": "2025-05-06T03:52:49.140Z"
}
```