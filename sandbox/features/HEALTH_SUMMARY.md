# Objective and Scope
Generate and publish a concise repository health summary in the README, including metrics such as open issues count, open pull requests count, latest release version, CI workflow status, test coverage, and outdated dependencies. The feature runs as a CLI command or as part of CI and updates a designated section in README.md.

# Value Proposition
Maintainers and contributors gain immediate visibility into critical health indicators directly in the README. This drives proactive maintenance, surface bottlenecks, and simplifies status monitoring without navigating multiple dashboards or API endpoints.

# Requirements

- In src/lib/main.js add function fetchRepoHealthMetrics:
  - No parameters.
  - Obtain open issues and open pull requests counts via GitHub REST API using provided GitHub token.
  - Retrieve the latest workflow run status for the default branch from GitHub Actions API.
  - Read test coverage summary from vitest coverage-summary.json in coverage directory.
  - Execute npm outdated programmatically to list outdated dependencies and count how many are behind.

- Add function generateHealthSummaryMarkdown:
  - Accepts an object with metrics (issues, pull requests, last release, CI status, coverage percentage, outdated count).
  - Generates markdown section between markers:
    <!-- HEALTH_SUMMARY_START -->
    ...generated content...
    <!-- HEALTH_SUMMARY_END -->
  - Include headings and bullet lists for each metric.
  - Return the full markdown string including markers.

- Add function updateReadmeSection:
  - Accepts readmeFilePath (default sandbox/README.md) and generated markdown.
  - Read the existing README.md content.
  - Replace or insert the section between HEALTH_SUMMARY markers.
  - Write the updated content back to README.md.

- Extend CLI parser in main to support:
  --publish-health with options:
    --readme <path>   Path to README file (default sandbox/README.md)
    --github-token <token>   GitHub API authentication token
    --json   Output raw metrics JSON instead of updating README

- CLI Behavior:
  - When invoked with --publish-health, call fetchRepoHealthMetrics and generateHealthSummaryMarkdown.
  - If --json flag is set, output the metrics object as JSON.
  - Otherwise, call updateReadmeSection to publish the summary into README.

- Update sandbox/README.md:
  - Document the --publish-health flag, its parameters, and usage examples.
  - Show sample output and explain the HEALTH_SUMMARY markers.

- Add unit tests in tests/unit/main.test.js:
  - Mock GitHub API responses for issues, pull requests, workflow status, and releases.
  - Mock fs to simulate coverage-summary.json and README.md with existing markers.
  - Mock execution of npm outdated and test parsing of its output.
  - Verify JSON output, generated markdown structure, and correct README update behavior.

# Verification and Acceptance

- Unit tests validate metrics fetching, markdown generation, JSON output, and readme insertion.
- Manual test by running CLI with --publish-health and confirming the README section is updated with accurate metrics.
- Integration test using a real GitHub token to fetch live metrics and update a temporary README file.