# Objective
Provide comprehensive test coverage for the CLI helper functions and AWS Lambda handler utilities in src/lib/main.js to ensure reliability and maintain >90% coverage on critical code paths.

# Implementation Changes

Export additional helper functions from src/lib/main.js:
• generateUsage
• processHelp
• processVersion
• processDigest
• createSQSEventFromDigest (already exported)
• digestLambdaHandler (already exported)

Ensure all exports are documented in README.

# Unit Tests (tests/unit)

tests/unit/cli.test.js:
• generateUsage(): returns expected usage string matching help text.
• processHelp(): when args include "--help", returns true and logs usage; when omitted, returns false and does not log.
• processVersion(): mock fs.readFileSync to return a known package.json; calling with "--version" returns true and logs JSON with version and ISO timestamp; without flag returns false.
• processDigest(): spy on digestLambdaHandler; calling with "--digest" invokes handler with event from createSQSEventFromDigest and returns true; without flag returns false.

tests/unit/lambdaHandler.test.js:
• createSQSEventFromDigest(): given a sample object, returns event with correct Records array and JSON body.
• digestLambdaHandler():
  - valid JSON body: logs info, returns { batchItemFailures: [] } and includes handler identifier.
  - invalid JSON body: logs error, returns batchItemFailures containing the record identifier.

# Integration Feature Test (sandbox/tests)

sandbox/tests/cli.feature.test.js:
• Run node src/lib/main.js --help: exit code 0, stdout includes usage instructions.
• Run node src/lib/main.js --version: stdout is valid JSON with keys "version" and "timestamp" matching ISO8601.
• Run node src/lib/main.js --digest: stdout includes log entries indicating handler execution.

# Verification & Acceptance Criteria

• All new and existing tests pass under npm test.
• Coverage report shows >90% coverage for src/lib/main.js critical functions.
• README (sandbox/README.md) updated to document CLI flags: --help, --version, --digest with examples.
