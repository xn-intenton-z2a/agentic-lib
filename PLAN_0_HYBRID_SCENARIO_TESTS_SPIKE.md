# Spike: Hybrid Scenario Tests — Copilot SDK Autopilot

## Purpose

Replace the current multi-session iteration loop (`runIterationLoop` → per-step `runTask` → disposable `CopilotClient` sessions) with a **single persistent Copilot SDK session in autopilot mode** that takes a mission from init to passing tests autonomously. One command, one session, full agent loop.

The current iterator is low-level: our code manages the step sequence (maintain-features → transform → fix-code), creates a new SDK session per step, discards context between steps, and manually checks convergence. The Copilot SDK v0.1.31 has much higher-level abstractions that we're not using.

## SDK Features We're Not Using

The Copilot SDK (`@github/copilot-sdk@0.1.31-unstable.0`) exposes these capabilities that agentic-lib currently ignores:

| Feature | SDK API | What it replaces |
|---------|---------|-----------------|
| **Autopilot mode** | `session.rpc.mode.set({ mode: "autopilot" })` | Our maintain→transform→fix step loop |
| **Session resume** | `client.resumeSession(sessionId)` | Creating new sessions per step (losing all context) |
| **Built-in workspace files** | `session.rpc.workspace.readFile/createFile/listFiles` | Our custom `defineTool` for read_file/write_file/list_files |
| **Plan management** | `session.rpc.plan.read/update/delete` | Our external PLAN files and prompt-based instructions |
| **Lifecycle hooks** | `onPreToolUse`, `onPostToolUse`, `onSessionEnd`, `onErrorOccurred` | Our manual budget tracking and convergence detection |
| **Infinite sessions** | `infiniteSessions` with auto-compaction | Our context-discarding per-step approach |
| **Custom agents** | `customAgents: [{ name, prompt, tools }]` | Our `buildTaskPrompt` per-step prompt construction |
| **Streaming** | `streaming: true` + `assistant.message_delta` | Our wait-for-complete `sendAndWait` |
| **Attachments** | `send({ attachments: [{ type: "directory", path }] })` | Our tool-based `list_files` + `read_file` scanning |
| **Model switching** | `session.setModel(model)` mid-session | Fixed model per session |
| **Sub-agents** | `session.rpc.fleet.start()` + subagent events | Running steps sequentially |
| **Manual compaction** | `session.rpc.compaction.compact()` | Hoping context doesn't overflow |
| **Error handling hooks** | `onErrorOccurred` with retry/skip/abort | Our try/catch around `sendAndWait` |

## Architecture: Old vs New

### Old: Our Code Runs the Loop

```
runIterationLoop (src/iterate.js)
  for each cycle:
    runCli("maintain-features --target ... --model ...")
      → new CopilotClient()            ← NEW process
      → client.createSession()          ← NEW session, no history
      → defineTool(read_file, ...)      ← same tools redefined
      → session.sendAndWait(prompt)     ← prompt has to re-explain everything
      → client.stop()                   ← context discarded
    runCli("transform --target ... --model ...")
      → new CopilotClient()            ← ANOTHER new process
      → client.createSession()          ← ANOTHER new session
      → ... same pattern ...
    runCli("fix-code --target ... --model ...")
      → ... same pattern ...
    runTests()                           ← our code checks pass/fail
    checkConvergence()                   ← our code decides to continue/stop
```

**Problems**: 3 SDK processes per cycle. Zero context carried between steps. Every prompt must re-explain the mission, features, source code, test state. The agent can't learn from previous attempts. Budget tracking is external.

### New: SDK Runs the Loop

