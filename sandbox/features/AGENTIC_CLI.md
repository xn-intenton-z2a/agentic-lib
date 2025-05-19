# Value Proposition

Provide a unified command-line interface for both sandbox and core modes that offers a consistent user experience to inspect the project mission, view version metadata, simulate or process event digests from memory or file, and replay real S3 bucket contents as SQS events. This streamlines development, debugging, integration testing, and batch processing workflows by avoiding duplication and ensuring both CLI entry points support the same set of commands.

# Success Criteria & Requirements

## 1. Help Command (--help)
- Invoking with `--help` prints detailed usage instructions listing all supported flags: `--help`, `--mission`, `--version`, `--digest`, `--digest-file`, `--replay-bucket` and optional `--prefix` for replay.
- Exits immediately after printing help without executing any other logic.

## 2. Mission Command (--mission)
- Reads `MISSION.md` from project root via fs/promises `readFile` with UTF-8 encoding.
- On success, prints raw markdown content to stdout and exits.
- On failure, logs an error message and optional stack (if verbose) via `logError` and exits.
- Supported in both `sandbox/source/main.js` and `src/lib/main.js`.

## 3. Version Command (--version)
- Reads the `version` field from `package.json` synchronously via `readFileSync` in ESM import.
- Constructs a JSON object containing `version` and the current ISO timestamp.
- Prints JSON to stdout and exits.
- On error, logs descriptive error via `logError` and exits.
- Supported in both entry points.

## 4. Sample Digest Command (--digest)
- Constructs an in-memory digest object with `key`, `value`, and `lastModified` timestamp.
- Wraps the digest in an SQS event using `createSQSEventFromDigest`.
- Invokes `digestLambdaHandler` with the event and logs receipt and processing of each record via `logInfo`.
- Collects and returns any `batchItemFailures`, then exits.
- Supported in both entry points.

## 5. File Digest Command (--digest-file <path>)
- Reads a JSON file at the given path using fs/promises `readFile` with UTF-8 encoding.
- Parses content into a digest object; on successful parse creates an SQS event and invokes `digestLambdaHandler`.
- On read or parse errors, logs descriptive error via `logError` and exits.
- Exits after handler completes.
- Supported in both entry points.

## 6. Replay Bucket Command (--replay-bucket <bucket> [--prefix <prefix>])
- Invoking with `--replay-bucket` and an S3 bucket name, optionally with an object prefix, imports the `@xn-intenton-z2a/s3-sqs-bridge` module.
- Calls the bridge function to list objects and generate SQS events in batches, handling pagination.
- For each batch event, invokes `digestLambdaHandler`, logging start, per-record info, and summary failures via `logInfo` and `logError`.
- On any bridge or AWS errors, logs descriptive messages and exits.
- Prints a final summary JSON object with `totalRecords`, `successCount`, and `failureCount`, then exits.
- Supported in both entry points.

## 7. Default Behavior
- When invoked with no recognized flags, prints “No command argument supplied.” followed by usage instructions.
- Ensures only one command path executes per invocation and exits gracefully.

## 8. Consistency Across Modes
- Both sandbox CLI (`sandbox/source/main.js`) and core CLI (`src/lib/main.js`) must share identical usage text, logging behavior, and command semantics for all commands above.
- Tests must cover each flag and code path in both entry points, including success and failure scenarios for file digest and replay commands.