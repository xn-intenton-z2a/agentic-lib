# Purpose
Add an async function createIssueComment to src/lib/main.js that allows agentic workflows to post comments on existing GitHub issues.

# Value Proposition
Enable autonomous systems to annotate and enrich issue discussions programmatically, providing context, decisions, or follow-up actions without manual intervention. This strengthens feedback loops and documentation in fully agentic workflows.

# Success Criteria & Requirements
* Expose async function createIssueComment(owner, repo, issueNumber, body, options?) in src/lib/main.js
* Extend configSchema.parse to require GITHUB_TOKEN as a nonempty string if not already enforced
* Increment globalThis.callCount on each invocation
* Construct POST request URL: `${config.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/issues/${issueNumber}/comments`
* Request body must be JSON: { body: body }
* Include Authorization header: Bearer GITHUB_TOKEN
* On HTTP status 201 return parsed JSON response
* On non-201 status throw an error including status code and response text

# Implementation Details
1. In src/lib/main.js, after createRepoIssue, define createIssueComment following the existing pattern of using global fetch
2. Use logInfo at function start with details of owner, repo, and issueNumber
3. Send POST request with correct headers and stringified body
4. On success increment callCount and return JSON
5. Catch errors, use logError for diagnostics, and rethrow with contextual message
6. Export createIssueComment alongside other utilities
7. Update README.md under API Usage to include createIssueComment with parameter descriptions and a usage example
8. Add Vitest unit tests in tests/unit/main.test.js or new file mocking global fetch for successful (201) and error scenarios

# Verification & Acceptance
* Unit tests mock fetch for both success (response.status 201) and failure (non-201) and verify returned data or thrown error
* Confirm globalThis.callCount increments correctly on each call
* Run npm test to ensure all tests pass without regressions
* Confirm documentation example compiles and runs as expected