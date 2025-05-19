# Value Proposition

Enhance the sandbox CLI to provide comprehensive simulation and dry-run support across all commands, enable replay of S3 bucket digests with filtering and batching, and implement robust health checks with structured JSON output. This empowers developers to locally plan, audit, and validate end-to-end workflows against SQS, S3, GitHub, and OpenAI before production deployment.

# Success Criteria & Requirements

## Common Flags & Dry-Run Planning

- Support --help, --mission, --version, and --dry-run across all commands.
- --dry-run produces a structured JSON plan listing each intended operation without side effects.
- Exit code 0 for success and dry-run, non-zero for runtime errors.

## Digest Ingestion & Replay

- --digest and --digest-file: parse inline JSON or file, wrap in SQS event, invoke or plan digestLambdaHandler.
- --replay-bucket <bucket>: list objects via s3-sqs-bridge, apply optional --prefix <prefix> filter.
- --batch-size <n>: chunk replay into batches, default 10.
- For each batch, wrap keys in digest events, invoke or plan handler, collect per-batch success/failure.
- Summarize total objects, batches, successes, and failures in JSON output or plan.

## Health Checks

- --health performs connectivity tests against GitHub API and OpenAI key endpoint.
- Measure latency, capture status code, error messages, and timestamp.
- Retry failed checks up to two times with exponential backoff in normal mode; plan retries in dry-run.
- Report health status as structured JSON array of check results.

# Testing & Verification

- Unit tests for each CLI flag in normal and dry-run modes using vitest.
- Mock fs/promises for --digest-file success and error paths.
- Mock s3-sqs-bridge to simulate listing, filtering, batching, and errors.
- Mock HTTP clients for GitHub and OpenAI to validate health checks and retry logic.
- Verify JSON plan structure lists operations in order and summary statistics.

# Dependencies & Constraints

- Reuse existing modules: fs/promises, s3-sqs-bridge, logging helpers, zod.
- No new external dependencies.
- Maintain compatibility with Node 20 ESM and vitest framework.
- Honor VERBOSE_MODE and VERBOSE_STATS environment flags.

# User Scenarios & Examples

## Dry-Run Plan Replay

node sandbox/source/main.js --replay-bucket my-bucket --prefix events/ --batch-size 5 --dry-run

Produces JSON plan of S3 list, batch creation, and digest handler invocations without side effects.

## Full Health Check

node sandbox/source/main.js --health

Outputs JSON report of GitHub and OpenAI connectivity, including latency and status codes.