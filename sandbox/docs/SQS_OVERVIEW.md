# SQS Utilities

## Mission Alignment

The SQS utilities in agentic-lib provide programmatic helpers to simulate, process, and handle AWS SQS events, supporting continuous, event-driven agentic workflows. For mission details, see [Mission Statement](../MISSION.md).

## Utilities Provided

- **createSQSEventFromDigest(digest)**  
  Generates an AWS SQS event wrapper for a given `digest` object. Useful for testing or simulating Lambda invocations.

- **digestLambdaHandler(sqsEvent)**  
  Processes SQS event records, parsing message bodies, logging successes and errors, and returning a `batchItemFailures` list for failed messages, aligning with AWS Lambda SQS batch failure handling.

## Usage Examples

### Creating an SQS Event

```js
import { createSQSEventFromDigest } from "@xn-intenton-z2a/agentic-lib";

const digest = {
  key: "events/1.json",
  value: "12345",
  lastModified: new Date().toISOString(),
};
const event = createSQSEventFromDigest(digest);
```

### Handling SQS Events in a Lambda Function

```js
import { digestLambdaHandler } from "@xn-intenton-z2a/agentic-lib";

export async function handler(event) {
  const result = await digestLambdaHandler(event);
  // Return result.batchItemFailures to SQS for retries of failed messages
  return { batchItemFailures: result.batchItemFailures };
}
```

## Error Handling

On JSON parse errors or invalid message bodies, the handler logs detailed errors and includes the failed record identifiers in `batchItemFailures`, allowing AWS SQS to retry processing.
