# Purpose
Add a function to gather a summary of a GitHub Actions workflow run and automatically post it as a comment to a GitHub Discussion thread. This bridges workflow execution and team communication by surfacing run results directly in the repository’s discussion forums.

# Value Proposition
Enable teams to stay informed about CI pipeline outcomes without manually checking workflow logs. By posting structured summaries of run status, duration, and job results into Discussions, this feature accelerates feedback loops, reduces context switching, and enhances traceability of automated runs.

# Success Criteria & Requirements
* Extend configSchema in src/lib/main.js to require GITHUB_TOKEN for authentication against GitHub API.
* Export an async function postWorkflowRunSummary(owner, repo, runId, discussionNumber) from src/lib/main.js.
  - owner and repo: non-empty strings. runId: numeric or string workflow run identifier. discussionNumber: numeric discussion thread identifier.
  - Authenticate requests using config.GITHUB_TOKEN via Authorization header.
* Function behavior:
  - Fetch workflow run details from GET /repos/{owner}/{repo}/actions/runs/{runId}.
  - Fetch related jobs from GET /repos/{owner}/{repo}/actions/runs/{runId}/jobs and collect job names and conclusions.
  - Build a markdown string with headings Run Status, Started At, Completed At, Total Jobs, and a bullet list of each job name with its conclusion.
  - Post the markdown string as a comment to the discussion via POST /repos/{owner}/{repo}/discussions/{discussionNumber}/comments.
  - Increment globalThis.callCount exactly once on successful end of function.
  - On any non-2xx response, call logError with HTTP status and response body, then throw a descriptive Error.
* Add a CLI flag --workflow-run-summary in main.js:
  - Parse arguments --owner, --repo, --run-id, --discussion-number.
  - Call postWorkflowRunSummary and console.log a success confirmation or JSON summary.
  - Increment callCount for the CLI invocation and return true when handled.

# Implementation Details
1. In src/lib/main.js, update configSchema to include GITHUB_TOKEN: z.string().nonempty().
2. Import fetch at top if not present.
3. Define and export async function postWorkflowRunSummary(owner, repo, runId, discussionNumber) below existing utilities:
   - Validate parameters; throw Error on missing values.
   - Build URL strings for workflow run details, jobs list, and discussion comments endpoint.
   - Await fetch calls with proper method and headers.
   - Parse JSON bodies and extract run status, timestamps, and jobs array.
   - Format a markdown summary string with sections and job list.
   - Post comment via fetch to discussions API.
   - Handle non-2xx responses by logging and throwing.
   - Increment globalThis.callCount and return the posted comment data.
4. In the CLI helper section, define async function processRunSummary(args):
   - If args includes --workflow-run-summary, parse required flags, call postWorkflowRunSummary, console.log output, and return true.
5. In main(args), before other handlers, insert:
   if (await processRunSummary(args)) { if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })); return; }
6. Update README.md under Programmatic Usage to document postWorkflowRunSummary signature with examples and under CLI Usage to document --workflow-run-summary flag and sample invocation.
7. In tests/unit/main.test.js, add Vitest tests:
   - Mock fetch to test successful GET, GET jobs, and POST comment flows, verifying summary content and callCount increment.
   - Test error paths when any fetch returns non-2xx, asserting logError and thrown errors.

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests are unaffected.
* Manually invoke npx agentic-lib --workflow-run-summary --owner my-org --repo my-repo --run-id 123 --discussion-number 5 and verify that a comment is created and callCount increments.
* Confirm markdown summary contains correct sections and job entries.
* Ensure no new dependencies are added beyond existing built-ins.