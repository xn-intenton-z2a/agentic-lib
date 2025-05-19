# Objective

Extend the library and CLI to send digest payloads to an AWS SQS queue, enabling downstream workflows to consume events without custom scripting.

# Value Proposition

Provide a unified API and CLI flag for queuing digest messages. This simplifies integration with AWS SQS by encapsulating configuration, message formatting, and error handling within the library, reducing boilerplate for end users.

# Requirements

1. Add dependency on @aws-sdk/client-sqs in package.json.
2. In src/lib/main.js import SQSClient and SendMessageCommand from @aws-sdk/client-sqs.
3. Implement and export async function sendMessageToQueue(digest: object):
   - Read QUEUE_URL from environment.
   - Create SQSClient with default region.
   - Construct SendMessageCommand with MessageBody set to JSON.stringify(digest) and QueueUrl set to QUEUE_URL.
   - Call client.send and return the result.
   - On missing QUEUE_URL throw an error with clear guidance.
4. Add CLI support for --send-queue flag:
   - Process args in main: if args includes --send-queue, parse optional JSON payload from a file or use built-in example digest.
   - Call sendMessageToQueue and log success or error using logInfo/logError.
   - Exit with non-zero code on failure.
5. Update README:
   - Document the sendMessageToQueue API signature.
   - Add CLI section for --send-queue with example invocations and expected output.
6. Write unit tests in sandbox/tests for sendMessageToQueue:
   - Mock SQSClient.send to verify message construction and error handling.
   - Test CLI invocation with --send-queue and with missing QUEUE_URL to confirm error path.

# User Scenarios

- As a CLI user, I run npm start -- --send-queue to enqueue a sample digest and see confirmation.
- As a developer, I import sendMessageToQueue and call it with a custom digest object in my workflow.
- As an automation engineer, I set QUEUE_URL and invoke sendMessageToQueue to route events to my processing pipeline.

# Verification & Acceptance

1. Unit tests mock SQSClient to assert that SendMessageCommand receives correct QueueUrl and MessageBody.
2. CLI tests simulate environment without QUEUE_URL and confirm process exits with error message.
3. README examples execute successfully against a live or mocked queue.
4. Linting and formatting pass with no errors.
5. New dependency appears in package.json and package lock, and install succeeds.