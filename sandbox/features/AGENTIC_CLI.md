# Value Proposition

Extend the unified command-line interface to include a health command that verifies connectivity and configuration for core integrations. Developers can quickly validate their environment and key dependencies (GitHub API and OpenAI) before running workflows, improving reliability and reducing troubleshooting time.

# Success Criteria & Requirements

## 1. Help Command (--help)
- Unchanged: print detailed usage for all supported flags including the new `--health` flag and exit immediately.

## 2. Mission Command (--mission)
- Unchanged: read and print the project mission statement from MISSION.md in both sandbox and core modes.

## 3. Version Command (--version)
- Unchanged: read version from package.json, return JSON with version and timestamp.

## 4. Sample Digest Command (--digest)
- Unchanged: simulate an in-memory digest, wrap as SQS event, invoke digestLambdaHandler, log info.

## 5. File Digest Command (--digest-file <path>)
- Unchanged: read JSON file, parse into digest, create SQS event, invoke handler, handle errors.

## 6. Replay Bucket Command (--replay-bucket <bucket> [--prefix <prefix>])
- Unchanged: use s3-sqs-bridge, list objects, batch replay to digestLambdaHandler, log summary.

## 7. Default Behavior
- Unchanged: on no recognized flags, print “No command argument supplied.” and usage.

## 8. Consistency Across Modes
- Unchanged: sandbox and core entry points must share identical usage text, flags, logging behavior.

## 9. Health Command (--health)
- When invoked with `--health`, perform two connectivity checks in sequence:
  1. GitHub API Health: send a HEAD or GET request to the configured GITHUB_API_BASE_URL (defaulting to https://api.github.com/) and verify a 200 OK response or valid JSON. Log success or failure with timing.
  2. OpenAI API Health: send a minimal authenticated request to the OpenAI API (e.g., list models endpoint) using the OPENAI_API_KEY. Verify a 200 OK response. Log success or failure with timing.
- Construct a JSON report containing:
  - github: { status: "ok"|"error", latencyMs, errorMessage? }
  - openai: { status: "ok"|"error", latencyMs, errorMessage? }
  - timestamp: ISO timestamp of the check
- Print the JSON report to stdout and exit.
- On network errors or invalid credentials, include descriptive error messages in the report but always exit with code zero (for CI health gate patterns).
- Supported in both sandbox/source/main.js and src/lib/main.js.

# Testing & Verification

- Add unit tests to cover:
  - Successful GitHub health check (mock out HTTP client to return 200).
  - Failed GitHub health check (mock non-200 status or network error).
  - Successful OpenAI health check (mock openai client to respond).
  - Failed OpenAI health check (invalid key or network error).
  - Combined report JSON structure and exit behavior.
- Use Vitest mocks for fs, HTTP and openai client to isolate behavior.

# Dependencies & Constraints

- Leverage native fetch (Node 20 global) or a lightweight HTTP client already in dependencies.
- Use the existing dotenv and config parsing for environment.
- Respect VERBOSE_MODE and VERBOSE_STATS flags for optional extended logging.
