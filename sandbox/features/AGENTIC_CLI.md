# Value Proposition

Provide a unified command line interface that combines AWS event simulation for S3, SNS, and SQS with an interactive agentic chat feature powered by OpenAI. This tool enables developers to locally test Lambda handlers against realistic AWS events and prototype autonomous workflow decisions through a chat interface without deploying to external services.

# Success Criteria & Requirements

## CLI Flag Parsing

- In sandbox/source/main.js:
  - Support existing --s3-event flag with bucketName and objectKey arguments, defaulting to S3_BUCKET_NAME environment variable when absent.
  - Support existing --sns-event flag with topicArn and message arguments, defaulting to SNS_TOPIC_ARN environment variable when absent.
  - Support a new --chat flag followed by a user prompt string. The prompt may be a single argument or quoted string.
  - Remove processed flags and their arguments before invoking handlers to avoid interference with other flags.

## AWS Event Creators and Handlers

- In src/lib/main.js:
  - Maintain createS3PutObjectEvent(bucketName, objectKey) returning an S3 PutObject notification record.
  - Maintain createSNSEvent(topicArn, message) returning an SNS Publish notification record.
  - Maintain createSQSEventFromDigest(digest) for SQS simulation.
  - Maintain async handlers s3LambdaHandler, snsLambdaHandler, digestLambdaHandler that log event details using logInfo.

## OpenAI Chat Integration

- In src/lib/main.js:
  - Import Configuration and OpenAIApi from openai.
  - Export async function chatHandler(userPrompt) that:
    - Instantiates OpenAIApi with Configuration using OPENAI_API_KEY.
    - Sends a chat completion request with a system message describing agentic-lib mission and the userPrompt.
    - Parses the response content as text and logs it via logInfo.
    - Returns the raw response content.

## CLI Integration

- In sandbox/source/main.js:
  - Implement processChat(args) to detect --chat flag, extract the prompt argument, invoke chatHandler, and log its response using logInfo.
  - Invoke processChat alongside processS3Event, processSnsEvent, and processDigest in main execution flow before help and default message.

## Documentation

- Update generateUsage() in sandbox/source/main.js and sandbox/README.md to list:
  - --chat [prompt]  Interact with the agentic AI chat interface.
  - --s3-event [bucketName] [objectKey]  Simulate S3 PutObject event.
  - --sns-event [topicArn] [message]  Simulate SNS Publish event.
  - --digest  Simulate an SQS event with example digest.
- Provide usage examples in README.md for chat, S3, SNS, and digest:
  - node sandbox/source/main.js --chat "Describe next agentic workflow step"
  - node sandbox/source/main.js --s3-event my-bucket path/to/file.json
  - node sandbox/source/main.js --sns-event arn:aws:sns:... "Test message"
  - node sandbox/source/main.js --digest

# Verification & Acceptance

- Add sandbox/tests/chat.cli.test.js:
  - Mock openai library to return a fixed chat completion.
  - Verify that invoking --chat prompt calls chatHandler with correct prompt.
  - Assert console.log outputs JSON log entry with the returned message.
- Confirm existing sandbox/tests/s3.event.test.js and sandbox/tests/sns.event.test.js continue to pass without modification.
- Confirm unit tests in tests/unit remain green.