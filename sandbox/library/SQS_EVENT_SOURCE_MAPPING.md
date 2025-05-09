# SQS_EVENT_SOURCE_MAPPING

## Crawl Summary
Lambda polls SQS queues, invokes functions with batches, deletes on success. Batching controlled by BatchSize (1–10), MaximumBatchingWindowInSeconds (0–300), and payload limit 6 MB. On errors, entire batch retries; use ReportBatchItemFailures or manual DeleteMessage. Key parameters: EventSourceArn, FunctionName, Enabled, BatchSize, MaximumBatchingWindowInSeconds, FunctionResponseTypes, MaximumConcurrency. Default floor batch window wait is 20 s for low traffic. Idempotent code required.

## Normalised Extract
Table of Contents:
1. Setup Event Source Mapping
2. Polling and Batching Behavior
3. Error Handling Strategies
4. SDK Configuration Parameters
5. IAM Permissions
6. Best Practice Code Patterns
7. Troubleshooting Procedures

1. Setup Event Source Mapping
Input parameters:
 EventSourceArn: ARN of SQS queue
 FunctionName: Lambda function name/ARN
 Enabled: true|false
 BatchSize: integer 1–10
 MaximumBatchingWindowInSeconds: integer 0–300
 FunctionResponseTypes: list ["ReportBatchItemFailures"]
 MaximumConcurrency: integer (optional)
 Use CreateEventSourceMapping API: method CreateEventSourceMappingCommand(input)

2. Polling and Batching Behavior
 Polls up to 10 messages per request
 VisibilityTimeout: queue-level (default 30s)
 Trigger invocation when BatchSize reached or window expired or payload ≥6MB
 When MaximumBatchingWindowInSeconds>0, minimum wait up to 20s in low traffic

3. Error Handling Strategies
 Default retry: all messages reappear after visibility timeout
 Option A: enable partial failure reporting via FunctionResponseTypes
 Option B: inside handler use DeleteMessage API upon individual successful process
 Handler must be idempotent

4. SDK Configuration Parameters
 AWS SDK for JavaScript v3:
  client: LambdaClient({ region })
  command: CreateEventSourceMappingCommand(input)

5. IAM Permissions
 lambda:CreateEventSourceMapping
 sqs:GetQueueUrl
 sqs:GetQueueAttributes
 lambda:InvokeFunction

6. Best Practice Code Patterns
 async handler(event):
  iterate Records
  skip already processed IDs
  process record
  mark processed
  return { batchItemFailures: [] }

7. Troubleshooting Procedures
 List mappings: aws lambda list-event-source-mappings --function-name <fn>
 Check DLQ configuration in SQS console
 Inspect CloudWatch logs for error stacks
 Adjust visibility timeout if repeated retries too fast


## Supplementary Details
Provisioned mode: set MaximumConcurrency to reserve pollers. Batch window increments of 1s. JSON attribute mapping in Java: annotate cased fields with @JsonProperty("Records"). Configure DLQ ARNs in CreateEventSourceMapping input DeadLetterConfig.TargetArn. Use AWS CLI:
 aws lambda create-event-source-mapping --event-source-arn <arn> --function-name <fn> --batch-size 5 --maximum-batching-window-in-seconds 60 --function-response-types ReportBatchItemFailures --dead-letter-config TargetArn=<dlqArn>


## Reference Details
API: CreateEventSourceMapping (Lambda)
Parameters:
 EventSourceArn String required
 FunctionName String required
 Enabled Boolean
 BatchSize Integer Minimum:1 Maximum:10
 MaximumBatchingWindowInSeconds Integer Min:0 Max:300
 FunctionResponseTypes List<String> valid: [ReportBatchItemFailures]
 MaximumConcurrency Integer Min:1
 DestinationConfig Object {OnSuccess{Destination:string},OnFailure{Destination:string}}
 DeadLetterConfig Object {TargetArn:string}
Return:
 UUID String
 State String (Creating, Enabled, etc.)
 LastModified DateTime
 FunctionArn String
 StartingPosition String (TRIM_HORIZON, LATEST) [for streams]

