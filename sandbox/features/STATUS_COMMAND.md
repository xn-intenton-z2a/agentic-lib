# Objective & Scope

Add a new CLI `--status` command to report project health metrics directly from the CLI. This command aggregates uptime, call count, archived features count, Node.js version, and loaded configuration values.

# Value Proposition

- Empowers users with real-time visibility into tool health and usage.
- Simplifies troubleshooting by exposing key runtime metrics.

# Success Criteria & Requirements

- CLI supports `--status` flag with optional `--format=json` or markdown output.
- Default output is a markdown table of metrics. JSON format outputs an object with metric keys.
- Metrics to include:
  - uptime in seconds
  - global callCount
  - count of archived feature documents in sandbox/features/archived
  - Node.js version
  - loaded GITHUB_API_BASE_URL and OPENAI_API_KEY
- Update CLI usage instructions to mention `--status`.

# Implementation Details

1. In sandbox/source/main.js:
   - Implement `generateStatus(format)` that collects metrics and returns markdown or JSON.
   - Implement `processStatus(args)` to detect the `--status` flag, call `generateStatus`, and log the output.
   - Handle optional `--format=json` flag similar to existing commands.
   - Update `generateUsage()` to include the new `--status` flag.
2. Tests:
   - In sandbox/tests/cli.test.js, add tests for `generateStatus('markdown')` and `generateStatus('json')`.
   - Add tests for `processStatus` behavior.
3. Documentation:
   - Update sandbox/README.md and sandbox/docs/CLI_TOOLKIT.md to document the new `--status` flag and usage examples.

# Testing & Verification

- Unit tests for `generateStatus('markdown')` and `generateStatus('json')` to validate output structure.
- Tests for `processStatus` returning true when triggered and logging expected output.
- Integration test: run `main(['--status','--format=json'])` and assert correct JSON object with metrics.
- Verify `npm test` passes and examples in documentation render correctly.