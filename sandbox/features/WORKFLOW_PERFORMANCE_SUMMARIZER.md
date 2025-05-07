# Objective and Scope
Summarize recent GitHub Actions workflow run performance metrics and post them as discussion comments in pull requests or issues. The feature fetches workflow run data, calculates key performance indicators, and generates a clear markdown summary for team visibility in discussions.

# Value Proposition
Teams gain immediate insight into workflow performance trends, detect regressions in build or test durations, and make data driven decisions without manually inspecting each run. Embedding summaries in pull request or issue discussions centralizes information and streamlines performance monitoring.

# Requirements

- In src/lib/main.js add a function called summarizeWorkflowPerformance that
  - Accepts parameters owner, repo, workflowId or filename, and number of runs to include
  - Uses the GitHub REST API to fetch the last N workflow run records for the specified workflow
  - Calculates overall success rate, average duration, fastest and slowest run
  - Optionally fetches step level durations when available
  - Constructs a markdown summary table with columns Run Number, Status, Duration, Conclusion

- Extend the CLI parser to support a new flag --performance-summary with options --owner, --repo, --workflow-id, --runs

- When --performance-summary is invoked in the context of a pull request or issue discussion, post or update a comment via the GitHub API with the generated markdown summary

- Update README.md to document the new flag, parameters, usage examples, and sample output of the performance summary

- Add unit tests in tests/unit/main.test.js that mock GitHub API responses to simulate various run data scenarios and verify correct summary calculation and formatting

- Ensure existing flags --help, --version, --digest, and summarization remain unaffected

# User Scenarios and Examples

1. A developer runs:
   node src/lib/main.js --performance-summary --owner myOrg --repo myRepo --workflow-id build.yml --runs 5

   After execution a markdown table comment is posted in the current pull request:

   | Run   | Status  | Duration |
   | ----- | ------- | -------- |
   | 125   | success | 2m 30s   |
   | 124   | success | 2m 45s   |
   | 123   | failure | 3m 10s   |
   | 122   | success | 2m 25s   |
   | 121   | success | 2m 40s   |

   Summary: Success rate 80%, average duration 2m 46s

2. A daily scheduled CI job invokes summary on an issue for tracking trends across multiple workflows

# Verification and Acceptance

- Unit tests cover summary calculation edge cases such as no runs, all failures, mixed outcomes
- Manual test by invoking the CLI in a pull request context and verifying the comment is created or updated correctly
- Confirm integration in CI outputs JSON formatted metrics when combined with --json alongside --performance-summary