# PLAN: Focus Reboot

Get all the moving parts working end-to-end before tightening verification and expanding demo output. This plan supersedes PLAN_STABILISE_AND_DEPLOY.md, PLAN_CODE_REDUCTION.md, and PLAN_UPLIFT.md (all archived -- core work complete).

## Completed Work

| Phase | What | Status |
|-------|------|--------|
| Hardening sprint (12 tasks) | Tests, CI, packaging, distribution, docs | Done |
| Post-sprint (A-K) | SDK auth, CLI init, seeds, releases, integration tests | Done |
| Self-contained testing | test.yml replaces ci.yml + 3 integration-test-*.yml | Done |
| Auto-publish | auto-publish.yml: patch bump on merge to main | Done |
| TOML config | config-loader.js supports agentic-lib.toml, seed TOML created | Done |
| README rewrite | README.md describes init, file map, three entry points | Done |

Current metrics:
- 313 tests across 21 files (vitest)
- 17 workflow files validated (4 internal + 13 distributed)
- 0 npm audit vulnerabilities
- v7.1.2-0 (prepatch)

## Current Architecture

```
agentic-lib CI (.github/workflows/):
  test.yml          → unit tests, lint, security, workflow validation, action tests
  auto-publish.yml  → patch bump + npm publish on merge to main
  release.yml       → manual major/minor/prerelease
  llm-verify.yml    → golden prompt validation

agentic-lib distributes (via npm + CLI init):
  src/workflows/    → 13 workflows → consumer .github/workflows/
  src/actions/      → 3 actions → consumer .github/agentic-lib/actions/
  src/agents/       → 8 files → consumer .github/agentic-lib/agents/
  src/seeds/        → 9 files → consumer .github/agentic-lib/seeds/
  src/scripts/      → 6 files → consumer .github/agentic-lib/scripts/
  agentic-lib.toml  → consumer project root (created once)
```

## User Assertions

- repository0 stays pre-initialised with checked-in agentic-lib content
- `init` overwrites infrastructure in-place; user commits the result
- Users may have an experiment in progress on main -- `init` doesn't touch source files
- `init --purge` resets source files to seed state (explicit choice)
- Publication is automatic on merge to main (patch bumps)
- Manual release.yml for major/minor versions
- Template users get a stable version that doesn't disappear; they bump when ready

## Next Phases

### Phase: Template Branch Strategy

**Problem:** repository0 serves dual purpose -- it's a living demo (main churns with experiments) AND a GitHub template (new repos should start clean). Currently main has experiment artifacts.

**Options to investigate:**
- A dedicated `template` branch kept at seed state, used as the template source
- GitHub template repos can specify which branch to use as the template
- The `template` branch gets `init --purge` applied on every agentic-lib release
- Main continues as the living demo

### Phase: API Surface + npm Exports (Goals 4 + 6)

- Define `exports` field in package.json
- Exported functions accept `githubToken` parameter
- Version-controlled: consumers pin to a version

### Phase: Thin Adaptors + Workflow Tests (Goals 3 + 7)

- repository0 workflows become thin callers
- Workflow smoke tests in repository0

### Phase: Template Styles (Goal 2)

- library, website, demo seed sets
- Style selection via config or mission convention

### Phase: Website Integration (Goals 1 + 10)

- Live content from repository0 on xn--intenton-z2a.com
- Playwright tests

## Key Decisions

### Versioning Strategy

**Decision: Auto-publish patch on merge + manual major/minor**

- Merging to main with src/bin/package.json changes → auto patch bump + publish
- Manual release.yml for major/minor/prerelease
- Consumers pin to a specific version

### Self-Contained Testing

**Decision: test.yml replaces cross-repo integration tests**

- Old: integration-test-*.yml needed PERSONAL_ACCESS_TOKEN for cross-repo access
- New: test.yml self-inits (copies src/ → .github/agentic-lib/) and runs agentic-step directly
- No cross-repo secrets needed; action tests use continue-on-error (Copilot SDK may not be available)

### Config Format

**Decision: TOML at project root, YAML as fallback**

- `agentic-lib.toml` at project root (preferred, user-facing)
- `.github/agentic-lib/agents/agentic-lib.yml` as fallback (legacy)
- Config loader tries TOML first

## Archived Plans

- `PLAN_CODE_REDUCTION.md` -- complete
- `PLAN_STABILISE_AND_DEPLOY.md` -- complete
- `PLAN_UPLIFT.md` -- complete (archived to `_developers/_archive/`)
