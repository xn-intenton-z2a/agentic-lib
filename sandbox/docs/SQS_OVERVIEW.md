# Deep Dive: SQS Overview

## Mission Alignment

The SQS utilities support robust, event-driven architectures and automated message processing, empowering continuous, autonomous agentic workflows. For mission details, see [Mission Statement](../MISSION.md).

A comprehensive guide to Amazon SQS features, configuration, and best practices.

## 1. Encryption Options

Default SSE-SQS managed encryption  
SSE-KMS custom KMS key: specify `KmsMasterKeyId` = key ARN or alias

## 2. Queue Types and Delivery Semantics

- **Standard**: at-least-once, unlimited requests/sec  
- **FIFO**: exactly-once, high-throughput mode, ordering

## 3. Message Retention Configuration

SetQueueAttributes Attributes:  
`MessageRetentionPeriod`: integer, 60 to 1,209,600  
Default: 345,600

## 4. Visibility Timeout and Message Lifecycle

ReceiveMessage hides message for `VisibilityTimeout`  
DeleteMessage removes message permanently  
`VisibilityTimeout`: seconds (0 to 43,200)

## 5. Large Message Handling

Max payload: 256 KB  
Use S3 or DynamoDB for >256 KB, SQS stores pointer only

## 6. Dead-Letter Queue Configuration

On source queue:  
```json
{
  "RedrivePolicy": {
    "deadLetterTargetArn": "<DLQ_ARN>",
    "maxReceiveCount": "<count>"
  }
}
```
On DLQ:  
```json
{
  "RedriveAllowPolicy": {
    "allowPolicyType": "allowAll" | "byQueue" | "denyAll",
    "queueArns": ["arn1", ...]
  }
}
```

## 7. Dead-Letter Queue Retention Behavior

- **Standard**: original enqueue timestamp applies  
- **FIFO**: timestamp resets on move  
- `ApproximateAgeOfOldestMessage` metric interpretation changes accordingly  

**Recommendation**: Set DLQ retention period longer than source queue retention.
