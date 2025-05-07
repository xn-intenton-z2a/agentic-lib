sandbox/features/WORKFLOW_CONTEXT_SUMMARY.md
# sandbox/features/WORKFLOW_CONTEXT_SUMMARY.md
# Purpose
Add a new async function generateWorkflowContextSummary to src/lib/main.js that composes a concise summary of the current GitHub Actions workflow context suitable for feeding into a discussion bot or annotation systems.

# Value Proposition
Provide agentic workflows and discussion bots with a clear, human-readable overview of repository state and workflow inputs. This summary amplifies context awareness, reduces manual inspection, and accelerates decision making in automated discussions.

# Success Criteria & Requirements
* Introduce generateWorkflowContextSummary(context, options?) exported from src/lib/main.js
* Accept a context object containing fields such as repository, ref, sha, eventName, and payload
* Support an options object to include or exclude sections (commits, environment, inputs)
* Increment globalThis.callCount on each invocation
* Return a plain string summary with labeled sections and line breaks
* No external dependencies beyond those already declared

# Implementation Details
1. Update src/lib/main.js to define generateWorkflowContextSummary below existing utilities.
2. Within the function, call logInfo when starting and logError on failures.
3. Extract values from the context object and environment variables.
4. Build a multi-section string with headings like Repository, Ref, Commit SHA, Event Name, Inputs, Payload Summary.
5. Respect options flags to omit specific sections.
6. Export the function alongside other utilities.
7. Update README.md under API Usage to document the new function and its parameters.
8. Add Vitest unit tests in tests/unit/main.test.js mocking context inputs and verifying summary string contains expected section headings and values.

# Verification & Acceptance
* Write tests for default summary including all sections
* Write tests for options excluding specific sections
* Verify globalThis.callCount increments correctly
* Run npm test to confirm all tests pass
* Confirm no lint or formatting errors are introducedsandbox/features/CLI_STATS.md
# sandbox/features/CLI_STATS.md
# Purpose
Add a new CLI flag --stats to src/lib/main.js that prints a machine-readable summary of repository and runtime metrics as JSON.

# Value Proposition
Provide users and automation systems with a quick, unified, and scriptable way to retrieve key metrics—uptime, call count, commit count, and file count—directly from the CLI, simplifying monitoring, reporting, and integration into CI/CD pipelines.

# Success Criteria & Requirements
* Export an async function generateStatsSummary(options?) from src/lib/main.js that returns an object with:
  - uptime: number of seconds from process.uptime()
  - callCount: globalThis.callCount value
  - commitCount: result of running git rev-list --count HEAD
  - fileCount: total number of files in the repository counted recursively
* Add a CLI helper async function processStats(args) in src/lib/main.js that:
  - Detects the presence of --stats in args
  - Calls generateStatsSummary()
  - Prints JSON.stringify(summary, null, 2) to standard output
  - Increments globalThis.callCount exactly once for the CLI invocation
  - Returns true when --stats is handled, false otherwise
* Integrate processStats into main(args) before existing handlers (help, version, digest) so that --stats takes priority
* On error (for example, git command failure or file system access error), call logError and exit with code 1
* No new dependencies beyond Node built-ins (fs/promises, child_process)

# Implementation Details
1. At the top of src/lib/main.js import execSync from child_process and fs from fs/promises
2. Beneath existing utilities, define:
   async function generateStatsSummary(options = {}) {
     // uptime via process.uptime()
     // callCount from globalThis.callCount
     // commitCount via execSync('git rev-list --count HEAD')
     // fileCount by recursively traversing the project root with fs.readdir and fs.stat
     // Return an object { uptime, callCount, commitCount, fileCount }
   }
3. Define:
   async function processStats(args) {
     if args includes --stats then
       const summary = await generateStatsSummary()
       console.log(JSON.stringify(summary, null, 2))
       globalThis.callCount++
       return true
     return false
   }
4. In main(args), insert at the very top:
   if await processStats(args) then return
5. Update README.md under CLI Usage to document:
   --stats
     Print JSON summary of uptime, callCount, commitCount, and fileCount
   Example:
     npx agentic-lib --stats
   Sample Output:
     {
       "uptime": 12.34,
       "callCount": 3,
       "commitCount": 42,
       "fileCount": 128
     }
6. Add Vitest tests in tests/unit/main.test.js that:
   - Mock execSync to return a known commit count string
   - Mock fs.readdir and fs.stat to simulate a fixed file hierarchy and count
   - Verify generateStatsSummary returns expected values
   - Spy on console.log and globalThis.callCount for processStats when --stats is supplied
   - Test that missing git or fs errors trigger logError and exit code 1

# Verification & Acceptance
* Run npm test to ensure new tests pass and no existing tests fail
* Manually invoke npx agentic-lib --stats and confirm correct JSON output and callCount increment
* Confirm code style, linting, and formatting remain consistentsandbox/features/WORKFLOW_DISPATCH.md
# sandbox/features/WORKFLOW_DISPATCH.md
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
* Verify README.md renders correctly without formatting issues.sandbox/features/FIX_MODULE_INDEX_IMPORT.md
# sandbox/features/FIX_MODULE_INDEX_IMPORT.md
# Purpose
Align the module-index test with the actual source structure by updating its import path to reference the main library file directly.

