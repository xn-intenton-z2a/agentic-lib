# Purpose

Extend the unified CLI entrypoint to include new S3-to-SQS bridging and environment configuration inspection. This consolidates all operational commands under a single interface for diagnostics, local testing, and integration with CI or GitHub workflows.

# Specification

## CLI Integration

Recognize the following flags in CLI arguments:
- `--help`: Show usage instructions and exit.
- `--version`: Print version information with a timestamp in JSON format and exit.
- `--digest`: Simulate an SQS event by generating a sample digest payload and invoking the digestLambdaHandler, then exit.
- `--validate-config`: Parse and validate environment configuration using zod. On success, output the parsed config as JSON. On failure, log errors and exit with nonzero code.
- `--bridge`: Use the s3-sqs-bridge library to simulate or perform an S3-to-SQS bridging operation, reading from a configured S3 bucket and sending messages to a configured SQS queue.

## Source File Changes in src/lib/main.js

- Add a `processValidateConfig(args)` function:
  - Detect `--validate-config` flag.
  - Validate `process.env` against `configSchema` using zod.
  - On success, print pretty JSON config and exit.
  - On failure, catch errors, call `logError`, and exit code 1.

- Add a `processBridge(args)` function:
  - Detect `--bridge` flag.
  - Dynamically import `@xn-intenton-z2a/s3-sqs-bridge`.
  - Read bucket and queue settings from environment variables or config.
  - Invoke the bridge with default or user-supplied parameters.
  - Log start and completion messages.
  - Exit after bridging completes or on error.

- Modify `main(args)` to call `processValidateConfig` and `processBridge` early, before other commands, preserving existing help, version, and digest flows.

## Documentation Updates in sandbox/README.md

- Add a section for `--validate-config`:
  - Describe purpose: validate and inspect effective environment configuration.
  - Show example invocation and output.

- Add a section for `--bridge`:
  - Describe purpose: simulate or perform S3-to-SQS bridging.
  - List required environment variables: `S3_BUCKET`, `SQS_QUEUE_URL`.
  - Show example invocation:
    node src/lib/main.js --bridge

## Testing

- Create new unit tests in sandbox/tests/bridge.test.js:
  - Mock `@xn-intenton-z2a/s3-sqs-bridge` import to simulate success and failure.
  - Verify that `processBridge` logs correct start and completion messages.
  - Simulate missing bucket or queue variables and verify error logging and exit code.

- Create new unit tests in sandbox/tests/validateConfig.test.js:
  - Mock environment variables for valid and invalid cases.
  - Confirm pretty-printed JSON on success and structured error on failure.

# Success Criteria & Verification

- `node src/lib/main.js --validate-config` prints the parsed configuration JSON when environment variables satisfy the schema, and exits code 1 on validation failure with logged errors.
- `node src/lib/main.js --bridge` invokes the S3-to-SQS bridge, logs start and completion entries, and exits with code 0 on success or code 1 on error.
- Existing tests for help, version, and digest remain unchanged and continue to pass.
- New tests for bridge and validate-config pass under `npm test`.