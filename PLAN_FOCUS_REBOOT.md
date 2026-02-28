# PLAN: Focus Reboot

Get all the moving parts working end-to-end before tightening verification and expanding demo output. This plan supersedes PLAN_STABILISE_AND_DEPLOY.md, PLAN_CODE_REDUCTION.md, and PLAN_UPLIFT.md (all archived — core work complete).

Current repo structure (post-uplift):
```text
agentic-lib/
├── src/                              # ALL DISTRIBUTED PRODUCTION CODE
│   ├── workflows/ (13)               #   Template workflows
│   │   ├── agent-archive-intentïon.yml
│   │   ├── agent-discussions-bot.yml
│   │   ├── agent-flow-evolve.yml     # Core: autonomous evolution
│   │   ├── agent-flow-fix-code.yml   # Core: reactive fix
│   │   ├── agent-flow-maintain.yml   # Core: maintenance
│   │   ├── agent-flow-review.yml     # Core: review & pruning
│   │   ├── agent-supervisor.yml      # Core: orchestration
│   │   ├── ci-automerge.yml          # Core CI: auto-merge PRs (550 lines)
│   │   ├── ci-formating.yml          # Prescriptive: prettier+eslint
│   │   ├── ci-test.yml               # Prescriptive: monolithic test
│   │   ├── ci-update.yml             # Prescriptive: dependency updates
│   │   ├── publish-packages.yml      # Core: npm publish (Maven/CDK removed)
│   │   └── publish-web.yml           # Prescriptive: GitHub Pages
│   ├── scripts/ (7)                  #   Distributed utility scripts
│   ├── agents/ (8)                   #   7 prompts + 1 config (agent-maintain-sources.md removed)
│   ├── actions/                      #   Composite actions + Copilot SDK action
│   │   ├── agentic-step/             #     Copilot SDK action (57 tests)
│   │   │   ├── copilot.js            #       Shared SDK utilities (new)
│   │   │   ├── tasks/ (8 handlers)   #       845 lines (was 1163, -318)
│   │   │   └── tests/ (5 files)      #       Including copilot.test.js (new)
│   │   ├── setup-npmrc/              #     Composite: npmrc setup (new)
│   │   └── commit-if-changed/        #     Composite: conditional commit (new)
│   └── seeds/ (7)                    #   Seed files + 3 starter test workflows
├── scripts/ (5)                      # RELEASE PIPELINE (agentic-lib only)
├── .github/workflows/ (2)            # INTERNAL CI
│   ├── ci.yml
│   └── release.yml
├── FEATURES.md, FEATURES_ROADMAP.md  # Product definition
├── PLAN_FOCUS_REBOOT.md              # Active plan
├── API.md, README.md                 # Docs
└── package.json, eslint.config.js    # Config
```

## User Assertions

- Get all moving parts working before tightening verification or expanding demos
- This plan touches all 3 repos and takes priority over other PLAN_*.md files
- PLAN_VERIFICATION.md, PLAN_LAUNCH.md, PLAN_DEMO_REPOS.md remain but are deferred
- Numbered version tags (not `@main`) for workflow references
- Publication is a deliberate choice (workflow dispatch), not automatic on every merge
- Template users get a stable version that doesn't disappear; they bump when ready

---

## Key Decisions

### Versioning Strategy

**Decision: Numbered semver tags (`v7.0.0`, `v7.1.0`, etc.)**

- agentic-lib publishes stable versions via a manually-dispatched `publish-packages` workflow
- Each release creates a git tag (e.g. `v7.0.0`) and publishes to npm
- repository0 and descendants pin to a specific tag (e.g. `@7.0.0` in workflow `uses:` refs)
- Updating is a deliberate choice: bump the version pin across the consumer repo
- Tags are immutable — once published, a version never changes
- The `reboot` branch will ship as `v7.0.0` — a clean break from the `v6.10.x` series

### Copilot SDK Runtime Status

Two risks from the stabilisation work remain **unverified**:

**Risk #12 — Copilot CLI availability on runners:**
The `@github/copilot-sdk@0.1.29` is consumed as an npm library via `CopilotClient`. No workflow step installs a `copilot` CLI binary. If the SDK internally spawns a `copilot` subprocess, it would fail silently on standard runners. The `copilot-setup-steps.yml` file is for Copilot's own coding agent sandbox — it does **not** set up the SDK runtime. Issue #1760 was assigned to Copilot but unanswered.