# Value Proposition
Enhance test stability and accuracy by ensuring the module-index test imports the correct module. This prevents false negatives and supports the library’s mission of robust, agentic workflows.

# Success Criteria & Requirements

* The file `tests/unit/module-index.test.js` must import the default export from `src/lib/main.js` using a valid relative path.
* The import statement should use the path `../../src/lib/main.js` to locate the module correctly.
* The test should still assert that the default export is undefined and pass without errors.
* No other tests or source files should be affected.

# Implementation Details

1. Open `tests/unit/module-index.test.js`.
2. Replace the line:
   import anything from "@src/index.js";
   with:
   import anything from "../../src/lib/main.js";
3. Ensure the rest of the test remains unchanged.

# Verification & Acceptance

* Run `npm test` and confirm all tests pass, including the module-index test.
* Verify that the default import value `anything` is undefined as expected.
* Confirm no new lint or formatting errors are introduced.
sandbox/features/CONFIG_SCHEMA_ENHANCEMENT.md
# sandbox/features/CONFIG_SCHEMA_ENHANCEMENT.md
# Purpose
Enhance the environment configuration schema to include and enforce the presence of a GitHub access token for authenticated API operations.

# Value Proposition
Centralizes validation of the GITHUB_TOKEN parameter, ensuring all GitHub-related functions have a valid token available at runtime. This reduces repetitive error handling, surfaces misconfiguration early, and improves developer experience by catching missing credentials during startup rather than at API call time.

# Success Criteria & Requirements
* Extend the `configSchema` in `src/lib/main.js` to include a required, non-empty `GITHUB_TOKEN` field.
* On startup, parsing the environment should throw a descriptive error if `GITHUB_TOKEN` is missing or empty.
* Document the new `GITHUB_TOKEN` requirement in the README under the Configuration section.
* Maintain backward compatibility for existing, non–GitHub-authenticated utilities (they can ignore the token). 

# Implementation Details
1. In `src/lib/main.js` update the zod `configSchema` to include:
   ```js
   GITHUB_TOKEN: z.string().nonempty()
   ```
2. Ensure `config = configSchema.parse(process.env)` will fail early when GitHub operations are invoked and token is not provided.
3. In the Configuration subsection of `README.md`, add `GITHUB_TOKEN` as a required environment variable for GitHub API functions, with an example:
   ```env
   GITHUB_TOKEN=your_github_token_here
   ```
4. No new files should be created or deleted; only modify `src/lib/main.js` and `README.md`.

# Verification & Acceptance
* Startup of the CLI (`node src/lib/main.js --help`) should throw a clear zod validation error if `GITHUB_TOKEN` is not set.
* Add a unit test in `tests/unit/main.test.js` mocking `process.env` without `GITHUB_TOKEN` and expect `configSchema.parse` to throw.
* Run `npm test` to confirm no regressions and that the new validation test passes.
sandbox/features/CLI_GITHUB_COMMANDS.md
# sandbox/features/CLI_GITHUB_COMMANDS.md
# Purpose
Add new command line flags to support GitHub operations directly from the CLI entrypoint, enabling users to create issues and post comments without writing code.

# Value Proposition
Provide a unified CLI interface for agentic workflows to interact with GitHub repositories. Users can open issues and comment on existing issues through simple flags, improving developer efficiency and enabling automation in CI pipelines without additional scripting.

# Success Criteria & Requirements
* Detect and handle --create-issue flag alongside required --owner and --repo parameters and an --issue-json parameter pointing to a JSON string or file path representing title, body, labels, and assignees.
* Detect and handle --comment flag alongside required --owner, --repo, --issue-number and --comment-body parameters.
* On invocation of either flag, call the corresponding functions createRepoIssue or createIssueComment imported from main library.
* Require parameters for each command; if missing or invalid, logError with descriptive message and exit with code 1.
* Increment globalThis.callCount on successful execution of each command.
* Preserve existing CLI behavior for --help, --version, --digest and other flags.
* No new dependencies beyond those already declared.

# Implementation Details
1. In src/lib/main.js, after processDigest, define a new async function processGitHubCLI(args).
2. processGitHubCLI must:
   - Check for args.includes("--create-issue") or args.includes("--comment").
   - For --create-issue: parse owner, repo, and either a JSON string or read file from --issue-json. Validate presence of title and body.
   - For --comment: parse owner, repo, issueNumber, and comment body. Validate each.
   - Import and invoke createRepoIssue(owner, repo, issueObject) or createIssueComment(owner, repo, issueNumber, body).
   - On success, console.log JSON response and return true to signal flag handled.
   - Catch errors, call logError with context and exit with non-zero status.
3. In main(args), before falling back to default output, call if (await processGitHubCLI(args)) { if (VERBOSE_STATS) print stats; return; }.
4. Update README.md under CLI Usage to document:
   - --create-issue --owner <owner> --repo <repo> --issue-json <json or path>
   - --comment --owner <owner> --repo <repo> --issue-number <number> --comment-body <text>
   - Provide example invocations and sample output.
