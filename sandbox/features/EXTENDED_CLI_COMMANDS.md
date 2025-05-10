# Purpose

Extend the unified CLI entrypoint to include new S3-to-SQS bridging, environment configuration inspection, and playback of recorded SQS events to support replay testing. Consolidates all operational commands under a single interface for diagnostics, local testing, and integration with CI or GitHub workflows.

# Specification

## CLI Integration
Recognize the following flags in CLI arguments:
- `--help`: Show usage instructions and exit.
- `--version`: Print version information with a timestamp in JSON format and exit.
- `--digest`: Simulate an SQS event by generating a sample digest payload and invoking the digestLambdaHandler.
- `--validate-config`: Parse and validate environment configuration using zod. On success, output the parsed config as JSON; on failure, log errors and exit with nonzero code.
- `--bridge`: Use the s3-sqs-bridge library to simulate or perform an S3-to-SQS bridging operation, reading from a configured S3 bucket and sending messages to a configured SQS queue.
- `--playback <file>`: Read the specified JSON file containing a serialized SQS event or array of events; parse and invoke digestLambdaHandler with the payload; log start, payload details, and completion or error.

## Source File Changes in src/lib/main.js
- Add a `processPlayback(args)` function:
  - Detect `--playback` flag and capture the file path argument.
  - Read the JSON file from disk asynchronously using fs promises.
  - Parse the file into an SQS event object or array of events.
  - Invoke `digestLambdaHandler` with the parsed event.
  - Log start and completion messages via `logInfo`; on error, call `logError` and exit with code 1.
- Modify `main(args)` to call `processPlayback` after `processDigest` and before the default fallback behavior.

## Documentation Updates in sandbox/README.md
- Add a section for `--playback`:
  - Purpose: replay recorded SQS events for local testing or diagnostics.
  - Example invocation: node src/lib/main.js --playback sampleEvent.json
  - Required file format: JSON representing a single SQS event object or an array of such objects.

## Testing
- Create unit tests in sandbox/tests/playback.test.js:
  - Mock fs to simulate valid JSON content, invalid JSON, and missing files.
  - Mock `digestLambdaHandler` to verify it receives the correct parsed payload.
  - Verify that valid files produce start and completion logs and exit code 0.
  - Verify that invalid or missing files produce error logs and exit code 1.
- Ensure existing tests for help, version, digest, validate-config, and bridge continue to pass.

# Success Criteria & Verification

- `node src/lib/main.js --playback path/to/events.json` invokes `digestLambdaHandler` with the correct payload and logs start and completion messages.
- Errors resulting from missing or malformed files are logged via `logError` and exit code is 1.
- All existing CLI flags continue to function without regression.