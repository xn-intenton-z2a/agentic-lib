# PLAN: Focus Reboot

Get all the moving parts working end-to-end before tightening verification and expanding demo output. This plan supersedes PLAN_STABILISE_AND_DEPLOY.md, PLAN_CODE_REDUCTION.md, and PLAN_UPLIFT.md (all archived — core work complete).

**12-task hardening sprint: COMPLETE**

| #   | Task                                                                | Status                                                     |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | Remove GitHub Pages (workflow, config, branch)                      | Done                                                       |
| 2   | Deep unit tests for all 8 task handlers                             | Done (46 tests)                                            |
| 3   | Package structural tests (`npm pack` validation)                    | Done (15 tests)                                            |
| 4   | System connectivity testing (3 tiers)                               | Done (smoke script + integration workflow)                 |
| 5   | LLM transformation testing (3 tiers)                                | Done (54 fixture tests + golden prompts + verify workflow) |
| 6   | Import tooling from submit project                                  | Done (workflow validation, security audit, prettier glob)  |
| 7   | CI pipeline: lint, security, workflow validation jobs               | Done (5 CI jobs)                                           |
| 8   | Update all documents to match current state                         | Done                                                       |
| 9   | Update PLAN_FOCUS_REBOOT.md                                         | Done                                                       |
| 10  | Scripted distribution to repository0                                | Done (distribute.js → replaced by CLI init)                |
| 11  | Fix npm audit (eslint-plugin-sonarjs → ^4.0.0 + minimatch override) | Done (0 vulnerabilities)                                   |
| 12  | Fix CI pipeline, verify release.yml                                 | Done                                                       |

**Post-sprint work (2026-03-01):**

| #   | Task                                                           | Status |
| --- | -------------------------------------------------------------- | ------ |
| A   | Copilot SDK auth: fine-grained PAT + env override              | Done   |
| B   | Model name fix: claude-sonnet-4 (not claude-sonnet-4.5)        | Done   |
| C   | CLI: `npx @xn-intenton-z2a/agentic-lib init [--purge]`        | Done   |
| D   | ci-init.yml workflow (pull infrastructure via workflow_dispatch)| Done   |
| E   | Remove old push scripts (distribute.js, diff-workflows.sh)     | Done   |
| F   | Seed reset mechanism (zero-README.md, --purge flag)            | Done   |
| G   | Local test scripts (test-copilot, test-discussions, test-transform) | Done   |
| H   | _developers/MODELS.md reference + workflow model choice menus  | Done   |
| I   | v7.1.0 release (tag + publish)                                 | Done   |
| J   | Integration test: discussions bot end-to-end workflow           | Pending |
| K   | Integration test: transform + verify + reset workflow          | Pending |

Current repo structure:

