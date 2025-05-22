# SQS_LAMBDA

## Crawl Summary
Lambda polls SQS queues synchronously, up to BatchSize messages per batch, default BatchSize=10, MaximumBatchingWindowInSeconds=0 (0-300). Messages hidden for visibility timeout; on successful processing all messages deleted; on error entire batch reappears after visibility timeout unless ReportBatchItemFailures is enabled. Use DeleteMessage API for granular deletion. FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId. Configure batch window up to 5 minutes; low traffic may incur up to 20s wait. Make function idempotent. JVM JSON mappers require exact case fields.

## Normalised Extract
Table of Contents:
1 Polling and Batching Behavior
2 Standard Queue Event Structure
3 FIFO Queue Event Structure
4 Event Source Mapping Configuration
5 Partial Batch Failure Handling
6 IAM Role Requirements
7 Visibility Timeout vs Function Timeout
8 Java Deserialization Note

1 Polling and Batching Behavior
  Lambda polls up to 10 messages per request (BatchSize default 10, max 10).
  MaximumBatchingWindowInSeconds default 0s, configurable 0–300s.
  Batch sent when batch size reached, window expires, or payload 6MB limit reached.
  Low traffic with batch window <20s still waits up to 20s.

2 Standard Queue Event Structure
  Records: array of { messageId, receiptHandle, body, attributes, messageAttributes, md5OfBody, eventSource, eventSourceARN, awsRegion }.

3 FIFO Queue Event Structure
  Each record adds attributes.SequenceNumber, MessageGroupId, MessageDeduplicationId.

4 Event Source Mapping Configuration
  CreateEventSourceMappingRequest parameters: EventSourceArn, FunctionName, BatchSize, MaximumBatchingWindowInSeconds, ReportBatchItemFailures, Enabled.
  CLI: aws lambda create-event-source-mapping with same flags.

5 Partial Batch Failure Handling
  Enable ReportBatchItemFailures. In handler return { batchItemFailures: [ { itemIdentifier: record.messageId } ] } to avoid retrying successful messages.
  Without it, all messages in batch are retried after visibility timeout.

6 IAM Role Requirements
  Execution role must allow sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes, sqs:ChangeMessageVisibility on target queue ARN.

7 Visibility Timeout vs Function Timeout
  Set SQS VisibilityTimeout > Lambda function timeout + 1s to avoid premature message visibility.

8 Java Deserialization Note
  Jackson JSON mapper is case-sensitive for "Records" and "eventSourceARN" fields or will return null.


## Supplementary Details
Region constraint: Lambda function and SQS queue must be in same region. Cross-account allowed if queue policy grants Lambda permission.

Queue types: standard and FIFO. FIFO queue names must end with .fifo.

FIFO deduplication: if MessageDeduplicationId not provided, queue uses content-based deduplication within 5min dedup window.

Batch window details per source type: for SQS default window=0s, for Kafka/MQ default=500ms.

Event source mapping states: Created, Enabled, Disabled; transitions indicated in CreateEventSourceMappingResponse.StateTransitionReason.

Filtering: not supported for SQS; use event filtering on invocation side.

Implementation steps:
1. Create SQS queue via console or aws sqs create-queue.
2. Deploy Lambda function with handler and correct IAM execution role.
3. Create event source mapping with aws lambda CLI or SDK.
4. Monitor via CloudWatch logs for /aws/lambda/FunctionName.

Best practice: make handler idempotent; handle partial failures; use ReportBatchItemFailures for large batches.


## Reference Details
AWS SDK for JavaScript v2 method signature:

lambda.createEventSourceMapping(params: CreateEventSourceMappingRequest, callback?: (err: AWSError, data: CreateEventSourceMappingResponse) => void): Request<CreateEventSourceMappingResponse,AWS.AWSError>

interface CreateEventSourceMappingRequest {
  EventSourceArn: string;
  FunctionName: string;
  Enabled?: boolean;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
  ReportBatchItemFailures?: boolean;
}

interface CreateEventSourceMappingResponse {
  UUID?: string;
  State?: string;
  StateTransitionReason?: string;
  LastModified?: Date;
  BatchSize?: number;
  MaximumBatchingWindowInSeconds?: number;
  FunctionArn?: string;
}

Code example Node.js handler with partial batch failure reporting:

exports.handler = async function(event) {
  const failures = [];
  for (const record of event.Records) {
    try {
      await processRecord(record);
    } catch (err) {
      failures.push({ itemIdentifier: record.messageId });
    }
  }
  if (failures.length) return { batchItemFailures: failures };
  return {};
};

AWS CLI create mapping example:

aws lambda create-event-source-mapping \
  --function-name MyFunction \
  --event-source-arn arn:aws:sqs:us-east-2:123456789012:my-queue \
  --batch-size 5 \
  --maximum-batching-window-in-seconds 30 \
  --report-batch-item-failures \
  --enabled

Troubleshooting:

Check mapping status:
aws lambda list-event-source-mappings --function-name MyFunction

Check CloudWatch for invocation errors:
aws logs filter-log-events --log-group-name /aws/lambda/MyFunction --start-time <ms> --filter-pattern "ERROR"

Check queue attributes:
aws sqs get-queue-attributes --queue-url https://sqs.us-east-2.amazonaws.com/123456789012/my-queue --attribute-names VisibilityTimeout,ApproximateNumberOfMessages

If messages stuck, increase VisibilityTimeout or inspect handler performance.


