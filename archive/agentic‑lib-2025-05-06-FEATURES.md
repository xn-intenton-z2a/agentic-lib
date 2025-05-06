sandbox/features/S3_SQS_BRIDGE.md
# sandbox/features/S3_SQS_BRIDGE.md
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
2. Document required AWS environment variables and show sample JSON log output for success and error cases.sandbox/features/VERBOSE_LOGGING.md
# sandbox/features/VERBOSE_LOGGING.md
# Objective
Enable users to turn on detailed logging and statistics output via new CLI flags, improving observability and debugging in workflows.

# Value Proposition
With verbose logs and runtime metrics available on demand, developers can quickly diagnose failures, trace execution steps, and measure performance in local or CI environments without changing code.

# Requirements
1. Support a --verbose flag that enables inclusion of a verbose field in info logs and full error stack traces in error logs.
2. Support a --verbose-stats flag that, when combined with any command, prints callCount and uptime metrics after execution.
3. Update the usage instructions to document both flags under CLI Helper Functions.
4. Maintain backward compatibility: existing behavior when flags are absent must remain unchanged.
5. Provide unit tests covering scenarios with and without each flag, including error handling with verbose enabled.
6. Update README to include examples of invoking the CLI with --verbose and --verbose-stats and sample output.

# Implementation
Modify src/lib/main.js to:
1. Parse args for --verbose and --verbose-stats before processing help, version, or digest flags.
2. Set global constants VERBOSE_MODE and VERBOSE_STATS based on presence of flags.
3. Enhance logInfo to add a verbose property when VERBOSE_MODE is true.
4. Enhance logError to include error.stack when VERBOSE_MODE is true.
5. After any handled command in main, if VERBOSE_STATS is true, log callCount and uptime.
6. Update generateUsage to list both new flags with descriptions.

# Tests & Verification
1. In tests/unit/main.test.js, add cases invoking main with ["--verbose"] and a dummy command to verify console.log entries include verbose:true.
2. Add tests for --verbose-stats to confirm callCount and uptime are printed after commands.
3. Simulate error within a handler to verify error.stack appears when verbose mode is on.
4. Ensure existing tests without flags still pass with unchanged output.

# Documentation
1. Update sandbox/README.md to add a section for CLI Usage Flags showing examples of --verbose and --verbose-stats.
2. Include sample JSON log entries demonstrating the verbose field and stats output.
sandbox/features/DIGEST_COMMAND.md
# sandbox/features/DIGEST_COMMAND.md
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
sandbox/features/LAMBDA_INVOKE.md
# sandbox/features/LAMBDA_INVOKE.md
# Objective
Enable users to invoke AWS Lambda functions directly from the CLI using a new flag

# Value Proposition
This feature allows developers and workflows to remotely trigger Lambda functions with custom payloads using the existing AWS SDK dependency without writing custom scripts or separate infrastructure code

# Requirements
1. Parse a --invoke-lambda flag with required parameters function-name and payload-file in the CLI
2. Read AWS credentials AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION from environment variables
3. Fail with clear error messages if parameters are missing, invalid, or if the invocation fails
4. Use @aws-sdk/client-lambda LambdaClient and InvokeCommand to call the specified Lambda function with the JSON payload
5. Log the invocation status code and any returned payload. Honor VERBOSE_MODE and VERBOSE_STATS flags for additional debug output and metrics
6. Maintain existing behavior for other CLI flags when --invoke-lambda is absent

# Implementation
Modify src/lib/main.js to
1. Detect --invoke-lambda before existing commands in main
2. Extract function-name and payload-file values from process.argv
3. Import LambdaClient and InvokeCommand from @aws-sdk/client-lambda
4. Read the payload-file from the filesystem and parse it as JSON
5. Instantiate LambdaClient with credentials and region from environment
6. Invoke InvokeCommand with the target function name and payload, then await the response
7. Use logInfo to output success details or logError for failures. Include full response object when VERBOSE_MODE is true and output callCount and uptime when VERBOSE_STATS is true

# Tests & Verification
1. In tests/unit/main.test.js add tests invoking main with ["--invoke-lambda","--function-name","myFunc","--payload-file","path/to/payload.json"] mocking LambdaClient to verify correct API calls and parameters
2. Simulate successful invocation and failure scenarios to confirm proper error handling and logs
3. Verify that verbose and stats flags augment output as expected when combined with --invoke-lambda
4. Ensure existing tests for help, version, and digest flags continue to pass unchanged

# Documentation
1. Update sandbox/README.md under CLI Usage Flags to include examples of invoking the CLI with --invoke-lambda along with function-name and payload-file options
2. Document required AWS environment variables and show sample JSON log output for both success and error casessandbox/features/CHAT_COMMAND.md
# sandbox/features/CHAT_COMMAND.md
# Objective
Add a new --chat flag to the CLI allowing users to send a prompt to the OpenAI API and receive a completion.

# Value Proposition
With this feature, developers can experiment with and integrate AI-driven chat completions directly from the CLI using their existing OPENAI_API_KEY environment setup, simplifying local testing, debugging, and automation scenarios without additional scripts.

# Requirements
1. Detect a --chat flag in the CLI argument parser before existing commands.
2. Require a --prompt parameter followed by the prompt text; fail with a clear error if missing.
3. Read OPENAI_API_KEY from environment variables; fail if undefined.
4. Import Configuration and OpenAIApi from the openai package.
5. Instantiate an OpenAIApi client using the environment API key.
6. Call createChatCompletion with model gpt-3.5-turbo and the provided prompt.
7. Upon success, log the completion text via logInfo; include full raw response if VERBOSE_MODE is true.
8. On error, log via logError with error.stack if VERBOSE_MODE is true and exit with non-zero status.
9. After execution, if VERBOSE_STATS is true, log callCount and uptime.
10. Maintain existing behavior for other flags when --chat is absent.

# Implementation
Modify src/lib/main.js to:
1. Add a processChat function that checks for --chat and extracts --prompt value.
2. Within processChat, verify OPENAI_API_KEY, instantiate OpenAIApi, and await createChatCompletion.
3. Use logInfo to output the chat completion and logError on failures.
4. Integrate VERBOSE_MODE and VERBOSE_STATS flags in processChat identical to existing flags.
5. Insert processChat invocation in main before processDigest.

# Tests & Verification
1. In tests/unit/main.test.js, add tests invoking main with ["--chat","--prompt","Hello"] mocking OpenAIApi to verify correct API instantiation and parameters.
2. Simulate OpenAI API errors to ensure logError is called and process exits with non-zero status.
3. Verify verbose and stats flags correctly augment chat output and append metrics.
4. Ensure existing tests for other commands remain unaffected.

# Documentation
1. Update sandbox/README.md under CLI Usage Flags to include --chat and --prompt examples.
2. Document required OPENAI_API_KEY environment variable and show sample JSON log entries for both success and error cases.
