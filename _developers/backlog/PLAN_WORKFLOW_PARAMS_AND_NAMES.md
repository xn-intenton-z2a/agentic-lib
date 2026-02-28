# BACKLOG: Workflow Params & Names Pattern

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### params → names → action Job Chain

Every deployment workflow in diy-accounting-limited follows a consistent three-job pattern:

1. **`params` job** — Normalises workflow inputs. Uses `(auto)` as a sentinel default value to auto-detect from context (branch name, commit SHA, etc.). Outputs clean, validated parameters.

2. **`names` job** — Calls a `get-names` composite action that computes all deployment/environment names from the params. Outputs: `environment-name`, `deployment-name`, `base-domain`, `apex-domain`, `holding-domain`, `public-domain`.

3. **Action jobs** — The actual work (deploy, test, etc.) receives computed names as inputs, never raw branch/SHA values.

**Why this matters:**
- Single source of truth for naming conventions
- Every job gets consistent, pre-computed values
- Easy to change naming schemes without touching every workflow
- `workflow_dispatch` inputs get sane defaults via the `(auto)` sentinel

### get-names Composite Action

A reusable composite action at `.github/actions/get-names/action.yml` that:
- Takes `ref` and `sha` as inputs
- Computes `environment-name`: `prod` if ref is `refs/heads/main`, otherwise `ci`
- Computes `deployment-name`: `prod-{sha7}` for main, `ci-{sanitised-branch}` for others
- Computes domain names using the deployment name as a prefix

**Applicability to intentïon:**
- agentic-lib workflows currently hardcode branch detection logic
- A `get-names` action would centralise environment/branch logic
- Could extend to compute experiment names for repository0 sandbox instances

### (auto) Default Pattern

```yaml
inputs:
  ref:
    description: 'Git ref to deploy'
    required: false
    default: '(auto)'
```

The `params` job detects `(auto)` and replaces it with the actual context value (e.g., `github.ref`). This lets workflow_dispatch callers override values for manual runs while automation gets the right defaults.

## Steps

1. Create a `get-names` composite action in agentic-lib at `.github/actions/get-names/`
2. Define naming conventions: environment (ci/prod), deployment, domains
3. Refactor existing workflows to use the params→names→action pattern
4. Add `(auto)` sentinel defaults to workflow_dispatch inputs
5. Document the pattern in a developer guide

## Source Examples

- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/workflows/deploy.yml` — full params→names→action chain
- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/actions/get-names/action.yml` — composite action implementation
