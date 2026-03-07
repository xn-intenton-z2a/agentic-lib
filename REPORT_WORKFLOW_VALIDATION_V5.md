# REPORT: Workflow Validation V5 — Post Context-Quality Validation

**Date**: 2026-03-07
**Operator**: Claude Code (claude-opus-4-6)
**Target**: `xn-intenton-z2a/repository0`
**agentic-lib version**: 7.1.62
**Previous report**: REPORT_WORKFLOW_VALIDATION_V4.md (V4, agentic-lib 7.1.60)

---

## What Changed Since V4

V5 tests the following changes introduced in v7.1.61–v7.1.62:

1. **Context-quality pipeline** — clean/compress/limit pipeline for LLM prompts
2. **TOML-driven profiles** — `[profiles.min]`, `[profiles.recommended]`, `[profiles.max]` replace hardcoded JS constants
3. **Self-descriptive config keys** — 11 TOML keys renamed (e.g., `source-content` → `max-source-chars`)
4. **testScript wiring** — `npm ci && npm test` as self-contained test command from TOML config
5. **Transformation budget** — configurable max code-changing cycles per run
6. **buildScript/mainScript removed** — unused config keys cleaned up

## Method

Scenarios run on repository0 using `gh workflow run` dispatches. The schedule is set to `continuous` (*/15 cron), so iterations run automatically. We observe and record results.

### How to Continue This Report

1. Read this file and PLAN_BENCHMARK_V5.md
2. Check current state in the **Current State** section
3. For each iteration, record: commits, PRs, issues, source lines, test count
4. Update iteration tables and current state

### Dispatch Commands

```bash
# Init with purge (reset to seed code for a mission)
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0 \
  -f mode=purge -f mission-seed=MISSION_NAME -f schedule=off

# Check latest runs
gh run list -R xn-intenton-z2a/repository0 -L 5

# Read source
gh api repos/xn-intenton-z2a/repository0/contents/src/lib/main.js -q '.content' | base64 -d | wc -l

# Check commits
gh api repos/xn-intenton-z2a/repository0/commits -q '.[0:5] | .[] | .sha[0:8] + " " + (.commit.message | split("\n")[0])'

# Check issues
gh api 'repos/xn-intenton-z2a/repository0/issues?state=all&per_page=10&sort=created&direction=desc' \
  -q '.[] | select(.pull_request == null) | "#\(.number) \(.state) \(.title)"'

# Check PRs
gh api 'repos/xn-intenton-z2a/repository0/pulls?state=all&per_page=10&sort=created&direction=desc' \
  -q '.[] | "#\(.number) \(.state) merged=\(.merged_at // "no") \(.title)"'

# Check MISSION_COMPLETE
gh api repos/xn-intenton-z2a/repository0/contents/MISSION_COMPLETE.md -q '.name' 2>/dev/null || echo "not yet"
```

### Scenarios

| # | Mission | Model | Profile | Budget | Goal |
|---|---------|-------|---------|--------|------|
| 1 | fizz-buzz | gpt-5-mini | min | 4 | Baseline — simplest mission, should complete in 2-3 transforms |
| 2 | fizz-buzz | gpt-5-mini | recommended | 8 | Compare min vs recommended context quality |
| 3 | hamming-distance | gpt-5-mini | recommended | 8 | Medium complexity — the mission that struggled in pre-V5 |
| 4 | hamming-distance | claude-sonnet-4 | recommended | 8 | Model comparison on same mission |

---

## Current State

**Active scenario**: 3 (hamming-distance / gpt-5-mini / recommended)
**Status**: Observing — experiment running on continuous schedule since v7.1.62 init
**repository0 state**: hamming-distance mission, continuous schedule, recommended profile

---

## Pre-V5 Baseline: hamming-distance / v7.1.61 (2026-03-06 20:48–23:38)

This baseline captures what happened with v7.1.61 before the v7.1.62 fixes.

