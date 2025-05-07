# Objective and Scope

Extend and unify repository health reporting and user-facing usage documentation into a single automated feature that:

- Generates and publishes a health summary in README.md with key metrics (issues, pull requests, release version, CI status, test coverage, outdated dependencies).
- Retrieves and summarizes ChatGPT API usage cost metrics from environment or billing API and includes monthly cost breakdown and total spend in the health summary.
- Populates docs/USAGE.md with detailed usage instructions and examples for CLI flags and key functions.

# Value Proposition

Automating the inclusion of ChatGPT API cost metrics alongside traditional repository health insights empowers maintainers to monitor spending trends, optimize usage, and anticipate budget needs. Consolidating usage guidance ensures end users have consistent, up-to-date instructions for all functionality.

# Requirements

## Source Updates in src/lib/main.js

- fetchRepoHealthMetrics
  - No changes: gathers repository metrics via GitHub API and local coverage data.

- fetchChatGptUsageMetrics
  - New async function that retrieves cost and usage data from OpenAI Usage API or environment-provided billing summary.
  - Accepts optional date range parameters (default to last 30 days).
  - Returns an object containing totalCost, dailyBreakdown (array of { date, cost }), currency.

- generateHealthSummaryMarkdown
  - Update to accept an optional costMetrics parameter.
  - After existing sections, add a Cost Metrics section showing total monthly spend and a table of daily costs.

- updateReadmeSection(readmeFilePath, generatedMarkdown)
  - No changes: writes health summary into README.md.

- generateUsageExamples
  - No changes: returns a markdown string containing usage examples.

- updateUsageDocs(usageDocsPath, usageMarkdown)
  - No changes.

- CLI integration
  - Add flag --include-costs to the publish-health command (alias --publish-costs).
  - When invoked, fetchChatGptUsageMetrics with default date range and pass to generateHealthSummaryMarkdown.

## Documentation Updates

- sandbox/README.md
  - Update health summary section description to mention cost metrics and how to enable them with --include-costs.
  - Add brief example of running node src/lib/main.js --publish-health --include-costs.

- docs/USAGE.md
  - Ensure instructions for the new --include-costs flag are included under the publish-health usage.

## Tests in tests/unit/main.test.js

- Mock fetchChatGptUsageMetrics to return sample cost data and verify generateHealthSummaryMarkdown includes cost section with correct figures.
- Test CLI invocation of --publish-health --include-costs triggers fetchChatGptUsageMetrics call and updateReadmeSection with cost data.

# Verification and Acceptance

- All unit tests pass under npm test.
- Manual test: run node src/lib/main.js --publish-health --include-costs and confirm README.md health section includes a Cost Metrics subsection with total spend and daily breakdown.
- Confirm default behavior of publish-health without --include-costs remains unchanged.