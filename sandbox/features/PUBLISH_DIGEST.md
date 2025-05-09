# Purpose
Allow users to send a digest message to an AWS SQS queue directly from the CLI.

# Value Proposition
Enable end-to-end testing and real-world integration by publishing digest payloads to actual SQS queues. This feature streamlines development and debugging of workflows that consume SQS messages.

# Success Criteria & Requirements
- Accept a valid SQS queue URL and a digest payload specified either as a file path or inline JSON string.
- Validate the queue URL format before attempting to send.
- Support reading digest content from a JSON file or parsing inline JSON if the input string begins with '{'.
- Use the AWS SDK for JavaScript v3 to send messages to SQS.
- Log success with the returned MessageId via logInfo, and errors via logError.
- Exit the CLI with status code 0 on success, and non-zero on failure.

# Implementation Details
1. Add function sendDigestToSQS(queueUrl, digest) in the main source file:
   - Instantiate SQSClient and SendMessageCommand from @aws-sdk/client-sqs.
   - Call send and return the MessageId or throw an error.
2. Extend CLI processing in main():
   - Recognize a new flag --send.
   - Parse arguments: queue URL and digest source (file path or inline JSON).
   - Read file content if path exists, otherwise attempt JSON.parse on the string.
   - Call sendDigestToSQS and await its result.
3. Ensure graceful error handling and logging via existing logInfo and logError utilities.

# CLI Usage
agentic-lib --send https://sqs.region.amazonaws.com/123456789012/my-queue ./digest.json
agentic-lib --send https://sqs.region.amazonaws.com/123456789012/my-queue '{"key":"events/1.json","value":"12345"}'

# Testability & Acceptance
- Add unit tests mocking @aws-sdk/client-sqs to verify:
  - Successful send returns expected MessageId and logs it.
  - Invalid queue URL is rejected before calling AWS.
  - Invalid JSON payload results in an error and appropriate batch failure logging.
- Tests should cover both file-based and inline JSON inputs.

# Documentation Updates
- Update README with a new section for the --send flag.
- Provide CLI usage examples and describe the sendDigestToSQS API.
