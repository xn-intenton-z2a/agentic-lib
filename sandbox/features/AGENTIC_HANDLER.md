# Value Proposition

- Enable dynamic control of log verbosity and runtime metrics in agentic workflows directly from the CLI.
- Provide developers and CI pipelines with fine-grained debug output and execution telemetry without manual code changes.
- Introduce a CLI command to publish JSON digests to an SQS queue for testing and integration workflows.

# Success Criteria & Requirements

- In sandbox/source/main.js:
  - Parse `--agentic`, `--verbose`, `--stats`, and `--publish` flags from process.argv at startup.  
  - Support an optional queue URL argument after `--publish`, falling back to environment variable `SQS_QUEUE_URL` if not provided.  
  - Remove these flags before invoking processAgentic or publishToSQS.  
  - Implement an async function publishToSQS(args) that:
    - Reads JSON input from stdin or from a file path if provided as an argument.  
    - Uses `@aws-sdk/client-sqs` SQSClient and SendMessageCommand to send the payload to the configured queue URL.  
    - Logs the sent message ID via console.log in JSON format: { action: "publish", messageId }.  
- In src/lib/main.js:
  - Expose support for reading `SQS_QUEUE_URL` from environment variables.  
  - Export a helper function sendSqsMessage(queueUrl, payload) that returns the SQS message ID.  
- CLI Usage Documentation:
  - Update generateUsage() in both sandbox/source/main.js and src/lib/main.js to list `--publish [queueUrl]` option with description.  
  - Update sandbox/README.md to show usage examples for the `--publish` flag.

# User Scenarios & Examples

## Agentic Workflow with Verbose Debugging

$ cat event.json | node sandbox/source/main.js --agentic --verbose
Expect detailed AI planning traces with verbose:true in each logged JSON line.

## Agentic Workflow with Runtime Metrics

$ node sandbox/source/main.js --agentic --stats < event.json
Expect a final JSON line summarizing callCount and uptime after execution.

## Publish JSON Digest to SQS Queue

$ cat digest.json | node sandbox/source/main.js --publish https://sqs.us-east-1.amazonaws.com/123456789012/my-queue
Expect a JSON line { action: "publish", messageId: "<ID>" } on successful send.

# Verification & Acceptance

- Add sandbox/tests/sqs.publish.test.js:
  - Mock `@aws-sdk/client-sqs` SQSClient and SendMessageCommand.  
  - Provide a sample JSON payload via stdin and optional queue URL argument.  
  - Assert that SQSClient is called with the correct queueUrl and message body.  
  - Assert console.log outputs a JSON object containing the sent messageId.  
- Ensure existing tests for `--mission`, `--help`, `--version`, `--digest`, and agentic flags continue to pass.  
- Confirm generateUsage includes the new `--publish` option in help output.