5. Add Vitest tests in tests/unit/main.test.js:
   - Mock createRepoIssue and createIssueComment to return dummy JSON and verify console.log output and callCount increment.
   - Test missing parameters for each command logs error and process.exit is called with code 1.

# Verification & Acceptance
* Successful invocations of --create-issue and --comment produce JSON output and increment callCount.
* Missing required parameters cause logError and exit code 1.
* Existing CLI flags continue to work without regression.
* npm test passes with new tests and no failures in existing tests.sandbox/features/WORKFLOW_INTERACTION_DIAGRAM.md
# sandbox/features/WORKFLOW_INTERACTION_DIAGRAM.md
# Purpose
Add a new function generateWorkflowInteractionDiagram to src/lib/main.js that consumes multiple GitHub Actions workflow definitions (as raw YAML or file paths) and produces a Mermaid directed graph illustrating how workflows invoke or depend on each other via workflow_call or repository_dispatch events.

# Value Proposition
Provide users with a clear, consolidated visual representation of inter-workflow triggers and dependencies in a repository. This feature makes it easier to explore, document, and debug complex multi-workflow pipelines by generating inline diagrams without leaving the codebase.

# Success Criteria & Requirements
* Export async function generateWorkflowInteractionDiagram(workflowSources, options?) from src/lib/main.js.
  - workflowSources: array of strings, each item is a raw YAML string or a file path ending in .yml or .yaml.
  - options.format?: string, one of "graph" (default) or "flow" to switch between Mermaid graph TD and flowchart styles.
* For each entry in workflowSources:
  - If the string ends with .yml or .yaml, read its content with fs.promises.readFile;
  - Otherwise treat the entry as raw YAML text.
* Parse each YAML using js-yaml to extract:
  - name of the workflow from the top-level name field;
  - any workflow_call.targets or repository_dispatch.payload.repository inputs to detect calling relationships.
* Build a Mermaid diagram string:
  - Use graph TD or flowchart syntax depending on options.format;
  - Create one node per workflow name;
  - For each detected call relationship, add a directed edge caller --> target;
  - Enclose the diagram in mermaid fences: ```mermaid ... ```.
* Call logInfo at start and logError on any parsing or I/O failure; throw a descriptive Error on invalid inputs.
* Increment globalThis.callCount exactly once before returning the diagram string.
* Avoid adding new dependencies beyond js-yaml and Node built-ins (fs/promises).

# Implementation Details
1. In src/lib/main.js, import yaml from "js-yaml" and fs from "fs/promises" near existing imports.
2. Define async function generateWorkflowInteractionDiagram(workflowSources, options = {}):
   - Validate workflowSources is a non-empty array; on failure throw Error.
   - Determine formatKeyword = options.format === "flow" ? "flowchart TD" : "graph TD".
   - Initialize an empty map of workflowName to its parsed object.
   - For each source in workflowSources:
     * If source ends with .yml or .yaml, await fs.readFile(source, "utf8"); else use source as text.
     * Parse text with yaml.load; ensure result has a name field and on.workflow_call.targets array or repository_dispatch triggers.
     * Store workflow name and its targets in the map.
   - Construct an array of edges strings: for each workflowName and each targetName add `${caller}-->${target}`.
   - Build the final diagram:
     ```mermaid
     ${formatKeyword}
     ${edges.join("\n")}
     ```
   - logInfo("generateWorkflowInteractionDiagram completed");
   - Increment globalThis.callCount;
   - Return the diagram string.
3. Export generateWorkflowInteractionDiagram alongside other utilities in main.js.
4. In the CLI helper section of main.js, define async function processWorkflowInteractionDiagram(args):
   - Detect flag --workflow-interaction-diagram in args;
   - Parse required --sources argument as comma-separated list of YAML file paths or inline YAML blocks;
   - Parse optional --format argument;
   - Call generateWorkflowInteractionDiagram(sourcesArray, { format });
   - console.log the returned diagram string;
   - Return true if flag handled, otherwise false.
   - On errors, call logError and exit with non-zero code.
5. In main(args), before other CLI handlers, add:
   if (await processWorkflowInteractionDiagram(args)) return;
6. Update README.md under both Programmatic Usage and CLI Usage:
   - Document generateWorkflowInteractionDiagram signature, parameters, and options;
   - Show example invocation and sample Mermaid output;
   - Document CLI flag --workflow-interaction-diagram with --sources and --format options.
7. Add Vitest unit tests in tests/unit/main.test.js:
   - Mock fs.promises.readFile and yaml.load to supply sample workflows;
   - Test default graph format for two workflows where A calls B;
   - Test flow format produces flowchart TD syntax;
   - Test error thrown when input array is empty or YAML missing name field;
   - Verify globalThis.callCount increments exactly once per invocation.

