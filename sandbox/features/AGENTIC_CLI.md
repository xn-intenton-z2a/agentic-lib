# Value Proposition

Provide a unified command-line interface for both sandbox and core modes that empowers developers to verify environment configuration, simulate digest events, replay S3 buckets, and perform integration health checks before running automated workflows. This feature reduces setup friction, accelerates troubleshooting, and ensures consistency across modes.

# Success Criteria & Requirements

## 1 Common Flags
  - --help: Show usage instructions covering all flags and exit immediately.
  - --mission: Read and print mission statement from MISSION.md.
  - --version: Read version from package.json and print JSON with version and ISO timestamp.
  - --digest: Simulate an in-memory digest, wrap as SQS event, invoke digestLambdaHandler, and log progress.
  - --digest-file <path>: Read JSON file, build SQS event, invoke digest handler, handle parse errors, log results.
  - --replay-bucket <bucket> [--prefix <prefix>]: List objects via s3-sqs-bridge, batch replay to digestLambdaHandler, and log summary statistics.
  - --health: Perform two sequential connectivity checks and emit a JSON report:
      1. GitHub API: send HEAD or GET to GITHUB_API_BASE_URL, expect 200 OK or valid JSON.
      2. OpenAI API: request list models with OPENAI_API_KEY, expect 200 OK.
    Report contains status, latencyMs, optional error messages, and timestamp. Always exit zero.

## 2 Default Behavior
  - If invoked without recognized flags, print “No command argument supplied.” followed by usage text.
  - All flags share identical behavior, usage text, and logging in sandbox and core entry points.

# Testing & Verification

- Unit tests for each flag in both modes:
  • Help outputs usage text.
  • Mission reads and prints file.
  • Version returns valid JSON structure.
  • Digest and digest-file simulate event and log calls, including error branch for invalid JSON.
  • Replay-bucket lists objects, invokes handler, logs successes and failures.
  • Health command with mocked HTTP and OpenAI clients for success and failure scenarios, verifying JSON report shape and exit code.

# Dependencies & Constraints

- Use Node 20 global fetch or light HTTP client for health checks.
- Leverage dotenv and zod for configuration parsing.
- Respect VERBOSE_MODE and VERBOSE_STATS for extended logging when enabled.
