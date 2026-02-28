# BACKLOG: AWS Account Topology & Synthetic Testing

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### Multi-Account AWS with OIDC Role Chaining

diy-accounting-limited uses separate AWS accounts per concern (gateway, spreadsheets, root) with:
- Per-account OIDC trust roles (`SUBMIT_ACTIONS_ROLE_ARN`, `GATEWAY_ACTIONS_ROLE_ARN`, `ROOT_ACTIONS_ROLE_ARN`)
- Role chaining: GitHub Actions assumes an OIDC role, then that role assumes a deployment role in the target account
- Trust policies scoped to specific repositories and branches

**Applicability to intentïon:**
- xn--intenton-z2a.com already uses OIDC for AWS (`CDK_ACTIONS_ROLE_ARN`)
- Consider separating telemetry/stats (S3 buckets) from website infrastructure into distinct accounts
- Add branch-scoped trust policies (currently only repo-scoped)

### Synthetic Testing with CloudWatch Metrics

diy-accounting-limited runs hourly behaviour tests (`synthetic-test.yml`) that:
- Create a test user via Cognito API
- Run the full user journey against the deployed environment
- Publish pass/fail metrics to CloudWatch
- Clean up the test user (even on failure)
- Retry once on failure before reporting

**Applicability to intentïon:**
- After repository0 experiments are deployed, run synthetic tests to verify the loop is healthy
- Publish experiment health metrics to CloudWatch (e.g., "last successful evolution", "time since last commit")
- Could feed into the showcase page on xn--intenton-z2a.com

### Test Report Publishing

Test results are uploaded to S3 and served from the deployed website (`{deployment}.domain/test-reports/`).

**Applicability to intentïon:**
- Publish agentic-step test results to the stats dashboard
- Serve experiment health reports from xn--intenton-z2a.com

## Steps

1. Audit current OIDC trust policies in xn--intenton-z2a.com CDK stacks
2. Add branch-scoping to trust policies
3. Design synthetic test for repository0 experiment health
4. Implement CloudWatch metrics for experiment monitoring
5. Add test report publishing to the stats pipeline

## Source Examples

- `diy-accounting-limited/root.diyaccounting.co.uk/.github/workflows/deploy.yml` — multi-account deployment
- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/workflows/synthetic-test.yml` — behaviour tests
- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/workflows/deploy-cdk-stack.yml` — reusable CDK deployment
