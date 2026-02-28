# PLAN: Uplift

Technical debt reduction, dependency upgrades, and pattern consolidation across `src/`.

This plan was produced by reviewing every file in `src/` against these questions:
1. Are there libraries or richer language features that could make this smaller and more elegant?
2. Are there recurring patterns that would benefit from abstraction into a library?
3. Where we use libraries, are we on LTS and is there an upgrade path?
4. Can we upgrade the underlying tech to latest LTS?
5. Are there similar competing solutions we can replace with a single thing?
6. Organised into a sequential implementation plan.

---

## File-by-File Review

### A. Actions — `src/actions/agentic-step/`

#### `action.yml` (57 lines)
1. **Language/library uplift:** `runs.using: 'node20'` but `engines` requires `>=22`. Mismatch — should be `node22` once GitHub supports it (currently `node20` is the latest `runs.using` value).
2. **Recurring patterns:** None — this is the action manifest.
3. **LTS/upgrade:** GitHub Actions `node20` runner is current ceiling. Watch for `node22` support.
4. **Tech upgrade:** No change needed until GitHub adds `node22` runtime.

#### `index.js` (116 lines)
1. **Elegance:** Clean dispatcher pattern. Could use a dynamic `import()` to avoid 8 static imports but the explicitness is fine.
2. **Recurring patterns:** The `context` object assembly (lines 69-82) is the single point that feeds all handlers — good.
3. **LTS/upgrade:** `@actions/core@1.11.1` → **3.0.0 available** (major). `@actions/github@6.0.1` → **9.0.0 available** (major).
4. **Tech upgrade:** Both `@actions/*` packages have major upgrades. Review changelogs before bumping.

#### `config-loader.js` (105 lines)
1. **Elegance:** The `if/else if/else if` chain (lines 52-71) parsing path configs could use a discriminated pattern, but it's clear enough.
2. **Recurring patterns:** `js-yaml` is the only YAML parser. Workflows also use `yq` on the shell side — two YAML parsers in the system.
3. **LTS/upgrade:** `js-yaml@4.1.1` is latest and stable.
4. **Tech upgrade:** No change needed.

#### `logging.js` (86 lines)
1. **Elegance:** Hand-assembled markdown strings. Could use a template literal or markdown builder, but the file is small.
2. **Recurring patterns:** ISO date formatting, markdown assembly — appears in task handlers too.
3. **LTS/upgrade:** No external deps beyond `@actions/core`.
4. **Tech upgrade:** No change needed.

#### `safety.js` (105 lines)
1. **Elegance:** Clean, focused module. `isPathWritable` could use `path.resolve()` for normalisation but it's intentionally simple.
2. **Recurring patterns:** `logSafetyCheck()` is called from here and logging.js — good separation.
3. **LTS/upgrade:** No external deps beyond `@actions/core`.
4. **Tech upgrade:** No change needed.

#### `tools.js` (133 lines)
1. **Elegance:** Good. `execSync` with timeout is appropriate. Could add `stdin: 'ignore'` for safety.
2. **Recurring patterns:** `resolve()` + `existsSync()` + error wrapping appears in all 4 tool handlers.
3. **LTS/upgrade:** `@github/copilot-sdk@0.1.29` — pre-1.0, likely to have breaking changes. Pin exact version (already done).
4. **Tech upgrade:** Monitor copilot-sdk for 1.0 release.

#### `vitest.config.js` (8 lines)
1. **Elegance:** Minimal, correct.
2. **Recurring patterns:** None.
3. **LTS/upgrade:** `vitest@3.2.4` → **4.0.18 available** (major).
4. **Tech upgrade:** Vitest 4.x is a major bump. Evaluate migration.

#### `package.json` (28 lines)
1. **Elegance:** Clean. `"build": "echo 'No build step required'"` is honest.
2. **Recurring patterns:** N/A.
3. **LTS/upgrade:** See dependency table below.
4. **Tech upgrade:** `engines.node >= 22` is correct for LTS.

#### Task handlers — `tasks/*.js` (8 files, 1163 lines total)

All 8 handlers share a **nearly identical pattern** (the core finding of this review):

```
1. Validate required inputs
2. Safety checks (issue state, attempt limits, WIP limits)
3. Read context files (mission, features, sources, contributing, etc.)
4. Build a markdown prompt string from arrays of sections
5. new CopilotClient({ githubToken }) → client.createSession({ model, systemMessage, tools, onPermissionRequest: approveAll }) → session.sendAndWait({ prompt })
6. Parse response, extract tokens
7. client.stop() in finally block
8. Return { outcome, tokensUsed, model, details }
```

