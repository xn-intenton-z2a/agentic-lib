# BACKLOG: Apex Domain Naming Convention

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### Domain Naming Hierarchy

diy-accounting-limited uses a consistent four-tier domain naming scheme:

| Name | Pattern | Example | Purpose |
|------|---------|---------|---------|
| `base-domain` | `{deployment}.{service}.{root}` | `ci-feature-x.submit.diyaccounting.co.uk` | Unique per deployment |
| `apex-domain` | `{environment}-{service}.{root}` | `ci-submit.diyaccounting.co.uk` | Latest for environment |
| `holding-domain` | `holding-{service}.{root}` | `holding-submit.diyaccounting.co.uk` | Placeholder before first deploy |
| `public-domain` | `{service}.{root}` | `submit.diyaccounting.co.uk` | Production alias (prod only) |

- Every deployment gets a unique `base-domain` that never changes (immutable URL)
- The `apex-domain` always points to the latest deployment in that environment
- `public-domain` is only set for prod — it's the user-facing URL
- `holding-domain` serves a "coming soon" page until the first real deployment

### CloudFront Domain Auto-Discovery

Rather than hardcoding CloudFront distribution domains, the deploy workflow queries the CDK stack outputs:

```bash
aws cloudformation describe-stacks --stack-name $STACK_NAME \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionDomainName`].OutputValue'
```

This is then used to create/update Route53 CNAME records.

**Applicability to intentïon:**
- xn--intenton-z2a.com currently has a single domain (`xn--intenton-z2a.com`)
- For CI previews, could use `ci.xn--intenton-z2a.com` or `{branch}.xn--intenton-z2a.com`
- Showcase page could live at `showcase.xn--intenton-z2a.com`
- Stats dashboard could live at `stats.xn--intenton-z2a.com`
- Each demo repo's deployed site could get a subdomain

## Steps

1. Define the domain naming scheme for intentïon services
2. Update CDK stacks to output distribution domain names
3. Add Route53 record management to deployment workflows
4. Implement CI preview domains for xn--intenton-z2a.com
5. Document domain naming conventions

## Source Examples

- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/actions/get-names/action.yml` — domain computation
- `diy-accounting-limited/root.diyaccounting.co.uk/.github/workflows/deploy.yml` — CloudFront auto-discovery and Route53 management
