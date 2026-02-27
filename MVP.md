# MVP — intentïon: Autonomous Code Evolution on GitHub Copilot

**Goal:** A clonable GitHub template that turns a mission statement into working, tested, deployed code — autonomously, using GitHub Copilot as the only AI engine.

**Target audience:** Any developer with a GitHub Copilot subscription who wants to describe what they want and watch it build itself.

**Tagline:** *"What is your intentïon?"*

---

## Why This, Why Now (February 2026)

### The landscape

Everyone has AI coding assistants. GitHub Copilot, Claude Code, Cursor, Windsurf — they all help you write code faster. But they're all **reactive**: you ask, they answer.

Nobody ships a **fully autonomous code evolution loop** as a clonable template. The closest things are:
- GitHub Copilot coding agent (one issue at a time, no lifecycle)
- Various "AI DevOps" tools (proprietary, SaaS, vendor lock-in)
- Research projects (not production-ready, not GitHub-native)

### What intentïon offers that nothing else does

1. **Mission-driven**: You write what you want in plain English. The system derives features, creates issues, writes code, runs tests, merges PRs, and closes issues — in a continuous loop.
2. **Self-healing**: When tests fail, the fix-code agent kicks in. When features stall, the system reseeds. When issues pile up, it prunes.
3. **Transparent**: Every action is logged in intentïon.md with commit links, token usage, and outcomes. A live stats dashboard shows what's happening.
4. **Community-interactive**: A discussions bot lets anyone steer the evolution by posting in GitHub Discussions.
5. **Zero vendor lock-in**: GitHub Actions + GitHub Copilot. No external APIs, no proprietary SaaS. You own the code, the data, and the process.
6. **Clone and go**: Create from template, write a mission, enable Copilot. That's it.

### Why someone would clone this

- **Solo developers** who want continuous progress on side projects without daily effort
- **Teams** wanting an autonomous maintenance/improvement agent for existing repos
- **Educators** teaching autonomous systems, DevOps, or AI-assisted development
- **Open source maintainers** who want an AI contributor that follows their mission
- **Anyone curious** about what happens when you let AI evolve code from a mission statement

---

## MVP Scope

The MVP delivers **all 17 features from [FEATURES.md](FEATURES.md)** ported to GitHub Copilot (Option E from [PLAN_COPILOT_LIVE.md](PLAN_COPILOT_LIVE.md)), plus selected items from [ROADMAP.md](ROADMAP.md) that make the product coherent and compelling.

### What's in

| # | Capability | Source | Rationale |
|---|-----------|--------|-----------|
| 1 | Autonomous code evolution loop | FEATURES #1 | Core proposition |
| 2 | Issue lifecycle management | FEATURES #2 | Essential for the loop |
| 3 | Feature lifecycle management | FEATURES #3 | Drives issue creation |
| 4 | Code generation & fixing | FEATURES #4 | The actual code writing |
| 5 | Auto-merge & branch management | FEATURES #5 | Closes the loop |
| 6 | Discussions bot | FEATURES #6 | Community entry point |
| 7 | Statistics & observability | FEATURES #7 | Proof the system works |
| 8 | Publishing pipeline | FEATURES #8 | npm + GitHub Pages |
| 9 | Website & brand | FEATURES #9 | Project identity |
| 10 | AWS infrastructure (agentic-lib) | FEATURES #10 | Telemetry backend |
| 11 | AWS infrastructure (website) | FEATURES #11 | Website hosting |
| 12 | CI/CD & code quality | FEATURES #12 | Tests, lint, format |
| 13 | Configuration & safety | FEATURES #13 | Guardrails |
| 14 | Template system | FEATURES #14 | The clonable template |
| 15 | Library & knowledge management | FEATURES #15 | Context for code gen |
| 16 | Maintenance & hygiene | FEATURES #16 | Self-cleaning |
| 17 | Scripts & utilities | FEATURES #17 | Operational tooling |
| 18 | Copilot migration (full) | PLAN_COPILOT_LIVE | Port from OpenAI to Copilot SDK |
| 19 | Workflow hardening (critical) | ROADMAP #2 (subset) | Stability for launch |
| 20 | Discussions bot intelligence | ROADMAP #3 (subset) | Bot must be smart enough |
| 21 | Onboarding experience | ROADMAP #4 (subset) | Must be clone-and-go |
| 22 | Supervisor (reactive orchestration) | ROADMAP #8 | Reactive triggers |
| 23 | TDD workflow | ROADMAP #14.2 | Strong differentiator |
| 24 | Showcase page | ROADMAP #12.5 | Proves the system works |
| 25 | Submission box | ROADMAP #12.4 | Community entry from website |

