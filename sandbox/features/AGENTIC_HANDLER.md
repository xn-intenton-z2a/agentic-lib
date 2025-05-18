# Value Proposition

- Extend CLI to simulate AWS S3 PutObject events for local testing of S3-triggered lambdas.
- Enable developers to specify bucket and object key to generate realistic S3 event records.

# Success Criteria & Requirements

## CLI Flag Parsing

- In sandbox/source/main.js:
  - Parse `--s3-event` flag followed by bucketName and objectKey arguments.
  - Fallback bucketName to environment variable `S3_BUCKET_NAME` if not provided.
  - Remove flag and its arguments before invoking processS3Event.

## S3 Event Creator and Handler

- In src/lib/main.js:
  - Export function `createS3PutObjectEvent(bucketName, objectKey)` returning an event object with Records array containing an AWS S3 PutObject notification record:
    - eventVersion: "2.1"
    - eventSource: "aws:s3"
    - s3.bucket.name: bucketName
    - s3.object.key: objectKey
  - Export async function `s3LambdaHandler(s3Event)` that logs receipt of the event and details via logInfo.

## CLI Implementation

- In sandbox/source/main.js:
  - Implement `processS3Event(args)` to detect the `--s3-event` flag, construct the event via createS3PutObjectEvent, and invoke s3LambdaHandler.
  - Integrate `processS3Event` into main execution flow before default help.
  - Log outputs consistent with existing logInfo format.

## Documentation

- Update `generateUsage()` in both sandbox/source/main.js and sandbox/README.md to list `--s3-event [bucketName] [objectKey]` option with description.
- Add usage examples in sandbox/README.md for the S3 event simulation.

# User Scenarios & Examples

## Simulate S3 PutObject Event

```
node sandbox/source/main.js --s3-event my-bucket path/to/object.json
```
Expect log entries indicating the S3 event received with bucket: my-bucket and object key: path/to/object.json.

# Verification & Acceptance

- Add sandbox/tests/s3.event.test.js:
  - Mock `createS3PutObjectEvent` and `s3LambdaHandler`.
  - Verify that passing bucketName and objectKey to `--s3-event` invokes handler with correct event structure.
  - Assert console.log outputs with expected logInfo JSON entries.
- Confirm existing CLI and lambda tests continue to pass.