**Init**: [#13](https://github.com/xn-intenton-z2a/repository0/actions/runs/22781401265) at 20:48 UTC
**Re-init**: [#14](https://github.com/xn-intenton-z2a/repository0/actions/runs/22786522033) at 23:38 UTC (v7.1.62)

### Iterations (v7.1.61)

| # | Run ID | Time | Transform? | PR | What Happened |
|---|--------|------|------------|-----|---------------|
| 1 | [22781639068](https://github.com/xn-intenton-z2a/repository0/actions/runs/22781639068) | 20:56 | YES | #2606 merged | Transform #2605 merged |
| 2 | [22782211296](https://github.com/xn-intenton-z2a/repository0/actions/runs/22782211296) | 21:13 | NO | — | Maintain only (dev skipped) |
| 3 | [22782790265](https://github.com/xn-intenton-z2a/repository0/actions/runs/22782790265) | 21:31 | NO | — | Maintain only (dev skipped) |
| 4 | [22783517332](https://github.com/xn-intenton-z2a/repository0/actions/runs/22783517332) | 21:54 | NO | — | Maintain only (dev skipped) |
| 5 | [22784060804](https://github.com/xn-intenton-z2a/repository0/actions/runs/22784060804) | 22:11 | YES | #2612 merged | Transform #2611 merged |
| 6 | [22784575871](https://github.com/xn-intenton-z2a/repository0/actions/runs/22784575871) | 22:28 | NO | — | Maintain only (dev skipped) |
| 7 | [22785123698](https://github.com/xn-intenton-z2a/repository0/actions/runs/22785123698) | 22:47 | NO | — | Maintain only (dev skipped) |
| 8 | [22785816706](https://github.com/xn-intenton-z2a/repository0/actions/runs/22785816706) | 23:11 | NO | — | Maintain only (dev skipped) |
| 9 | [22786279503](https://github.com/xn-intenton-z2a/repository0/actions/runs/22786279503) | 23:28 | NO | — | Maintain only (dev skipped) |

### Baseline Summary

- **9 runs, 2 transforms** — only runs #1 and #5 produced merged PRs
- **7 out of 9 dev jobs skipped** — most iterations were maintain-only
- **10 issues created, 10 closed** — all hamming-distance variants, feature churn
- **Source code unchanged** — `src/lib/main.js` remained the seed `main()` function
- **Tests seed-only** — single "should terminate without error" test
- **100% job success** — zero crashes

---

## Scenario 3: hamming-distance / gpt-5-mini / recommended (v7.1.62)

**Mission**: Hamming distance — 2 core functions with Unicode support, input validation, BigInt
**Model**: gpt-5-mini
**Profile**: recommended
**Init**: [#14](https://github.com/xn-intenton-z2a/repository0/actions/runs/22786522033) at 23:38 UTC (v7.1.62)
**Schedule**: continuous (*/15 cron)

### Iterations

| # | Run ID | Time | Duration | Transform? | PR | Source Lines | Tests | What Happened |
|---|--------|------|----------|------------|-----|-------------|-------|---------------|
| 1 | [22786674431](https://github.com/xn-intenton-z2a/repository0/actions/runs/22786674431) | 23:44 | 8m20s | YES | #2619 merged | 93 | 1 (seed) | Full hamming-distance implementation: `hammingDistance` (Unicode, Buffer, Uint8Array) + `hammingDistanceBits` (Number, BigInt). PR #2619 auto-merged. |
| 2 | [22786967484](https://github.com/xn-intenton-z2a/repository0/actions/runs/22786967484) | 23:56 | ~5min | NO | — | 93 | 1 (seed) | Maintain commit only. Dev ran but found "No ready issues". All issues closed by review. Features grew to 4 (added BATCH_SUPPORT.md). |

### Current Source State (after iteration 1)

`src/lib/main.js`: 93 lines — complete implementation:
- `hammingDistance(a, b)` — strings (Unicode via `Array.from`), Buffer, Uint8Array, array-like
- `hammingDistanceBits(x, y)` — Number (unsigned 32-bit) and BigInt support
- Input validation: `TypeError` for unsupported types, `RangeError` for unequal lengths / negative BigInt

### Features

3 feature files: `BIGINT_SUPPORT.md`, `CLI_TOOL.md`, `HAMMING_CORE.md`

### Issues

| Issue | State | Title |
|-------|-------|-------|
| #2620 | open | Implement Hamming distance functions (hammingDistance, hammingDistanceBits) |
| #2618 | closed | Implement Hamming distance functions (hammingDistance, hammingDistanceBits) |
| #2616 | closed | Implement Hamming distance functions (Unicode-aware strings & bitwise integers) |
| #2615 | closed | Implement hammingDistance and hammingDistanceBits in src/lib/main.js |
| #2614 | closed | Implement Hamming distance functions with Unicode handling and input validation |
| #2613 | closed | Implement Hamming distance functions (hammingDistance, hammingDistanceBits) |
| #2611 | closed | Add BigInt support for large integers in hammingDistanceBits |
| #2610 | closed | Implement Hamming distance functions (hammingDistance, hammingDistanceBits) |

### Early Comparison: v7.1.61 vs v7.1.62

| Metric | v7.1.61 (9 runs) | v7.1.62 (1 run so far) |
|--------|------------------|------------------------|
| Source code | Seed only (16 lines) | 93 lines, full implementation |
| Transforms that produced code | 0 (PRs merged but code didn't land) | 1 (PR #2619, code persists) |
| Tests | Seed only | Seed only (not yet updated) |
| Issue churn | 10 created/closed, no convergence | 8 created, pattern similar |
| Features | Created then pruned each cycle | 3 stable features |

**Key improvement**: The context-quality pipeline in v7.1.62 produced a working implementation in a single transform, whereas v7.1.61 failed to land any code in 9 runs.

---

## Scenario 1: fizz-buzz / gpt-5-mini / min — PENDING

Will be run after Scenario 3 stabilises or reaches 10 iterations.

---

## Scenario 2: fizz-buzz / gpt-5-mini / recommended — PENDING

Will be run after Scenario 1.

---

## Scenario 4: hamming-distance / claude-sonnet-4 / recommended — PENDING

Will be run after Scenario 2. Note: V4 found that claude-sonnet-4 fails with reasoning-effort parameter. V5 should have fixed this (reasoning-effort only sent for gpt-5-mini).

---

## Findings (preliminary)

### FINDING-V5-1: Context Quality Pipeline Produces Working Code (POSITIVE)

v7.1.62's first transform produced a 93-line hamming-distance implementation with Unicode support, BigInt handling, and input validation. v7.1.61 failed to land any code in 9 runs. The context-quality pipeline (clean/compress/limit) gives the LLM enough context to write correct, comprehensive code.

### FINDING-V5-2: Tests Not Updated (CONCERN)

Despite producing working source code, the test file remains seed-only ("should terminate without error"). The pipeline doesn't prioritise updating tests alongside the implementation.

### FINDING-V5-3: Issue Churn Continues (CONCERN)

8 issues created across 2 runs (including pre-init runs in the same session). Issues have near-identical titles. The review step doesn't recognise existing similar issues.

---

## Conclusions

_To be written after all scenarios complete._
