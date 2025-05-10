# REUSABLE_WORKFLOWS

## Crawl Summary
Access rules: same repo/public/private with configured Actions settings. Runner scopes: GitHub-hosted (caller context, caller billing), self-hosted (same owner/org). Limits: nesting≤4, uniqueCalls≤20, env contexts not shared. Define reusable workflows with on.workflow_call, inputs (required,type), secrets (required). Call via jobs.<job_id>.uses using owner/repo path or local path. Pass inputs via with and secrets via secrets or secrets: inherit. Matrix support: strategy.matrix. Supported job-level keywords restricted to name, uses, with, secrets, strategy, needs, if, concurrency, permissions. Outputs: define on.workflow_call.outputs mapping to job.outputs and step.outputs, consume via needs.job.outputs.<id>.

## Normalised Extract
Table of Contents:
1. Access Rules
2. Runner Configuration
3. Limitations
4. Workflow Definition
5. Invocation Syntax
6. Passing Data
7. Matrix Usage
8. Supported Job Keywords
9. Nesting
10. Outputs

1. Access Rules
• Same-repo: direct
• Public: allowed if organization setting Enable public workflows
• Private: called repo must allow caller repository in Access policy

2. Runner Configuration
GitHub-hosted: runs in caller context, cannot use called repo runners
Self-hosted: available if owned by caller org/user and runner is assigned to caller repo or org

3. Limitations
nesting depth=4
unique reusable calls per file≤20
workflow-level env not propagated
use vars context for shared variables
jobs only anchors for reuse, no GITHUB_ENV across workflows

4. Workflow Definition
File: .github/workflows/<file>.yml
Trigger: on:
  workflow_call:
    inputs:
      <id>:
        required: true
        type: string|number|boolean
    secrets:
      <id>:
        required: true

5. Invocation Syntax
jobs.<job_id>.uses: "{owner}/{repo}/.github/workflows/{file}@{ref}" or "./.github/workflows/{file}". Ref: SHA|tag|branch

6. Passing Data
Inputs: jobs.<job_id>.with.<id>:<value>
Secrets: jobs.<job_id>.secrets.<id>:${{secrets.<id>}} or secrets: inherit

7. Matrix Usage
strategy:
  matrix:
    <var>:[...]
jobs.<job_id>.uses: ...
with:
  <input-id>: ${{ matrix.<var> }}

8. Supported Job Keywords
name, uses, with, with.<id>, secrets, secrets.<id>, secrets.inherit, strategy, needs, if, concurrency, permissions

9. Nesting
Max depth=4; uses inside reusable workflows same syntax; secrets only passed to immediate child

10. Outputs
Definition in reusable:
on:
  workflow_call:
    outputs:
      <id>:
        value:${{jobs.<job>.outputs.<job-out>}}

Map step to job outputs:
jobs:<job>:
  outputs:
    <job-out>:${{steps.<step>.outputs.<step-out>}}
steps:
  - run: echo "<step-out>=value" >> $GITHUB_OUTPUT

Use in caller:
needs.<job>.outputs.<id>


## Supplementary Details
Parameters and Configuration:
• owner: GitHub username or organization
• repo: repository name
• file: workflow filename with .yml
• ref: commit SHA|tag|branch (commit SHA recommended)
• input type options: string, number, boolean
• secret names: must match repository or organization-level secret keys
• vars context: organization, repository, or environment-level variables
• Default GITHUB_TOKEN permissions: read/write based on repo settings; can be downgraded in called workflow

Implementation Steps:
1. Create reusable workflow (.github/workflows/reusable.yml): define on.workflow_call with inputs/secrets
2. Reference inputs via ${{ inputs.<id> }} and secrets via ${{ secrets.<id> }} in steps
3. In caller workflow, under jobs, define uses, with, and secrets sections
4. For matrices, set strategy.matrix and use ${{ matrix.<var> }} in with
5. For nested workflows, call uses inside the reusable workflow jobs
6. Define outputs in on.workflow_call.outputs and map steps to job outputs
7. In caller, reference outputs using needs.<job>.outputs.<id>

Configuration Effects:
• Using SHA locks version; using branch allows updates over time; tag recommended for stable releases
• secrets: inherit passes all caller secrets to called workflows in same org/enterprise
• secrets explicit limit data shared to named secrets
• env contexts are isolated; use outputs or vars for cross-context data


## Reference Details
on.workflow_call.inputs syntax:
  <input_id>:
    required: true|false
    type: string|number|boolean

on.workflow_call.secrets syntax:
  <secret_id>:
    required: true|false

on.workflow_call.outputs syntax:
  <output_id>:
    description: string (optional)
    value: expression using jobs.<job_id>.outputs.<job_output>

jobs.<job_id>.uses: string → "{owner}/{repo}/.github/workflows/{file}@{ref}" | "./.github/workflows/{file}"
jobs.<job_id>.with.<input_id>: string|number|boolean literal or expression
jobs.<job_id>.secrets.<secret_id>: ${{ secrets.<secret_name> }}
jobs.<job_id>.secrets: inherit
jobs.<job_id>.strategy:
  matrix:
    <var>: [ <values> ]
