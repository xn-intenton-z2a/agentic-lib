# Purpose

Add an async utility function fetchRepoIssues in src/lib/main.js that retrieves issues from a GitHub repository using the configured GITHUB_API_BASE_URL and optional authentication token.

# Value Proposition

Retrieve repository issues programmatically to enable agentic workflows to inspect and act on issue data.

# Success Criteria and Requirements

* Expose async function fetchRepoIssues(owner, repo, options?) in src/lib/main.js
* Extend configSchema to include optional GITHUB_TOKEN
* On each invocation increment globalThis.callCount
* Construct request URL from config.GITHUB_API_BASE_URL and path repos owner repo issues
* Include authorization header if GITHUB_TOKEN is present
* Return parsed JSON array of issues on HTTP status 200
* Throw descriptive error when response status is not 200

# Implementation Details

* Update configSchema.parse to accept GITHUB_TOKEN as string
* Implement fetchRepoIssues using global fetch
* Use logInfo to log request start and logError if request fails
* Add function in utility section after existing createSQSEventFromDigest
* Update README.md to document fetchRepoIssues API usage with example
* Add tests for successful fetch, response error, and missing parameters

# Verification and Acceptance

* Write vitest unit tests mocking global fetch to verify returned array of issues
* Verify error thrown on non 200 status codes
* Confirm callCount increments for each call
* Ensure existing tests continue to pass unchanged