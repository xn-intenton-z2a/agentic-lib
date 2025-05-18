# Value Proposition

Provide a unified CLI for local AWS event simulation (S3, SNS, SQS) and an interactive agentic chat powered by OpenAI. This ensures developers can prototype, test, and preview workflows without deploying to external services.

# Success Criteria & Requirements

## CLI Flag Parsing
- In sandbox/source/main.js:
  - Support --s3-event with two arguments: bucketName and objectKey. If arguments are omitted, default to S3_BUCKET_NAME and OBJECT_KEY environment variables.
  - Support --sns-event with two arguments: topicArn and message. If arguments are omitted, default to SNS_TOPIC_ARN and SNS_MESSAGE environment variables.
  - Retain existing --digest flag behavior.
  - Support a new --chat flag with a prompt string argument, accepting unquoted or quoted multiword prompts.
  - Parse flags and their arguments in any order, remove them from args before invoking respective handlers.

## AWS Event Creators and Handlers
- In src/lib/main.js:
  - Add createS3PutObjectEvent(bucketName, objectKey) returning a valid S3 PutObject notification event object.
  - Add createSNSEvent(topicArn, message) returning a valid SNS Publish event object.
  - Maintain createSQSEventFromDigest(digest) for SQS simulation.
  - Export async handlers s3LambdaHandler(event), snsLambdaHandler(event), and digestLambdaHandler(event) that log event details via logInfo.

## OpenAI Chat Integration
- In src/lib/main.js:
  - Export async chatHandler(userPrompt) that:
    - Instantiates OpenAIApi with Configuration using OPENAI_API_KEY.
    - Sends a chat completion request with a system message describing the agentic mission and the userPrompt follow-up.
    - Parses the returned message content as text and logs it with logInfo.
    - Returns the raw response content.

## CLI Integration
- In sandbox/source/main.js:
  - Implement processS3Event(args), processSnsEvent(args), and processChat(args) functions.
  - Each function detects its flag, extracts and validates arguments, invokes the corresponding handler from src/lib/main.js, and logs the result.
  - Update generateUsage() to include:
    --s3-event [bucketName objectKey]  Simulate an S3 PutObject event.
    --sns-event [topicArn message]     Simulate an SNS Publish event.
    --chat [prompt]                    Interact with the agentic chat interface.
  - Invoke these processors in the main execution flow alongside processMission, processHelp, processVersion, processDigest.

## Documentation
- In sandbox/README.md:
  - Update options list to include --s3-event, --sns-event, and --chat, each with concise descriptions and examples.
  - Ensure links to MISSION.md, CONTRIBUTING.md, and the agentic-lib GitHub repository are present.

## Testing
- Add sandbox/tests/s3.cli.test.js and sandbox/tests/sns.cli.test.js:
  - Mock the AWS event creators and lambda handlers to return fixed log entries.
  - Verify invoking --s3-event and --sns-event calls correct handlers with parsed arguments and logs JSON entries.
- Update sandbox/tests/chat.cli.test.js to ensure chatHandler is invoked and its response is logged.
- Confirm existing tests for --mission, --digest, and unit tests in tests/unit remain green.
