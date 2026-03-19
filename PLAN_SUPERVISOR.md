# Plan: Always-On Supervisor Controller

## Problem

The current benchmark/iteration workflow is driven by GitHub Actions workflows, which are:
- **Slow**: Each workflow run takes 10-20min wall-clock, with most time spent in queue/setup/teardown
- **Cumbersome**: Dispatching runs, polling for completion, reading logs from the API, deciding next steps — all manual or requires a Claude Code session
- **Stateless between runs**: Each workflow run starts fresh. The supervisor agent within the workflow has limited context about what happened in previous runs
- **Expensive orchestration**: A Claude Code session costing ~$10/hr in API tokens just to poll `gh run watch` and dispatch the next cycle

## Use Cases

The supervisor should be a **service** that can:
1. **Run missions**: `supervise --mission hamming-distance --profile med` — dispatch, iterate, declare complete
2. **Run benchmarks**: `supervise --benchmarks ITERATION_BENCHMARKS_SIMPLE.md` — execute all scenarios, produce a numbered report
3. **Continuous monitoring**: `supervise --watch` — respond to events, keep the pipeline healthy
4. **Multi-repo**: Orchestrate across repository0 and other consumers

## Vision

An **always-on supervisor controller** that:
1. Orchestrates iteration cycles without workflow overhead
2. Makes intelligent decisions about what to do next (dispatch, wait, fix, declare complete)
3. Responds to events (PR merged, test failed, issue created) in real-time
4. Runs cheaply between active decisions (not burning tokens while waiting)

## Architecture Options

### Option A: Long-Running MCP Session

Use the existing MCP server (`npx @xn-intenton-z2a/agentic-lib mcp`) as the always-on process.

**How it works:**
- Claude Code connects to the MCP server
- The server provides tools: `prepare_iteration`, `workspace_write_file`, `run_tests`, `iterate`
- A new `supervise` tool would: dispatch workflow, poll for completion, read results, decide next action
- Claude Code stays connected and the MCP server does the heavy lifting

**Pros:** Already exists. Claude Code provides the LLM intelligence.
**Cons:** Still needs a Claude Code session running. Doesn't survive session disconnects.

### Option B: GitHub App / Webhook Listener

A lightweight Node.js service that listens to GitHub webhook events.

**How it works:**
- Deployed as a small service (e.g. on AWS Lambda, Fly.io, or a VPS)
- Subscribes to: `workflow_run.completed`, `pull_request.closed`, `issues.opened`
- On each event, evaluates the current state and decides the next action
- Uses a cheap/fast model (gpt-5-mini) for decisions, not a full Claude session
- Dispatches workflows via GitHub API when needed

**Pros:** Event-driven (no polling). Survives disconnects. Very cheap between events.
**Cons:** Needs deployment infrastructure. New codebase to maintain.

### Option C: GitHub Actions with Recursive Dispatch (Current Model, Refined)

Keep GitHub Actions but make the workflow self-continuing.

**How it works:**
- The `agentic-lib-workflow` already has a director that can dispatch the next run
- Add a `dispatch-next` job at the end of each workflow that auto-dispatches another run if mission isn't complete
- The workflow becomes a self-sustaining loop until mission-complete or budget-exhausted

**Pros:** No new infrastructure. Works today. Already partially implemented (schedule dispatch).
**Cons:** Still slow (10-20min per cycle). Each run is stateless. GitHub may rate-limit recursive dispatches.

### Option D: Hybrid — CLI Supervisor + Workflow Execution

A local CLI process (or CI job) that acts as the supervisor brain, while workflows do the heavy lifting.

**How it works:**
- A new `npx @xn-intenton-z2a/agentic-lib supervise` command
- Runs in a loop: dispatch workflow → poll → read results → decide → repeat
- Uses a local LLM call (cheap model) for decisions
- Can also run as a GitHub Actions job with a long timeout (6hr max)
- Maintains state in a local file or on the logs branch

**Pros:** Cheap (one LLM call per decision, not a full session). Can run locally or in CI.
**Cons:** Polling-based. Needs a process running somewhere.

### Option E: GitHub Actions Composite with Wait (Recommended Starting Point)

The simplest evolution: make `agentic-lib-workflow` self-dispatch at the end if mission isn't complete.

**How it works:**
- At the end of each workflow run, the `post-merge` or `director` job checks: is mission complete?
- If not, and budget isn't exhausted, dispatch another `agentic-lib-workflow` run
- The chain continues until mission-complete, mission-failed, or budget-exhausted
- A safety counter prevents infinite loops (max N dispatches per init)

**Already partially exists:** The `update-schedule` job can set `hourly` which triggers cron. But cron is unreliable (GitHub caches it). Direct dispatch is better.

## Recommendation

**Start with Option E** (self-dispatching workflow chain) because:
1. Zero new infrastructure
2. The director already has the logic — just needs to dispatch at the end
3. Combined with Fix #2 (state persistence), the chain has reliable state
4. The `schedule=off` benchmark mode already prevents unwanted cron interference

**Then evolve to Option D** (CLI supervisor) for benchmarks:
- `npx @xn-intenton-z2a/agentic-lib supervise --mission hamming-distance --profile med`
- Dispatches init, then loops: dispatch workflow → poll → read state → decide
- Produces a benchmark report automatically
- Can run locally or in a CI job

## Implementation Steps

### Phase 1: Self-Dispatching Chain (Option E)
1. Add `dispatch-next` job to `agentic-lib-workflow.yml`
2. Conditions: mission not complete, budget not exhausted, dispatch count < max
3. Track dispatch count in state file (new field: `chain-dispatches`)
4. Add `max-chain-dispatches` to config (default: 10)

### Phase 2: CLI Supervisor (Option D)
1. Add `supervise` command to the CLI (`src/bin/cli.js`)
2. Implement dispatch → poll → read state → decide loop
3. Use gpt-5-mini for cheap decision calls
4. Output progress to console and optionally to a report file
5. Support `--max-iterations`, `--timeout`, `--report` flags

### Phase 3: Event-Driven (Option B, future)
1. Deploy a webhook listener
2. Replace polling with event-driven decisions
3. Support multiple concurrent missions across repos

## Open Questions

1. **Dispatch rate limiting**: Does GitHub throttle recursive workflow dispatches? What's the limit?
2. **Budget tracking across chains**: The state file tracks budget — is it reliable enough for chain termination?
3. **Error recovery**: If a workflow fails mid-chain, how does the next dispatch know to retry vs skip?
4. **Concurrent missions**: Can we support multiple missions on different branches simultaneously?
