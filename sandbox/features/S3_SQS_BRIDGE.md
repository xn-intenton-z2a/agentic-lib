# Objective
Enable users to bridge objects from an S3 bucket into SQS messages via a new CLI flag.

# Value Proposition
This feature allows developers and CI workflows to simulate or perform an S3 to SQS bridge using the built-in s3-sqs-bridge library, simplifying end-to-end testing and event delivery without custom scripts or manual steps.

# Requirements
1. Parse a --bridge-s3 flag along with --bucket and --queue-url parameters in the CLI.
2. Read AWS credentials from environment variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.
3. Fail with a clear error message if required parameters are missing or invalid.
4. Use the @xn-intenton-z2a/s3-sqs-bridge library to list objects in the specified bucket and enqueue messages for each object to the provided SQS queue URL.
5. After bridging completes, log the total number of messages published and any errors encountered. Honor VERBOSE_MODE and VERBOSE_STATS if enabled to include detailed logs and runtime metrics.
6. Maintain existing behavior for other flags when --bridge-s3 is absent.

# Implementation
Modify src/lib/main.js to:
1. Detect --bridge-s3 before existing commands.
2. Extract bucket and queue-url values from process.argv.
3. Import and invoke s3-sqs-bridge functions to perform the bridge operation.
4. Wrap logic in an async bridgeS3Handler that logs start, progress, and completion.
5. Integrate with global VERBOSE_MODE to add verbose fields to logs and VERBOSE_STATS to output callCount and uptime after execution.

# Tests & Verification
1. In tests/unit/main.test.js, add tests invoking main with ["--bridge-s3","--bucket","my-bucket","--queue-url","http://queue"] mocking s3-sqs-bridge to verify correct calls and parameters.
2. Simulate success and failure scenarios to confirm error handling and error logs.
3. Verify that verbose and stats flags correctly augment output when combined with --bridge-s3.
4. Ensure existing tests for other flags still pass.

# Documentation
1. Update sandbox/README.md under CLI Usage Flags to include --bridge-s3 examples with bucket and queue-url options.
2. Document required AWS environment variables and show sample JSON log output for success and error cases.