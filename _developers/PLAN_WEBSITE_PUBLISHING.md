# BACKLOG: Website Publishing Pipeline

Uplift to best practice from diy-accounting-limited. Not an MVP feature — production readiness backlog.

## Patterns to Adopt

### S3 Upload from Deployment

diy-accounting-limited uploads static assets to S3 as part of the CDK deployment:
- CDK stack creates the S3 bucket with CloudFront distribution
- Post-deploy step syncs built assets to S3 (`aws s3 sync`)
- CloudFront invalidation triggered after sync
- Cache-control headers set per file type

### Test Reports Published to Deployed Site

After tests run, HTML test reports are uploaded to the deployment's S3 bucket:
```
{base-domain}/test-reports/unit/index.html
{base-domain}/test-reports/integration/index.html
{base-domain}/test-reports/synthetic/index.html
```

This means every deployment carries its own test evidence — reviewers can check results before approving a prod promotion.

### Diagram Generation

Package.json includes scripts to generate architecture diagrams from CDK:
```json
{
  "diagram": "cdk-dia --stacks '*' --output docs/architecture.png"
}
```

Diagrams are committed to the repo and served from the website.

**Applicability to intentïon:**

- xn--intenton-z2a.com already deploys to S3 via CDK, but:
  - No CloudFront invalidation in the pipeline
  - No test report publishing
  - No architecture diagrams
  - Stats dashboard publishes separately via `wfr-github-stats-to-aws.yml`
- Could unify the stats pipeline with the main website deployment
- Showcase page content could be generated and published as part of deploy

## Steps

1. Add CloudFront invalidation to xn--intenton-z2a.com deploy workflow
2. Add test report publishing (upload HTML reports to S3 post-test)
3. Unify stats pipeline with website deployment
4. Add architecture diagram generation to CDK scripts
5. Set up proper cache-control headers per asset type

## Source Examples

- `diy-accounting-limited/submit.diyaccounting.co.uk/.github/workflows/deploy.yml` — S3 sync and CloudFront invalidation
- `diy-accounting-limited/submit.diyaccounting.co.uk/package.json` — diagram generation scripts
