# BACKLOG: CI/Prod Branching Strategy

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### Branch-Based Environment Selection

diy-accounting-limited uses a simple, deterministic rule:
- `main` branch → `prod` environment
- Everything else → `ci` environment

This is computed in the `get-names` composite action and used everywhere:
- GitHub Actions environment protection rules (prod requires approval)
- AWS resource naming (`ci-*` vs `prod-*`)
- Domain naming (`ci-submit.diyaccounting.co.uk` vs `submit.diyaccounting.co.uk`)
- SSM Parameter Store keys (environment-scoped)

### GitHub Actions Environments

```yaml
jobs:
  deploy:
    environment:
      name: ${{ needs.names.outputs.environment-name }}
      url: https://${{ needs.names.outputs.public-domain }}
```

- `prod` environment has protection rules (required reviewers, wait timer)
- `ci` environment has no restrictions — deploys on every push
- Environment-specific secrets (different AWS roles per environment)

### SSM Parameter Store for Last-Known-Good

After a successful deployment, the deployment name is written to SSM Parameter Store:
```
/submit/ci/last-known-good-deployment → ci-feature-branch-abc1234
/submit/prod/last-known-good-deployment → prod-abc1234
```

This enables rollback and provides an audit trail of what's deployed.

**Applicability to intentïon:**
- Currently no CI/prod distinction — everything runs on main or refresh
- For production readiness, repository0 experiments should have CI and prod environments
- The stats pipeline could use environment-scoped S3 paths
- xn--intenton-z2a.com CDK could deploy CI stacks for PR previews

## Steps

1. Define CI/prod environment strategy for each repo
2. Create GitHub Actions environments (`ci`, `prod`) with appropriate protection rules
3. Add environment selection to the get-names action (see PLAN_WORKFLOW_PARAMS_AND_NAMES.md)
4. Update xn--intenton-z2a.com CDK to support CI stack deployments
5. Add SSM Parameter Store tracking for deployed versions
6. Document the branching strategy

## Source Examples

- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/actions/get-names/action.yml` — environment computation logic
- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/workflows/deploy.yml` — environment usage in jobs
