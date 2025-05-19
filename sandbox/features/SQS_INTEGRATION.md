# Objective

Expand the library and CLI to fully integrate with AWS SQS end-to-end, including sending digest payloads, simulating queue events locally, and processing messages via a Lambda-style handler. This enables developers and automation engineers to enqueue and consume digests without custom scripting.

# Value Proposition

Provide a unified API and CLI support for SQS message lifecycle. Sending digests, generating event records, and handling them in a single library removes boilerplate, simplifies testing, and accelerates building event-driven workflows.

# Requirements

1. Add or update dependency on @aws-sdk/client-sqs in package.json.
2. In src/lib/main.js import SQSClient and SendMessageCommand from @aws-sdk/client-sqs.
3. Implement and export async function sendMessageToQueue(digest: object):
   - Read QUEUE_URL from environment, throw descriptive error if missing.
   - Create SQSClient with default region.
   - Construct SendMessageCommand with MessageBody set to JSON.stringify(digest) and QueueUrl set to QUEUE_URL.
   - Call client.send and return result, logging success or throwing error.
4. Ensure existing createSQSEventFromDigest wraps a digest into a valid SQS event record.
5. Enhance digestLambdaHandler to log received events, parse each record, handle JSON parse errors by collecting batchItemFailures, and return failures list.
6. CLI support enhancements in src/lib/main.js:
   - --send-queue: read optional JSON file path, call sendMessageToQueue, and log outcome.
   - --digest: generate example digest, wrap via createSQSEventFromDigest, and call digestLambdaHandler.
   - Include verbose stats logic after each command.
7. Update sandbox/README.md:
   - Document API signatures for sendMessageToQueue and digestLambdaHandler.
   - Add CLI usage sections for --send-queue and --digest with examples and expected logs.
8. Write or update unit tests in sandbox/tests for:
   - sendMessageToQueue: mock SQSClient.send, validate command input and error path when QUEUE_URL is missing.
   - createSQSEventFromDigest: verify event structure.
   - digestLambdaHandler: test successful processing and JSON parse failure scenarios to assert batchItemFailures.
   - CLI flags: simulate process.argv with --send-queue and --digest, verify console output and exit codes.

# User Scenarios and Examples

- As a developer, import sendMessageToQueue, set QUEUE_URL, and enqueue a custom digest object.
- As a CLI user, run npm start -- --send-queue sample.json and observe a confirmation log with messageId.
- As a tester, run npm start -- --digest to simulate a Lambda invocation and view processed log entries.
- As an automation engineer, deploy digestLambdaHandler as an AWS Lambda function triggered by SQS and monitor batchItemFailures for retries.

# Verification & Acceptance

1. All unit tests in sandbox/tests and tests/unit pass with coverage for new code paths.
2. Mocked SQSClient.send tests assert correct QueueUrl and MessageBody.
3. CLI tests for missing QUEUE_URL return non-zero exit code and descriptive error.
4. README examples execute successfully against a live or mocked queue or local invocation.
5. Linting and formatting pass without errors and dependency installation succeeds.