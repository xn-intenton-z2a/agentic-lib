# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
# Activity Log

## Discussions activity at 2025-05-19T15:35:45.014Z

Hello @Antony-at-Polycode 👋

I’m seeding the repository now as requested. The mission detail has been left blank per your instructions. You can review the newly added scaffolding and let me know if you’d like to refine the mission statement or adjust anything else!

[Posted on "https://github.com/xn-intenton-z2a/agentic-lib/discussions/1318#discussioncomment-13195496" by the repository bot which took the action "seed-repository" with the detail "".]

LLM API Usage:

```json
{"prompt_tokens":35472,"completion_tokens":86,"total_tokens":35558,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":0,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}

```
---

2025-05-19T15:36:51Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-19T15-36Z

## Maintain Feature at 2025-05-19T15:37:20.989Z

Maintained feature GITHUB_ISSUE_COMMENTER.

Git diff:

```

```

LLM API Usage:

```json
{"prompt_tokens":6030,"completion_tokens":1844,"total_tokens":7874,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1216,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T15:38:22.573Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1524 with title:

Implement GitHub Issue Commenter CLI feature using GITHUB_ISSUE_COMMENTER

And description:

We need to add a core `GITHUB_ISSUE_COMMENTER` feature that allows users to post comments directly to GitHub issues via the CLI. This feature will enable automation workflows to leave meaningful commentary on issues, delivering high-impact value for call-and-response agentic pipelines.

Scope of Changes:
1. **src/lib/main.js**
   - Extend `configSchema` to include `GITHUB_TOKEN: z.string().optional()`.
   - Add a new helper function `async function commentOnIssue(owner, repo, issueNumber, body)` that:
     - Constructs a POST to `${config.GITHUB_API_BASE_URL || 'https://api.github.com'}/repos/${owner}/${repo}/issues/${issueNumber}/comments`.
     - Sets `Authorization: token ${config.GITHUB_TOKEN}`.
     - Sends the JSON payload `{ body }` and logs success or error with `logInfo` / `logError`.
   - Introduce a CLI flag handler `processComment(args)` ahead of other commands:
     - Detect `--comment`, `--owner <owner>`, `--repo <repo>`, `--issue <number>`, and `--message <text>`.
     - Invoke `commentOnIssue(owner, repo, issue, message)` and exit.
   - Wire `processComment` into `main()` so `agentic-lib --comment --owner org --repo repo --issue 42 --message "Your message"` works.

2. **tests/unit/main.test.js**
   - Mock `fetch` (or `node-fetch`) to intercept the HTTP POST and return a 201-like response.
   - Add tests to verify:
     - Successful comment posts calls the correct URL, headers and body.
     - Missing `GITHUB_TOKEN` or HTTP error surfaces via `logError`.
   - Ensure global call count logic remains unaffected.

3. **sandbox/README.md**
   - Document new CLI usage:
     ```bash
     agentic-lib --comment --owner <github-org> --repo <repo-name> --issue <number> --message "Comment body"
     ```
   - Describe environment variables `GITHUB_TOKEN` and `GITHUB_API_BASE_URL`.

4. **package.json** (Dependency File)
   - Confirm no new dependencies required (Node 20+ has built-in `fetch`).
   - Update `scripts` section to include an example or note in `--help` output.

Verification Steps:
- Run `npm test` to ensure new tests pass.
- Manually invoke using a dummy token against a mock HTTP server or via `VITEST` environment to ensure the code path executes without errors.

No new files should be added or removed. All changes must be confined to source (`src/lib/main.js`), tests (`tests/unit/main.test.js`), documentation (`sandbox/README.md`), and the dependency file (`package.json`).

LLM API Usage:

```json
{"prompt_tokens":6391,"completion_tokens":1700,"total_tokens":8091,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to enhanced Issue at 2025-05-19T15:39:26.843Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1524 with enhanced description:

Title: Implement GitHub Issue Commenter CLI Feature

Description:
This feature adds a core `--comment` CLI command to post comments to GitHub issues, enabling agentic workflows to provide automated feedback directly on GitHub. It includes:

1. Configuration:
   - Extend `configSchema` in `src/lib/main.js` to include:
     - `GITHUB_TOKEN: z.string().optional()`
     - `GITHUB_API_BASE_URL: z.string().optional()` (already present)

2. Implementation:
   - Add `async function commentOnIssue(owner, repo, issueNumber, body)`:
     - Constructs POST to `${config.GITHUB_API_BASE_URL || 'https://api.github.com'}/repos/${owner}/${repo}/issues/${issueNumber}/comments`.
     - Sets `Authorization: token ${config.GITHUB_TOKEN}` header.
     - Sends JSON payload `{ body }`.
     - Logs success via `logInfo()` or errors via `logError()`.

   - Add `processComment(args)` before other handlers to detect flags:
     ```js
     --comment                   Trigger issue comment mode
     --owner <owner>             GitHub organization or user
     --repo <repo-name>          Repository name
     --issue <number>            Issue number to comment on
     --message <text>            Comment body text
     ```
   - Wire `processComment` into `main()` so running:
     ```bash
     agentic-lib --comment --owner my-org --repo my-repo --issue 42 --message "Your comment"
     ```
     results in a call to `commentOnIssue` and then exits.

3. Testing (`tests/unit/main.test.js`):
   - Mock global `fetch` to intercept HTTP POSTs and simulate:
     - 201 response on success.
     - 401 or other status on failure.
   - Test Cases:
     - Successful comment posts to correct URL with correct headers and body.
     - Missing `GITHUB_TOKEN` logs an error and exits with non-zero code.
     - HTTP error triggers `logError` with the response status and message.
     - Ensure existing `globalThis.callCount` behavior is unaffected.

4. Documentation (`sandbox/README.md`):
   - Add CLI usage example:
     ```bash
     agentic-lib --comment --owner <github-org> --repo <repo-name> --issue <number> --message "Comment body"
     ```
   - Document environment variables:
     - `GITHUB_TOKEN` (required for authentication)
     - `GITHUB_API_BASE_URL` (optional override, defaults to `https://api.github.com`)

5. Dependencies (`package.json`):
   - No new dependencies required (Node 20+ native `fetch`).
   - Update `--help` output to include `--comment` flag description.

Testable Acceptance Criteria:
- Given a valid `GITHUB_TOKEN`, executing `agentic-lib --comment --owner octocat --repo hello-world --issue 1 --message "Test"` should send a POST request to `https://api.github.com/repos/octocat/hello-world/issues/1/comments` and log success.
- When `GITHUB_TOKEN` is not set, running the same command should log an error and exit with code `1`.
- On HTTP status >= 400, the CLI logs the error status and message via `logError()` and exits with code `1`.
- Unit tests mock `fetch` to simulate both success and failure, verifying URL, headers, request body, and logging behavior.
- `--help` output lists `--comment`, `--owner`, `--repo`, `--issue`, and `--message` flags with descriptions.

LLM API Usage:

```json
{"prompt_tokens":7048,"completion_tokens":2077,"total_tokens":9125,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1216,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-19T15:47:24.976Z

fixApplied: true

Implement GitHub issue commenter CLI feature

Git Diff:

```


```
mainOutput:```

> @xn-intenton-z2a/agentic-lib@6.7.5-0 start
> node src/lib/main.js

{"level":"info","timestamp":"2025-05-19T15:47:05.666Z","message":"Configuration loaded","config":{}}
No command argument supplied.

Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.

```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1524 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":9901,"completion_tokens":7757,"total_tokens":17658,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":4352,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T15:48:04.128Z

Generated feature development issue with title Add `--mission` CLI flag to output mission statement from MISSION.md.

LLM API Usage:

```json
{"prompt_tokens":6408,"completion_tokens":2315,"total_tokens":8723,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1664,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Maintain Feature at 2025-05-19T15:58:19.480Z

Maintained feature SQS_SENDER.

Git diff:

```

```

LLM API Usage:

```json
{"prompt_tokens":6030,"completion_tokens":1112,"total_tokens":7142,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T16:22:17.950Z

Generated feature development issue with title Add --mission CLI Flag to Display the Library Mission Statement.

LLM API Usage:

```json
{"prompt_tokens":6820,"completion_tokens":1967,"total_tokens":8787,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1344,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Ready Issue at 2025-05-19T16:24:53.598Z

Enhanced issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1526 with action close and updated description:

Objective:
Implement a new command-line flag `--mission` in the main CLI entrypoint that reads and prints the contents of the top-level `MISSION.md` file. This will give users instant access to the library’s mission without digging through markdown or source.

Scope of Work:
1. src/lib/main.js
   - Introduce a new helper `async function processMission(args)` that:
     • Checks for `--mission` in the argument list.  
     • Reads `MISSION.md` from the project root using `fs/promises`.  
     • Prints the raw markdown contents to stdout.  
     • Returns `true` if the flag is handled, `false` otherwise.
   - In `main()`, call `await processMission(args)` after `processDigest` so that `--mission` short-circuits remaining logic (similar to `--help` and `--version`).
   - On file read errors, call `logError("Failed to load mission statement", error)` and `process.exit(1)`.

2. tests/unit/main.test.js
   - Add a new suite for `--mission`:
     • Mock `fs/promises.readFile` to return a known string.  
     • Invoke `main(["--mission"])` (or the underlying handler) and verify that stdout contains the expected markdown.  
     • Simulate read errors and assert that `logError` is called and `process.exit(1)` is triggered.

3. sandbox/README.md
   - Update the usage section to include `--mission` along with `--help`, `--digest`, and `--version`.
   - Add a short example:
     ```bash
     $ npm start -- --mission
     # prints out the full contents of MISSION.md
     ```

4. Dependencies
   - No changes needed to `package.json` because `fs/promises` is built-in.

Acceptance Criteria:
- Running `npm start -- --mission` prints the exact contents of `MISSION.md` to stdout and exits with code 0.
- If `MISSION.md` cannot be read, the CLI logs an error object as JSON and exits with code 1.
- New unit tests cover success and error paths for `--mission`, achieving ≥90% coverage on the new helper.
- Updated README usage examples render correctly and lint without errors.

Verification:
- Execute `npm test` to confirm all unit tests (including the new ones) pass.
- Run `npm start -- --mission` manually to verify behavior in a live environment.
- Lint (`npm run linting`) and formatting (`npm run formatting`) should complete without issues.

LLM API Usage:

```json
{"prompt_tokens":7770,"completion_tokens":1224,"total_tokens":8994,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":576,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

