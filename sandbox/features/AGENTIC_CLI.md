# Value Proposition
Extend the existing CLI across both sandbox and library entry points to include two new capabilities:  --invoke-lambda for remote AWS Lambda invocation and --simulate-s3 for end-to-end S3-to-SQS event simulation. This empowers users to test real integration flows locally and simulate upstream S3 events feeding into existing digest handlers.

# Success Criteria & Requirements

## 1. New --invoke-lambda Flag in Both Entry Points
- CLI must recognize a new flag --invoke-lambda <functionName> and optional --file <path> in both src/lib/main.js and sandbox/source/main.js.
- When --invoke-lambda is provided, skip any other commands and perform:
  - Read digest data from the provided file path or fall back to the existing exampleDigest object.
  - Generate an SQS event by calling createSQSEventFromDigest with the digest.
  - Invoke the specified AWS Lambda function using the AWS SDK.
- Require AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY to be defined. If missing, call logError and exit with a non-zero code.

## 2. New --simulate-s3 Flag in Both Entry Points
- CLI must recognize flags --simulate-s3 <bucketName> --object <objectKey> with optional --event-type <eventType> and --file <path> in both src/lib/main.js and sandbox/source/main.js.
- When --simulate-s3 is provided, skip any other commands and perform:
  - Read object content from the provided file path or use a default empty JSON object.
  - Generate an S3 event record by calling createSQSEventFromS3 from @xn-intenton-z2a/s3-sqs-bridge with bucketName, objectKey, content, and eventType.
  - Invoke digestLambdaHandler with the generated SQS event.
  - On any error, call logError and exit gracefully.

## 3. AWS Lambda and S3-SQS Bridge Integration
- Import LambdaClient and InvokeCommand from @aws-sdk/client-lambda and import createSQSEventFromS3 from @xn-intenton-z2a/s3-sqs-bridge in both entry files.
- Use default credential resolution for LambdaClient with AWS_REGION.
- Pass correct parameters to InvokeCommand and call client.send.
- Use createSQSEventFromS3 for S3 simulation.

## 4. Tests Coverage
- Add unit tests in tests/unit/main.cli.invoke.test.js, tests/unit/main.cli.simulate-s3.test.js, sandbox/tests/cli.invoke.test.js, and sandbox/tests/cli.simulate-s3.test.js.
- Mock @aws-sdk/client-lambda and @xn-intenton-z2a/s3-sqs-bridge to simulate success and failure scenarios.
- Verify correct construction of clients and commands, correct payloads, logging on success, and error handling on failure or missing credentials.

## 5. Usage Documentation
- Update generateUsage in both entry files to include:
    --invoke-lambda "<functionName>" [--file "<digestFile>"]    Invoke an AWS Lambda with a generated or file-based SQS event payload.
    --simulate-s3 "<bucketName>" --object "<objectKey>" [--event-type "<type>"] [--file "<objectFile>"]    Simulate an S3 event, generate an SQS event, and invoke the digest handler.
- Update README.md and sandbox/README.md with examples:
    node src/lib/main.js --simulate-s3 my-bucket --object path/to/object.json --event-type ObjectCreated:Put --file ./data.json
    node sandbox/source/main.js --simulate-s3 my-bucket --object key.txt

## Dependencies & Constraints
- Leverage existing @aws-sdk/client-lambda and @xn-intenton-z2a/s3-sqs-bridge dependencies; no new packages.
- Changes limited to source files, test files, README files, and package.json if needed.
- Maintain ESM standards, Node >=20 compatibility, and existing coding style.