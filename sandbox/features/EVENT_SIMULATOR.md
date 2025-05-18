# Value Proposition

- Provide a unified CLI interface for simulating AWS Lambda triggers locally, covering both S3 PutObject and SNS Publish events without deploying to AWS.
- Enable developers to validate Lambda handler logic and logging in a sandbox environment using realistic event payloads.

# Success Criteria & Requirements

## CLI Flag Parsing

- In sandbox/source/main.js:
  - Support existing --s3-event flag followed by bucketName and objectKey arguments, falling back to environment variable S3_BUCKET_NAME if bucketName is missing.
  - Add support for --sns-event flag followed by topicArn and message string arguments, falling back to environment variable SNS_TOPIC_ARN for topicArn if not provided.
  - Remove processed flags and their arguments before invoking handlers.

## AWS Event Creators and Handlers

- In src/lib/main.js:
  - Export function createS3PutObjectEvent(bucketName, objectKey) returning an event object with Records array containing an AWS S3 PutObject notification record:
    - eventVersion set to "2.1"
    - eventSource set to "aws:s3"
    - s3.bucket.name and s3.object.key fields set accordingly
  - Export function createSNSEvent(topicArn, message) returning an event object with Records array containing an AWS SNS Publish notification record:
    - EventVersion set to "1.0"
    - EventSource set to "aws:sns"
    - Sns.TopicArn and Sns.Message fields set accordingly
  - Export async function s3LambdaHandler(s3Event) that logs receipt of the event and details via logInfo
  - Export async function snsLambdaHandler(snsEvent) that logs receipt of the event and details via logInfo

## CLI Integration

- In sandbox/source/main.js:
  - Implement processSnsEvent(args) to detect --sns-event flag, construct event via createSNSEvent, and invoke snsLambdaHandler
  - Invoke processSnsEvent and processS3Event in the main execution flow before default help and before processDigest
  - Ensure console output uses the existing logInfo format and includes topicArn and message for SNS and bucketName and objectKey for S3

## Documentation

- Update generateUsage() in sandbox/source/main.js and sandbox/README.md to list:
  - --s3-event [bucketName] [objectKey]  Simulate S3 PutObject event
  - --sns-event [topicArn] [message]     Simulate SNS Publish event
- Provide usage examples in sandbox/README.md for both S3 and SNS simulation:
  - node sandbox/source/main.js --s3-event my-bucket path/to/file.json
  - node sandbox/source/main.js --sns-event arn:aws:sns:us-east-1:123456789012:MyTopic "Test message"

# Verification & Acceptance

- Add sandbox/tests/sns.event.test.js:
  - Mock createSNSEvent and snsLambdaHandler
  - Verify that invoking --sns-event topicArn message calls handler with correct structure
  - Assert console.log outputs with expected logInfo JSON entries including topicArn and message
- Confirm existing S3 event tests continue to pass without modification