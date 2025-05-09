# Objective
Capture and report user feedback from GitHub Discussions into repository metrics.

# Value Proposition
Provide maintainers with actionable insights on user feedback trends directly from Discussions. Generate structured metrics for dashboards and CI integrations.

# Success Criteria & Requirements
- New CLI flag --feedback triggers data fetch from GitHub Discussions API.
- Fetch all discussion threads labeled feedback or updated since last run.
- Compute metrics:
  - Total threads fetched
  - Total comments count
  - Average sentiment score using OpenAI or basic heuristic
- Output metrics as a single JSON record via console.
- Preserve existing CLI behavior when flag is absent.

# Implementation Details
1. Extend src/lib/main.js:
   - Add processFeedback(args) to handle --feedback flag.
   - Use @octokit/rest to fetch discussions from process.env.GITHUB_API_BASE_URL owner and repo context.
   - Store and retrieve last run timestamp from environment or local file.
   - Calculate metrics and log via formatLogEntry with level info.
2. Update tests in tests/unit/main.test.js:
   - Mock Octokit methods to simulate discussion list and comments.
   - Verify metrics object shape and console output.
3. Update sandbox/README.md Usage section:
   - Document the --feedback flag and output format example.
4. Update package.json dependencies:
   - Add @octokit/rest.
   - Ensure tests pass with new dependency.

# User Scenarios
- CI collects feedback metrics daily with node main.js --feedback and uploads to monitoring.
- Local developer runs CLI to audit recent feedback and view sentiment trends.

# Verification & Acceptance
- Unit tests simulate GitHub API responses and assert correct metrics.
- Manual run against a real repository confirms JSON output structure.
- All existing tests succeed without modification when flag is not used.