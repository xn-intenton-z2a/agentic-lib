# Purpose
Add an async function fetchRepoIssues to src/lib/main.js for retrieving issues from a GitHub repository and support a new CLI flag --issues to allow users to list issues directly from the command line.

# Value Proposition
Enable agentic workflows and developers to inspect and act on repository issues without writing custom code. Providing both programmatic and CLI access to issue data reduces boilerplate, accelerates automation in CI pipelines, and increases transparency of open issues.

# Success Criteria & Requirements
* Extend the configSchema in src/lib/main.js to include an optional, non-empty GITHUB_TOKEN field for authenticated requests.
* Export an async function fetchRepoIssues(owner, repo, options?) where options.state defaults to "open".
* On each invocation, increment globalThis.callCount.
* Construct the request URL using config.GITHUB_API_BASE_URL/repos/owner/repo/issues and append the state query parameter.
* Include an Authorization header when GITHUB_TOKEN is present.
* Throw a descriptive error and call logError if owner or repo is missing or if the HTTP status is not 200.
* Add support in the CLI entry point: detect --issues flag alongside required --owner and --repo parameters.
  - Validate parameters, logError and exit with code 1 on missing values.
  - Invoke fetchRepoIssues and output JSON.stringify(issues, null, 2).
  - Increment callCount for the CLI invocation.
* Update README.md under both Programmatic Usage and CLI Usage to document fetchRepoIssues API and the --issues flag with example code and sample output.
* Add Vitest unit tests in tests/unit/main.test.js:
  - Mock global fetch to simulate 200 responses returning an array of issues and verify fetchRepoIssues returns parsed JSON and callCount increments.
  - Simulate non-200 responses to ensure errors are thrown and logError is called.
  - Test missing owner or repo inputs in both fetchRepoIssues and CLI invocation to assert logError and process.exit behavior.

# Implementation Details
1. In src/lib/main.js, update configSchema to include:
     GITHUB_TOKEN: z.string().optional().nonempty()
2. After existing utilities, define and export:
     async function fetchRepoIssues(owner, repo, options = {}) {
       if (!owner || !repo) throw new Error("Owner and repo are required");
       const state = options.state || "open";
       const url = `${config.GITHUB_API_BASE_URL}repos/${owner}/${repo}/issues?state=${state}`;
       logInfo(`Fetching issues from ${owner}/${repo} with state=${state}`);
       const headers = {};
       if (config.GITHUB_TOKEN) headers.Authorization = `token ${config.GITHUB_TOKEN}`;
       const response = await fetch(url, { headers });
       if (response.status !== 200) {
         const body = await response.text();
         logError(`Failed to fetch issues: HTTP ${response.status}`, new Error(body));
         throw new Error(`GitHub API returned status ${response.status}`);
       }
       const issues = await response.json();
       globalThis.callCount++;
       return issues;
     }
3. In the CLI helper section, after processDigest, add:
     async function processIssues(args) {
       if (!args.includes("--issues")) return false;
       const idxOwner = args.indexOf("--owner");
       const idxRepo = args.indexOf("--repo");
       if (idxOwner < 0 || idxRepo < 0) {
         logError("--issues requires --owner and --repo parameters");
         process.exit(1);
       }
       const owner = args[idxOwner + 1];
       const repo = args[idxRepo + 1];
       try {
         const issues = await fetchRepoIssues(owner, repo);
         console.log(JSON.stringify(issues, null, 2));
         globalThis.callCount++;
       } catch (err) {
         logError("Error fetching issues", err);
         process.exit(1);
       }
       return true;
     }
     Insert processIssues invocation in main(args) before falling back to default output:
       if (await processIssues(args)) { if (VERBOSE_STATS) console.log(JSON.stringify({ callCount:globalThis.callCount, uptime:process.uptime() })); return; }
4. Update README.md:
   - Add Programmatic Usage section for fetchRepoIssues with import example and description.
   - Add CLI Usage entry for --issues --owner <owner> --repo <repo> with sample invocation and JSON output.
5. In tests/unit/main.test.js, add tests:
   - Unit tests for fetchRepoIssues mocking fetch for success, non-200, missing inputs.
   - CLI tests for processIssues mocking fetchRepoIssues and verifying console.log, callCount, and process.exit on errors.

# Verification & Acceptance
* Run npm test to confirm all new and existing tests pass.
* Ensure fetchRepoIssues returns correct data and increments callCount.
* Validate CLI --issues invocation handles success and error scenarios appropriately.
* Confirm README.md updates render correctly without formatting errors.