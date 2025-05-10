# Purpose

Extend the unified CLI entrypoint to include new operational commands for diagnostics, local testing, and integration with CI workflows, and introduce a JSON test reporter to emit structured test results for automated pipelines.

# Specification

## CLI Integration

Recognize the following flags in CLI arguments:

- `--help`: Show usage instructions and exit.
- `--version`: Print version information with a timestamp in JSON format and exit.
- `--digest`: Simulate an SQS event by generating a sample digest payload and invoking the digestLambdaHandler.
- `--validate-config`: Parse and validate environment configuration using zod. On success, output the parsed config as JSON; on failure, log errors and exit with a nonzero code.
- `--bridge`: Use the s3-sqs-bridge library to simulate or perform an S3-to-SQS bridging operation, reading from a configured S3 bucket and sending messages to a configured SQS queue.
- `--playback <file>`: Read the specified JSON file containing a serialized SQS event or array of events; parse and invoke digestLambdaHandler with the payload; log start, payload details, and completion or error.

## JSON Test Reporter Integration

Provide a dedicated test script that uses Vitest’s built-in JSON reporter to produce structured test reports suitable for CI systems:

- Add a new npm script `test:json` that runs:
  `vitest --reporter=json tests/unit/*.test.js sandbox/tests/*.test.js`
- Ensure the JSON reporter outputs a single JSON object summarizing:
  - Total tests run, passed, failed, skipped.
  - Individual test case results with names, durations, and status.
  - Aggregate error messages for failures.

## Dependencies File Changes in package.json

- Under the `scripts` section, add:
  ```json
  "test:json": "vitest --reporter=json tests/unit/*.test.js sandbox/tests/*.test.js"
  ```
- Ensure devDependencies include Vitest; no additional packages are required for JSON reporting.

## Documentation Updates in sandbox/README.md

- Add a section **JSON Test Reporting**:
  - Describe the purpose: produce machine-readable test output for CI.
  - Show example invocation: `npm run test:json`.
  - Describe expected output format, e.g. a JSON object with keys `summary` and `tests`.

## Testing & Verification

- Running `npm run test:json` should exit with code `0` and print a valid JSON object to stdout.
- When tests fail, the JSON output must include failed test entries and the process should exit with a nonzero code.
- Ensure existing test scripts (`test`, `test:unit`) remain unaffected and produce their standard reports.
