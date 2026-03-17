# Plan: Parameter Tuning for Workflows

## Goal

Fine-tune the values in `agentic-lib.toml` to find a reliable and efficient default configuration for consumers.
Use the local CLI for fast iteration and the GitHub Actions path for real-world validation.

---

## Phase 1: Validate Both Paths

**Goal**: Prove that the pipeline works identically via CLI and Actions, using the scenario matrix from `ITERATION_BENCHMARKS_SIMPLE.md` as the validation suite.

### GitHub Actions validation

One clean run of the ITERATION_BENCHMARKS_SIMPLE.md scenario matrix constitutes Actions validation. The procedure is:

1. **Init purge** — `gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0 -f mode=purge -f mission-seed=MISSION_NAME -f schedule=off`
2. **Dispatch workflow** — `gh workflow run agentic-lib-workflow -R xn-intenton-z2a/repository0`
3. **Monitor** — Read `agentic-lib-state.toml` and agent-log files from `agentic-lib-logs` branch
4. **Collect metrics** — tokens, duration, transforms, budget, mission-complete/failed
5. **Verify acceptance** — read source, tests, README, screenshot, website
6. **Record** — write `BENCHMARK_REPORT_NNN.md` using the template in ITERATION_BENCHMARKS_SIMPLE.md

#### Scenario matrix (from ITERATION_BENCHMARKS_SIMPLE.md)

| ID | Mission | Model | Profile | Budget | Purpose |
|----|---------|-------|---------|--------|---------|
| S1 | 7-kyu-understand-fizz-buzz | gpt-5-mini | recommended | 32 | Baseline — default config on simplest mission |
| S2 | 7-kyu-understand-fizz-buzz | gpt-5-mini | max | 128 | Profile comparison (max vs recommended) |
| S3 | 6-kyu-understand-hamming-distance | gpt-5-mini | recommended | 32 | Medium complexity baseline |
| S4 | 6-kyu-understand-hamming-distance | claude-sonnet-4 | recommended | 128 | Model comparison |
| S5 | 6-kyu-understand-roman-numerals | gpt-5-mini | recommended | 32 | Medium complexity baseline |
| S6 | 6-kyu-understand-roman-numerals | claude-sonnet-4 | max | 128 | Model comparison |

A successful validation means all scenarios reach mission-complete within budget.

### CLI validation

Construct an equivalent local validation using the agentic-lib CLI:

#### Workspace setup (equivalent to init-purge)

```bash
# Create a clean workspace from a mission seed
mkdir -p ./tmp/bench-ws && cd ./tmp/bench-ws
npx @xn-intenton-z2a/agentic-lib init --purge --mission 7-kyu-understand-fizz-buzz
```

#### Run each mission via CLI

```bash
# Single iteration (transform + test cycle)
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate \
  --mission 7-kyu-understand-fizz-buzz --model gpt-5-mini

# Discovery mode (auto-generate MISSION.md)
COPILOT_GITHUB_TOKEN=<token> npx @xn-intenton-z2a/agentic-lib iterate --here

# Individual task handlers
npx @xn-intenton-z2a/agentic-lib transform --target ./tmp/bench-ws --model gpt-5-mini
npx @xn-intenton-z2a/agentic-lib supervise --target ./tmp/bench-ws --dry-run
```

#### Metrics to collect

For each CLI run, record: tokens (from session result), duration (wall-clock), transforms (files changed), pass/fail (test exit code).

#### CLI ↔ Actions comparison

| Metric | CLI | Actions |
|--------|-----|---------|
| Mission complete within budget | ? | ? |
| Transforms to first working code | ? | ? |
| Total tokens | ? | ? |
| Wall-clock time | ? | ? |
| Test pass rate | ? | ? |
| Code quality (source lines, exports, tests) | ? | ? |

### Regression checklist

- [ ] `npm test` passes in agentic-lib (568+ unit tests)
- [ ] `npm run lint:workflows` passes
- [ ] Init distributes actions, agents, seeds, scripts correctly
- [ ] CLI `iterate` completes 7-kyu-understand-fizz-buzz
- [ ] CLI `iterate --here` discovers and generates MISSION.md
- [ ] MCP server `iterate` tool works
- [ ] Token tracking produces correct numbers in both paths
- [ ] Profile tuning (min/recommended/max) works in both paths
- [ ] Supervisor creates issues successfully (W1 inline param parsing)
- [ ] Dispatch forwards mode and issue-number correctly (W2/W3)

---

## Phase 2: Tune Locally

**Goal**: Use the fast local iteration loop to explore models, reasoning effort, and profile parameters — things that take hours via Actions but minutes locally.

### Mission tiers for tuning

| Tier | Mission | Complexity | Expected transforms | Observed wall-clock |
|------|---------|-----------|---------------------|---------------------|
| Easy (7-kyu) | `7-kyu-understand-fizz-buzz` | 2 functions, 8 criteria | 1–2 | ~20 min (Report 004) |
| Medium (6-kyu) | `6-kyu-understand-hamming-distance` | 2 functions + Unicode + BigInt, 7 criteria | 2–4 | ~21 min (Summary 009) |
| Hard (4-kyu) | `4-kyu-apply-cron-engine` | 5 functions + DST + validation, 8 criteria | 4–8 | ~93 min (Report 007) |

