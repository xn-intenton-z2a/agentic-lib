# agentic-lib

**agentic-lib** is a JavaScript library designed to power autonomous, agentic GitHub Actions workflows by providing reusable SDK-like functionality.

Links:
- [Mission Statement](../MISSION.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [License (MIT)](../LICENSE-MIT)
- [GitHub Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## Usage

Invoke the CLI using `npm start --` followed by a flag:

```bash
npm start -- --mission
```

Available flags:
- `--help`     Show this help message and usage instructions.
- `--digest`   Run a full bucket replay simulating an SQS event.
- `--version`  Show version information with current timestamp.
- `--mission`  Show the project mission statement.
- `--serve`    Start HTTP server mode exposing `/digest` endpoint.

## HTTP Server Mode

Start the HTTP server to expose the `/digest` endpoint:

```bash
node source/main.js --serve [--port <number>]
```

Default port is `3000` (or use `PORT` environment variable).

Example request:

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"Records":[{"body":"{ \"key\": \"value\" }"}]}'
```

Response format:

```json
{ "batchItemFailures": [] }
```

## Utility Functions

The library exposes utility functions for constructing and invoking SQS Lambda handlers directly from code.

```js
import { createSQSEventFromDigest, digestLambdaHandler } from "./source/main.js";

// Create a sample digest object
const sampleDigest = {
  key: "events/1.json",
  value: "12345",
  lastModified: new Date().toISOString(),
};

// Construct an SQS event
const sqsEvent = createSQSEventFromDigest(sampleDigest);
console.log(sqsEvent);
// {
//   Records: [
//     {
//       eventVersion: "2.0",
//       eventSource: "aws:sqs",
//       eventTime: "2025-01-01T00:00:00.000Z",
//       eventName: "SendMessage",
//       body: JSON.stringify(sampleDigest)
//     }
//   ]
// }

// Directly invoke the Lambda handler
(async () => {
  const result = await digestLambdaHandler(sqsEvent);
  console.log(result);
  // { batchItemFailures: [], handler: "src/lib/main.digestLambdaHandler" }
})();
```