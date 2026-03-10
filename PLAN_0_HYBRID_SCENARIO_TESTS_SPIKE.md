# Spike: Hybrid Scenario Tests — Local Copilot SDK Iterations

## Purpose

Validate that the **full iteration loop** (maintain-features → transform → test → fix-code) can run locally on a workstation using the Copilot SDK, the user's authentication, and Claude Code supervision — without any GitHub Actions overhead. The spike proves that a single command can take a mission seed from init to passing tests (or to a well-understood failure), producing benchmark-quality results in minutes instead of hours.

This replaces the local LLM approach (PLAN_0_LOCAL_SCENARIO_TESTS_SPIKE.md) which proved that small local models cannot reliably perform code transformations. Instead of replacing the LLM, this spike keeps the same LLM (Copilot SDK models) but removes the GitHub Actions wrapper.

## What Already Exists

The `iterate` CLI command (`bin/agentic-lib.js`) already does much of this:

```bash
npx @xn-intenton-z2a/agentic-lib iterate \
  --mission hamming-distance \
  --model gpt-5-mini \
  --cycles 5
```

This command:
1. Runs `init --purge` with the named mission seed
2. Executes N cycles of `maintain-features → transform → fix-code`
3. Each cycle calls the Copilot SDK directly (via `runTask` → `CopilotClient.createSession` → `session.sendAndWait`)
4. Tools are defined locally: `read_file`, `write_file`, `list_files`, `run_command`
5. Budget tracking, convergence detection, early stopping all work
6. Requires `COPILOT_GITHUB_TOKEN` in the environment

**What's missing** for the hybrid scenario test vision:

| Gap | Description |
|-----|-------------|
| **Acceptance criteria** | No programmatic check that the final state satisfies the mission |
| **Structured results** | Output is console logs, not a machine-readable report |
| **Multi-scenario runner** | Can only run one mission at a time, manually |
| **Comparison mode** | No built-in way to compare profiles/models side-by-side |
| **Claude supervision** | No MCP integration for Claude to watch and intervene mid-iteration |
| **Cost tracking** | Token usage is logged per-event but not aggregated in the report |
| **Timing data** | Wall-clock time per step exists but isn't captured in structured output |

## Questions to Answer

1. **Can the full iterate loop run to test-pass on hamming-distance within budget (8)?** — Proves end-to-end viability.
2. **What is the wall-clock time for a full run?** — Establishes the speedup vs GitHub Actions (BENCHMARK_REPORT_005 took hours per scenario).
3. **Does the `runIterationLoop` from `src/iterate.js` produce enough data** for structured results, or do we need to extend it?
4. **Can Claude Code supervise via MCP tools** (`prepare_iteration`, `workspace_status`, `iterate`) while the Copilot SDK does the actual work?
5. **What fails when running locally vs in Actions?** — Missing env vars, path assumptions, GitHub API calls that need repo context?

## Architecture: How GitHub Actions vs Local Compare

### GitHub Actions Path (current — BENCHMARK_REPORT_005.md)

```
User dispatches workflow
  → GitHub queues runner (~30s)
    → Checkout, npm ci (~60s)
      → agentic-step action runs Copilot SDK session
        → Tools: read_file, write_file, list_files, run_command
        → Agent transforms code
      → commit-if-changed pushes branch
    → test.yml runs on push
      → checkout, npm ci, npm test
    → supervisor dispatches next step
  → Repeat (each cycle = 5-10 minutes of wall clock, ~2 min of compute)
```

**Total for 5 iterations**: ~30-60 minutes, dominated by GitHub Actions overhead (queuing, checkout, npm ci, inter-workflow dispatch latency).

### Hybrid Local Path (this spike)

```
User runs: npx @xn-intenton-z2a/agentic-lib iterate --mission hamming-distance --cycles 5
  → init --purge creates workspace locally (~5s)
  → For each cycle:
    → Copilot SDK session created locally (~2s)
    → Same tools, same prompts, same model
    → Agent transforms code in local filesystem
    → npm test runs locally (~3s)
    → Next cycle starts immediately
  → Report printed (~0s)
```

**Total for 5 iterations**: ~5-10 minutes, dominated by Copilot SDK response time (no queueing, no checkout, no inter-workflow gaps).

### Hybrid Supervised Path (goal)

```
Claude Code session:
  → MCP: workspace_create(mission: "hamming-distance", profile: "min")
  → MCP: iterate(workspace: "...", cycles: 5)
    → Copilot SDK runs autonomously through 5 cycles
    → Claude receives structured results
  → Claude reviews: "Cycle 3 failed because X — let me adjust the prompt"
  → MCP: config_set(workspace: "...", overrides: { ... })
  → MCP: iterate(workspace: "...", cycles: 3)
    → Copilot continues from where it left off
  → Claude: "Tests pass. Here's the comparison..."
```