| Handler | Lines | SDK sessions | Unique logic |
|---------|-------|-------------|--------------|
| resolve-issue | 132 | 1 | Safety checks (resolved, attempts, WIP) |
| fix-code | 104 | 1 | Fetch failing check runs |
| evolve | 257 | 1 (or 3 in TDD) | TDD two-phase, source file scan |
| maintain-features | 119 | 1 | Feature limit enforcement |
| maintain-library | 95 | 1 | SOURCES.md reading |
| enhance-issue | 137 | 1 | Issue body update + label |
| review-issue | 154 | 1 | RESOLVED/OPEN verdict parsing |
| discussions | 165 | 1 | GraphQL discussion fetch, action tag parsing |

**Findings:**
1. **~60% of each handler is boilerplate** (context reading, prompt assembly, SDK session lifecycle, error handling). Only ~40% is unique task logic.
2. **Prompt assembly** uses the same pattern: `['## Section', content, '', '## File Paths', ...writablePaths.map(...), '## Constraints', ...].join('\n')`. This repeats 8 times with minor variations.
3. **SDK lifecycle** (`new CopilotClient` → `createSession` → `sendAndWait` → `stop`) repeats in every handler. A shared `runCopilotTask(options)` function would eliminate ~25 lines per handler.
4. **Context reading** (mission, features, contributing, source files) repeats across evolve, maintain-features, maintain-library, enhance-issue, review-issue. A shared `readProjectContext(config)` function would serve them all.
5. **File scanning** pattern (`readdirSync(path).filter(f => f.endsWith('.md')).map(f => { try { return readFileSync(...) } catch { return '' } })`) appears 6 times verbatim.

---

### B. Workflows — `src/workflows/` (13 files, 2581 lines)

#### Bloated workflows

| Workflow | Lines | Issue |
|----------|-------|-------|
| `ci-automerge.yml` | 618 | Largest file in src/. Complex multi-trigger merge logic. Contains AWS IAM ARNs, S3 buckets, CHATGPT_API_SECRET_KEY (legacy). |
| `publish-packages.yml` | 485 | Contains full Maven/CDK/Java publishing pipeline (jobs: `mvn-package-cdk-synth`, `publish-mvn`). Dead weight for JS templates. |
| `ci-update.yml` | 323 | Already stripped of Maven in Tasks 1-4, but still 323 lines. |
| `ci-formating.yml` | 246 | Contains AWS IAM ARNs, S3 buckets, CHATGPT_API_SECRET_KEY (legacy). |
| `agent-archive-intentïon.yml` | 214 | Complex branch archival logic. |

#### Legacy contamination across workflows

These env vars appear in 4 workflows but are **never used** by the workflow logic (they were inherited from a shared env block):

| Env var | Workflows | Status |
|---------|-----------|--------|
| `s3BucketUrl` | ci-automerge, ci-formating, publish-packages | **Dead** — no step references it |
| `s3WebsiteBucketUrl` | (same) | **Dead** |
| `iamActionsRoleArn` | (same) | **Dead** |
| `iamStatsBucketWriterRoleArn` | (same) | **Dead** |
| `iamPublicWebsiteStatsBucketWriterRoleArn` | (same) | **Dead** |
| `CHATGPT_API_SECRET_KEY` | ci-automerge, ci-formating, ci-update | **Legacy** — ChatGPT replaced by Copilot SDK |

#### Remaining sandbox/ references

| File | Reference | Fix |
|------|-----------|-----|
| `agent-flow-evolve.yml:58-59` | `writable-paths: 'sandbox/source/;sandbox/tests/;...'` | Should read from config |
| `agent-flow-maintain.yml:60` | `writable-paths: 'sandbox/features/'` | Should read from config |
| `agent-flow-maintain.yml:98` | `writable-paths: 'sandbox/library/;sandbox/SOURCES.md'` | Should read from config |

#### Remaining Maven/Java/CDK references

| File | What | Fix |
|------|------|-----|
| `publish-packages.yml:88-163` | `mvn-package-cdk-synth` job | Delete (same as ci-deploy) |
| `publish-packages.yml:295+` | `publish-mvn` job | Delete |
| `clean.sh:23` | `docker system prune` | Remove Docker/Maven/CDK block |
| `clean.sh:27-31` | pom.xml check, `mvn clean` | Remove |

