# SQS Digest Handler & CLI

This document describes how to generate SQS events from digest objects, process them with the Lambda handler, and use the CLI entrypoint provided by the library.

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

Returns an object matching the AWS SQS event schema with one record.

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
- Invalid JSON bodies are caught, logged as errors, and reported back in `batchItemFailures` for retry.

## CLI Entry Point

The library provides a CLI interface via the `main` function. It supports the following flags:

- `--help`: Display usage instructions.
- `--digest`: Generate and process a sample digest event.
- `--version`: Display version and timestamp.

### Usage

```bash
node src/lib/main.js --help
```

or using `npx`:

```bash
npx agentic-lib --version
```