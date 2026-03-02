# REPORT: Workflow Validation — repository0

**Date**: 2026-03-02
**Operator**: Claude Code (claude-opus-4-6)
**Target**: `xn-intenton-z2a/repository0` (plot-code-lib mission)
**Duration**: ~1 hour interactive session
**agentic-lib version**: 7.1.27 → 7.1.28 (fixes applied during testing)

## Test Method

Manually dispatched each agentic workflow in repository0 via `gh workflow run` and `gh api graphql`, observed outcomes, and recorded results. The goal is to validate that the full agentic pipeline works end-to-end: from mission → features → issues → code → tests → PR → merge.

### Permissions Required for Hands-Free Operation

To run this validation autonomously, the operator needs:

| Permission | Why |
|-----------|-----|
| `gh workflow run` on repository0 | Dispatch all agentic workflows |
| `gh issue create/list` on repository0 | Create test issues for transform to pick up |
| `gh api graphql` mutations on repository0 | Post discussion comments to trigger bot |
| `gh pr merge` on agentic-lib | Merge fixes discovered during testing |
| Read access to workflow run logs | Diagnose failures |
| NPM publish (via release workflow) | Publish fixed agentic-lib to npm |
| `npx @xn-intenton-z2a/agentic-lib init --purge` in repository0 | Deploy fixes to repository0 |

### Pre-conditions
- repository0 on main, MISSION.md describes "plot-code-lib" (jq of formulae visualisations)
- No open issues or PRs at start
- `src/lib/main.js` exists (seed file)
- No `features/` directory (features not yet generated)
- All workflows present and enabled
- Supervisor schedule set to hourly

### Workflows Under Test

| Workflow | Purpose | Test Approach |
|----------|---------|---------------|
| `agent-flow-maintain` | Generate features from MISSION.md | Dispatch, check if features/ created |
| `agent-flow-transform` | Pick issue, generate code, open PR | Dispatch after creating issue #2440 |
| `agent-flow-review` | Close resolved issues, enhance criteria | Dispatch, observe behavior |
| `agent-flow-fix-code` | Fix failing PR | Wait for a failing PR, then test |
| `agent-discussions-bot` | Respond in discussions | Post comment, dispatch, check response |
| `agent-supervisor` | Reactive (evaluate) + proactive (supervise) | Observe reactive triggers; dispatch proactive |
| `ci-automerge` | Auto-merge PRs with label | Observe after PR creation |
| `test` | Run tests on PR branches | Observe after PR creation |

---

## Experiment Log

### Experiment 1: Discussion Bot Engagement
**Time**: 2026-03-02T22:09Z
**Action**: Posted comment to discussion #2427 via GraphQL asking bot to create an issue for expression parser
**Discussion comment**: https://github.com/xn-intenton-z2a/repository0/discussions/2427#discussioncomment-15977640
**Triggered**: `agent-discussions-bot` via `discussion_comment` event (run 22597985582) — SUCCESS
**Also dispatched manually**: run 22597987819 — SUCCESS but no-op (empty discussion URL on workflow_dispatch)
**Result**: **PASS** — Bot responded naturally: "I'll get the supervisor to create that issue for your expression parser experiment."

**Follow-up at 22:21Z**: Posted second comment about testing strategy for time series data.
- Triggered via `discussion_comment` event (run 22598403663) — SUCCESS
- Bot responded with a detailed testing strategy: known value tests, reference comparison, floating point tolerance, boundary testing

### Experiment 2: Feature Generation (agent-flow-maintain)
**Time**: 2026-03-02T22:09Z
**Action**: Dispatched `agent-flow-maintain` to generate features from MISSION.md
**Run**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22597976932
**Duration**: 1m23s
**Result**: **PASS** — Created 4 feature files in `features/`:
- `EXPRESSION_PARSING.md` — Mathematical expression parser with mathjs
- `CLI_INTERFACE.md` — Command-line interface with yargs/commander
- `PLOT_GENERATION.md` — SVG/PNG plot generation
- `TIME_SERIES_GENERATION.md` — Time series data generation from expressions

Committed to main as `cfff77cd`.

### Experiment 3: Code Generation (agent-flow-transform)
**Time**: 2026-03-02T22:10Z
**Action**: Created issue #2440 "Implement expression parser for mathematical formulae", dispatched transform
**Issue**: https://github.com/xn-intenton-z2a/repository0/issues/2440
**Run (attempt 1)**: 22598008914 — **CANCELLED** by concurrency group `agentic-lib-main` (maintain was still running)
**Run (attempt 2)**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22598059066
**Duration**: 4m12s (31 LLM turns)
**Result**: **PASS** — Generated a full implementation:
- `src/lib/main.js` +287 lines: `ExpressionParser` class, CLI with `commander`, SVG generation with `d3` + `jsdom`
- `tests/unit/main.test.js` +114 lines: comprehensive unit tests
- `package.json` +12/-5: added `mathjs`, `commander`, `d3`, `jsdom` dependencies
- Created 3 example SVG files: `sine.svg`, `parabola.svg`, `complex.svg`
- Updated `README.md` with documentation (+160 lines)
- Updated `intentïon.md` activity log

