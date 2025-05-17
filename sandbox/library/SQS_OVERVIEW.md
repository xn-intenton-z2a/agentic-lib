# SQS_OVERVIEW

## Crawl Summary
SSE-SQS default encryption; SSE-KMS custom key support. Standard queues deliver at least once; FIFO queues guarantee exactly-once and support high-throughput. MessageRetentionPeriod default 345600s, range 60–1209600s via SetQueueAttributes. VisibilityTimeout controls in-flight message invisibility and deletion via DeleteMessage. Payloads >256KB offloaded to S3 or DynamoDB pointers. Dead-letter queues require RedrivePolicy with deadLetterTargetArn and maxReceiveCount; DLQ policies via RedriveAllowPolicy (allowAll, byQueue up to 10 ARNs, denyAll). DLQ retention for standard queues based on original timestamp; for FIFO resets on move; ensure DLQ retention > source retention.

## Normalised Extract
Table of Contents:
1. Encryption Options
2. Queue Types and Delivery Semantics
3. Message Retention Configuration
4. Visibility Timeout and Message Lifecycle
5. Large Message Handling
6. Dead-Letter Queue Configuration
7. Dead-Letter Queue Retention Behavior

1. Encryption Options
Default SSE-SQS managed encryption
SSE-KMS custom KMS key: specify KmsMasterKeyId = key ARN or alias

2. Queue Types and Delivery Semantics
Standard: at-least-once, unlimited requests/sec
FIFO: exactly-once, high-throughput mode, ordering

3. Message Retention Configuration
SetQueueAttributes – Attributes:
  MessageRetentionPeriod: integer, 60 to 1,209,600
Default: 345,600

4. Visibility Timeout and Message Lifecycle
ReceiveMessage hides message for VisibilityTimeout
DeleteMessage removes message permanently
VisibilityTimeout: seconds (0 to 43,200)

5. Large Message Handling
Max payload: 256 KB
Use S3 or DynamoDB for >256 KB, SQS stores pointer only

6. Dead-Letter Queue Configuration
On source queue:
  RedrivePolicy: { "deadLetterTargetArn":"<DLQ_ARN>", "maxReceiveCount":"<count>" }
On DLQ:
  RedriveAllowPolicy: { "allowPolicyType":"allowAll" | "byQueue" | "denyAll", "queueArns":[arn1,…] }

7. Dead-Letter Queue Retention Behavior
Standard: original enqueue timestamp applies
FIFO: timestamp resets on move
ApproximateAgeOfOldestMessage metric interpretation changes accordingly
Recommendation: DLQ retention > source retention


## Supplementary Details
SetQueueAttributes CLI example:
aws sqs set-queue-attributes --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue \ 
  --attributes MessageRetentionPeriod=86400

