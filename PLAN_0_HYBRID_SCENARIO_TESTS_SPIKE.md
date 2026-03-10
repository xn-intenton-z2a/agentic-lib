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

## Phase 4: Abstract and Share Code

**Goal**: Both the GitHub Actions path and the CLI path import from the same shared module. Delete all duplicated code.

### Target architecture

```
src/copilot/                     ← Shared module (from Phase 1+2)
  session.js                     ← CopilotClient wrapper: auth, session, retry, hooks, events
  tools.js                       ← Tool definitions: read_file, write_file, list_files, run_command
  config.js                      ← Config loader: TOML parsing, profile resolution, tuning
  safety.js                      ← Path validation
  logger.js                      ← Logger interface (actions/console adapters)
  prompts.js                     ← Shared prompt fragments and formatters
  tasks/
    transform.js                 ← Transform task: prompt builder + SDK call
    fix-code.js                  ← Fix-code task: 3 modes
    maintain-features.js         ← Feature lifecycle
    maintain-library.js          ← Library management
    resolve-issue.js             ← Issue → PR
    enhance-issue.js             ← Issue enrichment
    review-issue.js              ← Code review
    discussions.js               ← Discussions bot
    supervise.js                 ← Supervisor (reactive + proactive)

src/actions/agentic-step/        ← Actions thin wrapper
  index.js                       ← Read Action inputs → call src/copilot/tasks/* → write Action outputs
  (copilot.js, tools.js, config-loader.js, safety.js, tasks/*.js → DELETED)

bin/agentic-lib.js               ← CLI thin wrapper
  runTask()                      ← Parse args → call src/copilot/tasks/* → print results
  (buildTaskPrompt, createCliTools, loadTaskConfig, scanDir → DELETED)

src/iterate.js                   ← Replaced by single-session iteration from Phase 2
  (or simplified to: init workspace → call shared session → report)
```

### What gets deleted

| File | Lines | Reason |
|------|-------|--------|
| `bin/agentic-lib.js` lines 312-684 | ~370 | Replaced by `src/copilot/config.js` + `src/copilot/tasks/*` |
| `src/actions/agentic-step/copilot.js` | 545 | Moved to `src/copilot/session.js` |
| `src/actions/agentic-step/tools.js` | 142 | Moved to `src/copilot/tools.js` |
| `src/actions/agentic-step/config-loader.js` | 299 | Moved to `src/copilot/config.js` |
| `src/actions/agentic-step/safety.js` | 106 | Moved to `src/copilot/safety.js` |
| `src/actions/agentic-step/tasks/*.js` | ~2,600 | Moved to `src/copilot/tasks/*.js` |
| `src/iterate.js` | 285 | Replaced by single-session approach |
| **Total deleted** | **~4,350** | |

Net: code moves from 2 locations to 1, duplicated CLI code deleted.

### Import path handling

The Actions `index.js` runs inside `.github/agentic-lib/actions/agentic-step/` in consumer repos (distributed via init). It needs to import from `src/copilot/` which lives in the npm package. Init already copies `src/actions/*/` — extend it to also copy `src/copilot/`.

Alternatively: the Action's `index.js` uses relative imports to `../../copilot/` and init copies the `copilot/` directory alongside `actions/`.

### Success criteria

- [ ] `src/copilot/` is the single source of truth for Copilot SDK integration
- [ ] `src/actions/agentic-step/index.js` is < 100 lines (just I/O mapping)
- [ ] CLI task commands use same code path as Actions
- [ ] Zero duplicated prompt templates, tool definitions, or config logic

---

## Phase 5: Validate Both Paths

**Goal**: Prove that the shared code works identically in both environments.

### Local validation

Re-run Phase 3 test matrix against the refactored code:

```bash
# CLI path
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate \
  --mission hamming-distance --model gpt-5-mini --cycles 5

# MCP path (Claude-supervised)
# workspace_create → iterate → workspace_status
```

### Actions validation

Deploy to repository0 and run:

1. Push refactored agentic-lib to npm (new version)
2. Run `npx @xn-intenton-z2a/agentic-lib init --purge` on repository0
3. Dispatch `agentic-lib-workflow-transform` manually
4. Verify: session creates, tools fire, code transforms, tests run
5. Dispatch full cycle: supervisor → transform → test → fix-code
6. Compare results to Benchmark 006 baseline

### Regression checklist

- [ ] `npm test` passes in agentic-lib (all ~430 unit tests)
- [ ] `npm run lint:workflows` passes
- [ ] Init distributes correct files to repository0
- [ ] Actions `agentic-step` creates session and completes tasks
- [ ] CLI `iterate` completes hamming-distance
- [ ] MCP server `iterate` tool works
- [ ] Token tracking produces correct numbers in both paths
- [ ] Rate limit retry works in both paths
- [ ] Narrative extraction works in Actions path
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

1. **`@actions/core` coupling in Actions path** — The Actions index.js currently logs via `core.info/setOutput`. The shared module must not import `@actions/core`. Logger interface solves this but adds indirection.

2. **Init distribution** — Adding `src/copilot/` to the distributed files means updating the init script. If the directory structure doesn't match what Actions `index.js` expects, imports break in consumer repos.

3. **SDK v0.1.31 instability** — Higher-level features (autopilot, fleet, custom agents) may not work at runtime despite type definitions existing. Phase 2 should test each feature individually with fallbacks.

4. **Prompt parity** — Actions tasks have rich prompt construction with GitHub context (issues, PRs, discussions). The local CLI path lacks this context. The shared module should make GitHub context optional, not required.

5. **Test coverage** — Moving ~4,500 lines of code means updating or moving ~400 unit tests. If tests are tightly coupled to the Actions file structure, this is significant work.

6. **Breaking change for consumers** — If the init-distributed file structure changes, existing repository0 installations break until re-init'd. Coordinate with a version bump.

---

## Phase Dependencies

```
Phase 1 (Port to shared module)
  ↓
Phase 2 (Uplift SDK abstractions)    ← can partially overlap with Phase 1
  ↓
Phase 3 (Validate locally)
  ↓
Phase 4 (Share between Actions + CLI) ← needs Phase 1 proven
  ↓
Phase 5 (Validate both paths)
  ↓
Phase 6 (Tune)                        ← can start as soon as Phase 3 passes
```

Phases 3 and 6 can overlap — Phase 3 is "does it work?" while Phase 6 is "how well does it work?"

---

## Quick Wins (Can Do Now)

Before starting Phase 1, these validate the approach with minimal code:

1. **Run the existing CLI iterate** — `COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate --mission hamming-distance --model gpt-5-mini --cycles 3` — does it work at all? Establishes a baseline.

2. **Test one SDK feature** — Write a 50-line script that creates a session with `infiniteSessions` and hooks, sends one prompt, checks what fires. Proves the SDK features work at runtime before committing to the full port.