```
scripts/hybrid-iterate.js
  → init --purge (set up workspace)
  → new CopilotClient({ env: { GITHUB_TOKEN: copilotToken } })
  → client.createSession({
      model,
      systemMessage: { mode: "replace", content: missionPrompt },
      tools: [run_tests],               ← only tools the agent can't do itself
      onPermissionRequest: approveAll,
      workingDirectory: workspace,
      infiniteSessions: { enabled: true },
      hooks: {
        onPreToolUse: budgetGuard,       ← track cost, block on budget exhaustion
        onPostToolUse: progressTracker,  ← record what changed, check convergence
        onErrorOccurred: retryHandler,   ← handle 429s, tool failures
        onSessionEnd: reportGenerator,   ← produce structured results
      },
    })
  → session.rpc.mode.set({ mode: "autopilot" })
  → session.sendAndWait({
      prompt: "Run tests. If they fail, read the source, fix the code, run tests again. Repeat until all tests pass.",
      attachments: [{ type: "directory", path: workspace }],
    }, 600000)
  → collect results from hooks
  → client.stop()
```

**One session. One prompt. Agent drives its own loop.** The SDK's built-in tool loop handles read/write/run. Hooks give us visibility and control. Infinite sessions handle context management. The agent carries full history of what it tried and what failed.

## What the Agent Gets for Free (Built-In Tools)

The Copilot SDK CLI agent has built-in tools that we currently reimplement:

- **File read/write/list** — via `session.rpc.workspace.*` or built-in agent tools
- **Shell command execution** — built-in `run_command` or similar
- **Code search/grep** — built-in agent capabilities
- **Git operations** — built-in (we may want to restrict via `hooks.onPreToolUse`)

We only need to define custom tools for things the agent **can't** do:

1. **`run_tests`** — `npm test` with structured pass/fail output and formatted results
2. **`check_acceptance`** — mission-specific acceptance criteria (optional)

Everything else, the agent can do natively.

## Spike Script

`scripts/spike-hybrid-iterate.js` — a single Node.js script that proves the concept:

