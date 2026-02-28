# intentïon — The Conceptual Model

## The Fixed Point

**intentïon** is the only fixed point. It's what you want to exist. You express it, and the system navigates toward making it real. The word, the brand, the domain, the diaeresis — it's all one thing.

---

## GitHub

GitHub is where it all happens. Not a metaphor — just GitHub. Repositories, issues, PRs, discussions, actions, Copilot. intentïon uses what's there. Users bring their own GitHub account, their own Copilot subscription. intentïon teaches it what to build.

The system works with GitHub's grain: branches for parallel work, PRs for quality gates (tests pass or fail), merges for landing changes, Actions for compute. These aren't metaphors for something else — they're the actual mechanisms.

---

## The Repository (Manufacturing)

Inside each repository, four kinds of thing are made. This borrows from manufacturing because a repository is a factory — it takes in an intentïon and produces the thing you wanted:

| Kind | What it is | Manufacturing analog | Examples |
|---|---|---|---|
| **Product** | Code that when run IS the thing you want | Finished goods | `src/`, runtime code, the deployable artifact |
| **Machinery** | Code, prompts, and config that build, run, deploy, and manage | The factory floor — jigs, tools, conveyors | Workflows, actions, perspectives, config |
| **Record** | Digests of what happened and what's true | Quality reports, batch records, audit trail | Docs, test reports, `intentïon.md`, README |
| **Materials** | Gathered or generated stuff that enables transformations — a cache, not the product | Raw materials, stock, work-in-progress inventory | Crawled library docs, cached context, intermediate data |

**The loop: machinery transforms materials into product, and leaves a record.**

- **Product** is what ships. It's what the intentïon asked for.
- **Machinery** is the factory. You don't ship it, but without it nothing gets made. It comes with the template.
- **Record** is quality control. Evidence that the product is what was intended. Traceability.
- **Materials** are consumed by transformations. They're concrete and countable (files on disk) but disposable — you can regenerate them. They exist to make transformations cheaper and more reliable than going to source every time.

---

## Perspectives (How Agents See)

Agents are the actors in the system. Each has a **perspective** — not a fixed job, but a way of seeing. The same code looks different to a builder than to a critic.

**Three kinds of agent exist today:**

| Agent | Perspective | Role |
|---|---|---|
| **The intender (human)** | The intender | Expresses the intentïon. Judges realization. The only one who can say "that's what I meant" or "that's not it." |
| **The architect (Claude Code)** | The architect | Works with the intender directly — exploring, planning, designing, refactoring across repos. Sees the whole workspace. |
| **The makers (machinery agents)** | The makers | Copilot SDK agents run by workflows. Narrow perspectives — one sees an issue and writes code, another sees failing tests and repairs, another sees a discussion and responds. One transformation at a time. |

Perspectives are not hardcoded task types. Each perspective is defined by how it sees, not what it does. Perspectives include: **builder** (make the thing), **critic** (challenge the thing), **witness** (assess realization), **steward** (maintain after realization), **harvester** (gather materials), **narrator** (maintain the record).

Perspectives are documented as **capability files** in the repository — like skills. Any agent can read them, and any agent can modify another's capability file (but not its own). This creates a social protocol: perspectives refine each other.

---

## Planning (Partial-Order Plans as Committed Artifacts)

The plan is not ephemeral output from an LLM. It is a **committed file in the repository**. It persists across workflow runs. Each transformation reads it, refines it, and commits the update. The plan accumulates knowledge.

This draws on classical AI planning theory — particularly partial-order planning (Tate's NONLIN, 1977; Penberthy & Weld's UCPOP, 1992) and the integration of planning with execution under uncertainty (Steel & Ho, "Planning and Execution using Partial Decision Trees", Essex, 1993). The key principles:

- **Least commitment** — don't order steps until you have to. Leave the plan flexible. If two features are independent, the plan doesn't impose an ordering.
- **Open conditions** — the plan explicitly represents what it doesn't know yet. "We need a CLI argument parser but haven't decided how" is a valid plan entry.
- **Causal links** — each step in the plan tracks why it's there — what it achieves toward the intentïon.
- **Threats** — a step might undo something another step achieved. The plan tracks this so perspectives can avoid conflicts.
- **Plan refinement, not replanning** — each cycle refines the existing plan rather than creating a new one from scratch. The plan grows smarter over time.
- **Planning vs execution trade-off** — following Steel & Ho, the system can reason about whether further planning or immediate execution is more valuable, given the cost of each and the uncertainty of outcomes.

### What the plan looks like

The plan is a committed markdown file with partial-order structure:

```markdown
## Plan (updated cycle 7)

### Achieved
- [x] UUID generation (issue #1, causal: core feature)
- [x] Base64 encode/decode (issue #2, causal: core feature)

### In progress
- [ ] JSON↔YAML conversion (issue #5, depends: nothing, builder assigned)

### Open conditions (needed but not yet planned)
- [ ] CLI argument parsing framework (needed by all subcommands)
- [ ] --help generation (depends: CLI framework)

### Threats
- Issue #3 (hash functions) and #5 (conversion) both modify CLI entry point

### Unordered (can happen in any sequence)
- SHA256 hashing, CSV parsing, color conversion — independent features

### Observations
- Cycle 5: Builder tried streaming CSV but tests flaky. Deferred.
- Cycle 6: Critic noted missing error handling in base64. Issue created.
```

This is a living document. Every cycle, a perspective reads it, refines it (adds what was achieved, identifies new open conditions, resolves threats, records observations), and then executes the actionable items.

---

## The Lifecycle

