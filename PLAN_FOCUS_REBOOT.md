# PLAN: Focus Reboot

Get all the moving parts working end-to-end before tightening verification and expanding demo output. This plan supersedes PLAN_STABILISE_AND_DEPLOY.md and PLAN_CODE_REDUCTION.md (both archived — core work complete).

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
- [ ] Extract core logic from `agentic-step/index.js` and task handlers into testable modules
- [ ] Each task handler has unit tests that run without GitHub Actions context
- [ ] Config-loader, safety, logging, tools already have tests (46 tests) — extend coverage
- [ ] Integration test harness that exercises workflows via `act` or GitHub API
- [ ] CI runs the full test suite on every push

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

### Workflow Separation (2026-02-28)

**Problem:** agentic-lib had a circular dependency — the CI workflows that build/test/release it were the SAME files as the workflow templates distributed to consumers. When CI broke, you couldn't fix it because the broken tool IS the CI.

**Solution:** Physical separation into three categories:

| Category | Location | Purpose |
|----------|----------|---------|
| Libraries | `.github/agentic-lib/` | Code consumed via checkout (actions, agents) |
| Output workflows | `./workflows/` (15 files) | Primary product — template workflows distributed to consumers |
| Internal workflows | `.github/workflows/` (8 files) | Build, test, and release agentic-lib itself |

**`.github/workflows/` (internal — 8 files):**
- `ci.yml` — Self-contained CI, no wfr-* dependency
- `release.yml` — Manual dispatch: test → tag → npm publish
- `agent-supervisor.yml` — Reactive orchestration (internal only)
- `publish-stats.yml` — S3 telemetry (internal only)
- `wfr-agent-config.yml` — Reusable workflow (must stay here per GitHub)
- `wfr-github-create-pr.yml` — Reusable workflow
- `wfr-github-select-issue.yml` — Reusable workflow
- `wfr-npm-run-script-and-commit-to-branch.yml` — Reusable workflow

**`./workflows/` (output — 15 template files):**
- 6 agent-* workflows, 5 ci-* workflows, 2 publish-* workflows, 2 utils-* workflows
- These are source files for distribution — they don't run on agentic-lib
- Version-stamped during release (`sed @main → @version`)

**Key design property:** If template workflows break, `ci.yml` still runs and you can merge fixes.

---

### Phase 1: Testable Core (Goals 5 + 8)

**Repos:** agentic-lib

**Work:**
- Extract task handler logic from `.github/agentic-lib/actions/agentic-step/tasks/*.js` into library modules under `src/lib/`
- Each module exports pure functions that can be tested without GitHub Actions context
- Extract discussions bot logic into `src/lib/discussions.js` with its own test suite
- Extend existing test suite (currently 46 tests for config-loader, safety, logging, tools)

**Verification gate:**
- [ ] `npm test` runs all tests (existing + new) and passes
- [ ] Each task handler has at least 1 unit test
- [ ] Discussions bot library has tests for parse, respond, and action-directive generation
- [ ] Test coverage reported in CI

---

### Phase 2: API Surface + Distribution (Goals 4 + 6)

**Repos:** agentic-lib, repository0

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

| Phase | Goals | Repos | Key outcome |
|-------|-------|-------|-------------|
| 0 | — | repository0 | Copilot SDK works (or we know what to fix) |
| 1 | 5, 8 | agentic-lib | All logic unit-testable with vitest |
| 2 | 4, 6 | agentic-lib, repo0 | npm package + v7.0.0 tagged + version pinning |
| 3 | 3, 7 | repo0, agentic-lib | Thin workflows + smoke tests + demo output |
| 4 | 2, 9 | repo0, agentic-lib | 3 template styles + bot integration tests |
| 5 | 1, 10 | website, repo0 | Live content + Playwright tests + full loop |

---

## Archived Plans

The following plans are superseded by this document:
- `PLAN_CODE_REDUCTION.md` — Step 1 complete (11 wfr-* files inlined). Steps 2-4 fold into Goals 3 and 5.
- `PLAN_STABILISE_AND_DEPLOY.md` — All pre-merge work complete. Runtime verification folds into Phase 0 and Goals 7 and 9.

## Deferred Plans

These remain active but are deprioritised until the reboot phases are complete:
- `PLAN_VERIFICATION.md` — Feature #26 acceptance criteria verification
- `PLAN_LAUNCH.md` — Marketplace publishing, release tagging
- `PLAN_DEMO_REPOS.md` — Features #28 and #29 demo repositories
