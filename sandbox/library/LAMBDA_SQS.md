# LAMBDA_SQS

## Crawl Summary
Lambda polls SQS queues and invokes function synchronously with batches of up to 10 messages by default. Visibility timeout hides messages until success or timeout expiry. On success, Lambda deletes all batch messages; on failure all return to queue. Configure BatchSize 1–10, MaximumBatchingWindowInSeconds 0–300, ParallelizationFactor 1–10. Payload includes Records array with messageId, receiptHandle, body, attributes and messageAttributes. FIFO payload includes sequencing attributes. Enable partial batch response or use DeleteMessage API for fine-grained failure handling. Ensure idempotent code.

## Normalised Extract
Table of Contents
1 Polling Behavior
2 Batching Behavior
3 Visibility Timeout
4 Standard Queue Payload Fields
5 FIFO Queue Payload Fields
6 Batch Window Configuration
7 Error Handling and Idempotency
8 Partial Batch Failure

1 Polling Behavior
Lambda polls SQS every short interval and reads up to BatchSize messages (default 10). Poll begins immediately and repeats until invocation.

2 Batching Behavior
Invoke is triggered when any of:
- Collected messages equal BatchSize
- MaximumBatchingWindowInSeconds expires
- Payload size reaches 6 MB limit

3 Visibility Timeout
After poll, messages hidden for queue visibility timeout. On invoke success, Lambda deletes messages. On failure, messages reappear after timeout.

4 Standard Queue Payload Fields
Each record contains:
 messageId, receiptHandle, body,
 attributes: ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp
 messageAttributes per attribute: stringValue, stringListValues, binaryListValues, dataType
 md5OfBody, eventSource aws:sqs, eventSourceARN, awsRegion

5 FIFO Queue Payload Fields
Includes all standard fields plus attributes: SequenceNumber, MessageGroupId, MessageDeduplicationId

6 Batch Window Configuration
Parameter MaximumBatchingWindowInSeconds default 0 range 0–300. FIFO and Standard both use seconds. 500 ms default not configurable in SQS.

7 Error Handling and Idempotency
Default reprocessing on batch failure. Code must handle duplicate messages. Use idempotent updates or dedup table.

8 Partial Batch Failure
Set reportBatchItemFailures in mapping definition. Handler returns list of failed messageIds. Lambda deletes only succeeded items.

## Supplementary Details
Configuration options and defaults
- BatchSize: default 10, min 1, max 10
- MaximumBatchingWindowInSeconds: default 0, min 0, max 300
- ParallelizationFactor: default 1, min 1, max 10
- Enabled: default true
- BisectBatchOnFunctionError: default false
- MaximumRetryAttempts: default unlimited

Implementation Steps
1 Create SQS queue and note ARN and visibility timeout.
2 Create Lambda function and grant SQS invoke permission.
3 Create event source mapping via AWS CLI or SDK with parameters:
   • --event-source-arn <queue ARN>
   • --function-name <function name>
   • --batch-size 10
   • --maximum-batching-window-in-seconds 0
4 Deploy and verify SQS policy allows lambda:InvokeFunction


## Reference Details
API CreateEventSourceMapping (AWS CLI)
aws lambda create-event-source-mapping \
  --function-name MyFunction \
  --event-source-arn arn:aws:sqs:us-east-2:123456789012:my-queue \
  --enabled \
  --batch-size 10 \
  --maximum-batching-window-in-seconds 0 \
  --parallelization-factor 1

API CreateEventSourceMapping Parameters
EventSourceArn string true ARN of SQS queue
FunctionName string true Lambda function name or ARN
Enabled boolean false Enable polling mapping
BatchSize integer false 1–10 Default 10
MaximumBatchingWindowInSeconds integer false 0–300 Default 0
ParallelizationFactor integer false 1–10 Default 1
BisectBatchOnFunctionError boolean false Default false
MaximumRetryAttempts integer false Default unlimited

Node.js SDK v3 Example
import { LambdaClient, CreateEventSourceMappingCommand } from '@aws-sdk/client-lambda'
const client = new LambdaClient({ region: 'us-east-2' })
const cmd = new CreateEventSourceMappingCommand({
  EventSourceArn: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
  FunctionName: 'MyFunction',
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 0
})
const response = await client.send(cmd)

Lambda Handler (Node.js)
exports.handler = async (event, context) => {
  for (const record of event.Records) {
    // process record.body
    // on success do nothing; Lambda auto deletes on success
    // on partial failure, collect failedIds and return { batchItemFailures: [{ itemIdentifier: record.messageId }] }
  }
  return {}
}

Partial Batch Failure Response
return { batchItemFailures: [ { itemIdentifier: 'messageId1' } ] }

Best Practice Code Snippet – DeleteMessage API
import { SQSClient, DeleteMessageCommand } from '@aws-sdk/client-sqs'
const sqsClient = new SQSClient({ region: 'us-east-2' })
for (const record of event.Records) {
  try {
    await process(record.body)
    await sqsClient.send(new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: record.receiptHandle
    }))
  } catch (err) {
    // log and continue
  }
}

