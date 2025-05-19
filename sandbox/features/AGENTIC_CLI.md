# Value Proposition
Extend the existing CLI across both sandbox and library entry points to include AWS integration capabilities (--invoke-lambda, --simulate-s3) and two new natural language commands (--summarize, --refine) powered by OpenAI. This empowers users to test real AWS flows locally and perform automated summarization or refinement of SQS digest payloads.

# Success Criteria & Requirements

## 1. New --invoke-lambda Flag in Both Entry Points
- Recognize flag --invoke-lambda <functionName> with optional --file <path>.
- Skip other commands, read digest from file or use default exampleDigest.
- Generate SQS event via createSQSEventFromDigest and invoke AWS Lambda using AWS SDK.
- Require AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY; on missing credentials call logError and exit non-zero.

## 2. New --simulate-s3 Flag in Both Entry Points
- Recognize flags --simulate-s3 <bucketName> --object <objectKey> with optional --event-type <eventType> and --file <path>.
- Skip other commands, read object content from file or default to empty JSON.
- Generate S3 event record using createSQSEventFromS3 and invoke digestLambdaHandler with generated SQS event.
- On error call logError and exit gracefully.

## 3. New --summarize Flag in Both Entry Points
- Recognize flag --summarize <file>.
- Skip other commands, read SQS event from file or use default exampleDigest as SQS event.
- For each record, extract digest and call OpenAI createChatCompletion with a system prompt to produce a concise summary of the digest payload.
- Log each summary result via logInfo.
- Require OPENAI_API_KEY; on missing key call logError and exit non-zero.

## 4. New --refine Flag in Both Entry Points
- Recognize flag --refine <file>.
- Skip other commands, read JSON content from file or default digest.
- Send content to OpenAI createChatCompletion with system message instructing to refine or normalize the JSON payload structure.
- Output refined JSON to stdout and logInfo confirmation.
- Require OPENAI_API_KEY; on missing key call logError and exit non-zero.

## 5. OpenAI Integration
- Import Configuration and OpenAIApi from openai.
- Initialize OpenAIApi client with OPENAI_API_KEY.
- Use createChatCompletion API for both summarize and refine operations.

# Tests Coverage
- Add or update unit tests in tests/unit and sandbox/tests to cover:
  - AWS flags: simulate success and failure, credential validation, correct SDK calls.
  - OpenAI commands: mock openai, verify payloads, summaries, and errors when key missing.
  - CLI dispatch: correct command routing, error exit codes, and logging behavior.

# Usage Documentation
- Update generateUsage in both src/lib/main.js and sandbox/source/main.js to include examples for:
    --invoke-lambda "<functionName>" [--file "<digestFile>"]
    --simulate-s3 "<bucketName>" --object "<objectKey>" [--event-type "<type>"] [--file "<objectFile>"]
    --summarize "<sqsEventFile>"
    --refine "<jsonFile>"
- Update README.md and sandbox/README.md with usage examples for all four commands.

# Dependencies & Constraints
- Leverage existing dependencies: @aws-sdk/client-lambda, @xn-intenton-z2a/s3-sqs-bridge, openai, zod, dotenv.
- No new packages.
- Maintain ESM standards and Node >=20 compatibility.
- Changes limited to source files, test files, README files, and package.json if needed.