SDK Method Signature (Java):
 CreateEventSourceMappingRequest request = CreateEventSourceMappingRequest.builder()
     .eventSourceArn("arn:...")
     .functionName("MyFunction")
     .enabled(true)
     .batchSize(10)
     .maximumBatchingWindowInSeconds(30)
     .functionResponseTypes("ReportBatchItemFailures")
     .deadLetterConfig(DeadLetterConfig.builder().targetArn("arn:...").build())
     .build();
 CreateEventSourceMappingResponse response = lambdaClient.createEventSourceMapping(request);

Full Node.js Example:
```javascript
import { LambdaClient, CreateEventSourceMappingCommand } from '@aws-sdk/client-lambda';
(async ()=>{
  const client = new LambdaClient({ region:'us-east-2' });
  const params = {
    EventSourceArn:'arn:aws:sqs:us-east-2:123456789012:my-queue',
    FunctionName:'MyFunction',
    Enabled:true,
    BatchSize:10,
    MaximumBatchingWindowInSeconds:60,
    FunctionResponseTypes:['ReportBatchItemFailures'],
    DeadLetterConfig:{TargetArn:'arn:aws:sqs:us-east-2:123456789012:my-dlq'}
  };
  const cmd = new CreateEventSourceMappingCommand(params);
  const res = await client.send(cmd);
  console.log(res.UUID);
})();
```

Best Practice: Idempotent handler and partial failure:
```javascript
exports.handler = async event =>{
  const failures=[];
  for(const r of event.Records){
    try{ await processMessage(r); }
    catch(e){ failures.push({itemIdentifier:r.messageId}); }
  }
  return { batchItemFailures: failures };
};
```

Troubleshooting CLI Commands:
 aws lambda list-event-source-mappings --function-name MyFunction
 aws lambda update-event-source-mapping --uuid <uuid> --batch-size 5
 aws lambda delete-event-source-mapping --uuid <uuid>
 aws sqs get-queue-attributes --queue-url <url> --attribute-names All


## Information Dense Extract
EventSourceMapping: CreateEventSourceMapping API: EventSourceArn, FunctionName, Enabled, BatchSize(1–10), MaximumBatchingWindowInSeconds(0–300s, 1s increments), FunctionResponseTypes[ReportBatchItemFailures], MaximumConcurrency. Polls up to 10 msgs, visibility timeout (queue default). Triggers on size, time, payload≥6MB. Default window minimum wait=20s. Partial failures via Return {batchItemFailures:[{itemIdentifier:id}]}. Idempotent handler recommended. CLI: aws lambda create-event-source-mapping, list-, update-, delete-event-source-mapping. Java SDK builder: builder().eventSourceArn().functionName().batchSize().maximumBatchingWindowInSeconds().functionResponseTypes().deadLetterConfig().build(). Node.js v3: new CreateEventSourceMappingCommand(params) -> client.send(cmd). Permissions: lambda:CreateEventSourceMapping, sqs:GetQueueUrl, sqs:GetQueueAttributes, lambda:InvokeFunction. Troubleshoot: aws lambda list-event-source-mappings, aws sqs get-queue-attributes.

## Sanitised Extract
Table of Contents:
1. Setup Event Source Mapping
2. Polling and Batching Behavior
3. Error Handling Strategies
4. SDK Configuration Parameters
5. IAM Permissions
6. Best Practice Code Patterns
7. Troubleshooting Procedures

1. Setup Event Source Mapping
Input parameters:
 EventSourceArn: ARN of SQS queue
 FunctionName: Lambda function name/ARN
 Enabled: true|false
 BatchSize: integer 110
 MaximumBatchingWindowInSeconds: integer 0300
 FunctionResponseTypes: list ['ReportBatchItemFailures']
 MaximumConcurrency: integer (optional)
 Use CreateEventSourceMapping API: method CreateEventSourceMappingCommand(input)

2. Polling and Batching Behavior
 Polls up to 10 messages per request
 VisibilityTimeout: queue-level (default 30s)
 Trigger invocation when BatchSize reached or window expired or payload 6MB
 When MaximumBatchingWindowInSeconds>0, minimum wait up to 20s in low traffic

3. Error Handling Strategies
 Default retry: all messages reappear after visibility timeout
 Option A: enable partial failure reporting via FunctionResponseTypes
 Option B: inside handler use DeleteMessage API upon individual successful process
 Handler must be idempotent

