# Value Proposition

Enhance the unified sandbox CLI to support file-based digests, replay from S3 buckets, and health checks with structured dry-run planning for all commands. This extension empowers developers to test and replay specific digest files, bulk replay bucket contents, and verify system connectivity without side effects.

# Success Criteria & Requirements

## 1 Common Flags
- `--help`: Show usage instructions covering all flags and exit immediately.
- `--mission`: Read and print mission statement from MISSION.md.
- `--version`: Read version from package.json and print JSON with version and ISO timestamp.
- `--dry-run`: When provided alongside any action flag, CLI enters dry-run mode. Parse and validate arguments and configuration, emit structured JSON plan of steps, and exit without side effects.

## 2 Digest Flags
- `--digest`: Simulate an in-memory digest, wrap as SQS event, invoke digestLambdaHandler (or plan). Log progress or plan steps.
- `--digest-file <path>`: Read JSON file at path, build SQS event, invoke digest handler (or plan). Handle parse errors and log or plan the error step.

## 3 Replay Flag
- `--replay-bucket <bucket>`: List objects via s3-sqs-bridge on bucket. Optionally filter with `--prefix <prefix>`. Batch send to digestLambdaHandler (or plan), and log summary statistics.

## 4 Health Flag
- `--health`: Perform connectivity checks against configured GitHub API and OpenAI API. Report status, latencyMs, errors, and timestamp (or plan steps).

# Testing & Verification

- Unit tests for each flag combined with `--dry-run`. Confirm no network calls or handler invocations occur and plan output lists each planned operation.
- Tests for `--digest-file`: valid path should plan file read and handler invocation; invalid JSON should plan parse error without throwing.
- Tests for `--replay-bucket`: mock s3-sqs-bridge listing; verify batch planning or execution and summary logging in normal and dry-run modes.
- Tests for `--health`: mock HTTP clients; verify health checks invoked or planned, and output shape.

# Dependencies & Constraints

- No new dependencies; reuse existing modules for logging, parsing, AWS handlers, and HTTP clients.
- Maintain compatibility with Node 20 ESM, vitest, and existing test framework.
- Honor `VERBOSE_MODE` and `VERBOSE_STATS` flags for extended details in execution or plan output.