**Risk #13 — Model availability via SDK:**
The action defaults to model `claude-sonnet-4-5`. Whether this model name is valid through the Copilot SDK, and what rate limits apply, is unknown. The SDK authenticates with `GITHUB_TOKEN` (not an Anthropic API key), so model access depends on what GitHub's Copilot infrastructure exposes.

**Resolution approach:** Phase 0 directly tests both risks by dispatching a real workflow run.

---

## Goals

### Goal 1: Website presents live content from repository0

**xn--intenton-z2a.com** shows:
- The ongoing intentïon log from repository0 (`intentïon.md`)
- The discussions thread from repository0

There should be **one canonical discussions thread** (the General thread) in repository0. Clear out stale/duplicate threads so there is a single clean thread. It should be possible to **comment from xn--intenton-z2a.com** into that discussions thread and have the bot in repository0 answer.

**Deliverables:**
- [ ] Consolidate to 1 General discussion thread in repository0 (close/archive others)
- [ ] Website fetches and renders intentïon.md content from repository0
- [ ] Website fetches and renders discussion comments from the single thread
- [ ] Website submission form posts comments to the discussions thread (via GitHub API)
- [ ] Discussions bot in repository0 responds to comments posted from the website

### Goal 2: repository0 is a multi-style template

repository0 is a repository template that can spawn new repositories in one of 3 styles:
- **library** — a publishable npm package evolved from a MISSION.md
- **website** — a deployable site evolved from a MISSION.md
- **demo** (default) — the repository0 default state where only a single JS source file and test are mutated

**Deliverables:**
- [ ] Seed files for each style (library, website, demo) in `.github/agentic-lib/seeds/`
- [ ] Style selection mechanism (MISSION.md convention or config flag)
- [ ] Each style has appropriate: package.json, test setup, CI workflows, deploy target
- [ ] Document the 3 styles in GETTING-STARTED.md

### Goal 3: repository0 is reduced to coarse-grained adaptors

As much as possible, repository0 workflows are **thin adaptors** that delegate to:
- Standard `gh` tools (including Copilot SDK and `github-script`)
- Libraries/workflows exposed by agentic-lib

The pattern: `delegateMassiveWork(lots, of, parameters)` — no/minimal control flow, just what cannot be delegated. The intelligence lives in agentic-lib, not in repository0.

**Deliverables:**
- [ ] Audit repository0 workflows — identify inline logic that should move to agentic-lib
- [ ] Extract shared logic into agentic-lib reusable workflows or actions
- [ ] repository0 workflows become thin callers with parameter pass-through
- [ ] Measure: each repository0 workflow should be <50 lines (excluding comments/headers)

### Goal 4: agentic-lib exposes tools via unauthenticated npm package

agentic-lib exposes useful tools so that repository0 (or its templated descendants) can:
- `import` from `@xn-intenton-z2a/agentic-lib/some-module` via the published npm package
- The imported tools can be **aware of the caller's GitHub auth status** so they can interact with GitHub resources on that user's behalf (token passed at call time, not baked in)

**Deliverables:**
- [ ] Define the public API surface: what modules does agentic-lib export?
- [ ] Package exports configured in package.json (`exports` field)
- [ ] Tools accept a `githubToken` parameter for authenticated operations
- [ ] Version-controlled: consumers pin to a version, not `@main`
- [ ] Document the API in API.md

### Goal 5: Testable code evolution inside agentic-lib

All code evolution logic and transitions can be tested inside the agentic-lib repository using fast, traditional test mechanisms (vitest). This means abstracting logic out of GitHub Actions so it can be unit-tested without running workflows.

**Deliverables:**
- [x] Extract shared SDK lifecycle into `copilot.js` (`runCopilotTask`, `readOptionalFile`, `scanDirectory`, `formatPathsSection`)
- [x] Unit tests for shared utilities (11 tests in `copilot.test.js`)
- [x] CI runs the full test suite on every push (57 tests, all passing)
- [ ] Each task handler has unit tests that run without GitHub Actions context
- [ ] Discussions bot library extracted into testable module with its own tests
- [ ] Integration test harness that exercises workflows via `act` or GitHub API

