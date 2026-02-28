# intentïon — Autonomous Code Evolution

All features for the intentïon project. Core features (#1-17) power the autonomous evolution system. MVP features (#18-25) make the product coherent and compelling. New features (#26-29) cover verification, optimization, and demo repositories. Post-MVP features are in [FEATURES_ROADMAP.md](FEATURES_ROADMAP.md) (#30-41).

---

## Status

| # | Feature | Status |
|---|---------|--------|
| 1 | Autonomous Code Evolution | Done |
| 2 | Issue Lifecycle Management | Done |
| 3 | Feature Lifecycle Management | Done |
| 4 | Code Generation & Fixing | Done |
| 5 | Auto-Merge & Branch Management | Done |
| 6 | Discussions Bot | Done |
| 7 | Statistics & Observability | Done |
| 8 | Publishing Pipeline | Done |
| 9 | Website & Brand | Done |
| 10 | AWS Infrastructure — agentic-lib | Done |
| 11 | AWS Infrastructure — Website | Done |
| 12 | CI/CD & Code Quality | Done |
| 13 | Configuration & Safety | Done |
| 14 | Template System | Done |
| 15 | Library & Knowledge Management | Done |
| 16 | Maintenance & Hygiene | Done |
| 17 | Scripts & Utilities | Done |
| 18 | Copilot Migration | Done |
| 19 | Workflow Hardening (Critical Subset) | Done |
| 20 | Discussions Bot Intelligence | Done |
| 21 | Onboarding Experience | Done |
| 22 | Supervisor (Reactive Orchestration) | Done |
| 23 | TDD Workflow | Done |
| 24 | Showcase Page | Done |
| 25 | Submission Box | Done |
| 26 | Verification & Testing | Pending |
| 27 | Code Reduction & Optimization | Pending |
| 28 | Library Demo Repository | Pending |
| 29 | Website Demo Repository | Pending |

### Outstanding items

- Integration test against real Copilot SDK
- Publish `agentic-step` to GitHub Marketplace
- Tag v7.0.0 release
- Remove remaining legacy `wfr-*` files used only by keepers (see #27)
- Create library demo repository (see #28)
- Create website demo repository (see #29)

---

## Product

### What it is

A clonable GitHub template that turns a mission statement into working, tested, deployed code — autonomously, using GitHub Copilot as the only AI engine. You write what you want in plain English. The system derives features, creates issues, writes code, runs tests, merges PRs, and closes issues — in a continuous loop.

**Target audience:** Any developer with a GitHub Copilot subscription who wants to describe what they want and watch it build itself.

**Tagline:** *"What is your intentïon?"*

### What makes this unique (February 2026)

1. **Mission-driven**: Plain English → features → issues → code → PR → merge → close, in a continuous loop
2. **Self-healing**: Failures trigger fixes, stalls trigger reseeds, completed features trigger pruning
3. **Transparent**: Every action logged in intentïon.md with commit links, token usage, and outcomes
4. **Community-interactive**: Discussions bot bridges human intent to autonomous action
5. **Zero vendor lock-in**: GitHub Actions + GitHub Copilot only. You own everything.
6. **Clone and go**: Create from template, write a mission, enable Copilot. That's it.
7. **TDD by default**: Features start with failing tests — the AI writes tests first

### Why someone would clone this

- **Solo developers** who want continuous progress on side projects without daily effort
- **Teams** wanting an autonomous maintenance/improvement agent for existing repos
- **Educators** teaching autonomous systems, DevOps, or AI-assisted development
- **Open source maintainers** who want an AI contributor that follows their mission

---

## Architecture

### Before (99 workflows)

```
OpenAI API (o4-mini) ──→ 23 wfr-completion-* workflows
                          ↕
                      10 transformation workflows ──→ 10 flow workflows
                          ↕
                      GitHub Script (inline JS)
```

### After (~32 workflows + 1 action)

```
GitHub Copilot SDK ──→ agentic-step action (1 action, published to Marketplace)
                        ↕
                    3 flow workflows + 1 supervisor + 1 discussions bot
                        ↕
                    CI/CD + Publishing (unchanged)
```

### Dependency Changes

| Dependency | Before | After |
|-----------|--------|-------|
| OpenAI API (CHATGPT_API_SECRET_KEY) | Required | Removed |
| GitHub Copilot subscription | Not used | Required |
| @github/copilot-sdk | Not used | Core dependency |
| AWS S3/SQS/Lambda | Used | Unchanged |
| GitHub Actions minutes | ~99 workflows | ~32 workflows |

### Workflow Reduction

| Repository | Before | After | Reduction |
|-----------|--------|-------|-----------|
| agentic-lib | 59 workflows | ~15 workflows + 1 action | -75% |
| repository0 | 31 workflows | ~8 workflows | -74% |
| xn--intenton-z2a.com | 9 workflows | 9 workflows | 0% |
| **Total** | **99 workflows** | **~32 workflows + 1 action** | **-68%** |

---

## Features

### Core Features (#1-17)

#### 1. Autonomous Code Evolution

The core proposition: repositories evolve their own code through an AI-driven feedback loop. Converts a mission statement into working, tested, deployed code through a chain of automated transformations. The `agentic-step` action with the `evolve` task replaces the previous 10-workflow transformation chain with 3 orchestration workflows: `agent-flow-evolve.yml`, `agent-flow-maintain.yml`, `agent-flow-review.yml`.

**Pipeline:** Mission → Sources → Library → Features → Issues → Code → PR → Merge → Close
**Repositories:** agentic-lib (workflows), repository0 (consumer)
**Status:** Done

#### 2. Issue Lifecycle Management

Automated creation, enhancement, assignment, resolution, and closure of GitHub issues. Issues progress through: Created → Enhanced (ready label) → In-progress → Code generated → PR created → Merged → Closed. The `agentic-step` action orchestrates the lifecycle with WIP limits (2 feature, 1 maintenance) and attempt tracking.

**Labels:** `automated`, `ready`, `in-progress`, `feature`, `maintenance`, `automerge`
**Repositories:** agentic-lib (workflows), repository0 (consumer)
**Status:** Done

#### 3. Feature Lifecycle Management

Maintains feature specification files (markdown) in `sandbox/features/` or `features/`. Features are created from library analysis, refined, used to generate issues, and pruned when complete. The `maintain-features` task in `agentic-step` handles all lifecycle operations.

**Limits:** Max 4-8 features at a time (configurable)
**Repositories:** agentic-lib (workflows + sandbox features), repository0 (consumer features)
**Status:** Done

#### 4. Code Generation & Fixing

Given an issue or a failing test, generates code changes, validates they pass tests, and creates a PR. Also fixes failing PRs by analyzing test output. Two task handlers: `resolve-issue` (issue → code → PR) and `fix-code` (fix failing tests).

**Agent prompts:** `agent-issue-resolution.md`, `agent-apply-fix.md`
**Repositories:** agentic-lib (workflows), repository0 (consumer)
**Status:** Done

#### 5. Auto-Merge & Branch Management

Monitors PRs with the `automerge` label. When all checks pass, merges the PR. Handles branch conflicts by closing conflicted PRs. Extended to also match `copilot/*` branches.

**Key workflow:** `ci-automerge.yml`
**Repositories:** agentic-lib (workflow), repository0 (consumer)
**Status:** Done

#### 6. Discussions Bot

AI agent that responds to GitHub Discussions, creates features, seeds repositories, and provides status updates. The `discussions` task in `agentic-step` uses the Copilot SDK for conversational responses with tool-use capability for reading files and posting responses.

**Actions:** `seed-repository`, `create-feature`, `create-issue`, `nop`, `mission-complete`, `stop`
**Key workflow:** `agent-discussions-bot.yml`
**Status:** Done

#### 7. Statistics & Observability

Collects repository statistics (branches, PRs, issues, commits), publishes as JSON to S3, renders on a web dashboard (`public/all.html`), and maintains an activity log (`intentïon.md`). Copilot SDK usage metrics replace OpenAI token tracking.

**AWS targets:** `s3://agentic-lib-telemetry-bucket/events/`, `s3://agentic-lib-public-website-stats-bucket/`
**Key workflow:** `publish-stats.yml`
**Status:** Done

#### 8. Publishing Pipeline

Publishes npm packages, web content to GitHub Pages, and documentation. The npm package is extended to include the `agentic-step` action, published to GitHub Marketplace.

**npm packages:** `@xn-intenton-z2a/agentic-lib`, `@xn-intenton-z2a/repository0`
**Key workflow:** `publish-packages.yml`
**Status:** Done

#### 9. Website & Brand

Minimalist single-page website at xn--intenton-z2a.com. Dark text on foggy background with animated fog layers. Giscus integration for community interaction. Brand assets in multiple formats.

**Repository:** xn--intenton-z2a.com
**Status:** Done

#### 10. AWS Infrastructure — agentic-lib

S3 buckets (telemetry + public website), SQS queues, Lambda function (Docker-based digest processor), DynamoDB projections table, CloudTrail logging, and IAM roles for GitHub Actions. CDK stacks in Java.

**Key resources:** `agentic-lib-telemetry-bucket`, `agentic-lib-public-website-stats-bucket`, `agentic-lib-digest-queue`
**Repository:** agentic-lib
**Status:** Done

#### 11. AWS Infrastructure — Website

CloudFront + S3 hosting with SSL, Route53 DNS, CloudTrail telemetry, and access log forwarding via Lambda. CDK stacks: NetworkStack, ApplicationStack, TelemetryStack.

**Repository:** xn--intenton-z2a.com
**Status:** Done

#### 12. CI/CD & Code Quality

Tests on push/schedule (Vitest, JUnit 5), auto-formatting (Prettier), linting (ESLint), dependency updates (npm-check-updates, Maven). `copilot-setup-steps.yml` enables Copilot coding agent to run tests.

**Key workflows:** `ci-test.yml`, `ci-automerge.yml`, `ci-formating.yml`, `ci-update.yml`
**Status:** Done

#### 13. Configuration & Safety

Centralises agent parameters in `agentic-lib.yml`: file paths with read/write permissions, build/test/main scripts, WIP limits, attempt limits, sandbox reset behaviour, seed files, schedule selection. The `config-loader.js` and `safety.js` modules enforce limits.

**Config file:** `.github/agentic-lib/agents/agentic-lib.yml`
**Status:** Done

#### 14. Template System

repository0 serves as a clonable GitHub template pre-configured with all agentic workflows, agent configs, seeds, and a getting-started guide. Simplified from 31 workflows to ~8. Users write `MISSION.md` and enable Copilot — no OpenAI key needed.

**Repository:** repository0
**Status:** Done

#### 15. Library & Knowledge Management

Crawls URLs in SOURCES.md, extracts technical content, creates/updates library documents in `sandbox/library/`, and generates a searchable HTML index. The `maintain-library` task in `agentic-step` handles all operations.

**Limits:** 8-16 source entries, 32-64 library documents (configurable)
**Status:** Done

#### 16. Maintenance & Hygiene

Truncates old workflow run history, archives issue history, sweeps stale branches, recovers stuck issues, reseeds stale repositories, and updates dependencies. Reseed logic configured via `agentic-lib.yml`.

**Key workflows:** `utils-truncate-workflow-history.yml`, `utils-truncate-issue-history.yml`, `ci-update.yml`, `agent-archive-intentïon.yml`
**Status:** Done

#### 17. Scripts & Utilities

21 shell and Node.js scripts for release versioning, AWS IAM role assumption, npm authentication, schedule activation/deactivation, source export, and cleanup.

**Key scripts:** `release-version-to-repository.sh`, `release-to-every-repository.sh`, `aws-assume-agentic-lib-deployment-role.sh`
**Repository:** agentic-lib
**Status:** Done

### MVP Features (#18-25)

#### 18. Copilot Migration

Port from OpenAI API to GitHub Copilot SDK. The `agentic-step` action wraps the SDK and supports 8 task types: `resolve-issue`, `fix-code`, `evolve`, `maintain-features`, `maintain-library`, `enhance-issue`, `review-issue`, `discussions`.

**Key deliverable:** `.github/agentic-lib/actions/agentic-step/`
**Status:** Done

**Acceptance Criteria:**
- [ ] `agentic-step` action authenticates with Copilot SDK and returns output
- [ ] All 8 task handlers produce equivalent outcomes to the OpenAI-based workflows
- [ ] No `CHATGPT_API_SECRET_KEY` or `openai` package anywhere in the codebase
- [ ] Action published to GitHub Marketplace as `@xn-intenton-z2a/agentic-step`

#### 19. Workflow Hardening (Critical Subset)

7 critical hardening items: traceability (commit URLs in logs), safety (check-before-act), debuggability (log outcomes), and deduplication. Implemented across `logging.js`, `safety.js`, `config-loader.js`, and task handlers.

**Items:** 2.1 (commit URLs), 2.2 (log outcomes), 2.4 (nop for resolved), 2.8 (context in comments), 2.15 (path separation), 2.17 (reusable patterns), 2.25 (check before generate)
**Status:** Done

**Acceptance Criteria:**
- [ ] intentïon.md entries include commit URLs
- [ ] Attempt check outcomes are logged
- [ ] Resolved issues return nop without generating code
- [ ] Issue comments include context about what happened
- [ ] Writable/non-writable paths are separated in agent prompts

#### 20. Discussions Bot Intelligence

Extends the bot with proactive feature management and mission protection. The bot can create, update, and delete features, and pushes back on mission-violating requests. Uses `[ACTION:create-feature]` and `[ACTION:nop]` patterns.

**Items:** 3.3 (bot manages features), 3.4 (bot protects mission)
**Status:** Done

**Acceptance Criteria:**
- [ ] Bot creates features when requested via Discussion
- [ ] Bot declines requests that violate the mission with an explanation
- [ ] Bot can delete/update existing features through Discussion interaction

#### 21. Onboarding Experience

The critical path from discovery to running autonomous development. Includes `demo.sh` (automated demo), `DEMO.md` (expected output), `GETTING-STARTED.md` (3-step Copilot setup), and pristine template state.

**Items:** 4.1 (scripted setup), 4.8 (automated demo), 4.10 ("Hello World!" initial state), 4.11 (clean template)
**Status:** Done

**Acceptance Criteria:**
- [ ] `demo.sh` runs end-to-end without manual intervention
- [ ] GETTING-STARTED.md describes 3-step Copilot setup (no OpenAI key)
- [ ] repository0 initial state produces "Hello World!" output
- [ ] No experiment debris in repository0 template

#### 22. Supervisor (Reactive Orchestration)

`agent-supervisor.yml` — triggered by `workflow_run` completion events. Checks if workflows failed on agentic/copilot branches → dispatches `fix-code`. Checks for stale issues → dispatches `review`.

**Status:** Done

**Acceptance Criteria:**
- [ ] Build failure on agentic branch triggers fix-code within 5 minutes
- [ ] Stale issues trigger review automatically
- [ ] Supervisor does not create infinite dispatch loops

#### 23. TDD Workflow

Feature development that starts with a failing test. The `evolve` task in TDD mode: (1) creates test capturing the feature requirement, (2) commits it (test fails), (3) writes implementation to make test pass, (4) PR contains both test and implementation.

**Status:** Done

**Acceptance Criteria:**
- [ ] Evolve task in TDD mode creates a failing test first
- [ ] Second step makes the test pass
- [ ] PR contains both test and implementation
- [ ] Non-TDD mode still works as before

#### 24. Showcase Page

A page on xn--intenton-z2a.com showing live experiment status from stats JSON on S3. Displays past successful evolutions with links to repositories, PRs, and activity logs.

**Repository:** xn--intenton-z2a.com
**Status:** Done

**Acceptance Criteria:**
- [ ] Showcase page loads and renders experiment data
- [ ] At least 2 experiments displayed with stats
- [ ] Links to repositories, PRs, and activity logs work
- [ ] Page is accessible from the main website navigation

#### 25. Submission Box

"What is your intentïon?" submission box on the website. Creates a GitHub Discussion via Giscus, which the discussions bot picks up and processes. Includes terms, pronunciation guide, and brand tagline.

**Repository:** xn--intenton-z2a.com
**Status:** Done

**Acceptance Criteria:**
- [ ] Submission box renders on the website
- [ ] Submitting creates a GitHub Discussion
- [ ] Terms and conditions are displayed and must be accepted
- [ ] Discussions bot processes the submission

### New Features (#26-29)

#### 26. Verification & Testing

Integration testing to prove the system works end-to-end against real infrastructure.

| Aspect | Detail |
|--------|--------|
| **What it does** | Tests the agentic-step action against the real Copilot SDK. Tests what agentic-lib publishes for repository0 consumption. Tests agentic flows in repository0 (model flows in agentic-lib first, repository0 is showcase). Tests demo repository fitness — examining output from #28 and #29. |
| **Repositories** | agentic-lib, repository0 |
| **Why now** | The code is written but untested against real infrastructure. Without verification, we can't know if the MVP actually works. |

**Status:** Pending

#### 27. Code Reduction & Optimization

Make the MVP compact and information-dense — fewer files, less redundancy, easier to understand.

| Aspect | Detail |
|--------|--------|
| **What it does** | Inline or remove remaining legacy `wfr-*` files that are only used by keeper workflows. Consolidate redundant workflows. Remove dead code paths. Minimize the number of files a contributor needs to understand. |
| **Repositories** | agentic-lib, repository0 |
| **Why now** | MVP should be lean. Every unnecessary file is cognitive overhead for new users who clone the template. |

**Status:** Pending

#### 28. Library Demo Repository

A JS library that evolves autonomously from a mission, demonstrating the "library" repository type.

| Aspect | Detail |
|--------|--------|
| **What it does** | A new repository created from the repository0 template with a library-focused mission. Evolves autonomously. Published to npm. Output is captured and examined as part of a fitness test (see #26). |
| **Repositories** | New repository (from repository0 template) |
| **Why now** | The showcase needs real examples. A library that built itself from a mission statement is the most compelling proof. |

**Status:** Pending

#### 29. Website Demo Repository

A website that evolves autonomously from a mission, demonstrating the "website" repository type.

| Aspect | Detail |
|--------|--------|
| **What it does** | A new repository created from the repository0 template with a website-focused mission. Evolves autonomously. Deployed to GitHub Pages. The deployed site is examined/tested as a fitness test (see #26). |
| **Repositories** | New repository (from repository0 template) |
| **Why now** | Websites are visual — a self-evolving website is immediately impressive and shareable. |

**Status:** Pending

---

## Critical Success Criteria

### 1. The Demo Works

**One impressive, public, end-to-end demo running.**

A real repository that started from a 3-sentence mission and evolved into a working, tested, published package — with the full intentïon.md audit trail visible. Must be reproducible (`demo.sh`), impressive (working CLI tool or library, not just "Hello World"), transparent (every decision logged), and recordable (2-minute video).

**Test:** "Would a developer share this on social media after watching it?"

### 2. The Loop Closes

**The full autonomous cycle completes without human intervention.**

Mission → Features → Issues → Code → Tests pass → PR → Auto-merge → Issue closed. When tests fail, fix-code kicks in. When features stall, the system prunes. Self-sustaining — not just one pass but a continuous cycle.

**Test:** "Can I write a mission, walk away for 48 hours, and come back to merged PRs with passing tests?"

### 3. Anyone Can Clone It

**A stranger can go from discovery to running autonomous development in under 10 minutes.**

No prior knowledge. No OpenAI API key. No AWS setup. Just: create from template, write a mission, enable Copilot, wait.

**Test:** "Can someone who found this via a Hacker News link get their own repo evolving before they lose interest?"

### Decision filter

For any feature, bug fix, or architectural decision, ask:

1. Does this make the demo more impressive?
2. Does this help the loop close more reliably?
3. Does this make it easier for a stranger to clone and run?

If the answer to all three is "no," it's post-MVP work.

---

## Go-to-Market Strategy

### Getting Traction

**Three audiences, three framings:**

| Audience | Pitch | Distribution |
|----------|-------|-------------|
| Solo devs / side-project builders | "Set it and forget it. Write what you want, come back tomorrow to a PR." | Show HN, Reddit r/programming, dev Twitter/Bluesky |
| Teams / open source maintainers | "An AI contributor that handles dependency updates, linting fixes, and feature requests from Discussions — you just review PRs." | Dev advocacy, conference talks, blog posts |
| Microsoft / GitHub | "This is the most advanced Copilot SDK integration in the wild." | GitHub Universe talk, GitHub Stars program, Marketplace listing |

**Launch moves (priority order):**

1. **The demo** — single most important marketing asset
2. **GitHub Marketplace listing** for `agentic-step`
3. **Blog post**: "I let AI evolve my code for 30 days. Here's what happened."
4. **Show HN** with blog post and live showcase
5. **Showcase page** on xn--intenton-z2a.com with live stats

### Getting Microsoft's Attention

intentïon is one of the first projects to build a full autonomous development loop on GitHub's own infrastructure using the Copilot SDK. Realistic paths: GitHub Universe talk, GitHub Stars program, Marketplace featured listing, Copilot SDK feedback, build in public.

### Revenue Streams (Post-Launch)

The MVP is pre-revenue. Revenue follows attention.

| Phase | Revenue Model | Target |
|-------|--------------|--------|
| Launch | Free Marketplace action + showcase | GitHub stars, visibility |
| +3 months | Freemium tier — Pro features ($9-29/mo per repo) | Active repos using free tier |
| +6 months | Consulting — autonomous dev setup ($2-5k) | Teams who've seen the demo |
| +12 months | Managed service ($99-499/mo) | Teams wanting the loop without setup |
| +18 months | Enterprise license ($500-2k/mo per team) | Orgs with security requirements |

---

## Implementation Plan

### Phase 1: Foundation (Done)

Build the `agentic-step` action and prove it works for a single task. Scaffold action, implement `resolve-issue` and `fix-code` tasks, add `copilot-setup-steps.yml`, update `ci-automerge.yml` for `copilot/*` branches, implement `config-loader.js` + `safety.js`.

### Phase 2: Full Pipeline (Done)

Port all LLM tasks to `agentic-step`. Implement all 8 task handlers (`evolve`, `maintain-features`, `maintain-library`, `enhance-issue`, `review-issue`, `discussions`), logging.js, and the simplified workflow set (15 agentic-lib + 8 repository0).

### Phase 3: Hardening (Done)

Make it reliable and safe. Implement workflow hardening items, discussions bot intelligence, supervisor workflow, TDD mode, test suite (32 tests), and integration test structure.

### Phase 4: Template & Launch (Done)

Clean repository0 to pristine template state. Write `demo.sh` + `DEMO.md`, update getting-started guide, update READMEs, write API.md, implement website updates (tagline, submission box, showcase page). Structural reorganisation to `.github/agentic-lib/` namespace.

---

## Changelog

- **2026-02-28** — Consolidated FEATURES.md + MVP.md into single document. Deleted legacy workflows (33 agentic-lib + 16 repository0 = 49 files). Added features #26-29 (Verification & Testing, Code Reduction & Optimization, Library Demo Repository, Website Demo Repository). Renumbered FEATURES_ROADMAP.md from #26-37 to #30-41.

---

## Related Documents

- **[FEATURES_ROADMAP.md](FEATURES_ROADMAP.md)** — Post-MVP features (#30-41)
- **[_archive/PLAN_COPILOT_LIVE.md](_archive/PLAN_COPILOT_LIVE.md)** — Archived execution plan (Option E delivered)