CLI for Dead-Letter Queue association:
# Create DLQ
aws sqs create-queue --queue-name MyDLQ
DLQ_URL=$(aws sqs get-queue-url --queue-name MyDLQ --output text)
DLQ_ARN=$(aws sqs get-queue-attributes --queue-url $DLQ_URL --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

# Associate DLQ with source
aws sqs set-queue-attributes --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/MySourceQueue \ 
  --attributes RedrivePolicy='{"deadLetterTargetArn":"'$DLQ_ARN'","maxReceiveCount":"5"}'

# Configure DLQ allow policy for specific sources
aws sqs set-queue-attributes --queue-url $DLQ_URL \ 
  --attributes RedriveAllowPolicy='{"allowPolicyType":"byQueue","queueArns":["arn:aws:sqs:us-east-1:123456789012:MySourceQueue"]}'


## Reference Details
API: SetQueueAttributes
Parameters:
  QueueUrl (String) – URL of queue
  Attributes (Map<String,String>) –
    MessageRetentionPeriod: String (60–1209600)
    RedrivePolicy: JSON String { deadLetterTargetArn: String, maxReceiveCount: String }
    RedriveAllowPolicy: JSON String { allowPolicyType: String (allowAll|byQueue|denyAll), queueArns: [String] }

CLI behavior:
  Returns empty JSON on success: {}

Best Practices:
  Set maxReceiveCount > 1 for resilience
  Keep DLQ in same account and region
  Ensure DLQ retention period > source retention period

Troubleshooting:
  Check CloudWatch metric ApproximateAgeOfOldestMessage for DLQ
  Use aws sqs get-queue-attributes --attribute-names All to verify attributes
  Confirm RedriveAllowPolicy JSON syntax to avoid policy errors


## Information Dense Extract
SSE-SQS default or SSE-KMS via KmsMasterKeyId. Standard: at-least-once; FIFO: exactly-once+high-throughput. MessageRetentionPeriod=60–1209600s (default345600s) via SetQueueAttributes. VisibilityTimeout controls invisibility; DeleteMessage removes. Payload>256KB → S3/DynamoDB pointer. DLQ: define RedrivePolicy={deadLetterTargetArn,maxReceiveCount}. Control via RedriveAllowPolicy={allowPolicyType,queueArns}. Standard DLQ retention based on original timestamp; FIFO resets on move. Ensure DLQ retention>source retention.

## Sanitised Extract
Table of Contents:
1. Encryption Options
2. Queue Types and Delivery Semantics
3. Message Retention Configuration
4. Visibility Timeout and Message Lifecycle
5. Large Message Handling
6. Dead-Letter Queue Configuration
7. Dead-Letter Queue Retention Behavior

1. Encryption Options
Default SSE-SQS managed encryption
SSE-KMS custom KMS key: specify KmsMasterKeyId = key ARN or alias

2. Queue Types and Delivery Semantics
Standard: at-least-once, unlimited requests/sec
FIFO: exactly-once, high-throughput mode, ordering

3. Message Retention Configuration
SetQueueAttributes  Attributes:
  MessageRetentionPeriod: integer, 60 to 1,209,600
Default: 345,600

4. Visibility Timeout and Message Lifecycle
ReceiveMessage hides message for VisibilityTimeout
DeleteMessage removes message permanently
VisibilityTimeout: seconds (0 to 43,200)

5. Large Message Handling
Max payload: 256 KB
Use S3 or DynamoDB for >256 KB, SQS stores pointer only

6. Dead-Letter Queue Configuration
On source queue:
  RedrivePolicy: { 'deadLetterTargetArn':'<DLQ_ARN>', 'maxReceiveCount':'<count>' }
On DLQ:
  RedriveAllowPolicy: { 'allowPolicyType':'allowAll' | 'byQueue' | 'denyAll', 'queueArns':[arn1,] }

7. Dead-Letter Queue Retention Behavior
Standard: original enqueue timestamp applies
FIFO: timestamp resets on move
ApproximateAgeOfOldestMessage metric interpretation changes accordingly
Recommendation: DLQ retention > source retention

## Original Source
Amazon SQS Developer Guide
https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html

## Digest of SQS_OVERVIEW

# Amazon SQS Core Technical Details (retrieved 2024-06-18)

# Encryption Options

Default server-side encryption (SSE-SQS) using AWS-managed keys
Custom server-side encryption (SSE-KMS) using a KMS key ARN or alias

# Queue Types and Delivery Semantics

Standard queues: at-least-once message delivery, unlimited throughput
FIFO queues: exactly-once message processing, high-throughput mode

# Message Retention Configuration

Default retention period: 345,600 seconds (4 days)
Range: 60 seconds to 1,209,600 seconds (14 days)
API action: SetQueueAttributes
  • Attribute name: MessageRetentionPeriod
  • Value: integer (seconds)

# Visibility Timeout and Message Lifecycle

VisibilityTimeout: period during which received messages remain hidden
Producer sends message → message stored redundantly across SQS servers
Consumer receives message → message invisible for VisibilityTimeout
Consumer deletes message via DeleteMessage to remove from queue

# Large Message Handling

Maximum message payload: 256 KB
For payloads >256 KB:
  • Store content in Amazon S3 or DynamoDB
  • SQS holds pointer to S3 object or DynamoDB item
Alternatively split large payload into smaller messages

# Dead-Letter Queue Configuration

Prerequisite: create separate DLQ before association
Use SetQueueAttributes on source queue to set RedrivePolicy:
  • deadLetterTargetArn: ARN of DLQ
  • maxReceiveCount: integer before move to DLQ
Use RedriveAllowPolicy on DLQ to control source queues:
  • allowAll: default, all source queues permitted
  • byQueue: JSON list of up to 10 source queue ARNs
  • denyAll: no source queue permitted as DLQ

# Dead-Letter Queue Retention Behavior

Standard queues:
  • Retention based on original enqueue timestamp
  • ApproximateAgeOfOldestMessage reports age since initial send minus time in source queue
FIFO queues:
  • Enqueue timestamp resets on move to DLQ
  • ApproximateAgeOfOldestMessage reports age since moved to DLQ
Recommendation: DLQ retention period must exceed original queue retention period


## Attribution
- Source: Amazon SQS Developer Guide
- URL: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html
- License: License if known
- Crawl Date: 2025-05-17T15:27:25.710Z
- Data Size: 2790611 bytes
- Links Found: 4600

## Retrieved
2025-05-17