**Total**: Same 5-10 minutes of compute, but with Claude supervision between iterations. Claude can diagnose failures, adjust tuning, retry — without restarting.

## Spike Script

A single test script: `scripts/spike-hybrid-iterate.sh`

This is a shell wrapper that validates the existing `iterate` CLI works end-to-end for scenario testing. No new code needed for the spike — just exercising what exists.

```bash
#!/usr/bin/env bash
# scripts/spike-hybrid-iterate.sh — Spike: validate local Copilot SDK iteration
#
# Prereqs:
#   export COPILOT_GITHUB_TOKEN=<your-token>
#   npm ci (in agentic-lib root, to get @github/copilot-sdk)
#
# Usage:
#   bash scripts/spike-hybrid-iterate.sh [mission] [model] [cycles]

set -euo pipefail

MISSION="${1:-hamming-distance}"
MODEL="${2:-gpt-5-mini}"
CYCLES="${3:-5}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
WORKSPACE=$(mktemp -d)
RESULTS_FILE="${ROOT_DIR}/SPIKE_HYBRID_RESULTS_$(date +%Y%m%dT%H%M%S).md"

echo "=== Hybrid Scenario Test Spike ==="
echo "Mission:   $MISSION"
echo "Model:     $MODEL"
echo "Cycles:    $CYCLES"
echo "Workspace: $WORKSPACE"
echo "Results:   $RESULTS_FILE"
echo ""

# Check prereqs
if [ -z "${COPILOT_GITHUB_TOKEN:-}" ]; then
  echo "ERROR: COPILOT_GITHUB_TOKEN not set"
  exit 1
fi

if ! node -e "require('@github/copilot-sdk')" 2>/dev/null; then
  echo "ERROR: @github/copilot-sdk not found. Run: npm ci"
  exit 1
fi

# Record start
START_TIME=$(date +%s)

# Write results header
cat > "$RESULTS_FILE" << EOF
# Hybrid Scenario Test — Spike Results

**Date**: $(date -u +%Y-%m-%dT%H:%M:%SZ)
**Mission**: $MISSION
**Model**: $MODEL
**Cycles**: $CYCLES
**Workspace**: $WORKSPACE

---

## Run Output

\`\`\`
EOF

# Run the iterate command, capturing output
node "$ROOT_DIR/bin/agentic-lib.js" iterate \
  --mission "$MISSION" \
  --model "$MODEL" \
  --cycles "$CYCLES" \
  --target "$WORKSPACE" \
  2>&1 | tee -a "$RESULTS_FILE"

EXIT_CODE=${PIPESTATUS[0]}

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

# Close code block, add verdict
cat >> "$RESULTS_FILE" << EOF
\`\`\`

---

## Verdict

| Metric | Value |
|--------|-------|
| Exit code | $EXIT_CODE |
| Wall clock | ${ELAPSED}s |
| Mission | $MISSION |
| Model | $MODEL |
| Cycles requested | $CYCLES |

$(if [ $EXIT_CODE -eq 0 ]; then echo "**SPIKE PASSED** — tests pass after local iteration"; else echo "**SPIKE FAILED** — exit code $EXIT_CODE"; fi)

---

## Workspace State

\`\`\`
$(ls -la "$WORKSPACE/src/lib/" 2>/dev/null || echo "(no src/lib)")
\`\`\`

### Final source

\`\`\`js
$(cat "$WORKSPACE/src/lib/main.js" 2>/dev/null || echo "(not found)")
\`\`\`

### Final test output

\`\`\`
$(cd "$WORKSPACE" && npm test 2>&1 || true)
\`\`\`
EOF

echo ""
echo "=== Spike Complete ==="
echo "Exit code: $EXIT_CODE"
echo "Wall clock: ${ELAPSED}s"
echo "Results: $RESULTS_FILE"

# Cleanup workspace
rm -rf "$WORKSPACE"

exit $EXIT_CODE
```

## Implementation Steps

1. **Run the spike** — `bash scripts/spike-hybrid-iterate.sh hamming-distance gpt-5-mini 5` with COPILOT_GITHUB_TOKEN set
2. **Record wall-clock time** — compare to BENCHMARK_REPORT_005 (Actions-based)
3. **Check acceptance** — did hamming-distance reach passing tests within 5 cycles?
4. **If it works**: extend `runIterationLoop` to return structured JSON (token counts, timing, acceptance criteria)
5. **If it fails**: diagnose — is it auth? missing context? prompt quality? — and fix

## Success Criteria

