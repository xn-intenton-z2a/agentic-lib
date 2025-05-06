# Purpose
Consolidate GitHub issue and pull request fetching into a single, unified feature that provides both programmatic APIs and CLI support for listing repository resources.

# Value Proposition
Offer a consistent interface to retrieve open or closed issues and pull requests from a GitHub repository. This reduces duplication in code and documentation, centralizes authentication handling, and improves usability by presenting a uniform usage pattern for both resource types.

# Success Criteria & Requirements
* Extend configSchema in src/lib/main.js to include optional, non-empty GITHUB_TOKEN for authenticated requests.
* Export two async functions from src/lib/main.js:
  - fetchRepoIssues(owner, repo, options?) where options.state defaults to "open".
  - fetchRepoPullRequests(owner, repo, options?) where options.state defaults to "open".
* Both functions must:
  - Validate that owner and repo are non-empty strings and throw descriptive errors if missing.
  - Construct request URL using config.GITHUB_API_BASE_URL with appropriate path (/repos/owner/repo/issues or /repos/owner/repo/pulls) and append state query parameter.
  - Include an Authorization header when config.GITHUB_TOKEN is provided.
  - Call logError and throw an Error if the HTTP status is not 200.
  - Increment globalThis.callCount on each invocation.

* CLI integration in src/lib/main.js:
  - Detect --issues and --pull-requests flags via a helper function processGitHubList(args).
  - Parse required parameters --owner <owner> and --repo <repo>, and optional --state <state> for both commands.
  - Invoke the corresponding fetch function and console.log the JSON result with JSON.stringify(results, null, 2).
  - Increment callCount for each successful CLI invocation.
  - On missing parameters or errors, call logError with context and exit with code 1.

* Documentation updates in README.md:
  - Under Programmatic Usage, document fetchRepoIssues and fetchRepoPullRequests with import examples and default behaviors.
  - Under CLI Usage, document:
    npx @xn-intenton-z2a/agentic-lib --issues --owner <owner> --repo <repo> [--state closed]
    npx @xn-intenton-z2a/agentic-lib --pull-requests --owner <owner> --repo <repo> [--state closed]
  - Provide sample JSON outputs for both commands.

# Implementation Details
1. In src/lib/main.js, update configSchema to include:
   GITHUB_TOKEN: z.string().optional().nonempty()
2. Define and export:
   async function fetchRepoIssues(owner, repo, options = {}) { ... }
   async function fetchRepoPullRequests(owner, repo, options = {}) { ... }
3. Import global fetch, logInfo, logError at the top of the file if not already present.
4. Add a CLI helper processGitHubList(args) that handles both --issues and --pull-requests flags, parses parameters, calls the appropriate function, and returns true when handled.
5. In main(args), before default output, call:
   if (await processGitHubList(args)) { if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })); return; }
6. Update sandbox/README.md in both Programmatic Usage and CLI Usage sections as described above.
7. Add Vitest unit tests in tests/unit/main.test.js to cover:
   - fetchRepoIssues and fetchRepoPullRequests success and failure cases by mocking global fetch.
   - CLI parsing logic, output via console.log, callCount increments, and exit behavior on errors.

# Verification & Acceptance
* Run npm test to confirm all new tests pass and existing tests remain unchanged.
* Verify both programmatic functions return correct arrays of issues or pull requests and increment callCount.
* Confirm CLI commands --issues and --pull-requests produce expected JSON output and error handling.
* Ensure README.md updates render correctly without formatting issues.