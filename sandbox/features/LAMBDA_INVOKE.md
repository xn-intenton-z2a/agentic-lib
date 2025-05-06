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
2. Document required AWS environment variables and show sample JSON log output for both success and error cases