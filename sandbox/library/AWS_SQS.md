# AWS_SQS

## Crawl Summary
Distributed queue architecture with redundant message storage, visibility timeout mechanism for message processing, configurable message retention period (60-1209600 seconds), DLQ configuration using redrive policy with maxReceiveCount and specific source queue ARNs, encryption (default SSE and custom KMS), integration with IAM for access control, scalability to handle spikes, and comparisons with Amazon SNS and Amazon MQ.

## Normalised Extract
Table of Contents:
1. BASIC_ARCHITECTURE
   - Producers, consumers, distributed queue across multiple SQS servers;
   - Redundant storage ensuring durability and high availability.
2. MESSAGE_LIFECYCLE
   - Producer sends message; message distributed redundantly.
   - Consumer receives message with visibility timeout; deletion after processing.
   - Automatic deletion after maximum message retention (default 4 days; configurable via SetQueueAttributes).
3. DEAD_LETTER_QUEUE
   - Requires creation of a separate DLQ; use redrive policy with parameters:
     * maxReceiveCount: number of retries allowed before moving message to DLQ.
     * redriveAllowPolicy: specifies allowed source queue ARNs (all, specific byQueue, or denyAll).
4. CONFIGURATION
   - SetQueueAttributes action to configure attributes:
     * MessageRetentionPeriod: permissible range 60 to 1209600 seconds.
     * Default delay and support for large messages (using S3/DynamoDB pointers).
5. SECURITY & ACCESS
   - Default server-side encryption (SSE) or custom key via AWS KMS.
   - IAM integration for controlling send/receive permissions.
6. SCALABILITY & AVAILABILITY
   - Transparent scaling; high availability via redundant infrastructure.
7. COMPARISON
   - Differences with Amazon SNS (fanout messaging) and Amazon MQ (legacy broker compatibility).

## Supplementary Details
Technical Specifications:
- SetQueueAttributes API:
  * Attribute: MessageRetentionPeriod
     Value: Integer between 60 and 1209600 (seconds)
  * Parameter: DelaySeconds (optional) to set default delay.
- Dead-Letter Queue Configuration:
  * Parameter: maxReceiveCount in redrive policy
     Effect: Moves message to DLQ once exceeded.
  * redriveAllowPolicy parameter for permissible source queues; up to 10 ARNs can be specified using byQueue option.
- Encryption:
  * Default: SQS managed SSE
  * Alternative: Custom SSE keys via AWS KMS.
- IAM policies: Full integration with AWS IAM to restrict send/receive actions; policies must specify correct ARNs and actions (e.g., sqs:SendMessage, sqs:ReceiveMessage, sqs:DeleteMessage).
- Troubleshooting:
  * Check CloudWatch metrics: ApproximateAgeOfOldestMessage for monitoring retention and DLQ delays.
  * Use AWS CLI command: aws sqs get-queue-attributes --queue-url <queue-url> --attribute-names All to verify configurations.
- Best Practices:
  * Configure DLQ in the same AWS account and Region as the source queue.
  * Set DLQ retention period longer than the source queue retention period.
  * For FIFO queues, understand that the enqueue timestamp resets when moved to DLQ.
  * Limit tags to maximum of 50 per queue and monitor tagging TPS (max 30 TPS).

## Reference Details
API Specifications and Implementation Details:
- API: SetQueueAttributes
  * Signature (AWS SDK for JavaScript v3 example):
      const params = {
          QueueUrl: string, // URL of the SQS queue
          Attributes: {
              'MessageRetentionPeriod': 'Integer (in seconds, between 60 and 1209600)',
              'DelaySeconds': 'Optional integer for default delay',
              // Additional attributes can include VisibilityTimeout, Policy, etc.
          }
      };
      const command = new SetQueueAttributesCommand(params);
      const response = await client.send(command);
  * Returns: Object with HTTPStatusCode and metadata.
  * Exceptions: throws error if parameters out of range or unauthorized.

- Dead-Letter Queue Configuration (using redrive policy):
  * RedrivePolicy JSON structure:
      {
         "maxReceiveCount": "Integer",
         "deadLetterTargetArn": "string (ARN of the dead letter queue)"
      }
  * Example configuration in AWS CLI:
      aws sqs set-queue-attributes --queue-url <SourceQueueURL> --attributes '{"RedrivePolicy":"{\"maxReceiveCount\":\"5\",\"deadLetterTargetArn\":\"<DLQ_ARN>\"}"}'

- Encryption Configuration:
  * Use AWS KMS keys by setting the KmsMasterKeyId attribute and enabling KmsDataKeyReusePeriodSeconds if needed.
  * Example: setting 'KmsMasterKeyId': 'alias/my-key' in the Attributes map.

- SDK Method Signatures (for multiple languages):
  * AWS SDK for Python (boto3):
      response = sqs.set_queue_attributes(
          QueueUrl='string',
          Attributes={
              'MessageRetentionPeriod': 'string',
              'DelaySeconds': 'string'
          }
      )
  * AWS SDK for Java: 
      SetQueueAttributesRequest request = new SetQueueAttributesRequest()
          .withQueueUrl(queueUrl)
          .addAttributesEntry("MessageRetentionPeriod", "<value>");
      sqsClient.setQueueAttributes(request);

- Troubleshooting Procedures:
  * Command: aws sqs get-queue-attributes --queue-url <queue-url> --attribute-names All
      Expected Output: JSON mapping of all configured attributes.
  * Monitoring metrics: Use CloudWatch to monitor ApproximateAgeOfOldestMessage and queue depth to identify issues.
  * Validate IAM policies using AWS IAM Policy Simulator.

