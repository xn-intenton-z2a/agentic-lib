# Purpose
Provide a unified CLI entrypoint that supports common utilities (help, version, digest) and new environment configuration validation. This feature consolidates multiple flags into a single command set to streamline workflows, empower users with self-service diagnostics, and integrate with CI or local scripts.

# Specification

## CLI Integration
- Recognize the following flags in CLI arguments within src/lib/main.js:
  - `--help`: Show usage instructions and exit.
  - `--version`: Print version information with a timestamp in JSON format and exit.
  - `--digest`: Simulate an SQS event by generating a sample digest payload and invoking the digestLambdaHandler, then exit.
  - `--validate-config`: Parse and validate environment configuration using zod. On success, output the parsed config as JSON. On failure, log errors and exit with nonzero code.

## Source File Changes in src/lib/main.js
- Add a `processValidateConfig(args)` function:
  - Check if `--validate-config` is present.
  - Use the existing `config` object parsed by zod.
  - If validation passes, print the config object as pretty-printed JSON.
  - If validation fails, catch the exception, call `logError` with validation errors, and exit with code 1.
- Modify `main(args)` to call `processValidateConfig` early if the flag is detected, before other commands.

## Dependencies Updates
- No new runtime dependencies required; reuse `zod` for schema validation.

## Documentation Updates in sandbox/README.md
- Add a section for `--validate-config`:
  - Describe purpose: validate environment variables against schema and view effective configuration.
  - Show example invocation:
    node src/lib/main.js --validate-config
  - Display example successful output and sample error output when variables are missing.

## Testing
- Create new unit tests in sandbox/tests/validateConfig.test.js:
  - Mock missing environment variables to simulate schema violations and verify that errors are logged and process exits with code 1.
  - Mock valid environment variables and verify that pretty-printed JSON config is printed to stdout.
  - Ensure `globalThis.callCount` is unaffected by this command.

# Success Criteria & Verification
- Running `node src/lib/main.js --validate-config` prints the parsed configuration JSON when environment variables satisfy the schema.
- If required configuration is missing or invalid, the CLI logs a structured error and exits with code 1.
- Tests for validate-config pass under `npm test`, and existing tests for help, version, and digest remain unchanged and successful.
