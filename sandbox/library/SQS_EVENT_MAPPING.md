# SQS_EVENT_MAPPING

## Crawl Summary
Default BatchSize=10; MaximumBatchingWindowInSeconds=0s (0–300s) with 5min max buffering; SQS visibility timeout hides messages until deleted or timeout; Lambda deletes processed messages; on error entire batch reappears; configure ReportBatchItemFailures or DeleteMessage to isolate failures; FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId; low-traffic batch windows wait up to 20s.

## Normalised Extract
Table of Contents
1 PollingAndBatchingBehavior
2 SampleEventStructures
3 EventSourceMappingConfiguration
4 ErrorHandlingStrategies
5 FIFOQueueAttributes

1 PollingAndBatchingBehavior
Default BatchSize=10. MaximumBatchingWindowInSeconds: 0–300s. Batch triggers when BatchSize reached or window expired or payload≥6MB. Low-traffic queues: min wait=20s. VisibilityTimeout hides messages until deletion or timeout.

2 SampleEventStructures
Standard Queue: Records[].messageId, receiptHandle, body, attributes{ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp}, messageAttributes{stringValue,dataType}, md5OfBody, eventSource, eventSourceARN, awsRegion.

3 EventSourceMappingConfiguration
Parameters:
- EventSourceArn: string (required)
- FunctionName: string (required)
- Enabled: boolean (default true)
- BatchSize: integer (1–10)
- MaximumBatchingWindowInSeconds: integer (0–300)
- FunctionResponseTypes: ["ReportBatchItemFailures"] to support partial failures

4 ErrorHandlingStrategies
ReportBatchItemFailures: return {batchItemFailures:[receiptHandle1,...]}. DeleteMessage API: call DeleteMessage({QueueUrl, ReceiptHandle}) per message.

5 FIFOQueueAttributes
attributes include SequenceNumber:string, MessageGroupId:string, MessageDeduplicationId:string; md5OfBody; eventSourceARN suffix ".fifo".


## Supplementary Details
CreateEventSourceMapping via AWS SDK for JavaScript v3:
Client: const client=new LambdaClient({region});
Command: new CreateEventSourceMappingCommand({
  EventSourceArn: 'arn:aws:sqs:region:account-id:queue',
  FunctionName: 'myFunction',
  Enabled: true,
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 60,
  FunctionResponseTypes: ['ReportBatchItemFailures']
});
Invocation: client.send(cmd);

Console: AWS Lambda > Functions > myFunction > Configuration > Triggers > SQS > Add trigger. Configure batch size and batching window. Save.

Queue visibility timeout recommendation: at least function timeout + buffer. E.g., Function Timeout=30s, VisibilityTimeout=60s.

Permissions: Lambda execution role needs sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes on the queue resource.


## Reference Details
AWS SDK for JavaScript v3

import { LambdaClient, CreateEventSourceMappingCommand, UpdateEventSourceMappingCommand, DeleteEventSourceMappingCommand, GetEventSourceMappingCommand } from '@aws-sdk/client-lambda';

// Create mapping
const createParams = {
  EventSourceArn: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
  FunctionName: 'myLambdaFunction',
  Enabled: true,
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 60,
  FunctionResponseTypes: ['ReportBatchItemFailures']
};
const createCmd = new CreateEventSourceMappingCommand(createParams);
const createResp = await client.send(createCmd);
// Response: {UUID:string, State:string, LastModified:Date, BatchSize:number, MaximumBatchingWindowInSeconds:number, FunctionArn:string, EventSourceArn:string, FilterCriteria?:object}

// Update mapping
const updateCmd = new UpdateEventSourceMappingCommand({UUID:createResp.UUID, BatchSize:5, Enabled:false});
const updateResp = await client.send(updateCmd);

// Delete mapping
const deleteCmd = new DeleteEventSourceMappingCommand({UUID:createResp.UUID});
await client.send(deleteCmd);

// Troubleshooting:
// AWS CLI commands:
// aws lambda create-event-source-mapping --function-name myLambdaFunction --event-source-arn arn:aws:sqs:... --batch-size 10 --maximum-batching-window-in-seconds 60 --function-response-types ReportBatchItemFailures
// aws lambda get-event-source-mapping --uuid <UUID>
// aws lambda delete-event-source-mapping --uuid <UUID>
// Expected get-event-source-mapping output includes State: Enabled, BatchSize, MaximumBatchingWindowInSeconds.
// CloudWatch Logs: /aws/lambda/myLambdaFunction for error stack traces. Ensure visibility timeout > function timeout + retry buffer.


