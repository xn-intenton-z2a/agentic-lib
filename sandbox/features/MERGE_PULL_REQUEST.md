# Purpose
Add an async function mergeRepoPullRequest to src/lib/main.js to allow agentic workflows to merge an existing pull request in a GitHub repository.

# Value Proposition
Enable autonomous workflows to complete the code evolution loop by merging approved pull requests automatically. This closes the gap between creating pull requests and applying changes to the main codebase, reinforcing a continuous agentic feedback cycle.

# Success Criteria & Requirements

* Expose an async function mergeRepoPullRequest(owner, repo, pullNumber, options?) exported from src/lib/main.js
* options may include mergeMethod (merge, squash, rebase), commitTitle, commitMessage
* Increment globalThis.callCount on each invocation
* Use global fetch to send a PUT request to config.GITHUB_API_BASE_URL/repos/owner/repo/pulls/pullNumber/merge
* Request body must include merge_method, commit_title, commit_message as provided in options
* Include Authorization header with Bearer GITHUB_TOKEN from config
* On HTTP status 200 return parsed JSON response containing merge details
* Throw a descriptive error including HTTP status code and response text on non-200 responses

# Implementation Details

1. Update configSchema.parse to require GITHUB_TOKEN as a nonempty string if not already
2. In src/lib/main.js, after createRepoPullRequest, define mergeRepoPullRequest following the existing pattern:
   - logInfo at start with details
   - perform fetch with proper method, headers, and JSON body
   - parse JSON on success, increment callCount, return result
   - catch errors, logError and rethrow with context
3. Export mergeRepoPullRequest alongside other utilities
4. Update README.md under API Usage to document mergeRepoPullRequest parameters, default behavior, and include an example
5. Add Vitest unit tests in tests/unit/main.test.js or a new file mocking global fetch for:
   - Successful merge (status 200) and verify returned object and callCount
   - Failure scenarios (status other than 200) and verify thrown error message

# Verification & Acceptance

* Unit tests pass with both success and error cases
* globalThis.callCount increments correctly on each call
* Run npm test to confirm no regressions in existing functionality
* Verify documentation example works as expected when invoked in a CLI or programmatic context