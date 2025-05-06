# LAMBDA_SQS

## Crawl Summary
Lambda polls SQS in batches of up to 10 messages (BatchSize 1–10, default=10), with an optional batch window (MaximumBatchingWindowInSeconds 0–300, default=0). Messages remain hidden for the visibility timeout and are deleted on full-batch success. On errors, entire batch is retried. For partial failures, enable ReportBatchItemFailures or call DeleteMessage manually. Low-traffic queues with a batch window may wait up to 20 seconds before invocation. Ensure idempotent handlers. FIFO queues include SequenceNumber, MessageGroupId, MessageDeduplicationId attributes.

## Normalised Extract
Table of Contents
1 Polling Behavior
2 Batching Parameters
3 Error Handling and Idempotency
4 Partial Batch Failure Handling
5 Event Payload Structures

1 Polling Behavior
Lambda continuously polls the SQS queue. Default concurrency: up to 10 messages per poll. Visibility timeout on the queue determines message hiding period. Successful processing triggers automatic DeleteMessage for each record.

2 Batching Parameters
BatchSize: 1–10, default=10
MaximumBatchingWindowInSeconds: 0–300 seconds, default=0
Minimum wait on low traffic with batch window: 20 seconds
Invocation triggers: batch size reached OR batch window expired OR total payload size ≥ 6 MB.

3 Error Handling and Idempotency
Lambda retries entire batch on any error. Duplicate delivery at least once. Implement idempotent processing (dedupe on messageId or use messageAttributes).

4 Partial Batch Failure Handling
Enable ReportBatchItemFailures = true. Handler must return {batchItemFailures:[{itemIdentifier:messageId},…]}. Lambda deletes only succeeded messages.
Manual deletion: import AWS.SQS, call deleteMessage({QueueUrl, ReceiptHandle}) per record.

5 Event Payload Structures
Standard queue: Records[].attributes includes ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp
FIFO queue adds attributes: SequenceNumber, MessageGroupId, MessageDeduplicationId

## Supplementary Details
Region and Account: Function and queue must be in same AWS Region (cross-account supported with resource policy on queue).
FIFO Queue Naming: name must end with .fifo, dedupe scope: per MessageDeduplicationId or content-based deduplication.
Visibility Timeout: configure queue visibility timeout > function timeout to avoid duplicate processing mid-invoke.
IAM Permissions:
  lambda:CreateEventSourceMapping
  lambda:ListEventSourceMappings
  sqs:ReceiveMessage
  sqs:DeleteMessage
  sqs:GetQueueAttributes
Queue Redrive Policy: configure DeadLetterQueue with maxReceiveCount to handle poison messages.


## Reference Details
CreateEventSourceMapping API
Operation: lambda:CreateEventSourceMapping
Parameters:
  FunctionName (string, required)
  EventSourceArn (string, required)
  Enabled (boolean, default=true)
  BatchSize (integer, min=1, max=10, default=10)
  MaximumBatchingWindowInSeconds (integer, min=0, max=300, default=0)
  ReportBatchItemFailures (boolean, default=false)
  MaximumRetryAttempts (integer, default=2)
  ParallelizationFactor (integer, min=1, max=10, default=1)
Response fields:
  UUID (string)
  State (string)
  StateTransitionReason (string)

Example Node.js Handler with Partial Failures:
exports.handler = async event => {
  const failures = [];
  for (const record of event.Records) {
    try {
      await processRecord(record.body);
    } catch (err) {
      failures.push({itemIdentifier: record.messageId});
    }
  }
  return {batchItemFailures: failures};
};

AWS CLI Troubleshooting Commands:
aws lambda list-event-source-mappings --function-name my-function
aws logs tail /aws/lambda/my-function --since 1h
aws sqs get-queue-attributes --queue-url https://sqs.us-east-2.amazonaws.com/123456789012/my-queue --attribute-names VisibilityTimeout,ApproximateNumberOfMessages

Expected Outputs:
• list-event-source-mappings returns mapping UUID and configuration
• logs tail streams invocation logs and errors
• get-queue-attributes shows VisibilityTimeout matching > function timeout


## Information Dense Extract
Lambda-SQS: BatchSize=1–10 default=10; MaxBatchWindow=0–300s default=0; low-traffic min-wait=20s; invocation triggers: batch size reached OR window elapsed OR payload≥6MB; hidden message via visibility timeout; full-batch retry on error; enable ReportBatchItemFailures or manual DeleteMessage for partial success; idempotent handlers; standard payload fields: messageId, receiptHandle, body, attributes; FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId; CreateEventSourceMapping CLI/SDK parameters: FunctionName, EventSourceArn, BatchSize, MaximumBatchingWindowInSeconds, ReportBatchItemFailures, Enabled; IAM: lambda:CreateEventSourceMapping, sqs:ReceiveMessage, DeleteMessage; use DLQ redrive policy; troubleshooting via aws lambda list-event-source-mappings, aws logs tail, aws sqs get-queue-attributes.