```js
#!/usr/bin/env node
// scripts/spike-hybrid-iterate.js — Spike: Copilot SDK autopilot iteration
//
// Usage:
//   COPILOT_GITHUB_TOKEN=<token> node scripts/spike-hybrid-iterate.js [mission] [model]
//
// Example:
//   COPILOT_GITHUB_TOKEN=ghp_xxx node scripts/spike-hybrid-iterate.js hamming-distance gpt-5-mini

import { existsSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");

// ── Args ──────────────────────────────────────────────────────────────

const mission = process.argv[2] || "hamming-distance";
const model = process.argv[3] || "gpt-5-mini";
const copilotToken = process.env.COPILOT_GITHUB_TOKEN;

if (!copilotToken) {
  console.error("ERROR: COPILOT_GITHUB_TOKEN not set");
  process.exit(1);
}

// ── Find SDK ──────────────────────────────────────────────────────────

const sdkLocations = [
  resolve(pkgRoot, "node_modules/@github/copilot-sdk/dist/index.js"),
  resolve(pkgRoot, "src/actions/agentic-step/node_modules/@github/copilot-sdk/dist/index.js"),
];
const sdkPath = sdkLocations.find((p) => existsSync(p));
if (!sdkPath) {
  console.error("ERROR: @github/copilot-sdk not found. Run: npm ci");
  process.exit(1);
}
const { CopilotClient, approveAll, defineTool } = await import(sdkPath);

// ── Init workspace ────────────────────────────────────────────────────

const workspace = resolve(pkgRoot, `.spike-workspace-${Date.now()}`);
console.log(`=== Hybrid Scenario Spike ===`);
console.log(`Mission:   ${mission}`);
console.log(`Model:     ${model}`);
console.log(`Workspace: ${workspace}`);
console.log("");

console.log("Initialising workspace...");
execSync(
  `node ${resolve(pkgRoot, "bin/agentic-lib.js")} init --purge --mission ${mission} --target ${workspace}`,
  { stdio: "inherit", timeout: 60000 },
);

// Install dependencies in workspace
console.log("Installing dependencies...");
execSync("npm install 2>&1", { cwd: workspace, stdio: "inherit", timeout: 120000 });

// ── Read mission context ──────────────────────────────────────────────

const missionText = existsSync(resolve(workspace, "MISSION.md"))
  ? readFileSync(resolve(workspace, "MISSION.md"), "utf8")
  : "No MISSION.md found";

// Run initial tests to give agent the starting state
let initialTestOutput;
try {
  initialTestOutput = execSync("npm test 2>&1", {
    cwd: workspace, encoding: "utf8", timeout: 60000,
  });
} catch (err) {
  initialTestOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
}

// ── Metrics collection via hooks ──────────────────────────────────────

const metrics = {
  toolCalls: [],
  testRuns: 0,
  filesWritten: new Set(),
  errors: [],
  startTime: Date.now(),
};

// ── Define only the tools the agent can't do itself ───────────────────

const tools = [
  defineTool("run_tests", {
    description: "Run the test suite (npm test) and return pass/fail with output. Call this after making changes to verify correctness.",
    parameters: {},
    handler: async () => {
      metrics.testRuns++;
      try {
        const stdout = execSync("npm test 2>&1", {
          cwd: workspace, encoding: "utf8", timeout: 120000,
        });
        return { textResultForLlm: `TESTS PASSED:\n${stdout}`, resultType: "success" };
      } catch (err) {
        const output = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
        return { textResultForLlm: `TESTS FAILED:\n${output}`, resultType: "success" };
      }
    },
  }),
];

// ── Create Copilot session ────────────────────────────────────────────

console.log("\nCreating Copilot session...");
const client = new CopilotClient({
  env: { ...process.env, GITHUB_TOKEN: copilotToken, GH_TOKEN: copilotToken },
});

const systemPrompt = [
  "You are an autonomous code transformation agent.",
  "Your workspace is a Node.js project with source code in src/lib/ and tests in tests/.",
  "Your goal: make ALL tests pass. Read the failing tests, understand what they expect, write the implementation.",
  "",
  "Strategy:",
  "1. Run the tests to see what's failing",
  "2. Read the test files to understand expected behaviour",
  "3. Read the current source code",
  "4. Write the implementation that makes the tests pass",
  "5. Run the tests again to verify",
  "6. If tests still fail, read the error output carefully, fix the code, and repeat",
  "",
  "Do NOT modify test files. Only modify source files in src/lib/.",
  "Keep going until all tests pass or you've exhausted your options.",
].join("\n");

const session = await client.createSession({
  model,
  systemMessage: { mode: "replace", content: systemPrompt },
  tools,
  onPermissionRequest: approveAll,
  workingDirectory: workspace,
  infiniteSessions: { enabled: true },
  hooks: {
    onPreToolUse: (input) => {
      metrics.toolCalls.push({ tool: input.toolName, time: Date.now() });
      console.log(`  [tool] ${input.toolName}`);
    },
    onPostToolUse: (input) => {
      if (input.toolName === "write" || input.toolName === "Write" ||
          input.toolName === "write_file" || input.toolName === "EditFile") {
        const path = input.toolArgs?.file_path || input.toolArgs?.path || "unknown";
        metrics.filesWritten.add(path);
      }
    },
    onErrorOccurred: (input) => {
      metrics.errors.push({ error: input.error, context: input.errorContext, time: Date.now() });
      console.error(`  [error] ${input.errorContext}: ${input.error}`);
      if (input.recoverable) return { errorHandling: "retry", retryCount: 2 };
      return { errorHandling: "abort" };
    },
  },
});

console.log(`Session: ${session.sessionId}`);

// ── Subscribe to events ───────────────────────────────────────────────

let tokenUsage = { input: 0, output: 0 };
session.on("assistant.usage", (event) => {
  tokenUsage.input += event.data?.inputTokens || 0;
  tokenUsage.output += event.data?.outputTokens || 0;
});
session.on("assistant.message", (event) => {
  const preview = (event.data?.content || "").substring(0, 200);
  console.log(`  [assistant] ${preview}...`);
});

// ── Try autopilot mode ────────────────────────────────────────────────

try {
  console.log("Setting autopilot mode...");
  await session.rpc.mode.set({ mode: "autopilot" });
  console.log("Autopilot mode: active");
} catch (err) {
  console.log(`Autopilot mode not available (${err.message}) — using default mode`);
}

// ── Send the mission ──────────────────────────────────────────────────

console.log("\nSending mission...\n");
const prompt = [
  `# Mission\n\n${missionText}`,
  `# Current test state\n\n\`\`\`\n${initialTestOutput}\n\`\`\``,
  "",
  "Make all the tests pass. Work autonomously — read files, write code, run tests, iterate.",
].join("\n\n");

