# PLAN: Focus Reboot

Get all the moving parts working end-to-end before tightening verification and expanding demo output. This plan supersedes PLAN_STABILISE_AND_DEPLOY.md, PLAN_CODE_REDUCTION.md, and PLAN_UPLIFT.md (all archived -- core work complete).

## Completed Work

| Phase | What | Status |
|-------|------|--------|
| Hardening sprint (12 tasks) | Tests, CI, packaging, distribution, docs | Done |
| Post-sprint (A-K) | SDK auth, CLI init, seeds, releases, integration tests | Done |
| Self-contained testing | test.yml replaces ci.yml + 3 integration-test-*.yml | Done |
| Auto-publish | release.yml: auto patch bump on push to main | Done |
| Workflow consolidation | Merged auto-publish into release.yml, llm-verify into test.yml. Down to 2 workflows. | Done |
| TOML config | config-loader.js supports agentic-lib.toml, seed TOML created | Done |
| README rewrite | README.md describes init, file map, three entry points | Done |
| Template branch | repository0 `template` branch created at seed state via init --purge | Done |
| CLI task commands | bin/agentic-lib.js supports transform, maintain-features, maintain-library, fix-code | In progress |

Current metrics:
- 313 tests across 21 files (vitest)
- 15 workflow files validated (2 internal + 13 distributed)
- 0 npm audit vulnerabilities
- v7.1.2-0 (prepatch)
- Branch: `claude/self-contained-testing`, PR #1782

## Current Architecture

```
agentic-lib CI (.github/workflows/):
  test.yml          → unit tests, lint, security, workflow validation
                       optional: golden prompt verification, action tests (via dispatch inputs)
  release.yml       → auto patch bump on push to main; manual major/minor/prerelease

agentic-lib distributes (via npm + CLI init):
  src/workflows/    → 13 workflows → consumer .github/workflows/
  src/actions/      → 3 actions → consumer .github/agentic-lib/actions/
  src/agents/       → 8 files → consumer .github/agentic-lib/agents/
  src/seeds/        → 9 files → consumer .github/agentic-lib/seeds/
  src/scripts/      → 6 files → consumer .github/agentic-lib/scripts/
  agentic-lib.toml  → consumer project root (created once)

CLI (bin/agentic-lib.js):
  init [--purge]         → populate consumer repo with infrastructure
  reset                  → alias for init --purge
  transform              → run Copilot SDK transform on target repo
  maintain-features      → generate feature files from mission
  maintain-library       → update library docs from SOURCES.md
  fix-code               → fix failing tests via Copilot SDK
  version                → show installed version
```

## User Assertions

- repository0 stays pre-initialised with checked-in agentic-lib content
- `init` overwrites infrastructure in-place; user commits the result
- Users may have an experiment in progress on main -- `init` doesn't touch source files
- `init --purge` resets source files to seed state (explicit choice)
- Publication is automatic on merge to main (patch bumps)
- Manual release.yml for major/minor versions
- Template users get a stable version that doesn't disappear; they bump when ready
- CLI task commands log verbosely so the user can see what's happening

## In Progress: CLI Task Commands

**What's done:**
- `bin/agentic-lib.js` rewritten with task command support (transform, maintain-features, maintain-library, fix-code)
- Copilot SDK runner bypasses `@actions/core` for CLI independence
- Verbose logging with `[config]`, `[context]`, `[auth]`, `[copilot]`, `[event]`, `[tool]` prefixes
- Config loading from `agentic-lib.toml` or YAML fallback
- CLI tools (read_file, write_file, list_files, run_command) with path safety
- `--dry-run` support shows prompt without sending to Copilot SDK
- `--model` flag to choose SDK model

**What's next:**
1. Run tests and fix any issues from the bin rewrite
2. Create system test script (`scripts/system-test.sh`) that does full journey:
   - init --purge a temp workspace
   - Write a mission
   - Run maintain-features
   - Run transform
   - Verify files changed
   - Clean up (revert or delete temp workspace)
3. Update README.md with CLI task commands walkthrough and example output
4. Add system test as optional job in test.yml pipeline
5. Commit and push to PR #1782

## Next Phases (after CLI task commands)

### Phase: Template Branch Strategy

**Status:** Template branch created in repository0. Still to do:
- Configure repository0 to use `template` branch as the GitHub template source
- Automate `template` branch refresh on agentic-lib release (init --purge applied)
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

### CLI Task Commands

**Decision: Standalone Copilot SDK runner in bin/agentic-lib.js**

- Bypasses `@actions/core` — works outside GitHub Actions
- Uses same config (TOML/YAML) and prompt structure as agentic-step action
- Verbose console logging for observability
- `--dry-run` shows prompt without calling SDK
- System test does full journey then reverts changes

## Archived Plans

- `PLAN_CODE_REDUCTION.md` -- complete
- `PLAN_STABILISE_AND_DEPLOY.md` -- complete
- `PLAN_UPLIFT.md` -- complete (archived to `_developers/_archive/`)