# Verification & Acceptance
* Run npm test to confirm new tests pass and no existing tests are affected.
* Confirm that generateWorkflowInteractionDiagram returns a valid Mermaid code block containing expected node and edge definitions.
* Verify CLI invocation npx agentic-lib --workflow-interaction-diagram --sources workflowA.yml,workflowB.yml produces the diagram and exits without errors.
* Ensure error handling logs descriptive messages and exits with non-zero status on invalid inputs.
* Confirm README.md renders correctly with code samples and usage instructions.sandbox/features/DIGEST_HANDLER_ERROR_TESTS.md
# sandbox/features/DIGEST_HANDLER_ERROR_TESTS.md
# Purpose
Add comprehensive unit tests for error handling in the digestLambdaHandler function.

# Value Proposition
Ensure that digestLambdaHandler correctly identifies and reports invalid JSON payloads, generates appropriate fallback identifiers, and returns expected batch failures. This increases reliability and stability in SQS-based digest workflows by catching edge cases early.

# Success Criteria & Requirements
* Create tests that simulate valid and invalid SQS events.
* For invalid JSON payloads:
  - Use a record without a messageId to verify fallback identifier generation.
  - Use a record with a predefined messageId to verify correct itemIdentifier usage.
  - Confirm that logError is called twice: once for parsing failure and once for invalid payload details.
  - Assert that batchItemFailures array contains an object with the correct itemIdentifier.
* For valid JSON payloads:
  - Provide a record with a properly formatted body.
  - Verify that no errors are logged and batchItemFailures is empty.

# Implementation Details
1. In tests/unit/main.test.js, import digestLambdaHandler and reset console.error mocks before each test.
2. Mock Date.now and Math.random if necessary to stabilize fallback identifier patterns.
3. Write a test case "handles invalid JSON without messageId" that:
   - Constructs an event record { Records: [ { body: "not json" } ] }.
   - Calls digestLambdaHandler and awaits the result.
   - Verifies console.error was called twice and result.batchItemFailures contains an identifier matching fallback-0-<timestamp>-<random> pattern.
4. Write a test case "handles invalid JSON with messageId" that:
   - Uses record { Records: [ { messageId: "abc123", body: "bad" } ] }.
   - Calls digestLambdaHandler, asserts batchItemFailures contains { itemIdentifier: "abc123" }.
5. Write a test case "processes valid JSON" that:
   - Uses record { Records: [ { messageId: "m1", body: JSON.stringify({foo:1}) } ] }.
   - Calls digestLambdaHandler, asserts batchItemFailures is an empty array.
6. Ensure console.error and console.log mocks are restored after each test.

# Verification & Acceptance
* Run npm test and confirm three new tests pass.
* Ensure coverage reports include these new tests.
* Confirm no existing tests are broken or modified.
* Maintain consistent coding style and use Vitest for mocking and assertions.sandbox/features/TEST_CONSOLE_OUTPUT_SUMMARIZER.md
# sandbox/features/TEST_CONSOLE_OUTPUT_SUMMARIZER.md
# Purpose
Integrate the test console output summarizer into the CI workflow so that test runs automatically emit structured JSON summaries.

# Value Proposition
Provide CI pipelines and developers with a single command to run the full test suite and receive machine-readable test results without extra scripting. This simplifies CI configuration and accelerates failure analysis by producing a consistent JSON report of pass, fail, skip counts, error details, and optional timing metrics.

# Success Criteria & Requirements
* Export a function summarizeTestConsoleOutput(rawOutput, options?) that returns an object with fields total, passed, failed, skipped, errors (array of unique error messages), and metrics (durationTotal and durationAverage when enabled or null otherwise)
* Introduce a CLI flag --ci-summarize-tests that spawns the test runner, captures combined stdout and stderr, and passes the output to summarizeTestConsoleOutput
* Support an optional --metrics flag alongside the CLI flag to include timing metrics in the summary
* Print the summary as a single JSON object to standard output with JSON.stringify
* Exit with code 1 if the test runner exit code is non zero or failed count is greater than zero, otherwise exit with code 0
* Increment globalThis.callCount exactly once per invocation of the CLI helper

# Implementation Details
1. In src/lib/main.js import spawn from child_process near existing imports
2. Define function summarizeTestConsoleOutput(rawOutput, options = {}) below existing utilities
   - Split rawOutput into lines
   - Count lines indicating passes, failures, and skips
   - Extract unique error messages from failure lines
   - If options.metrics is true, extract timing durations, calculate total and average
   - Return the structured summary object
3. Define async function processCiSummarizeTests(args) before other CLI helpers
   - Detect --ci-summarize-tests in args
   - Determine includeMetrics from presence of --metrics in args
   - Spawn the test script (npm test or the package.json test command) capturing stdout and stderr into rawOutput
   - Await process close event to obtain exitCode
   - Call summarizeTestConsoleOutput(rawOutput, { metrics: includeMetrics })
   - console.log(JSON.stringify(summary))
   - Increment globalThis.callCount
   - If exitCode or summary.failed is non zero call process.exit(1)
   - Return true when handled, otherwise return false
4. In main(args) at the very top invoke processCiSummarizeTests(args) and return when it handles the flag

