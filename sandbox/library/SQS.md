# SQS

## Crawl Summary
Amazon SQS technical details are extracted providing API endpoints for CreateQueue, GetQueueUrl, SendMessage, ReceiveMessage, and DeleteMessage. The summary includes method signatures, required parameters, expected return values, configuration attributes such as DelaySeconds, MaximumMessageSize, MessageRetentionPeriod, VisibilityTimeout, and troubleshooting procedures including error codes and AWS CLI commands.

## Normalised Extract
Table of Contents:
1. Introduction
2. Queue Management APIs
   - CreateQueue: queueName (string), attributes (Map<string, string>) returns queueUrl (string)
   - GetQueueUrl: queueName (string) returns queueUrl (string)
3. Message Operations APIs
   - SendMessage: queueUrl (string), messageBody (string), options (DelaySeconds?: number, MessageAttributes?: Map<string, any>) returns {MessageId: string}
   - ReceiveMessage: queueUrl (string), options (MaxNumberOfMessages?: number, WaitTimeSeconds?: number, VisibilityTimeout?: number) returns {Messages: Array<{MessageId, ReceiptHandle, Body}>}
   - DeleteMessage: queueUrl (string), receiptHandle (string) returns void
4. Queue Attributes and Configurations
   - Attributes: DelaySeconds, MaximumMessageSize, MessageRetentionPeriod, VisibilityTimeout with exact defaults and values
5. Error Handling and Troubleshooting
   - Error Codes: AWS.SimpleQueueService.NonExistentQueue
   - AWS CLI Command: aws sqs list-queues --region us-east-1
   - SDK Error patterns using try-catch blocks in implementation

## Supplementary Details
Detailed Specifications:
CreateQueue:
  - Parameters: queueName (string), attributes (Map<string, string>) where attributes include:
      DelaySeconds: default '0'
      MaximumMessageSize: default '262144'
      MessageRetentionPeriod: default '345600'
      VisibilityTimeout: default '30'
  - Returns: queueUrl (string)

SendMessage:
  - Parameters: queueUrl (string), messageBody (string), options: { DelaySeconds?: number, MessageAttributes?: Map<string, any> }
  - Returns: { MessageId: string }

ReceiveMessage:
  - Parameters: queueUrl (string), options: { MaxNumberOfMessages?: number (default 1), WaitTimeSeconds?: number, VisibilityTimeout?: number }
  - Returns: { Messages: Array<{ MessageId: string, ReceiptHandle: string, Body: string }> }

DeleteMessage:
  - Parameters: queueUrl (string), receiptHandle (string)
  - Returns: void

Implementation Steps:
1. For queue creation, invoke CreateQueue with necessary attributes.
2. To send a message, use SendMessage with the target queue URL and message body.
3. To receive messages, call ReceiveMessage with proper options for long polling.
4. Use DeleteMessage to remove processed messages, using the receipt handle provided by ReceiveMessage.

Configuration Options:
DelaySeconds: Specifies initial delay for message delivery.
MaximumMessageSize: Maximum allowed message size in bytes.
MessageRetentionPeriod: Duration messages are retained in the queue.
VisibilityTimeout: Time period after message retrieval during which the message is hidden.

Troubleshooting:
- Use AWS CLI commands to verify queue existence.
- Monitor error codes in SDK responses to handle exceptions promptly.

## Reference Details
API Specifications:

CreateQueue(queueName: string, attributes: Map<string, string>): string
  - Example Implementation:
    const params = { QueueName: 'MyQueue', Attributes: { 'DelaySeconds': '0', 'MaximumMessageSize': '262144', 'MessageRetentionPeriod': '345600', 'VisibilityTimeout': '30' } };
    sqs.createQueue(params, (err, data) => { if(err) { console.error(err); } else { console.log(data.QueueUrl); } });

GetQueueUrl(queueName: string): string
  - Example Implementation:
    const params = { QueueName: 'MyQueue' };
    sqs.getQueueUrl(params, (err, data) => { if(err) { console.error(err); } else { console.log(data.QueueUrl); } });

