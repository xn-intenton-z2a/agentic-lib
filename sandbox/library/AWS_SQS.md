# AWS_SQS

## Crawl Summary
Extracted technical details from the Amazon SQS Developer Guide include precise specifications on security, durability, availability, scalability, reliability, and customization of queues. Core architecture elements such as distributed queues and message lifecycles are described with emphasis on configuration of retention periods and dead-letter queue settings via API actions like SetQueueAttributes. The documentation also contrasts SQS with SNS and Amazon MQ and details IAM and authentication best practices.

## Normalised Extract
Table of Contents:
1. Benefits and Features
   - Security: Use SSE with default or custom KMS key
   - Durability: Multi-server redundant storage, at-least-once (standard) and exactly-once (FIFO)
   - Availability: Redundant infrastructure for high-concurrency
   - Scalability: Auto-scale without provisioning
   - Reliability: Message locking during processing to prevent duplication
   - Customization: Delay settings, offloading large messages
2. Basic Architecture
   - Distributed Queues: Components include producers, consumers, and SQS servers
   - Message Lifecycle: Send, visibility timeout, delete, auto-deletion after retention period
3. Queue Configuration
   - Message Retention: Default 4 days, configurable 60-1209600 seconds using SetQueueAttributes
   - Dead-letter Queues: Configure redrive policy with maxReceiveCount, redriveAllowPolicy (byQueue up to 10 ARNs, or denyAll)
4. API Specifications
   - SetQueueAttributes(QueueUrl: string, Attributes: Map<string, string>) returns void
   - Dead-letter queue redrive configuration parameters
5. IAM and Authentication
   - Use IAM for access control and policy management
   - Authentication via AWS root, IAM users/roles, federated identities, requiring MFA

Detailed Topics:
1. Benefits and Features:
   - Security: Control with IAM policies; enable SSE using AWS KMS with configuration in Attributes map
   - Durability: Standard queues ensure at-least-once delivery; FIFO queues provide exactly-once processing
   - Customization: Set default delays and store pointers for messages larger than 256 KB

2. Basic Architecture:
   - Distributed Queues: Queue stores messages redundantly across multiple servers; supports multiple producers and consumers
   - Message Lifecycle: Producer sends message; consumer receives it within visibility timeout period; consumer deletes message to prevent reprocessing
   - Auto-deletion: Messages older than retention period (default 4 days) are purged automatically

3. Queue Configuration:
   - SetQueueAttributes API allows configuration changes such as MessageRetentionPeriod and VisibilityTimeout
   - Dead-letter Queue Setup: Configure redrive policy with parameter maxReceiveCount; ensure DLQ retention is greater than source queue retention

4. API Specifications:
   - SetQueueAttributes: Parameters include QueueUrl (string) and Attributes (map<string, string>). Example: { "MessageRetentionPeriod": "345600" } sets retention to 4 days (345600 seconds)
   - RedrivePolicy: JSON schema with keys maxReceiveCount and redriveAllowPolicy, e.g. { "maxReceiveCount": "5", "redriveAllowPolicy": "{\"byQueue\":[\"arn:aws:sqs:region:account-id:queue-name\"]}" }

5. IAM and Authentication:
   - Authentication Methods: Root user, IAM user, federated identities using temporary credentials
   - Best Practices: Do not use the root account for routine tasks; enable multi-factor authentication (MFA)


## Supplementary Details
Queue Attribute Configurations:
- MessageRetentionPeriod: Range 60 to 1209600 seconds. Default is 345600 seconds (4 days).
- VisibilityTimeout: Specified in seconds; ideally set based on processing time.
- Dead-letter Queue: Configure using redrive policy. Key parameters:
  * maxReceiveCount: Integer value representing the maximum number of times a message is delivered before moving to DLQ.
  * redriveAllowPolicy: JSON configuration specifying allowed source queues (byQueue array up to 10 ARNs) or denyAll.

SetQueueAttributes API Detailed Steps:
1. Construct the Attributes map with keys such as MessageRetentionPeriod, VisibilityTimeout.
2. Call SetQueueAttributes with the QueueUrl and Attributes map.
3. Verify attribute changes using GetQueueAttributes API.

Dead-letter Queue Best Practices:
- Always set DLQ retention period longer than the source queue retention period.
- Monitor the ApproximateAgeOfOldestMessage metric for the DLQ to trigger alarms using Amazon CloudWatch.

IAM Configuration:
- Assign least privilege policies to access SQS resources.
- For federated identities, create roles and use AWS IAM Identity Center for centralized control.
- Always rotate long-term credentials and use temporary credentials when possible.


## Reference Details
API Specifications:
1. SetQueueAttributes(QueueUrl: string, Attributes: Map<string, string>) -> void
   - Parameters:
     * QueueUrl: string representing the URL of the target queue.
     * Attributes: Map<string, string> containing key-value pairs for configuration options. Example keys include:
         - MessageRetentionPeriod: string (value in seconds between 60 and 1209600)
         - VisibilityTimeout: string (in seconds)
   - Returns: void; throws errors if invalid parameters are provided.