### What's out (post-MVP)

| ROADMAP Section | Why deferred |
|----------------|--------------|
| #5 Evolution Engine | Ambitious self-modifying AI — compelling vision, but the core loop must work first |
| #6 Collaboration & Feature Marketplace | Cross-repo collaboration needs user base first |
| #7 Cost Model & Recycling | Optimisation assumes a working system to optimise |
| #9 Supervisor Launch (Visualization) | High-effort UI; the stats dashboard covers observability for MVP |
| #10 Chat-Pro (Paid Platform) | Monetisation is post-product-market-fit |
| #11 Repository0-web (New Template) | Second template after the first one is solid |
| #13 CDK Hardening | Operational — assign to Copilot coding agent incrementally |
| #14.1 Commentator | Content generation is a nice-to-have |
| #14.3 PR review workflow | Copilot already reviews its own PRs |
| #14.6 Workflow diagram | Documentation, not functionality |

---

## MVP Deliverables

### D1: `agentic-step` GitHub Action

The single most important deliverable. A GitHub Action wrapping the Copilot SDK that replaces all 23 `wfr-completion-*` reusable workflows.

**Inputs:**
```yaml
inputs:
  task:
    description: "What to do (e.g. resolve-issue, maintain-features, respond-to-discussion)"
  config:
    description: "Path to agentic-lib.yml"
    default: ".github/agents/agentic-lib.yml"
  instructions:
    description: "Path to agent prompt file"
  issue-number:
    description: "GitHub issue number (when task involves an issue)"
  writable-paths:
    description: "Semicolon-separated paths the agent may write to"
  test-command:
    description: "Command to validate changes"
    default: "npm test"
```

**Internal architecture:**
```
agentic-step/
├── action.yml              # Action metadata
├── index.js                # Entry: parse inputs, load config, run SDK
├── config-loader.js        # Parse agentic-lib.yml
├── safety.js               # WIP limits, attempt tracking, path enforcement
├── tasks/
│   ├── resolve-issue.js    # Issue → code → PR
│   ├── maintain-features.js # Feature lifecycle
│   ├── maintain-library.js # Library from sources
│   ├── enhance-issue.js    # Add testable criteria
│   ├── review-issue.js     # Close resolved issues
│   ├── discussions.js      # Discussion bot responses
│   ├── evolve.js           # Full mission → code pipeline
│   └── fix-code.js         # Fix failing tests
├── logging.js              # intentïon.md writer
└── package.json            # @github/copilot-sdk + dependencies
```

**Published to GitHub Marketplace** as `@xn-intenton-z2a/agentic-step`.

### D2: Simplified Workflow Set

From 59 workflows (agentic-lib) + 31 workflows (repository0) to:

**agentic-lib (15 workflows):**

