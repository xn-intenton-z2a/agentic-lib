# Value Proposition

Extend the unified CLI to support a dry-run mode that previews all actions without producing side effects. This empowers developers to inspect and verify planned operations for digest simulation, bucket replay, and health checks before executing them.

# Success Criteria & Requirements

## 1 Common Flags
- `--help`: Show usage instructions covering all flags and exit immediately.
- `--mission`: Read and print mission statement from MISSION.md.
- `--version`: Read version from package.json and print JSON with version and ISO timestamp.
- `--digest`: Simulate an in-memory digest, wrap as SQS event, invoke digestLambdaHandler (or plan steps in dry-run), and log progress.
- `--digest-file <path>`: Read JSON file, build SQS event, invoke digest handler (or plan), handle parse errors, and log results.
- `--replay-bucket <bucket> [--prefix <prefix>]`: List objects via s3-sqs-bridge, batch replay to digestLambdaHandler (or plan), and log summary statistics.
- `--health`: Perform connectivity checks against GitHub API and OpenAI API, report status, latencyMs, errors, and timestamp (or plan steps).

## 2 Dry Run Flag
- `--dry-run`: When provided alongside any other command flag, CLI enters dry-run mode.
- In dry-run mode:
  - Parse and validate all arguments and environment configuration.
  - Do not invoke network calls, AWS handlers, or external APIs.
  - Emit a structured JSON log listing each step that would have been executed, including event creation, bucket listing, handler invocation, and health checks.
  - Exit with code zero.

# Testing & Verification

- Unit tests for `--dry-run` combined with each main flag. Verify handler functions and HTTP clients are not called when dry-run is active.
- Tests for dry-run plan output shape and content, confirming inclusion of each planned operation.
- Edge case tests: invalid JSON path with `--digest-file` in dry-run mode should still plan and report the parsing step without throwing.

# Dependencies & Constraints

- No new dependencies; reuse existing modules for logging, parsing, and handlers.
- Remain compatible with Node 20 ESM and existing test framework (vitest).
- Honor `VERBOSE_MODE` and `VERBOSE_STATS` flags for extended details in plan logs.