```text
agentic-lib/
├── bin/                              # CLI ENTRY POINT
│   └── agentic-lib.js                #   npx @xn-intenton-z2a/agentic-lib init [--purge]
├── src/                              # ALL DISTRIBUTED PRODUCTION CODE
│   ├── workflows/ (13)               #   Template workflows (all Node 24)
│   ├── scripts/ (7)                  #   Distributed utility scripts
│   ├── agents/ (8)                   #   7 prompts + 1 config
│   ├── actions/                      #   Composite actions + Copilot SDK action
│   │   ├── agentic-step/             #     Copilot SDK action (node24)
│   │   │   ├── copilot.js            #       Shared SDK utilities (env override auth)
│   │   │   └── tasks/ (8 handlers)   #       845 lines
│   │   ├── setup-npmrc/              #     Composite: npmrc setup
│   │   └── commit-if-changed/        #     Composite: conditional commit
│   └── seeds/ (8)                    #   Seed files + 3 starter test workflows
├── tests/                            # ALL TESTS (mirrors src/ structure)
│   ├── actions/agentic-step/         #   5 moved + index + 8 task handler tests
│   │   └── tasks/ (8 files)
│   ├── workflows/ (1)                #   Structural YAML validation
│   ├── scripts/ (1)                  #   Syntax + existence checks
│   ├── agents/ (1)                   #   Config + prompt validation
│   ├── seeds/ (1)                    #   JSON/YAML + field validation
│   ├── fixtures/                     #   LLM response + golden prompt fixtures
│   │   ├── copilot-responses/ (7)
│   │   └── golden-prompts/ (8)
│   └── packaging/ (1)                #   npm pack structural validation
├── scripts/                          # RELEASE + TOOLING
│   ├── validate-workflows.js         #   Workflow YAML validation
│   ├── smoke-test-connectivity.js    #   Tier 2 connectivity smoke test
│   ├── record-golden-prompts.js      #   Golden prompt recorder
│   ├── test-copilot-local.js         #   Local Copilot SDK test
│   ├── test-discussions-local.js     #   Local discussions bot test
│   └── test-transform-local.js       #   Local transform test
├── .github/workflows/ (4)            # INTERNAL CI (Node 24 + FORCE env)
│   ├── ci.yml                        #   5 jobs: test, lint, lint-workflows, security, smoke
│   ├── release.yml                   #   Release automation (manual dispatch)
│   ├── integration-test.yml          #   Manual Tier 3 integration test
│   └── llm-verify.yml                #   LLM transformation verification
├── _developers/MODELS.md             # Available Copilot SDK models reference
├── vitest.config.js                  # Root test config (tests/**/*.test.js)
├── FEATURES.md, FEATURES_ROADMAP.md  # Product definition
├── PLAN_FOCUS_REBOOT.md              # Active plan
├── README.md                         # Docs
└── package.json, eslint.config.js    # Config (engines >=24, bin, files)
```

## User Assertions

- Get all moving parts working before tightening verification or expanding demos
- This plan touches all 3 repos and takes priority over other PLAN\_\*.md files
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

### Copilot SDK Runtime Status — RESOLVED

Both risks from the stabilisation work are now **verified and resolved**:

**Risk #12 — Copilot CLI availability on runners: RESOLVED**
The SDK spawns a `copilot` CLI subprocess. It works on standard `ubuntu-latest` runners. No separate binary installation needed — the SDK bundles the CLI.

**Risk #13 — Model availability via SDK: RESOLVED**
The valid model name is `claude-sonnet-4` (NOT `claude-sonnet-4.5`). Available models: `claude-sonnet-4` (premium, 1x), `gpt-5-mini` (free), `gpt-4.1` (free). See `_developers/MODELS.md`.

**Auth solution:** Fine-grained PAT with "Copilot Requests" permission (user as resource owner, public repos only). The PAT is stored as `COPILOT_GITHUB_TOKEN` secret. `copilot.js` overrides subprocess env so the CLI finds this token instead of `GITHUB_TOKEN`.

**Known limitation:** "Copilot Requests" permission disappears when creating fine-grained PATs with an org as resource owner. Workaround: use personal account as resource owner.

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

- **library** — a publishable npm package transformed from a MISSION.md
- **website** — a deployable site transformed from a MISSION.md
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

### Goal 5: Testable code transformation inside agentic-lib

All code transformation logic and transitions can be tested inside the agentic-lib repository using fast, traditional test mechanisms (vitest). This means abstracting logic out of GitHub Actions so it can be unit-tested without running workflows.

**Deliverables:**

- [x] Extract shared SDK lifecycle into `copilot.js` (`runCopilotTask`, `readOptionalFile`, `scanDirectory`, `formatPathsSection`)
- [x] Unit tests for shared utilities (11 tests in `copilot.test.js`)
- [x] CI runs the full test suite on every push (307 tests, all passing)
- [x] Each task handler has deep unit tests with mocked dependencies (46 tests across 8 files)
- [x] LLM response parsing tested via fixture files (54 tests)
- [x] Golden prompt templates recorded and validated (8 tasks)
- [x] Package structural validation tests (15 tests)
- [x] Distribution/consumer compatibility tests (8 tests)
- [ ] Discussions bot library extracted into testable module with its own tests
- [ ] Integration test harness that exercises workflows via `act` or GitHub API

