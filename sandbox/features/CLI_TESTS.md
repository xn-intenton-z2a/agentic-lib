# Objective
Provide comprehensive automated testing for the command-line interface and core handlers in src/lib/main.js, ensuring reliable behavior of --help, --version, and --digest flags and AWS SQS event processing, and achieving >=90% coverage on critical code paths.

# Implementation Changes
1. Export helper functions from src/lib/main.js:
   • generateUsage
   • processHelp
   • processVersion
   • processDigest
   • createSQSEventFromDigest (already exported)
   • digestLambdaHandler (already exported)
2. Update sandbox/README.md to document CLI flags with examples for --help, --version, and --digest.

# Unit Tests (tests/unit)
## tests/unit/cli.test.js
• Test generateUsage returns expected usage string containing --help, --version, and --digest.
• Test processHelp: when args include --help, it returns true and logs usage to console.log; when omitted, returns false without logging.
• Test processVersion:
  - Mock fs.readFileSync to return a fake package.json with version "1.2.3".
  - When args include --version, returns true and logs a JSON string with version and valid ISO timestamp; without flag returns false and does not log.
• Test processDigest:
  - Spy on digestLambdaHandler to return a fixed payload.
  - When args include --digest, returns true and calls digestLambdaHandler with an event built by createSQSEventFromDigest; without flag returns false and does not call the handler.

## tests/unit/lambdaHandler.test.js
• Test createSQSEventFromDigest: given a sample digest object, returned event has one record with correct structure and JSON body.
• Test digestLambdaHandler:
  - Valid JSON body: mock console.log, returns { batchItemFailures: [] } and logs info entries.
  - Invalid JSON body: supply record with body set to non-JSON, spy on console.error, returns batchItemFailures containing an identifier.

# Integration Feature Test (sandbox/tests)
## sandbox/tests/cli.feature.test.js
• Use child_process.exec or execa to run node src/lib/main.js with each flag:
  1. --help: exit code 0 and stdout contains usage instructions.
  2. --version: stdout is valid JSON with keys version matching package.json and timestamp matching ISO format.
  3. --digest: stdout includes JSON log entries from digestLambdaHandler indicating handler execution.
• Ensure tests run under existing npm test script without altering patterns.

# Verification & Acceptance
• Run npm test: all new and existing tests pass.
• Coverage report shows >=90% coverage for src/lib/main.js critical paths.
• Manual smoke tests:
  - node src/lib/main.js --help
  - node src/lib/main.js --version
  - node src/lib/main.js --digest