#### Repeated workflow patterns

1. **npmrc setup** (7 lines) repeats in: ci-automerge, ci-formating, ci-test, ci-update, publish-packages, publish-web, agent-discussions-bot, agent-flow-evolve, agent-flow-fix-code, agent-flow-maintain, agent-flow-review. Could become a reusable composite action.
2. **Config loading via yq** repeats in: ci-automerge, ci-formating, ci-update, agent-archive-intentïon, publish-web. Same 3-line pattern each time.
3. **Conditional commit pattern** (`git diff --cached --quiet || git commit ...`) repeats in 6 agent workflows.
4. **check-branch guard** (prevent concurrent update branches) repeats in ci-update, ci-formating.

---

### C. Scripts — `src/scripts/` (7 files, 364 lines)

#### `clean.sh` (32 lines)
1. **Docker/Maven/CDK block** (lines 23-31) is dead code for a JS template system.
2. Otherwise fine — standard cleanup.

#### `md-to-html.js` (76 lines)
1. **`markdown-it`** is the right choice. `markdown-it-github` plugins add GFM support.
2. Header contains hardcoded `https://github.com/xn-intenton-z2a/agentic-lib` links and stats URLs — should be parameterised or removed for template consumers.

#### `generate-library-index.js` (136 lines)
1. Uses `execSync('ls -lath')` to generate file listings — could use `fs.statSync` instead for portability.
2. Generates inline HTML with hardcoded styles. Fine for its purpose.

#### `initialise.sh` (37 lines)
1. Fixed in Tasks 1-4 (paths now use `.github/agentic-lib/seeds/`).
2. `shuf` may not be available on all platforms — could use `$RANDOM` fallback.

#### Other scripts
- `accept-release.sh`, `activate-schedule.sh`, `update.sh` — small, focused, no issues.

---

### D. Seeds — `src/seeds/` (7 files)

#### `zero-package.json` (60 lines)
1. **`"main": "sandbox/source/main.js"`** — stale `sandbox/` reference. Should be `src/lib/main.js`.
2. **`"sandbox": "node sandbox/source/main.js"`** — same, stale script.
3. **`"engines": { "node": ">=20.0.0" }`** — should be `>=22.0.0` (Copilot SDK requires node:sqlite).
4. **Dependencies include**: express, zod, dotenv, aws-cdk, figlet, supertest — heavy for a seed template. Consider stripping to minimal.
5. **`"version": "6.9.1-0"`** — should reset to `0.1.0` or similar for new repos.

#### `zero-main.js` (14 lines), `zero-main.test.js` (10 lines)
1. Both reference `sandbox/source/main.js` in comments and imports (`@sandbox/source/main.js`).
2. Should use the new path convention (`src/lib/main.js`, `@src/lib/main.js` or relative).

#### `test-demo.yml`, `test-library.yml`, `test-website.yml`
1. Clean, appropriate for their purpose.
2. `test-library.yml` and `test-website.yml` duplicate the npmrc setup pattern (candidate for composite action).

---

### E. Agents — `src/agents/` (9 files)

#### `agentic-lib.yml` (72 lines)
1. Fixed in Tasks 1-4. Clean.

#### Agent prompt files (`agent-*.md`, 8 files)
1. Well-written, focused on mission alignment and high-impact changes.
2. `agent-maintain-sources.md` describes maintaining SOURCES.md but `librarySourcesFilepath` now has `permissions: []` and `limit: 0` — effectively disabled. Orphaned prompt?
3. No library/tech concerns — these are pure markdown prompts.

---

## Dependency Upgrade Summary

### agentic-step (action) dependencies

| Package | Current | Latest | Upgrade type | Risk | Recommendation |
|---------|---------|--------|-------------|------|----------------|
| `@actions/core` | 1.11.1 | 3.0.0 | Major | Medium — breaking API changes | Upgrade (Step 2) |
| `@actions/github` | 6.0.1 | 9.0.0 | Major | Medium — Octokit v4→v5 | Upgrade (Step 2) |
| `@github/copilot-sdk` | 0.1.29 | 0.1.29 | Current | Pre-1.0 | Pin; monitor for updates |
| `js-yaml` | 4.1.1 | 4.1.1 | Current | None | No action |
| `vitest` | 3.2.4 | 4.0.18 | Major | Low — test framework | Upgrade (Step 2) |