## Information Dense Extract
BatchSize default=10 max=10. MaximumBatchingWindowInSeconds range=0–300s default=0s. Lambda polls synchronously, hides messages for visibility timeout. On success deletes batch; on error full batch reappears unless ReportBatchItemFailures enabled. Use CLI aws lambda create-event-source-mapping with flags: --batch-size, --maximum-batching-window-in-seconds, --report-batch-item-failures. SDK createEventSourceMapping params include EventSourceArn, FunctionName, BatchSize, MaximumBatchingWindowInSeconds, ReportBatchItemFailures. Handler returns {batchItemFailures:[{itemIdentifier:messageId}]}. IAM role needs sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes, sqs:ChangeMessageVisibility. FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId; names end in .fifo. VisibilityTimeout > functionTimeout+1s. Java JSON mapper case-sensitive for Records and eventSourceARN.

## Sanitised Extract
Table of Contents:
1 Polling and Batching Behavior
2 Standard Queue Event Structure
3 FIFO Queue Event Structure
4 Event Source Mapping Configuration
5 Partial Batch Failure Handling
6 IAM Role Requirements
7 Visibility Timeout vs Function Timeout
8 Java Deserialization Note

1 Polling and Batching Behavior
  Lambda polls up to 10 messages per request (BatchSize default 10, max 10).
  MaximumBatchingWindowInSeconds default 0s, configurable 0300s.
  Batch sent when batch size reached, window expires, or payload 6MB limit reached.
  Low traffic with batch window <20s still waits up to 20s.

2 Standard Queue Event Structure
  Records: array of { messageId, receiptHandle, body, attributes, messageAttributes, md5OfBody, eventSource, eventSourceARN, awsRegion }.

3 FIFO Queue Event Structure
  Each record adds attributes.SequenceNumber, MessageGroupId, MessageDeduplicationId.

4 Event Source Mapping Configuration
  CreateEventSourceMappingRequest parameters: EventSourceArn, FunctionName, BatchSize, MaximumBatchingWindowInSeconds, ReportBatchItemFailures, Enabled.
  CLI: aws lambda create-event-source-mapping with same flags.

5 Partial Batch Failure Handling
  Enable ReportBatchItemFailures. In handler return { batchItemFailures: [ { itemIdentifier: record.messageId } ] } to avoid retrying successful messages.
  Without it, all messages in batch are retried after visibility timeout.

6 IAM Role Requirements
  Execution role must allow sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes, sqs:ChangeMessageVisibility on target queue ARN.

7 Visibility Timeout vs Function Timeout
  Set SQS VisibilityTimeout > Lambda function timeout + 1s to avoid premature message visibility.

8 Java Deserialization Note
  Jackson JSON mapper is case-sensitive for 'Records' and 'eventSourceARN' fields or will return null.

## Original Source
AWS SQS & Lambda Integration
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of SQS_LAMBDA

# CreateEventSourceMapping API

Parameters and Types

CreateEventSourceMappingRequest:
- EventSourceArn (String) required
- FunctionName (String) required
- Enabled (Boolean) optional, default true
- BatchSize (Integer) optional, default 10, max 10 for SQS standard, max 10 for FIFO
- MaximumBatchingWindowInSeconds (Integer) optional, default 0, range 0–300
- ReportBatchItemFailures (Boolean) optional, default false

CreateEventSourceMappingResponse:
- UUID (String)
- State (String) e.g. "Enabled"
- StateTransitionReason (String)
- LastModified (Timestamp)

# AWS CLI Commands

Create mapping:

    aws lambda create-event-source-mapping \
      --function-name MyFunction \
      --event-source-arn arn:aws:sqs:us-east-2:123456789012:my-queue \
      --batch-size 10 \
      --maximum-batching-window-in-seconds 5 \
      --report-batch-item-failures \
      --enabled

Returns JSON with UUID, State, BatchSize, MaximumBatchingWindowInSeconds, FunctionArn

List mappings:

    aws lambda list-event-source-mappings \
      --function-name MyFunction

Delete mapping:

    aws lambda delete-event-source-mapping \
      --uuid 8e103f8e-6d21-4c58-b72e-EXAMPLE

# Event Payload Structures

Standard queue message event JSON schema:

Records: array of objects with fields:
- messageId: String
- receiptHandle: String
- body: String
- attributes: map[String,String]
- messageAttributes: map[String, { stringValue:String, stringListValues:Array, binaryListValues:Array, dataType:String }]
- md5OfBody: String
- eventSource: "aws:sqs"
- eventSourceARN: String
- awsRegion: String

FIFO queue adds attributes:
- SequenceNumber: String
- MessageGroupId: String
- MessageDeduplicationId: String

# Partial Batch Failure Handling

Lambda default retry: on failure all messages become visible after visibility timeout. To handle partial failures, include ReportBatchItemFailures flag and return response:

{
  batchItemFailures: [ { itemIdentifier: messageId } ]
}

# IAM Permissions for Lambda Pollers

Attach execution role with:
- sqs:ReceiveMessage
- sqs:DeleteMessage
- sqs:GetQueueAttributes
- sqs:ChangeMessageVisibility

# Visibility Timeout and Function Timeout

Queue visibility timeout must exceed Lambda function timeout by at least one second.

# Java Deserialization Note

JSON field names "Records" and "eventSourceARN" must match case exactly to avoid nulls in Jackson.


## Attribution
- Source: AWS SQS & Lambda Integration
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: AWS Documentation License
- Crawl Date: 2025-05-22T03:36:47.738Z
- Data Size: 1606847 bytes
- Links Found: 3647

## Retrieved
2025-05-22