jobs.<job_id>.needs: string or [string]
jobs.<job_id>.if: conditional expression
jobs.<job_id>.concurrency:
  group: string
  cancel-in-progress: true|false
jobs.<job_id>.permissions:
  <scope>: read|write

Concrete Examples:
Reusable workflow definition:
```yaml
name: Label Configurable
on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      token:
        required: true
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.token }}
          configuration-path: ${{ inputs.config-path }}
```

Caller workflow:
```yaml
name: Call Label Workflow
on:
  pull_request:
    branches: [main]
jobs:
  call-label:
    permissions:
      contents: read
      pull-requests: write
    uses: octo-org/example-repo/.github/workflows/label-workflow.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}
```

Best Practices:
• Use commit SHAs in uses reference: ensures immutability
• Explicitly define inputs and secrets with required flags
• Limit nesting and calls to documented maxima (4 levels, 20 workflows)
• Use secrets: inherit for enterprise-wide secret propagation
• Map step outputs to job outputs for tracking and debugging

Troubleshooting:
Command: gh workflow run <workflow_file> --ref <ref>
Expected: Workflow starts and calls defined reusable workflows

Error: "The workflow called by jobs.<job_id>.uses was not found"
→ Verify file path, owner/repo and ref values

Error: "Maximum reusable workflow depth exceeded"
→ Reduce nesting levels to 4 or fewer

Error: "Workflow is not accessible"
→ Configure Actions settings and repository access policies

Error: "Input <id> not defined"
→ Match input-id in caller with on.workflow_call.inputs


## Information Dense Extract
access:sameRepo|publicAllowed|privateAllowed;runners:hosted(callerContext)|selfHosted(sameOwnerOrg);limits:nesting<=4,uniqueCalls<=20,envNotPropagated,useVars;define:on.workflow_call{inputs:{id:{required,type}},secrets:{id:{required}}};invoke:jobs.id.uses={owner/repo/.github/workflows/file@ref}|./.github/workflows/file;pass:jobs.id.with.id:value,jobs.id.secrets.id:${{secrets}}|inherit;matrix:strategy.matrix var:[...],uses...,with.var;support: name,uses,with,with.id,secrets,inherit,strategy,needs,if,concurrency(group,cancel),permissions;outputs:on.workflow_call.outputs.id:{value:jobs.job.outputs.out},jobs.job.outputs.out:steps.step.outputs.stepOut;consume:needs.job.outputs.id;best:useSHA,explicitInputs,secretsInherit;troubleshoot:verifyPaths,depth,access,inputs;gh workflow run <file>--ref;<ref>.

## Sanitised Extract
Table of Contents:
1. Access Rules
2. Runner Configuration
3. Limitations
4. Workflow Definition
5. Invocation Syntax
6. Passing Data
7. Matrix Usage
8. Supported Job Keywords
9. Nesting
10. Outputs

1. Access Rules
 Same-repo: direct
 Public: allowed if organization setting Enable public workflows
 Private: called repo must allow caller repository in Access policy

2. Runner Configuration
GitHub-hosted: runs in caller context, cannot use called repo runners
Self-hosted: available if owned by caller org/user and runner is assigned to caller repo or org

3. Limitations
nesting depth=4
unique reusable calls per file20
workflow-level env not propagated
use vars context for shared variables
jobs only anchors for reuse, no GITHUB_ENV across workflows

4. Workflow Definition
File: .github/workflows/<file>.yml
Trigger: on:
  workflow_call:
    inputs:
      <id>:
        required: true
        type: string|number|boolean
    secrets:
      <id>:
        required: true

5. Invocation Syntax
jobs.<job_id>.uses: '{owner}/{repo}/.github/workflows/{file}@{ref}' or './.github/workflows/{file}'. Ref: SHA|tag|branch

6. Passing Data
Inputs: jobs.<job_id>.with.<id>:<value>
Secrets: jobs.<job_id>.secrets.<id>:${{secrets.<id>}} or secrets: inherit

7. Matrix Usage
strategy:
  matrix:
    <var>:[...]
jobs.<job_id>.uses: ...
with:
  <input-id>: ${{ matrix.<var> }}

8. Supported Job Keywords
name, uses, with, with.<id>, secrets, secrets.<id>, secrets.inherit, strategy, needs, if, concurrency, permissions

9. Nesting
Max depth=4; uses inside reusable workflows same syntax; secrets only passed to immediate child

10. Outputs
Definition in reusable:
on:
  workflow_call:
    outputs:
      <id>:
        value:${{jobs.<job>.outputs.<job-out>}}

Map step to job outputs:
jobs:<job>:
  outputs:
    <job-out>:${{steps.<step>.outputs.<step-out>}}
steps:
  - run: echo '<step-out>=value' >> $GITHUB_OUTPUT

