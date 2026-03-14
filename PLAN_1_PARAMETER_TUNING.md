# Plan: Parameter Tuning for Workflows

## Goal

Fine tune the values in agentic-lib.toml to find a reliable and efficient default configuration for consumers. 
Use the local CLI for fast iteration and the Actions path for real-world validation.

---

## Phase 1: Validate Both Paths

**Goal**: Prove that the converged code works identically via CLI and Actions.

### Local validation

Run all task types via CLI against a real workspace:

```bash
# Iterate (existing — already validated in Phase 3)
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate \
  --mission 6-kyu-understand-hamming-distance --model gpt-5-mini

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
- [ ] CLI `iterate` completes 6-kyu-understand-hamming-distance
- [ ] CLI `iterate --here` discovers and generates MISSION.md
- [ ] MCP server `iterate` tool works
- [ ] Token tracking produces correct numbers in both paths
- [ ] Rate limit retry works in both paths
- [ ] Agent .md files loaded as system prompts in both paths
- [ ] Profile tuning (min/recommended/max) works in both paths

---

## Phase 2: Tune Locally

**Goal**: Use the fast local iteration loop to explore reasoning effort levels, models, and prompt variations — things that take hours via Actions but minutes locally.

### Reasoning effort matrix

| Model | low | medium | high | xhigh |
|-------|-----|--------|------|-------|
| gpt-5-mini | Baseline | ? | ? | ? |
| claude-sonnet-4 | ? | ? | ? | N/A |
| gpt-4.1 | ? | ? | ? | ? |

For each cell: run 6-kyu-understand-hamming-distance + 7-kyu-understand-fizz-buzz, record tokens, time, pass/fail, code quality.

### Model comparison

| Mission | gpt-5-mini | claude-sonnet-4 | gpt-4.1 |
|---------|-----------|----------------|---------|
| 6-kyu-understand-hamming-distance | Benchmark 005/006 data | ? | ? |
| 7-kyu-understand-fizz-buzz | Benchmark 004 data | ? | ? |
| 6-kyu-understand-roman-numerals | ? | ? | ? |
| 4-kyu-apply-cron-engine | ? | ? | ? |

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