- Best Practices Implementation:
  * Always configure DLQ in the same region as the source queue.
  * Set maxReceiveCount sufficiently high (e.g., 5 or more) to allow retry before moving to DLQ.
  * For large payloads, use S3 pointers to store message contents exceeding 256 KB.
  * Regularly audit IAM policies and queue tags (max 50 tags, case-sensitive, overwrite on duplicate key).

- Configuration Options:
  * MessageRetentionPeriod: default 345600 seconds (4 days), range 60 to 1209600 seconds.
  * DelaySeconds: optional, default 0 seconds if not set.
  * RedrivePolicy: must include maxReceiveCount and deadLetterTargetArn; if using byQueue, list up to 10 ARNs.

These specifications provide complete API methods, configuration, best practices, and troubleshooting steps to directly implement and manage Amazon SQS queues.

## Information Dense Extract
Distributed SQS architecture; messages redundantly stored; visibility timeout hides message during processing; DeleteMessage after consumption; SetQueueAttributes API configures MessageRetentionPeriod (60-1209600 sec), DelaySeconds, etc.; DLQ redrive policy with maxReceiveCount and deadLetterTargetArn; encryption via default SSE or AWS KMS (KmsMasterKeyId); IAM policies control sqs:SendMessage, ReceiveMessage, DeleteMessage; AWS CLI and SDK examples provided; CloudWatch metrics for troubleshooting; best practices include same-region DLQ, retention period settings, tag limits (max 50, 30 TPS).

## Sanitised Extract
Table of Contents:
1. BASIC_ARCHITECTURE
   - Producers, consumers, distributed queue across multiple SQS servers;
   - Redundant storage ensuring durability and high availability.
2. MESSAGE_LIFECYCLE
   - Producer sends message; message distributed redundantly.
   - Consumer receives message with visibility timeout; deletion after processing.
   - Automatic deletion after maximum message retention (default 4 days; configurable via SetQueueAttributes).
3. DEAD_LETTER_QUEUE
   - Requires creation of a separate DLQ; use redrive policy with parameters:
     * maxReceiveCount: number of retries allowed before moving message to DLQ.
     * redriveAllowPolicy: specifies allowed source queue ARNs (all, specific byQueue, or denyAll).
4. CONFIGURATION
   - SetQueueAttributes action to configure attributes:
     * MessageRetentionPeriod: permissible range 60 to 1209600 seconds.
     * Default delay and support for large messages (using S3/DynamoDB pointers).
5. SECURITY & ACCESS
   - Default server-side encryption (SSE) or custom key via AWS KMS.
   - IAM integration for controlling send/receive permissions.
6. SCALABILITY & AVAILABILITY
   - Transparent scaling; high availability via redundant infrastructure.
7. COMPARISON
   - Differences with Amazon SNS (fanout messaging) and Amazon MQ (legacy broker compatibility).

## Original Source
AWS SQS Developer Guide
https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html

## Digest of AWS_SQS

# AWS SQS Developer Guide

# BASIC ARCHITECTURE

- Distributed messaging system components: producers, consumers, and a queue distributed across multiple SQS servers.
- Messages are stored redundantly to ensure durability and high availability.

# MESSAGE LIFECYCLE

- Producer sends a message which is redundantly distributed across SQS servers.
- Consumer receives the message; during processing, the message remains in the queue and is hidden due to the visibility timeout.
- Consumer deletes the message after successful processing to avoid reprocessing once the visibility timeout expires.
- Automatic deletion occurs when messages exceed the maximum retention period (default 4 days, configurable from 60 to 1,209,600 seconds via SetQueueAttributes action).

# DEAD-LETTER QUEUES (DLQ)

- DLQs are used for handling messages that are not processed successfully.
- Must create the dead-letter queue separately and then configure a redrive policy on the source queue.
- Redrive policy details:
  - maxReceiveCount: Number of receive attempts before moving a message to DLQ.
  - redriveAllowPolicy: Specifies which source queue ARNs are permitted to use the DLQ (can allow all, specific ARNs via byQueue option, or deny all).

# CONFIGURATION & PARAMETERS

- Message Retention Period:
  - Default: 4 days
  - Configurable range: 60 seconds to 1,209,600 seconds (14 days) using the SetQueueAttributes action.
- Queue Customization:
  - Delay: Default delay can be set per queue.
  - Large Messages: Can store message payloads larger than 256 KB using S3 or DynamoDB pointers.

# SECURITY

- Encryption options:
  - Default server-side encryption (SSE) managed by Amazon SQS.
  - Custom SSE keys managed via AWS Key Management Service (KMS).
- Access Control:
  - Use IAM policies to control who can send to or receive from SQS queues.

# SCALABILITY & AVAILABILITY

- SQS scales transparently with each buffered request.
- High availability provided by redundantly storing messages and redundant infrastructure for concurrent access.

# COMPARISON WITH OTHER SERVICES

- Amazon SNS:
  - Publisher-subscriber pattern for multi-endpoint delivery.
  - Use SQS with SNS for fanout messaging.
- Amazon MQ:
  - Traditional message brokers supporting AMQP, MQTT, STOMP etc. for legacy systems.

# RETRIEVED DETAILS

- Crawled on: 2023-10-XX
- Data Size: 1316338 bytes
- Source Attribution: AWS SQS Developer Guide from https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html

## Attribution
- Source: AWS SQS Developer Guide
- URL: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/Welcome.html
- License: License: AWS Documentation
- Crawl Date: 2025-05-01T20:18:22.646Z
- Data Size: 1316338 bytes
- Links Found: 2419

## Retrieved
2025-05-01