## Sanitised Extract
Table of Contents
1 Polling Behavior
2 Batching Parameters
3 Error Handling and Idempotency
4 Partial Batch Failure Handling
5 Event Payload Structures

1 Polling Behavior
Lambda continuously polls the SQS queue. Default concurrency: up to 10 messages per poll. Visibility timeout on the queue determines message hiding period. Successful processing triggers automatic DeleteMessage for each record.

2 Batching Parameters
BatchSize: 110, default=10
MaximumBatchingWindowInSeconds: 0300 seconds, default=0
Minimum wait on low traffic with batch window: 20 seconds
Invocation triggers: batch size reached OR batch window expired OR total payload size  6 MB.

3 Error Handling and Idempotency
Lambda retries entire batch on any error. Duplicate delivery at least once. Implement idempotent processing (dedupe on messageId or use messageAttributes).

4 Partial Batch Failure Handling
Enable ReportBatchItemFailures = true. Handler must return {batchItemFailures:[{itemIdentifier:messageId},]}. Lambda deletes only succeeded messages.
Manual deletion: import AWS.SQS, call deleteMessage({QueueUrl, ReceiptHandle}) per record.

5 Event Payload Structures
Standard queue: Records[].attributes includes ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp
FIFO queue adds attributes: SequenceNumber, MessageGroupId, MessageDeduplicationId

## Original Source
AWS Lambda & SQS Integration
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of LAMBDA_SQS

# Polling and Batching Behavior

Lambda polls the configured SQS queue up to 10 messages at once (BatchSize default=10) and invokes the function synchronously. Messages are hidden for the duration of the queue’s visibility timeout. If the function succeeds for all records, Lambda issues DeleteMessage on each receiptHandle. On any error, all batch messages reappear when the visibility timeout expires. Configure idempotent code or ReportBatchItemFailures to handle partial failures.

# Event Payload Examples

## Standard Queue Message Event

{
  "Records": [
    {
      "messageId": "059f36b4-...",
      "receiptHandle": "AQEBwJnKyr...",
      "body": "Test message.",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1545082649183",
        "SenderId": "AIDAIENQZJOLO23YVJ4VO",
        "ApproximateFirstReceiveTimestamp": "1545082649185"
      },
      "messageAttributes": {
        "myAttribute": {"stringValue": "myValue","dataType": "String"}
      },
      "md5OfBody": "e4e68fb7bd...",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
      "awsRegion": "us-east-2"
    }
  ]
}

## FIFO Queue Message Event

{
  "Records": [
    {
      "messageId": "11d6ee51-...",
      "receiptHandle": "AQEBBX8nes...",
      "body": "Test message.",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1573251510774",
        "SequenceNumber": "18849496460467696128",
        "MessageGroupId": "1",
        "MessageDeduplicationId": "1"
      },
      "messageAttributes": {},
      "md5OfBody": "e4e68fb7bd...",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:fifo.fifo",
      "awsRegion": "us-east-2"
    }
  ]
}

# Configuration Parameters

- BatchSize (integer): minimum=1, maximum=10, default=10
- MaximumBatchingWindowInSeconds (integer): 0–300, default=0
- ReportBatchItemFailures (boolean): false
- Enabled (boolean): true

# CLI Example

aws lambda create-event-source-mapping  \
  --function-name my-function  \
  --event-source-arn arn:aws:sqs:us-east-2:123456789012:my-queue  \
  --batch-size 10  \
  --maximum-batching-window-in-seconds 60  \
  --report-batch-item-failures

# SDK v3 Example (TypeScript)

import {LambdaClient, CreateEventSourceMappingCommand} from "@aws-sdk/client-lambda";
const client = new LambdaClient({region: "us-east-2"});
const command = new CreateEventSourceMappingCommand({
  FunctionName: "my-function",
  EventSourceArn: "arn:aws:sqs:us-east-2:123456789012:my-queue",
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 60,
  ReportBatchItemFailures: true
});
const response = await client.send(command);


## Attribution
- Source: AWS Lambda & SQS Integration
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: Public Domain (AWS documentation)
- Crawl Date: 2025-05-06T06:30:48.331Z
- Data Size: 1269184 bytes
- Links Found: 3144

## Retrieved
2025-05-06
