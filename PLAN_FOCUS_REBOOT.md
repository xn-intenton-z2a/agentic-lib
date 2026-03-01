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
| CLI task commands | bin/agentic-lib.js supports transform, maintain-features, maintain-library, fix-code | Done |
| Eliminate anti-patterns | Remove all fallback, silent-fail, backwards-compat, token-fallback patterns | Done |
| CLI test jobs | 3 --dry-run jobs in test.yml (transform, maintain-features, maintain-library) | Done |
| CLI full round-trips | CLI test jobs enhanced: dry-run → verify-no-effect → full-run → diff → reset | Done |
| npm exports | exports map in package.json, buildClientOptions exported, githubToken parameter | Done |
| Template branch strategy | init.yml daily lifecycle in repository0, hourly transform, daily maintain | Done |

Current metrics:
- 277 tests across 21 files (vitest)
- 15 workflow files validated (2 internal + 13 distributed)
- 10 CI jobs in test.yml (4 CI + 3 action + 3 CLI round-trip)
- 0 npm audit vulnerabilities
- v7.1.2-0 (prepatch)
- Branch: `claude/self-contained-testing`, PR #1782

## Current Architecture

```
agentic-lib CI (.github/workflows/):
  test.yml          → unit tests, lint, security, workflow validation
                       optional: action tests (via dispatch inputs)
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

## Completed: CLI Task Commands

- `bin/agentic-lib.js` rewritten with task command support (transform, maintain-features, maintain-library, fix-code)
- Copilot SDK runner bypasses `@actions/core` for CLI independence
- Verbose logging with `[config]`, `[context]`, `[auth]`, `[copilot]`, `[event]`, `[tool]` prefixes
- Config loading from `agentic-lib.toml` (TOML only, no fallback)
- CLI tools (read_file, write_file, list_files, run_command) with path safety
- `--dry-run` support shows prompt without sending to Copilot SDK
- `--model` flag to choose SDK model

## Completed: Eliminate Anti-Patterns

Removed 140+ instances of defensive anti-patterns across 41 files (-371 net lines):

- **§1 Token:** `PERSONAL_ACCESS_TOKEN` removed everywhere, `GITHUB_TOKEN` only
- **§2 Copilot token:** `COPILOT_GITHUB_TOKEN` required, no fallback — throw if missing
- **§3 Silent fail:** Errors propagate instead of being swallowed; debug logging in catches
- **§4 Error suppression:** Removed all `continue-on-error`, `|| true`, `2>/dev/null`
- **§5 Config:** TOML only — removed YAML config support, `normaliseToml()`, `parseYamlConfig()`. Config-loader has all defaults in one place. Deleted `consumer-compat.test.js`
- **§6 npm:** `npm ci || npm install` → `npm ci` everywhere (20 instances)
- **Golden prompts:** Removed entire golden-prompts test infrastructure (script, 8 fixtures, CI job)
- **Branch prefixes:** `copilotBranchPrefix` removed from ci-automerge, hardcoded prefix removed from agent-supervisor

## Next Phases

### Phase: Website Integration (Goals 1 + 10)

- Live content from repository0 on xn--intenton-z2a.com
- Playwright tests

*Dropped:* "Thin Adaptors + Workflow Tests" — covered by packaging/init. "Template Styles" — deferred post-MVP.

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
- No cross-repo secrets needed; COPILOT_GITHUB_TOKEN required for action tests

### Config Format

**Decision: TOML only at project root**

- `agentic-lib.toml` at project root (required)
- Config loader throws if TOML file not found — no YAML fallback, no defaults-only mode
- All path defaults defined in one place in config-loader.js

### CLI Task Commands

**Decision: Standalone Copilot SDK runner in bin/agentic-lib.js**

- Bypasses `@actions/core` — works outside GitHub Actions
- Uses same config (TOML only) and prompt structure as agentic-step action
- Verbose console logging for observability
- `--dry-run` shows prompt without calling SDK
- System test does full journey then reverts changes

## Archived Plans

- `PLAN_CODE_REDUCTION.md` -- complete
- `PLAN_STABILISE_AND_DEPLOY.md` -- complete
- `PLAN_UPLIFT.md` -- complete (archived to `_developers/_archive/`)
