# PLAN: Verification & Testing

Feature #26 — prove the system works against real infrastructure.

## User Assertions

- Integration testing against real Copilot SDK
- Testing what agentic-lib publishes for repository0 consumption
- Testing agentic flows in repository0
- Testing demo repository fitness (output examination for #28 and #29)

## Scope

This plan covers:
1. Verifying acceptance criteria for features #18-25 (all marked Done but unchecked)
2. Integration testing against the real Copilot SDK
3. Establishing test patterns for demo repository fitness (#28, #29)

---

## Step 1: Verify #18 — Copilot Migration

All unchecked:
- [ ] `agentic-step` action authenticates with Copilot SDK and returns output
- [ ] All 8 task handlers produce equivalent outcomes to the OpenAI-based workflows
- [ ] No `CHATGPT_API_SECRET_KEY` or `openai` package anywhere in the codebase
- [ ] Action published to GitHub Marketplace as `@xn-intenton-z2a/agentic-step`

**How to verify:**
- Run `agentic-step` locally or in a test workflow with a real Copilot subscription
- Grep both repos for `CHATGPT_API_SECRET_KEY` and `openai` — must return zero results
- Marketplace publishing is a launch step (see PLAN_LAUNCH.md)

## Step 2: Verify #19 — Workflow Hardening

All unchecked:
- [ ] intentïon.md entries include commit URLs
- [ ] Attempt check outcomes are logged
- [ ] Resolved issues return nop without generating code
- [ ] Issue comments include context about what happened
- [ ] Writable/non-writable paths are separated in agent prompts

**How to verify:**
- Unit tests for `logging.js` — assert commit URL format in output
- Unit tests for `safety.js` — assert `isIssueResolved` returns nop
- Unit tests for `config-loader.js` — assert separate writable/readonly paths
- Review existing test suite (32 tests) for coverage of these items

## Step 3: Verify #20 — Discussions Bot Intelligence

All unchecked:
- [ ] Bot creates features when requested via Discussion
- [ ] Bot declines requests that violate the mission with an explanation
- [ ] Bot can delete/update existing features through Discussion interaction

**How to verify:**
- Unit tests for `tasks/discussions.js` — assert `[ACTION:create-feature]` pattern
- Unit tests for mission violation detection and `[ACTION:nop]` response
- Integration test: post a Discussion and verify bot response

## Step 4: Verify #21 — Onboarding Experience

All unchecked:
- [ ] `demo.sh` runs end-to-end without manual intervention
- [ ] GETTING-STARTED.md describes 3-step Copilot setup (no OpenAI key)
- [ ] repository0 initial state produces "Hello World!" output
- [ ] No experiment debris in repository0 template

**How to verify:**
- Run `demo.sh` — must complete without prompts
- Review GETTING-STARTED.md for accuracy
- Run repository0's `npm start` or equivalent — must output "Hello World!"
- Inspect repository0 for stale experiment files

## Step 5: Verify #22 — Supervisor

All unchecked:
- [ ] Build failure on agentic branch triggers fix-code within 5 minutes
- [ ] Stale issues trigger review automatically
- [ ] Supervisor does not create infinite dispatch loops

**How to verify:**
- Review `agent-supervisor.yml` logic for dispatch conditions
- Check for loop prevention (e.g., supervisor doesn't trigger on its own runs)
- Integration test: simulate a build failure and verify dispatch

## Step 6: Verify #23 — TDD Workflow

All unchecked:
- [ ] Evolve task in TDD mode creates a failing test first
- [ ] Second step makes the test pass
- [ ] PR contains both test and implementation
- [ ] Non-TDD mode still works as before

**How to verify:**
- Unit tests for `tasks/evolve.js` with `tdd: true` config
- Verify two-phase execution in the task handler
- Run non-TDD mode to confirm backwards compatibility

## Step 7: Verify #24 — Showcase Page

All unchecked:
- [ ] Showcase page loads and renders experiment data
- [ ] At least 2 experiments displayed with stats
- [ ] Links to repositories, PRs, and activity logs work
- [ ] Page is accessible from the main website navigation

**How to verify:**
- Open `public/showcase.html` locally
- Check that stats JSON URL is correct and data renders
- Verify navigation links from main site

## Step 8: Verify #25 — Submission Box

All unchecked:
- [ ] Submission box renders on the website
- [ ] Submitting creates a GitHub Discussion
- [ ] Terms and conditions are displayed and must be accepted
- [ ] Discussions bot processes the submission

**How to verify:**
- Open `public/index.html` locally
- Check Giscus integration configuration
- Verify terms and conditions UI
- End-to-end: submit and verify Discussion creation

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Feature #26 definition
- **[PLAN_DEMO_REPOS.md](PLAN_DEMO_REPOS.md)** — Demo repos whose fitness this plan tests
