# Purpose
Add a new async function mergePullRequest to src/lib/main.js and a corresponding CLI flag --merge-pr to enable programmatic merging of GitHub pull requests.

# Value Proposition
Allow agentic workflows and users to automatically merge approved pull requests without writing custom scripts. This feature streamlines continuous integration, ensures consistent merge methods, and empowers automated release pipelines.

# Success Criteria & Requirements
* Extend configSchema in src/lib/main.js to include a required non-empty GITHUB_TOKEN for authentication.
* Export async function mergePullRequest(owner, repo, pullNumber, options?) from src/lib/main.js
  where owner and repo are strings, pullNumber is a number or string, and options.mergeMethod is one of "merge", "squash", or "rebase" defaulting to "merge".
* Construct a POST request to `${config.GITHUB_API_BASE_URL}repos/${owner}/${repo}/pulls/${pullNumber}/merge`
  with JSON body containing merge_method set to options.mergeMethod.
* Include Authorization header with token from config.GITHUB_TOKEN and Content-Type application/json.
* On HTTP status 200, return the parsed JSON response from GitHub. On other status codes, logError with status and response body then throw a descriptive Error.
* Increment globalThis.callCount on each invocation.

# Implementation Details
1. In src/lib/main.js update configSchema to require GITHUB_TOKEN: z.string().nonempty().
2. Import global fetch and logError at top of file if not already present.
3. Define async function mergePullRequest(owner, repo, pullNumber, options = {}):
   - Validate owner, repo, and pullNumber; throw if missing.
   - Determine mergeMethod = options.mergeMethod or "merge".
   - Build URL and invoke fetch with method POST, headers Authorization and Content-Type, and JSON body { merge_method: mergeMethod }.
   - If response status is not 200, read response text, call logError and throw Error.
   - Parse JSON response, increment callCount, and return the parsed result.
4. Export mergePullRequest alongside other utilities.
5. Create a CLI helper function processMergePr(args):
   - Detect --merge-pr in args.
   - Parse required flags --owner, --repo, --pr-number and optional --merge-method.
   - Call mergePullRequest and console.log JSON.stringify(result, null, 2).
   - Increment callCount for the CLI invocation and return true.
6. In main(args), before existing handlers insert:
   if (await processMergePr(args)) { if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })); return; }
7. Update README.md under Programmatic Usage to document mergePullRequest signature, options.mergeMethod, and example usage.
8. Update README.md under CLI Usage to document --merge-pr flag with --owner, --repo, --pr-number, --merge-method and sample output.
9. Add Vitest tests in tests/unit/main.test.js:
   - Mock global fetch for successful merge and failure cases.
   - Verify mergePullRequest returns expected object on success and increments callCount.
   - Test error handling logs and throws for non-200 responses.
   - Test processMergePr parsing logic, console.log output, and callCount increment.

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests remain unaffected.
* Validate mergePullRequest sends correct HTTP requests with proper headers and body.
* Confirm CLI --merge-pr invocation outputs expected JSON and increments callCount.
* Ensure errors trigger logError and thrown errors as described.
* Verify README.md updates render correctly without formatting issues.