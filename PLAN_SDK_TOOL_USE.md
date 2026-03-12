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

## Implementation Order

1. **Add task-specific tools** to `src/copilot/tools.js` (or a new `github-tools.js`)
2. **Refactor one task handler** (e.g., `transform`) to use `runHybridSession` with lean prompt as a proof of concept
3. **Migrate remaining task handlers** one at a time
4. **Simplify tuning parameters** — remove scan/content limits that are no longer needed
5. **Update agent prompts** in `src/agents/` to reference the new tools
6. **Deprecate `runCopilotTask`** once all handlers use hybrid session

## Risk Assessment

- **More tool-call round trips** — lean prompts mean more read_file calls. This costs more API calls but uses less context window. Net token usage may be similar or lower.
- **Model exploration quality** — the model must know what to read. The file listing in the prompt serves as a roadmap. If the model reads irrelevant files, it wastes budget.
- **Backwards compatibility** — existing workflow YAML parses supervisor output text. Moving to tools means the workflow dispatch logic moves into the tool handler. The workflow YAML simplifies but must be updated.
- **Testing** — all 580+ unit tests must continue passing. New tools need their own test coverage.
