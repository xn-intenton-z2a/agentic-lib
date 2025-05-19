# Value Proposition

Provide a single, unified command-line interface for both sandbox and core modes that allows users to:

- Discover and display the project mission statement and metadata.
- Retrieve version information including build timestamp in JSON format.
- Simulate or replay event digests from memory or external JSON files, emitting structured logs and handling errors gracefully.
- Offer consistent help and default guidance on available commands.

This feature streamlines development and debugging workflows by consolidating all CLI operations into one coherent entry point.

# Success Criteria & Requirements

## 1. Help Command (--help)
- Prints detailed usage instructions with descriptions of all supported flags.
- After printing help, exits immediately without performing any other logic.
- Usage instructions list --help, --mission, --version, --digest, --digest-file.

## 2. Mission Command (--mission)
- Reads MISSION.md from project root using fs/promises readFile as UTF-8.
- On success, prints raw markdown content to stdout and exits.
- On failure, logs an error message and stack (if enabled) via logError, then exits.

## 3. Version Command (--version)
- Loads package.json via fs.readFileSync, parses version.
- Constructs object containing version and current ISO timestamp.
- Prints object as JSON to stdout and exits.
- On error, logs descriptive error via logError and exits.

## 4. Sample Digest Command (--digest)
- Builds an in-memory sample digest object with key, value, lastModified.
- Uses createSQSEventFromDigest to wrap digest in an SQS event structure.
- Invokes digestLambdaHandler with the generated event.
- Logs receipt and processing of each record with logInfo.
- Collects and returns any batchItemFailures.
- Exits immediately after handler completes.

## 5. File Digest Command (--digest-file <path>)
- Reads JSON file at provided path via fs/promises readFile.
- Parses content into digest object; on parse success, creates SQS event and invokes digestLambdaHandler.
- On file read or JSON parse errors, logs descriptive errors via logError with error details, then exits.
- Exits immediately after handler completes.

## 6. Default Behavior
- When invoked with no recognized flags, prints a "No command argument supplied." message followed by usage instructions.
- Ensures only one command path executes per invocation.

# Usage Examples

Show help
node sandbox/source/main.js --help

Show mission
node sandbox/source/main.js --mission

Show version
node sandbox/source/main.js --version

Run sample digest
node sandbox/source/main.js --digest

Run digest from file
node sandbox/source/main.js --digest-file path/to/digest.json

# Tests Coverage

- Unit tests for each flag in sandbox/tests/main.mission.test.js and additional tests in sandbox/tests:
  - --help prints usage and returns early.
  - --mission reads file and logs content; error path logs error.
  - --version outputs valid JSON with version and timestamp; error path logs error.
  - --digest invokes createSQSEventFromDigest and digestLambdaHandler; mocks logInfo and logError.
  - --digest-file reads and parses file; tests error handling on missing file and invalid JSON.
  - Default invocation prints no-argument message and usage.

# Dependencies & Constraints

- Uses existing ESM modules: fs, fs/promises, zod, dotenv.
- No new external packages introduced.
- Maintains compatibility with Node >=20 and ESM import syntax.
- Changes limited to sandbox/source, sandbox/tests, sandbox/docs, sandbox/README.md, and package.json if necessary.