const t0 = Date.now();
let response;
try {
  response = await session.sendAndWait({ prompt }, 600000); // 10 min timeout
} catch (err) {
  console.error(`\nSession error: ${err.message}`);
  response = null;
}
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

// ── Final test run ────────────────────────────────────────────────────

let finalTestPass = false;
let finalTestOutput;
try {
  finalTestOutput = execSync("npm test 2>&1", {
    cwd: workspace, encoding: "utf8", timeout: 60000,
  });
  finalTestPass = true;
} catch (err) {
  finalTestOutput = `STDOUT:\n${err.stdout || ""}\nSTDERR:\n${err.stderr || ""}`;
}

// ── Report ────────────────────────────────────────────────────────────

const totalElapsed = ((Date.now() - metrics.startTime) / 1000).toFixed(1);

console.log("\n=== Results ===");
console.log(`Mission:        ${mission}`);
console.log(`Model:          ${model}`);
console.log(`Session time:   ${elapsed}s`);
console.log(`Total time:     ${totalElapsed}s`);
console.log(`Tool calls:     ${metrics.toolCalls.length}`);
console.log(`Test runs:      ${metrics.testRuns}`);
console.log(`Files written:  ${metrics.filesWritten.size}`);
console.log(`Tokens:         ${tokenUsage.input} in / ${tokenUsage.output} out`);
console.log(`Errors:         ${metrics.errors.length}`);
console.log(`Tests pass:     ${finalTestPass ? "YES" : "NO"}`);
console.log("");

if (response?.data?.content) {
  console.log("Agent final message:");
  console.log(response.data.content.substring(0, 500));
  console.log("");
}

// ── Cleanup ───────────────────────────────────────────────────────────

await client.stop();
execSync(`rm -rf ${workspace}`);

console.log(finalTestPass
  ? "SPIKE PASSED — single session drove mission to passing tests"
  : "SPIKE FAILED — tests did not pass within session timeout"
);

