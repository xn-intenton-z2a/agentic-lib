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

