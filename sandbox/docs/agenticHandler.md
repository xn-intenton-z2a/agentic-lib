# SQS Digest Handler & CLI Documentation

This document provides detailed information on the core capabilities of `agentic-lib`, including structured logging, AWS SQS event generation, Lambda handlers, CLI usage, and AI-driven agentic workflows.

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

## agenticHandler(prompt, options)

Core AI-driven handler invoking OpenAI, parsing JSON responses, tracking usage, and estimating cost.

```js
async function agenticHandler(
  prompt: string,
  options?: {
    model?: string;
    costRates?: { promptTokens?: number; completionTokens?: number };
  }
): Promise<{
  result: object;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  cost: number;
}>;
```

**Parameters:**

- `prompt` (string): the input prompt for the AI.
- `options.model` (string): OpenAI model to use (default: `"gpt-4"`).
- `options.costRates` (object): Optional cost rates:
  - `promptTokens` (number, default `0.002`): cost per 1,000 prompt tokens.
  - `completionTokens` (number, default `0.0025`): cost per 1,000 completion tokens.

**Returns:**

- `result` (object): Parsed JSON response from the AI.
- `usage` (object): Token usage metrics:
  - `prompt_tokens`, `completion_tokens`, `total_tokens`.
- `cost` (number): Estimated cost based on usage and provided rates.

**Errors:**

Throws an `Error` if:

- `OPENAI_API_KEY` is missing or invalid.
- JSON parsing of AI response fails (error message includes raw response content).

**Usage Example:**

```js
import { agenticHandler } from "@xn-intenton-z2a/agentic-lib";

(async () => {
  const { result, usage, cost } = await agenticHandler("Summarize the commit history.");
  console.log(result);
  console.log(`Tokens used: ${usage.total_tokens}, cost: $${cost.toFixed(4)}`);
})();
```