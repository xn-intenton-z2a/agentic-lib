# PLAN_LAUNCH.md — Launch Strategy for intentïon agentic-lib

## What We've Built

An autonomous coding system that lives entirely inside a GitHub repository. Install it, write a MISSION.md, and the repository evolves itself — generating issues, writing code, running tests, opening PRs, maintaining documentation, and engaging with users through GitHub Discussions.

The system has no external dependencies beyond GitHub. It runs as GitHub Actions workflows on configurable schedules, uses the GitHub Copilot SDK for decision-making, and is distributed as a single npm package.

### Key Differentiators (March 2026)

| Capability | intentïon | GitHub Agentic Workflows | Copilot Coding Agent | Devin | Others |
|---|---|---|---|---|---|
| LLM supervisor dispatching multiple workflows | Yes | No | No | No | No |
| Cron-scheduled repo autonomy | Yes | Yes (tech preview) | No | No (DIY glue) | Gemini CLI Actions only |
| Discussions bot with supervisor relay | Yes | No | No | Slack (external) | No |
| `npm init` into any repo | Yes | No (CLI extension) | No | No | No |
| Self-contained in repo (no external services) | Yes | Partially | No | No | No |
| TOML-configurable limits/paths/schedule | Yes | No | No | No | No |
| Self-evolving from MISSION.md | Yes | No | No | No | No |

### Competitive Landscape

**GitHub Agentic Workflows** (tech preview, Feb 13 2026) — The closest competitor. AI agents in GitHub Actions with cron/event triggers. But: no supervisor layer, no discussions bot, no package distribution, no orchestration between workflows. Validates our architecture.

**Gemini CLI GitHub Actions** (Google, beta) — Single-agent workflows in GitHub Actions with cron. No orchestration, no discussions, no packaging.

**GitHub Copilot Coding Agent** — Reactive only (manual issue assignment). No scheduling, no supervisor, no multi-workflow orchestration. Closest match to our `agent-flow-transform` workflow alone.

**Devin 2.0, Cursor Cloud Agents, OpenAI Codex** — Powerful single-agent tools but external SaaS, not repo-resident, no scheduling, no autonomous lifecycle.

**SWE-agent, OpenHands, Open SWE** — Open-source issue-to-fix tools. Single-task execution, not repo-lifecycle-scoped.

---

## Getting Attention — Launch Plan

### Phase 1: Demonstrate (Week 1-2)

**Goal:** Create an irrefutable demo. "I wrote a MISSION.md, walked away, came back to a working project."

- [ ] Record a 3-minute screencast: create repo from template, write MISSION.md, time-lapse the autonomous cycle, show the resulting PRs and working code
- [ ] Create 3 demo repositories showing different missions:
  - CLI tool (CSV to JSON converter)
  - Library (string utilities package)
  - Web component (markdown renderer)
- [ ] Each demo should show the full lifecycle: issues created, code generated, tests passing, PRs merged, discussions bot responding
- [ ] Write a blog post: "I wrote a sentence and got a working project"

### Phase 2: Publish (Week 2-3)

**Goal:** Make it findable.

- [ ] Post the screencast and blog to:
  - Hacker News ("Show HN: An npm package that makes your GitHub repo evolve itself")
  - Reddit r/programming, r/github, r/artificial
  - Dev.to / Hashnode
  - Twitter/X with demo GIFs
- [ ] Submit to GitHub Marketplace as an Action (agentic-step)
- [ ] List on Product Hunt
- [ ] Create a GitHub Discussion in agentic-lib for "Show & Tell" — invite early users to share what they built
- [ ] Ensure npm README matches the GitHub README

### Phase 3: Engage (Week 3-4)

**Goal:** Build community.

- [ ] Respond to every HN/Reddit comment
- [ ] Create a "Getting Started in 5 minutes" video
- [ ] Write comparison posts: "intentïon vs GitHub Agentic Workflows" and "intentïon vs Copilot Coding Agent"
- [ ] Reach out to AI/DevOps newsletter authors
- [ ] Submit a talk proposal to a GitHub Universe / DevOps conference

### Phase 4: Iterate (Ongoing)

**Goal:** Respond to early user feedback.

- [ ] Track which missions succeed and which fail
- [ ] Add more seed templates (Python, Rust, etc.)
- [ ] Improve the discussions bot based on real conversations
- [ ] Consider a web UI for MISSION.md editing and real-time dashboard

---

## Messaging

### One-liner
> Bootstrap any GitHub repository with autonomous code transformation. Write a mission, watch it evolve.

### Elevator pitch
> intentïon is an npm package that installs autonomous AI workflows into any GitHub repository. You write a MISSION.md describing what you want to build, and the system generates issues, writes code, runs tests, opens PRs, and maintains documentation — all on a configurable schedule using the GitHub Copilot SDK. A supervisor agent orchestrates the pipeline, and users can interact through GitHub Discussions.

### For developers
> `npx @xn-intenton-z2a/agentic-lib init` — then write your mission. The 9 agentic task handlers (transform, resolve-issue, fix-code, maintain-features, maintain-library, enhance-issue, review-issue, discussions, supervise) run as GitHub Actions workflows. No external services. No API keys beyond GitHub. TOML-configurable. MIT-licensed distributed code.

### For decision-makers
> An open-source system that turns any GitHub repository into a self-evolving codebase. Reduce the overhead of issue triage, documentation maintenance, and routine code changes. The AI works within your existing GitHub permissions and CI/CD pipeline — no new vendors, no data leaving GitHub.

---

## Risks

1. **GitHub builds the supervisor layer into Agentic Workflows.** Mitigation: our packaging model and MISSION.md-driven approach remain distinctive. Move fast on community.
2. **Copilot SDK changes or access restrictions.** Mitigation: the architecture is model-agnostic. The copilot.js adapter can be swapped.
3. **Early users hit mission failures.** Mitigation: curate demo repos showing successful missions. Provide troubleshooting guides.
4. **npm package discovery.** Mitigation: GitHub Marketplace listing, SEO on the README, demo videos.

---

## Requirements for Template Repositories

See the main README for full setup instructions including GitHub permissions, tokens, and repository settings.
