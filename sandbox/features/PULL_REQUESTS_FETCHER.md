# Purpose
Add an async utility function fetchRepoPullRequests to src/lib/main.js to retrieve pull requests for a given GitHub repository and provide CLI support via a new flag --pull-requests.

# Value Proposition
Enable agentic workflows to inspect triage and automate actions on pull requests without writing custom code.

# Success Criteria & Requirements
* Extend configSchema to include optional GITHUB_TOKEN as nonempty string
* Expose async function fetchRepoPullRequests(owner, repo, options?) accepting owner repo and options.state defaulting to open
* Perform HTTP GET against config.GITHUB_API_BASE_URL/repos/owner/repo/pulls with the state parameter
* Include authorization header if GITHUB_TOKEN is present
* Increment globalThis.callCount on each invocation
* Throw descriptive error on non 200 responses or missing parameters

# Implementation Details
1. In src/lib/main.js update configSchema to include GITHUB_TOKEN using zod
2. Define and export fetchRepoPullRequests below existing utilities and import global fetch logInfo and logError
3. Implement processPullRequests in main in a similar manner to processIssues flag detection parameter parsing and response handling
4. Update README.md under Programmatic Usage and CLI Usage to document fetchRepoPullRequests and the new flag with examples
5. Add Vitest tests in tests/unit/main.test.js mocking global fetch for success error and missing parameters

# Verification & Acceptance
* Tests mock fetch to return an array of pull request objects and verify JSON output and callCount increment
* Tests simulate non 200 status and verify error thrown and logError called
* Tests for missing owner or repo parameters assert logError and process exit code 1
* npm test passes without regressions