| Criterion | Required | Notes |
|-----------|----------|-------|
| `iterate` command runs without errors | Yes | Auth, SDK, tools all work |
| Copilot SDK session creates successfully | Yes | COPILOT_GITHUB_TOKEN works locally |
| At least one tool call per cycle | Yes | Agent engages with the workspace |
| Tests pass within budget | Nice to have | hamming-distance is simple enough |
| Wall clock < 10 min for 5 cycles | Yes | Must beat GitHub Actions by 3x+ |
| Structured results file produced | Yes | For comparison across runs |

## What Happens After the Spike

### If the spike passes

Extend the existing `iterate` CLI and MCP server to support hybrid scenario testing:

1. **Structured JSON output** — `runIterationLoop` returns per-cycle data: tokens, timing, files changed, test results, acceptance check
2. **Acceptance criteria per mission** — each seed defines a `verify.js` or acceptance function (e.g., "all tests pass", "exports hammingDistance function")
3. **Multi-scenario runner** — `scripts/run-scenarios.sh` that runs multiple missions/models/profiles and produces a comparison table
4. **MCP supervision** — Claude watches iteration progress via `workspace_status`, intervenes with `config_set` or `workspace_write_file`, then resumes with `iterate`
5. **Benchmark generation** — auto-generate BENCHMARK_REPORT_NNN.md from structured results

### If the spike fails

Diagnose the failure mode:

| Failure | Likely cause | Mitigation |
|---------|-------------|------------|
| Auth error | Token scope or expiry | Check `gh auth status`, regenerate token |
| SDK not found | Module resolution across nested package.json | Install in agentic-lib root |
| Tools not called | Prompt doesn't trigger tool use | Compare to working Actions prompt |
| Tests don't pass | Model quality at min profile | Try recommended profile, compare |
| Too slow | Rate limiting, model latency | Check 429 retry logs, try different model |
| Missing context | Prompt lacks mission/features | Compare `buildTaskPrompt` output to Actions equivalent |

## Comparison: Three Approaches

| Aspect | Local LLM (PLAN_0 spike) | GitHub Actions (current) | Hybrid (this spike) |
|--------|--------------------------|--------------------------|---------------------|
| LLM | Llama-3.2-3B local | Copilot SDK via Actions | Copilot SDK local |
| Quality | Low (garbled output) | High | High (same SDK) |
| Speed | ~30s/cycle | ~5-10 min/cycle | ~1-2 min/cycle |
| Cost | Free (local compute) | GitHub Actions minutes + Copilot tokens | Copilot tokens only |
| Overhead | node-llama-cpp + 2GB model | Runner queue + checkout + npm ci | Just SDK call |
| Auth | None | GITHUB_TOKEN (Actions) | COPILOT_GITHUB_TOKEN (user) |
| Git integration | None | Full (branches, PRs, commits) | None (local filesystem) |
| Supervision | None | Supervisor workflow | Claude Code via MCP |
| Tuning feedback | Instant | Minutes to hours | Seconds to minutes |
| Use case | Offline experimentation | Production pipeline | Prompt tuning, scenario validation |

## Risks

1. **COPILOT_GITHUB_TOKEN expiry** — Classic PATs have ≤90 day expiration in Polycode enterprise. The user must keep their token fresh. The spike should fail clearly on auth errors.

2. **Rate limiting** — Running 5 cycles in quick succession may hit Copilot API rate limits. The existing retry logic in `copilot.js` handles 429s with exponential backoff, but the spike should log when retries happen.

3. **Prompt drift** — The CLI's `buildTaskPrompt` in `bin/agentic-lib.js` may diverge from the Action's task handlers in `src/actions/agentic-step/tasks/*.js`. Long-term, these should share code. For the spike, the CLI's prompts are sufficient.

4. **Missing GitHub context** — The Action's transform task reads open issues via octokit. The CLI version skips this (no repo context). This is fine for scenario tests but means the local experience is slightly different from production.

5. **Module resolution** — `@github/copilot-sdk` lives in `src/actions/agentic-step/node_modules/` (nested). The CLI already handles this by searching multiple locations. Verify it works on a clean install.

## Relationship to MCP Server

The MCP server's **Copilot mode** (`iterate` tool) is architecturally identical to this spike — it calls `runIterationLoop` which calls the CLI's task runner which creates Copilot SDK sessions locally. The difference is:

- **MCP `iterate`**: Claude Code calls it as a tool, gets structured results back, can intervene between cycles
- **CLI `iterate`**: User runs it from shell, gets console output, no mid-run intervention

The spike validates that the underlying path works. Once validated, the MCP server becomes the preferred interface for Claude-supervised iteration — which is the full hybrid vision.

## Timeline

This is a spike — it should take one session to run and evaluate. The script is mostly a wrapper around existing code. The real value is the results data and the comparison to Actions-based benchmarks.
