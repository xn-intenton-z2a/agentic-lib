# Value Proposition
Extend the existing CLI across both sandbox and library entry points to include a new --invoke-lambda flag. This empowers users to trigger a remote AWS Lambda function with a simulated or file-based SQS digest event, enabling end-to-end integration with real event processing pipelines.

# Success Criteria & Requirements

## 1. New --invoke-lambda Flag in Both Entry Points

- CLI must recognize a new flag --invoke-lambda <functionName> and optional --file <path> in both src/lib/main.js and sandbox/source/main.js.
- When --invoke-lambda is provided, skip any other commands and perform these steps:
  - Read digest data from the provided file path or fall back to the existing exampleDigest object.
  - Generate an SQS event by calling createSQSEventFromDigest with the digest.
  - Invoke the specified AWS Lambda function using the AWS SDK.
- Require AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY to be defined. If any are missing, call logError with a descriptive message and exit with a non-zero code.

## 2. AWS Lambda Integration

- Import LambdaClient and InvokeCommand from @aws-sdk/client-lambda in both entry files.
- Instantiate LambdaClient using default AWS credential resolution and the AWS_REGION environment variable.
- Construct an InvokeCommand with:
    - FunctionName set to the user-provided functionName argument.
    - Payload set to the JSON string of the generated SQS event.
- Await the client.send(command) call. If the response has a StatusCode in the 200 range:
    - Extract and decode the response.Payload, log it to stdout.
- On any invocation error, call logError with the error details and exit gracefully.

## 3. Tests Coverage

- Add unit tests in tests/unit/main.cli.invoke.test.js and sandbox/tests/cli.invoke.test.js.
- Mock @aws-sdk/client-lambda to simulate both successful and failed invocation scenarios.
- Verify that:
    - LambdaClient is constructed with correct region.
    - InvokeCommand is called with correct FunctionName and Payload.
    - CLI prints the function response on success.
    - CLI logs an error and exits on failure or missing credentials.

## 4. Usage Documentation

- Update generateUsage in both entry files to include:
    --invoke-lambda "<functionName>" [--file "<digestFile>"]    Invoke an AWS Lambda with a generated or file-based SQS event payload.
- Update README.md and sandbox/README.md with examples:
    node src/lib/main.js --invoke-lambda myFunction --file ./myDigest.json
    node sandbox/source/main.js --invoke-lambda myFunction

# Dependencies & Constraints

- Leverage the existing @aws-sdk/client-lambda dependency; no new packages.
- Changes limited to:
  - src/lib/main.js and sandbox/source/main.js to implement flag and invocation logic.
  - New or updated tests under tests/unit/ and sandbox/tests/ to cover invoke behavior.
  - README.md and sandbox/README.md to include usage examples.
- Maintain ESM standards, Node >=20 compatibility, and existing coding style.