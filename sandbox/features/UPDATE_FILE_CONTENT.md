# Purpose
Add an async function updateFileContent to src/lib/main.js that updates the content of a file in a GitHub repository on a specified branch.

# Value Proposition
Allow agentic workflows to programmatically modify repository files, enabling code fixes, automated updates and direct integration of AI-generated patches without manual steps.

# Success Criteria & Requirements
* Expose an async function updateFileContent(owner, repo, filePath, newContent, branch, options?) exported from src/lib/main.js.
* Require owner, repo, filePath, newContent, branch parameters; throw descriptive error if missing.
* Use config.GITHUB_API_BASE_URL and require GITHUB_TOKEN in configSchema.parse for authentication.
* Perform a GET request to fetch file metadata at /repos/owner/repo/contents/filePath?ref=branch and extract sha.
* Perform a PUT request to the same endpoint with JSON body including message, content (base64 newContent), sha, and branch.
* Increment globalThis.callCount on successful update.
* On non-200 response or errors, logError with context and throw an error with status code and response text.

# Implementation Details
1. Extend configSchema.parse to require GITHUB_TOKEN as a nonempty string.
2. In src/lib/main.js after mergeRepoPullRequest, import or use Buffer for base64 encoding.
3. Define async function updateFileContent(owner, repo, filePath, newContent, branch = 'main', options = {}) that:
   * Logs start via logInfo.
   * Fetches file metadata using GET with Authorization header.
   * Extracts sha from response.
   * Encodes newContent to base64.
   * Sends PUT request with JSON body { message: options.commitMessage or default, content, sha, branch }.
   * Parses response, increments callCount, and returns JSON on HTTP status 200.
   * Catches errors, calls logError, and rethrows with context.
4. Export updateFileContent alongside other utilities.
5. Update README.md under Programmatic Usage to document updateFileContent signature, parameters, and usage example.
6. Add Vitest unit tests in tests/unit/main.test.js mocking global fetch for GET and PUT calls to cover:
   * Successful update with status 200 and callCount increment.
   * Missing parameter validation errors.
   * GET or PUT failure scenarios throwing descriptive errors.

# Verification & Acceptance
* Write tests verifying correct URLs, headers, and base64 encoding.
* Confirm globalThis.callCount increments only on successful PUT.
* Ensure errors are thrown and logged for missing parameters and non-200 responses.
* Run npm test to confirm all tests pass and no regressions in existing tests.