# Objective & Scope

Implement a new CLI flag --status to report runtime health and configuration metrics directly from the CLI. This command gives users real-time visibility into tool stability, usage, and environment settings without external dependencies.

# Value Proposition

- Provide immediate insight into uptime, usage, and configuration values.
- Simplify troubleshooting by exposing key metrics in a human- or machine-readable format.
- Empower users to monitor agentic-lib health in automation workflows or local environments.

# Success Criteria & Requirements

- The CLI recognizes a --status flag and an optional --format=json or --format=markdown parameter.
- Default output is a markdown table listing the following metrics:
  - uptime in seconds
  - global callCount
  - archived feature documents count under sandbox/features/archived
  - Node.js process.version
  - loaded values for GITHUB_API_BASE_URL and OPENAI_API_KEY
- When --format=json is specified, output a JSON object with keys:
  uptimeSeconds, callCount, archivedFeatureCount, nodeVersion, GITHUB_API_BASE_URL, OPENAI_API_KEY
- Increment globalThis.callCount at the start of each CLI invocation to ensure an accurate count.

# Implementation Details

1. In sandbox/source/main.js:
   1. At the start of main(), increment globalThis.callCount.
   2. Add a generateStatus(format) function to collect metrics and serialize to markdown or JSON.
   3. Add a processStatus(args) function to detect the --status flag, call generateStatus, and log output.
   4. Update generateUsage() to document the --status flag and its formats.
2. Tests:
   1. In sandbox/tests/cli.test.js, add unit tests for generateStatus('markdown') and generateStatus('json') ensuring correct structure and content.
   2. Add tests for processStatus to verify it returns true, logs the correct output, and returns false when not triggered.
   3. Integration test: invoke main(['--status','--format=json']) and assert console.log received the expected JSON with all metrics.
3. Documentation:
   1. Update sandbox/README.md and sandbox/docs/CLI_TOOLKIT.md to include the --status flag description and usage examples in both markdown and JSON formats.

# Verification & Acceptance

- All new unit and integration tests pass under npm test.
- Documentation examples render correctly without errors.
- Usage instructions in the CLI help output include the new --status flag and its options.
