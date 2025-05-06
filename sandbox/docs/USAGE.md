# Usage Guide

This document provides detailed instructions for installing, configuring, and using **agentic-lib** both via CLI and programmatically.

## Installation

Install the package via npm or yarn:

```bash
npm install @xn-intenton-z2a/agentic-lib
# or
yarn add @xn-intenton-z2a/agentic-lib
```

## CLI Commands

After installation, use the `agentic-lib` command:

### `--help`

Show the help message and available flags:

```bash
npx agentic-lib --help
```

### `--digest`

Simulate a full bucket replay by generating a sample digest event and processing it through the handler:

```bash
npx agentic-lib --digest
```

### `--version`

Display the current package version and timestamp:

```bash
npx agentic-lib --version
```

## Programmatic Usage

Import functions from the library in your Node.js application:

```js
import {
  createSQSEventFromDigest,
  digestLambdaHandler,
  logInfo,
  logError
} from '@xn-intenton-z2a/agentic-lib';

// Example: process a digest in code
async function processDigest() {
  const digest = {
    key: 'data/item123.json',
    value: 'payload-xyz',
    lastModified: new Date().toISOString()
  };
  const event = createSQSEventFromDigest(digest);

  try {
    const result = await digestLambdaHandler(event);
    logInfo(`Processing complete. Failures: ${result.batchItemFailures.length}`);
  } catch (error) {
    logError('Digest processing failed', error);
  }
}

processDigest();
```

## AWS Lambda Integration

To integrate with AWS Lambda and process real SQS events:

1. Deploy this library as part of your Lambda function bundle.
2. Set the handler to `src/lib/main.digestLambdaHandler` (or adjust path as needed).
3. Ensure environment variables `OPENAI_API_KEY` and `GITHUB_API_BASE_URL` are configured (if used).
4. AWS will invoke the handler with SQS event payloads:

```yaml
# Example AWS SAM or CloudFormation snippet
Resources:
  DigestFunction:
    Type: AWS::Lambda::Function
    Properties:
      Handler: dist/main.digestLambdaHandler
      Runtime: nodejs20.x
      Environment:
        Variables:
          OPENAI_API_KEY: "${OpenAIApiKey}"
          GITHUB_API_BASE_URL: "https://api.github.com/"
      Events:
        SQSTrigger:
          Type: SQS
          Properties:
            Queue: !GetAtt DigestQueue.Arn
```

## Configuration

agentic-lib uses `dotenv` to load environment variables in development. Add a `.env` file at the project root:

```env
OPENAI_API_KEY=your_openai_key_here
GITHUB_API_BASE_URL=https://api.github.com/
```

For tests or local development (`NODE_ENV=development`), default test values will be applied.

## Structured Logging

All logging functions (`logInfo`, `logError`, `logConfig`) output JSON-formatted logs including:

- `level`: Log level (`info` or `error`).
- `timestamp`: ISO 8601 timestamp.
- `message`: Descriptive message.
- `error` and `stack`: (for errors when verbose mode is enabled).

You can pipe or forward these logs to your monitoring or log aggregation system for better observability.