# Verification & Acceptance
* Add Vitest tests in tests/unit/main.test.js to mock spawn for passing and failing scenarios, verifying JSON output, callCount increment, and exit code behavior
* Confirm summarizeTestConsoleOutput returns correct summary for sample outputs with and without metrics
* Run npm test to ensure new tests pass and existing tests are unaffected
* Manually invoke npx @xn-intenton-z2a/agentic-lib --ci-summarize-tests and with --metrics to validate JSON summary and exit codessandbox/features/GITHUB_FETCHER.md
# sandbox/features/GITHUB_FETCHER.md
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
* Ensure README.md updates render correctly without formatting issues.sandbox/features/CONFIG_FILE_SUPPORT.md
# sandbox/features/CONFIG_FILE_SUPPORT.md
# Purpose
Add support for loading configuration from a file (JSON or YAML) in addition to environment variables, enabling easier configuration management and version control.

# Value Proposition
Allow users to define agentic-lib configuration in a dedicated config file (agentic.config.json or agentic.config.yaml) instead of environment variables only. This simplifies setup for local development and CI, ensures reproducible configurations, and centralizes settings in version-controlled files.

# Success Criteria & Requirements
* agentic-lib reads optional configuration file at project root named agentic.config.json, agentic.config.yaml, or agentic.config.yml
* File may define GITHUB_API_BASE_URL, OPENAI_API_KEY, GITHUB_TOKEN, HTTP_PORT, and other existing config keys
* Environment variables override file values when both are present
* Configuration values are validated against the existing zod configSchema with descriptive errors on invalid or missing required fields
* Exported config reflects merged values and is used by all features
* No new dependencies beyond js-yaml and Node built-ins

# Implementation Details
1. In src/lib/main.js, before parsing process.env, check for the presence of agentic.config.json, agentic.config.yaml, or agentic.config.yml in project root
2. Use fs.promises.readFile to read the file; for JSON parse with JSON.parse, for YAML parse with js-yaml.load
3. Merge parsed file values into a copy of process.env, giving higher precedence to actual environment variables
4. Pass the merged object to configSchema.parse and export the resulting config
5. Add Vitest unit tests in tests/unit/main.test.js to mock file reads:
   - Test loading JSON config file and merging with process.env
   - Test loading YAML config file and merging precedence
   - Test validation errors when required fields are missing or invalid
6. Update README.md under Configuration section to document config file support:
   - File names supported
   - Sample agentic.config.json and agentic.config.yaml examples
   - Precedence rules

# Verification & Acceptance
* Unit tests cover JSON and YAML config file loading, merge behavior, and schema validation errors
* npm test passes with new tests and no regressions
* README.md renders config file documentation correctly without formatting issuessandbox/features/CLI_HEALTH.md
# sandbox/features/CLI_HEALTH.md
# Purpose
Add a new CLI flag --health to src/lib/main.js that prints a concise, human-readable repository status summary including version, uptime, call count, commit count, and file count.

# Value Proposition
Provide an easy way for users and CI pipelines to perform a quick health check of the library without parsing JSON. A human-readable summary speeds up diagnostics, improves visibility into repository metrics, and complements the existing --stats JSON output.

# Success Criteria & Requirements
* Export function generateHealthSummary(options?) from src/lib/main.js
  - Returns a multi-line string with labeled lines for Version, Uptime (in seconds), Call Count, Commit Count, and File Count
  - Accepts an optional options object to include or exclude individual metrics sections
* Implement async CLI helper function processHealth(args) in src/lib/main.js
  - Detects presence of --health in args
  - Calls generateHealthSummary() to obtain the summary string
  - console.log the summary string to stdout
  - Increments globalThis.callCount exactly once for the CLI invocation
  - Returns true when flag is handled, false otherwise
* Update main(args) sequence to invoke processHealth before existing handlers (version, stats, digest)
* Update README.md under CLI Usage to document --health flag with example invocation and sample output
* Add Vitest tests in tests/unit/main.test.js
  - Mock underlying metric functions (or generateStatsSummary) to return known values and verify generateHealthSummary formats accordingly
  - Test that processHealth prints the correct summary, increments callCount, and returns true when --health is supplied
  - Test that processHealth returns false and does nothing when --health is absent

# Implementation Details
1. In src/lib/main.js import or reuse generateStatsSummary
2. Define function generateHealthSummary(options = {}) below existing utilities:
   • Call generateStatsSummary() to get metrics object { uptime, callCount, commitCount, fileCount }
   • Read version from package.json via fs.readFileSync or dynamic import
   • Build a string with one labeled line per metric, e.g.:
     Version: 6.2.1-0
     Uptime: 12.34s
     Call Count: 3
     Commit Count: 42
     File Count: 128
   • Respect options flags to omit sections if requested
   • Return the composed string
3. Define async function processHealth(args) in the CLI helper block:
   • If args.includes("--health"):
     - Call generateHealthSummary()
     - console.log the returned summary
     - Increment globalThis.callCount
     - Return true
   • Else return false
4. In main(args), before processVersion and processDigest insert:
   if (await processHealth(args)) { return; }
