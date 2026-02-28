# Multi-Agent Coordination Guidelines

**Purpose:** Patterns and practices for coordinating work between Claude Code, GitHub Copilot, and the ChatGPT discussions bot.

**Last Updated:** 2026-02-28 by @copilot

---

## Agents in This Ecosystem

1. **Claude Code** (`claude-opus-4-6`) — Primary development agent, autonomous task execution
2. **GitHub Copilot** (`@copilot`) — Code review, SDK integration guidance, strategic questions
3. **ChatGPT Bot** (via `agent-discussions-bot.yml`) — Community engagement in repository0 Discussion #2401

---

## Communication Channels

### Claude ↔ Copilot
- **Primary**: PR comments (this PR and future PRs)
- **Secondary**: Issues assigned to `copilot-swe-agent`
- **Documentation**: `CLAUDE_AND_COPILOT.md` (persistent record)

### Claude ↔ ChatGPT Bot
- **Primary**: repository0 Discussion #2401 comments via GraphQL API
- **Method**: `gh api graphql` with mutation `addDiscussionComment`

### Copilot ↔ ChatGPT Bot
- Currently no direct channel — Claude acts as intermediary

---

## File Ownership Model

To avoid conflicts, we use a **file ownership model** where each agent has primary ownership of certain areas:

### Claude Code owns:
- Implementation files (`src/`, `sandbox/`, `.github/agentic-lib/actions/`)
- PLAN_*.md files (task planning)
- Test files (`tests/`, `sandbox/tests/`)
- Workflow YAML files (`.github/workflows/`)

### Copilot owns:
- Code review feedback (via PR comments)
- `.github/COPILOT.md` (Copilot-specific guidelines)
- SDK integration guidance (no direct file writes)

### ChatGPT Bot owns:
- Discussion #2401 content (community engagement)
- No direct file writes in agentic-lib

### Shared ownership:
- `CLAUDE_AND_COPILOT.md` — both agents contribute
- `FEATURES.md`, `README.md`, `CONTRIBUTING.md` — Claude edits, Copilot reviews

---

## Branch Naming Conventions

To identify which agent created a branch:

- `claude/*` — Claude Code branches
- `copilot/*` — Copilot branches
- `chatgpt/*` — ChatGPT bot branches (if it ever gets write access)

---

## Issue Labels

Use labels to route work:

- `claude-task` — Tasks for Claude Code
- `copilot-review` — Requests for Copilot review
- `multi-agent` — Work requiring coordination
- `discussions-bot` — Work affecting the discussions bot

---

## Conflict Resolution

If two agents modify the same file:

1. **Check PR timestamps** — earlier PR has priority
2. **Explicit coordination** — one agent should comment and wait for response
3. **Rebase if needed** — later PR rebases on earlier PR's changes
4. **Escalate to human** — if conflict can't be resolved autonomously

---

## Daily Check-In Pattern

Claude Code should:
1. Check PLAN_*.md files for active goals
2. Check open PRs from other agents
3. Comment on repository0 Discussion #2401 once per day
4. Respond to Copilot's PR comments
5. Update `CLAUDE_AND_COPILOT.md` with new learnings

Copilot should:
1. Respond to PR review requests
2. Answer SDK-related questions
3. Provide strategic guidance on architecture
4. Create PRs for recommendations (not direct commits)

---

## Work Handoffs

When Claude needs Copilot's input:
1. **Tag @copilot in PR comment** with specific questions
2. **Wait for response** before proceeding if answer is blocking
3. **Document in CLAUDE_AND_COPILOT.md** after getting answers

When Copilot makes recommendations:
1. **Open a PR** with recommended changes
2. **Assign to Claude** (via comment) for review
3. **Claude decides** whether to merge or adapt

---

## Best Practices

### For Claude Code:
- ✅ Identify yourself as "Claude Code (claude-opus-4-6)" in comments
- ✅ Ask concrete questions that require Copilot's SDK knowledge
- ✅ Document conversations in `CLAUDE_AND_COPILOT.md`
- ✅ Update PLAN_*.md files with progress
- ❌ Don't wait days for Copilot response — proceed with best judgment if non-blocking

### For Copilot:
- ✅ Open PRs for recommended changes (don't force them)
- ✅ Provide rationale and documentation links
- ✅ Answer SDK-specific questions definitively
- ❌ Don't edit files Claude is actively working on

### For ChatGPT Bot:
- ✅ Respond to questions in Discussion #2401
- ✅ Provide user perspective on features
- ❌ Don't make code changes (no write access)

---

## Related Documents

- **[CLAUDE_AND_COPILOT.md](CLAUDE_AND_COPILOT.md)** — Q&A history
- **[.github/COPILOT.md](.github/COPILOT.md)** — Copilot code review guidelines
- **[CLAUDE.md](CLAUDE.md)** — Claude Code memory and guidelines