Use in caller:
needs.<job>.outputs.<id>

## Original Source
GitHub Actions Reusable Workflows (workflow_call)
https://docs.github.com/en/actions/using-workflows/reusing-workflows#example-using-workflow_call

## Digest of REUSABLE_WORKFLOWS

# Access to Reusable Workflows
A reusable workflow can be used by another workflow if any of the following is true:
• Both workflows are in the same repository.
• The called workflow is in a public repository and organization settings allow public reusable workflows.
• The called workflow is in a private repository and repository settings permit access.

Actions settings requirements:
• Caller repository Actions permissions must allow actions and reusable workflows (Manage settings → Actions → General → Allow reuse).
• For private called workflows, repository Access policy must allow incoming requests from caller repositories.

# Using Runners
GitHub-hosted runners:
• Evaluated entirely in caller context.
• Billing and assignment scoped to caller.
• Cannot use GitHub-hosted runners from the called repository.

Self-hosted runners:
• Accessible if owned by same user/organization as caller.
• Runner must be attached to caller repository or its organization.

# Limitations
• Maximum nesting depth: 4 workflows (top-level + 3 reusable levels).
• Maximum unique reusable workflows per file: 20 (includes nested trees).
• Workflow-level env variables in caller are not propagated to called workflows.
• Called workflow-level env variables are not accessible in caller; use outputs instead.
• To share variables, define them at organization, repository, or environment level and reference via vars context.
• Reusable workflows must be called in jobs, not in steps; cannot use GITHUB_ENV for cross-workflow variable passing.

# Creating a Reusable Workflow
Location: .github/workflows/<filename>.yml (no subdirectories).
Trigger key: workflow_call

Minimal structure:
```yaml
on:
  workflow_call:
``` 

# Defining Inputs and Secrets
```yaml
on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      personal_access_token:
        required: true
``` 
Reference in jobs:
```yaml
jobs:
  job-id:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.personal_access_token }}
          configuration-path: ${{ inputs.config-path }}
```

# Calling a Reusable Workflow
Within a job definition, use the uses keyword:
```yaml
jobs:
  call-job:
    uses: octo-org/repo/.github/workflows/workflow.yml@main
``` 
Reference syntaxes:
• Owner repo: `{owner}/{repo}/.github/workflows/{file}@{ref}`
• Local workflow: `./.github/workflows/{file}`

Ref options: commit SHA, release tag, or branch (tag precedence if name conflict).

# Passing Inputs and Secrets
```yaml
jobs:
  call-data:
    uses: octo-org/repo/.github/workflows/workflow.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      personal_access_token: ${{ secrets.GITHUB_TOKEN }}
``` 
Implicit inheritance in same org/enterprise:
```yaml
    secrets: inherit
```

# Using a Matrix Strategy
```yaml
jobs:
  deploy-with-matrix:
    strategy:
      matrix:
        target: [dev, stage, prod]
    uses: octocat/deploy-repo/.github/workflows/deploy.yml@main
    with:
      target: ${{ matrix.target }}
``` 

# Supported Job Keywords for Workflow Calls
• name
• uses
• with
• with.<input_id>
• secrets
• secrets.<secret_id>
• secrets.inherit
• strategy
• needs
• if
• concurrency
• concurrency.group
• concurrency.cancel-in-progress
• permissions

# Nesting Reusable Workflows
Depth limit: 4.
From within a reusable workflow:
```yaml
jobs:
  nested-call:
    uses: octo-org/repo/.github/workflows/inner.yml@v1
``` 
Secrets passed only to directly called workflow.

# Using Outputs from a Reusable Workflow
Define workflow outputs:
```yaml
on:
  workflow_call:
    outputs:
      firstword:
        value: ${{ jobs.job_id.outputs.out1 }}
      secondword:
        value: ${{ jobs.job_id.outputs.out2 }}
``` 
Map step outputs to job outputs:
```yaml
jobs:
  job_id:
    runs-on: ubuntu-latest
    outputs:
      out1: ${{ steps.step1.outputs.word1 }}
      out2: ${{ steps.step2.outputs.word2 }}
    steps:
      - id: step1
        run: echo "word1=hello" >> $GITHUB_OUTPUT
      - id: step2
        run: echo "word2=world" >> $GITHUB_OUTPUT
``` 
Consume in caller:
```yaml
jobs:
  caller-job:
    uses: octo-org/repo/.github/workflows/called.yml@v1
  use-outputs:
    needs: caller-job
    runs-on: ubuntu-latest
    steps:
      - run: echo ${{ needs.caller-job.outputs.firstword }} ${{ needs.caller-job.outputs.secondword }}
```

## Attribution
- Source: GitHub Actions Reusable Workflows (workflow_call)
- URL: https://docs.github.com/en/actions/using-workflows/reusing-workflows#example-using-workflow_call
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-10T14:58:53.187Z
- Data Size: 610171 bytes
- Links Found: 9297

## Retrieved
2025-05-10