### Goal 6: Clean distribution method for workflows

A clean mechanism to publish updated and tested workflows from agentic-lib to repository0 and named descendants.

**Deliverables:**

- [x] Tag-based versioning: `release.yml` workflow dispatch creates git tag + npm publish
- [ ] repository0 pins to exact tag (e.g. `@7.1.1`) — no `@main` references
- [x] CLI: `npx @xn-intenton-z2a/agentic-lib init` pulls latest from npm package
- [x] CLI: `npx @xn-intenton-z2a/agentic-lib init --purge` also resets source to seeds
- [x] `ci-init.yml` workflow: pull infrastructure via workflow_dispatch
- [x] Package ships distributable content (bin/, src/workflows, actions, agents, seeds, scripts)
- [x] v7.1.1 published (CLI + ci-init + auth fix + model name fix)
- [ ] Release process documented: test → tag → publish → bump consumers
- [ ] Pre-publish integration tests pass (discussions bot + transform cycle)

### Goal 7: Test suite in repository0 that validates workflows

A test suite in repository0 that confirms the workflows are working and generates demo output as evidence.

**Deliverables:**

- [ ] Workflow smoke tests: dispatch key workflows and verify they complete
- [ ] Demo output generation: each test run produces an artifact (log, diff, or screenshot)
- [ ] Test results surfaced in CI (check annotations or summary)
- [ ] At minimum: test transform, test discussions bot, test CI pipeline

### Goal 8: Supporting libraries and tests for the discussions bot

The discussions bot logic in agentic-lib should have its own library code and test suite, independent of the GitHub Actions wrapper.

**Deliverables:**

- [x] Unit tests for discussions handler (8 tests covering URL parsing, GraphQL, actions, edge cases)
- [x] Mock GitHub GraphQL responses for test isolation (via vi.mock + fixtures)
- [ ] Extract discussions bot logic from `tasks/discussions.js` into a testable library
- [ ] Test coverage for edge cases: empty discussions, malformed input, rate limits

### Goal 9: repository0 tests for discussions bot wiring

Tests in repository0 that verify the discussions bot is wired up to the discussions thread and can manipulate code.

**Deliverables:**

- [ ] Integration test: post a comment → bot responds → verify response
- [ ] Integration test: request a feature → bot creates feature file → verify file exists
- [ ] Integration test: bot-created feature → transform workflow picks it up → code changes
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

### Phase 0: Node 24 LTS Uplift + SDK Smoke Test

**Goal:** Uplift to Node 24 LTS and confirm the Copilot SDK works at runtime.

**Status: Complete** (Node 24 uplift done; SDK runtime re-test pending CI run)

**Work done:**

- [x] All `node-version` bumped from 22 → 24 across all workflows, seeds, CI, and release
- [x] `action.yml` updated from `node20` → `node24`
- [x] All `package.json` files updated: `engines.node >= 24.0.0`
- [x] `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` env added to `ci.yml` and `release.yml`
- [x] `_archive/PLAN_UPLIFT.md` moved to `_developers/_archive/`

**Phase 0 Findings (2026-02-28):**

1. **SDK installs successfully** — `npm ci` resolves `@github/copilot-sdk@0.1.29` without error
2. **Runtime failure on Node 20: `node:sqlite` not available** — The SDK requires `node:sqlite` (Node 22.5+). Fixed by uplift.
3. **Risk #12 (CLI availability):** NOT hit. The SDK loads as a library, no CLI binary needed.
4. **Risk #13 (Model availability):** NOT yet tested — needs real workflow run after Node 24 uplift.

**Verification gate:**

- [x] All `node-version` references are 24 (verified: `grep -r 'node-version.*22' src/ .github/` returns nothing)
- [x] No `node20` references remain (verified: `grep -r 'node20' src/` returns nothing)
- [x] `npm test` passes on Node 24 locally
- [ ] CI passes on push to `reboot`
- [ ] `agent-flow-transform` workflow completes without SDK errors (re-test after merge)