5. Update README.md under "CLI Usage" to add:
  --health
    Print human-readable repository health summary
  Example:
    npx @xn-intenton-z2a/agentic-lib --health
  Sample Output:
    Version: 6.2.1-0
    Uptime: 12.34s
    Call Count: 3
    Commit Count: 42
    File Count: 128
6. Add Vitest tests in tests/unit/main.test.js:
   • Mock generateStatsSummary to return fixed metrics and mock version value
   • Verify generateHealthSummary returns correctly formatted lines
   • Spy on console.log and globalThis.callCount to ensure processHealth behaves as specified

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests remain unaffected
* Confirm that invoking --health prints the expected summary and increments callCount
* Validate that omitting --health leaves other CLI flags and default behavior unchanged
* Ensure no new lint or formatting errors are introducedsandbox/features/VERBOSE_FLAGS.md
# sandbox/features/VERBOSE_FLAGS.md
# Purpose
Support dynamic activation of verbose logging and statistics in the CLI by introducing runtime flags to override the static default settings.

# Value Proposition
Allow users to enable detailed log entries and runtime statistics when invoking the CLI without modifying source code or environment. This improves debugging, observability, and operational insight by exposing internal log levels and performance metrics on demand.

# Success Criteria & Requirements
* Introduce two new CLI flags: `--verbose` and `--verbose-stats`.
* Change VERBOSE_MODE and VERBOSE_STATS in src/lib/main.js from constants to variables that can be set at runtime based on CLI flags.
* `--verbose` toggles verbose mode, causing logInfo and logError to include additional fields (e.g., stack traces) as defined by existing logic.
* `--verbose-stats` toggles stats mode so that after each handled CLI flag, the tool prints a JSON object with current callCount and uptime.
* Flags should be processed before any other CLI handlers (help, version, digest, etc.).
* The CLI handlers (processHelp, processVersion, processDigest, and any future handlers) should respect the updated variables and output extra information accordingly.
* No new external dependencies should be added.

# Implementation Details
1. In src/lib/main.js, change:
   ```js
   const VERBOSE_MODE = false;
   const VERBOSE_STATS = false;
   ```
   to:
   ```js
   let VERBOSE_MODE = false;
   let VERBOSE_STATS = false;
   ```
2. Define a function `processVerboseFlags(args)` before other CLI helpers:
   - If args includes `--verbose`, set VERBOSE_MODE = true.
   - If args includes `--verbose-stats`, set VERBOSE_STATS = true.
   - Return true if either flag was present, otherwise false.
3. In main(args), at the very top, call `processVerboseFlags(args)` to initialize the variables before invoking any other handlers.
4. Ensure existing logging helpers (`logInfo`, `logError`) automatically include verbose details when VERBOSE_MODE is true.
5. After any CLI handler returns true (help, version, digest, or others), if VERBOSE_STATS is true, print:
   ```js
   console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
   ```
6. Update README.md under CLI Usage to document:
   - `--verbose` to enable verbose logging
   - `--verbose-stats` to print callCount and uptime after each command
   - Show example invocations and sample outputs with additional fields and stats
7. Add Vitest tests in tests/unit/main.test.js:
   - Verify that passing `--verbose` causes logInfo to output additional verbose data (e.g., contains a verbose flag in the JSON log entry).
   - Verify that passing `--verbose-stats` causes a stats JSON line to be printed after a handled flag (e.g., after `--help`).
   - Test combinations of both flags.

# Verification & Acceptance
* Run `npm test` to confirm new tests pass and existing tests remain unaffected.
* Invoke the CLI with and without `--verbose` and `--verbose-stats` to manually observe additional log fields and stats output.
* Confirm that non-flag behavior remains unchanged when flags are absent.
* Ensure code style and formatting adhere to existing patterns.sandbox/features/WORKFLOW_RUN_SUMMARY.md
# sandbox/features/WORKFLOW_RUN_SUMMARY.md
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
* Ensure no new dependencies are added beyond existing built-ins.sandbox/features/RELEASE_NOTES.md
# sandbox/features/RELEASE_NOTES.md
# Purpose
Add a new async function generateReleaseNotes to src/lib/main.js that composes release notes from Git commit history between two references.

# Value Proposition
Automate creation of consistent, formatted release notes by extracting commit messages from a Git repository. This saves manual effort, ensures standardized documentation of changes, and accelerates release preparation.

# Success Criteria & Requirements
* Introduce generateReleaseNotes(fromRef, toRef, options?) exported from src/lib/main.js
* Accept two required string parameters fromRef and toRef representing Git commits, tags, or branches
* Accept an optional options object with format field supporting "markdown" (default) or "json"
* Invoke Git via child_process to run git log --pretty=format:%s from fromRef to toRef
* Parse each commit message into an array of entries
* For markdown format, return a string starting with a heading "## Release Notes" followed by a bullet list of commit messages
* For json format, return an object { commits: ["msg1","msg2",…] }
* Increment globalThis.callCount on each invocation
* Throw descriptive errors and call logError if Git invocation fails or parameters are missing
* No new dependencies beyond Node built-ins