### Root (agentic-lib) devDependencies

| Package | Current | Latest | Recommendation |
|---------|---------|--------|----------------|
| `eslint` | 9.27.0 | 10.0.2 | Evaluate ESLint 10 migration |
| `eslint-config-prettier` | 8.10.0 | 10.1.8 | Upgrade with ESLint |
| `eslint-plugin-security` | 3.0.1 | 4.0.0 | Upgrade |
| `eslint-plugin-sonarjs` | 3.0.2 | 4.0.0 | Upgrade |
| `npm-check-updates` | 18.0.1 | 19.6.3 | Upgrade |
| `prettier` | 3.5.3 | 3.8.1 | Upgrade (minor) |

---

## Question 5: Competing Solutions to Consolidate

| Duplicate | Where | Consolidation |
|-----------|-------|---------------|
| **YAML parsing**: `js-yaml` (JS) vs `yq` (shell) | config-loader.js vs 5 workflows | Prefer `js-yaml` in code; keep `yq` only in pure-shell workflow steps |
| **npmrc setup**: 7-line block repeated 11 times | 11 workflow files | Extract to composite action `setup-npmrc` |
| **Config loading via yq**: 3-line block repeated 5 times | 5 workflow files | Extract to composite action `load-config` |
| **Conditional commit**: `git diff --cached --quiet \|\| ...` | 6 agent workflows | Extract to composite action `commit-if-changed` |
| **Copilot SDK lifecycle**: new → createSession → sendAndWait → stop | 8 task handlers (10 sessions total) | Extract to `runCopilotTask()` shared function |
| **Context reading**: mission + features + sources + contributing | 5 task handlers | Extract to `readProjectContext(config)` function |
| **File scanning**: `readdirSync().filter().map(readFileSync)` | 6 task handlers | Extract to `scanDirectory(path, ext, limit)` utility |
| **Prompt assembly**: `['## Section', ...].join('\n')` | 8 task handlers | Extract to `buildPrompt(sections)` builder |
| **Maven/Java/CDK blocks** | publish-packages, clean.sh | Delete entirely |
| **AWS env vars** (s3, IAM ARNs) | 4 workflows | Delete (unused) |
| **CHATGPT_API_SECRET_KEY** | 3 workflows | Delete (legacy) |
| **HTML generation**: md-to-html.js + generate-library-index.js | 2 scripts | Could merge but they serve different purposes; keep separate |

---

## Sequential Implementation Plan

### Step 1: Delete dead code (low risk, immediate)

**Files:** `publish-packages.yml`, `ci-automerge.yml`, `ci-formating.yml`, `ci-update.yml`, `clean.sh`

- [ ] Remove Maven/CDK/Java jobs from `publish-packages.yml` (`mvn-package-cdk-synth`, `publish-mvn` jobs and their deps)
- [ ] Remove dead AWS env vars (`s3BucketUrl`, `iamActionsRoleArn`, etc.) from all 4 workflows
- [ ] Remove `CHATGPT_API_SECRET_KEY` secret references from ci-automerge, ci-formating, ci-update
- [ ] Remove Docker/Maven/CDK block from `clean.sh`
- [ ] Remove hardcoded agentic-lib URLs from `md-to-html.js` header

**Verification:** `npm test` passes, `git grep 'CHATGPT_API' src/` returns nothing, `git grep '541134664601' src/` returns nothing.

### Step 2: Dependency upgrades (medium risk)

**Files:** `src/actions/agentic-step/package.json`, root `package.json`

- [ ] Upgrade `@actions/core` 1.x → 3.x — review breaking changes, update API calls
- [ ] Upgrade `@actions/github` 6.x → 9.x — review Octokit changes, update API calls
- [ ] Upgrade `vitest` 3.x → 4.x — run tests, fix any breaks
- [ ] Upgrade root devDeps: eslint-plugin-security 4.x, eslint-plugin-sonarjs 4.x, prettier 3.8.x, npm-check-updates 19.x
- [ ] Evaluate ESLint 10 migration (may require eslint.config.js changes)

**Verification:** `npm test` passes (46 tests), `npm run linting` passes.

### Step 3: Fix seed files (low risk)

**Files:** `src/seeds/zero-package.json`, `src/seeds/zero-main.js`, `src/seeds/zero-main.test.js`

