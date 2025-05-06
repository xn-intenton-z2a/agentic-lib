# Purpose
Add a new async function dispatchWorkflow to src/lib/main.js and a corresponding CLI flag --dispatch-workflow to trigger GitHub Actions workflows using the GitHub REST API.

# Value Proposition
Enable agentic automation to programmatically start GitHub Actions workflows without writing custom scripts. This feature simplifies CI orchestration, allows workflows to invoke one another dynamically, and integrates dispatch operations into agentic pipelines.

# Success Criteria & Requirements
* Extend configSchema in src/lib/main.js to include a required, non-empty GITHUB_TOKEN field used for authentication.
* Export async function dispatchWorkflow(owner, repo, workflowId, ref, inputs?) from src/lib/main.js.
  - owner (string): GitHub repository owner.
  - repo (string): GitHub repository name.
  - workflowId (string): Workflow file name or ID to dispatch.
  - ref (string): The git reference (branch, tag, or commit SHA).
  - inputs (object, optional): Key-value inputs for the workflow dispatch.
* Use global fetch to send a POST request to `${config.GITHUB_API_BASE_URL}repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`.
  - Request body: JSON with properties { ref, inputs }.
  - Include Authorization header with `token ${config.GITHUB_TOKEN}`.
* Increment globalThis.callCount on each invocation before returning.
* On non-204 response, call logError with status and response body, then throw a descriptive error.

# Implementation Details
1. In src/lib/main.js update configSchema to require GITHUB_TOKEN: z.string().nonempty().
2. Define and export:
   ```js
   async function dispatchWorkflow(owner, repo, workflowId, ref, inputs = {}) {
     if (!owner || !repo || !workflowId || !ref) throw new Error("owner, repo, workflowId, and ref are required");
     const url = `${config.GITHUB_API_BASE_URL}repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`;
     const response = await fetch(url, {
       method: "POST",
       headers: { Authorization: `token ${config.GITHUB_TOKEN}`, "Content-Type": "application/json" },
       body: JSON.stringify({ ref, inputs })
     });
     if (response.status !== 204) {
       const errText = await response.text();
       logError(`Workflow dispatch failed: HTTP ${response.status}`, new Error(errText));
       throw new Error(`Dispatch request returned status ${response.status}`);
     }
     globalThis.callCount++;
   }
   ```
3. In the CLI helper section of main.js define async function processDispatchWorkflow(args) to:
   - Detect --dispatch-workflow flag.
   - Parse --owner, --repo, --workflow-id, --ref and optional --inputs-json or --inputs-file.
   - Read JSON from string or file path if needed.
   - Call dispatchWorkflow and console.log a success message or JSON summary.
   - Increment callCount for the CLI invocation and return true, otherwise return false.
4. In main(args), before default behavior, insert:
   if (await processDispatchWorkflow(args)) { if (VERBOSE_STATS) console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() })); return; }
5. Update README.md under Programmatic Usage and CLI Usage:
   - Document dispatchWorkflow API signature and examples.
   - Document --dispatch-workflow flag with required parameters and usage examples.
6. Add Vitest tests in tests/unit/main.test.js:
   - Mock global fetch for 204 success and non-204 failure.
   - Verify dispatchWorkflow throws on missing parameters, logs errors on failure, and increments callCount on success.
   - Test CLI processDispatchWorkflow parsing logic, file reading, and exit behavior on errors.

# Verification & Acceptance
* Run npm test to confirm all new tests pass and existing tests are unaffected.
* Validate that dispatchWorkflow sends correct HTTP request with headers and body.
* Confirm CLI flag --dispatch-workflow triggers dispatchWorkflow and outputs expected messages.
* Ensure callCount increments appropriately for programmatic and CLI invocations.
* Verify README.md renders correctly without formatting issues.