# Implementation Details
1. In src/lib/main.js import exec from "child_process" after existing imports
2. Define async function generateReleaseNotes(fromRef, toRef, options = {}) below existing utilities
   - Validate fromRef and toRef are nonempty strings; on failure throw Error
   - Construct git command: git log fromRef..toRef --pretty=format:%s
   - Use exec to run the command and capture stdout
   - Split stdout by line breaks to collect commit messages
   - Build result: for markdown format, prefix with "## Release Notes" and join messages as "- msg" lines; for json format, return an object
   - Increment globalThis.callCount
3. Export generateReleaseNotes alongside other utilities in main.js
4. In main(args), before fallback behavior add a processReleaseNotes helper:
   - Detect --release-notes flag, parse --from and --to and optional --format arguments
   - Call generateReleaseNotes and console.log output (string or JSON.stringify)
   - Increment callCount for the CLI invocation and return true
5. Update README.md under Programmatic Usage to document generateReleaseNotes API with examples for markdown and JSON
6. Update README.md under CLI Usage to document:
   npx agentic-lib --release-notes --from v1.0.0 --to v1.1.0 [--format json]
   and show sample output
7. Add Vitest unit tests in tests/unit/main.test.js:
   - Mock child_process.exec to return sample commit list and verify markdown and JSON outputs and callCount increments
   - Test missing parameters cause logError and thrown errors
   - Test CLI helper processReleaseNotes parses args correctly, prints output, and exits gracefully

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests are unaffected
* Verify generateReleaseNotes returns correct markdown and JSON for sample data
* Confirm CLI --release-notes invocation outputs expected results and increments callCount
* Ensure error handling triggers logError and throws descriptive errors
* Confirm README.md updates render correctly without formatting errorssandbox/features/HTTP_SERVER.md
# sandbox/features/HTTP_SERVER.md
# Purpose
Add an embedded HTTP server to src/lib/main.js that provides health and metrics endpoints for agentic-lib, enabling external systems to monitor service status and call counts without embedding the library directly.

# Value Proposition
Expose operational insights and allow health checks of agentic-lib in containerized or microservice environments. Simplifies integration with monitoring tools and supports automated orchestration by providing a lightweight HTTP interface.

# Success Criteria & Requirements
* Define a function startHttpServer(options?) exported from src/lib/main.js.
* Accept options.port number or read from environment variable HTTP_PORT, default to 3000 if neither is provided.
* Use Node's built-in http module to create a server.
* Expose two GET endpoints:
  - /health: returns HTTP 200 with JSON { status: "ok" }.
  - /metrics: returns HTTP 200 with JSON { callCount: globalThis.callCount, uptime: process.uptime() }.
* Any other request path returns HTTP 404 with JSON { error: "Not Found" }.
* Increment globalThis.callCount when processing /metrics requests only.
* Handle server errors by logging via logError and shutting down gracefully.
* No additional dependencies should be added.

# Implementation Details
1. In src/lib/main.js after existing exports, import http from "http".
2. Define startHttpServer(options = {}):
   - Determine port: options.port || process.env.HTTP_PORT parsed to integer || 3000.
   - Create server with http.createServer((req, res) => { route handling }).
   - In request handler inspect req.url and req.method:
     * If GET /health respond with JSON and status 200.
     * If GET /metrics increment callCount and respond with metrics JSON and status 200.
     * Else respond with JSON error and status 404.
   - Start listening on port and logInfo with server listening message.
   - Return the server instance to allow shutdown in tests.
3. Update main(args) to detect --serve flag before processHelp:
   - If args includes --serve call await startHttpServer() and return to keep server running.
   - Document exit behavior in logs.
4. Update README.md under CLI Usage to include:
   - --serve: start HTTP server for health and metrics.
   - Example invocation: npx agentic-lib --serve and sample output log.
5. Add Vitest tests in tests/unit/main.test.js:
   - Import startHttpServer, start on ephemeral port (e.g., 0), use server.address().port.
   - Use fetch to GET /health and verify status 200 and body { status: 'ok' }.
   - Use fetch to GET /metrics and verify status 200 and body includes callCount and uptime fields.
   - Test 404 behavior for unknown path.
   - Ensure server.close() is called after tests.

# Verification & Acceptance
* Unit tests cover health, metrics, and not found endpoints and callCount increment.
* npm test passes with no regressions.
* README.md reflects new CLI flag and usage examples.
* No new dependencies are added and code style matches existing patterns.sandbox/features/MERGE_PULL_REQUEST.md
# sandbox/features/MERGE_PULL_REQUEST.md
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
* Verify README.md updates render correctly without formatting issues.sandbox/features/AGENTIC_HANDLER.md
# sandbox/features/AGENTIC_HANDLER.md
# Purpose
Extend the existing agenticHandler to surface API token usage and estimated cost alongside the parsed result, giving discussion workflows visibility into resource consumption.

# Value Proposition
By reporting prompt token counts, completion token counts, total tokens, and estimated USD cost per invocation, discussion bots and automation pipelines can monitor and optimize OpenAI API usage and budget in real time.

