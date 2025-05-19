# Value Proposition

Extend the existing sandbox CLI to fully implement file based digest ingestion, S3 bucket replay with prefix filtering and batching, comprehensive health checks, and global dry run planning across all commands. This feature empowers developers to test and replay real SQS events locally or in CI environments, validate system connectivity to GitHub and OpenAI before execution, and generate structured JSON plans for audit and debugging.

# Success Criteria & Requirements

## 1 Common Flags
- --help  Show usage instructions covering all commands and exit.
- --mission  Read and print mission statement from MISSION.md and exit.
- --version  Read version from package.json and print JSON with version and ISO timestamp then exit.
- --dry-run  When provided with any action flag, parse arguments and configuration, emit a structured JSON plan of steps and exit without side effects.

## 2 Digest Ingestion
- --digest  Simulate an in memory digest record, wrap in SQS event, invoke digestLambdaHandler or plan the invocation.
- --digest-file <path>  Read JSON file at path, build SQS event from its contents, invoke digestLambdaHandler or plan it.
- Handle file not found and invalid JSON errors gracefully, logging or planning an error step without crashing.

## 3 Bucket Replay
- --replay-bucket <bucket>  List objects in the given S3 bucket via s3-sqs-bridge.
- --prefix <prefix>  Optionally filter listed object keys by prefix.
- --batch-size <n>  Optionally override default batch chunk size (default 10).
- For each batch, wrap each object key as digest payload and invoke digestLambdaHandler or plan it.
- Summarize total objects, batches, successes, failures and report in JSON logs or plan steps.

## 4 Health Checks
- --health  Perform connectivity checks against GitHub API base URL and OpenAI API key endpoint.
- For each service, measure latency, capture status code, error messages, timestamp, and report structured JSON report or plan step.
- Retry failed checks up to two times with exponential backoff in normal mode, but just plan retries in dry run.

## 5 Exit Codes
- Exit code zero on success or dry run.
- Non zero exit codes when any handler or check fails in normal mode.

# Testing & Verification

- Unit tests for each flag in both normal and dry run modes using vitest.
- Mock fs to test --digest-file error and success paths.
- Mock s3-sqs-bridge to test listing, prefix filtering, batching, and error handling.
- Mock HTTP clients for GitHub and OpenAI to test health check reports and retries.
- Verify structured JSON plan output lists all planned operations in order.
- Verify summary statistics output includes counts and timing information.

# Dependencies & Constraints

- Reuse existing modules: fs/promises, s3-sqs-bridge, logging helpers, zod for validation.
- No new external dependencies.
- Maintain compatibility with Node 20 ESM and existing test framework vitest.
- Honor VERBOSE_MODE and VERBOSE_STATS environment flags to include additional details in execution or plan output.