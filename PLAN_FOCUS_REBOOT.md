# PLAN: Focus Reboot

Get all the moving parts working end-to-end before tightening verification and expanding demo output. This plan supersedes PLAN_STABILISE_AND_DEPLOY.md and PLAN_CODE_REDUCTION.md (both archivable — core work complete).

## User Assertions

- Get all moving parts working before tightening verification or expanding demos
- This plan touches all 3 repos and takes priority over other PLAN_*.md files
- PLAN_VERIFICATION.md, PLAN_LAUNCH.md, PLAN_DEMO_REPOS.md remain but are deferred

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

A clean mechanism to publish updated and tested workflows from agentic-lib to repository0 and named descendants. Currently, repository0 references agentic-lib workflows via `uses: xn-intenton-z2a/agentic-lib/.github/workflows/...@version`. This should be explicit, versioned, and testable.

**Deliverables:**
- [ ] Workflow version pinning strategy (tag-based: `@v7.0.0`, not `@main`)
- [ ] Script or workflow to update version pins across all descendant repos
- [ ] Release process: tag → npm publish → workflow consumers update
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

## Dependencies and Sequencing

```
Goal 5 (testable agentic-lib)
  ↓
Goal 4 (npm API surface)  →  Goal 6 (distribution)
  ↓                              ↓
Goal 3 (thin adaptors)     Goal 7 (workflow tests in repo0)
  ↓
Goal 8 (bot library)  →  Goal 9 (bot wiring tests)
  ↓
Goal 2 (multi-style template)
  ↓
Goal 1 (website integration)  →  Goal 10 (Playwright tests)
```

**Suggested execution order:**
1. Goals 5 + 8 (testable code — can be done in parallel)
2. Goals 4 + 3 (API surface + thin adaptors)
3. Goals 6 + 7 (distribution + workflow tests)
4. Goals 2 + 9 (template styles + bot wiring tests)
5. Goals 1 + 10 (website + Playwright tests)

---

## What This Delivers

A coherent system where:
- **agentic-lib** is the brain — testable, publishable, version-controlled
- **repository0** is the body — a thin template that delegates all intelligence to agentic-lib
- **xn--intenton-z2a.com** is the face — showing the world what the system produces, with bidirectional interaction via Discussions
- Every layer is tested: unit tests in agentic-lib, workflow tests in repository0, behaviour tests on the website
- The full loop works: user posts intention → bot creates feature → code evolves → website shows result

---

## Archived Plans

The following plans are superseded by this document:
- `PLAN_CODE_REDUCTION.md` — Step 1 complete (11 wfr-* files inlined). Steps 2-4 fold into Goals 3 and 5.
- `PLAN_STABILISE_AND_DEPLOY.md` — All pre-merge work complete. Runtime verification folds into Goals 7 and 9.

## Deferred Plans

These remain active but are deprioritised until the reboot goals are met:
- `PLAN_VERIFICATION.md` — Feature #26 acceptance criteria verification
- `PLAN_LAUNCH.md` — Marketplace publishing, v7.0.0 release
- `PLAN_DEMO_REPOS.md` — Features #28 and #29 demo repositories