### Goal 6: Clean distribution method for workflows

A clean mechanism to publish updated and tested workflows from agentic-lib to repository0 and named descendants.

**Deliverables:**
- [ ] Tag-based versioning: `publish-packages` workflow dispatch creates a git tag + npm publish
- [ ] repository0 pins to exact tag (e.g. `@7.0.0`) — no `@main` references
- [ ] Script or workflow to bump version pins across descendant repos
- [ ] Release process documented: test → tag → publish → bump consumers
- [ ] Test that workflow references resolve correctly after a release

### Goal 7: Test suite in repository0 that validates workflows

A test suite in repository0 that confirms the workflows are working and generates demo output as evidence.

**Deliverables:**
- [ ] Workflow smoke tests: dispatch key workflows and verify they complete
- [ ] Demo output generation: each test run produces an artifact (log, diff, or screenshot)
- [ ] Test results surfaced in CI (check annotations or summary)
- [ ] At minimum: test evolve, test discussions bot, test CI pipeline

### Goal 8: Supporting libraries and tests for the discussions bot

The discussions bot logic in agentic-lib should have its own library code and test suite, independent of the GitHub Actions wrapper.

**Deliverables:**
- [ ] Extract discussions bot logic from `tasks/discussions.js` into a testable library
- [ ] Unit tests for: parsing discussion content, generating responses, action directives
- [ ] Mock GitHub GraphQL responses for test isolation
- [ ] Test coverage for edge cases: empty discussions, malformed input, rate limits

### Goal 9: repository0 tests for discussions bot wiring

Tests in repository0 that verify the discussions bot is wired up to the discussions thread and can manipulate code.

**Deliverables:**
- [ ] Integration test: post a comment → bot responds → verify response
- [ ] Integration test: request a feature → bot creates feature file → verify file exists
- [ ] Integration test: bot-created feature → evolve workflow picks it up → code changes
- [ ] These tests can run as a workflow or via `gh` CLI scripting

### Goal 10: Playwright behaviour tests for the website

Behaviour tests in xn--intenton-z2a.com that test the full feature set of the deployed website. Multiple Playwright tests can run concurrently in a workflow.

**Deliverables:**
- [ ] Playwright test suite covering: index page, showcase page, submission form, navigation
- [ ] Tests run against the deployed website URL (not local)
- [ ] Concurrent execution in CI workflow (Playwright sharding)
- [ ] Test: submission form posts to GitHub Discussions and bot responds
- [ ] Test: showcase page loads experiment data from S3
- [ ] Test: intentïon log renders content from repository0

---

## Phases

### Phase 0: Smoke Test the Copilot SDK (risks #12, #13)

**Goal:** Confirm the Copilot SDK actually works at runtime on GitHub Actions runners.

