# Objective

Add the ability to send digest messages to an AWS SQS queue from both the library API and the CLI. This feature allows users to push events into a queue for downstream processing, completing the end-to-end workflow from event creation through delivery.

# Value Proposition

Provide core functionality for publishing digest events to SQS so that automated workflows can leverage AWS messaging. Users gain a single, unified API and CLI command to enqueue messages without writing custom code or scripts.

# Requirements

1. Environment variable QUEUE_URL must be defined to specify the target SQS queue.
2. Add dependency on @aws-sdk/client-sqs to package.json.
3. Implement a sendMessageToQueue function in the main source file that accepts a digest object, constructs a SendMessageCommand, and calls SQSClient.send.
4. Expose sendMessageToQueue in the module exports for programmatic use.
5. Add a new CLI flag --send-queue that reads the queue URL, builds an example or supplied digest, and invokes sendMessageToQueue.
6. Update README with usage examples for the new CLI flag and library API.
7. Write unit tests covering success and error cases for sendMessageToQueue and the --send-queue CLI command.

# User Scenarios

- As a developer, I want to enqueue a digest event by running npm start -- --send-queue so that downstream Lambdas or services can process it.
- As an automated workflow author, I import sendMessageToQueue from agentic-lib and call it to publish events dynamically during runtime.

# Verification & Acceptance

1. Unit tests simulate SQSClient mock to verify that SendMessageCommand is constructed with correct body and queue URL.
2. CLI integration tests confirm that invoking --send-queue logs success or reports errors cleanly.
3. If QUEUE_URL is missing, provide a clear error message and exit non-zero.
4. Documentation examples in README produce valid JSON output demonstrating enqueue success.
5. Dependency list updated and linting passes with no errors.