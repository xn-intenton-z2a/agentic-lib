# Value Proposition

Provide a unified command line interface that combines AWS event simulation for S3, SNS, and SQS with an interactive agentic chat feature powered by OpenAI. This tool enables developers to locally test Lambda handlers against realistic AWS events, prototype autonomous workflow decisions through a chat interface, and preview mission statements without deploying to external services.

# Success Criteria & Requirements

## CLI Flag Parsing

- In sandbox/source/main.js:
  - Support --s3-event flag with bucketName and objectKey arguments, defaulting to S3_BUCKET_NAME environment variable when absent.
  - Support --sns-event flag with topicArn and message arguments, defaulting to SNS_TOPIC_ARN environment variable when absent.
  - Support existing --digest flag that simulates an SQS event from a fixed example digest.
  - Support a new --chat flag followed by a user prompt string. Extract a single argument or quoted string for the prompt.
  - Parse flags in any order, remove processed flags and their arguments before invoking handlers to avoid interference.

## AWS Event Creators and Handlers

- In src/lib/main.js:
  - Maintain createS3PutObjectEvent(bucketName, objectKey) returning an S3 PutObject notification event.
  - Maintain createSNSEvent(topicArn, message) returning an SNS Publish event.
  - Maintain createSQSEventFromDigest(digest) for SQS simulation.
  - Export async handlers `s3LambdaHandler`, `snsLambdaHandler`, `digestLambdaHandler` that log event details using logInfo.

## OpenAI Chat Integration

- In src/lib/main.js:
  - Import Configuration and OpenAIApi from openai.
  - Export async function `chatHandler(userPrompt)` that:
    - Instantiates OpenAIApi with Configuration using OPENAI_API_KEY.
    - Sends a chat completion with:
      - system message describing agentic-lib mission.
      - userPrompt as a follow-up.
    - Parses the response content as text and logs it via logInfo.
    - Returns the raw response content.

## CLI Integration

- In sandbox/source/main.js:
  - Implement `processChat(args)` to detect --chat flag, extract the prompt, invoke chatHandler, and log its response using logInfo.
  - Invoke `processChat` alongside `processS3Event`, `processSnsEvent`, and `processDigest` in main execution flow before help and default message.
  - Update `generateUsage()` to include: `--chat [prompt]` Interact with the agentic AI chat interface.

## Documentation

- Update sandbox/README.md:
  - Add usage entry for --chat with an example: `node sandbox/source/main.js --chat "Describe next agentic workflow step"`.
  - Ensure entries for --s3-event, --sns-event, --digest, --mission, --help, and --version remain accurate.

# Verification & Acceptance

- Add sandbox/tests/chat.cli.test.js:
  - Mock openai library to return a fixed chat completion.
  - Verify invoking `--chat prompt` calls chatHandler with correct prompt.
  - Assert console.log outputs a JSON log entry with the returned message.
- Confirm existing sandbox/tests/s3.event.test.js and sandbox/tests/sns.event.test.js pass without modification.
- Confirm unit tests in tests/unit remain green.