2. RedrivePolicy Setup:
   - JSON Policy Example:
     { "maxReceiveCount": "5", "redriveAllowPolicy": "{\"byQueue\":[\"arn:aws:sqs:us-east-1:123456789012:MySourceQueue\"]}" }
   - Parameters:
     * maxReceiveCount: integer as a string indicating maximum allowed deliveries before moving to DLQ.
     * redriveAllowPolicy: JSON string specifying allowed source queues or denyAll.

SDK Usage Pattern (Pseudo-code):
   // Initialize SQS client
   var sqsClient = new AWS.SQS();

   // Set Queue Attributes
   var params = {
     QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue",
     Attributes: {
       "MessageRetentionPeriod": "345600",
       "VisibilityTimeout": "30"
     }
   };
   sqsClient.setQueueAttributes(params, function(err, data) {
     if (err) {
       console.error('Error', err);
     } else {
       console.log('Attributes updated successfully.');
     }
   });

Best Practices Implementation Code:
   // Example: Configuring a Dead-letter queue redrive policy
   var redrivePolicy = {
     maxReceiveCount: "5",
     redriveAllowPolicy: JSON.stringify({ byQueue: ["arn:aws:sqs:us-east-1:123456789012:SourceQueue"] })
   };
   var dlqParams = {
     QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/SourceQueue",
     Attributes: {
       "RedrivePolicy": JSON.stringify(redrivePolicy)
     }
   };
   sqsClient.setQueueAttributes(dlqParams, function(err, data) {
     if (err) {
       console.error('DLQ Configuration Error', err);
     } else {
       console.log('DLQ configured successfully.');
     }
   });

Troubleshooting Procedures:
   - Command to check queue attributes:
       aws sqs get-queue-attributes --queue-url <QueueURL> --attribute-names All
     Expected output: List of attribute key-value pairs including MessageRetentionPeriod and VisibilityTimeout.
   - If setQueueAttributes returns an error, verify that:
       * The QueueUrl is correct and exists in the region specified.
       * The Attributes map values fall within the valid ranges.
       * The IAM role/user has proper permissions (sqs:SetQueueAttributes permission).

Detailed IAM Policy Example for SQS Access:
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:SetQueueAttributes", "sqs:GetQueueAttributes"],
         "Resource": "arn:aws:sqs:us-east-1:123456789012:MyQueue"
       }
     ]
   }


## Information Dense Extract
SQS: Security (SSE with default/custom KMS), Durability (redundant storage, at-least-once/FIFO exactly-once), Availability (redundant infrastructure), Scalability (auto-scale), Reliability (message locking), Customization (delay, offload via S3/DynamoDB). Distributed architecture: Producers, Consumers, redundant queues. Message Lifecycle: Send, visibility timeout, delete; auto-deletion after retention period (default 345600 seconds). SetQueueAttributes(QueueUrl: string, Attributes: Map<string, string>) -> void; Attributes: MessageRetentionPeriod (60-1209600), VisibilityTimeout. Dead-letter queue: redrive policy with maxReceiveCount and redriveAllowPolicy (byQueue up to 10 ARNs). IAM: Use least privilege, MFA, federated identity via IAM Identity Center. SDK pattern: Initialize client, call setQueueAttributes with parameters, check response. Troubleshooting: Use aws sqs get-queue-attributes; verify permissions and valid parameter ranges.

## Sanitised Extract
Table of Contents:
1. Benefits and Features
   - Security: Use SSE with default or custom KMS key
   - Durability: Multi-server redundant storage, at-least-once (standard) and exactly-once (FIFO)
   - Availability: Redundant infrastructure for high-concurrency
   - Scalability: Auto-scale without provisioning
   - Reliability: Message locking during processing to prevent duplication
   - Customization: Delay settings, offloading large messages
2. Basic Architecture
   - Distributed Queues: Components include producers, consumers, and SQS servers
   - Message Lifecycle: Send, visibility timeout, delete, auto-deletion after retention period
3. Queue Configuration
   - Message Retention: Default 4 days, configurable 60-1209600 seconds using SetQueueAttributes
   - Dead-letter Queues: Configure redrive policy with maxReceiveCount, redriveAllowPolicy (byQueue up to 10 ARNs, or denyAll)
4. API Specifications
   - SetQueueAttributes(QueueUrl: string, Attributes: Map<string, string>) returns void
   - Dead-letter queue redrive configuration parameters
5. IAM and Authentication
   - Use IAM for access control and policy management
   - Authentication via AWS root, IAM users/roles, federated identities, requiring MFA

