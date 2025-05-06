# SQS Digest Handler & CLI Documentation

This document provides detailed information on the core capabilities of `agentic-lib`, including structured logging, AWS SQS event generation, Lambda handlers, and CLI usage.

## Logging Utilities

You can import and use structured JSON logging helpers to standardize logs across your application:

```js
import { logConfig, logInfo, logError } from "@xn-intenton-z2a/agentic-lib";

// Automatically logs loaded configuration on import
logConfig();

// Log informational messages
logInfo("This is an informational message");

// Log errors with optional error object
logError("An error occurred", new Error("Something went wrong"));
```

Each helper outputs a JSON object with fields such as:

- `level`: `info` or `error`
- `timestamp`: ISO 8601 timestamp
- `message`: descriptive text
- optional fields: `config`, `error`, `stack`, `verbose` flags

## createSQSEventFromDigest(digest)

Generates an AWS SQS event containing a single record from a digest object:

```js
import { createSQSEventFromDigest } from "@xn-intenton-z2a/agentic-lib";

const digest = {
  key: "events/1.json",
  value: "12345",
  lastModified: new Date().toISOString(),
};
const sqsEvent = createSQSEventFromDigest(digest);
```

- `digest` (object): must include:
  - `key` (string)
  - `value` (string)
  - `lastModified` (ISO timestamp string)

**Returns:** An object matching the AWS SQS event schema with one record.

## digestLambdaHandler(sqsEvent)

Lambda handler function to process SQS events containing digest messages and report parsing failures:

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
  - `sqsEvent` (object): AWS SQS event with one or more `Records`.
- **Returns:**
  - `batchItemFailures`: Array of `{ itemIdentifier }` for records that failed JSON parsing.
  - `handler`: string identifier for the handler path.

**Behavior:**

- Logs each record’s digest data with `logInfo`.
- Catches invalid JSON payloads, logs an error via `logError` (including raw message), and generates a fallback `itemIdentifier` when `messageId` is missing.
- Returns failed record identifiers so AWS SQS can retry them.

## CLI Entry Point

The library exposes a CLI via the `main` function in `src/lib/main.js`. On startup, it invokes `logConfig` to log the loaded configuration, then processes one of the following flags:

- `--help`: Show usage instructions.
- `--digest`: Generate and process a sample digest event.
- `--version`: Display version information and timestamp in JSON.

### Usage Examples

```bash
# Show help
npx agentic-lib --help
```
```
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
```

```bash
# Simulate digest processing
npx agentic-lib --digest
```
**Example Output:**
```json
{ "level": "info", "timestamp": "2025-05-06T12:00:00.000Z", "message": "Configuration loaded", "config": {} }
{ "level": "info", "timestamp": "2025-05-06T12:00:00.001Z", "message": "Digest Lambda received event: {...}" }
```

```bash
# Show version information
npx agentic-lib --version
```
**Example Output:**
```json
{ "level": "info", "timestamp": "2025-05-06T12:00:00.000Z", "message": "Configuration loaded", "config": {} }
{ "version": "6.2.1-0", "timestamp": "2025-05-06T12:00:00.002Z" }
```

## See Also

- [Programmatic Usage](../README.md)
- [Contributing Guide](../../CONTRIBUTING.md)

