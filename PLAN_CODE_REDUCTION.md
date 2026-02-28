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

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Feature #27 definition
