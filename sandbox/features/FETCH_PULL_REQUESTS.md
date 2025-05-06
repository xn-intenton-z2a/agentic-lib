# Purpose
Add an async function fetchRepoPullRequests to src/lib/main.js and a new CLI flag --pulls to fetch and display GitHub repository pull requests directly from the command line.

# Value Proposition
Provide users and agentic workflows a simple way to list open pull requests without writing custom code. This enhances visibility into ongoing development and allows automated systems to inspect PR data in CI pipelines.

# Success Criteria & Requirements
* Expose async function fetchRepoPullRequests(owner, repo, options?) in src/lib/main.js
* Require both owner and repo parameters; throw descriptive error if missing
* Use config.GITHUB_API_BASE_URL and include Authorization header with GITHUB_TOKEN if provided
* Perform GET request to /repos/owner/repo/pulls
* On HTTP status 200 parse response JSON array of pull requests, increment globalThis.callCount, and return the array
* On non-200 response or network error call logError with context and throw an error including status code and response text
* Maintain existing API exports alongside other utilities
* Add CLI flag --pulls handled in processGitHubCLI or a new processPulls function, requiring --owner and --repo; output JSON array of pull requests to stdout and exit code 0 on success
* Document --pulls in README.md under CLI Usage with example invocation
* Write Vitest tests mocking global fetch to validate:
  - Successful fetch returns correct JSON and increments callCount
  - Missing owner or repo parameter logs error and exits with code 1 for CLI
  - Non-200 HTTP status throws descriptive error

# Implementation Details
1. In src/lib/main.js below existing utilities, define async function fetchRepoPullRequests(owner, repo, options = {}) {
   - Validate parameters and throw if missing
   - Build URL `${config.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls`
   - Prepare headers including Authorization if config.OPENAI_API_KEY is not used, but GITHUB_TOKEN if present
   - Call fetch, check response.status === 200, parse JSON, increment globalThis.callCount, return data
   - Catch errors, logError and rethrow
2. Export fetchRepoPullRequests alongside other utilities
3. Extend or add in CLI Helper Functions a processPulls(args) that:
   - Checks args.includes("--pulls"), parses --owner and --repo values
   - Validates presence of values; if missing call logError and exit with code 1
   - Calls fetchRepoPullRequests, prints JSON.stringify(result, null, 2) to console, returns true
4. In main(args) before final fallback, insert if (await processPulls(args)) { if (VERBOSE_STATS) console.log stats; return; }
5. Update README.md under CLI Usage to include:
   - --pulls --owner <owner> --repo <repo>
   - Sample command and output
6. Add Vitest tests in tests/unit/main.test.js or new file:
   - Mock global fetch to return an array, verify console.log output, callCount
   - Test missing parameters cause logError and process.exit
   - Test non-200 response throws error

# Verification & Acceptance
* Run npm test and confirm all existing tests pass and new tests cover fetchRepoPullRequests and CLI flag
* Verify globalThis.callCount increments only on successful fetch
* Confirm CLI invocation with --pulls outputs valid JSON and exits 0
* Confirm descriptive errors and exit code 1 for missing parameters and fetch errors
* Ensure no new dependencies are added and code style matches existing patterns