### Core tuning knobs (`[tuning]` section)

| Parameter | Values | Impact | What to watch |
|-----------|--------|--------|---------------|
| `profile` | min / recommended / max | Sets defaults for all limits and reasoning | min may under-budget hard missions; max may over-spend |
| `model` | gpt-5-mini / claude-sonnet-4 / gpt-4.1 | LLM capability vs cost | gpt-5-mini is fast+cheap; claude-sonnet-4 is highest code quality |
| `reasoning-effort` | low / medium / high / none | Depth of reasoning (gpt-5-mini, o4-mini only) | Higher effort → more tokens but potentially fewer transforms |
| `transformation-budget` | 4–128 | Max code-changing cycles per run | Hamming used 5/32; cron-engine used 6/32 |
| `infinite-sessions` | true / false | Session compaction for long runs | May lose context in multi-iteration scenarios |

### Limit knobs (`[limits]` and `[profiles.*]`)

| Parameter | min | recommended | max | Effect |
|-----------|-----|-------------|-----|--------|
| `max-feature-issues` | 1 | 2 | 4 | Concurrent feature development issues |
| `max-maintenance-issues` | 1 | 1 | 2 | Concurrent maintenance issues |
| `max-attempts-per-branch` | 2 | 3 | 5 | Transform retries before abandoning a branch |
| `max-attempts-per-issue` | 1 | 2 | 4 | Transform retries before abandoning an issue |
| `features-limit` | 2 | 4 | 8 | Max feature spec files in `features/` |
| `library-limit` | 8 | 32 | 64 | Max library reference docs in `library/` |
| `max-issues` | 5 | 15 | 30 | Max open issues fetched from GitHub |
| `stale-days` | 14 | 30 | 90 | Days before issue considered stale |
| `max-discussion-comments` | 3 | 10 | 20 | Max discussion comments fetched |

### Mission-complete thresholds (`[mission-complete]`)

| Parameter | Default | Effect |
|-----------|---------|--------|
| `min-resolved-issues` | 1 | Minimum closed-as-resolved issues before mission-complete |
| `max-source-todos` | 0 | Max TODO comments allowed in `./src` |

### Tuning matrices

#### Reasoning effort × Model (run on all 3 tier missions)

| Model | low | medium | high |
|-------|-----|--------|------|
| gpt-5-mini | Baseline | Current default | ? |
| claude-sonnet-4 | ? | ? | N/A (auto-skipped) |
| gpt-4.1 | ? | ? | ? |

For each cell: record tokens, wall-clock, transforms, pass/fail, code quality.

#### Profile × Mission (gpt-5-mini / medium reasoning)

| Mission | min | recommended | max |
|---------|-----|-------------|-----|
| fizz-buzz | ? | Report 004 data | ? |
| hamming-distance | ? | Summary 009 data | ? |
| cron-engine | ? | Report 007 data | ? |

### What to observe (from benchmark history)

| Metric | Hamming (Summary 009) | Cron-engine (Report 007) | What it means |
|--------|-----------------------|--------------------------|---------------|
| Tokens per transform | 410K (main transform) | ~300K per transform | LLM cost per code-changing step |
| Wall-clock per iteration | ~10 min | ~12 min | CI overhead + LLM latency |
| Budget consumption | 5/32 (16%) | 6/32 (19%) | Headroom for harder missions |
| Feature specs created | 4 (first maintain) | 3 | Context the transform agent receives |
| Library docs created | 7 (second maintain) | 6 | Reference material quality |
| Issue lifecycle | 3m 45s | ~5 min | Supervisor → dev → merge cycle |
| Convergence | 2 workflow runs | 8 workflow runs | Instability = more iterations |

### What to look out for (known failure patterns)

| Pattern | Source | Mitigation |
|---------|--------|------------|
| Behaviour test instability consuming budget | Report 007 (50-75% of transforms) | W1 retry logic, W2 explicit waits |
| Supervisor inline params not parsed | Benchmark 010 (0 transforms in 2 iterations) | W1 inline param parsing fix (v7.4.18) |
| Dispatch with placeholder issue numbers | Benchmark 010 | W2 numeric validation (v7.4.18) |
| Premature mission-complete | Report 006 | Dedicated test file requirement (W3) |
| Maintain commit push failure after rebase | Report 009 W8 | HEAD-matches-origin check |
| Context contamination between missions | Report 008/009 | Init purge resets logs branch |
| Transform not running tests internally | Summary 009 (0 test runs in agent) | Post-commit-test gate catches this |

### Output

Results go in `BENCHMARK_REPORT_NNN.md` using the template from ITERATION_BENCHMARKS_SIMPLE.md, with:
- Side-by-side comparison tables for all model/effort/profile combinations
- Token cost analysis (per-transform and cumulative)
- Recommendations for default profile settings
- Findings on which parameters provide measurable improvement
- Fix plan in `PLAN_BENCHMARK_NNN_FIXES.md` for any issues discovered