- [ ] Update `zero-package.json`: `main` → `src/lib/main.js`, remove `sandbox` script, `engines.node` → `>=22.0.0`, strip heavy deps (aws-cdk, supertest, figlet), reset version to `0.1.0`
- [ ] Update `zero-main.js`: remove `sandbox/source/main.js` comment
- [ ] Update `zero-main.test.js`: change import from `@sandbox/source/main.js` to relative path or `src/lib/main.js`

**Verification:** Dry-run `initialise.sh` against a temp dir; `npm install` and `npm test` pass in the seeded repo.

### Step 4: Fix remaining sandbox/ in workflows (low risk)

**Files:** `agent-flow-evolve.yml`, `agent-flow-maintain.yml`

- [ ] Replace hardcoded `writable-paths: 'sandbox/...'` with config-driven values (read from agentic-lib.yml via yq, same pattern as ci-update uses)
- [ ] Verify no remaining `sandbox/` refs: `git grep 'sandbox/' src/ | grep -v src/seeds` returns nothing

**Verification:** YAML lint passes, workflows are syntactically valid.

### Step 5: Extract shared task handler utilities (medium risk, highest impact)

**Files:** New file `src/actions/agentic-step/copilot.js`, edits to all 8 task handlers

- [ ] Create `copilot.js` exporting:
  - `runCopilotTask({ model, systemMessage, prompt, tools, writablePaths })` — encapsulates CopilotClient lifecycle
  - `readProjectContext(config)` — reads mission, features, contributing, source files, tests
  - `scanDirectory(dirPath, extension, limit)` — reusable file scanner
  - `buildPromptSections(sections)` — assembles prompt from section objects
- [ ] Refactor each task handler to use these utilities
- [ ] Target: each handler reduces to ~40-60 lines (from 95-257)
- [ ] Add unit tests for the new utilities

**Verification:** `npm test` passes (46 existing + new utility tests), handlers produce identical prompt structures.

### Step 6: Extract workflow composite actions (medium risk)

**Files:** New actions under `src/actions/`, edits to 11+ workflows

- [ ] Create `src/actions/setup-npmrc/action.yml` — composite action for npmrc setup/teardown
- [ ] Create `src/actions/commit-if-changed/action.yml` — composite action for conditional commit + push
- [ ] Refactor workflows to use these composites
- [ ] Evaluate: `load-config` composite (yq-based config extraction) — may be overkill for 3 lines

**Verification:** Workflows remain syntactically valid, dry-run with `act` if available.

### Step 7: Slim down ci-automerge.yml (high impact, medium risk)

**File:** `src/workflows/ci-automerge.yml` (618 lines)

This is the largest file and the most complex. After Steps 1 and 6:
- [ ] Remove dead env vars (Step 1 already)
- [ ] Use composite actions for npmrc and conditional commit (Step 6)
- [ ] Evaluate splitting multi-trigger logic into separate workflows (PR-triggered vs schedule-triggered)
- [ ] Target: <300 lines

**Verification:** Automerge still works for labeled PRs.

### Step 8: Review orphaned agent prompts (low risk)

**Files:** `src/agents/agent-maintain-sources.md`

- [ ] `librarySourcesFilepath` has `permissions: []` and `limit: 0` in config — effectively disabled
- [ ] Either re-enable the sources path in config or archive `agent-maintain-sources.md`
- [ ] Verify all agent prompts have corresponding task handlers and workflow triggers

**Verification:** No orphaned prompts remain.

---

## Summary

| Step | Risk | Impact | Lines saved (est.) | Blocking |
|------|------|--------|-------------------|----------|
| 1. Delete dead code | Low | High | ~200 | None |
| 2. Dependency upgrades | Medium | Medium | 0 (quality) | None |
| 3. Fix seed files | Low | Medium | ~10 | None |
| 4. Fix sandbox/ in workflows | Low | Low | ~5 | None |
| 5. Extract task utilities | Medium | **Highest** | ~400 | None |
| 6. Extract workflow composites | Medium | High | ~200 | Step 1 |
| 7. Slim ci-automerge | Medium | High | ~200 | Steps 1, 6 |
| 8. Review orphaned prompts | Low | Low | ~25 | None |

**Total estimated reduction:** ~1,040 lines from ~4,660 lines in `src/` (22% reduction) plus significant DRY improvement and maintainability gains.

Steps 1-4 can be done independently and in any order. Step 5 is the highest-value change. Steps 6-7 depend on Step 1. Step 8 is independent.
