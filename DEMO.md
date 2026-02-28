# intentïon Demo

Run `./demo.sh <your-github-username>` to see autonomous code evolution in action.

## Prerequisites

- [GitHub CLI](https://cli.github.com) installed and authenticated (`gh auth login`)
- GitHub Copilot subscription enabled on your account
- A GitHub account with permission to create public repositories

## What the Demo Does

1. **Creates a repository** from the `repository0` template under your GitHub account
2. **Writes a MISSION.md** describing a CLI tool called `timebox` (a developer productivity timer)
3. **Triggers the seed workflow** which reads the mission and begins code generation
4. **Waits for the first pull request** to appear (typically 3-10 minutes)
5. **Shows the PR** and the intentïon.md activity log

## Expected Timeline

| Time | What Happens |
|------|-------------|
| 0:00 | Repository created from template, MISSION.md written |
| 0:01 | Seed workflow triggers, reads mission, generates initial issue |
| 0:03 | Issue worker picks up the issue, generates code on a branch |
| 0:05 | Code passes tests, PR is created |
| 0:06 | Automerge workflow merges the PR |
| 0:07 | Review workflow closes the resolved issue |
| 0:10 | Feature maintenance generates the next issue from MISSION.md |
| 0:15+ | Cycle continues: issue -> code -> PR -> merge -> next issue |

Times are approximate and depend on GitHub Actions queue depth and Copilot API latency.

## What You Will See

### The First Pull Request

The PR will contain:
- Changes to `src/lib/main.js` implementing initial `timebox` functionality
- Updated `tests/unit/main.test.js` with tests covering the new code
- A PR description explaining what was implemented and why
- All checks passing (lint, test, build)

### The intentïon.md Activity Log

After workflows run, an `intentïon.md` file appears in the repository root. It is an append-only log of every agentic action:

```markdown
## resolve-issue at 2026-02-28T10:15:00.000Z

**Outcome:** pr-created
**Issue:** #1
**PR:** #2
**Model:** claude-sonnet-4-5
**Tokens:** 12450
**Workflow:** https://github.com/you/intention-demo-.../actions/runs/...

Implemented initial timebox CLI with start and status commands.

---
```

### The Stats Dashboard

Visit the [stats dashboard](https://agentic-lib-public-website-stats-bucket.s3.eu-west-2.amazonaws.com/all.html) to see live metrics for all intentïon experiments:
- Open issues and PRs
- Commit frequency
- Branch activity
- Recent commit messages

## After the Demo

The repository continues evolving on its schedule. Workflows run on timers and will keep generating issues, writing code, and creating PRs based on the mission.

To stop the evolution:
- Disable the scheduled workflows in the Actions tab
- Or delete the repository: `gh repo delete <your-username>/intention-demo-... --yes`

To guide the evolution:
- Edit `MISSION.md` to change the project direction
- Edit `CONTRIBUTING.md` to add coding guidelines the agent must follow
- Create issues manually with the `automated` label

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflows not running | Go to Actions tab and click "I understand my workflows, go ahead and enable them" |
| No PR after 10 minutes | Check the Actions tab for failed runs. The agent may need more context in MISSION.md |
| Tests failing | The agent will detect test failures and create fix-code issues automatically |
| Too many issues | Adjust `featureDevelopmentIssuesWipLimit` in `.github/agentic-lib/agents/agentic-lib.yml` |
