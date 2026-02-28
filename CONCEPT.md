# intentïon — The Conceptual Model

## The Fixed Point

**intentïon** is the only fixed point. It's what you want to exist. You express it, and the system navigates toward making it real. The word, the brand, the domain, the diaeresis — it's all one thing.

---

## The Substrate (Geology / Evolution)

**GitHub is the substrate.** Not a tool, not a platform — the ground everything grows on and evolves within. Like geological substrate, it has layers and properties that determine what can grow:

| Substrate layer | What it provides | GitHub primitive |
|---|---|---|
| **Bedrock** | Identity, ownership, permissions | Repository, org, collaborators |
| **Strata** | History, lineage, branching timelines | Git (commits, branches, tags) |
| **Terrain** | Where work happens and is visible | Issues, PRs, Discussions |
| **Atmosphere** | Compute, triggers, the energy source | Actions, Copilot, API |

The substrate isn't intentïon's — it's GitHub's. intentïon is an organism that lives on this substrate. Users bring their own substrate (their GitHub subscription, their Copilot access). intentïon teaches the substrate what to grow.

Evolution happens naturally here: branches are lineages, PRs are selection pressure (tests pass or fail), merges are survival, the record is the fossil layer. The substrate already works this way — intentïon just gives it direction.

---

## The Repository (Manufacturing)

Inside each repository, four kinds of **material** are made. This borrows from manufacturing:

| Material | What it is | Manufacturing analogy | Examples |
|---|---|---|---|
| **Product** | Code that when run IS the thing you want | Finished goods | `src/`, runtime code, the deployable artifact |
| **Machinery** | Code, prompts, and config that build, run, deploy, and manage | The factory floor — jigs, tools, conveyors | Workflows, actions, agent perspectives, config |
| **Record** | Digests of what happened and what's true | Quality reports, batch records, audit trail | Docs, test reports, `intentïon.md`, README |
| **Materials** | Gathered or generated stuff that enables transformations — a cache, not the product | Raw materials, stock, work-in-progress inventory | Crawled library docs, cached context, intermediate data |

The manufacturing metaphor works because:

- **Product** is what ships. It's what the intentïon asked for.
- **Machinery** is the factory. You don't ship it, but without it nothing gets made. It comes with the template.
- **Record** is quality control. Evidence that the product is what was intended. Traceability.
- **Materials** are consumed by transformations. They're concrete and countable (files on disk) but disposable — you can regenerate them. They exist to make transformations cheaper and more reliable than going to source every time.

The loop: **machinery transforms materials into product, and leaves a record.**

---

## The Agents (Agency / Perspective)

Agents are the actors in the system. Each has a **perspective** — not a fixed job, but a way of seeing. The same code looks different to a builder than to a critic.

**Three agents exist today:**

| Agent | Perspective | Role |
|---|---|---|
| **The intender (human)** | The intender | Expresses the intentïon. Judges realization. The only one who can say "that's what I meant" or "that's not it." Also architects the machinery and guides direction. |
| **The architect (Claude Code)** | The architect | Works with the intender directly — exploring, planning, designing, refactoring across repos. Sees the whole workspace. Thinks in systems. Can touch anything but doesn't merge or push to main unilaterally. |
| **The makers (machinery agents)** | The makers | Copilot SDK agents invoked by workflows. They have narrow perspectives — one sees an issue and writes code, another sees failing tests and repairs, another sees a discussion and responds. They don't see the whole system. They see one transformation at a time. |

Maker perspectives should not be hardcoded as fixed task types. In this model:

- A **navigation** phase assesses the gap between current state and realization
- It **assembles** the perspectives needed — maybe this intentïon needs a critic but not a librarian, maybe it needs three builders working in parallel
- Each perspective is defined by how it sees, not what it does
- Perspectives could include: **builder** (make the thing), **critic** (challenge the thing), **witness** (assess realization), **steward** (maintain after realization), **harvester** (gather materials), **narrator** (maintain the record)

---

## The Transformations (The Work)

A **transformation** is a single reliable state change. One GitHub Actions workflow run. It takes the repository from one state to another.

Properties of a good transformation:

- **Maximal** — do as much as you can land perfectly
- **Reliable** — if it can't land clean, it doesn't land at all
- **Observable** — it leaves a record of what changed and why
- **Parallelizable** — independent transformations can run concurrently

A **navigation** is the planned sequence of transformations from current state to realization. It's re-planned after every transformation because the state has changed. The steps required are ideally 0 (already realized) or as many as needed to reliably get there.

---

## The Lifecycle

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

## The Taxonomies

Three overlapping taxonomies, not one hierarchy:

| Domain | Taxonomy | Concepts |
|---|---|---|
| **Geology / Evolution** | The substrate | Bedrock, strata, terrain, atmosphere. GitHub as the ground things grow on. Evolution through branching, selection, survival. |
| **Manufacturing** | The repository | Product, machinery, record, materials. A factory that makes the thing you intended. |
| **Agency** | The agents | Intender (human), architect (Claude Code), makers (Copilot agents). Perspectives, not job titles. Assembly, not assignment. |
| **Navigation** | The work | Navigate, transform, witness, steward. A journey from state to realization. |

And **intentïon** sits above all of them — it's not in any taxonomy because it's the reason all of them exist.

---

## What This Means for the UX

**Homepage (intentïon.com):** "What is your intentïon?" → You describe what you want to exist → The system begins navigating toward it on the substrate you provide (your GitHub account).

**Template (repository0):** You clone it, you write your intentïon, the machinery begins transforming materials into product. You watch it happen in `intentïon.md`. It tells you when it witnesses realization. Then it stewards.

**The SDK (agentic-lib):** Provides the machinery — the workflows, the action, the perspectives. It's the factory-in-a-box you install on any substrate.

---

## Vocabulary Reference

| Term | Definition |
|---|---|
| **intentïon** | The stated desire — what you want to exist. The seed. Immutable by agents. The fixed point. |
| **substrate** | GitHub — the ground the system grows on. Owned by the user, not by intentïon. |
| **product** | Code that when run IS the thing. The intentïon made real. |
| **machinery** | Code, prompts, config that build, run, deploy, and manage. The factory. |
| **record** | Digests of what happened and what's true. Evidence and traceability. |
| **materials** | Gathered or generated stuff that enables transformations. A cache. Concrete, countable, disposable. |
| **transformation** | A single reliable state change. One workflow run. Maximal but safe. |
| **navigation** | The planned path from current state toward realization. Re-planned after every transformation. |
| **perspective** | An agent's way of seeing. Not a job title — a viewpoint. |
| **assembly** | The planning phase that selects perspectives for a navigation. |
| **witness** | The act of recognizing that realization has occurred. Observation, not action. |
| **realization** | The condition where the intentïon is manifest in the state. Degrees, not binary. |
| **stewardship** | The mode after realization — maintain, refine, respond to drift. |
