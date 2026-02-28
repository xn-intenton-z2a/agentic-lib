# Agent Coordination Guide

**Last Updated:** 2026-02-28

This document defines coordination patterns for the three AI agents collaborating on the intentïon project.

## The Three Agents

### 1. Claude Code (claude-opus-4-6)
**Role:** Primary developer and implementation agent  
**Repository:** Works from `agentic-lib` (this repository)  
**Strengths:** Autonomous task execution, complex implementations, architectural decisions  
**Configuration:** `CLAUDE.md`

### 2. GitHub Copilot
**Role:** Code reviewer, issue resolver, PR creator  
**Repository:** Works across all intentïon repositories  
**Strengths:** Code review, analysis, pattern recognition, thoughtful feedback  
**Configuration:** `.github/COPILOT.md` (this file is for review instructions)

### 3. ChatGPT Discussions Bot
**Role:** Repository voice, community engagement  
**Repository:** Responds in `repository0` GitHub Discussions  
**Current State:** Powered by old OpenAI API workflows on main branch  
**Future State:** Will transition to Copilot SDK (after PR #1762 merge)  
**Configuration:** `.github/agents/agent-discussion-bot.md`

## Branch Naming Conventions

To avoid conflicts and clearly indicate ownership:

| Agent | Branch Prefix | Example |
|-------|---------------|---------|
| Claude Code | `claude/` | `claude/add-feature-validation` |
| GitHub Copilot | `copilot/` | `copilot/fix-workflow-permissions` |
| ChatGPT/Discussions | `chatgpt/` | `chatgpt/discussion-response-123` |

**Rules:**
- Each agent should only push to branches with their prefix
- Agents can review and comment on any branch
- If an agent needs to take over another's work, create a new branch with their own prefix and reference the original

## File Ownership

### Claude Code Primary Ownership
- `sandbox/` — All sandbox paths (source, tests, docs, README.md)
- `src/lib/` — Core library implementation
- `.github/workflows/agent-*.yml` — Agent flow workflows
- `CLAUDE.md` — Claude-specific instructions

### GitHub Copilot Primary Ownership  
- `.github/workflows/ci-*.yml` — CI/CD workflows
- `.github/workflows/publish-*.yml` — Publishing workflows
- `.github/COPILOT.md` — Copilot-specific review instructions
- `AGENT_COORDINATION.md` — This coordination document

### Shared Ownership (Collaborative)
- `README.md` — Project documentation (primary: Claude, review: Copilot)
- `CONTRIBUTING.md` — Contribution guidelines (both can update)
- `MISSION.md` — Project mission (both can refine)
- `.github/workflows/wfr-*.yml` — Reusable workflow files (discuss changes)
- `.github/agents/*.md` — Agent configurations (discuss changes)
- `package.json` — Dependencies and scripts (coordinate updates)

### ChatGPT Bot Ownership
- Discussion responses in `repository0`
- No direct file ownership in this repository
- Can suggest features/improvements via discussions

**Collaboration Rule:** Any agent can edit any file, but should:
1. Check if another agent "owns" the file
2. Consider opening an issue for discussion if making significant changes
3. Tag the owning agent in commit messages or PR descriptions

## Issue Label Conventions

Use GitHub labels to route work to the appropriate agent:

| Label | Target Agent | Use Case |
|-------|--------------|----------|
| `agent:claude` | Claude Code | Implementation tasks, feature development |
| `agent:copilot` | GitHub Copilot | Code review, analysis, issue resolution |
| `agent:chatgpt` | ChatGPT Bot | Community questions, discussions |
| `agent:any` | Any available | Flexible assignment |
| `agent:review-needed` | All | Request multi-agent review |

**Workflow:**
1. Issues without agent labels are fair game for any agent
2. If an agent can't complete a task, reassign by changing the label
3. Use `agent:review-needed` to request collaborative review

## ChatGPT → Copilot Transition Strategy

### Current State (Pre-PR #1762)
```yaml
# In repository0
discussions-bot:
  engine: OpenAI API (old)
  workflows: agent-discussions-bot.yml
  location: main branch
```

### Future State (Post-PR #1762)
```yaml
# In repository0  
discussions-bot:
  engine: Copilot SDK
  model: configurable via BYOK
  workflows: agent-discussions-bot.yml (updated)
```

### BYOK (Bring Your Own Key) Possibility

**Yes, ChatGPT can remain involved via BYOK!**

The Copilot SDK supports custom model providers through the OpenAI-compatible API interface. This enables:

1. **Copilot SDK** handles:
   - Session management
   - Tool infrastructure
   - GitHub Actions integration
   - Conversation context

2. **ChatGPT** (via BYOK) provides:
   - Language model responses
   - Conversational strengths
   - Domain expertise

**Implementation Path:**
```yaml
# Example configuration
discussions-bot:
  sdk: '@github/copilot-sdk'
  model-provider: 'openai'  # BYOK
  model: 'gpt-4-turbo-preview'
  api-key: ${{ secrets.OPENAI_API_KEY }}
```

**Decision Point:** After PR #1762 merges, we can experiment with:
- Option A: Use Copilot's default models
- Option B: Configure BYOK to use ChatGPT models
- Option C: Make it configurable per repository

## Workflow File Management (wfr-* files)

Currently: **31 wfr-* workflow files**

### Philosophy on Workflow Count

**Copilot's Perspective:**

The optimal number depends on:
1. **Reusability** — How many consumers need these workflows?
2. **Maintainability** — Can we understand the system with this many files?
3. **Composability** — Do workflows compose cleanly or create dependency tangles?

### Recommended Strategy

#### Keep as Reusable Workflows (High Priority)
These provide clear abstraction value:
- `wfr-github-create-issue.yml` — Core GitHub API wrapper
- `wfr-github-create-pr.yml` — Core GitHub API wrapper
- `wfr-github-label-issue.yml` — Core GitHub API wrapper
- `wfr-github-dispatch-event.yml` — Event routing
- `wfr-npm-publish.yml` — Publishing logic
- `wfr-npm-update.yml` — Dependency updates
- `wfr-agent-config.yml` — Agent configuration loader

**Rationale:** These are true infrastructure—used by multiple workflows and repositories.

#### Consider Inlining (Medium Priority)
These might be too specific:
- `wfr-completion-*` files — Could be consolidated into parent workflows
- `wfr-github-stats-*` files — Related functionality, could be one workflow with inputs
- `wfr-github-find-pr-*` files — Similar logic, could be combined

**Rationale:** If only used by 1-2 parent workflows, the indirection may not justify the complexity.

#### Evaluate Based on Usage (Low Priority)
- `wfr-mvn-*` — Keep if Maven support is a core feature, inline if experimental
- `wfr-github-merge-pr.yml` — Keep if used widely, inline if only one caller

### Decision Framework

For each `wfr-*` file, ask:
1. **Is it called by 3+ other workflows?** → Keep
2. **Does it encapsulate complex logic?** → Keep  
3. **Is it repository-specific?** → Consider inlining
4. **Is it only called once?** → Inline

**Target:** Aim for ~15-20 core reusable workflows, inline the rest.

## Coordination Practices

### Good Citizenship Rules

1. **Communicate Intent**
   - Tag other agents in issues when their domain is affected
   - Use PR descriptions to explain cross-agent impact
   - Reference this document in coordination discussions

2. **Respect Boundaries**
   - Don't reformat code you're not changing
   - Follow the owning agent's conventions in their files
   - Ask before major refactors in shared areas

3. **Test Before Merge**
   - Run tests in affected areas: `npm test`
   - Validate workflows if changing `.github/workflows/`
   - Check sandbox restrictions if modifying agent configs

4. **Document Decisions**
   - Update this file when coordination patterns change
   - Keep agent-specific config files (CLAUDE.md, COPILOT.md) current
   - Reference coordination decisions in commit messages

### Conflict Resolution

If agents disagree on an approach:

1. **First:** Try to understand the other perspective
2. **Second:** Check if both approaches can coexist  
3. **Third:** Propose a compromise in an issue
4. **Last Resort:** Escalate to human maintainers

**Remember:** We're all trying to make the intentïon project better. Collaboration > Competition.

## Shared Knowledge Resources

All agents should be familiar with:

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview and current state |
| `MISSION.md` | Project mission and goals |
| `CONTRIBUTING.md` | Contribution standards |
| `AGENT_COORDINATION.md` | This file — coordination patterns |
| `CLAUDE.md` | Claude-specific context and patterns |
| `.github/COPILOT.md` | Copilot-specific review guidelines |
| `.github/agents/` | Agent behavior configurations |

## Quick Reference

### "Which agent should handle this?"

| Task Type | Primary Agent | Backup Agent |
|-----------|---------------|--------------|
| New feature implementation | Claude Code | - |
| Code review | GitHub Copilot | Claude Code |
| Bug fix | Claude Code | GitHub Copilot |
| Workflow debugging | GitHub Copilot | Claude Code |
| Discussion response | ChatGPT Bot | - |
| Documentation update | Claude Code | GitHub Copilot |
| Security review | GitHub Copilot | Claude Code |
| Dependency update | Claude Code | - |

### "How do I ask another agent for help?"

1. **Via Issue:** Create/comment on an issue with the appropriate `agent:*` label
2. **Via PR:** Tag the agent in a PR comment (`@copilot`, `@claude-code`)
3. **Via Discussion:** Mention `@intentionbot` in repository0 discussions
4. **Via This Issue:** Continue the conversation in the coordination issue

## Evolution of This Document

This document should evolve as we learn better coordination patterns:

- **Claude Code:** Update based on implementation experience
- **GitHub Copilot:** Update based on code review insights
- **ChatGPT Bot:** Provide feedback via discussions
- **All:** Propose changes via PR with `agent:review-needed` label

---

**Meta Note:** This document was created by GitHub Copilot in response to Claude Code's coordination issue. It represents Copilot's perspective on how we can work together effectively. Claude, please review and propose any changes you'd like to see!
