# Objective and Scope
Extend and unify repository health reporting and user-facing usage documentation into a single automated feature that:

- Generates and publishes a health summary in README.md with key metrics (issues, pull requests, release version, CI status, test coverage, outdated dependencies).
- Retrieves and summarizes ChatGPT API usage cost metrics from environment or billing API and includes monthly cost breakdown and total spend in the health summary.
- Populates docs/USAGE.md with detailed usage instructions and examples for CLI flags and key functions.
- Embeds visual metrics into GitHub discussion summaries by generating and posting simple ASCII or markdown charts that display comment frequency and reaction trends over time.

# Value Proposition
Automating the inclusion of repository health insights, cost metrics, detailed usage guidance, and visual discussion analytics empowers maintainers and contributors to monitor project health, control spending, and quickly grasp engagement patterns in discussions through immediately visible charts.

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

- fetchDiscussionComments
  - New async function that retrieves all comments and reactions for a given discussion or issue number via GitHub API.
  - Accepts discussion identifier.
  - Returns an array of comment objects including timestamp and reaction counts.

- analyzeDiscussionMetrics
  - New synchronous function that processes the fetched comments array to compute metrics such as comments per day and total reactions per day.
  - Returns an object containing dailyCounts (array of { date, comments, reactions }).

- generateMetricsChart
  - New function that takes analysis output and produces a simple ASCII or markdown bar chart showing daily comment and reaction counts.
  - Uses no external dependencies.

- generateDiscussionSummaryMarkdown
  - New function that accepts discussion identifier and options including includeVisuals flag.
  - Fetches comments, analyzes metrics, generates chart if includeVisuals is true, and returns a markdown summary containing key statistics and embedded chart.

- postDiscussionSummary
  - New async function that posts or updates a comment on the discussion with the generated summary markdown via GitHub API.

- CLI integration
  - Add flag --summarize-discussion <number> (alias --sd) to the main CLI.
  - Add flag --include-visual-metrics (alias --ivm) to control embedding charts.
  - When invoked, call generateDiscussionSummaryMarkdown and postDiscussionSummary.
  
## Documentation Updates

- sandbox/README.md
  - Update health summary section description to mention cost metrics and how to enable them with --include-costs.
  - Add a section documenting --summarize-discussion and --include-visual-metrics flags with examples:
    node src/lib/main.js --summarize-discussion 42 --include-visual-metrics

- docs/USAGE.md
  - Ensure instructions for both publish-health options and the new discussion summary flags are included.

# Tests in tests/unit/main.test.js

- Mock fetchChatGptUsageMetrics and verify generateHealthSummaryMarkdown includes cost section correctly.
- Mock fetchDiscussionComments and analyzeDiscussionMetrics to return sample data; verify generateDiscussionSummaryMarkdown embeds a chart when includeVisuals is true.
- Test CLI invocation of --summarize-discussion 42 --include-visual-metrics triggers correct function calls and attempts to post the comment.

# Verification and Acceptance

- All unit tests pass under npm test.
- Manual test: run node src/lib/main.js --publish-health --include-costs and confirm README.md health section includes a Cost Metrics subsection.
- Manual test: run node src/lib/main.js --summarize-discussion 42 --include-visual-metrics and confirm a new comment is created or updated on issue/discussion 42 containing a visual chart of engagement metrics.
- Confirm default behavior of publish-health without --include-costs and summarize-discussion without --include-visual-metrics remains unchanged.
