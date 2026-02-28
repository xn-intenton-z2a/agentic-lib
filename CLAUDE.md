# Claude Code Memory - intentïon agentic-lib

## Context Survival (CRITICAL — read this first after every compaction)

**After compaction or at session start:**
1. Read all `PLAN_*.md` files in the project root — these are the active goals
2. Run `TaskList` to see tracked tasks with status
3. Do NOT start new work without checking these first

**During work:**
- When the user gives a new requirement, add it to the relevant `PLAN_*.md` or create a new one
- Track all user goals as Tasks with status (pending → in_progress → completed)
- Update `PLAN_*.md` with progress before context gets large

**PLAN file pattern:**
- Active plans live at project root: `PLAN_<DESCRIPTION>.md`
- Each plan has user assertions verbatim at the top (non-negotiable requirements)
- If no plan file exists for the current work, create one before starting
- Never nest plans in subdirectories — always project root

**Anti-patterns to avoid:**
- Do NOT drift to side issues when a plan file defines the priority
- Do NOT silently fail and move on — throw, don't skip
- Do NOT ask obvious questions — read the plan file

## What This Repository Is

The **core SDK** of the intentïon project. A collection of reusable GitHub Actions workflows that enable repositories to operate autonomously — reviewing, fixing, updating, and evolving code through branches and issues.

- **Package**: `@xn-intenton-z2a/agentic-lib`
- **Organisation**: `xn-intenton-z2a`
- **License**: GPL (with MIT-licensed examples)
- **Entry point**: `sandbox/source/main.js`

## What This Repository Is NOT

- Not a standalone application — it's consumed by other repos (repository0, etc.)
- Not a web service — it's GitHub Actions workflows and npm package
- Does not deploy to AWS directly

## Key Architecture

- Reusable workflows invoked via `workflow_call` event
- Workflows communicate through branches and issues
- GitHub Copilot SDK integration for autonomous code decisions (via agentic-step action)
- Published to npm as `@xn-intenton-z2a/agentic-lib`

## Related Repositories

| Repository | Relationship |
|------------|-------------|
| `repository0` | Template that consumes these workflows |
| `repository0-crucible` | Experiment using these workflows |
| `repository0-plot-code-lib` | Experiment using these workflows |
| `repository0-xn--intenton-z2a.com` | Experiment using these workflows |
| `intention-agentic-lib` | Earlier intentïon-specific version (being superseded) |

## Test Commands

```bash
npm test          # Unit tests
npm run build     # Build
```

## Git Workflow

**You may**: create branches, commit changes, push branches, open pull requests

**You may NOT**: merge PRs, push to main, delete branches, rewrite history

**Branch naming**: `claude/<short-description>`

## Code Quality Rules

- **No unnecessary formatting** — don't reformat lines you're not changing
- **No import reordering** — considered unnecessary formatting
- **No backwards-compatible aliases** — update all callers instead
- Only run linting/formatting fixes when specifically asked

## Copilot Collaboration

You can talk directly to the repository0 discussions bot by creating or commenting on GitHub Discussions using `gh`:

```bash
# Create a new discussion
gh api repos/xn-intenton-z2a/repository0/discussions -f title="..." -f body="..." -f categoryId="..."

# Comment on an existing discussion
gh api repos/xn-intenton-z2a/repository0/discussions/{id}/comments -f body="..."
```

Record the details of any such conversation in `CLAUDE_AND_COPILOT.md` so context survives across sessions.

## Security Checklist

- Never commit secrets — use GitHub Actions secrets
- Never commit API keys or tokens
- Verify workflow permissions follow least privilege
