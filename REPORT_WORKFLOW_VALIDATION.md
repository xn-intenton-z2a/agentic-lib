# REPORT: Workflow Validation — repository0

**Date**: 2026-03-02
**Operator**: Claude Code (claude-opus-4-6)
**Target**: `xn-intenton-z2a/repository0` (plot-code-lib mission)
**Duration**: ~1 hour interactive session

## Test Method

Manually dispatched each agentic workflow in repository0 via `gh workflow run` and `gh api graphql`, observed outcomes, and recorded results. The goal is to validate that the full agentic pipeline works end-to-end: from mission → features → issues → code → tests → PR → merge.

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
**Time**: 2026-03-02T22:15Z
**Action**: Posted comment to discussion #2427 asking bot to create an issue for expression parser
**Discussion comment**: https://github.com/xn-intenton-z2a/repository0/discussions/2427#discussioncomment-15977640
**Dispatched**: `agent-discussions-bot` (run 22597987819)
**Status**: PENDING
**Result**: _waiting for bot response_

### Experiment 2: Feature Generation (agent-flow-maintain)
**Time**: 2026-03-02T22:15Z
**Action**: Dispatched `agent-flow-maintain` to generate features from MISSION.md
**Run**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22597976932
**Status**: PENDING
**Expected**: Creates `features/` directory with feature definition files derived from mission
**Result**: _waiting_

### Experiment 3: Code Generation (agent-flow-transform)
**Time**: 2026-03-02T22:16Z
**Action**: Created issue #2440 "Implement expression parser for mathematical formulae" then dispatched `agent-flow-transform`
**Issue**: https://github.com/xn-intenton-z2a/repository0/issues/2440
**Run**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22598008914
**Status**: PENDING
**Expected**: Picks up issue #2440, generates code on a branch, opens a PR
**Result**: _waiting_

### Experiment 4: Issue Review (agent-flow-review)
**Time**: 2026-03-02T22:16Z
**Action**: Dispatched `agent-flow-review` with existing issue #2440
**Run**: https://github.com/xn-intenton-z2a/repository0/actions/runs/22598012349
**Status**: PENDING
**Expected**: Enhances issue criteria or validates existing issues
**Result**: _waiting_

### Experiment 5: Fix Code Flow
**Status**: NOT YET STARTED
**Dependency**: Needs a failing PR to test against

### Experiment 6: Supervisor (Proactive)
**Status**: NOT YET STARTED
**Note**: PR #1807 (dual-mode supervisor with LLM supervise task) needs to be merged in agentic-lib and init'd into repository0 before this can be tested. The current supervisor is the old hardcoded JS version.

### Experiment 7: Full Pipeline (End-to-End)
**Status**: NOT YET STARTED
**Goal**: Observe: maintain → issue creation → transform → PR → test → automerge → supervisor reaction

---

## Results Summary

| Experiment | Workflow | Outcome | Notes |
|-----------|----------|---------|-------|
| 1 | discussions-bot | _pending_ | |
| 2 | agent-flow-maintain | _pending_ | |
| 3 | agent-flow-transform | _pending_ | |
| 4 | agent-flow-review | _pending_ | |
| 5 | agent-flow-fix-code | _not started_ | Needs failing PR |
| 6 | agent-supervisor | _not started_ | Needs PR #1807 merged |
| 7 | Full pipeline | _not started_ | |

---

## Issues Found

_To be populated as experiments complete_

## Recommendations

_To be populated after all experiments_