process.exit(finalTestPass ? 0 : 1);
```

## Questions to Answer

1. **Does autopilot mode work?** — `session.rpc.mode.set({ mode: "autopilot" })` may not be available in CLI mode. If it isn't, the agent's default tool loop may still be sufficient — `sendAndWait` already loops through tool calls internally.

2. **Does the agent use its built-in file tools?** — The Copilot agent should have built-in `Read`, `Write`, `Edit`, `Bash` tools. If `workingDirectory` is set correctly, the agent should be able to read/write workspace files without us defining custom tools. We only need `run_tests` as a custom tool.

3. **Does `infiniteSessions` help?** — For a simple mission like hamming-distance, context shouldn't overflow. But for larger missions, auto-compaction could prevent the "forgot what I tried" problem that plagues the step-per-session approach.

4. **Do hooks fire correctly?** — `onPreToolUse` and `onPostToolUse` should give us full visibility into what the agent does. `onErrorOccurred` should let us handle 429s gracefully.

5. **Does one session outperform three sessions per cycle?** — The agent carrying context should mean fewer wasted tokens re-explaining state. Measure total token usage vs the old approach.

6. **What's the wall clock for hamming-distance end-to-end?** — Old approach: ~5-10 min (3 SDK sessions × 5 cycles). New approach: should be ~2-5 min (1 session, agent-driven loop).

## Success Criteria

| Criterion | Required | Notes |
|-----------|----------|-------|
| Single session completes without crash | Yes | No manual multi-session management |
| Agent reads source and test files | Yes | Using built-in tools, not our custom ones |
| Agent writes source files | Yes | Proves tool loop works |
| Agent calls `run_tests` at least twice | Yes | Initial failure + at least one retry |
| Tests pass | Nice to have | hamming-distance is simple |
| Total tokens < 3× old approach | Nice to have | Context reuse should reduce redundancy |
| Wall clock < old approach | Nice to have | Fewer sessions = less overhead |
| Hooks fire and collect metrics | Yes | Proves observability |

## What Happens After the Spike

### If it works: Replace the Old Iterator

1. **Delete `runIterationLoop`** in `src/iterate.js` — replace with single-session autopilot
2. **Delete per-step `runTask`** in `bin/agentic-lib.js` — no more maintain/transform/fix dispatch
3. **Delete `buildTaskPrompt`** — one mission-level prompt replaces per-step prompts
4. **Keep hooks for budget/metrics** — `onPreToolUse` for cost tracking, `onPostToolUse` for change detection, `onSessionEnd` for reports
5. **Use `session.rpc.plan.*`** — let the agent maintain its own plan.md for multi-turn reasoning
6. **Use `resumeSession`** — if a session is interrupted, pick up where it left off
7. **MCP server switches to single-session `iterate`** — simpler, more powerful

### If autopilot doesn't work but tool loop does

Fall back to the default mode (which still runs the tool loop via `sendAndWait`). The agent won't have "autopilot" mode awareness but the fundamental architecture is the same — one session, one prompt, agent drives.

### If the agent can't use built-in file tools

Add back `read_file`, `write_file`, `list_files` as custom `defineTool`. The architecture stays the same (one session) — we just provide more tools.

### If single-session fails entirely

The old multi-session approach still works. But we should understand *why* single-session fails before falling back — it might be a simple fix (wrong workingDirectory, missing tool, prompt issue).

## Implementation Steps

1. **Create `scripts/spike-hybrid-iterate.js`** — the script above
2. **Run it** — `COPILOT_GITHUB_TOKEN=<token> node scripts/spike-hybrid-iterate.js hamming-distance gpt-5-mini`
3. **Record**: did autopilot mode activate? did built-in tools work? what hooks fired?
4. **Compare** to BENCHMARK_REPORT_005: wall clock, tokens, outcome
5. **Update this plan** with results
6. **If pass**: plan the replacement of `runIterationLoop`

## Risks

1. **SDK v0.1.31 is `unstable.0`** — Features like autopilot, fleet, custom agents may be incomplete or change. The type definitions exist but runtime support may differ. The spike will discover this.

2. **Built-in agent tools may be more restrictive** — The Copilot agent's built-in file tools may have safety checks (permission prompts, path restrictions) that `approveAll` doesn't fully bypass. If so, we fall back to custom tools.

3. **Autopilot mode may not exist in CLI mode** — The `rpc.mode.set` method may only work when the SDK runs as a TUI or IDE extension, not as an API client. The spike tests this directly.

4. **Token budget** — A single long session may use more tokens than 3 short sessions if the agent explores broadly. Hooks should track this so we can compare.

5. **Rate limiting accumulation** — One long session making many tool calls might hit rate limits more than 3 separate sessions with pauses between them. The `onErrorOccurred` hook should handle retries.

## What This Replaces

This spike, if successful, obsoletes:

- `src/iterate.js` — `runIterationLoop`, `runCli`, `runTests`, `snapshotDir`, `countChanges`
- `bin/agentic-lib.js` — `runTask`, `buildTaskPrompt`, `createCliTools`, per-step dispatch
- The concept of "steps" (maintain-features, transform, fix-code) as distinct SDK calls
- The concept of "cycles" as externally-managed iterations
- Manual convergence detection (consecutive passes, no-progress checks)

The agent does all of this internally. Our code's job becomes: set up the workspace, create one session, give it the mission, collect the results.
