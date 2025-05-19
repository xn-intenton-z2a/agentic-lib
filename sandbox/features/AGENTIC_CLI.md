# Value Proposition

Provide a unified command-line interface in both sandbox and core contexts that allows users to discover project information, inspect mission details, simulate event streams, load custom digest payloads from file, and retrieve version metadata, all from a single entry point.

# Success Criteria & Requirements

## 1. Help Command (--help)
- When invoked with --help, display usage instructions and all available flags and their descriptions.
- After printing help, exit early without executing any other logic.
- Ensure generateUsage functions in both modules list: --help, --mission, --version, --digest, --digest-file.

## 2. Mission Command (--mission)
- When invoked with --mission, read MISSION.md from project root as UTF-8.
- On success, print raw markdown content to stdout and exit.
- On failure, call logError with descriptive message and error details then exit.

## 3. Version Command (--version)
- When invoked with --version, load package.json and parse version.
- Construct object with version and current ISO timestamp and print as JSON to stdout.
- On error, call logError with descriptive message and error stack if available, then exit.

## 4. Sample Digest Command (--digest)
- When invoked with --digest, construct a sample digest payload with key, value, lastModified.
- Use createSQSEventFromDigest to build an SQS event and call digestLambdaHandler with it.
- Ensure logInfo and logError calls surface event receipt, record processing, and failures.
- After handler completes, exit early.

## 5. File Digest Command (--digest-file <path>)
- When invoked with --digest-file and a file path, read the specified JSON file as UTF-8.
- Parse JSON content into a digest object with key, value, and lastModified.
- If parsing succeeds, create SQS event via createSQSEventFromDigest and pass to digestLambdaHandler.
- On file read or JSON parse error, call logError with descriptive message and error details, then exit.
- After handler completes, exit early.

## 6. Default Behavior
- If no recognized flag is provided, print No command argument supplied. then display usage instructions.
- Ensure only one command path executes per invocation.

# Usage Documentation

Update sandbox/docs/USAGE.md and sandbox/README.md and core README/docs/USAGE.md:

Examples:

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

Add or update unit tests:
- --help prints usage and exits early in both CLI modules.
- --mission reads MISSION.md, logs content; error path logs error.
- --version prints JSON with version and timestamp; error path logs error.
- --digest invokes createSQSEventFromDigest and digestLambdaHandler; mock logging for success and failure.
- --digest-file reads file, parses JSON, invokes digestLambdaHandler; error paths for read failure and invalid JSON should log errors and exit.
- Default invocation prints no-argument message and usage.

# Dependencies & Constraints

- Use existing ESM modules: fs/promises, fs for sync reads, zod, dotenv.
- Do not introduce new external packages.
- Maintain Node >=20 compatibility and ESM structure.
- Limit changes to source files, test files, README files, docs, and package.json if necessary.