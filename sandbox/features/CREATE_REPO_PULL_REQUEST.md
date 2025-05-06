# Purpose
Add async function createRepoPullRequest in src/lib/main.js to enable programmatic creation of GitHub pull requests for agentic workflows.

# Value Proposition
Allows autonomous workflows to propose and track code changes by opening pull requests directly, fostering continuous code evolution and review.

# Success Criteria & Requirements
* Expose async function createRepoPullRequest(owner, repo, pullRequest, options?) in src/lib/main.js
* pullRequest parameter must be an object containing title, head, base, body, and optional reviewers array and labels array
* Extend configSchema to validate required GITHUB_TOKEN as a nonempty string
* Increment globalThis.callCount on each invocation
* Construct POST request to config.GITHUB_API_BASE_URL/repos/owner/repo/pulls
* Include Authorization header with Bearer GITHUB_TOKEN
* On HTTP status 201 return parsed JSON response
* Throw descriptive error when response status is not 201

# Implementation Details
Place createRepoPullRequest after createRepoIssue within the utility section of src/lib/main.js. Use global fetch for the request, logInfo before sending and logError on failures. Update configSchema.parse to require GITHUB_TOKEN. Document the new function in README.md under API usage.

# Verification & Acceptance
Add Vitest unit tests mocking global fetch for success and error scenarios. Verify that globalThis.callCount increments on each call. Confirm correct request URL and headers. Ensure existing tests continue to pass without modifications.