# Objective
Generate a comprehensive repository metrics dashboard in Markdown that summarizes recent GitHub Actions workflow performance and health.

# Value Proposition
A concise dashboard provides maintainers and contributors with quick insights into CI stability, average durations, success rates, and failure trends. This reduces manual monitoring overhead, enables early detection of regressions, and supports data-driven improvements to workflows.

# Scope
- Update src/lib/main.js to introduce a new CLI flag `--metrics`.
- Implement a function `fetchRepositoryMetrics` that:
  - Uses @octokit/rest to authenticate with GitHub using a GITHUB_TOKEN environment variable.
  - Fetches the most recent 30 workflow runs across all workflows in the repository.
  - Calculates total runs, number of successful and failed runs, success rate percentage, and average run duration.
- Implement a function `renderMetricsDashboard` that:
  - Formats the metrics into a Markdown table with columns: Workflow Name, Total Runs, Success Rate, Avg Duration.
  - Writes the output to `sandbox/docs/REPOSITORY_METRICS_DASHBOARD.md`.
  - Prints a confirmation message on success.
- Update package.json dependencies to include `@octokit/rest`.
- Add unit tests in `sandbox/tests/metricsDashboard.test.js` that:
  - Mock the Octokit REST client to return sample workflow run data.
  - Verify that `renderMetricsDashboard` produces the expected Markdown table.
- Update `sandbox/README.md` with instructions and an example of running `node src/lib/main.js --metrics` and previewing the generated dashboard.

# Requirements
- Must run in Node 20 ESM context.
- Require a valid GITHUB_TOKEN environment variable with permission to read workflow runs.
- Gracefully handle API errors and rate limits by logging errors without crashing.
- Limit data to the 30 most recent runs per workflow to bound execution time.

# Success Criteria
- Running `node src/lib/main.js --metrics` creates or updates `sandbox/docs/REPOSITORY_METRICS_DASHBOARD.md` containing a valid Markdown table summarizing metrics.
- Unit tests for `fetchRepositoryMetrics` and `renderMetricsDashboard` pass with 100% coverage for the new logic.
- Documentation in README demonstrates usage and sample output.

# Verification
1. Install new dependency and run `npm test` to ensure all tests pass.
2. Set `GITHUB_TOKEN` and execute `node src/lib/main.js --metrics`.
3. Inspect `sandbox/docs/REPOSITORY_METRICS_DASHBOARD.md` for a correctly formatted table and valid data.