**Work:**
- Manually dispatch `agent-flow-evolve` in repository0 (against main)
- Watch the workflow: does `npm ci` install the SDK? Does `CopilotClient` connect? Does the model respond?
- If it fails: diagnose whether the issue is CLI availability (#12), model access (#13), or auth
- If the SDK doesn't work: fall back to `github-script` or direct API calls and adjust the plan

**Verification gate:**
- [ ] `agent-flow-evolve` workflow completes without SDK errors
- [ ] A code change is committed by the evolve step (or a clear error message explains why not)
- [x] Document the findings — update this plan with the SDK status

**Phase 0 Findings (2026-02-28):**

1. **SDK installs successfully** — `npm ci` resolves `@github/copilot-sdk@0.1.29` without error
2. **Runtime failure: `node:sqlite` not available on Node 20** — The SDK requires `node:sqlite` (Node 22.5+). Error: `ERR_UNKNOWN_BUILTIN_MODULE: No such built-in module: node:sqlite`
3. **Risk #12 (CLI availability):** NOT hit. The SDK loads as a library, no CLI binary needed.
4. **Risk #13 (Model availability):** NOT yet tested — the SDK crashes before reaching model negotiation.
5. **Fix applied:** All workflow `node-version` bumped from 20 to 22 on `reboot` branch. Needs re-test.
6. **Remaining unknowns:** Does the model `claude-sonnet-4.5` work via Copilot SDK auth? Does GITHUB_TOKEN grant access? Re-test after Node fix.

**User direction (2026-02-28):** Fast iteration in agentic-lib only. repository0 is a showcase (not a test bed), website is a display. Focus on tested workflows in agentic-lib with versioned distribution.

### Repo Restructure (2026-02-28)

**Problem:** agentic-lib had a circular dependency — the CI workflows that build/test/release it were the SAME files as the workflow templates distributed to consumers. Plus, sandbox/src/tests/unit were "eating our own dog food" testing infrastructure that added complexity without testing the actual product.

**Solution:** Clean separation into production code (`src/`), release tooling (`scripts/`), and internal CI (`.github/workflows/`).

**Key design property:** If template workflows break, `ci.yml` still runs and you can merge fixes.

### Technical Uplift (complete — PLAN_UPLIFT.md archived)

A systematic file-by-file review of `src/` delivered 8 steps of technical debt reduction:

| Step | What | Impact |
|------|------|--------|
| 1. Dead code removal | Maven/CDK/Java jobs, AWS env vars, CHATGPT_API_SECRET_KEY, Docker blocks | -219 lines |
| 2. Dependency upgrades | @actions/core 3.x, @actions/github 9.x, vitest 4.x, root devDeps | Quality |
| 3. Seed file fixes | sandbox/ → src/lib/, engines >=22, stripped heavy deps, version reset | Correctness |
| 4. Config-driven paths | Replaced hardcoded sandbox/ writable-paths with yq config reads | Correctness |
| 5. Shared utilities | `copilot.js`: runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection | -318 lines, +11 tests |
| 6. Composite actions | `setup-npmrc`, `commit-if-changed` — used by 8 workflows | DRY |
| 7. ci-automerge cleanup | Removed 7 echo-event jobs, unused env, commented triggers | -62 lines (618→550) |
| 8. Orphaned prompts | Removed `agent-maintain-sources.md` (disabled in config) | -22 lines |

**Post-uplift metrics:**
- Workflows: 13 files, 2,222 lines (was 14 files, ~2,800 lines)
- Task handlers: 845 lines (was 1,163)
- Test suite: 57 tests (was 46)
- Dependencies: all on latest major except ESLint 10 (deferred — eslint-config-google compatibility)
- No remaining sandbox/ refs, no Maven/CDK/Java, no AWS env vars, no CHATGPT_API references

---

### Phase 1: Testable Core (Goals 5 + 8)

**Repos:** agentic-lib

**Status: Partially complete** — shared utilities extracted and tested; per-handler tests and discussions library still needed.

**Done:**
- [x] Extracted shared SDK lifecycle into `copilot.js` (runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection)
- [x] 11 new utility tests in `copilot.test.js`
- [x] All 8 task handlers refactored to use shared utilities (-318 lines)
- [x] Total test suite: 57 tests passing

**Remaining:**
- [ ] Unit tests for each task handler (mocking copilot.js, testing handler-specific logic)
- [ ] Extract discussions bot logic from `tasks/discussions.js` (136 lines) into testable library
- [ ] Unit tests for discussions library: parse, respond, action-directive generation
- [ ] Mock GitHub GraphQL responses for test isolation
- [ ] Test coverage reporting in CI

**Verification gate:**
- [x] `npm test` runs all tests and passes (57 tests)
- [ ] Each task handler has at least 1 unit test
- [ ] Discussions bot library has tests for parse, respond, and action-directive generation
- [ ] Test coverage reported in CI

---

### Phase 2: API Surface + Distribution (Goals 4 + 6)

**Repos:** agentic-lib, repository0

**Status: Not started**

**Work:**
- Define `exports` field in agentic-lib `package.json` exposing library modules
- All exported functions accept `githubToken` as a parameter (no ambient auth)
- Implement the release workflow: `publish-packages` creates git tag + npm publish on manual dispatch
- Tag `v7.0.0` as the first reboot release
- Update repository0 workflow refs from `@6.10.2` to `@7.0.0`
- Create a version-bump script that updates all `@x.y.z` refs in a consumer repo

**Verification gate:**
- [ ] `npm install @xn-intenton-z2a/agentic-lib@7.0.0` succeeds
- [ ] `import { ... } from '@xn-intenton-z2a/agentic-lib/discussions'` resolves
- [ ] repository0 workflows reference `@7.0.0` (no `@6.10.2` or `@main` refs remain)
- [ ] The version-bump script can update all refs in one command

---

### Phase 3: Thin Adaptors + Workflow Tests (Goals 3 + 7)

**Repos:** repository0, agentic-lib

**Status: Not started**

**Work:**
- Audit each repository0 workflow and move inline logic to agentic-lib
- repository0 workflows become thin callers: just `uses:` and `with:` blocks
- Build workflow smoke tests in repository0 that dispatch workflows via `gh workflow run` and verify completion
- Each smoke test produces a demo artifact (log or diff)

**Verification gate:**
- [ ] Every repository0 workflow is <50 lines (excluding comments/headers)
- [ ] Smoke tests dispatch at least: evolve, CI test, discussions bot
- [ ] All smoke tests pass
- [ ] Demo artifacts are produced and uploaded

---

### Phase 4: Template Styles + Bot Wiring (Goals 2 + 9)

**Repos:** repository0, agentic-lib

**Status: Not started**

**Work:**
- Create seed file sets for library, website, and demo styles
- Style selection: config flag in `.github/agentic-lib/agents/agentic-lib.yml` or MISSION.md convention
- Build integration tests that exercise the discussions bot end-to-end
- Test: post comment → bot responds → feature created → evolve picks it up

**Verification gate:**
- [ ] Each of the 3 styles can be instantiated (seed files applied, tests pass)
- [ ] Bot integration test: comment posted → response received within 5 minutes
- [ ] Bot integration test: feature request → feature file created
- [ ] GETTING-STARTED.md documents all 3 styles

---

### Phase 5: Website Integration + Playwright (Goals 1 + 10)

**Repos:** xn--intenton-z2a.com, repository0

**Status: Not started**

**Work:**
- Consolidate repository0 discussions to 1 General thread
- Website fetches and renders intentïon.md and discussion comments
- Submission form posts to the discussions thread via GitHub API
- Playwright test suite for the deployed website
- Concurrent test execution in CI

**Verification gate:**
- [ ] Only 1 active discussion thread in repository0
- [ ] Website renders intentïon.md content (visible on page load)
- [ ] Website renders discussion comments (visible on page load)
- [ ] Submission form posts a comment that the bot answers
- [ ] All Playwright tests pass in CI
- [ ] Full loop demonstrated: submit from website → bot responds → code evolves → website updates

---

## Summary

| Phase | Goals | Repos | Status | Key outcome |
|-------|-------|-------|--------|-------------|
| 0 | — | repository0 | Partial | SDK installs; Node 22 fix applied; model access untested |
| Uplift | 5 | agentic-lib | **Complete** | -600+ lines, +11 tests, deps upgraded, DRY |
| 1 | 5, 8 | agentic-lib | **Partial** | Shared utilities done; per-handler tests + discussions lib remaining |
| 2 | 4, 6 | agentic-lib, repo0 | Not started | npm package + v7.0.0 tagged + version pinning |
| 3 | 3, 7 | repo0, agentic-lib | Not started | Thin workflows + smoke tests + demo output |
| 4 | 2, 9 | repo0, agentic-lib | Not started | 3 template styles + bot integration tests |
| 5 | 1, 10 | website, repo0 | Not started | Live content + Playwright tests + full loop |

---

## Archived Plans

The following plans are superseded by this document:
- `PLAN_CODE_REDUCTION.md` — Step 1 complete (11 wfr-* files inlined). Steps 2-4 fold into Goals 3 and 5.
- `PLAN_STABILISE_AND_DEPLOY.md` — All pre-merge work complete. Runtime verification folds into Phase 0 and Goals 7 and 9.
- `PLAN_UPLIFT.md` — All 8 steps complete. Technical debt reduction, dependency upgrades, shared utilities, composite actions. Findings absorbed into this document.

## Deferred Plans

These remain active but are deprioritised until the reboot phases are complete:
- `PLAN_VERIFICATION.md` — Feature #26 acceptance criteria verification
- `PLAN_LAUNCH.md` — Marketplace publishing, release tagging
- `PLAN_DEMO_REPOS.md` — Features #28 and #29 demo repositories