### Repo Restructure (2026-02-28)

**Problem:** agentic-lib had a circular dependency — the CI workflows that build/test/release it were the SAME files as the workflow templates distributed to consumers. Plus, sandbox/src/tests/unit were "eating our own dog food" testing infrastructure that added complexity without testing the actual product.

**Solution:** Clean separation into production code (`src/`), release tooling (`scripts/`), and internal CI (`.github/workflows/`).

**Key design property:** If template workflows break, `ci.yml` still runs and you can merge fixes.

### Technical Uplift (complete — PLAN_UPLIFT.md archived to `_developers/_archive/`)

A systematic file-by-file review of `src/` delivered 8 steps of technical debt reduction:

| Step                    | What                                                                              | Impact                |
| ----------------------- | --------------------------------------------------------------------------------- | --------------------- |
| 1. Dead code removal    | Maven/CDK/Java jobs, AWS env vars, CHATGPT_API_SECRET_KEY, Docker blocks          | -219 lines            |
| 2. Dependency upgrades  | @actions/core 3.x, @actions/github 9.x, vitest 4.x, root devDeps                  | Quality               |
| 3. Seed file fixes      | sandbox/ → src/lib/, engines >=22, stripped heavy deps, version reset             | Correctness           |
| 4. Config-driven paths  | Replaced hardcoded sandbox/ writable-paths with yq config reads                   | Correctness           |
| 5. Shared utilities     | `copilot.js`: runCopilotTask, readOptionalFile, scanDirectory, formatPathsSection | -318 lines, +11 tests |
| 6. Composite actions    | `setup-npmrc`, `commit-if-changed` — used by 8 workflows                          | DRY                   |
| 7. ci-automerge cleanup | Removed 7 echo-event jobs, unused env, commented triggers                         | -62 lines (618→550)   |
| 8. Orphaned prompts     | Removed `agent-maintain-sources.md` (disabled in config)                          | -22 lines             |

**Post-uplift metrics:**

- Workflows: 12 files, ~2,100 lines (was 14 files, ~2,800 lines)
- Task handlers: 845 lines (was 1,163)
- Dependencies: all on latest major except ESLint 10 (deferred — eslint-config-google compatibility)
- No remaining sandbox/ refs, no Maven/CDK/Java, no AWS env vars, no CHATGPT_API references

---

### Phase 1: Test Suite + Testable Core (Goals 5 + 8)

**Repos:** agentic-lib

**Status: Deep coverage complete** — 307 tests passing across 22 files.

**Done:**

- [x] Root `vitest.config.js` with `tests/**/*.test.js` pattern
- [x] Root `package.json` test script runs `vitest --run` (no more `npm test --prefix`)
- [x] Moved 5 existing tests from `src/actions/agentic-step/tests/` → `tests/actions/agentic-step/`
- [x] Removed sub-project `vitest.config.js` and `tests/` dir
- [x] Created `tests/actions/agentic-step/index.test.js` — TASKS map validation (4 tests)
- [x] Created 8 task handler tests with deep mocking (46 tests covering all branches)
- [x] Created `tests/workflows/workflows.test.js` — YAML validity, structure, node-version, runs-on (73 tests)
- [x] Created `tests/scripts/scripts.test.js` — JS syntax check, shell script existence (10 tests)
- [x] Created `tests/agents/agents.test.js` — config validity, prompt non-emptiness (20 tests)
- [x] Created `tests/seeds/seeds.test.js` — JSON/YAML validity, node engine, required fields (14 tests)
- [x] Created `tests/fixtures/fixtures.test.js` — LLM response + golden prompt validation (54 tests)
- [x] Created `tests/packaging/packaging.test.js` — npm pack structural validation (15 tests)
- [x] Created `tests/distribution/` — distribute script + consumer compat tests (8 tests)
- [x] Extracted shared SDK lifecycle into `copilot.js`
- [x] Total test suite: 307 tests across 22 files, all passing

