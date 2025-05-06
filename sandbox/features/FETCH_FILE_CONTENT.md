# Purpose
Add an async function fetchFileContent to src/lib/main.js that retrieves and decodes the content of a file stored in a GitHub repository on a specified branch.

# Value Proposition
Allow agentic workflows to read repository file contents programmatically so they can analyze, transform, or base follow-up actions on code or configuration without manual steps.

# Success Criteria & Requirements
* Expose an async function fetchFileContent(owner, repo, filePath, branch, options?) exported from src/lib/main.js
* Require owner, repo, filePath parameters; default branch to 'main' if omitted; throw descriptive errors for missing or invalid arguments
* Use config.GITHUB_API_BASE_URL and include Authorization header when GITHUB_TOKEN is provided
* Perform a GET request to /repos/owner/repo/contents/filePath?ref=branch and parse JSON response
* Decode the base64 content field to UTF-8 string
* Increment globalThis.callCount on successful fetch
* On non-200 status or errors call logError with context and throw an error including status code and response text

# Implementation Details
1. In src/lib/main.js, after updateFileContent, import Buffer from global or use Buffer.from for decoding
2. Define async function fetchFileContent(owner, repo, filePath, branch = 'main', options = {}) that:
   - Logs start via logInfo
   - Validates parameters
   - Constructs URL `${config.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`
   - Sends GET request with Authorization header if GITHUB_TOKEN present
   - Checks response.status === 200; parse JSON body to extract content field
   - Decode content: Buffer.from(content, 'base64').toString('utf8')
   - Increment globalThis.callCount, return decoded string
   - Catch errors, logError, and rethrow with context
3. Export fetchFileContent alongside other utilities in src/lib/main.js
4. Update README.md under Programmatic Usage with signature, parameters, and usage example
5. Add Vitest unit tests in tests/unit/main.test.js mocking global fetch for:
   - Successful GET returning a JSON object with content field; verify returned string and callCount
   - Missing parameters throwing errors
   - Error responses non-200 status causing thrown errors and logged entries

# Verification & Acceptance
* Unit tests cover success, missing args, and non-200 error scenarios
* Confirm globalThis.callCount increments correctly on success
* Run npm test to ensure all tests pass and no regressions