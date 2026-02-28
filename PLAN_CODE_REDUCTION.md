# PLAN: Code Reduction & Optimization

Feature #27 — make the MVP compact and information-dense.

## User Assertions

- MVP should be compact and information-dense
- Inline or remove remaining legacy wfr-* files used by keepers
- Consolidate redundant workflows
- Remove dead code paths
- Minimize number of files a contributor needs to understand

---

## Step 1: Audit remaining wfr-* files

15 `wfr-*` files remain in agentic-lib. Determine which can be inlined into their callers.

**Files to audit:**

| File | Used by | Candidate for inlining |
|------|---------|----------------------|
| `wfr-agent-config.yml` | Multiple agent-flow-* | Keep (shared) |
| `wfr-github-find-pr-from-pull-request.yml` | ci-automerge | Inline candidate |
| `wfr-github-find-pr-in-check-suite.yml` | ci-automerge | Inline candidate |
| `wfr-github-merge-pr.yml` | ci-automerge | Inline candidate |
| `wfr-github-label-issue.yml` | ci-automerge | Inline candidate |
| `wfr-github-select-issue.yml` | agent-flow-* | Keep (shared) |
| `wfr-github-publish-web.yml` | publish-web | Inline candidate |
| `wfr-github-stats-to-aws.yml` | publish-stats | Inline candidate |
| `wfr-github-stats-json.yml` | publish-stats | Inline candidate |
| `wfr-npm-publish.yml` | publish-packages | Inline candidate |
| `wfr-mvn-publish.yml` | publish-packages | Inline candidate |
| `wfr-npm-update.yml` | ci-update | Inline candidate |
| `wfr-mvn-update.yml` | ci-update | Inline candidate |
| `wfr-github-create-pr.yml` | agent-flow-* | Keep (shared) |
| `wfr-npm-run-script-and-commit-to-branch.yml` | agent-flow-* | Keep (shared) |

**Action:** For each candidate, check if it's called from only one workflow. If so, inline the steps and delete the wfr-* file.

### Consensus (Claude Code + Copilot — 2026-02-28)

**Keep 4 shared workflows** (used by multiple callers):
1. `wfr-agent-config.yml` — 9 callers across agent-flow-* workflows
2. `wfr-github-select-issue.yml` — used by multiple agent-flow-* workflows
3. `wfr-github-create-pr.yml` — used by multiple agent-flow-* workflows
4. `wfr-npm-run-script-and-commit-to-branch.yml` — reusable pattern

**Inline 11 single-caller workflows** (67% reduction):

| Phase | Files to inline | Into |
|-------|----------------|------|
| Phase 1 | `wfr-github-find-pr-from-pull-request.yml` | ci-automerge |
| Phase 1 | `wfr-github-find-pr-in-check-suite.yml` | ci-automerge |
| Phase 1 | `wfr-github-merge-pr.yml` | ci-automerge |
| Phase 1 | `wfr-github-label-issue.yml` | ci-automerge |
| Phase 2 | `wfr-github-publish-web.yml` | publish-web |
| Phase 2 | `wfr-github-stats-to-aws.yml` | publish-stats |
| Phase 2 | `wfr-github-stats-json.yml` | publish-stats |
| Phase 3 | `wfr-npm-publish.yml` | publish-packages |
| Phase 3 | `wfr-mvn-publish.yml` | publish-packages |
| Phase 3 | `wfr-npm-update.yml` | ci-update |
| Phase 3 | `wfr-mvn-update.yml` | ci-update |

**Important:** repository0 has its own `ci-automerge.yml` that calls the same wfr-* files from agentic-lib. Inlining in agentic-lib means either:
- A: Inline in both repos simultaneously
- B: Create composite actions that both repos share
- C: Keep the wfr-* files but only for cross-repo use

**Decision needed:** Which approach for Phase 1? (Post-merge task)

## Step 2: Identify dead code paths

- Grep for any JS files, scripts, or configs that reference deleted workflows
- Check for unused agent prompt files
- Check for unused seed files
- Remove anything that has no caller

## Step 3: Consolidate redundant workflows

Look for workflows that do nearly the same thing and could be merged:
- `utils-truncate-workflow-history.yml` + `utils-truncate-issue-history.yml` — can these be one workflow?
- `ci-deploy.yml` — is this still used or superseded by publish-* workflows?

## Step 4: Minimize contributor surface area

Document which files a contributor needs to understand:
- `agentic-step/` action (6 files)
- `.github/agentic-lib/agents/` prompts (~10 files)
- `.github/workflows/` (~15 remaining workflows)
- `FEATURES.md` (single planning doc)

Aim: a contributor can understand the project by reading fewer than 30 files.

---

## BYOK Implementation (Related)

Copilot confirmed the SDK supports per-task BYOK via `SessionConfig.provider`:

```javascript
// In any task handler — add provider if BYOK is configured
if (providerType && providerBaseUrl) {
  sessionConfig.provider = {
    type: providerType,     // "openai" | "azure" | "anthropic"
    baseUrl: providerBaseUrl,
    apiKey: providerApiKey,
  };
}
```

Configured via workflow inputs and GitHub Actions secrets. Allows different models per task (e.g. discussions uses ChatGPT, evolve uses Copilot).

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Feature #27 definition
- **[CLAUDE_AND_COPILOT.md](CLAUDE_AND_COPILOT.md)** — Verified BYOK findings and code reduction consensus