**Test method table:**

| Test file                   | Tests | What it validates                                               |
| --------------------------- | ----- | --------------------------------------------------------------- |
| `config-loader.test.js`     | 11    | YAML config loading, writable paths, defaults, overrides        |
| `copilot.test.js`           | 11    | readOptionalFile, scanDirectory, formatPathsSection             |
| `logging.test.js`           | 13    | Activity log creation/append, safety check output               |
| `safety.test.js`            | 12    | Path writability, issue state, WIP limits, attempt limits       |
| `tools.test.js`             | 10    | Agent tools: read/write/list files, run commands                |
| `index.test.js`             | 4     | TASKS map: 8 entries, correct names, async functions            |
| `resolve-issue.test.js`     | 9     | Missing input, closed issue, attempt/WIP limits, happy path     |
| `fix-code.test.js`          | 5     | Missing input, no failures, failure details, happy path         |
| `transform.test.js`         | 6     | No mission, features/source in prompt, TDD mode, client cleanup |
| `maintain-features.test.js` | 4     | Mission/features/library reads, closed issues, happy path       |
| `maintain-library.test.js`  | 4     | Empty sources, whitespace, library docs, happy path             |
| `enhance-issue.test.js`     | 5     | Missing input, resolved, ready label, update/label/comment      |
| `review-issue.test.js`      | 5     | Auto-select oldest, no issues, closed, RESOLVED/OPEN verdicts   |
| `discussions.test.js`       | 8     | Missing URL, parsing, GraphQL, actions, graceful degradation    |
| `workflows.test.js`         | 73    | 12 workflows: valid YAML, name/on/jobs, ubuntu-latest, node 24  |
| `scripts.test.js`           | 10    | 2 JS syntax checks, 5 shell script existence                    |
| `agents.test.js`            | 20    | Config YAML keys, 7 prompts non-empty                           |
| `seeds.test.js`             | 14    | zero-package.json fields, engines >=24, seed YAML validity      |
| `fixtures.test.js`          | 54    | LLM response structure, parsing patterns, golden prompts        |
| `packaging.test.js`         | 15    | Package fields, npm pack contents, no secrets/dev files         |
| `distribute.test.js`        | 5     | Manifest generation, compatibility check, dry-run, write        |
| `consumer-compat.test.js`   | 3     | workflow_call consistency, no @main refs, cross-repo check      |

**CI pipeline:**

| Job              | Command                  | Purpose                                     |
| ---------------- | ------------------------ | ------------------------------------------- |
| `test`           | `npm test`               | Full vitest suite (307 tests)               |
| `lint`           | `npm run linting`        | ESLint                                      |
| `lint-workflows` | `npm run lint:workflows` | Workflow YAML validation (16 files)         |
| `security`       | `npm run security`       | npm audit (0 vulnerabilities)               |
| `smoke`          | `npm run test:smoke`     | Connectivity smoke test (continue-on-error) |

**Remaining:**

- [ ] Extract discussions bot logic from `tasks/discussions.js` into testable library
- [ ] Unit tests for discussions library: parse, respond, action-directive generation
- [ ] Test coverage reporting in CI

**Verification gate:**

- [x] `npm test` runs all tests and passes (307 tests)
- [x] Test tree mirrors `src/` structure
- [x] Each task handler has deep unit tests with mocked dependencies
- [x] LLM response parsing tested via fixture files
- [x] Package structural validation passing
- [x] 0 npm audit vulnerabilities
- [x] Workflow validation passing
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
- [ ] Smoke tests dispatch at least: transform, CI test, discussions bot
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
- Test: post comment → bot responds → feature created → transform picks it up

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
- [ ] Full loop demonstrated: submit from website → bot responds → code transforms → website updates

---

### Pre-Publish Validation (NEW — must pass before any release)

Two integration test workflows that validate agentic-lib end-to-end before publishing. These run in agentic-lib's own CI (not in consumer repos).

#### Workflow 1: Discussions Bot End-to-End (`integration-test-discussions.yml`)

