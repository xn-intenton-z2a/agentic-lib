# BACKLOG: Code Style & Formatting

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### Prettier + ESLint (JavaScript/TypeScript)

diy-accounting-limited uses:
- **Prettier** for formatting (consistent whitespace, quotes, semicolons)
- **ESLint** for linting (code quality rules, unused vars, etc.)
- Separate scripts: `format` (Prettier) and `lint` (ESLint)
- CI runs both in check mode (`--check` / `--max-warnings 0`)

```json
{
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "lint": "eslint .",
  "lint:fix": "eslint --fix ."
}
```

### Spotless (Java/CDK)

For the Java CDK code, Spotless enforces formatting:
```xml
<plugin>
  <groupId>com.diffplug.spotless</groupId>
  <artifactId>spotless-maven-plugin</artifactId>
  <configuration>
    <java>
      <googleJavaFormat/>
    </java>
  </configuration>
</plugin>
```

### Pre-commit Hooks

husky + lint-staged for pre-commit formatting:
```json
{
  "lint-staged": {
    "*.{js,ts,json,md}": "prettier --write",
    "*.{js,ts}": "eslint --fix"
  }
}
```

**Applicability to intentïon:**

| Repo | Current State | Uplift |
|------|--------------|--------|
| agentic-lib | No formatter configured | Add Prettier + ESLint |
| repository0 | No formatter configured | Add Prettier + ESLint (minimal — template should be lightweight) |
| xn--intenton-z2a.com | No formatter configured | Add Prettier (JS) + Spotless (Java CDK) |

**Note:** The CLAUDE.md rule "only run linting/formatting fixes when specifically asked" applies to Claude's behaviour, not to CI. CI should always enforce formatting.

## Steps

1. Add Prettier config (`.prettierrc`) to all 3 repos
2. Add ESLint config to agentic-lib and repository0
3. Add format/lint scripts to package.json
4. Add Spotless to xn--intenton-z2a.com Maven config
5. Add CI step that checks formatting (fail on diff)
6. Optionally add husky + lint-staged for local pre-commit hooks

## Source Examples

- `diy-accounting-limited/submit.diyaccounting.co.uk/package.json` — format/lint scripts
- `diy-accounting-limited/submit.diyaccounting.co.uk/.prettierrc` — Prettier config
