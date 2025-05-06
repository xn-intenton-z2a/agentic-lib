# Purpose
Add an async utility function createRepoIssue to src/lib/main.js that allows agentic workflows to open new GitHub issues with structured metadata.

# Value Proposition
- Enables repositories to programmatically log findings or tasks as GitHub issues
- Complements fetchRepoIssues by providing write capability
- Empowers agentic workflows to create and track work items directly

# Success Criteria & Requirements
* Expose async function createRepoIssue(owner, repo, issue, options?) in src/lib/main.js
* Extend configSchema to include required GITHUB_TOKEN for authorization
* On each invocation increment globalThis.callCount
* Construct POST request URL from config.GITHUB_API_BASE_URL and path repos/owner/repo/issues
* Include authorization header with Bearer GITHUB_TOKEN
* Accept issue parameter as object with title, body, optional labels array, optional assignees array
* Return parsed JSON response on HTTP status 201
* Throw a descriptive error when response status is not 201

# Implementation Details
* Update configSchema.parse to require or validate GITHUB_TOKEN as nonempty string
* Implement createRepoIssue using global fetch, setting method to POST and JSON stringifying body
* Use logInfo to log request details and logError for failures
* Place the function under the utility section after fetchRepoIssues in main.js
* Update README.md to document createRepoIssue API usage with example parameters and expected output

# Verification & Acceptance
* Write Vitest unit tests mocking global fetch for both success (status 201) and error scenarios
* Verify that globalThis.callCount increments for each createRepoIssue call
* Ensure descriptive errors include status code and response text
* Confirm existing tests remain unaffected