4. SDK Configuration Parameters
 AWS SDK for JavaScript v3:
  client: LambdaClient({ region })
  command: CreateEventSourceMappingCommand(input)

5. IAM Permissions
 lambda:CreateEventSourceMapping
 sqs:GetQueueUrl
 sqs:GetQueueAttributes
 lambda:InvokeFunction

6. Best Practice Code Patterns
 async handler(event):
  iterate Records
  skip already processed IDs
  process record
  mark processed
  return { batchItemFailures: [] }

7. Troubleshooting Procedures
 List mappings: aws lambda list-event-source-mappings --function-name <fn>
 Check DLQ configuration in SQS console
 Inspect CloudWatch logs for error stacks
 Adjust visibility timeout if repeated retries too fast

## Original Source
AWS Lambda with SQS Triggers
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of SQS_EVENT_SOURCE_MAPPING

# SQS Event Source Mappings for AWS Lambda

## Overview

Use SQS queues as event sources for Lambda functions. Supports both standard and FIFO queues. Lambda polls queues, retrieves batches, and invokes functions synchronously. Functions must handle at-least-once delivery and potential duplicates.

## Specifications

### Polling Behavior
- Default polling concurrency: automatic scaling
- Messages per poll: up to `MaxNumberOfMessages` (default 10)
- Poll interval: immediate until batch conditions met
- Visibility Timeout: queue-level setting (default 30s)

### Batching
- BatchSize (`BatchSize` parameter): integer, 1–10 (standard), 1–10 (FIFO)
- MaximumBatchingWindowInSeconds: 0–300s (increments of 1s); default 0s
- Batch window default floor: 20s minimum wait when using batch window
- Invocation triggers when: BatchSize reached OR Window expired OR Payload ≥6 MB

### Error Handling
- Default: On error, all messages reappear after Visibility Timeout
- Idempotency must be ensured by function code
- Options: 
  - Report partial batch failures (`FunctionResponseTypes` includes `ReportBatchItemFailures`)
  - Manual deletion via `DeleteMessage` API

## SDK Method Signatures (Node.js v3)

```javascript
import { LambdaClient, CreateEventSourceMappingCommand } from '@aws-sdk/client-lambda';

const client = new LambdaClient({ region: 'us-east-2' });
const input = {
  EventSourceArn: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
  FunctionName: 'MyLambdaFunction',
  Enabled: true,
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 0,
  FunctionResponseTypes: ['ReportBatchItemFailures']
};
const command = new CreateEventSourceMappingCommand(input);
const response = await client.send(command);
```

## Configuration Parameters
- EventSourceArn (string) – ARN of SQS queue
- FunctionName (string) – Lambda function name or ARN
- Enabled (boolean) – enable/disable mapping
- BatchSize (integer) – records per batch
- MaximumBatchingWindowInSeconds (integer) – buffering window
- FunctionResponseTypes (list) – `ReportBatchItemFailures`
- MaximumConcurrency (integer, optional) – provisioned mode minimum concurrency

## IAM Permissions
- lambda:CreateEventSourceMapping
- sqs:GetQueueAttributes
- sqs:GetQueueUrl
- lambda:InvokeFunction

## Best Practices
1. Ensure idempotency in Lambda handler:

```javascript
exports.handler = async event => {
  for (const record of event.Records) {
    const id = record.messageId;
    if (await hasProcessed(id)) continue;
    await process(record);
    await markProcessed(id);
  }
  return { batchItemFailures: [] };
};
```

2. Use `ReportBatchItemFailures` to isolate failed messages.
3. Tune BatchSize and Window based on throughput.

## Troubleshooting

### Stuck Messages
1. Check Dead-Letter Queue configuration on SQS.
2. Inspect Lambda CloudWatch Logs for error patterns.
3. Use AWS CLI to describe mappings:

```bash
aws lambda list-event-source-mappings --function-name MyLambdaFunction
```  

### JSON Deserialization Errors in Java
- Ensure correct casing: use `@JsonProperty("Records")`



## Attribution
- Source: AWS Lambda with SQS Triggers
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: CC BY 4.0
- Crawl Date: 2025-05-09T23:01:06.812Z
- Data Size: 1293095 bytes
- Links Found: 3161

## Retrieved
2025-05-09
