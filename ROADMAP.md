# ROADMAP — intenti\u00efn Project

Items on this roadmap represent work beyond what is documented in [FEATURES.md](FEATURES.md) (the current feature inventory). FEATURES.md describes *what exists today* and how each feature maps to Option E. This roadmap describes *what to build next*.

---

## 1. Copilot Migration (PLAN_COPILOT_LIVE)

See [PLAN_COPILOT_LIVE.md](PLAN_COPILOT_LIVE.md) for full details, options analysis, and phasing.

**Phase 1 — Hybrid (Option D):** Replace code generation with Copilot coding agent, keep orchestration.
**Phase 2 — Expand:** Migrate all LLM tasks to Copilot CLI, remove OpenAI dependency.
**Phase 3 — SDK Rewrite (Option E):** Build `agentic-step` GitHub Action using Copilot SDK, publish to Marketplace.

| Step | Description | Repos |
|------|-------------|-------|
| 1.1 | Add `copilot-setup-steps.yml` to agentic-lib and repository0 | agentic-lib, repository0 |
| 1.2 | Modify `agent-transformation-issue-to-code.yml` to assign issues to Copilot | agentic-lib |
| 1.3 | Modify `agent-flow-fix-code.yml` to use `@copilot` on PRs | agentic-lib |
| 1.4 | Update `ci-automerge.yml` to handle `copilot/*` branches | agentic-lib, repository0 |
| 1.5 | Migrate discussions bot to Copilot CLI | agentic-lib |
| 1.6 | Migrate feature/library maintenance to Copilot CLI | agentic-lib |
| 1.7 | Remove OpenAI dependency (CHATGPT_API_SECRET_KEY) | agentic-lib, repository0 |
| 1.8 | Build `agentic-step` GitHub Action wrapping Copilot SDK | agentic-lib |
| 1.9 | Simplify all flow/transformation workflows to use `agentic-step` | agentic-lib, repository0 |
| 1.10 | Publish `agentic-step` to GitHub Marketplace | agentic-lib |

---

## 2. Workflow Hardening [Launch]

Incremental improvements to existing orchestration workflows needed before the system is launch-ready. These improve features already documented in FEATURES.md but are not themselves new features.

| Item | Description | Repos |
|------|-------------|-------|
| 2.1 | Add commit URL links to the intenti\u00efn.md activity log | agentic-lib |
| 2.2 | Log attempt check outcomes in intenti\u00efn.md | agentic-lib |
| 2.3 | Add job to clear old intention branches that were not completed | agentic-lib |
| 2.4 | Return nop when issue is already resolved, handle it positively | agentic-lib |
| 2.5 | Be more ruthless about deleting completed/irrelevant features | agentic-lib |
| 2.6 | Be more aggressive about declaring missions complete | agentic-lib |
| 2.7 | Rename branch to `intenti\u00efn-mission-complete-<name>-<date>` on completion | agentic-lib |
| 2.8 | Add context to all issue comments (e.g. "After review, this issue was found to be already done") | agentic-lib |
| 2.9 | Pull branch prefixes (`apply-fix-`, `issue-worker-`) into agentic-lib.yml | agentic-lib |
| 2.10 | Move branch prefix config to agentic-lib.yml | agentic-lib |
| 2.11 | Make agent prompt filenames match top-level workflow filenames | agentic-lib |
| 2.12 | Make reusable workflow names match top-level workflow filenames | agentic-lib |
| 2.13 | Limit issue comments attached to prompts to last N (configurable) | agentic-lib |
| 2.14 | Reduce recent commits in prompts to 10 | agentic-lib |
| 2.15 | Separate writable and non-writable file paths in the prompt | agentic-lib |
| 2.16 | Pull max file sizes into agent config | agentic-lib |
| 2.17 | Move check-attempts-limit into a reusable workflow | agentic-lib |
| 2.18 | Place all AWS config in repository variables (skip steps if blank) | agentic-lib |
| 2.19 | Add tests for the actions library JS and organise the code | agentic-lib |
| 2.20 | Complete in-progress: rename seed-repository workflow | agentic-lib |
| 2.21 | Complete in-progress: call seed workflow for flow feature development | agentic-lib |
| 2.22 | Complete in-progress: give bot ability to invoke seed workflow | agentic-lib |
| 2.23 | Complete in-progress: remove tests from outer workflows where wfr_* already runs them | agentic-lib |
| 2.24 | Complete in-progress: simple stream of updates from seed to deliver a single feature | agentic-lib |
| 2.25 | Check if resolved issue before generating code (shared TODO in issue-to-code workflow) | agentic-lib, repository0 |

---

## 3. Discussions Bot Improvements

