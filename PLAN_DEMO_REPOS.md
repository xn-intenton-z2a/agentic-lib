# PLAN: Demo Repositories

Features #28 (Library Demo) and #29 (Website Demo) — create real examples that prove the system works.

## User Assertions

- A JS library that evolves autonomously from a mission, published to npm
- A website that evolves autonomously from a mission, deployed to GitHub Pages
- Output captured and examined as part of fitness tests (see PLAN_VERIFICATION.md)

---

## Step 1: Create Library Demo Repository (#28)

1. Create new repository from repository0 template (GitHub UI or `gh repo create`)
2. Name: `repository0-library-demo` (or similar)
3. Write a MISSION.md with a library-focused mission (e.g., "A date formatting utility library")
4. Enable GitHub Copilot coding agent
5. Enable workflow schedules
6. Let it evolve autonomously

**Success criteria:**
- Repository creates features from the mission
- Code is generated with tests
- Package is published to npm
- intentïon.md shows the full evolution trail

## Step 2: Create Website Demo Repository (#29)

1. Create new repository from repository0 template
2. Name: `repository0-website-demo` (or similar)
3. Write a MISSION.md with a website-focused mission (e.g., "A personal portfolio site")
4. Enable GitHub Copilot coding agent
5. Enable GitHub Pages deployment
6. Let it evolve autonomously

**Success criteria:**
- Repository creates features from the mission
- Code is generated with tests
- Site is deployed to GitHub Pages
- intentïon.md shows the full evolution trail

## Step 3: Fitness Testing

Define automated checks for demo repository health (feeds into PLAN_VERIFICATION.md):

- **Library demo:** `npm test` passes, package publishes, exports are usable
- **Website demo:** site loads, pages render, no broken links
- **Both:** intentïon.md is populated, at least 1 merged PR exists

## Step 4: Showcase Integration

Once both repos have evolved enough content:
- Add them to the showcase page on xn--intenton-z2a.com
- Link to their intentïon.md activity logs
- Feature them in the stats dashboard

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Features #28 and #29 definitions
- **[PLAN_VERIFICATION.md](PLAN_VERIFICATION.md)** — Fitness testing for demo repos
