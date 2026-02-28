# FEATURES_ROADMAP — Post-MVP Features

Features planned for after MVP delivery. These are compelling capabilities that require a working system first, or represent expansion beyond the core product.

Each feature in this list is **mutually exclusive** with [FEATURES.md](FEATURES.md) (#1–29).

---

## Table of Contents

30. [Workflow Hardening (Remaining)](#30-workflow-hardening-remaining)
31. [Discussions Bot (Remaining)](#31-discussions-bot-remaining)
32. [UX Journey & Onboarding (Remaining)](#32-ux-journey--onboarding-remaining)
33. [Evolution Engine](#33-evolution-engine)
34. [Collaboration & Feature Marketplace](#34-collaboration--feature-marketplace)
35. [Cost Model & Recycling](#35-cost-model--recycling)
36. [Supervisor Launch (Visualization)](#36-supervisor-launch-visualization)
37. [Chat-Pro (Paid Platform)](#37-chat-pro-paid-platform)
38. [Repository0-web (New Template)](#38-repository0-web-new-template)
39. [Brand & Infrastructure (Remaining)](#39-brand--infrastructure-remaining)
40. [CDK Hardening](#40-cdk-hardening)
41. [Additional Workflow Capabilities](#41-additional-workflow-capabilities)

---

## 30. Workflow Hardening (Remaining)

Incremental improvements to orchestration workflows not required for MVP.

| Aspect | Detail |
|--------|--------|
| **What it does** | Addresses the remaining 18 hardening items: branch cleanup, feature pruning aggressiveness, mission completion handling, naming conventions, prompt optimisation, AWS config management, and test organisation. |
| **Repositories** | agentic-lib, repository0 |
| **Why deferred** | These are quality-of-life improvements. The MVP critical subset (in FEATURES #19) covers the must-have items. |

### Items

| ID | Item |
|----|------|
| 2.3 | Clear old intention branches that were not completed |
| 2.5 | Be more ruthless about deleting completed/irrelevant features |
| 2.6 | Be more aggressive about declaring missions complete |
| 2.7 | Rename branch to `intentïon-mission-complete-<name>-<date>` on completion |
| 2.9 | Pull branch prefixes into agentic-lib.yml |
| 2.10 | Move branch prefix config to agentic-lib.yml |
| 2.11 | Make agent prompt filenames match top-level workflow filenames |
| 2.12 | Make reusable workflow names match top-level workflow filenames |
| 2.13 | Limit issue comments in prompts to last N (configurable) |
| 2.14 | Reduce recent commits in prompts to 10 |
| 2.16 | Pull max file sizes into agent config |
| 2.18 | Place all AWS config in repository variables |
| 2.19 | Add tests for the actions library JS and organise the code |
| 2.20 | Complete in-progress: rename seed-repository workflow |
| 2.21 | Complete in-progress: call seed workflow for flow feature development |
| 2.22 | Complete in-progress: give bot ability to invoke seed workflow |
| 2.23 | Complete in-progress: remove tests from outer workflows where wfr_* already runs them |
| 2.24 | Complete in-progress: simple stream of updates from seed to deliver a single feature |

---

## 31. Discussions Bot (Remaining)

Additional bot capabilities not required for MVP.

| Aspect | Detail |
|--------|--------|
| **What it does** | Three remaining bot improvements: workflow summarisation for context, cost transparency, and reseed guidance. |
| **Repositories** | agentic-lib |
| **Why deferred** | The MVP bot (FEATURES #20) handles core actions and mission protection. These are polish. |

### Items

| ID | Item |
|----|------|
| 3.1 | Summarise and sanitise all workflows so they can be passed to the bot |
| 3.2 | Post the cost of the response in each response |
| 3.5 | Bot guides users towards a reseed when feature request is misaligned |

---

## 32. UX Journey & Onboarding (Remaining)

User experience items beyond the MVP critical path.

| Aspect | Detail |
|--------|--------|
| **What it does** | Media content (video, YouTube), automated testing of the onboarding flow, API duration tracking, showcase gathering, and demo output publishing. |
| **Repositories** | agentic-lib, repository0, xn--intenton-z2a.com |
| **Why deferred** | The MVP onboarding (FEATURES #21) covers the critical path. These are marketing and measurement. |

### Items

| ID | Item |
|----|------|
| 4.2 | Screen capture the scripted flow and publish to YouTube |
| 4.3 | Request/commission a promotional video |
| 4.4 | Automate a test script for the onboarding process |
| 4.5 | Add API call duration to usage tracking |
| 4.6 | Echo bot repository summary messages in intentïon.md |
| 4.7 | Show past experiments as websites on intentïon.com |
| 4.9 | Extract demo output and publish in discussion thread for feedback |
| 4.12 | Gather complete experiments for the showcase |
| 4.13 | Collect examples of demo output for Actions documentation |

---

## 33. Evolution Engine

A self-evolving intelligence layer that learns from git history and adapts improvement strategies.

| Aspect | Detail |
|--------|--------|
| **What it does** | Parses commit history for improvement themes, tracks velocity, predicts next improvement areas, and dynamically adjusts workflow scheduling. The system learns which improvements get accepted and adapts. |
| **Repositories** | agentic-lib |
| **Why deferred** | Ambitious self-modifying AI. The core loop must work reliably first. |

### Items

| ID | Item |
|----|------|
| 5.1 | Git Trajectory Analysis — parse commit messages for themes, track velocity |
| 5.2 | Adaptive Strategy Learning — monitor acceptance rates, learn from PR feedback |
| 5.3 | Predictive Planning — predict next improvement areas from git history |
| 5.4 | Meta-Workflow Orchestration — dynamically schedule based on project phase |
| 5.5 | Effectiveness tracking database (SQLite or GitHub Issues) |
| 5.6 | Self-modifying workflow configurations that evolve with the project |

---

## 34. Collaboration & Feature Marketplace

Cross-repository collaboration and a marketplace for sharing features.

| Aspect | Detail |
|--------|--------|
| **What it does** | Mine archived branches for reusable code, cross-pollinate features between repositories, and build a marketplace where users can request and share features. |
| **Repositories** | agentic-lib |
| **Why deferred** | Cross-repo collaboration needs a user base first. |

### Items

| ID | Item |
|----|------|
| 6.1 | Mine past intentïon branches for reusable code fragments |
| 6.2 | Mine other workflows by posting on their GitHub Discussions |
| 6.3 | Bot processes attachments with license checking |
| 6.4 | Free premium features for collaborating repos with compatible licenses |
| 6.5 | Feature marketplace — users request features from the community |
| 6.6 | Farm features using spare capacity |
| 6.7 | Token cost available per feature for low-cost marketplace |

---

## 35. Cost Model & Recycling

Track, optimise, and recycle the cost of autonomous development.

| Aspect | Detail |
|--------|--------|
| **What it does** | Cost tracking per feature, A/B testing for value measurement, archived project mining, and cross-project feature reuse. |
| **Repositories** | agentic-lib |
| **Why deferred** | Optimisation assumes a working system to optimise. |

### Items

| ID | Item |
|----|------|
| 7.1 | Harvest archived repository0-* files into agentic-lib on reset |
| 7.2 | Mine archived projects for reusable features |
| 7.3 | Build features in a modular way for cross-project reuse |
| 7.4 | Bot summarises archive features during development |
| 7.5 | Log costs per feature: LLM tokens, API minutes, Actions minutes, AWS costs |
| 7.6 | Optimise costs against agentic-lib.yml parameters |
| 7.7 | A/B testing to measure value per feature |
| 7.8 | Explore differentiating factors that attribute costs to features |
| 7.9 | Scan archived branches for implemented features to recycle |

---

## 36. Supervisor Launch (Visualization)

An animated, interactive visualization of the agentic system in action.

| Aspect | Detail |
|--------|--------|
| **What it does** | Agent swim lane showing active agents, live commit branch visualization, animated issue workflow, animated git logs, animated PR raising, and a real-time scrolling timeline. |
| **Repositories** | agentic-lib, repository0 |
| **Why deferred** | High-effort UI. The stats dashboard covers observability for MVP. |

### Items

| ID | Item |
|----|------|
| 9.1 | Agent swim lane with solid regions showing active agents |
| 9.2 | Live links to repo on commit branch visualization with draggable timeline |
| 9.3 | Generate and publish visualization to GitHub Pages |
| 9.4 | Agent annotation of changes linked to commit visualization |
| 9.5 | Animate issue workflow |
| 9.6 | Animate git logs applying changes to files |
| 9.7 | Animate PR raising |
| 9.8 | Include visualization in repository0 template |
| 9.9 | Run live mode with real-time scrolling timeline |

---

## 37. Chat-Pro (Paid Platform)

A paid service layer providing guided autonomous development via chat.

| Aspect | Detail |
|--------|--------|
| **What it does** | Slack/Discord bots, recurring billing, API key provisioning, usage analytics, library browser plugin, and a website with auth and subscriptions. |
| **Repositories** | agentic-lib, xn--intenton-z2a.com |
| **Why deferred** | Monetisation is post-product-market-fit. |

### Items

| ID | Item |
|----|------|
| 10.1–10.19 | 19 items covering Slack bots, billing, API keys, usage analytics, library browser, website auth, content filtering, and prompt submission |

---

## 38. Repository0-web (New Template)

A web-focused template that generates content-driven websites from library documents.

| Aspect | Detail |
|--------|--------|
| **What it does** | A new template repository focused on web publishing: reduced workflows, example templates from library content, OWL semantic tags, news/analysis/social feeds, and automated posting. |
| **Repository** | New repo |
| **Why deferred** | Second template after the first one (repository0) is solid. |

### Items

| ID | Item |
|----|------|
| 11.1–11.17 | 17 items covering template creation, content generation, semantic tagging, news feeds, social posting, and orchestration via Discussions |

---

## 39. Brand & Infrastructure (Remaining)

Brand and infrastructure items not covered by MVP website updates.

| Aspect | Detail |
|--------|--------|
| **What it does** | Brand registration, social media, analytics, domain registration, CDK extraction, Maven upgrades, and stack reorganisation. |
| **Repository** | xn--intenton-z2a.com |
| **Why deferred** | Operational improvements that can be assigned to Copilot coding agent incrementally. |

### Items

| ID | Item |
|----|------|
| 12.1 | Brand ownership registration |
| 12.2 | Link to Linktree |
| 12.6 | Audience dashboard |
| 12.7 | Projects links page |
| 12.8 | Web analytics |
| 12.9 | Automated feed generation |
| 12.10 | Automated activity generation from showcased projects |
| 12.11–12.12 | Contact bots for socials, Slack, Discord, Reddit |
| 12.13 | Brand protection |
| 12.14 | Register additional domains |
| 12.15–12.16 | Extract CDK deploy and CI deploy to open source |
| 12.17–12.26 | Deployment, Maven, stack and lib organisation |

---

## 40. CDK Hardening

Production hardening of the AWS CDK stack (22 TODO comments in `AgenticLibApp.java`).

| Aspect | Detail |
|--------|--------|
| **What it does** | LogGroup retention, S3 lifecycle policies, table TTLs, Lambda timeouts, removal policies, and configuration parameters. |
| **Repository** | agentic-lib |
| **Why deferred** | Operational. Each item is an excellent candidate for Copilot coding agent to resolve incrementally. |

### Items

| ID | Item |
|----|------|
| 13.1–13.17 | 17 items covering CDK resource configuration, retention policies, and property extraction |

---

## 41. Additional Workflow Capabilities

New workflow patterns that don't fit the core feature set.

| Aspect | Detail |
|--------|--------|
| **What it does** | Commentator (news feed), PR review workflow, CHANGELOG generation, API.md generation, workflow diagram. |
| **Repository** | agentic-lib |
| **Why deferred** | Nice-to-haves. Some (14.4, 14.5) are included in MVP documentation deliverables. |

### Items

| ID | Item |
|----|------|
| 14.1 | Commentator: news feed sources, updates, commentary, web publish |
| 14.3 | PR review workflow with reviewer and responder |
| 14.4 | Update CHANGELOG.md when publishing a release |
| 14.5 | Generate API.md from source files |
| 14.6 | Diagram the workflow interactions |

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — All 29 features (#1–29)
- **[_archive/PLAN_COPILOT_LIVE.md](_archive/PLAN_COPILOT_LIVE.md)** — Archived execution plan (Option E delivered)