# Success Criteria & Requirements
* Update agenticHandler signature to accept an optional options.costRates object with fields promptTokens and completionTokens, defaulting to 0.002 and 0.0025 respectively.
* Invoke OpenAI API via createChatCompletion and capture response.data.usage and response.data.choices[0].message.content.
* Parse the JSON content into a JavaScript object for the result field.
* Extract usage metrics: prompt_tokens, completion_tokens, total_tokens.
* Calculate cost as (prompt_tokens/1000)*promptTokens + (completion_tokens/1000)*completionTokens.
* Return an object with keys result, usage, and cost.
* Increment globalThis.callCount exactly once per handler invocation.
* Log start with logInfo and logError on API or parsing failures; throw a descriptive error on parse failure or API error.

# Implementation Details
1. In src/lib/main.js locate the existing async function agenticHandler(taskPrompt, options?).
2. Change its signature to async function agenticHandler(taskPrompt, options = {}) and inside destructure costRates = options.costRates || { promptTokens: 0.002, completionTokens: 0.0025 }.
3. Before calling createChatCompletion, call logInfo with a message indicating invocation start.
4. Await the API call, then extract usage and content from response.data.choices[0].message.content.
5. Parse the content with JSON.parse into parsedResult; on JSON.parse failure catch error, call logError with error and rethrow.
6. Compute cost = (usage.prompt_tokens / 1000) * costRates.promptTokens + (usage.completion_tokens / 1000) * costRates.completionTokens.
7. Increment globalThis.callCount.
8. Return { result: parsedResult, usage, cost }.
9. Add unit tests in tests/unit/main.test.js to mock createChatCompletion returning usage and JSON content; verify returned object, cost calculation with default and custom costRates, and callCount increment.
10. Update README.md under API Usage to document the new return shape and options.costRates, with examples showing how to call agenticHandler and interpret usage and cost.

# Verification & Acceptance
* Run npm test to confirm new tests pass and existing tests are unaffected.
* Test agenticHandler with default costRates yields correct cost values and increments callCount once.
* Test agenticHandler with custom costRates yields expected cost.
* Verify logInfo is called at start and logError on parsing errors.
* Confirm README.md examples render correctly without formatting issues.sandbox/features/WORKFLOW_DIAGRAM.md
# sandbox/features/WORKFLOW_DIAGRAM.md
# Purpose
Add a new function generateWorkflowDiagram to src/lib/main.js that takes a GitHub Actions workflow YAML definition and produces an interactive Mermaid diagram code block representing jobs and their dependencies.

# Value Proposition
Provide users with a quick, inline visual representation of their workflow structure and execution order. This feature makes it easier to understand complex workflows at a glance, improving debugging, collaboration, and documentation without leaving the code.

# Success Criteria & Requirements
* Export async function generateWorkflowDiagram(workflowYaml, options?) from src/lib/main.js.
* workflowYaml: string containing the raw YAML of a GitHub Actions workflow.
* options.format?: one of "graph" (default) or "sequence" to choose mermaid graph or sequence diagram style.
* Parse the YAML using js-yaml (already installed) to extract the jobs object and each job’s name and needs array.
* Increment globalThis.callCount on each invocation.
* Build a Mermaid diagram string prefixed and suffixed with a mermaid code fence:
  
  ```mermaid
  ...diagram definitions...
  ```
* In "graph" mode generate a directed graph (graph TD) where each job points to the jobs that depend on it.
* In "sequence" mode generate a simple sequence diagram listing jobs in topological order with arrows showing needs relationships.
* Use logInfo at the start and logError on failure. On parse errors throw a descriptive error.
* No additional dependencies beyond js-yaml and those already declared.

# Implementation Details
1. In src/lib/main.js, import yaml from "js-yaml" after existing imports.
2. Define async function generateWorkflowDiagram(workflowYaml, options = {}) below existing utilities.
3. Inside function:
   - logInfo("Starting diagram generation").
   - Parse workflowYaml with yaml.load and validate that jobs is a plain object.
   - Extract job names and dependencies (needs arrays).
   - Depending on options.format construct either a mermaid graph TD or sequenceDiagram string.
   - Wrap with ```mermaid fences and return the complete string.
   - Increment globalThis.callCount before return.
4. Catch parse or generation errors, logError with error details, and rethrow.
5. Export generateWorkflowDiagram alongside other utilities.
6. Update README.md under Programmatic Usage and CLI Usage examples to illustrate generateWorkflowDiagram signature and output preview.
7. Add Vitest unit tests in tests/unit/main.test.js:
   - Test default graph format for a minimal workflow with two jobs and needs.
   - Test explicit sequence format generating proper diagram syntax.
   - Verify globalThis.callCount increments per call.

# Verification & Acceptance
* Write tests mocking a sample YAML workflow and asserting that output contains expected mermaid lines (graph TD or sequenceDiagram and job links).
* Ensure callCount increments as expected.
* Run npm test to confirm all tests pass without regressions.
* Verify README examples render valid mermaid code blocks.