# Purpose
Enable bidirectional interaction with AWS SQS for digest payloads via the CLI, allowing users both to send digest messages to a queue and to receive and process messages from a queue, simulating Lambda invocation.

# Value Proposition
Providing end-to-end SQS integration directly from the CLI streamlines development and debugging of workflows consuming and producing SQS events. Users can publish test payloads, retrieve live messages, and exercise the digestLambdaHandler in situ, reducing friction in testing and deployment.

# Success Criteria & Requirements
- Maintain existing --send functionality for publishing digest messages to SQS.
- Introduce a new --receive flag that accepts a valid SQS queue URL and optional parameters.
- Support the following CLI options for receiving:
  - --receive <queueUrl> [--max-messages N] to poll up to N messages (default 10).
  - Validate queue URL format before AWS calls.
- On receiving messages, parse each body as JSON digest, and invoke digestLambdaHandler for each record.
- On successful processing of a message, delete it from the queue via AWS SDK SQSClient.deleteMessage.
- Collect and log failures without halting processing of remaining messages.
- Exit with status code 0 if all messages processed successfully, non-zero if any failures.

# Implementation Details
1. Extend CLI in main():
   - Detect --receive flag and parse queue URL and optional --max-messages value.
   - Instantiate SQSClient and call receiveMessage with MaxNumberOfMessages.
   - For each Message returned:
     - Call digestLambdaHandler with eventRecords containing the message body.
     - On successful handling (empty batchItemFailures), call deleteMessage with ReceiptHandle.
     - Collect failures and log via logError.
2. Refactor sendDigestToSQS logic remains unchanged.
3. Ensure proper error handling and logging using logInfo and logError.
4. Support verbose stats if VERBOSE_STATS is enabled.

# CLI Usage
agentic-lib --send https://sqs.region.amazonaws.com/123456789012/my-queue ./digest.json
agentic-lib --send https://sqs.region.amazonaws.com/123456789012/my-queue '{"key":"events/1.json","value":"12345"}'
agentic-lib --receive https://sqs.region.amazonaws.com/123456789012/my-queue --max-messages 5

# Testability & Acceptance
- Mock @aws-sdk/client-sqs to simulate:
  - Sending a message and returning a MessageId.
  - Receiving multiple messages, both valid and invalid JSON payloads.
  - Deletion of messages and handling deletion failures.
- Unit tests should cover:
  - Successful send and receive flows with correct logging.
  - Invalid queue URL detection.
  - Invalid JSON bodies in received messages and failure logging.
  - Handling of AWS SDK errors during receiveMessage and deleteMessage.

# Documentation Updates
- Update README with sections for --receive flag usage and examples.
- Document new functions: receiveDigestsFromSQS(queueUrl, maxMessages) and associated behavior.