# PLAN: Launch

Operational steps to get from "code written" to "publicly available."

## User Assertions

- Commit all changes on refresh branch
- Publish agentic-step to GitHub Marketplace
- Tag v7.0.0 release

---

## Step 1: Commit changes on refresh branch

All three repos have uncommitted changes on the `refresh` branch:
- `agentic-lib` — consolidated docs, deleted workflows, new plan files
- `repository0` — deleted legacy workflows, template cleanup
- `xn--intenton-z2a.com` — website updates (showcase, submission box)

**Action:** Stage and commit in each repo. One commit per repo with a descriptive message covering all changes.

## Step 2: Create pull requests

For each repo, open a PR from `refresh` → `main`:
- `agentic-lib` — "v7.0.0: Copilot SDK migration, workflow consolidation, doc consolidation"
- `repository0` — "v7.0.0: Simplified template with Copilot SDK"
- `xn--intenton-z2a.com` — "Website updates: showcase, submission box, branding"

## Step 3: Publish agentic-step to GitHub Marketplace

Prerequisites:
- agentic-step `action.yml` has required Marketplace metadata (name, description, branding)
- Action is tested (see PLAN_VERIFICATION.md)

**Action:** Publish via GitHub UI or `gh` CLI after PR merge.

## Step 4: Tag v7.0.0 release

After PRs are merged:
- Tag `v7.0.0` in agentic-lib
- Create GitHub Release with changelog
- npm publish triggers from the release workflow

## Step 5: Post-launch verification

- Confirm npm package `@xn-intenton-z2a/agentic-lib` is updated
- Confirm GitHub Marketplace listing is live
- Confirm showcase page loads with stats
- Confirm demo repos (#28, #29) are evolving

---

## Dependencies

| Step | Depends on |
|------|-----------|
| Step 1 | Current work complete |
| Step 2 | Step 1 |
| Step 3 | Step 2 merged + PLAN_VERIFICATION.md |
| Step 4 | Step 2 merged |
| Step 5 | Steps 3 + 4 + PLAN_DEMO_REPOS.md |

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Outstanding items list
- **[PLAN_VERIFICATION.md](PLAN_VERIFICATION.md)** — Must pass before Marketplace publishing
- **[PLAN_DEMO_REPOS.md](PLAN_DEMO_REPOS.md)** — Demo repos for post-launch verification
