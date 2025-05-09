# Objective

Define a comprehensive CLI interface for core agentic-lib tasks including help, version display, SQS digest simulation, and repository metrics generation.

# Value Proposition

Unifying commands under a single CLI tool improves discoverability, reduces learning curve, and centralizes functionality for maintainers and automation workflows without fragmentation.

# Scope

- Extend src/lib/main.js to support the following flags:
  - `--help`: Show detailed usage instructions.
  - `--version`: Print JSON with the library version and current timestamp.
  - `--digest`: Simulate an SQS digest event using createSQSEventFromDigest and digestLambdaHandler.
  - `--metrics`: Fetch GitHub Actions workflow run data and generate a Markdown metrics dashboard.

- Implement fetchRepositoryMetrics:
  - Authenticate with GitHub via GITHUB_TOKEN and optional GITHUB_API_BASE_URL.
  - Retrieve the 30 most recent runs for each workflow using @octokit/rest.
  - Compute total runs, success rates, and average durations.

- Implement renderMetricsDashboard:
  - Format metrics into a Markdown table with columns: Workflow Name, Total Runs, Success Rate, Avg Duration.
  - Write output to sandbox/docs/REPOSITORY_METRICS_DASHBOARD.md and log a confirmation message.

- Update package.json to add @octokit/rest as a dependency.

- Add or update unit tests in sandbox/tests to:
  - Mock Octokit responses and verify renderMetricsDashboard output.
  - Verify that each CLI flag dispatches the correct behavior.

- Update sandbox/README.md with clear examples for running each flag and interpreting outputs.

# Requirements

Must run in Node 20 ESM context. Require a valid GITHUB_TOKEN for metrics. Use zod for any additional config validation. Handle API errors and rate limits gracefully by logging errors without crashing. Preserve VERBOSE_STATS behavior for optional debug output.

# Success Criteria

- `node src/lib/main.js --help` displays usage text and exits normally.
- `node src/lib/main.js --version` outputs valid JSON with version and timestamp.
- `node src/lib/main.js --digest` invokes the lambda handler, logs info entries, and returns no failures.
- `node src/lib/main.js --metrics` creates or updates sandbox/docs/REPOSITORY_METRICS_DASHBOARD.md with an accurate Markdown table.
- All existing and new tests pass with 100% coverage of CLI dispatch and metrics logic.

# Verification

1. Run `npm test` to confirm all tests pass.
2. Set GITHUB_TOKEN and run each CLI flag to verify behavior and output files.
3. Inspect sandbox/docs/REPOSITORY_METRICS_DASHBOARD.md for correct formatting and data accuracy.