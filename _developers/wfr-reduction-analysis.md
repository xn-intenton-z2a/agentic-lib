# wfr-* Workflow Reduction Analysis

**Purpose:** Identify which `wfr-*` utility workflows should be kept as reusable vs. inlined into callers.

**Analysis Date:** 2026-02-28 by @copilot

---

## Summary

Of 15 remaining `wfr-*` files, **3 are truly reusable** (multiple callers), **2 are worth keeping** for separation of concerns, and **10 should be inlined** (single caller).

---

## Methodology

```bash
# Count unique callers for each wfr-* file
grep -r "uses:.*\.github/workflows/wfr-" .github/workflows --include="*.yml" \
  | grep -v "^[^:]*wfr-[^:]*:" \
  | cut -d: -f1 \
  | sort -u
```

---

## Analysis Results

### ✅ Keep as Reusable (9 callers)

**`wfr-agent-config.yml`** — 9 callers
- Used by: publish-web, agent-archive-intentïon, ci-automerge, ci-formating, ci-deploy, publish-packages, ci-test, ci-update
- **Verdict:** KEEP — genuinely shared utility for agent configuration
- **Rationale:** Central configuration point for all agent workflows

### ✅ Keep as Reusable (2 callers)

**`wfr-github-create-pr.yml`** — 2 callers  
- Used by: ci-formating, (check for others)
- **Verdict:** KEEP — PR creation is a common pattern
- **Rationale:** Reusable pattern for formatting/lint fixes

**`wfr-github-select-issue.yml`** — 2 callers  
- Used by: publish-web, publish-stats
- **Verdict:** KEEP — issue selection logic is shared
- **Rationale:** Common pattern for finding issues to work on

---

### ⚠️ Consider Keeping (1 caller, but valuable)

**`wfr-npm-run-script-and-commit-to-branch.yml`** — 1 caller (ci-formating)  
- **Verdict:** KEEP — even though single caller, it's a reusable pattern
- **Rationale:** This is a common "run script + commit" pattern that other workflows might adopt. Keep for future reuse.

---

### 🔴 Inline into Caller (1 caller each)

**`wfr-github-find-pr-from-pull-request.yml`** — 1 caller (ci-automerge)  
- **Verdict:** INLINE — only used by ci-automerge
- **Steps:** Move logic into ci-automerge.yml

**`wfr-github-find-pr-in-check-suite.yml`** — 1 caller (ci-automerge)  
- **Verdict:** INLINE — only used by ci-automerge
- **Steps:** Move logic into ci-automerge.yml

**`wfr-github-merge-pr.yml`** — 1 caller (ci-automerge)  
- **Verdict:** INLINE — only used by ci-automerge
- **Steps:** Move logic into ci-automerge.yml

**`wfr-github-label-issue.yml`** — 1 caller (ci-automerge)  
- **Verdict:** INLINE — only used by ci-automerge
- **Steps:** Move logic into ci-automerge.yml

**`wfr-github-publish-web.yml`** — 1 caller (publish-web)  
- **Verdict:** INLINE — only used by publish-web
- **Steps:** Move S3 publish logic into publish-web.yml

**`wfr-github-stats-to-aws.yml`** — 1 caller (publish-stats)  
- **Verdict:** INLINE — only used by publish-stats
- **Steps:** Move AWS stats upload into publish-stats.yml

**`wfr-github-stats-json.yml`** — 1 caller (publish-stats)  
- **Verdict:** INLINE — only used by publish-stats (actually UNUSED by analysis)
- **Steps:** Check if truly used, if so inline into publish-stats.yml

**`wfr-npm-publish.yml`** — 1 caller (publish-packages)  
- **Verdict:** INLINE — only used by publish-packages
- **Steps:** Move npm publish logic into publish-packages.yml

**`wfr-mvn-publish.yml`** — 1 caller (publish-packages)  
- **Verdict:** INLINE — only used by publish-packages
- **Steps:** Move Maven publish logic into publish-packages.yml

**`wfr-npm-update.yml`** — 1 caller (ci-update)  
- **Verdict:** INLINE — only used by ci-update
- **Steps:** Move npm update logic into ci-update.yml

**`wfr-mvn-update.yml`** — 1 caller (ci-update)  
- **Verdict:** INLINE — only used by ci-update
- **Steps:** Move Maven update logic into ci-update.yml

---

## Inlining Priority

**Phase 1: ci-automerge cleanup** (4 files)
1. `wfr-github-find-pr-from-pull-request.yml`
2. `wfr-github-find-pr-in-check-suite.yml`
3. `wfr-github-merge-pr.yml`
4. `wfr-github-label-issue.yml`

**Phase 2: publish-* cleanup** (4 files)
5. `wfr-github-publish-web.yml`
6. `wfr-github-stats-to-aws.yml`
7. `wfr-npm-publish.yml`
8. `wfr-mvn-publish.yml`

**Phase 3: ci-update cleanup** (2 files)
9. `wfr-npm-update.yml`
10. `wfr-mvn-update.yml`

**Phase 4: Verify stats-json** (1 file)
11. `wfr-github-stats-json.yml` — may be fully unused

---

## Final File Count

**Current:** 15 wfr-* files  
**After reduction:** 5 wfr-* files (4 kept + 1 pending verification)

**Reduction:** 10 files deleted (67% reduction)

---

## Implementation Plan

For each inline candidate:
1. Copy the workflow steps from the wfr-* file
2. Paste into the caller workflow at the appropriate job
3. Update any input references to environment variables or job outputs
4. Test the caller workflow
5. Delete the wfr-* file
6. Commit with message: "Inline wfr-X into caller-workflow"

---

## Risks

- **Breaking repository0**: The consumer repos may reference these wfr-* files from `@main`. We need to check repository0's refresh branch before deleting.
- **Merge conflicts**: If Copilot and Claude both edit workflows, conflicts may arise.

---

## Related Documents

- **[PLAN_CODE_REDUCTION.md](../PLAN_CODE_REDUCTION.md)** — Overall code reduction plan
- **[FEATURES.md](../FEATURES.md)** — Feature #27 definition
