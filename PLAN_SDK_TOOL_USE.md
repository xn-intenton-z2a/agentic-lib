# Plan: SDK Tool Loop Improvements

## User Assertions

- The system is designed for non-interactive execution — primarily from GitHub Actions workflows
- The CLI is for observing what happens in the actions close up, not a different path with interactive execution
- The GitHub runner IS the sandbox
- All 3 improvements below are approved directions

## Current Architecture

### Two integration patterns for the same Copilot SDK tool loop

**Pattern 1: `runCopilotTask`** (src/copilot/session.js, used by GitHub Actions task handlers in src/actions/agentic-step/tasks/*.js)

- Each of 10 task handlers assembles a prompt from repository context
- Calls `runCopilotTask()` → `_runOnce()` → `session.sendAndWait()`
- SDK runs model's internal tool loop (read_file, write_file, list_files, run_command)
- Context-front-loaded: task handler pre-reads source files, features, issues into the prompt
- No hooks, no budget control, basic event logging for token counts
- 4 tools: read_file, write_file, list_files, run_command

**Pattern 2: `runHybridSession`** (src/copilot/hybrid-session.js, used by CLI `iterate` and MCP server)

- Single persistent session with SDK hooks for observability
- `onPreToolUse` — logs every tool call with timing, enforces tool-call budget
- `onPostToolUse` — tracks files written, detects test pass/fail
- `onErrorOccurred` — error recovery with retry
- 5 tools: read_file, write_file, list_files, run_command, run_tests
- Dedicated `run_tests` tool (semantically clearer than run_command for test execution)
- Autopilot mode (`session.rpc.mode.set`)
- Infinite sessions for context management
- Lean prompt: just mission + initial test output, model explores via tools
- Final verification: runs `npm test` after session to confirm ground truth
- CLI task commands already alias to `iterate --agent <name>` (bin/agentic-lib.js:383)

## Improvement 1: Move Actions task handlers to `runHybridSession`

### Rationale

The hybrid session has better observability (hooks), budget control, and the dedicated `run_tests` tool. The Actions handlers would gain these for free. The prompt assembly logic in each task handler would become the `userPrompt` parameter.

### Current state

The 10 task handlers in `src/actions/agentic-step/tasks/` each:
1. Read context (mission, features, source, issues) via helper functions
2. Assemble a prompt string
3. Call `runCopilotTask()` with model, systemMessage, prompt, writablePaths, tuning
4. Parse the text response for structured output (actions, narratives, file updates)

The hybrid session in `src/copilot/hybrid-session.js`:
1. Takes `agentPrompt` (system) and `userPrompt` (user) as strings
2. Creates session with hooks, tools, infinite sessions
3. Calls `session.sendAndWait()` with the user prompt
4. Returns structured metrics (toolCalls, testRuns, filesWritten, tokens, etc.)

### What needs to change

- Each task handler's prompt assembly becomes a function that returns `{ systemPrompt, userPrompt }`
- The handler calls `runHybridSession` instead of `runCopilotTask`
- `runHybridSession` gains parameters for Actions-specific needs:
  - `octokit` — for task-specific tools that call GitHub APIs
  - `createTools` — custom tool factory (same pattern `runCopilotTask` already supports)
- The `index.js` entry point already handles metrics/logging — it can consume `HybridResult` directly
- `runCopilotTask` and `_runOnce` in session.js become legacy (kept for backwards compat or removed)

### Key files

| File | Change |
|------|--------|
| `src/copilot/hybrid-session.js` | Add `octokit`, `createTools` params; accept Actions-style options |
| `src/actions/agentic-step/tasks/*.js` | Replace `runCopilotTask` with `runHybridSession`; refactor prompt assembly |
| `src/actions/agentic-step/index.js` | Map `HybridResult` to action outputs |
| `src/copilot/session.js` | `runCopilotTask` becomes thin wrapper or deprecated |

## Improvement 2: Task-specific tools

### Rationale

The supervisor returns structured text that workflows parse. A `dispatch_workflow` or `create_issue` tool would let the SDK's own tool loop handle GitHub operations directly — the model calls the tool, the tool calls the GitHub API, the model sees the result. Same sandbox model, fewer prompt-parsing heuristics.

### Current tools (src/copilot/tools.js)

| Tool | Purpose | Available in |
|------|---------|-------------|
| `read_file` | Read file contents | Both patterns |
| `write_file` | Write file (path-safety enforced) | Both patterns |
| `list_files` | List directory contents | Both patterns |
| `run_command` | Shell command (git writes blocked) | Both patterns |
| `run_tests` | Run npm test (dedicated) | Hybrid only |

### Proposed new tools

These tools would be injected by task handlers that need them (via `createTools` parameter):

| Tool | Used by | Purpose | Implementation |
|------|---------|---------|---------------|
| `create_issue` | supervisor, maintain-features | Create GitHub issue with title, body, labels | `octokit.rest.issues.create()` |
| `close_issue` | supervisor, review-issue | Close issue with comment | `octokit.rest.issues.update()` + comment |
| `label_issue` | supervisor, enhance-issue | Add/remove labels | `octokit.rest.issues.addLabels()` |
| `dispatch_workflow` | supervisor | Trigger workflow_dispatch | `octokit.rest.actions.createWorkflowDispatch()` |
| `list_issues` | supervisor, transform | List open issues with labels | `octokit.rest.issues.listForRepo()` |
| `list_prs` | supervisor, fix-code | List open PRs | `octokit.rest.pulls.list()` |
| `get_issue` | transform, fix-code | Get issue details + comments | `octokit.rest.issues.get()` |
| `comment_on_issue` | review-issue, enhance-issue | Add comment to issue | `octokit.rest.issues.createComment()` |
| `comment_on_discussion` | discussions | Reply to GitHub Discussion | GraphQL mutation |
| `run_tests` | all code-changing tasks | Run test suite | Already exists in hybrid session |
| `git_diff` | fix-code | Show uncommitted changes | `execSync("git diff")` |
| `git_status` | transform, fix-code | Show working tree status | `execSync("git status")` |

### What this eliminates

Currently the supervisor task handler (src/actions/agentic-step/tasks/supervise.js) returns structured text like:
```
[ACTION] dispatch:agentic-lib-workflow | mode: dev-only | issue-number: 42
[ACTION] github:create-issue | title: ... | body: ...
```

The workflow YAML then parses this text and runs the corresponding GitHub API calls. With tools, the model calls `create_issue` or `dispatch_workflow` directly during the SDK tool loop — the action happens immediately and the model sees the result. No text parsing, no post-hoc dispatch logic in the workflow YAML.

### Tool safety

All tools respect the same sandbox model:
- `write_file` already enforces `writablePaths`
- `run_command` already blocks git write commands
- New GitHub tools would be scoped by the `GITHUB_TOKEN` permissions
- Destructive tools (close_issue, dispatch_workflow) are guarded by the runner's token scope

## Improvement 3: Lean prompts — let the model explore

### Rationale

The Actions handlers front-load context (all source files, all features, all issues into the prompt). The hybrid session lets the model explore (just mission + test output). The model has `read_file`, `list_files`, and `run_command` tools — it can explore on demand.

### Current front-loading in task handlers

Looking at `src/actions/agentic-step/tasks/transform.js`:

```js
// Pre-reads ALL of these into the prompt:
const mission = readOptionalFile(config.paths.mission.path);           // full file
const features = scanDirectory(config.paths.features.path, ".md", ...); // up to 10 files
const sourceFiles = scanDirectory(config.paths.source.path, ...);       // up to 10 files, 5000 chars each
const webFiles = scanDirectory(config.paths.web?.path, ...);            // up to 10 files
const openIssues = await octokit.rest.issues.listForRepo(...);          // up to 20 issues
```

This burns context window on files the model may not need. For a simple feature addition, the model might only need to read 2-3 files, but gets all 10+ pre-loaded.

### Proposed lean prompt approach

Replace front-loaded content with a **context summary** that tells the model what's available:

```
## Repository Structure
Source files: src/lib/main.js (450 lines), src/lib/utils.js (120 lines)
Test files: tests/unit/main.test.js (200 lines)
Features: 3 files in features/
Website: src/web/index.html, src/web/lib.js

## Mission
[full mission text — this is always needed]

## Target Issue #42: Add CSV parsing
[full issue body — this is the focus]

## Initial test state
TESTS FAILED: 2 failures
  ✗ csvParse returns array of objects
  ✗ csvParse handles quoted fields

Use read_file, list_files, and run_command to explore the codebase.
Write your implementation, then run run_tests to verify.
```

The model gets the mission and target issue (what to do) plus a structural overview (where things are), then uses tools to read the specific files it needs.

### Tuning parameters that can be simplified or removed

With lean prompts, several `[tuning]` knobs become less critical:

| Parameter | Current purpose | With lean prompts |
|-----------|----------------|-------------------|
| `sourceScan` | Max source files to pre-load (default 10) | Not needed — model reads what it needs |
| `sourceContent` | Max chars per source file (default 5000) | Not needed — model reads full files |
| `featuresScan` | Max feature files to pre-load (default 10) | Replace with feature summary in prompt |
| `issuesScan` | Max issues to pre-load (default 20) | Replace with `list_issues` tool |
| `issueBodyLimit` | Max chars per issue body (default 500) | Not needed — model uses `get_issue` tool |
| `staleDays` | Filter issues older than N days (default 30) | Still useful but applied by `list_issues` tool |

The `outline` mode in `scanDirectory` (generates function outlines for large files) also becomes unnecessary — the model reads the file and sees the whole thing.

### What stays in the prompt

- **Mission** — always needed, it's the goal
- **Target issue** — when operating on a specific issue
- **File listing** — a structural overview (names + sizes, not content)
- **Test state** — current pass/fail (already done by hybrid session)
- **Agent instructions** — the agent prompt from `.github/agents/agent-*.md`
- **Writable paths** — which paths the model may modify
- **Constraints** — test command, safety rules

### What moves to tools

- Source file contents → `read_file`
- Feature details → `read_file`
- Issue lists → `list_issues` tool
- Issue details → `get_issue` tool
- PR details → `list_prs` tool
- Directory exploration → `list_files`
- Test execution → `run_tests`

## Fix 4: Centralise log file config in agentic-lib.toml

### Problem

The log filename (`intentïon.md` / `intention.md`), log branch (`agentic-lib-logs`), and screenshot filename (`SCREENSHOT_INDEX.png`) are hardcoded in 20+ places across workflows, scripts, and JS code. The repository0 `agentic-lib-logs` branch shows both `intentïon.md` and `intention.md` at root — both are written to but only one should be the canonical name, read from config.

### Current hardcoding

| Value | Where hardcoded | Count |
|-------|----------------|-------|
| `intentïon.md` / `intention.md` | agentic-lib-workflow.yml (lines 468, 471, 479, 575-576, 685, 706-707, 741, 761-762, 796, 1192-1193, 1362) | ~15 |
| `agentic-lib-logs` | agentic-lib-workflow.yml (lines 463, 471, 573, 683, 704, 739, 759, 794, 1190, 1360), push-to-logs.sh (line 14), agentic-lib-test.yml (line 133) | ~12 |
| `SCREENSHOT_INDEX.png` | agentic-lib-test.yml (lines 130, 138), push-to-logs.sh (usage), zero-.gitignore (line 26), commit-if-changed/action.yml (line 32) | ~5 |

### What agentic-lib.toml already has

```toml
[bot]
log-file = "test/intentïon.md"    #@dist "intentïon.md"
```

The config loader (src/copilot/config.js:281) reads this as `intentionFilepath` with a fallback to `"intentïon.md"`.

### What to add to agentic-lib.toml

```toml
[bot]
log-file = "test/intentïon.md"                  #@dist "intentïon.md"
log-branch = "agentic-lib-logs"
screenshot-file = "SCREENSHOT_INDEX.png"
```

### Changes needed

1. **`agentic-lib.toml`** — add `log-branch` and `screenshot-file` under `[bot]`
2. **`src/copilot/config.js`** — expose `logBranch` and `screenshotFile` from config
3. **`src/scripts/push-to-logs.sh`** — accept branch name as parameter or read from config (the workflow already passes the files as args — add the branch as an env var or first arg)
4. **`.github/workflows/agentic-lib-workflow.yml`** — read log-file, log-branch from `agentic-lib.toml` once in the params job, pass as job outputs. Replace all hardcoded values with these outputs.
5. **`.github/workflows/agentic-lib-test.yml`** — same pattern for screenshot file
6. **`src/actions/commit-if-changed/action.yml`** — read log filenames from config instead of hardcoding in `git reset HEAD`
7. **`src/seeds/zero-.gitignore`** — keep both filenames (this is a seed, it should handle both)

### Approach for the workflow YAML

The `params` job in `agentic-lib-workflow.yml` already reads `agentic-lib.toml` and outputs config values. Add:
```yaml
log-file: ${{ steps.config.outputs.log-file }}
log-branch: ${{ steps.config.outputs.log-branch }}
screenshot-file: ${{ steps.config.outputs.screenshot-file }}
```

Then every `Fetch log from agentic-lib-logs branch` / `Push log to agentic-lib-logs branch` step uses these outputs instead of hardcoded strings.

The dual-filename pattern (`intentïon.md` + `intention.md`) exists for UTF-8 safety. With config, the canonical name comes from TOML and the fallback loop can be simplified: try the config value, then the ASCII fallback, done.

## Fix 5: Discussion tools for the bot

### Problem

The discussions bot (tasks/discussions.js) front-loads all discussion content into the prompt and uses `runCopilotTask` (Pattern 1 — no hooks, no tools). It cannot explore other discussions, search for related issues, or access full thread history beyond the `discussionComments` limit. The supervisor also hardcodes discussion lookup logic (findTalkDiscussion in supervise.js).

### Current architecture

The bot task handler:
1. Fetches one discussion via GraphQL (hardcoded query in `fetchDiscussion()`)
2. Fetches repo context (issues, workflow runs) via Octokit REST calls
3. Stuffs everything into a single prompt string
4. Calls `runCopilotTask()` — no tools, no hooks
5. Parses `[ACTION:...]` tags from the text response
6. Executes actions (postReply, create-issue, dispatch, etc.) via procedural code

The supervisor:
1. Calls `findTalkDiscussion()` — GraphQL query for "talk to the repository" discussions
2. Passes `activeDiscussionUrl` as context in the prompt
3. Uses `respond:discussions` action tag to dispatch the bot

### Proposed discussion tools

Give the bot (and optionally the supervisor) SDK tools for discussion access:

| Tool | Purpose | Implementation |
|------|---------|---------------|
| `fetch_discussion` | Get discussion title, body, and comments by URL or number | GraphQL query (refactor from existing `fetchDiscussion()`) |
| `list_discussions` | List recent discussions (title, URL, comment count, last activity) | GraphQL query on `repository.discussions` |
| `post_discussion_comment` | Reply to a discussion by node ID | GraphQL mutation (refactor from existing `postReply()`) |
| `search_discussions` | Search discussions by keyword | GraphQL `search(type: DISCUSSION)` |

### What this enables

- **Bot can explore**: given a lean prompt with just the trigger comment, the bot can `fetch_discussion` to read the full thread, `list_discussions` to find related threads, and `search_discussions` to find prior conversations on the same topic
- **Bot actions become tools**: instead of `[ACTION:create-issue]` text tags parsed post-hoc, the bot calls `create_issue` tool directly during the SDK loop and sees the result
- **Supervisor discussion access**: the supervisor can use `list_discussions` and `fetch_discussion` tools instead of the bespoke `findTalkDiscussion()` function
- **Full thread access**: the `discussionComments` limit becomes less critical — the bot can paginate via repeated tool calls

### What stays in the prompt

The bot still needs a **minimal context prompt**:
- The trigger comment (which comment to respond to)
- The discussion URL
- The mission (what the repo is about)
- The agent instructions (from `agent-discussion-bot.md`)

Everything else (full thread history, repo context, feature list, recent activity) moves to tools.

### What changes

1. **New file `src/copilot/github-tools.js`** — discussion tools (and the GitHub API tools from Improvement 2) in one place
2. **`tasks/discussions.js`** — switch from `runCopilotTask` to `runHybridSession` with discussion tools injected via `createTools`. Remove `fetchDiscussion()`, `postReply()`, and the `[ACTION:]` parsing — these become tool calls
3. **`tasks/supervise.js`** — replace `findTalkDiscussion()` with `list_discussions` / `fetch_discussion` tools. Remove bespoke GraphQL queries.
4. **Agent prompt `agent-discussion-bot.md`** — update to reference available tools instead of `[ACTION:]` tags

### Bot prompt evolution

**Before** (front-loaded, action tags):
```
## Discussion Thread
URL: https://...
### Thread Title
Body text...
### Conversation History
[20 comments inline]
### Repository Context
[mission, features, issues, workflow runs, activity log, config, package.json]
## Actions
[ACTION:request-supervisor] ...
[ACTION:create-issue] ...
```

**After** (lean, tool-driven):
```
## Trigger
A user commented on discussion https://github.com/.../discussions/2401
Comment: "Can you add CSV parsing support?"

## Mission
[mission text]

## Available tools
Use fetch_discussion to read the full thread.
Use list_discussions to find related conversations.
Use post_discussion_comment to reply.
Use create_issue to create follow-up work.
Use list_issues to check existing issues.

Respond to the trigger comment. Use tools to gather any context you need.
```

## Fix 6: Dual log file on the logs branch

### Problem

The `agentic-lib-logs` branch in repository0 shows BOTH `intentïon.md` and `intention.md` at the root. The push-to-logs.sh script is called with both filenames:
```bash
bash .github/agentic-lib/scripts/push-to-logs.sh "intentïon.md" "intention.md"
```

But the logging code (logging.js) only writes to the single path from config (`intentionFilepath`). The second file is either stale or a copy. This creates confusion — the GitHub UI shows two files but only one is current.

### Root cause

The workflow YAML passes both filenames to `push-to-logs.sh` as a safety net (in case the filesystem doesn't support UTF-8). But `logActivity()` in logging.js only writes to the configured path. The script then pushes whatever files exist — if a previous run created both, both get pushed.

### Fix

1. The logging code (`logging.js`) should write to the config path AND create a symlink or copy to the ASCII fallback name — OR — only write to the config path and the workflow should only push that one file
2. Simplify the workflow to push only `${{ needs.params.outputs.log-file }}` (from Fix 4)
3. The `push-to-logs.sh` usage in workflows changes from:
   ```bash
   bash .github/agentic-lib/scripts/push-to-logs.sh "intentïon.md" "intention.md"
   ```
   to:
   ```bash
   bash .github/agentic-lib/scripts/push-to-logs.sh "${{ needs.params.outputs.log-file }}"
   ```
4. For backward compatibility, logging.js writes to the configured name and also copies to `intention.md` (ASCII fallback) so that systems that can't handle UTF-8 filenames can still read the log

## SDK Capabilities — Do With the 3 Improvements

These SDK features should be adopted as part of Improvements 1–3 because they directly enable or simplify those changes.

### Switch to `systemMessage.mode: "append"` (Improvement 1)

**Current**: Both `runCopilotTask` (session.js:310) and `runHybridSession` (hybrid-session.js:158) use `"replace"` mode, which removes all SDK guardrails including the SDK's own documentation of built-in tools.

**Change**: Switch to `"append"` mode. The SDK keeps its foundation system prompt (tool docs, safety rules) and we append our agent instructions. System prompts get shorter because we no longer re-explain what `read_file` and `write_file` do.

**Implication**: If our custom tools (`read_file`, `write_file`, etc.) clash with SDK built-ins, add `overridesBuiltInTool: true` to each `defineTool()` call. This is already supported in the Tool interface.

### Use `availableTools` / `excludedTools` for task scoping (Improvement 2)

**Current**: Every tool is available in every session — the supervisor can `write_file`, the transform can `dispatch_workflow`.

**Change**: Use `excludedTools` per task type to prevent wrong tools in wrong contexts:
- Supervisor: exclude `write_file`, `run_tests` (it orchestrates, doesn't code)
- Transform: exclude `dispatch_workflow`, `create_issue`, `close_issue` (it codes, doesn't orchestrate)
- Review: exclude `write_file`, `dispatch_workflow` (it reads and evaluates)

This is a simple config change per task handler — no new code, just a `excludedTools` array in the `SessionConfig`.

### Use `attachments` instead of front-loading (Improvement 3)

**Current**: `scanDirectory()` reads files into strings, stuffed into the prompt text. Burns context on files the model may not need.

**Change**: Use `MessageOptions.attachments` when calling `sendAndWait()`:
```js
await session.sendAndWait({
  prompt: leanPromptText,
  attachments: [
    { type: "file", path: resolve(wsPath, "MISSION.md") },
    { type: "directory", path: resolve(wsPath, "src/lib") },
    { type: "directory", path: resolve(wsPath, "tests/unit") },
  ],
});
```

The SDK handles context injection natively. The model sees the file structure and can selectively read contents via tools. This replaces `scanDirectory()`, `sourceScan`, `sourceContent`, `featuresScan` tuning parameters.

### Use hook `modifiedResult` for output truncation (Improvement 3)

**Current**: `contentLimit` tuning parameter truncates files during `scanDirectory()` before they reach the prompt.

**Change**: In the `onPostToolUse` hook, use `modifiedResult` to truncate large `read_file` results before the model sees them:
```js
onPostToolUse: (input) => {
  if (input.toolName === "read_file" && input.toolResult?.textResultForLlm?.length > 20000) {
    return {
      modifiedResult: {
        ...input.toolResult,
        textResultForLlm: input.toolResult.textResultForLlm.substring(0, 20000) + "\n... (truncated)",
      },
    };
  }
}
```

This moves truncation from prompt-assembly time to tool-execution time — the model reads the full file when it's small, and gets a truncated version only when necessary. The `outline` mode in `scanDirectory` also becomes unnecessary.

### Use hook `additionalContext` for guidance injection (Improvement 3)

**Current**: All guidance is front-loaded in the prompt text.

**Change**: After `run_tests`, inject targeted guidance via `additionalContext`:
```js
onPostToolUse: (input) => {
  if (input.toolName === "run_tests") {
    const result = input.toolResult?.textResultForLlm || "";
    if (/TESTS FAILED/i.test(result)) {
      return { additionalContext: "Focus on the failing tests. Read the test file to understand expectations before changing source." };
    }
  }
}
```

This keeps the initial prompt lean and injects context only when it's relevant.

### Use `session.abort()` for budget exhaustion (Improvement 1)

**Current**: When tool-call budget is reached, `onPreToolUse` returns deny. The model may keep trying.

**Change**: When budget is exhausted, call `session.abort()` for a clean stop, then extract whatever work was done (files written, test results). The session stays valid — we can inspect `metrics` and run a final `npm test`.

### Use dynamic `reasoningEffort` detection (Improvement 1)

**Current**: `MODELS_SUPPORTING_REASONING_EFFORT` is hardcoded to `["gpt-5-mini", "o4-mini"]`.

**Change**: Call `client.listModels()` once at startup to check `capabilities.supports.reasoningEffort` for the chosen model. This future-proofs against new models being added.

## SDK Capabilities — Do Later

These SDK features are interesting but should wait until the 3 improvements are delivered and stable.

### `session.setModel()` — mid-session model switching

Use a cheaper model for exploration (reading files, listing directories) and switch to a more capable model for implementation. Could reduce costs for the lean-prompt approach where the model does more read_file calls to explore. Requires measuring whether the model-switch overhead is worth the per-token savings.

### `onSessionStart` / `onSessionEnd` hooks

Use `onSessionEnd` to capture a session summary for the activity log (the hook output supports `sessionSummary`). Use `onSessionStart` to inject workspace-specific context (e.g., recent git log, current branch). Not blocking — the current approach of logging metrics after the session works fine.

### `onUserPromptSubmitted` hook — prompt rewriting

Could modify prompts before they reach the model (e.g., expand shorthand, inject standard context). Not needed while prompts are constructed programmatically — this is more useful for interactive sessions.

### `customAgents` — sub-agents within a session

Define sub-agents with their own tools and prompts. The supervisor could delegate to transform/review within the same session instead of dispatching separate workflows. Architecturally interesting but a much larger change — fundamentally alters the workflow dispatch model.

### `mcpServers` — MCP server integration

Connect MCP servers (local stdio or remote http/sse) directly into a session. The GitHub API tools (Improvement 2) could be implemented as a reusable MCP server instead of individual `defineTool()` calls. Better for reuse across different contexts but adds operational complexity (server lifecycle management).

### `binaryResultsForLlm` — image/binary tool results

Tools can return images alongside text results. Could be used for screenshot-based testing or visual regression — e.g., Playwright screenshots attached to test results. Niche use case for now.

## Implementation Order

### Phase A: Fixes (can start immediately, independent of each other)

1. **Fix 4: Centralise log config** — add `log-branch`, `screenshot-file` to `agentic-lib.toml`, update config.js, update workflow YAML and push-to-logs.sh to read from config
2. **Fix 6: Single log file** — simplify push-to-logs.sh invocations to use config value, add ASCII fallback copy in logging.js
3. **Fix 5: Discussion tools** — create `src/copilot/github-tools.js` with `fetch_discussion`, `list_discussions`, `post_discussion_comment`, `search_discussions`. Migrate discussions.js to `runHybridSession` with these tools.

### Phase B: Core improvements (sequential)

4. **Add GitHub API tools** (Improvement 2) to `github-tools.js`: `create_issue`, `close_issue`, `label_issue`, `dispatch_workflow`, `list_issues`, `list_prs`, `get_issue`, `comment_on_issue`, `git_diff`, `git_status`
5. **Switch to `systemMessage.mode: "append"`** and add `overridesBuiltInTool: true` to custom tools
6. **Refactor one task handler** (e.g., `transform`) to use `runHybridSession` with lean prompt + `attachments` as a proof of concept
7. **Add `excludedTools`** per task type to scope tools
8. **Add `modifiedResult` and `additionalContext`** to `onPostToolUse` hook
9. **Replace `contentLimit`/`scanDirectory` truncation** with hook-based truncation
10. **Migrate remaining task handlers** one at a time
11. **Simplify tuning parameters** — remove `sourceScan`, `sourceContent`, `featuresScan`, `issuesScan`, `issueBodyLimit`, `outline`

### Phase C: Polish

12. **Use `session.abort()` for budget exhaustion** instead of deny-in-hook
13. **Use `client.listModels()` for dynamic reasoning effort** detection
14. **Update agent prompts** in `src/agents/` to reference the new tools
15. **Deprecate `runCopilotTask`** once all handlers use hybrid session

## Risk Assessment

- **More tool-call round trips** — lean prompts mean more read_file calls. This costs more API calls but uses less context window. Net token usage may be similar or lower.
- **Model exploration quality** — the model must know what to read. The file listing in the prompt serves as a roadmap. If the model reads irrelevant files, it wastes budget.
- **`"append"` mode interactions** — switching from `"replace"` to `"append"` changes the system prompt foundation. The SDK's built-in instructions may conflict with our agent prompts. Need to test each agent type carefully.
- **`attachments` behaviour** — how the SDK handles directory attachments (depth, file count, binary files) needs testing. May need to limit attachment scope for large repos.
- **`overridesBuiltInTool` correctness** — our custom `read_file`/`write_file` must have compatible signatures with the SDK built-ins, or the model may pass unexpected arguments.
- **Backwards compatibility** — existing workflow YAML parses supervisor output text. Moving to tools means the workflow dispatch logic moves into the tool handler. The workflow YAML simplifies but must be updated.
- **Discussion tool migration** — the bot currently uses `[ACTION:]` text tags parsed post-hoc. Moving to tools means the bot calls `create_issue` directly. The bot workflow's dispatch-supervisor job logic needs updating since `[ACTION:request-supervisor]` becomes a tool call.
- **Log config migration** — workflow YAML has ~30 hardcoded references. Need to update all in one commit to avoid partial migration state. The params job must expose the new config values before other jobs can consume them.
- **Testing** — all 580+ unit tests must continue passing. New tools need their own test coverage. Discussion tool migration needs new tests for GraphQL tool handlers.
