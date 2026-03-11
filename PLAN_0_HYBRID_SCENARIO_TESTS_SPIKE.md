# Plan: Hybrid Iteration — Copilot SDK Locally with Actions Parity

## Goal

Run whole iterations to completion or failure from a single local command, using the Copilot SDK tool loops, the user's authentication, and Claude Code supervision — without GitHub Actions overhead. Then share the code so both paths (local CLI and Actions workflows) use the same orchestration.

## Current State: Two Diverged Forks

The Copilot SDK integration exists in two places that share zero imports:

| | **Actions** (`src/actions/agentic-step/`) | **CLI** (`bin/agentic-lib.js`) |
|-|------------------------------------------|-------------------------------|
| Lines | ~4,500 across 15 files | ~500 in one file (of 1,455 total) |
| Tasks | 9 handlers (transform, fix-code, supervise, ...) | 4 tasks (transform, fix-code, maintain-features, maintain-library) |
| Config | Full profile/tuning resolution (min/recommended/max) | Minimal — no profiles, hardcoded limits |
| Token tracking | Event-based accumulation from `assistant.usage` | Reads `response?.data?.usage` (doesn't work) |
| Rate limit retry | 3 retries with exponential backoff + Retry-After | None — fails immediately |
| Source scanning | `scanDirectory()` with mtime sort, `cleanSource()`, `generateOutline()`, web files | Simple `scanDir()`, contentLimit: 2000 |
| Prompts | Rich context per task with tuning-controlled limits | Simplified prompts with hardcoded limits |
| Narrative | `[NARRATIVE]` tag extraction for activity log | None |
| Safety | `safety.js` module for path validation | Inline check |
| Dependencies | `@actions/core`, `@actions/github`, `@github/copilot-sdk` | `@github/copilot-sdk` (dynamically located) |

The CLI is a degraded fork. Bringing it to parity by hand would be fragile and duplicate work. Instead: extract the Actions code into a shared module, wire both consumers to it, then uplift.

## SDK Features We're Not Using (Either Path)

The Copilot SDK (`@github/copilot-sdk@0.1.31-unstable.0`) has:

| Feature | SDK API | Currently used? |
|---------|---------|----------------|
| **Autopilot mode** | `session.rpc.mode.set({ mode: "autopilot" })` | No |
| **Session resume** | `client.resumeSession(sessionId)` | No |
| **Lifecycle hooks** | `onPreToolUse`, `onPostToolUse`, `onSessionEnd`, `onErrorOccurred` | No |
| **Infinite sessions** | `infiniteSessions: { enabled: true }` | Flag set but not leveraged |
| **Custom agents** | `customAgents: [{ name, prompt, tools }]` | No |
| **Streaming** | `streaming: true` + delta events | No |
| **Attachments** | File/directory attachments on messages | No |
| **Model switching** | `session.setModel()` mid-session | No |
| **Built-in workspace files** | `session.rpc.workspace.readFile/createFile/listFiles` | No |
| **Plan management** | `session.rpc.plan.read/update/delete` | No |
| **Sub-agents/fleet** | `session.rpc.fleet.start()` + subagent events | No |
| **Manual compaction** | `session.rpc.compaction.compact()` | No |
| **Reasoning effort** | `reasoningEffort: "low" \| "medium" \| "high" \| "xhigh"` | Only for 2 models |

---

## Phase 1: Port Actions Orchestration to Shared Module

**Goal**: Copy the rich Actions code into `src/copilot/` as a standalone module that works without `@actions/core` or `@actions/github`. Wire the CLI to use it. Actions continues to work as before.

### What moves

| Source (Actions) | Target (shared) | Changes needed |
|-----------------|-----------------|----------------|
| `copilot.js` (545 lines) | `src/copilot/session.js` | Replace `core.info/warning/error` → logger interface. Remove `@actions/core` import. |
| `tools.js` (142 lines) | `src/copilot/tools.js` | Replace `core.info` → logger. No other changes. |
| `config-loader.js` (299 lines) | `src/copilot/config.js` | Already standalone (no `@actions/*` imports). Move as-is. |
| `safety.js` (106 lines) | `src/copilot/safety.js` | Already standalone. Move as-is. |
| `tasks/transform.js` (338 lines) | `src/copilot/tasks/transform.js` | Extract prompt-building from octokit-dependent context. Split: `buildTransformPrompt(context)` (pure) + `gatherGitHubContext(octokit)` (optional). |
| `tasks/fix-code.js` (274 lines) | `src/copilot/tasks/fix-code.js` | Same split: pure prompt + optional GitHub context. |
| `tasks/maintain-features.js` (112 lines) | `src/copilot/tasks/maintain-features.js` | Same pattern. |
| `tasks/maintain-library.js` (108 lines) | `src/copilot/tasks/maintain-library.js` | Same pattern. |

### What stays in Actions (thin wrapper)

`src/actions/agentic-step/index.js` becomes a thin dispatcher that:
1. Reads Action inputs (task, model, issue-number, etc.)
2. Creates octokit from `@actions/github`
3. Calls shared task functions from `src/copilot/tasks/`
4. Writes Action outputs (outcome, pr-number, tokens-used)
5. Logs to `intentïon.md`

### What the CLI gets

`bin/agentic-lib.js` `runTask()` (lines 189–296) shrinks to:
1. Parse CLI args
2. Load config from `src/copilot/config.js`
3. Call shared task functions from `src/copilot/tasks/`
4. Print results

The ~500 lines of duplicated CLI code (`buildTaskPrompt`, `createCliTools`, `loadTaskConfig`, `scanDir`, per-task prompt builders) get deleted.

### Logger interface

```js
// src/copilot/logger.js
// Adapts to @actions/core in Actions, console in CLI
export function createLogger(backend = "console") {
  if (backend === "actions") {
    const core = await import("@actions/core");
    return { info: core.info, warning: core.warning, error: core.error, debug: core.debug };
  }
  return { info: console.log, warning: console.warn, error: console.error, debug: () => {} };
}
```

### Iterate loop

`src/iterate.js` switches from spawning `node bin/agentic-lib.js <step>` (a new process per step) to calling the shared task functions directly in-process:

```js
// Before: 3 processes per cycle, zero context
runCli(`transform --target ${targetPath} --model ${model}`, targetPath);

// After: direct function call, same process
import { transform } from "./copilot/tasks/transform.js";
await transform({ config, model, writablePaths, logger });
```

### Success criteria

- [ ] `npm test` passes (existing tests still work)
- [ ] `npx @xn-intenton-z2a/agentic-lib transform --target /tmp/ws --model gpt-5-mini` uses the shared module
- [ ] Actions `agentic-step` still works (deployed to repository0, runs a cycle)
- [ ] CLI and Actions produce identical prompts for the same task+config

### Estimated scope

~15 files changed. No new features — just moving code and replacing the logger.

---

## Phase 1b: Close CLI Feature Gaps for Actions Parity

**Goal**: Bring the CLI `iterate` command up to feature parity with the Action's per-task invocations. After this phase, `iterate --agent <agent-name>` provides the same tools, context gathering, safety, and output structure as the Action.

### Gap 1: Tools — give CLI the full 4-tool set

**Current**: `runHybridSession()` defines only a `run_tests` tool. The agent uses the SDK's built-in shell/edit tools with no writable-path enforcement.

**Target**: Use `createAgentTools()` from `src/copilot/tools.js` (already shared) to provide `read_file`, `write_file`, `list_files`, `run_command` with writable-path safety + blocked git commands. Keep `run_tests` as a 5th tool.

**Files**: `src/copilot/hybrid-session.js`

### Gap 2: Context builder — `buildUserPrompt()`

**Current**: The user prompt is just mission text + initial test output. Each Action task builds a rich prompt with scanned source files, features, issues, etc.

**Target**: Create `src/copilot/context.js` with a `buildUserPrompt(agentName, context)` function. It assembles context-dependent sections (mission, source files, features, issues, paths) based on what's available. Each agent name maps to a set of context requirements. Works with or without GitHub data.

**Files**: `src/copilot/context.js` (new), `src/copilot/hybrid-session.js`, `bin/agentic-lib.js`

### Gap 3: Source scanning in CLI

**Current**: The CLI doesn't scan the workspace. The agent must explore via tools.

**Target**: Use `scanDirectory()` from `src/copilot/session.js` to scan source, test, and feature files based on config paths. Include scanned content in the user prompt via `buildUserPrompt()`.

**Files**: `src/copilot/context.js`, `bin/agentic-lib.js`

### Gap 4: Config-driven paths and writable-path enforcement

**Current**: The CLI loads `agentic-lib.toml` for mission path and tuning but ignores `paths.*` for scanning and writable enforcement.

**Target**: Read `config.writablePaths` and `config.readOnlyPaths` from config. Pass `writablePaths` to `createAgentTools()`. Include `formatPathsSection()` in the user prompt.

**Files**: `src/copilot/hybrid-session.js`, `bin/agentic-lib.js`

### Gap 5: Safety — blocked git commands and writable paths

**Current**: No safety enforcement in CLI mode.

**Target**: Already handled by Gap 1 — `createAgentTools()` enforces writable paths and blocks git write commands in `run_command`.

### Gap 6: Narrative extraction and structured output

**Current**: `runHybridSession()` returns raw metrics. No narrative extraction from agent response.

**Target**: Append `NARRATIVE_INSTRUCTION` to the system prompt. Extract `[NARRATIVE]` from agent response using `extractNarrative()`. Include in result object.

**Files**: `src/copilot/hybrid-session.js`

### Gap 7: GitHub context flags (optional enrichment)

**Current**: No `--issue-number`, `--pr-number`, or `--discussion-url` flags.

**Target**: Add CLI flags. When provided, use `gh` CLI to fetch context (lighter than octokit). Pass as optional context to `buildUserPrompt()`. When absent, prompts work with local-only context.

**Files**: `bin/agentic-lib.js`, `src/copilot/context.js`

### Gap 8: Rate limit retry in hybrid session

**Current**: `runHybridSession()` has no rate-limit retry. `runCopilotTask()` in session.js has 3 retries.

**Target**: Wrap the `client.createSession()` + `session.sendAndWait()` flow with the same `isRateLimitError()` / `retryDelayMs()` pattern from session.js.

**Files**: `src/copilot/hybrid-session.js`

### Success criteria

- [ ] `npm test` passes (all ~435 tests + new tests for context.js)
- [ ] `runHybridSession()` provides 5 tools (read_file, write_file, list_files, run_command, run_tests)
- [ ] Writable paths enforced — `write_file` outside configured paths returns error
- [ ] Git write commands blocked in `run_command`
- [ ] User prompt includes scanned source files, features, paths section when available
- [ ] `--issue-number` flag fetches issue context via `gh` and includes in prompt
- [ ] Agent response narrative extracted and included in result
- [ ] Rate limit retry works in hybrid session

---

## Phase 2: Uplift to High-Level SDK Abstractions

**Goal**: Replace our manual orchestration with SDK-native features. The shared module from Phase 1 gives us one place to make these changes.

### 2a: Lifecycle hooks (replaces manual tracking)

```js
// src/copilot/session.js — add to createSession config
hooks: {
  onPreToolUse: ({ toolName, toolArgs }) => {
    logger.info(`[tool] ${toolName}(${JSON.stringify(toolArgs).substring(0, 200)})`);
    metrics.toolCalls.push({ tool: toolName, time: Date.now() });
    // Budget guard: if cost >= budget, return { permissionDecision: "deny" }
  },
  onPostToolUse: ({ toolName, toolArgs, toolResult }) => {
    if (toolName.match(/write|edit/i)) {
      metrics.filesWritten.add(toolArgs?.path || toolArgs?.file_path);
    }
  },
  onErrorOccurred: ({ error, errorContext, recoverable }) => {
    logger.error(`[${errorContext}] ${error}`);
    if (recoverable) return { errorHandling: "retry", retryCount: 2 };
    return { errorHandling: "abort" };
  },
  onSessionEnd: ({ reason, finalMessage }) => {
    metrics.endReason = reason;
    metrics.finalMessage = finalMessage;
  },
},
```

**Replaces**: Manual try/catch, manual token accumulation, manual convergence detection.

### 2b: Infinite sessions (replaces context-discarding)

```js
infiniteSessions: { enabled: true, backgroundCompactionThreshold: 0.80 },
```

**Replaces**: Creating new sessions per step that lose all context.

### 2c: Single-session iteration (replaces multi-session loop)

Instead of `runIterationLoop` creating 3 sessions per cycle:

```js
// One session for the whole iteration
const session = await client.createSession({ model, tools, hooks, infiniteSessions, ... });

// Send the mission once — agent drives its own loop
await session.sendAndWait({
  prompt: missionPrompt,
  attachments: [{ type: "directory", path: workspace }],
}, 600000);
```

**Replaces**: `runIterationLoop` → `runCli` per step → new process + session per step.

### 2d: Autopilot mode (if available)

```js
try {
  await session.rpc.mode.set({ mode: "autopilot" });
} catch {
  // Fall back to default — sendAndWait still runs the tool loop
}
```

### 2e: Session resume (if available)

```js
// Save session ID after creation
writeFileSync(join(workspace, ".session-id"), session.sessionId);

// On subsequent runs, resume instead of recreating
const savedId = readFileSync(join(workspace, ".session-id"), "utf8");
const session = await client.resumeSession(savedId, { tools, hooks, ... });
```

### Success criteria

- [ ] Single session completes hamming-distance without crashes
- [ ] Hooks fire and collect metrics (tool calls, tokens, errors)
- [ ] Agent carries context between "read tests → write code → run tests → fix" cycles
- [ ] Wall clock < 5 min for hamming-distance (vs ~30-60 min via Actions)

---

## Phase 3: Validate Locally

**Goal**: Run multiple missions end-to-end, compare to Actions benchmarks.

### Test matrix

| Mission | Model | Profile | Expected |
|---------|-------|---------|----------|
| hamming-distance | gpt-5-mini | min | Pass — simplest mission |
| fizz-buzz | gpt-5-mini | recommended | Pass — known working in Benchmark 004 |
| roman-numerals | claude-sonnet-4 | recommended | Pass — moderate complexity |
| string-utils | gpt-4.1 | max | Stretch — complex mission |

### What to record per run

```json
{
  "mission": "hamming-distance",
  "model": "gpt-5-mini",
  "profile": "min",
  "reasoningEffort": "medium",
  "wallClock": "127s",
  "sessionTime": "98s",
  "tokensIn": 12400,
  "tokensOut": 3200,
  "toolCalls": 14,
  "testRuns": 3,
  "filesWritten": ["src/lib/main.js"],
  "testsPassed": true,
  "errors": [],
  "endReason": "complete",
  "autopilotActive": true,
  "sessionsCreated": 1,
  "hooksFired": { "preToolUse": 14, "postToolUse": 14, "errorOccurred": 0, "sessionEnd": 1 }
}
```

### Compare to Actions benchmarks

| Metric | Actions (Benchmark 005/006) | Local (Phase 3) | Delta |
|--------|----------------------------|-----------------|-------|
| Wall clock per iteration | 5-10 min | Target: 1-2 min | 3-5x faster |
| Sessions per iteration | 3 (one per step) | 1 | 3x fewer |
| Token waste (re-explaining context) | High (no carry) | Low (full carry) | Measurable |
| Total tokens | Baseline | ? | Compare |

### Success criteria

- [ ] hamming-distance passes with gpt-5-mini/min
- [ ] At least 2 of 4 scenarios pass
- [ ] Wall clock < 3 min for hamming-distance
- [ ] Structured results JSON produced for every run
- [ ] Results written to `BENCHMARK_REPORT_007.md` or similar

---

## Phase 4: CLI as First-Class Product — Converge Actions and CLI

**Goal**: Make the CLI (`bin/agentic-lib.js`) the canonical entry point for all agentic operations. The GitHub Action (`src/actions/agentic-step/index.js`) becomes a thin adapter that reads Action inputs and calls the same shared code the CLI uses. Both paths share agent selection, tool definitions, prompt building, and session management — they differ only in I/O (where context comes from, where results go).

### Design Principle

The CLI is agentic-lib, literally. The `--agent` flag already provides the key abstraction: `iterate --agent agent-issue-resolution` runs the same agent prompt that the Actions `transform` task uses. Every Action task reduces to `runHybridSession()` with a specific agent .md file and a context-dependent user prompt. The Action adds GitHub-specific context (octokit, issues, PRs, discussions) but the core — which agent runs, which tools it gets — is just an `--agent` selection.

### The Key Insight

The `--agent` flag makes all 10 Action tasks expressible as CLI invocations:

```bash
# These are equivalent:
npx agentic-lib iterate --agent agent-issue-resolution    # CLI
agentic-step task=transform                               # Action

# The only difference is what context goes into the user prompt
```

Each Action task handler does two things:
1. **Gather context** — scan files, fetch GitHub data, build a user prompt
2. **Run an agent** — `runCopilotTask()` with a system prompt + user prompt

Phase 4 converges these by:
- Making context gathering shared (works with or without GitHub)
- Making agent selection explicit via `--agent` (already done)
- Making `runHybridSession()` the single execution path (instead of `runCopilotTask()`)

### Current State

```
src/actions/agentic-step/           ← 4,717 lines, self-contained
  index.js          (372 lines)     ← Orchestration + telemetry + metrics
  copilot.js        (545 lines)     ← SDK wrapper, scanning, rate limiting
  tools.js          (142 lines)     ← Tool definitions (read/write/list/run)
  safety.js         (106 lines)     ← WIP limits, path validation
  config-loader.js  (308 lines)     ← TOML config (duplicate of src/copilot/config.js)
  logging.js        (211 lines)     ← intentïon.md activity log
  tasks/             (10 handlers)  ← 3,033 lines of prompt builders + SDK calls

src/copilot/                        ← 1,540 lines, new shared module
  hybrid-session.js (281 lines)     ← Single-session runner (hooks, metrics, events)
  session.js        (372 lines)     ← SDK wrapper (used by iterate)
  config.js         (308 lines)     ← TOML config
  tools.js          (141 lines)     ← Tool definitions (used by iterate)
  agents.js         (39 lines)      ← Agent prompt loader (--agent support)
  logger.js         (43 lines)      ← Console/actions adapter
  sdk.js            (36 lines)      ← SDK locator
  tasks/            (4 handlers)    ← 320 lines (thin wrappers, soon replaced)
```

### Target Architecture

The 10 separate task handler files collapse into context-gathering + `--agent` selection. The agent .md files ARE the task definitions.

```
src/copilot/                        ← Single source of truth
  hybrid-session.js                 ← runHybridSession() — the one execution path
  config.js                         ← TOML config
  tools.js                          ← defineTool() wrappers (merged, no @actions/core)
  agents.js                         ← loadAgentPrompt() — agent .md file loader
  context.js                        ← Context gathering (scan, filter, summarise)
  prompts.js                        ← Prompt assembly (path sections, narrative)
  safety.js                         ← Path validation + optional GitHub checks
  logger.js                         ← Logger interface
  sdk.js                            ← SDK locator
  session.js                        ← SDK lifecycle (auth, rate limiting)
  telemetry.js                      ← Mission metrics (from index.js)

src/agents/                         ← Agent prompts (system messages)
  agent-iterate.md                  ← General iterate
  agent-discovery.md                ← --here discovery
  agent-issue-resolution.md         ← transform / resolve-issue
  agent-apply-fix.md                ← fix-code
  agent-maintain-features.md        ← maintain-features
  agent-maintain-library.md         ← maintain-library
  agent-ready-issue.md              ← enhance-issue
  agent-review-issue.md             ← review-issue
  agent-discussion-bot.md           ← discussions
  agent-supervisor.md               ← supervise
  agent-director.md                 ← direct

bin/agentic-lib.js                  ← CLI entry point
  iterate                           ← --agent agent-iterate (default)
  iterate --here                    ← --agent agent-discovery → --agent agent-iterate
  iterate --agent agent-supervisor  ← runs supervisor agent locally
  iterate --agent <any>             ← runs any agent with local context
  (old runTask() replaced by iterate --agent)

src/actions/agentic-step/           ← Thin adapter (~150 lines)
  index.js                          ← Map task name → agent + GitHub context → iterate
  logging.js                        ← intentïon.md (Actions-specific)
  (copilot.js, tools.js, config-loader.js, safety.js, tasks/*.js → DELETED)
```

### Task → Agent Mapping

Each Action task maps directly to an `--agent` invocation:

| Action Task | CLI Equivalent | Agent File | User Prompt Source |
|---|---|---|---|
| `transform` | `iterate --agent agent-issue-resolution` | `agent-issue-resolution.md` | Mission + features + source + issues |
| `fix-code` | `iterate --agent agent-apply-fix` | `agent-apply-fix.md` | Failing test output + PR context |
| `maintain-features` | `iterate --agent agent-maintain-features` | `agent-maintain-features.md` | Mission + existing features |
| `maintain-library` | `iterate --agent agent-maintain-library` | `agent-maintain-library.md` | SOURCES.md + library files |
| `resolve-issue` | `iterate --agent agent-issue-resolution --issue N` | `agent-issue-resolution.md` | Issue body + source |
| `enhance-issue` | `iterate --agent agent-ready-issue --issue N` | `agent-ready-issue.md` | Issue + mission |
| `review-issue` | `iterate --agent agent-review-issue --issue N` | `agent-review-issue.md` | Issue + recent PRs |
| `discussions` | `iterate --agent agent-discussion-bot --discussion <url>` | `agent-discussion-bot.md` | Discussion thread |
| `supervise` | `iterate --agent agent-supervisor` | `agent-supervisor.md` | Full repo state |
| `direct` | `iterate --agent agent-director` | `agent-director.md` | Metrics + mission |

### Migration Steps

#### Step 1: Extract shared context utilities from copilot.js

Move scanning, filtering, and summarising to `src/copilot/context.js`. These are pure functions with no `@actions/core` dependency (replace `core.info` with logger parameter):

- `cleanSource()`, `generateOutline()`, `scanDirectory()` — file scanning
- `filterIssues()`, `summariseIssue()`, `extractFeatureSummary()` — GitHub data formatting
- `readOptionalFile()` — safe file reading

Move prompt formatting to `src/copilot/prompts.js`:
- `formatPathsSection()`, `extractNarrative()`, `NARRATIVE_INSTRUCTION`

Move rate limiting to `src/copilot/session.js` (merge with existing):
- `isRateLimitError()`, `retryDelayMs()`, `buildClientOptions()`, `runCopilotTask()`

#### Step 2: Build user prompt from context

Create a `buildUserPrompt(agentName, context)` function in `context.js` that assembles the user prompt for each agent based on available context. This replaces the per-task prompt builders:

```javascript
export function buildUserPrompt(agentName, { config, mission, sourceFiles, features, github }) {
  const sections = [];
  sections.push(`## Mission\n${mission}`);

  if (sourceFiles?.length) {
    sections.push(`## Source Files (${sourceFiles.length})`);
    sourceFiles.forEach(f => sections.push(`### ${f.name}\n\`\`\`\n${f.content}\n\`\`\``));
  }

  if (features?.length) {
    sections.push(`## Features (${features.length})`);
    // ...
  }

  // GitHub context is optional — only included when available
  if (github?.openIssues?.length) {
    sections.push(`## Open Issues (${github.openIssues.length})`);
    // ...
  }

  return sections.join("\n\n");
}
```

#### Step 3: Replace runTask() with iterate --agent

The CLI's `runTask()` function (lines 332-412) currently dispatches to `src/copilot/tasks/*.js`. Replace this with `runHybridSession()` using the appropriate agent:

```javascript
const TASK_AGENT_MAP = {
  "transform": "agent-issue-resolution",
  "fix-code": "agent-apply-fix",
  "maintain-features": "agent-maintain-features",
  "maintain-library": "agent-maintain-library",
  "resolve-issue": "agent-issue-resolution",
  "enhance-issue": "agent-ready-issue",
  "review-issue": "agent-review-issue",
  "discussions": "agent-discussion-bot",
  "supervise": "agent-supervisor",
  "direct": "agent-director",
};

// runTask() becomes:
const agentName = TASK_AGENT_MAP[taskName];
const agentPrompt = loadAgentPrompt(agentName);
const userPrompt = buildUserPrompt(agentName, localContext);
const result = await runHybridSession({ agentPrompt, userPrompt, ... });
```

#### Step 4: Slim Actions index.js

The Action's `index.js` becomes a thin adapter that:
1. Reads Action inputs (task, model, issue-number, etc.)
2. Maps task name → agent name via `TASK_AGENT_MAP`
3. Gathers GitHub context via octokit
4. Calls `runHybridSession()` with the agent prompt + enriched user prompt
5. Sets Action outputs and logs to intentïon.md

### What Gets Deleted

| File | Lines | Reason |
|------|-------|--------|
| `src/actions/agentic-step/copilot.js` | 545 | Split into `context.js`, `prompts.js`, merged into `session.js` |
| `src/actions/agentic-step/tools.js` | 142 | Merged into `src/copilot/tools.js` |
| `src/actions/agentic-step/config-loader.js` | 308 | Duplicate of `src/copilot/config.js` |
| `src/actions/agentic-step/safety.js` | 106 | Moved to `src/copilot/safety.js` |
| `src/actions/agentic-step/tasks/*.js` | 3,033 | Replaced by `--agent` + `buildUserPrompt()` |
| `src/copilot/tasks/*.js` | 320 | Replaced by `--agent` + `buildUserPrompt()` |
| `src/iterate.js` | 285 | Already replaced by `hybrid-session.js` |
| `src/actions/agentic-step/index.js` | 372 → 150 | Slimmed to adapter |
| **Total deleted** | **~4,900** | |

### What Gets Created

| File | Lines (est.) | What |
|------|---|---|
| `src/copilot/context.js` | ~300 | Scanning + `buildUserPrompt()` (from copilot.js + task prompt builders) |
| `src/copilot/prompts.js` | ~80 | Path formatting, narrative extraction |
| `src/copilot/safety.js` | ~120 | Path validation + optional GitHub checks |
| `src/copilot/telemetry.js` | ~120 | Mission metrics, readiness narrative |

**Net**: ~4,300 lines deleted, ~620 lines added = **~3,700 fewer lines**. The agent .md files replace 3,033 lines of per-task prompt builders.

### CLI Parameter Parity

| Action Input | CLI Flag | Notes |
|---|---|---|
| `task` | `iterate --agent <agent-name>` | Agent selection replaces task dispatch |
| `config` | (auto-detected from `agentic-lib.toml`) | Same config loader |
| `model` | `--model <name>` | Same |
| `issue-number` | `--issue <N>` | Passed as context to user prompt |
| `pr-number` | `--pr <N>` | Passed as context to user prompt |
| `instructions` | `--agent <name>` | Agent .md IS the instructions |
| `discussion-url` | `--discussion <url>` | Passed as context to user prompt |
| — | `--here` | Discovery mode (agent-discovery.md) |
| — | `--mission-file <path>` | Custom mission |
| — | `--timeout <ms>` | Session timeout |

### Success Criteria

- [ ] Every Action task is expressible as `npx @xn-intenton-z2a/agentic-lib iterate --agent <agent-name>`
- [ ] `src/copilot/` is the single source of truth for all SDK integration
- [ ] `src/actions/agentic-step/index.js` is < 150 lines (I/O adapter only)
- [ ] Agent .md files are the system prompts for both CLI and Actions
- [ ] No per-task handler files — context gathering + `--agent` replaces them
- [ ] `npm test` passes (all ~435 tests)
- [ ] Actions `agentic-step` still works on repository0
- [ ] CLI `iterate --agent` works for all agent types

---

## Phase 5: Validate Both Paths

**Goal**: Prove that the converged code works identically via CLI and Actions.

### Local validation

Run all task types via CLI against a real workspace:

```bash
# Iterate (existing — already validated in Phase 3)
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate \
  --mission hamming-distance --model gpt-5-mini

# Discovery (new)
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate --here

# Transform (shared task handler)
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib transform \
  --target /tmp/test-ws --model gpt-5-mini

# Supervise (local-only mode — no GitHub context, shows prompt)
npx @xn-intenton-z2a/agentic-lib supervise --target /tmp/test-ws --dry-run

# All 10 tasks as CLI commands
npx @xn-intenton-z2a/agentic-lib --help
```

### Actions validation

Deploy to repository0 and run full cycle:

1. Push refactored agentic-lib to npm (new version)
2. Run `npx @xn-intenton-z2a/agentic-lib init --purge` on repository0
3. Verify init copies `src/copilot/` alongside `src/actions/`
4. Dispatch `agentic-lib-workflow-transform` manually
5. Verify: session creates, tools fire, code transforms, tests run
6. Dispatch full cycle: director → supervisor → transform → test → fix-code
7. Compare results to Benchmark 006 baseline
8. Verify agent .md files are used as system prompts (check logs)

### Regression checklist

- [ ] `npm test` passes in agentic-lib (all ~435 unit tests)
- [ ] `npm run lint:workflows` passes
- [ ] Init distributes `src/copilot/` correctly to consumer repos
- [ ] Actions `agentic-step` uses shared tasks from `src/copilot/tasks/`
- [ ] CLI all 10 tasks produce valid output (at least dry-run)
- [ ] CLI `iterate` completes hamming-distance
- [ ] CLI `iterate --here` discovers and generates MISSION.md
- [ ] MCP server `iterate` tool works
- [ ] Token tracking produces correct numbers in both paths
- [ ] Rate limit retry works in both paths
- [ ] Agent .md files loaded as system prompts in both paths
- [ ] Profile tuning (min/recommended/max) works in both paths

---

## Phase 6: Tune Locally

**Goal**: Use the fast local iteration loop to explore reasoning effort levels, models, and prompt variations — things that take hours via Actions but minutes locally.

### Reasoning effort matrix

| Model | low | medium | high | xhigh |
|-------|-----|--------|------|-------|
| gpt-5-mini | Baseline | ? | ? | ? |
| claude-sonnet-4 | ? | ? | ? | N/A |
| gpt-4.1 | ? | ? | ? | ? |

For each cell: run hamming-distance + fizz-buzz, record tokens, time, pass/fail, code quality.

### Model comparison

| Mission | gpt-5-mini | claude-sonnet-4 | gpt-4.1 |
|---------|-----------|----------------|---------|
| hamming-distance | Benchmark 005/006 data | ? | ? |
| fizz-buzz | Benchmark 004 data | ? | ? |
| roman-numerals | ? | ? | ? |
| cron-engine | ? | ? | ? |

### What to explore

1. **Reasoning effort vs cost**: Does `high` reasoning on gpt-5-mini outperform `medium` on gpt-4.1 for less cost?
2. **Model switching mid-session**: Start with cheap model (gpt-5-mini), if stuck after N tool calls, `session.setModel("gpt-4.1")` — does this help?
3. **Autopilot vs default mode**: Does autopilot produce better results (fewer wasted tool calls, more focused iteration)?
4. **Infinite sessions impact**: Does auto-compaction help or hurt for multi-iteration runs?
5. **Custom agents**: Define specialist agents (test-reader, code-writer, debugger) and see if agent switching improves outcomes
6. **Prompt engineering**: Which system prompt produces the most efficient tool call patterns?

### Output

`BENCHMARK_REPORT_007.md` (or similar) with:
- Side-by-side comparison tables for all model/effort/profile combinations
- Token cost analysis
- Recommendations for default profile settings
- Findings on which SDK features provide measurable improvement

---

## Risks

1. **`@actions/core` coupling** — The shared module must not import `@actions/core`. The logger interface handles this, but every utility extracted from `copilot.js` must have its `core.info()` calls replaced with `logger.info()`. Grep for `core.` after each extraction step.

2. **Init distribution** — Adding `src/copilot/` to the distributed files means updating the init script and verifying that the relative import paths from `src/actions/agentic-step/index.js` resolve correctly in consumer repos. Test with a fresh `init --purge` on repository0 after each structural change.

3. **SDK v0.1.31 instability** — Higher-level features (autopilot, fleet, custom agents) may not work at runtime despite type definitions existing. Phase 2 tested the core features; Phase 4 should not introduce new SDK features.

4. **GitHub context optionality** — Tasks like `supervise`, `review-issue`, and `discussions` are deeply coupled to GitHub APIs (issues, PRs, discussions). The shared task handlers must gracefully handle `context.github === null` (CLI mode) — either by skipping GitHub-dependent sections or by providing a `--dry-run` that shows the prompt without executing.

5. **Test coverage** — Moving ~4,500 lines of code means updating ~400 unit tests. Many tests mock `@actions/core` and `@actions/github`. After migration, tests should mock the logger interface and optional GitHub context instead. Plan for 2-3 sessions of test migration work.

6. **Breaking change for consumers** — If the init-distributed file structure changes (adding `copilot/` directory), existing repository0 installations break until re-init'd. Coordinate with a version bump. The init system already handles stale file cleanup, so this is manageable.

7. **Two-session architecture** — The old Actions path uses `runCopilotTask()` (single prompt→response) while the CLI uses `runHybridSession()` (persistent session with hooks). Phase 4 converges on `runHybridSession()` for all tasks, which means the Actions path gains hooks, metrics, and token tracking for free — but the session lifecycle changes. This is the highest-risk change.

8. **Agent prompt sufficiency** — The current agent .md files were designed for Actions context (rich prompts with issues, PRs, features). When used via CLI with less context, the agent may behave differently. The `buildUserPrompt()` function must provide enough local context to keep agents effective even without GitHub data.

---

## Phase Dependencies

```
Phase 1 (Port to shared module)            ← DONE (partial)
  ↓
Phase 1b (Close CLI feature gaps)          ← CURRENT — tools, context, safety, GitHub flags
  ↓
Phase 2 (Uplift SDK abstractions)          ← DONE
  ↓
Phase 3 (Validate locally)                 ← DONE (iterate works, --here works)
  ↓
Phase 4 (CLI as first-class product)       ← converge Actions + CLI
  ↓
Phase 5 (Validate both paths)
  ↓
Phase 6 (Tune)                             ← can start as soon as Phase 4 is stable
```

Phase 4 is the big one. Recommended execution order within Phase 4:

```
Step 1: Extract context.js + prompts.js from copilot.js      (no behavior change)
Step 2: Implement buildUserPrompt() for 4 local tasks        (transform, fix-code, maintain-*)
Step 3: Replace CLI runTask() with iterate --agent            (validate locally)
Step 4: Extract safety.js, telemetry.js                      (no behavior change)
Step 5: Merge tools.js (remove @actions/core dependency)     (no behavior change)
Step 6: Implement buildUserPrompt() for GitHub tasks         (supervise, direct, etc.)
Step 7: Slim Actions index.js to adapter                     (validate on repository0)
Step 8: Update init to distribute src/copilot/               (validate with init --purge)
Step 9: Delete old task handler files + copilot.js           (final cleanup)
```
