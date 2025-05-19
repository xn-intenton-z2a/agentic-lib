# Value Proposition

Provide a unified command-line interface for both sandbox and core modes that offers a consistent user experience for inspecting the project mission, viewing version metadata, and simulating or processing event digests. This streamlines development and debugging workflows by avoiding duplication and ensuring that both CLI entry points support the same set of commands.

# Success Criteria & Requirements

## 1. Help Command (--help)
- When invoked with --help, prints detailed usage instructions listing all supported flags: --help, --mission, --version, --digest, --digest-file.
- Exits immediately after printing help without executing other logic.

## 2. Mission Command (--mission)
- Reads MISSION.md from project root using fs/promises readFile with utf-8 encoding.
- On success, prints raw markdown content to stdout and exits.
- On failure, logs an error message and optional stack (if verbose enabled) via logError and exits.
- Supported in both sandbox/source/main.js and src/lib/main.js.

## 3. Version Command (--version)
- Reads version field from package.json via synchronous readFileSync in ESM import.
- Constructs JSON object containing version and current ISO timestamp.
- Prints JSON to stdout and exits.
- On error, logs descriptive error via logError and exits.
- Supported in both sandbox/source/main.js and src/lib/main.js.

## 4. Sample Digest Command (--digest)
- Constructs an in-memory digest object with key, value, lastModified timestamp.
- Wraps digest in an SQS event using createSQSEventFromDigest.
- Invokes digestLambdaHandler with the event and logs receipt and processing of each record via logInfo.
- Collects and returns any batchItemFailures.
- Exits after handler completes.
- Supported in both sandbox/source/main.js and src/lib/main.js.

## 5. File Digest Command (--digest-file <path>)
- Reads JSON file at given path using fs/promises readFile with utf-8 encoding.
- Parses content into a digest object; on parse success, creates an SQS event and invokes digestLambdaHandler.
- On read or parse errors, logs descriptive errors via logError and exits.
- Exits after handler completes.
- Supported in both sandbox/source/main.js and src/lib/main.js.

## 6. Default Behavior
- When invoked with no recognized flags, prints “No command argument supplied.” followed by usage instructions.
- Ensures only one command path executes per invocation and exits gracefully.

## 7. Consistency Across Modes
- Both sandbox CLI (sandbox/source/main.js) and core CLI (src/lib/main.js) must share the same usage text, logging behavior, and command semantics.
- Tests must cover each flag and each code path in both entry points.