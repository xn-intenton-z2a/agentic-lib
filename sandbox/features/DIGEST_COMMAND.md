# Objective
Add a new --digest flag to the CLI that simulates a full bucket replay by creating an SQS event from a sample digest and invokes the digestLambdaHandler.

# Value Proposition
Enables developers to locally test and debug the digestLambdaHandler workflow end to end without setting up AWS resources or writing custom event payloads. Simplifies validation of SQS processing logic in CI and local environments.

# Requirements
1. Detect the --digest flag in the main CLI argument parser before other commands.
2. Construct a sample digest object with key, value, and lastModified fields.
3. Use createSQSEventFromDigest to build an SQS event payload.
4. Call digestLambdaHandler with the generated event and await its completion.
5. Exit the process early after the handler returns, printing callCount and uptime if VERBOSE_STATS is enabled.
6. Handle uncaught errors by logging them via logError and exiting with a non-zero status code.

# Implementation
Modify src/lib/main.js:
1. Add or update the processDigest function to match requirements if needed.
2. In main, call processDigest when --digest is found and return immediately upon success.
3. Ensure VERBOSE_STATS triggers logging of callCount and uptime after handler execution.
4. Wrap the handler invocation in try/catch to log fatal errors via logError and exit with status code 1.

# Tests & Verification
1. In tests/unit/main.test.js, add tests invoking main with ["--digest"] mocking digestLambdaHandler to verify it is called with a valid event.
2. Simulate a failure in digestLambdaHandler to confirm logError is called and that the process exits with a non-zero status code.
3. Verify that passing --verbose and --verbose-stats alongside --digest augments logs and prints metrics as expected.
4. Ensure existing tests for --help and --version continue to pass unchanged.

# Documentation
1. Update sandbox/README.md under CLI Usage Flags to include an entry for --digest with example invocation.
2. Document the sample digest schema and show sample JSON log output for both success and error scenarios.
