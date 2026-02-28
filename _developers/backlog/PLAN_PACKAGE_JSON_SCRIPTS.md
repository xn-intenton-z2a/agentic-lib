# BACKLOG: Package.json Script Conventions

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### Dependency Update Scripts

diy-accounting-limited uses `npm-check-updates` with two update strategies:

```json
{
  "update-to-minor": "ncu -u --target minor && npm install",
  "update-to-greatest": "ncu -u --target greatest && npm install"
}
```

- `update-to-minor` — safe updates within current major version (for CI automation)
- `update-to-greatest` — latest versions regardless of semver (for manual review)

Both are run as part of a CI workflow that creates a PR with the updated dependencies.

### Everything Script

A single `everything` script that rebuilds the entire project from scratch:

```json
{
  "everything": "npm run clean && npm run build && npm run test && npm run synth && npm run deploy"
}
```

This is the "prove it works" script — runs the full pipeline locally.

### Environment-Specific Test Scripts

```json
{
  "test": "jest",
  "test:unit": "jest --testPathPattern=unit",
  "test:integration": "jest --testPathPattern=integration",
  "test:ci": "jest --ci --coverage",
  "test:synthetic": "jest --testPathPattern=synthetic --runInBand"
}
```

Different test suites for different contexts — unit tests run fast locally, integration tests need AWS, synthetic tests run against deployed environments.

### CDK-Specific Scripts

```json
{
  "synth": "cdk synth",
  "synth:ci": "cdk synth --context environment=ci",
  "synth:prod": "cdk synth --context environment=prod",
  "diff": "cdk diff",
  "deploy": "cdk deploy --require-approval never"
}
```

**Applicability to intentïon:**

| Repo | Current State | Uplift |
|------|--------------|--------|
| agentic-lib | Basic `test` and `build` scripts | Add `update-to-minor`, `update-to-greatest`, `everything`, `test:unit`, `test:integration` |
| repository0 | Minimal `test` script | Add `update-to-*` scripts, `everything` |
| xn--intenton-z2a.com | CDK scripts exist but are basic | Add `synth:ci`, `synth:prod`, `diff`, `update-to-*`, `everything` |

## Steps

1. Add `npm-check-updates` as a devDependency in all 3 repos
2. Add `update-to-minor` and `update-to-greatest` scripts
3. Add `everything` script per repo
4. Split test scripts by type (unit, integration, synthetic)
5. Add CDK environment-specific scripts to xn--intenton-z2a.com
6. Create a CI workflow that runs `update-to-minor` weekly and opens a PR

## Source Examples

- `diy-accounting-limited/submit.diyaccounting.co.uk/package.json` — ~90 scripts covering all patterns above
