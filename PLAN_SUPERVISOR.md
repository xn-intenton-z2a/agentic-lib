# PLAN: Supervisor Orchestration

The agent-supervisor evolves from a reactive workflow-run watcher into a proactive orchestrator that uses an LLM to decide what actions to take, when, and how many concurrently.

## Goals

1. The supervisor tries to achieve `MISSION.md` by growing features, library, and resolving issues
2. It picks **multiple concurrent actions** per cycle — not just one
3. It communicates bidirectionally with the discussions bot to serve users
4. All decision-making is LLM-based with structured, parseable output

## Available Actions

The supervisor can initiate any combination of these per cycle:

### Workflow Dispatches
| Action | Workflow | Purpose |
|--------|----------|---------|
| `dispatch:agent-flow-transform` | `agent-flow-transform.yml` | Pick up next issue, generate code, open PR |
| `dispatch:agent-flow-maintain` | `agent-flow-maintain.yml` | Refresh feature definitions and library docs |
| `dispatch:agent-flow-review` | `agent-flow-review.yml` | Close resolved issues, enhance issue criteria |
| `dispatch:agent-flow-fix-code` | `agent-flow-fix-code.yml` | Fix a failing PR (requires PR number) |
| `dispatch:agent-discussions-bot` | `agent-discussions-bot.yml` | Proactively post in a discussion thread |

### Direct GitHub API Actions
| Action | API | Purpose |
|--------|-----|---------|
| `github:create-issue` | `POST /repos/{owner}/{repo}/issues` | Create issue from gap in features or mission |
| `github:label-issue` | `POST /repos/{owner}/{repo}/issues/{n}/labels` | Prioritize or categorize an issue |
| `github:close-issue` | `PATCH /repos/{owner}/{repo}/issues/{n}` | Close a resolved or stale issue |

### Communication Actions
| Action | Mechanism | Purpose |
|--------|-----------|---------|
| `respond:discussions` | Dispatch discussions bot with response text | Reply to a user request via discussions |
| `nop` | — | No action needed this cycle |

## Context Provided to the LLM

Each supervisor cycle gathers this context before asking the LLM to decide:

1. **Mission** — Full text of `MISSION.md`
2. **Open Issues** — Count, titles, labels, ages (sorted by age)
3. **Open PRs** — Count, branch names, statuses, ages, automerge labels
4. **Recent Workflow Runs** — Last 10 runs across all agentic workflows (name, conclusion, timestamp)
5. **Feature Files** — Names and count vs `features-limit` from config
6. **Library Docs** — Names and count vs `library-limit` from config
7. **Recent Activity** — Last 20 lines of `intentïon.md`
8. **Schedule** — Current tier and supervisor frequency from `agentic-lib.toml`
9. **Pending Discussion Requests** — Free text from discussions bot (if triggered by a user request)

## LLM Output Format

The supervisor prompt instructs the LLM to respond in a structured, parseable format:

```
[ACTIONS]
dispatch:agent-flow-transform
dispatch:agent-flow-maintain
github:create-issue | title: Implement string parsing utilities | labels: automated,enhancement
respond:discussions | message: I've started work on your string utilities request. You'll see a PR shortly.
[/ACTIONS]
[REASONING]
The mission calls for string utility features. There are currently 0 open issues and no
features defined. Creating an issue and starting the transform pipeline will bootstrap
the development cycle. Meanwhile, maintain will generate feature definitions from the mission.
The user in discussions asked for string utilities — acknowledging their request.
[/REASONING]
```

### Parsing Rules
- Everything between `[ACTIONS]` and `[/ACTIONS]` is one action per line
- Pipe `|` separates the action from key-value parameters
- Parameters are `key: value` pairs separated by `|`
- The `[REASONING]` block is logged but not acted on

## Discussions ↔ Supervisor Communication

### User → Discussions Bot → Supervisor

When a user makes an action request in a discussion:

1. The discussions bot recognises the request
2. Bot uses `[ACTION:request-supervisor]` with the free-text request
3. The discussions bot workflow completion triggers the supervisor (via `workflow_run`)
4. The supervisor reads the request from the discussions bot's output/activity log
5. The supervisor decides what to do and can dispatch back through the discussions bot

### Supervisor → Discussions Bot

When the supervisor wants to communicate back to a user:

1. Supervisor includes `respond:discussions | message: <text> | discussion-url: <url>` in its actions
2. The supervisor script dispatches `agent-discussions-bot.yml` with the response text and URL as inputs
3. The discussions bot posts the message to the thread

### Design Principles

- **Free text everywhere.** Both the request and response are free text because the decision-making is LLM-based. Structured formats are only for machine parsing of actions.
- **The discussions bot advertises capabilities.** It should encourage users to ask for experiments, suggest projects, and be helpful about what's possible.
- **The supervisor filters and prioritises.** Not every user request should be actioned. The supervisor evaluates against the mission, current workload, and resource limits.
- **Origin tracking.** Every request from discussions includes the discussion URL and username so the supervisor knows where to send responses.

## Implementation

### New Task Handler: `supervise`

Add a 9th task handler to `src/actions/agentic-step/tasks/supervise.js`:

```
supervise(context) → {
  1. Gather all context (issues, PRs, workflows, features, library, activity, discussion requests)
  2. Build prompt with context + available actions + mission
  3. Call Copilot SDK
  4. Parse [ACTIONS] block
  5. For each action:
     - dispatch:* → octokit.actions.createWorkflowDispatch(...)
     - github:create-issue → octokit.issues.create(...)
     - github:label-issue → octokit.issues.addLabels(...)
     - github:close-issue → octokit.issues.update(...)
     - respond:discussions → dispatch discussions bot with message
     - nop → skip
  6. Return outcome with list of dispatched actions
}
```

### Integration Points

- **`agent-supervisor-schedule.yml`** calls the supervise task on its cron schedule
- **`agent-supervisor.yml`** can also call supervise (replacing some hardcoded JS logic over time)
- **`agent-discussions-bot.yml`** gains new inputs: `response-text` and `discussion-url` for supervisor-initiated messages
- **`src/actions/agentic-step/index.js`** registers the new `supervise` task

### Migration Path

The current `agent-supervisor.yml` reactive logic (fix failures, dispatch after merge, stale issue cleanup) continues to work. The new `supervise` task adds proactive decision-making on top. Over time, the reactive logic can be absorbed into the supervise task handler as the LLM learns to handle those cases.

## Configuration

New fields in `agentic-lib.toml`:

```toml
[schedule]
supervisor = "daily"    # off | weekly | daily | hourly | continuous
```

The `agent-supervisor-schedule.yml` workflow reads this and sets the cron accordingly by editing `agent-supervisor.yml` and pushing to main.

## Success Criteria

1. Supervisor can pick multiple concurrent actions per cycle
2. Supervisor dispatches real workflows and creates real issues
3. Discussions bot can relay user requests to supervisor and receive responses
4. Discussions bot is engaging, not repetitive, and adapts to user language
5. All actions are logged in `intentïon.md` for observability
6. The system makes measurable progress toward MISSION.md without human intervention