## Information Dense Extract
BatchSize=10(default,1–10); MaximumBatchingWindowInSeconds=0–300(default0,low-traffic wait20s,max5m); triggers when size, window or payload≥6MB. VisibilityTimeout hides msgs; errors reappear unless ReportBatchItemFailures or DeleteMessage used. FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId. SDKv3: new CreateEventSourceMappingCommand({EventSourceArn,FunctionName,Enabled,BatchSize,MaximumBatchingWindowInSeconds,FunctionResponseTypes:['ReportBatchItemFailures']}); client.send(cmd). Permissions: sqs:ReceiveMessage,DeleteMessage,GetQueueAttributes. CLI and code patterns for create, update, delete, get mapping. Troubleshoot via aws lambda get-event-source-mapping and CloudWatch Logs.

## Sanitised Extract
Table of Contents
1 PollingAndBatchingBehavior
2 SampleEventStructures
3 EventSourceMappingConfiguration
4 ErrorHandlingStrategies
5 FIFOQueueAttributes

1 PollingAndBatchingBehavior
Default BatchSize=10. MaximumBatchingWindowInSeconds: 0300s. Batch triggers when BatchSize reached or window expired or payload6MB. Low-traffic queues: min wait=20s. VisibilityTimeout hides messages until deletion or timeout.

2 SampleEventStructures
Standard Queue: Records[].messageId, receiptHandle, body, attributes{ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp}, messageAttributes{stringValue,dataType}, md5OfBody, eventSource, eventSourceARN, awsRegion.

3 EventSourceMappingConfiguration
Parameters:
- EventSourceArn: string (required)
- FunctionName: string (required)
- Enabled: boolean (default true)
- BatchSize: integer (110)
- MaximumBatchingWindowInSeconds: integer (0300)
- FunctionResponseTypes: ['ReportBatchItemFailures'] to support partial failures

4 ErrorHandlingStrategies
ReportBatchItemFailures: return {batchItemFailures:[receiptHandle1,...]}. DeleteMessage API: call DeleteMessage({QueueUrl, ReceiptHandle}) per message.

5 FIFOQueueAttributes
attributes include SequenceNumber:string, MessageGroupId:string, MessageDeduplicationId:string; md5OfBody; eventSourceARN suffix '.fifo'.

## Original Source
AWS Lambda & SQS Integration with AWS SDK for JavaScript v3
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of SQS_EVENT_MAPPING

# Polling and Batching Behavior

Data Size: 1272100 bytes
Retrieved: 2024-06-21
Source: AWS Lambda Developer Guide (Using Lambda with Amazon SQS)

With Amazon SQS event source mappings, Lambda polls up to 10 messages per batch by default. You can buffer records for up to 5 minutes by setting MaximumBatchingWindowInSeconds to any value from 0 to 300 seconds. When using a batch window on low-traffic queues, Lambda may wait up to 20 seconds even if you set a lower window.

Lambda hides messages in the queue for the duration of the queue’s visibility timeout. If the function processes the batch successfully, Lambda deletes the messages. On function error, messages become visible again after the visibility timeout. For idempotency, code must handle duplicate deliveries or use BatchItemFailures or DeleteMessage API.

# Sample Standard Queue Event Structure
```json
{
  "Records": [
    {
      "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
      "receiptHandle": "AQEBwJnKyrHigUMZj6...",
      "body": "Test message.",
      "attributes": {"ApproximateReceiveCount":"1","SentTimestamp":"1545082649183","SenderId":"AIDAIENQZJOLO23YVJ4VO","ApproximateFirstReceiveTimestamp":"1545082649185"},
      "messageAttributes": {"myAttribute":{"stringValue":"myValue","dataType":"String"}},
      "md5OfBody":"e4e68fb7bd0e697a0ae8f1bb342846b3",
      "eventSource":"aws:sqs",
      "eventSourceARN":"arn:aws:sqs:us-east-2:123456789012:my-queue",
      "awsRegion":"us-east-2"
    }
  ]
}
```

# Sample FIFO Queue Event Additions

For FIFO queues, Records[].attributes include SequenceNumber, MessageGroupId, MessageDeduplicationId.

# Event Source Mapping Parameters
- BatchSize (integer, default 10, max 10 for SQS)
- MaximumBatchingWindowInSeconds (integer, 0–300, default 0)
- Enabled (boolean, default true)
- FunctionResponseTypes (list, e.g., ["ReportBatchItemFailures"])

# Error Handling

To avoid redriving entire batches on single failures, configure ReportBatchItemFailures. Return a response object with batchItemFailures: ["receiptHandle1"]. Or call DeleteMessage for each message on success.

# Idempotency Recommendation

Process each message at least once; ensure business logic handles duplicates. Use DeduplicationId for FIFO or idempotency keys in your payload.


## Attribution
- Source: AWS Lambda & SQS Integration with AWS SDK for JavaScript v3
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: Apache License 2.0
- Crawl Date: 2025-05-11T07:57:33.241Z
- Data Size: 1272100 bytes
- Links Found: 3151

## Retrieved
2025-05-11