| Workflow | Purpose | Schedule |
|----------|---------|----------|
| `agent-flow-evolve.yml` | Mission → features → issues → code → PR | Daily |
| `agent-flow-maintain.yml` | Feature + library + source maintenance | Weekly |
| `agent-flow-review.yml` | Close resolved issues, prune features | Every 3 days |
| `agent-flow-fix-code.yml` | Fix failing PRs via `agentic-step` | On check_suite failure |
| `agent-discussions-bot.yml` | Respond to GitHub Discussions | On discussion event |
| `agent-supervisor.yml` | Reactive triggers from telemetry | On workflow_run |
| `ci-test.yml` | Run tests on push/PR | On push, PR |
| `ci-automerge.yml` | Auto-merge passing PRs | On PR, check_suite |
| `ci-formatting.yml` | Prettier + ESLint | On push |
| `ci-update.yml` | npm/Maven dependency updates | Weekly |
| `publish-stats.yml` | Stats to S3 + GitHub Pages | Daily |
| `publish-web.yml` | Dashboard to GitHub Pages | On push |
| `publish-packages.yml` | npm + Marketplace action | On release |
| `utils-truncate-workflow-history.yml` | Clean old workflow runs | Weekly |
| `agent-archive-intentïon.yml` | Archive activity log | Monthly |

**repository0 (8 workflows):**