Enhancements to the existing discussions bot (FEATURES.md #6).

| Item | Description | Repos |
|------|-------------|-------|
| 3.1 | Summarise and sanitise all workflows so they can be passed to the bot | agentic-lib |
| 3.2 | Post the cost of the response in each response | agentic-lib |
| 3.3 | Allow bot to update and delete features proactively | agentic-lib |
| 3.4 | Bot pushes back if a feature request violates the mission/contributing guidelines | agentic-lib |
| 3.5 | Bot guides users towards a reseed when feature request is misaligned with mission | agentic-lib |

---

## 4. UX Journey & Onboarding

User-facing experience from discovering intenti\u00efn to having a running autonomous repository.

| Item | Description | Repos |
|------|-------------|-------|
| 4.1 | Script the process from request to cloning and running workflows | agentic-lib, repository0 |
| 4.2 | Screen capture the scripted flow and publish to YouTube | agentic-lib |
| 4.3 | Request/commission a promotional video | agentic-lib |
| 4.4 | Automate a test script for the onboarding process | agentic-lib |
| 4.5 | Add API call duration to usage tracking | agentic-lib |
| 4.6 | Echo bot repository summary messages in intenti\u00efn.md | agentic-lib |
| 4.7 | Show past experiments as websites on intenti\u00efn.com | agentic-lib, xn--intenton-z2a.com |
| 4.8 | Automated demo workflow: demo.sh + DEMO.md | agentic-lib |
| 4.9 | Extract demo output and publish in discussion thread for feedback | agentic-lib |
| 4.10 | Set initial states to "Hello World!" and capture output | agentic-lib |
| 4.11 | Keep repository0 clean as template; reference experiments separately | repository0 |
| 4.12 | Gather complete experiments for the intenti\u00efn.com showcase | agentic-lib |
| 4.13 | Collect examples of demo output for Actions documentation | agentic-lib |

---

## 5. Evolution Engine

A self-evolving intelligence layer that learns from git history and adapts improvement strategies. Source: `agentic-lib/evolution-engine.md`.

| Item | Description | Repos |
|------|-------------|-------|
| 5.1 | Git Trajectory Analysis — parse commit messages for improvement themes, track velocity, identify recurring debt | agentic-lib |
| 5.2 | Adaptive Strategy Learning — monitor which improvements get accepted, learn from PR review feedback | agentic-lib |
| 5.3 | Predictive Planning — predict next improvement areas from git history, balance maintenance vs features | agentic-lib |
| 5.4 | Meta-Workflow Orchestration — dynamically schedule workflows based on code changes and project phase | agentic-lib |
| 5.5 | Effectiveness tracking database (SQLite or GitHub Issues) | agentic-lib |
| 5.6 | Self-modifying workflow configurations that evolve with the project | agentic-lib |

---

## 6. Collaboration & Feature Marketplace

Cross-repository collaboration and a marketplace for sharing features.

| Item | Description | Repos |
|------|-------------|-------|
| 6.1 | Mine past intenti\u00efn branches for reusable code fragments | agentic-lib |
| 6.2 | Mine other workflows by posting on their GitHub Discussions | agentic-lib |
| 6.3 | Bot processes attachments with license checking and context linking | agentic-lib |
| 6.4 | Free premium features for collaborating repositories with compatible licenses | agentic-lib |
| 6.5 | Feature marketplace — users request features from the community | agentic-lib |
| 6.6 | Farm features using spare capacity to build for the community | agentic-lib |
| 6.7 | Token cost available per feature, creating a low-cost feature marketplace | agentic-lib |

---

## 7. Cost Model & Recycling

Track, optimise, and recycle the cost of autonomous development.

| Item | Description | Repos |
|------|-------------|-------|
| 7.1 | Harvest archived repository0-* files into agentic-lib on reset | agentic-lib |
| 7.2 | Mine archived projects for reusable features | agentic-lib |
| 7.3 | Build features in a modular way for cross-project reuse | agentic-lib |
| 7.4 | Bot summarises archive features and mines them during development | agentic-lib |
| 7.5 | Log costs per feature: LLM tokens, API minutes, Actions minutes, AWS costs | agentic-lib |
| 7.6 | Optimise costs per feature against agentic-lib.yml parameters | agentic-lib |
| 7.7 | A/B testing to measure value per feature | agentic-lib |
| 7.8 | Explore differentiating factors that attribute costs to features | agentic-lib |
| 7.9 | Scan archived branches for implemented features to recycle | agentic-lib |

---

## 8. Supervisor

Reactive orchestration layer that triggers workflows based on telemetry.

| Item | Description | Repos |
|------|-------------|-------|
| 8.1 | Invoke agentic-lib workflows based on GitHub telemetry projections (e.g. build broken => apply fix) | agentic-lib |
| 8.2 | Relabel "engine" to "schedule" | agentic-lib |

---

## 9. Supervisor Launch (Visualization)

An animated, interactive visualization of the agentic system in action.

| Item | Description | Repos |
|------|-------------|-------|
| 9.1 | Agent swim lane showing which agent is active with solid regions | agentic-lib |
| 9.2 | Live links to repository on a commit branch visualization with draggable timeline | agentic-lib |
| 9.3 | Generate and publish visualization to GitHub Pages | agentic-lib |
| 9.4 | Agent annotation of changes linked to commit branch visualization | agentic-lib |
| 9.5 | Animate issue workflow | agentic-lib |
| 9.6 | Animate git logs applying changes to files | agentic-lib |
| 9.7 | Animate PR raising | agentic-lib |
| 9.8 | Include visualization in the repository0 template | repository0 |
| 9.9 | Run live mode with a real-time scrolling timeline | agentic-lib |

---

## 10. Chat-Pro (Paid Platform)

A paid service layer on top of the agentic system, providing guided autonomous development via chat.

| Item | Description | Repos |
|------|-------------|-------|
| 10.1 | (paid) Guide and receive feedback via Slack bot or GitHub Discussions | agentic-lib |
| 10.2 | (capped) Cross-repo feature discussions on Slack | agentic-lib |
| 10.3 | Recurring billing platform integration | agentic-lib |
| 10.4 | (paid) Provision API keys directly to target repository | agentic-lib |
| 10.5 | Usage analytics for users | agentic-lib |
| 10.6 | (paid) Usage throttling for issued API keys | agentic-lib |
| 10.7 | Costing model for API keys | agentic-lib |
| 10.8 | Support multiple keys per repository | agentic-lib |
| 10.9 | Support multiple repositories per account | agentic-lib |
| 10.10 | Library browser plugin | agentic-lib |
| 10.11 | Talk to the code: Slack bot taking instructions from humans | agentic-lib |
| 10.12 | (paid) Remember all interactions and use as context for future interactions | agentic-lib |
| 10.13 | (paid) Analyse user interactions vs actual outcomes | agentic-lib |
| 10.14 | (paid) Suggest improvements and direction changes to users | agentic-lib |
| 10.15 | Pricing principles: margin on shared costs, free tier for zero-cost features, BYOKeys alternative for every paid feature | agentic-lib |
| 10.16 | Website with GitHub/Google auth, all features available via subscription | agentic-lib, xn--intenton-z2a.com |
| 10.17 | Website kicks off creation and invites to chat (multiple platforms) | agentic-lib, xn--intenton-z2a.com |
| 10.18 | Content filtering for the website | xn--intenton-z2a.com |
| 10.19 | Website allows prompt submission for an experiment repo (one at a time, runs on branch, shares permalink) | agentic-lib, xn--intenton-z2a.com |

---

## 11. Repository0-web (New Template)

A web-focused template repository that generates content-driven websites from library documents.

| Item | Description | Repos |
|------|-------------|-------|
| 11.1 | New template for repository0-web (without AWS) | new repo |
| 11.2 | Reduce workflows to web publishing and node CI only (elaborator role) | new repo |
| 11.3 | Create example templates using content from the library | new repo |
| 11.4 | Generator script/action to create the mission from supplied text | new repo |
| 11.5 | agent-discussions to be able to re-initialise from a discussions post | new repo |
| 11.6 | Identify a range of means of accessing library content (EJS, REST) | new repo |
| 11.7 | Add OWL semantic tags to library content | new repo |
| 11.8 | Extract OWL from library content into JSON and publish as content | new repo |
| 11.9 | Collect a library of assets downloaded from crawls | new repo |
| 11.10 | Store and present license and content attribution information | new repo |
| 11.11 | ./news — event-based news sources scanned and catalogued | new repo |
| 11.12 | ./analysis — news articles reviewed in context of library topics | new repo |
| 11.13 | ./socials — commentary feed created from analysis articles | new repo |
| 11.14 | (paid) Post to socials | new repo |
| 11.15 | (paid) Responder suggestions of content in comments added to sources | new repo |
| 11.16 | Complete in-progress: set up repository0-web as documents-only (elaboration role) | agentic-lib |
| 11.17 | Complete in-progress: orchestrate creation of repository0-web via Discussions | agentic-lib |

---

## 12. Brand & Infrastructure (xn--intenton-z2a.com)

Non-feature improvements to the website and its infrastructure. See also FEATURES.md #9 and #11 for the existing capabilities.

| Item | Description | Repos |
|------|-------------|-------|
| 12.1 | Brand ownership registration | xn--intenton-z2a.com |
| 12.2 | Link to Linktree from website | xn--intenton-z2a.com |
| 12.3 | "What is your intenti\u00efn?" tagline and pronunciation guide | xn--intenton-z2a.com |
| 12.4 | "What is your intenti\u00efn?" submission box with terms and conditions | xn--intenton-z2a.com |
| 12.5 | Showcase links page | xn--intenton-z2a.com |
| 12.6 | Audience dashboard | xn--intenton-z2a.com |
| 12.7 | Projects links page | xn--intenton-z2a.com |
| 12.8 | Web analytics | xn--intenton-z2a.com |
| 12.9 | Automated feed generation | xn--intenton-z2a.com |
| 12.10 | Complete in-progress: automated activity generation from showcased projects | xn--intenton-z2a.com |
| 12.11 | Add contact bots for socials | xn--intenton-z2a.com |
| 12.12 | Add contact bots via Slack / Discord / Reddit | xn--intenton-z2a.com |
| 12.13 | Brand protection | xn--intenton-z2a.com |
| 12.14 | Register additional domains: intentiion.com, intentionai.com, intentiionai.com, intentiionaii.com | xn--intenton-z2a.com |
| 12.15 | Extract CDK deploy to open source under intenti\u00efn | xn--intenton-z2a.com |
| 12.16 | Extract CI deploy action to open source under intenti\u00efn | xn--intenton-z2a.com |
| 12.17 | Deploy through to live including tests | xn--intenton-z2a.com |
| 12.18 | Quick deploy for application stack only | xn--intenton-z2a.com |
| 12.19 | Maven version upgrades | xn--intenton-z2a.com |
| 12.20 | Maven clean running (no warnings) | xn--intenton-z2a.com |
| 12.21 | Move stacks to stacks directory | xn--intenton-z2a.com |
| 12.22 | Move libs to libs directory | xn--intenton-z2a.com |
| 12.23 | Pull WebConstants into a Config module's Parameters class | xn--intenton-z2a.com |
| 12.24 | Encapsulate stacks and consider single-stack architecture | xn--intenton-z2a.com |
| 12.25 | Complete in-progress: CI deployment | xn--intenton-z2a.com |
| 12.26 | Complete in-progress: CDK deploy | xn--intenton-z2a.com |

---

## 13. CDK Hardening (agentic-lib)

Production hardening of the AWS CDK stack. 22 TODO comments in `AgenticLibApp.java`.

| Item | Description | Repos |
|------|-------------|-------|
| 13.1 | Build new main.js from s3-sqs-bridge package | agentic-lib |
| 13.2 | Switch to removal policy | agentic-lib |
| 13.3 | Set LogGroup retention periods | agentic-lib |
| 13.4 | Set S3 LogGroup prefix | agentic-lib |
| 13.5 | Configure S3 bucket CloudTrail enable/disable | agentic-lib |
| 13.6 | Add S3 bucket object lifecycle policy (delete after 1 month) | agentic-lib |
| 13.7 | Configure DLQ postfix | agentic-lib |
| 13.8 | Set SQS Queue and DLQ retention periods | agentic-lib |
| 13.9 | Set offsets table partition key | agentic-lib |
| 13.10 | Set offsets table stack removal policy | agentic-lib |
| 13.11 | Set offsets table TTL (1 month) | agentic-lib |
| 13.12 | Set projections table partition key | agentic-lib |
| 13.13 | Set projections table stack removal policy | agentic-lib |
| 13.14 | Set projections table TTL (1 month) | agentic-lib |
| 13.15 | Set Lambda LogGroup prefix | agentic-lib |
| 13.16 | Set Lambda timeouts (3 items) | agentic-lib |
| 13.17 | Convert enable/disable versioning to properties | agentic-lib |

---

## 14. Additional Workflow Capabilities

New workflow patterns that don't fit the existing FEATURES.md categories.

| Item | Description | Repos |
|------|-------------|-------|
| 14.1 | Commentator: news feed sources, updates, commentary, web publish | agentic-lib |
| 14.2 | Literate: TDD approach — start feature branch with failing test, alert fix-code to the test addition | agentic-lib |
| 14.3 | PR review workflow with a reviewer and responder | agentic-lib |
| 14.4 | Update CHANGELOG.md when publishing a release | agentic-lib |
| 14.5 | Generate API.md from source files | agentic-lib |
| 14.6 | Diagram the workflow interactions | agentic-lib |

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — What exists today (17 features, Option E mappings)
- **[PLAN_COPILOT_LIVE.md](PLAN_COPILOT_LIVE.md)** — Copilot migration options and phasing
- **[MVP.md](MVP.md)** — Minimum Viable Product definition
- **[MVP.md](MVP.md)** — Minimum Viable Product definition
