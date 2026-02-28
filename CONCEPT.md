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

| Kind          | What it is                                                                          | Manufacturing analog                             | Examples                                                |
| ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- |
| **Product**   | Code that when run IS the thing you want                                            | Finished goods                                   | `src/`, runtime code, the deployable artifact           |
| **Machinery** | Code, prompts, and config that build, run, deploy, and manage                       | The factory floor — jigs, tools, conveyors       | Workflows, actions, perspectives, config                |
| **Record**    | Digests of what happened and what's true                                            | Quality reports, batch records, audit trail      | Docs, test reports, `intentïon.md`, README              |
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

| Agent                             | Perspective   | Role                                                                                                                                                                                                        |
| --------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The intender (human)**          | The intender  | Expresses the intentïon. Judges realization. The only one who can say "that's what I meant" or "that's not it."                                                                                             |
| **The architect (Claude Code)**   | The architect | Works with the intender directly — exploring, planning, designing, refactoring across repos. Sees the whole workspace.                                                                                      |
| **The makers (machinery agents)** | The makers    | Copilot SDK agents run by workflows. Narrow perspectives — one sees an issue and writes code, another sees failing tests and repairs, another sees a discussion and responds. One transformation at a time. |

Maker perspectives are not hardcoded task types. In this model:

- A **navigation** phase assesses the gap between current state and realization
- It **assembles** the perspectives needed — maybe this intentïon needs a critic but not a librarian, maybe it needs three builders working in parallel
- Each perspective is defined by how it sees, not what it does
- Perspectives include: **builder** (make the thing), **critic** (challenge the thing), **witness** (assess realization), **steward** (maintain after realization), **harvester** (gather materials), **narrator** (maintain the record)

---

## The Lifecycle

A **transformation** is a single reliable state change. One GitHub Actions workflow run. It takes the repository from one state to another.

Properties of a good transformation:

- **Maximal** — do as much as you can land perfectly
- **Reliable** — if it can't land clean, it doesn't land at all
- **Observable** — it leaves a record of what changed and why
- **Parallelizable** — independent transformations can run concurrently

A **navigation** is the planned sequence of transformations from current state toward realization. It's re-planned after every transformation because the state has changed. The steps required are ideally 0 (already realized) or as many as needed to reliably get there.

```
    ┌─────────────────────────────────┐
    │                                 │
    │   intentïon expressed           │
    │   (the only human input)        │
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │   NAVIGATE                      │
    │                                 │
    │   Observe state                 │
    │   Assess gap to realization     │
    │   Plan transformations          │
    │   Assemble perspectives         │
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │   TRANSFORM                     │
    │                                 │
    │   Machinery consumes materials  │
    │   Product emerges               │
    │   Record is kept                │
    │   (parallel where possible)     │
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │   WITNESS                       │
    │                                 │
    │   Is the intentïon realized?    │
    │                                 │
    │   No ──── loop back to NAVIGATE │
    │                                 │
    │   Yes ─── enter STEWARDSHIP     │
    │                                 │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │   STEWARDSHIP                   │
    │                                 │
    │   Maintain, refine, respond     │
    │   to drift. Collaborative.      │
    │   The intentïon lives.          │
    │                                 │
    └─────────────────────────────────┘
```

---

## What This Means for the UX

**Homepage (intentïon.com):** "What is your intentïon?" → You describe what you want to exist → The system begins navigating toward it using your GitHub account and Copilot subscription.

**Template (repository0):** You clone it, you write your intentïon, the machinery begins transforming materials into product. You watch it happen in `intentïon.md`. It tells you when it witnesses realization. Then it stewards.

**The SDK (agentic-lib):** Provides the machinery — the workflows, the action, the perspectives. It's the factory-in-a-box you install on any repository.

---

## Vocabulary Reference

| Term               | Definition                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **intentïon**      | The stated desire — what you want to exist. The seed. Immutable by agents. The fixed point.         |
| **product**        | Code that when run IS the thing. The intentïon made real.                                           |
| **machinery**      | Code, prompts, config that build, run, deploy, and manage. The factory.                             |
| **record**         | Digests of what happened and what's true. Evidence and traceability.                                |
| **materials**      | Gathered or generated stuff that enables transformations. A cache. Concrete, countable, disposable. |
| **transformation** | A single reliable state change. One workflow run. Maximal but safe.                                 |
| **navigation**     | The planned path from current state toward realization. Re-planned after every transformation.      |
| **perspective**    | An agent's way of seeing. Not a job title — a viewpoint.                                            |
| **assembly**       | The planning phase that selects perspectives for a navigation.                                      |
| **witness**        | The act of recognizing that realization has occurred. Observation, not action.                      |
| **realization**    | The condition where the intentïon is manifest in the state. Degrees, not binary.                    |
| **stewardship**    | The mode after realization — maintain, refine, respond to drift.                                    |
