# Objective and Scope
Automatically collect key repository health metrics and publish them as comments in a specified GitHub Discussion. The feature fetches counts of open issues, open pull requests, stars, forks, watchers, and other basic repository metadata, formats these into a clear markdown summary, and posts or updates the comment in the target discussion thread.

# Value Proposition
Teams and contributors gain immediate visibility into repository health without manual lookups. By centralizing metrics in GitHub Discussions, maintainers and stakeholders can track trends over time, spot growth or emerging issues, and facilitate data-driven prioritization decisions.

# Requirements

- In src/lib/main.js add a function called fetchRepoStats that:
  - Accepts parameters owner and repo
  - Calls the GitHub REST API endpoint GET /repos/{owner}/{repo} to retrieve stars, forks, watchers
  - Calls GET /repos/{owner}/{repo}/issues?state=open to count open issues
  - Calls GET /repos/{owner}/{repo}/pulls?state=open to count open pull requests
  - Returns an object with each metric and its current count

- In src/lib/main.js add a function called generateRepoStatsMarkdown that:
  - Accepts the stats object returned by fetchRepoStats
  - Constructs a markdown table with columns Metric and Count
  - Includes a timestamp indicating when the data was fetched

- Extend the CLI argument parser to support:
  --repo-stats with options:
    --owner <owner> the GitHub organization or user
    --repo <repo> the repository name
    --discussion-id <id> the target discussion number for posting
    --json optional flag to output raw stats as JSON

- When --repo-stats is invoked:
  - Invoke fetchRepoStats and generateRepoStatsMarkdown
  - If a discussion ID is provided, post or update a comment in that discussion via the GitHub REST API
  - If --json is provided, output the raw stats object to console instead of markdown

- Update README.md to document the new --repo-stats flag, its parameters, usage examples, and sample markdown output

- Add unit tests in tests/unit/main.test.js that:
  - Mock GitHub API responses for various metric values
  - Verify correct aggregation of counts
  - Verify markdown formatting and JSON output
  - Simulate posting behavior by mocking octokit or fetch calls and asserting correct API endpoints and payloads

# User Scenarios and Examples

1. A maintainer runs:
   node src/lib/main.js --repo-stats --owner myOrg --repo myRepo --discussion-id 42

   The tool comments in Discussion #42:

   | Metric             | Count |
   |--------------------|-------|
   | Stars              | 128   |
   | Forks              | 12    |
   | Watchers           | 54    |
   | Open Issues        | 9     |
   | Open Pull Requests | 3     |

   Fetched at 2024-06-01T12:00:00Z

2. A cron job runs nightly with JSON output:
   node src/lib/main.js --repo-stats --owner myOrg --repo myRepo --json

   Outputs raw stats object for further processing in CI pipelines

# Verification and Acceptance

- Unit tests cover normal and error responses from each API endpoint
- Integration test by running CLI in a dummy discussion context and confirming the comment is created or updated
- Manual verification that README reflects usage and sample outputs