Troubleshooting
Java Jackson NullPointer on Deserialization
Cause: default naming strategy lowercases first char of Records or eventSourceARN
Solution: annotate model class with @JsonProperty("Records") etc or set ObjectMapper propertyNamingStrategy to IDENTITY


## Information Dense Extract
Lambda polls SQS up to 10 msgs per batch; default batch window 0s; max window 300s; triggers when batch size met or window expires or payload 6MB; messages hidden for visibility timeout; on success deletes messages; on failure all reappear; ensure idempotent handler; enable reportBatchItemFailures or use DeleteMessage API; mapping params: BatchSize 1–10 default10; MaximumBatchingWindowInSeconds 0–300 default0; ParallelizationFactor1–10 default1; CLI create-event-source-mapping with function-name event-source-arn batch-size maximum-batching-window-in-seconds; Node.js SDK create mapping with CreateEventSourceMappingCommand; handler returns batchItemFailures for partial failures; Java deserialization fix with @JsonProperty or IDENTITY namingStrategy

## Sanitised Extract
Table of Contents
1 Polling Behavior
2 Batching Behavior
3 Visibility Timeout
4 Standard Queue Payload Fields
5 FIFO Queue Payload Fields
6 Batch Window Configuration
7 Error Handling and Idempotency
8 Partial Batch Failure

1 Polling Behavior
Lambda polls SQS every short interval and reads up to BatchSize messages (default 10). Poll begins immediately and repeats until invocation.

2 Batching Behavior
Invoke is triggered when any of:
- Collected messages equal BatchSize
- MaximumBatchingWindowInSeconds expires
- Payload size reaches 6 MB limit

3 Visibility Timeout
After poll, messages hidden for queue visibility timeout. On invoke success, Lambda deletes messages. On failure, messages reappear after timeout.

4 Standard Queue Payload Fields
Each record contains:
 messageId, receiptHandle, body,
 attributes: ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp
 messageAttributes per attribute: stringValue, stringListValues, binaryListValues, dataType
 md5OfBody, eventSource aws:sqs, eventSourceARN, awsRegion

5 FIFO Queue Payload Fields
Includes all standard fields plus attributes: SequenceNumber, MessageGroupId, MessageDeduplicationId

6 Batch Window Configuration
Parameter MaximumBatchingWindowInSeconds default 0 range 0300. FIFO and Standard both use seconds. 500 ms default not configurable in SQS.

7 Error Handling and Idempotency
Default reprocessing on batch failure. Code must handle duplicate messages. Use idempotent updates or dedup table.

8 Partial Batch Failure
Set reportBatchItemFailures in mapping definition. Handler returns list of failed messageIds. Lambda deletes only succeeded items.

## Original Source
AWS Lambda & SQS Integration
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of LAMBDA_SQS

# Polling and Batching Behavior for SQS Event Source Mappings

Default Polling and Invocation
  • Lambda polls standard queues up to BatchSize messages per invoke (default 10).  
  • Default MaximumBatchingWindowInSeconds is 0 seconds; range 0–300 seconds.  
  • For FIFO queues configuration is identical; payload includes sequencing attributes.

Visibility Timeout Interaction
  • Messages remain hidden for the configured SQS visibility timeout after polling.  
  • On full batch success, Lambda deletes messages.  
  • On any error, all batch messages reappear after visibility timeout unless BatchItemFailures handling is used.

Event Payload Structure (Standard Queue)
  Records array of objects with fields:  
    messageId  receiptHandle  body  attributes object with ApproximateReceiveCount SentTimestamp SenderId ApproximateFirstReceiveTimestamp  messageAttributes map of attributeName to { stringValue stringListValues binaryListValues dataType }  md5OfBody  eventSource aws:sqs  eventSourceARN ARN string  awsRegion region string

Event Payload Structure (FIFO Queue)
  Records array as above plus attributes SequenceNumber MessageGroupId MessageDeduplicationId

Configuration Parameters for SQS Event Source Mapping
  • EventSourceArn (required)  
  • FunctionName (required)  
  • Enabled (default true)  
  • BatchSize default 10  range 1–10  
  • MaximumBatchingWindowInSeconds default 0  range 0–300  
  • ParallelizationFactor default 1  range 1–10  
  • BisectBatchOnFunctionError default false  
  • MaximumRetryAttempts default unlimited

Error Handling and Duplicate Processing
  • Lambda event source mappings process at least once.  
  • Ensure idempotent function code.  
  • Enable partial batch response to surface individual message failures.  
  • Alternatively, call SQS DeleteMessage API within function for each successfully processed message.

Java Deserialization Note
  • JSON mapper may convert Record and eventSourceARN casing.  
  • Use explicit annotations or propertyNamingStrategy to preserve field case.

## Attribution
- Source: AWS Lambda & SQS Integration
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: Public Domain (AWS documentation)
- Crawl Date: 2025-05-06T03:33:34.957Z
- Data Size: 1006329 bytes
- Links Found: 2521

## Retrieved
2025-05-06