SendMessage(queueUrl: string, messageBody: string, options?: { DelaySeconds?: number, MessageAttributes?: Map<string, any> }): { MessageId: string }
  - Example Implementation:
    const params = { QueueUrl: queueUrl, MessageBody: messageBody, DelaySeconds: options?.DelaySeconds || 0, MessageAttributes: options?.MessageAttributes };
    sqs.sendMessage(params, (err, data) => { if(err) { console.error(err); } else { console.log(data.MessageId); } });

ReceiveMessage(queueUrl: string, options?: { MaxNumberOfMessages?: number, WaitTimeSeconds?: number, VisibilityTimeout?: number }): { Messages: Array<{ MessageId: string, ReceiptHandle: string, Body: string }> }
  - Example Implementation:
    const params = { QueueUrl: queueUrl, MaxNumberOfMessages: options?.MaxNumberOfMessages || 1, WaitTimeSeconds: options?.WaitTimeSeconds, VisibilityTimeout: options?.VisibilityTimeout };
    sqs.receiveMessage(params, (err, data) => { if(err) { console.error(err); } else { console.log(data.Messages); } });

DeleteMessage(queueUrl: string, receiptHandle: string): void
  - Example Implementation:
    const params = { QueueUrl: queueUrl, ReceiptHandle: receiptHandle };
    sqs.deleteMessage(params, (err, data) => { if(err) { console.error(err); } else { console.log('Message Deleted'); } });

Configuration Options with Values:
  DelaySeconds: default '0', effect: initial message delay
  MaximumMessageSize: default '262144', effect: max message size in bytes
  MessageRetentionPeriod: default '345600', effect: retention period in seconds
  VisibilityTimeout: default '30', effect: hiding duration after message receipt

Best Practices:
  - Validate queue existence with GetQueueUrl before sending messages.
  - Implement exponential backoff in error retries.
  - Use long polling via WaitTimeSeconds to reduce empty responses.

Troubleshooting Procedures:
  - Command: aws sqs list-queues --region us-east-1
    Expected Output: List of queue URLs if properly configured.
  - Check for errors like AWS.SimpleQueueService.NonExistentQueue and verify queue creation.
  - Use SDK try-catch blocks to capture and log error codes for diagnostic purposes.

## Information Dense Extract
SQS API: CreateQueue(queueName: string, attributes: Map<string, string>) => queueUrl:string; GetQueueUrl(queueName: string) => queueUrl:string; SendMessage(queueUrl: string, messageBody: string, options?: {DelaySeconds?:number, MessageAttributes?:Map<string,any>}) => {MessageId:string}; ReceiveMessage(queueUrl: string, options?: {MaxNumberOfMessages?:number, WaitTimeSeconds?:number, VisibilityTimeout?:number}) => {Messages:Array<{MessageId:string, ReceiptHandle:string, Body:string}>}; DeleteMessage(queueUrl: string, receiptHandle: string) => void; Attributes: DelaySeconds ('0'), MaximumMessageSize ('262144'), MessageRetentionPeriod ('345600'), VisibilityTimeout ('30'); Troubleshooting: CLI aws sqs list-queues --region us-east-1; Error: AWS.SimpleQueueService.NonExistentQueue.

## Sanitised Extract
Table of Contents:
1. Introduction
2. Queue Management APIs
   - CreateQueue: queueName (string), attributes (Map<string, string>) returns queueUrl (string)
   - GetQueueUrl: queueName (string) returns queueUrl (string)
3. Message Operations APIs
   - SendMessage: queueUrl (string), messageBody (string), options (DelaySeconds?: number, MessageAttributes?: Map<string, any>) returns {MessageId: string}
   - ReceiveMessage: queueUrl (string), options (MaxNumberOfMessages?: number, WaitTimeSeconds?: number, VisibilityTimeout?: number) returns {Messages: Array<{MessageId, ReceiptHandle, Body}>}
   - DeleteMessage: queueUrl (string), receiptHandle (string) returns void
4. Queue Attributes and Configurations
   - Attributes: DelaySeconds, MaximumMessageSize, MessageRetentionPeriod, VisibilityTimeout with exact defaults and values
5. Error Handling and Troubleshooting
   - Error Codes: AWS.SimpleQueueService.NonExistentQueue
   - AWS CLI Command: aws sqs list-queues --region us-east-1
   - SDK Error patterns using try-catch blocks in implementation