| Workflow | Purpose |
|----------|---------|
| `agent-flow-evolve.yml` | Calls agentic-step |
| `agent-flow-maintain.yml` | Calls agentic-step |
| `agent-flow-review.yml` | Calls agentic-step |
| `agent-flow-fix-code.yml` | Calls agentic-step |
| `agent-discussions-bot.yml` | Calls agentic-step |
| `ci-test.yml` | Standard CI |
| `ci-automerge.yml` | Auto-merge (incl. copilot/* branches) |
| `publish-packages.yml` | npm publishing |

### D3: Copilot Integration Files

**Per repository:**
```
.github/
  copilot-setup-steps.yml     # Node 20, npm ci, env setup
  agents/
    agentic-lib.yml           # Configuration (paths, limits, schedules)
    agent-evolve.md           # Mission → code agent prompt
    agent-maintain-features.md # Feature lifecycle prompt
    agent-maintain-library.md # Library maintenance prompt
    agent-maintain-sources.md # Source management prompt
    agent-issue-resolution.md # Code generation prompt
    agent-apply-fix.md        # Test fix prompt
    agent-enhance-issue.md    # Issue enhancement prompt
    agent-review-issue.md     # Issue review prompt
    agent-discussion-bot.md   # Discussions personality + actions
```

### D4: Workflow Hardening (Critical Subset)

From ROADMAP #2, the items required for MVP stability:

| ID | Item | Why MVP |
|----|------|---------|
| 2.1 | Commit URL links in intentïon.md | Proof of work needs to be traceable |
| 2.2 | Log attempt check outcomes | Debugging when things go wrong |
| 2.4 | Return nop for resolved issues | Prevents wasted cycles |
| 2.8 | Context in all issue comments | Users need to understand what happened |
| 2.15 | Separate writable/non-writable paths in prompt | Safety — core to sandbox model |
| 2.17 | Move check-attempts-limit to reusable workflow | Deduplication before simplification |
| 2.25 | Check if resolved before generating code | Prevents duplicate work |

### D5: Discussions Bot Intelligence

From ROADMAP #3:

| ID | Item | Why MVP |
|----|------|---------|
| 3.3 | Bot can update/delete features proactively | Bot must be able to act, not just talk |
| 3.4 | Bot pushes back on mission-violating requests | Safety — bot should protect the mission |

### D6: Onboarding Experience

From ROADMAP #4:

| ID | Item | Why MVP |
|----|------|---------|
| 4.1 | Script the clone-to-running process | The critical path must be documented |
| 4.8 | Automated demo: demo.sh + DEMO.md | People need to see it work before cloning |
| 4.10 | "Hello World!" initial state | First experience must be clean and visible |
| 4.11 | repository0 clean as template | Template must not contain experiment debris |

### D7: Supervisor (Reactive Orchestration)

From ROADMAP #8:

| ID | Item | Why MVP |
|----|------|---------|
| 8.1 | Invoke workflows from telemetry (e.g. build broken => fix) | Reactive behaviour makes the system feel intelligent |

Implemented as `agent-supervisor.yml` — a workflow triggered by `workflow_run` that checks telemetry projections and dispatches the appropriate flow workflow.

### D8: TDD Workflow

From ROADMAP #14.2:

A new flow where feature development starts with a failing test, then the fix-code agent writes the implementation. This is a differentiator — it's how good engineers work, and no other autonomous system does it.

```yaml
# agent-flow-evolve.yml (TDD mode)
# 1. agentic-step creates a test that captures the feature requirement
# 2. Test is committed (fails)
# 3. agentic-step writes implementation to make the test pass
# 4. PR created with both test and implementation
```

### D9: Website Updates

From ROADMAP #12:

| ID | Item | Why MVP |
|----|------|---------|
| 12.3 | "What is your intentïon?" tagline + pronunciation guide | Brand identity |
| 12.4 | Submission box with terms | Community entry point from the web |
| 12.5 | Showcase page | Proves the system produces real results |

The submission box creates a GitHub Discussion via Giscus, which the discussions bot picks up — completing the circle from website visitor to autonomous development.

### D10: Updated Documentation

| Document | Content |
|----------|---------|
| `README.md` (agentic-lib) | What it is, how it works, getting started in 3 steps |
| `README.md` (repository0) | "Create from template" → mission → watch it evolve |
| `GETTING-STARTED.md` | Step-by-step with screenshots (updated for Copilot) |
| `DEMO.md` | What to expect when you run it |
| `CHANGELOG.md` (from ROADMAP #14.4) | Release history |
| `API.md` (from ROADMAP #14.5) | agentic-step action inputs/outputs reference |

---

## Architecture

### Before (Current — 99 workflows)

```
OpenAI API (o4-mini) ──→ 23 wfr-completion-* workflows
                          ↕
                      10 transformation workflows ──→ 10 flow workflows
                          ↕
                      GitHub Script (inline JS)
```

### After (MVP — 23 workflows + 1 action)

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
| GitHub Actions minutes | ~99 workflows | ~23 workflows |

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

Build the `agentic-step` action and prove it works for a single task.

| Step | What | Acceptance criteria |
|------|------|-------------------|
| 1.1 | Scaffold `agentic-step` action with Copilot SDK | Action runs, authenticates, returns output |
| 1.2 | Implement `resolve-issue` task | Given an issue number, generates code, creates PR |
| 1.3 | Implement `fix-code` task | Given a failing PR, fixes tests, pushes commit |
| 1.4 | Add `copilot-setup-steps.yml` to both repos | Copilot coding agent can run tests |
| 1.5 | Update `ci-automerge.yml` for `copilot/*` branches | Copilot PRs auto-merge when checks pass |
| 1.6 | Implement config-loader.js + safety.js | Reads agentic-lib.yml, enforces limits |

### Phase 2: Full Pipeline (Weeks 3-4)

Port all LLM tasks to the `agentic-step` action.

| Step | What | Acceptance criteria |
|------|------|-------------------|
| 2.1 | Implement `evolve` task (mission → code) | Full pipeline runs end-to-end |
| 2.2 | Implement `maintain-features` task | Features created/updated/pruned |
| 2.3 | Implement `maintain-library` task | Library documents maintained from sources |
| 2.4 | Implement `enhance-issue` task | Issues get testable acceptance criteria |
| 2.5 | Implement `review-issue` task | Resolved issues are closed |
| 2.6 | Implement `discussions` task | Bot responds to GitHub Discussions |
| 2.7 | Implement logging.js (intentïon.md writer) | All actions logged with commit URLs |
| 2.8 | Write simplified workflow set (D2) | 15 agentic-lib + 8 repository0 workflows |

### Phase 3: Hardening (Weeks 5-6)

Make it reliable and safe.

| Step | What | Acceptance criteria |
|------|------|-------------------|
| 3.1 | Implement D4 workflow hardening items | All 7 items from the critical subset |
| 3.2 | Implement D5 discussions bot intelligence | Bot pushes back, creates/deletes features |
| 3.3 | Implement D7 supervisor workflow | Build failure triggers fix-code automatically |
| 3.4 | Implement D8 TDD workflow | Features start with failing test |
| 3.5 | Test suite for agentic-step action | Unit tests for config, safety, each task |
| 3.6 | Integration test: full evolution cycle | Clone template → write mission → verify PR created |

### Phase 4: Template & Launch (Weeks 7-8)

Clean up repository0, build onboarding, publish.

| Step | What | Acceptance criteria |
|------|------|-------------------|
| 4.1 | Clean repository0 to pristine template state | No experiment debris, "Hello World!" initial state |
| 4.2 | Write demo.sh + DEMO.md | Runnable demo with expected output |
| 4.3 | Update getting-started guide for Copilot | Screenshots, 3-step setup |
| 4.4 | Update README.md for both repos | Clear pitch, architecture diagram |
| 4.5 | Write API.md (agentic-step reference) | All inputs/outputs documented |
| 4.6 | Implement D9 website updates | Tagline, submission box, showcase page |
| 4.7 | Publish agentic-step to GitHub Marketplace | Action available for any repo to use |
| 4.8 | Remove OpenAI dependency entirely | No CHATGPT_API_SECRET_KEY anywhere |
| 4.9 | Tag v7.0.0 release | Semver major for the architecture change |

---

## Success Criteria

The MVP is done when:

1. **Clone and evolve**: Someone creates a repo from the repository0 template, writes a MISSION.md, enables Copilot, and within 24 hours has a PR with working code — without touching anything else.

2. **Self-healing**: When a PR fails tests, the fix-code agent creates a follow-up commit that passes, and the PR auto-merges.

3. **Community-driven**: A visitor to xn--intenton-z2a.com submits an intentïon via the submission box, the discussions bot picks it up, creates a feature, and the evolution loop builds it.

4. **Observable**: The stats dashboard shows live activity, intentïon.md has a clear audit trail with commit links, and the showcase page demonstrates past successful evolutions.

5. **No OpenAI dependency**: The entire system runs on GitHub Copilot subscription only. No external API keys required beyond GitHub.

6. **Publishable**: The `agentic-step` action is on GitHub Marketplace and any repository can use it.

---

## What Makes This Worth Cloning

### For the practical user
- "I had an idea for a CLI tool. I wrote 3 sentences in MISSION.md. Two days later I had a working npm package with tests, published to GitHub Pages, with an activity log of every decision the AI made."

### For the curious developer
- The stats dashboard showing branches created, PRs merged, issues closed — all without human intervention — is genuinely interesting to watch.

### For the team lead
- "We use this for our internal tools repo. It handles dependency updates, linting fixes, and small feature requests from our Discussions page. We just review and merge the PRs."

### For the open source maintainer
- "Contributors post feature requests in Discussions. The bot evaluates them against our mission, creates issues, and sometimes even implements them. We just review the PRs."

### What no other tool does (February 2026)
- **Continuous evolution**: Not just one-shot generation — ongoing, mission-aligned development
- **Feature discovery**: The system identifies what to build from the mission, not just how to build what you ask for
- **Self-healing loop**: Failures trigger fixes, stalls trigger reseeds, completed features trigger pruning
- **Transparent AI**: Every action logged with reasoning, costs, and outcomes
- **Community steering**: Discussions bot bridges human intent to autonomous action
- **Template-first**: Clone and go, no infrastructure to set up (beyond GitHub Copilot)
- **TDD by default**: Features start with failing tests — the AI writes tests first

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Complete inventory of 17 features with Option E mappings
- **[PLAN_COPILOT_LIVE.md](PLAN_COPILOT_LIVE.md)** — Copilot migration options analysis and phasing
- **[ROADMAP.md](ROADMAP.md)** — Full roadmap including post-MVP items