Detailed Topics:
1. Benefits and Features:
   - Security: Control with IAM policies; enable SSE using AWS KMS with configuration in Attributes map
   - Durability: Standard queues ensure at-least-once delivery; FIFO queues provide exactly-once processing
   - Customization: Set default delays and store pointers for messages larger than 256 KB

2. Basic Architecture:
   - Distributed Queues: Queue stores messages redundantly across multiple servers; supports multiple producers and consumers
   - Message Lifecycle: Producer sends message; consumer receives it within visibility timeout period; consumer deletes message to prevent reprocessing
   - Auto-deletion: Messages older than retention period (default 4 days) are purged automatically

3. Queue Configuration:
   - SetQueueAttributes API allows configuration changes such as MessageRetentionPeriod and VisibilityTimeout
   - Dead-letter Queue Setup: Configure redrive policy with parameter maxReceiveCount; ensure DLQ retention is greater than source queue retention

4. API Specifications:
   - SetQueueAttributes: Parameters include QueueUrl (string) and Attributes (map<string, string>). Example: { 'MessageRetentionPeriod': '345600' } sets retention to 4 days (345600 seconds)
   - RedrivePolicy: JSON schema with keys maxReceiveCount and redriveAllowPolicy, e.g. { 'maxReceiveCount': '5', 'redriveAllowPolicy': '{''byQueue'':[''arn:aws:sqs:region:account-id:queue-name'']}' }

5. IAM and Authentication:
   - Authentication Methods: Root user, IAM user, federated identities using temporary credentials
   - Best Practices: Do not use the root account for routine tasks; enable multi-factor authentication (MFA)

## Original Source
AWS SQS Developer Guide
https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html

## Digest of AWS_SQS

# Overview
Date Retrieved: 2023-10-05

# Benefits of Amazon SQS
- Security: Control access with AWS IAM, manage message encryption using default server-side encryption (SSE) or custom AWS KMS keys.
- Durability: Messages stored redundantly across multiple servers with support for at-least-once delivery (standard queues) and exactly-once processing (FIFO queues).
- Availability: Redundant infrastructure ensures highly-concurrent access.
- Scalability: Automatically scales to handle load spikes without manual provisioning.
- Reliability: Message locking during processing to allow concurrent producers and consumers.
- Customization: Configure delays per queue, and offload larger messages (over 256 KB) to Amazon S3 or DynamoDB by storing pointers.

# Basic Architecture
## Distributed Queues
- Components: Producers, Consumers, Queue (hosted on Amazon SQS servers), and stored messages.
- Messages (A to E) are redundantly stored across multiple servers.

## Message Lifecycle
1. Producer sends a message to the queue and it is distributed across servers.
2. Consumer retrieves the message; the message remains invisible to others during the visibility timeout.
3. Upon successful processing, the consumer deletes the message from the queue.
4. If a message remains undelivered past the retention period (default 4 days), it is automatically deleted.

# Queue Attributes and Configuration
- Message Retention Period: Default 4 days. Can be configured between 60 seconds and 1,209,600 seconds (14 days) using the SetQueueAttributes API.
- Dead-letter Queue (DLQ) Configuration:
  - Use redrive policy with parameters such as maxReceiveCount (number of times a message can be received before moving to DLQ).
  - redriveAllowPolicy: Define which source queues can send messages to the DLQ. Options include allowing all, specifying up to 10 source queue ARNs via byQueue, or using denyAll.

# API and SDK Method Signatures
## SetQueueAttributes API
Signature:
SetQueueAttributes(QueueUrl: string, Attributes: Map<string, string>) -> void
Example Attributes:
  - MessageRetentionPeriod: integer (range: 60 to 1209600)
  - VisibilityTimeout: integer (in seconds)

## Dead-letter Queue Configuration API
Redrive policy parameters:
  - maxReceiveCount (integer): Number of failed receive attempts before moving the message to the DLQ.
  - redriveAllowPolicy: JSON string specifying allowed source queues.

# Differences Between SQS, SNS, and MQ
- Amazon SQS: Decouples components using a queue, ideal for single subscriber ordering with loss prevention.
- Amazon SNS: Publishes messages to multiple subscribers via topics, ideal for real-time push notifications.
- Amazon MQ: Suitable for migration from legacy message brokers, supporting protocols like AMQP, MQTT, ActiveMQ, and RabbitMQ.

# IAM and Authentication for SQS
- Use AWS Identity and Access Management for defining access rules and policies.
- Authentication methods include AWS Account Root user, IAM users/roles, federated identities and temporary credentials.
- Best practice: Do not use root user for daily operations and enable MFA for enhanced security.


## Attribution
- Source: AWS SQS Developer Guide
- URL: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
- License: License: AWS Service Terms (proprietary)
- Crawl Date: 2025-05-01T23:39:55.763Z
- Data Size: 1284658 bytes
- Links Found: 2394

## Retrieved
2025-05-01