## Original Source
Amazon SQS Documentation
https://docs.aws.amazon.com/sqs/latest/dg/welcome.html

## Digest of SQS

# Amazon SQS API Documentation

Retrieved Date: 2023-10-13

This document contains complete technical specifications and implementation details for Amazon Simple Queue Service (SQS). It covers API endpoints, method signatures, configuration options, and troubleshooting procedures for high-value, real-time integration.

## Table of Contents
1. Introduction
2. Queue Management APIs
3. Message Operations APIs
4. Queue Attributes and Configurations
5. Error Handling and Troubleshooting

## 1. Introduction
Amazon SQS provides a reliable, highly-scalable hosted queue that enables you to decouple and scale microservices, distributed systems, and serverless applications.

## 2. Queue Management APIs
- CreateQueue: Creates a new queue.
  Method Signature: CreateQueue(queueName: string, attributes: Map<string, string>) => string
  Parameters:
    queueName (string): Name of the queue
    attributes (Map<string, string>): Key-value pairs for queue configuration (e.g., DelaySeconds, MaximumMessageSize)
  Returns:
    queueUrl (string): The URL of the created queue

- GetQueueUrl: Retrieves the URL of an existing queue.
  Method Signature: GetQueueUrl(queueName: string) => string
  Parameters:
    queueName (string): Name of the queue
  Returns:
    queueUrl (string)

## 3. Message Operations APIs
- SendMessage: Sends a message to the queue.
  Method Signature: SendMessage(queueUrl: string, messageBody: string, options?: { DelaySeconds?: number, MessageAttributes?: Map<string, any> }) => { MessageId: string }
  Parameters:
    queueUrl (string): The URL of the queue
    messageBody (string): The content text of the message
    options (object): Optional parameters
      DelaySeconds (number): The delay in seconds for the message (default is 0)
      MessageAttributes (Map<string, any>): Additional metadata for the message
  Returns:
    MessageId (string): Unique identifier for the sent message

- ReceiveMessage: Retrieves one or more messages from the specified queue.
  Method Signature: ReceiveMessage(queueUrl: string, options?: { MaxNumberOfMessages?: number, WaitTimeSeconds?: number, VisibilityTimeout?: number }) => { Messages: Array<{ MessageId: string, ReceiptHandle: string, Body: string }> }
  Parameters:
    queueUrl (string): The URL of the queue
    options (object): Optional parameters
      MaxNumberOfMessages (number): Maximum messages to return (default is 1)
      WaitTimeSeconds (number): Duration for long polling
      VisibilityTimeout (number): Time period during which received messages remain invisible
  Returns:
    Messages (array): An array of messages with MessageId, ReceiptHandle, and Body

- DeleteMessage: Deletes the specified message from the queue.
  Method Signature: DeleteMessage(queueUrl: string, receiptHandle: string) => void
  Parameters:
    queueUrl (string): The URL of the queue
    receiptHandle (string): The receipt handle associated with the message
  Returns:
    void

## 4. Queue Attributes and Configurations
Common configuration options (to be included in the attributes map during CreateQueue):
- DelaySeconds (default: "0"): The time in seconds that the delivery of all messages in the queue will be delayed.
- MaximumMessageSize (default: "262144"): The limit of how many bytes a message can contain before Amazon SQS rejects it.
- MessageRetentionPeriod (default: "345600"): The duration (in seconds) for which Amazon SQS retains a message.
- VisibilityTimeout (default: "30"): The duration (in seconds) that the received messages are hidden from subsequent retrieve requests.

## 5. Error Handling and Troubleshooting
- Common Error: AWS.SimpleQueueService.NonExistentQueue indicates that the target queue does not exist. Verify the queue name and existence with GetQueueUrl.
- AWS CLI Command Example: aws sqs list-queues --region us-east-1
- SDK Error Handling: Use try-catch blocks in your integration. Example:

try {
  result = SendMessage(queueUrl, messageBody);
} catch (error) {
  if (error.code === 'AWS.SimpleQueueService.NonExistentQueue') {
    // Handle missing queue error
  }
}


## Attribution
- Source: Amazon SQS Documentation
- URL: https://docs.aws.amazon.com/sqs/latest/dg/welcome.html
- License: License: AWS Proprietary
- Crawl Date: 2025-05-01T21:50:08.044Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-01
