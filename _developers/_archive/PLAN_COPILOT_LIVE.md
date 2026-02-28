# PLAN: Copilot Live — Replacing OpenAI with GitHub Copilot

## User Assertions

- Evaluate whether GitHub Copilot coding agent could achieve the goals of the current (non-archived) projects
- Consider making more direct use of delegating to GitHub Copilot
- The active projects are: agentic-lib, repository0, xn--intenton-z2a.com

## Related Documents

- **[FEATURES.md](../FEATURES.md)** — All 29 features (#1–29), product definition, architecture, and go-to-market strategy
- **[FEATURES_ROADMAP.md](../FEATURES_ROADMAP.md)** — Post-MVP features (#30–41)

---

## Current State

For the full feature-by-feature breakdown with Option E mappings, see [FEATURES.md](FEATURES.md).

### What agentic-lib does (59 workflows, 11 agent configs)

agentic-lib is an autonomous code evolution engine. It uses OpenAI API (o4-mini) to power a complete lifecycle:

```
Mission → Sources → Library → Features → Issues → Code → PR → Merge → Close
```

**By category:**

| Category | What it does | Workflows |
|----------|-------------|-----------|
| Transformations | 10-step pipeline from mission to merged code | 10 workflows |
| Orchestration | Scheduled feature dev, maintenance, linting, README updates | 10 flow workflows |
| CI/CD | Auto-test, auto-merge, formatting, dependency updates | 5 workflows |
| Publishing | Stats to S3, web to GitHub Pages, packages to npm/Maven | 3 workflows |
| Community | AI discussions bot (seed, create-feature, create-issue, stop) | 1 workflow |
| Reusable components | LLM completion workers, GitHub ops, package management | 23 wfr-* workflows |
| Utilities | Workflow/issue history truncation | 2 workflows |
| Observability | Activity log (intenti\u00efn.md), LLM token tracking, AWS S3 telemetry | Built into all |
| Safety | WIP limits, attempt limits, concurrency groups, sandbox isolation | Config-driven |

**Key dependencies:**
- OpenAI API (CHATGPT_API_SECRET_KEY) — all LLM completions
- AWS S3 — telemetry + public stats
- GitHub Actions — all workflow execution
- GitHub Script — inline JS in workflows

**Cost model:**
- OpenAI API tokens (o4-mini) — variable, per-completion
- GitHub Actions minutes — significant (59 workflows, many scheduled)
- AWS S3/Lambda — small (stats + telemetry)

### What repository0 does

A template repository that consumes agentic-lib's reusable workflows. Its `src/lib/main.js` evolves autonomously. Currently has 3 open issues being worked by the agentic system (CLI parsing, file watch, HTTP server).

### What xn--intenton-z2a.com does

Standalone AWS CDK infrastructure for the brand website. No agentic workflows. Not affected by this plan.

---

## GitHub Copilot Capabilities (as of Feb 2026)

### Copilot Coding Agent
- **Trigger**: Assign issue to Copilot, `@copilot` in PR comment, VS Code agents panel, security campaigns
- **Output**: One draft PR per task, on a `copilot/*` branch
- **Environment**: Ephemeral GitHub Actions sandbox with firewall-controlled internet
- **Custom agents**: `.github/agentic-lib/agents/*.md` — specialized prompt files
- **Setup**: `copilot-setup-steps.yml` — configure dev environment
- **Limits**: Single repo, single PR, cannot merge/approve, cannot push to main

### Copilot CLI (programmatic)
- `copilot -p "PROMPT"` — run Copilot programmatically in Actions
- Can be scheduled via cron in GitHub Actions workflows
- Useful for periodic tasks (README updates, maintenance)

### Copilot SDK (Technical Preview, Jan 2026)
- Languages: Node.js, Python, Go, .NET
- Provides the same agentic engine as Copilot CLI
- JSON-RPC communication with Copilot CLI process
- Requires Copilot subscription (or BYOK)
- Multi-model routing

### Cost
- Included in GitHub Copilot Pro/Pro+/Business/Enterprise subscription
- Counts toward monthly Actions minutes and premium request allowance
- No per-token OpenAI charges

---

## Gap Analysis

### What Copilot CAN replace directly

| Current agentic-lib capability | Copilot equivalent |
|-------------------------------|-------------------|
| Issue → code → PR (wfr-completion-generate-issue-resolution-in-code) | Assign issue to Copilot |
| Fix failing code (wfr-completion-generate-fix-for-code) | `@copilot` comment on PR |
| Issue enhancement (wfr-completion-enhance-issue) | Custom agent via `.github/agentic-lib/agents/enhancer.md` |
| README updates (wfr-completion-generate-update-for-readme) | Scheduled `copilot -p` CLI |
| Linting → issue (agent-flow-linting) | Copilot can fix linting issues directly |
| Feature → issue (wfr-completion-generate-feature-development-issue) | Custom agent + scheduled CLI |

### What Copilot CANNOT replace (needs orchestration wrapper)

| Current agentic-lib capability | Gap |
|-------------------------------|-----|
| Full lifecycle pipeline (mission → merge) | Copilot is task-responsive, not self-directed |
| Auto-merge (ci-automerge) | Copilot cannot merge its own PRs |
| WIP limits + attempt tracking | No built-in concurrency/retry control |
| Sandbox isolation with seed/reset | Copilot works on whole repo |
| intenti\u00efn.md activity logging | No built-in activity tracking |
| Stats/telemetry to S3 | Orthogonal to Copilot |
| Discussions bot | Copilot doesn't interact with Discussions API |
| Multi-step transformations | No pipeline state management |
| Feature lifecycle (create, maintain, prune) | No feature management |
| Branch conflict resolution | Copilot avoids conflicts by using copilot/* branches |

---

## Options

### Option A: Keep agentic-lib, swap OpenAI for Copilot SDK

**What changes:**
- Replace all `wfr-completion-*` workflows' OpenAI API calls with Copilot SDK calls
- The SDK runs as Node.js code, so the GitHub Script actions would call `@github/copilot-sdk` instead of the `openai` package
- Remove CHATGPT_API_SECRET_KEY dependency
- Keep all 59 workflows, all orchestration, all lifecycle management

**What stays the same:**
- All flow/transformation workflows
- Auto-merge, WIP limits, attempt tracking
- Stats pipeline, discussions bot
- Sandbox isolation, branch management
- intenti\u00efn.md activity logging

**Effort:** Medium
- Rewrite ~12 wfr-completion-* workflows to use Copilot SDK instead of OpenAI
- Test that Copilot SDK models produce equivalent quality to o4-mini
- Update secrets/config (remove OpenAI key, ensure Copilot subscription)

**Risk:**
- Copilot SDK is in Technical Preview — API may change
- Model quality difference (Copilot models vs o4-mini) is unknown
- BYOK mode only supports key-based auth, not managed identities

**Benefit:**
- Eliminates OpenAI API costs entirely
- Retains all existing orchestration and safety features
- Minimal architectural change
- Can fall back to OpenAI if needed

### Option B: Migrate to Copilot coding agent + thin orchestration

**What changes:**
- Delete all wfr-completion-* workflows (the LLM layer)
- Rewrite flow workflows to: create issue → assign to Copilot → wait for PR → auto-merge
- Build new orchestration workflows that monitor Copilot's `copilot/*` branches
- Implement state tracking (WIP, attempts) in a lightweight way (labels, branch naming)

**What stays the same:**
- CI workflows (test, format, update)
- Publishing workflows (stats, web, packages)
- Auto-merge (modified to handle `copilot/*` branches)
- Agent config files (repurposed as `.github/agentic-lib/agents/*.md`)

**New workflows needed:**
1. `copilot-assign-issue.yml` — Assigns ready issues to Copilot programmatically
2. `copilot-monitor-pr.yml` — Watches for Copilot draft PRs and triggers review
3. `copilot-lifecycle.yml` — Manages the feature → issue → assign → merge cycle
4. `copilot-retry.yml` — Re-assigns failed tasks with updated context

**Effort:** High
- Rewrite ~20 workflows
- Build new monitoring/orchestration layer
- Copilot's one-PR-per-task limit means sequential processing (no parallel work)
- Must handle Copilot's inability to merge (keep auto-merge)
- Must replace sandbox isolation with repo-level controls

**Risk:**
- Copilot coding agent is a black box — less control over prompts and context
- One PR per task is a hard limit — slows throughput
- Cannot control Copilot's model selection or token usage
- Copilot may not handle the specialized transformations well (mission→source, library maintenance)

**Benefit:**
- Eliminates OpenAI costs
- Leverages GitHub-native tooling
- Custom agents (`.github/agentic-lib/agents/*.md`) replace agent prompt files naturally
- Simpler mental model: "assign issue to Copilot, merge result"

### Option C: Full Copilot coding agent (no orchestration)

**What changes:**
- Remove ALL agentic workflows (keep only CI and publishing)
- Manually (or via simple cron) create issues and assign to Copilot
- Copilot creates PRs, humans review and merge
- No autonomous evolution — becomes a human-in-the-loop tool

**What stays the same:**
- CI workflows (test, format, update)
- Publishing workflows
- Repository structure

**Effort:** Low
- Delete ~40 workflows
- Configure `.github/agentic-lib/agents/*.md` with good prompts
- Set up `copilot-setup-steps.yml`
- Create a few scheduled Actions to create issues from features

**Risk:**
- Loses the core value proposition of autonomous evolution
- Becomes a standard Copilot setup — nothing differentiating
- Human bottleneck on review and merge
- No activity tracking, no telemetry, no discussions bot

**Benefit:**
- Massive simplification
- Near-zero maintenance
- No OpenAI costs
- Easy to understand and operate

### Option D: Hybrid — Copilot for code gen, keep agentic-lib for orchestration

**What changes:**
- Replace `wfr-completion-generate-issue-resolution-in-code` with Copilot issue assignment
- Replace `wfr-completion-generate-fix-for-code` with `@copilot` PR comments
- Keep all orchestration workflows but modify them to work with Copilot's patterns:
  - When a workflow would call OpenAI to write code, instead assign the issue to Copilot
  - When Copilot creates a `copilot/*` PR, the existing auto-merge picks it up
  - When auto-merge succeeds, the existing review workflow closes the issue
- Keep OpenAI for non-code tasks: issue enhancement, feature maintenance, library maintenance, discussions bot, README updates (or migrate these to Copilot CLI)

**What stays the same:**
- Flow orchestration (scheduling, lifecycle)
- Auto-merge
- WIP limits, attempt tracking
- Stats pipeline
- Discussions bot (still needs LLM — use Copilot CLI or keep OpenAI)
- Sandbox isolation (Copilot works within branch, merge rules enforce boundaries)

**Effort:** Medium-Low
- Modify ~5 workflows to assign issues to Copilot instead of calling OpenAI
- Add `copilot-setup-steps.yml` and `.github/agentic-lib/agents/*.md`
- Modify auto-merge to also watch `copilot/*` branches
- Optionally migrate non-code completions to Copilot CLI

**Risk:**
- Two LLM systems in play unless fully migrated (OpenAI for non-code, Copilot for code)
- Copilot's one-PR-per-task limit may conflict with WIP limits
- Need to handle the case where Copilot's PR fails tests (retry mechanism)
- Copilot branch naming (`copilot/*`) differs from current (`agentic-lib-issue-*`)

**Benefit:**
- Eliminates OpenAI costs for the most expensive operation (code generation)
- Copilot's code gen is likely better than o4-mini for GitHub-hosted code
- Retains all orchestration, lifecycle, and observability
- Incremental migration — can move one workflow at a time
- If Copilot fails, can fall back to OpenAI for specific tasks

### Option E: Copilot SDK as the new agentic-lib core

**What changes:**
- Rewrite agentic-lib's core as a Node.js application using the Copilot SDK
- The SDK provides the agentic execution loop — replace the current "GitHub Script + OpenAI" pattern
- Package as a GitHub Action (the long-planned "bundled action")
- Each workflow step calls the Copilot SDK action with a task description
- The SDK handles planning, tool use, and file edits internally

**What stays the same:**
- Workflow orchestration (scheduling, lifecycle) — simplified
- Auto-merge
- Stats pipeline
- Repository structure

**New architecture:**
```
.github/
  actions/
    agentic-step/         # Copilot SDK-powered action
      action.yml
      index.js            # Uses @github/copilot-sdk
  workflows/
    agent-flow-*.yml      # Simplified: call agentic-step action
    ci-*.yml              # Unchanged
    publish-*.yml         # Unchanged
```

**Effort:** High
- Build a new GitHub Action wrapping the Copilot SDK
- Rewrite all completion workflows to use the action
- The SDK is in Technical Preview — stability risk
- Need to handle SDK authentication (Copilot subscription per runner)

**Risk:**
- Copilot SDK is brand new (Jan 2026 Technical Preview)
- May not support the context window sizes needed (200K+ tokens)
- Authentication in Actions environment is uncharted
- SDK API may change before GA

**Benefit:**
- Clean architectural rewrite
- The "bundled action" from the TODO list becomes real
- Copilot SDK handles the agentic loop (planning, tool use) natively
- Aligns with the Marketplace GitHub Actions [Launch] TODO items
- See [FEATURES.md](FEATURES.md) for the full feature-by-feature Option E mapping

---

## Decision

**Option E (Copilot SDK as the new core)** — building directly on the SDK rather than phasing through D → D+ → E.

---

## Implementation Progress

### Phase 1: Foundation — COMPLETE

| Step | What | Status |
|------|------|--------|
| 1.1 | Scaffold `agentic-step` action with Copilot SDK | Done — `action.yml`, `index.js`, `package.json` |
| 1.2 | Implement `resolve-issue` task | Done — `tasks/resolve-issue.js` |
| 1.3 | Implement `fix-code` task | Done — `tasks/fix-code.js` |
| 1.4 | Add `copilot-setup-steps.yml` to both repos | Done — agentic-lib + repository0 |
| 1.5 | Update `ci-automerge.yml` for `copilot/*` branches | Done — both repos |
| 1.6 | Implement `config-loader.js` + `safety.js` | Done — WIP limits, attempt tracking, path enforcement |

### Phase 2: Full Pipeline — COMPLETE

| Step | What | Status |
|------|------|--------|
| 2.1 | Implement `evolve` task (mission → code) | Done — `tasks/evolve.js` |
| 2.2 | Implement `maintain-features` task | Done — `tasks/maintain-features.js` |
| 2.3 | Implement `maintain-library` task | Done — `tasks/maintain-library.js` |
| 2.4 | Implement `enhance-issue` task | Done — `tasks/enhance-issue.js` |
| 2.5 | Implement `review-issue` task | Done — `tasks/review-issue.js` |
| 2.6 | Implement `discussions` task | Done — `tasks/discussions.js` |
| 2.7 | Implement `logging.js` (intentïon.md writer) | Done — with `logSafetyCheck` |
| 2.8 | Write simplified workflow set | Done — 6 agentic-lib + 5 repository0 workflows |

### Phase 3: Hardening — COMPLETE

| Step | What | Status |
|------|------|--------|
| 3.1 | Workflow hardening (D4 items) | Done — safety logging, writable/read-only path separation, context in issue comments |
| 3.2 | Discussions bot intelligence (D5) | Done — update/delete feature actions, mission protection |
| 3.3 | TDD workflow (D8) | Done — `tdd: true` config, two-phase evolution |
| 3.4 | Test suite for agentic-step action | Done — 32 tests across config-loader, safety, logging |

### Phase 4: Template & Launch — MOSTLY COMPLETE

| Step | What | Status |
|------|------|--------|
| 4.1 | Clean repository0 to pristine template state | Done — "Hello World" main.js, clean test, removed experiment debris |
| 4.2 | Write `demo.sh` + `DEMO.md` | Done — functional demo script + expected output docs |
| 4.3 | Update getting-started guide for Copilot | Done — 3-step Copilot setup, no OpenAI key |
| 4.4 | Update README.md for both repos | Done — clear pitch + template-focused |
| 4.5 | Write API.md (agentic-step reference) | Done — all inputs/outputs/tasks documented |
| 4.6 | Website updates (tagline, submission box, showcase page) | Done — index.html + showcase.html |
| 4.7 | Publish agentic-step to GitHub Marketplace | Pending |
| 4.8 | Remove OpenAI dependency entirely | Done — removed from package.json, seeds, docs (legacy wfr-* workflows still reference it) |
| 4.9 | Tag v7.0.0 release | Pending |

### Structural reorganisation

Distributed content (agents, actions, features, seeds, scripts) moved from `.github/` to `.github/agentic-lib/` in both repositories. This separates intentïon-specific content from standard GitHub infrastructure (workflows, copilot-setup-steps, dependabot). All references updated across workflows, configs, scripts, and documentation.

### Across all phases: xn--intenton-z2a.com

The website repo is not directly affected by the Copilot migration but benefits from it:
- Its 23 pending brand/infrastructure TODOs can be assigned to Copilot coding agent
- Automated content generation (social posts from activity logs) via Copilot CLI
- The "What is your intentïon?" submission box feeds through Giscus → GitHub Discussions → discussions bot

See [FEATURES.md #9 (Website & Brand)](FEATURES.md#9-website--brand) and [#11 (AWS Infrastructure — Website)](FEATURES.md#11-aws-infrastructure--website) for full details.

---

## Impact on Open TODO Items

| TODO Category | Items | Impact of Copilot migration |
|--------------|-------|---------------------------|
| [Launch] workflow improvements | 14 open | Still needed — orchestration is retained |
| Discussions Bot | 2 open | Phase 2 — migrate to Copilot CLI |
| UX journey | 9 open | Unaffected — presentation layer |
| Collaboration | 7 open | Copilot custom agents could help |
| Marketplace Actions | 8 open | Phase 3 delivers several of these |
| Cost model | 9 open | Simplified — Copilot is subscription-based |
| Supervisor | 1 open | Retained |
| chat-pro | 21 open | Partially addressed by Copilot agents |
| Supervisor launch | 9 open | Unaffected — visualization layer |
| Repository0-web | 16 open | Copilot custom agents could help |

---

## Decision Made

**Option E selected.** Implementation is in progress on the `refresh` branch across all 3 repositories. Phases 1-3 are complete. Phase 4 (template cleanup, onboarding, documentation, website, publish) is in progress.

See [FEATURES.md](FEATURES.md) for the detailed feature-by-feature Option E implementation mapping covering all 17 capabilities across all 3 repositories. See [FEATURES_MVP.md](FEATURES_MVP.md) for the additional MVP features (#18–25) and the critical success criteria for pre-revenue launch.

---

## Sources

- [About GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent)
- [GitHub Copilot: Meet the new coding agent](https://github.blog/news-insights/product-news/github-copilot-meet-the-new-coding-agent/)
- [How to maximize Copilot's agentic capabilities](https://github.blog/ai-and-ml/github-copilot/how-to-maximize-github-copilots-agentic-capabilities/)
- [Build an agent with the GitHub Copilot SDK](https://github.blog/news-insights/company-news/build-an-agent-into-any-app-with-the-github-copilot-sdk/)
- [GitHub Copilot SDK repository](https://github.com/github/copilot-sdk)
- [Schedule GitHub Coding Agents](https://luke.geek.nz/azure/schedule-github-coding-agents/)
- [Copilot SDK February 2026 update](https://dev.to/dharani0419/github-copilot-evolves-sdk-launch-agentic-memory-new-ai-models-february-2026-update-35g9)
