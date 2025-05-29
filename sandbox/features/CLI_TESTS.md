# Objective
Provide comprehensive automated test coverage for the command-line interface helper functions in src/lib/main.js, ensuring reliable behavior of generateUsage, processHelp, processVersion, and processDigest and achieving high coverage on critical CLI code paths.

# Implementation Changes
- Export the following helper functions from src/lib/main.js: generateUsage, processHelp, processVersion, processDigest.
- Update sandbox/README.md to add a new "CLI Flags" section documenting --help, --version, and --digest usage examples.

# Unit Tests
Create tests/unit/cli.test.js with Vitest and the following cases:
- generateUsage: returns a non-empty usage string containing --help, --version, and --digest.
- processHelp:
  • When args include --help: returns true and logs usage via console.log.
  • When --help is absent: returns false and does not log.
- processVersion:
  • Mock fs.readFileSync to return a known package.json with version "1.2.3".
  • When args include --version: returns true, logs a valid JSON string with version and ISO timestamp.
  • When absent: returns false without logging.
- processDigest:
  • Spy on digestLambdaHandler to return a fixed payload.
  • When args include --digest: returns true and calls digestLambdaHandler with an SQS event from createSQSEventFromDigest.
  • Without --digest: returns false and does not call the handler.

# Integration Tests
Create sandbox/tests/cli.feature.test.js using child_process.exec or execa:
- Run node src/lib/main.js --help: exit code 0 and stdout contains the usage text.
- Run node src/lib/main.js --version: stdout is valid JSON containing keys "version" matching package.json and "timestamp" matching ISO format.
- Run node src/lib/main.js --digest: stdout includes JSON log entries with a batchItemFailures property.

# Documentation
Update sandbox/README.md under a new "CLI Flags" heading:
- --help: shows usage instructions
- --version: outputs version and timestamp JSON
- --digest: invokes the digest handler and logs the result
Include example commands and expected output.

# Verification & Acceptance
- npm test passes all new and existing tests.
- Coverage report shows ≥90% coverage for src/lib/main.js.
- Manual smoke tests of each CLI flag produce the expected output.