A **transformation** is a single reliable state change. One GitHub Actions workflow run. But a workflow run is not a single Copilot call — it's a **budget of compute**.

Within one workflow run:

1. **Read state** — the plan, the product, the record, the materials. State includes what happened last time.
2. **Refine the plan** — commit an update to the planning artifact.
3. **Execute** — multiple Copilot SDK calls, each producing commits on the branch. After each call, state has changed; the next call sees the new commits.
4. **Witness** — assess realization. Record the score.
5. **Land it** — merge the branch back when the transformation goal is met or budget is spent.

Two scales of iteration:

- **Inner loop**: on the branch, multiple Copilot calls, each building on the last. Branch from working branch, commit, merge back.
- **Outer loop**: branch from main, do a full transformation, merge back. Next cron trigger starts a new transformation from the new state.

```
    ┌─────────────────────────────────┐
    │                                 │
    │   intentïon expressed           │
    │   (INTENTION.md — committed)    │
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │   TRANSFORM (one workflow run)  │
    │                                 │
    │   1. Read state + plan          │
    │   2. Refine plan (commit)       │
    │   3. Execute (N Copilot calls)  │
    │   4. Witness (assess progress)  │
    │   5. Merge branch               │
    │                                 │
    │   Repeat inner loop until       │
    │   budget spent or goal met      │
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │   STATE CHANGED                 │
    │                                 │
    │   Plan updated. Product grown.  │
    │   Record kept. Realization      │
    │   score recorded.               │
    │                                 │
    │   Realized? ── Yes → STEWARD   │
    │   Not yet?  ── Next cron       │
    │                triggers another │
    │                transformation   │
    │                                 │
    └─────────────────────────────────┘
```

Properties of a good transformation:

- **Maximal** — do as much as you can land perfectly
- **Reliable** — if it can't land clean, it doesn't land at all
- **Observable** — it leaves a record of what changed and why
- **Parallelizable** — independent transformations can run concurrently (multiple cron triggers, multiple workflow runs)

**Stewardship** is not a separate mode with different machinery. It's what happens when the witness consistently scores high: the plan has no open conditions, no active issues, the product matches the intentïon. The next transformation reads this state and naturally shifts to maintenance — responding to drift, fixing regressions, refining quality. The behavior change is emergent from the state, not imposed by a mode switch.

---

## Agents and the Control Plane

Agents can modify the machinery. A builder can update the harvester's perspective file. The navigator can create a new perspective. The narrator can restructure materials.

The social protocol: **no agent modifies its own perspective file in the same run.** But it can ask another to. This creates natural checks — perspectives refine each other across cycles.

This is more fluid than a forbidden list. Capabilities are documented in repo files (like skills). Any agent reads them. Any agent can propose changes to another's capabilities through the normal PR process.

---

## What This Means for the UX

**Homepage (intentïon.com):** "What is your intentïon?" → You describe what you want to exist → The system begins navigating toward it using your GitHub account and Copilot subscription.

**Template (repository0):** You clone it, you write your intentïon, the machinery begins transforming materials into product. You watch the plan refine and the product grow in `intentïon.md`. It tells you when it witnesses realization. Then it stewards.

**The SDK (agentic-lib):** Provides the machinery — the workflows, the action, the perspectives. It's the factory-in-a-box you install on any repository.

---

## Planning Theory References

The planning approach draws on:

- **NONLIN** (Tate, 1977, Edinburgh) — the first planner to use causal links and threat detection in a partial-order framework. [NONLIN project page](https://www.aiai.ed.ac.uk/project/nonlin/)
- **O-Plan** (Currie & Tate, 1983-1999, Edinburgh) — open planning architecture extending NONLIN with hierarchical task decomposition. [O-Plan paper](https://www.sciencedirect.com/science/article/abs/pii/000437029190024E)
- **UCPOP** (Penberthy & Weld, 1992) — sound, complete partial-order planner. Formalized least commitment and open conditions. [UCPOP paper](https://www.semanticscholar.org/paper/UCPOP:-A-Sound,-Complete,-Partial-Order-Planner-for-Penberthy-Weld/6e1bd5758be5495141d56de31c28d57f55c56f3e)
- **Planning and Execution using Partial Decision Trees** (Steel & Ho, 1993, Essex) — integrates planning with execution under uncertainty, reasoning about the utility of planning vs acting. [Essex repository](https://repository.essex.ac.uk/8658/)
- **Partial-order planning** (general) — the principle that plans should maintain flexibility by not committing to step ordering until forced. [Wikipedia overview](https://en.wikipedia.org/wiki/Partial-order_planning)

---

## Vocabulary Reference

| Term | Definition |
|---|---|
| **intentïon** | The stated desire — what you want to exist. The seed. Immutable by agents. The fixed point. |
| **product** | Code that when run IS the thing. The intentïon made real. |
| **machinery** | Code, prompts, config that build, run, deploy, and manage. The factory. |
| **record** | Digests of what happened and what's true. Evidence and traceability. |
| **materials** | Gathered or generated stuff that enables transformations. A cache. Concrete, countable, disposable. |
| **plan** | A committed partial-order document tracking what's achieved, what's in progress, what's open, and what threatens. Refined each cycle. |
| **transformation** | A single workflow run. A budget of compute that reads state, refines the plan, executes, witnesses, and merges. |
| **perspective** | An agent's way of seeing. Documented as capability files. Agents refine each other's. |
| **witness** | Assessment of realization. Happens at the end of every transformation. Recorded in the record. |
| **realization** | The condition where the intentïon is manifest in the state. Degrees, not binary. |
| **stewardship** | What happens when the plan has no open conditions and the witness scores high. Emergent, not imposed. |
