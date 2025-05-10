# Objective & Scope

Extend the existing CLI status command and add a GitHub Pages–hosted dashboard to visualize repository metrics. This combined feature provides both on-demand CLI insights and a web interface for continuous visibility into tool health and usage trends.

# Value Proposition

- Offer users immediate feedback via the --status flag in the CLI, including uptime, call counts, archived feature counts, and configuration values.
- Publish a static dashboard on GitHub Pages to visualize the same metrics over time using charts and summary panels.
- Enable stakeholders to monitor performance and adoption trends without installing or invoking the CLI.

# Success Criteria & Requirements

- The CLI recognizes --status with optional --format=json or --format=markdown and outputs the following metrics:
  - uptime in seconds
  - global callCount
  - archived feature documents count under sandbox/features/archived
  - Node.js process.version
  - loaded GITHUB_API_BASE_URL and OPENAI_API_KEY
- A new generateDashboardData() function serializes the metrics into metrics.json under sandbox/docs/dashboard/.
- A GitHub Actions workflow generates a static HTML dashboard using metrics.json and publishes it to the gh-pages branch.
- The dashboard displays:
  - A line chart of callCount over time
  - Current uptime and Node.js version
  - Summary cards for archived feature count and configuration values
- CLI and dashboard share the same data model and JSON schema for metrics.

# Implementation Details

1. Source Changes:
   - In sandbox/source/main.js, refactor generateStatus(format) to centralize metric collection logic into collectMetrics().
   - Add generateDashboardData() that writes collectMetrics() output as JSON to sandbox/docs/dashboard/metrics.json.
   - Update generateUsage() and help text to document --status and note the dashboard URL.
2. Tests:
   - In sandbox/tests/cli.test.js, add unit tests for collectMetrics() and generateDashboardData() verifying file output.
   - Add integration test to simulate main(['--status','--format=json']) and assert metrics.json contains expected data.
3. Documentation:
   - Create sandbox/docs/dashboard/index.html template that reads metrics.json and renders charts with a minimal JavaScript lib (e.g., Chart.js via CDN).
   - Update sandbox/docs/CLI_TOOLKIT.md and sandbox/README.md to include dashboard link (https://<owner>.github.io/<repo>/dashboard/).
4. CI/CD:
   - Add .github/workflows/deploy-dashboard.yml to run on push to main, invoking a script that regenerates metrics.json (using a headless invocation of generateDashboardData) and deploys sandbox/docs/dashboard to gh-pages.

# Verification & Acceptance

- CLI --status tests pass and metrics.json is generated in sandbox/docs/dashboard when invoked.
- Dashboard builds without errors and displays real metrics in charts.
- GitHub Actions workflow publishes the dashboard and it is accessible at the expected URL.
- Documentation updated with usage examples and dashboard link.