Tests the full discussions bot flow: post a comment → SDK processes → bot responds.

**Steps:**

1. Create a test discussion (or use a designated test discussion)
2. Post a comment via `gh api graphql`
3. Trigger the discussions bot workflow (or wait for event trigger)
4. Poll for a bot response (with timeout)
5. Verify the response contains an `[ACTION:...]` tag
6. Clean up: delete the test comment

**Trigger:** `workflow_dispatch` (manual) — run before each release.

#### Workflow 2: Transform Cycle (`integration-test-transform.yml`)

Tests the full transform lifecycle: init → transform → verify → reset.

**Steps:**

1. Create a temporary branch from main
2. Run `npx @xn-intenton-z2a/agentic-lib init --purge` to set up clean template state
3. Set a test MISSION.md (e.g., "Add a function that returns the current date")
4. Commit the seed state
5. Trigger `agent-flow-transform` workflow on the test branch
6. Wait for completion
7. Verify: `src/lib/main.js` was modified (diff is non-empty)
8. Verify: tests still pass (`npm test`)
9. Run `npx @xn-intenton-z2a/agentic-lib reset` to restore seed state
10. Verify: `src/lib/main.js` matches the seed file
11. Delete the temporary branch

**Trigger:** `workflow_dispatch` (manual) — run before each release.

**Key principle:** These tests must pass before `release.yml` is dispatched. They validate that the Copilot SDK auth, model access, prompt construction, and file manipulation all work correctly in CI.

## Recommended Next Steps

1. **Build pre-publish validation workflows** (Tasks J + K above)
2. **Phase 2** — Define `exports` field, update repository0 version pins to `@7.1.1`
3. **Phase 3** — repository0 alignment: thin adaptors, workflow smoke tests
4. **Phase 4** — Template styles, discussions bot library extraction

## Summary

| Phase  | Goals | Repos              | Status          | Key outcome                                           |
| ------ | ----- | ------------------ | --------------- | ----------------------------------------------------- |
| 0      | —     | agentic-lib        | **Complete**    | Node 24 LTS uplift; SDK installs; CI pipeline         |
| Uplift | 5     | agentic-lib        | **Complete**    | -600+ lines, +11 tests, deps upgraded, DRY            |
| 1      | 5, 8  | agentic-lib        | **Complete**    | 307 tests / 21 files; deep handler tests; CI pipeline |
| Post   | 6     | agentic-lib, repo0 | **Complete**    | CLI init, v7.1.1 published, auth resolved, seeds      |
| Valid  | 6     | agentic-lib        | **In progress** | Pre-publish integration tests (discussions + transform)|
| 2      | 4, 6  | agentic-lib, repo0 | Not started     | npm exports + version pinning                         |
| 3      | 3, 7  | repo0, agentic-lib | Not started     | Thin workflows + smoke tests + demo output            |
| 4      | 2, 9  | repo0, agentic-lib | Not started     | 3 template styles + bot integration tests             |
| 5      | 1, 10 | website, repo0     | Not started     | Live content + Playwright tests + full loop           |

---

## Archived Plans

The following plans are superseded by this document:

- `PLAN_CODE_REDUCTION.md` — Step 1 complete (11 wfr-\* files inlined). Steps 2-4 fold into Goals 3 and 5.
- `PLAN_STABILISE_AND_DEPLOY.md` — All pre-merge work complete. Runtime verification folds into Phase 0 and Goals 7 and 9.
- `PLAN_UPLIFT.md` (archived to `_developers/_archive/`) — All 8 steps complete. Technical debt reduction, dependency upgrades, shared utilities, composite actions. Findings absorbed into this document.

## Deferred Plans

These remain active but are deprioritised until the reboot phases are complete:

- `PLAN_VERIFICATION.md` — Feature #26 acceptance criteria verification
- `PLAN_LAUNCH.md` — Marketplace publishing, release tagging
- `PLAN_DEMO_REPOS.md` — Features #28 and #29 demo repositories