Committed to main as `d570e9bb`.

**Transform (attempt 3)**: 22598393286 — SUCCESS but only updated activity log (no new code needed — existing implementation already covered issue #2441)

### Experiment 4: Issue Review (agent-flow-review)
**Time**: 2026-03-02T22:10Z
**Action**: Dispatched `agent-flow-review` with existing issue #2440
**Run**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22598012349
**Duration**: review-issues (25s) + enhance-issues (51s)
**Result**: **PASS** — Added `ready` label to issue #2440. Both review and enhance jobs completed successfully.

### Experiment 5: Fix Code Flow
**Status**: NOT TESTED — No failing PR was generated during testing period. Transform commits directly to main rather than opening PRs, so there were no PR branches to fail.

### Experiment 6: Supervisor (Proactive LLM)
**Time**: 2026-03-02T22:14Z
**Action**: Dispatched `agent-supervisor` via `workflow_dispatch`
**Run**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22598140672
**Result**: **PASS** — The LLM supervisor ran successfully:
- `evaluate` job skipped (correct — only fires on `workflow_run`)
- `supervise` job ran using `claude-sonnet-4` model
- Authenticated as `Antony-at-Polycode` via COPILOT_GITHUB_TOKEN
- **Decision**: `nop` — correctly identified that transform was already running on issue #2440
- **Reasoning**: "Current state analysis shows optimal pipeline activity... Transform already in progress"
- Duration: ~12 seconds (prompt 6126 chars, 16723 input tokens, 745 output tokens)

### Experiment 6b: Supervisor (Reactive)
**Time**: 2026-03-02T22:10Z, 22:16Z (automatic)
**Runs**: 22598015102 (after maintain), 22598229946 (after transform)
**Result**: **PASS** — Reactive `evaluate` job fired correctly on `workflow_run` completion. No PR failures to respond to, so it completed quickly with no actions.

### Experiment 7: Full Pipeline (End-to-End)
**Observed flow**:
1. `agent-flow-maintain` → generated 4 features → committed to main
2. `agent-supervisor` (reactive) → fired on maintain completion → no action needed
3. `agent-flow-review` → enhanced issue #2440 with `ready` label
4. `agent-flow-transform` → picked up issue #2440 → generated full implementation → committed to main
5. `agent-supervisor` (reactive) → fired on transform completion → no action needed
6. `agent-supervisor` (proactive) → LLM evaluated state → chose `nop` (everything running)

**Result**: **PARTIAL PASS** — The pipeline works from features → code, but does NOT create PRs. Transform commits directly to main, bypassing the PR → test → automerge path.

---

## Results Summary

| Experiment | Workflow | Outcome | Duration | Notes |
|-----------|----------|---------|----------|-------|
| 1 | discussions-bot | **PASS** | 14s | Natural event trigger works; manual dispatch no-ops |
| 2 | agent-flow-maintain | **PASS** | 1m23s | Generated 4 feature files from mission |
| 3 | agent-flow-transform | **PASS** | 4m12s | Generated full expression parser + CLI + tests (287 LoC) |
| 4 | agent-flow-review | **PASS** | 1m16s | Enhanced issue with `ready` label |
| 5 | agent-flow-fix-code | **NOT TESTED** | — | No failing PR available |
| 6 | agent-supervisor (proactive) | **PASS** | 12s | LLM chose `nop` correctly |
| 6b | agent-supervisor (reactive) | **PASS** | <10s | Fired on workflow completions correctly |
| 7 | Full pipeline | **PARTIAL** | — | Works but no PRs created |

---

## Issues Found

### ISSUE-1: Shared Concurrency Group Causes Cancellations (FIXED in v7.1.28)
**Severity**: High
**Workflows affected**: transform, maintain, review
**Problem**: All three shared `concurrency: agentic-lib-main`, so dispatching them simultaneously caused one to cancel the other.
**Impact**: Transform attempt 1 was cancelled because maintain was still running.
**Fix**: PR #1808 — separate concurrency groups (`agentic-lib-transform`, `agentic-lib-maintain`, `agentic-lib-review`)

### ISSUE-2: Discussions Bot Ignores workflow_dispatch (FIXED in v7.1.28)
**Severity**: Medium
**Problem**: The bot extracts discussion URL from `context.payload.discussion` which is empty on `workflow_dispatch`. The "Respond to discussion" step skips entirely.
**Impact**: Supervisor can't dispatch the bot to respond to a specific discussion.
**Fix**: PR #1808 — added `discussion-url` input to `workflow_dispatch` and updated URL resolution to check input first.

### ISSUE-3: Bot Concurrency Cancels Event Triggers (FIXED in v7.1.28)
**Severity**: Medium
**Problem**: Global `concurrency: agentic-lib-bot` means a `workflow_dispatch` run cancels a concurrent `discussion_comment` event run.
**Impact**: Run 22598138786 (natural event trigger) was cancelled by our manual dispatch.
**Fix**: PR #1808 — per-discussion concurrency group `agentic-lib-bot-${{ github.event.discussion.node_id || github.run_id }}`

### ISSUE-4: GITHUB_TOKEN Pushes Don't Trigger Workflows
**Severity**: Medium
**Problem**: When agentic workflows commit via GITHUB_TOKEN, the push to main does NOT trigger `test.yml` or other push-triggered workflows. This is a GitHub security feature to prevent infinite loops.
**Impact**: Code committed by transform, maintain, etc. is never tested by the `test` workflow. Only human pushes or pushes via a PAT trigger the test workflow.
**Workaround**: The transform task runs `npm test` internally via the Copilot SDK before committing. But there's no independent CI validation.
**Potential fix**: Use `WORKFLOW_TOKEN` (PAT) for the push step, or dispatch `test` explicitly after commit.

### ISSUE-5: Transform Commits Directly to Main (No PRs)
**Severity**: Low-Medium
**Problem**: Transform pushes to `${{ github.ref_name }}` (main) via `commit-if-changed`. No branch is created, no PR is opened.
**Impact**: There's no code review gate, no automerge flow, no fix-code flow (nothing to fix since there are no PR branches).
**Trade-off**: Direct-to-main is faster and simpler. The LLM already runs tests before committing. PRs add a review gate but slow down the pipeline.
**Note**: This is by design currently. The transform task doesn't create branches — it works in the checkout directory and the workflow pushes. To enable the PR flow, transform would need to create a branch, push, and open a PR.

### ISSUE-6: Push Retry Logic Untested
**Severity**: Low
**Problem**: The new retry logic in `commit-if-changed` hasn't been tested with actual push races yet.
**Note**: Will be testable after v7.1.28 is deployed to repository0 and concurrent dispatches actually run.

---

## Recommendations

### Immediate (for next release)
1. Deploy v7.1.28 to repository0 via `init --purge` to get the concurrency fixes
2. Re-run experiments to validate concurrent dispatches work without cancellation
3. Test the discussions bot `discussion-url` input via supervisor dispatch

### Short-term
4. **Add WORKFLOW_TOKEN to transform commit step** so pushes trigger the test workflow (ISSUE-4)
5. **Add explicit test dispatch** after agentic commits — supervisor could dispatch `test` after observing a transform/maintain commit
6. **Document the supervisor's `nop` behavior** — it correctly avoids over-dispatching, which is good

### Medium-term
7. **Evaluate branch-based transform** — optional mode where transform creates a PR branch instead of pushing to main. This enables the fix-code and automerge flows.
8. **Supervisor prompt tuning** — after several live cycles, adjust the agent prompt based on what decisions work well
9. **Discussion bot thread awareness** — the bot doesn't always respond when dispatched manually. Needs the `discussion-url` input to work via supervisor.

---

## Appendix: Raw Workflow Run Data

| Run ID | Workflow | Event | Conclusion | Duration | Branch |
|--------|----------|-------|------------|----------|--------|
| 22597976932 | agent-flow-maintain | workflow_dispatch | success | 1m23s | main |
| 22597985582 | agent-discussions-bot | discussion_comment | success | ~14s | main |
| 22597987819 | agent-discussions-bot | workflow_dispatch | success | ~14s | main |
| 22598008914 | agent-flow-transform | workflow_dispatch | cancelled | — | main |
| 22598012349 | agent-flow-review | workflow_dispatch | success | 1m16s | main |
| 22598015102 | agent-supervisor | workflow_run | success | <10s | main |
| 22598059066 | agent-flow-transform | workflow_dispatch | success | 4m12s | main |
| 22598138786 | agent-discussions-bot | discussion_comment | cancelled | — | main |
| 22598140672 | agent-supervisor | workflow_dispatch | success | ~18s | main |
| 22598143898 | agent-discussions-bot | workflow_dispatch | success | ~14s | main |
| 22598229946 | agent-supervisor | workflow_run | success | <10s | main |
| 22598393286 | agent-flow-transform | workflow_dispatch | success | ~2m | main |
| 22598403663 | agent-discussions-bot | discussion_comment | success | ~30s | main |
