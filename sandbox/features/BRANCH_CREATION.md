# Purpose
Add async function createRepoBranch to src/lib/main.js to allow creation of new branches in a GitHub repository.

# Value Proposition
Enables agentic workflows to create new branches for organizing code changes autonomously.

# Success Criteria & Requirements

* Expose async function createRepoBranch(owner, repo, newBranchName, sourceBranch = 'main', options?) in src/lib/main.js
* Extend configSchema.parse to require GITHUB_TOKEN as a nonempty string
* Increment globalThis.callCount on each invocation
* Perform a GET request to config.GITHUB_API_BASE_URL/repos/${owner}/${repo}/git/ref/heads/${sourceBranch} to retrieve the source branch SHA
* Perform a POST request to config.GITHUB_API_BASE_URL/repos/${owner}/${repo}/git/refs with body { ref: `refs/heads/${newBranchName}`, sha: <source SHA> }
* Include Authorization header with Bearer GITHUB_TOKEN
* Return parsed JSON response on HTTP status 201
* Throw a descriptive error including status code and response text when the request fails

# Implementation Details

* Update src/lib/main.js: place createRepoBranch after createRepoPullRequest in the utility section
* Use global fetch for both GET and POST requests
* Log request start with logInfo and failures with logError
* Update README.md to document createRepoBranch usage with an example showing owner, repo, source branch, and new branch name

# Verification & Acceptance

* Write Vitest unit tests mocking global fetch for successful creation (status 201) and error scenarios (non-201 status)
* Verify that globalThis.callCount increments for each call
* Ensure the function correctly constructs URLs and headers
* Confirm existing tests continue to pass without modifications