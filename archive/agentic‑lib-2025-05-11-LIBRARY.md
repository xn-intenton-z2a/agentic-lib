sandbox/library/REST_QUICKSTART.md
# sandbox/library/REST_QUICKSTART.md
# REST_QUICKSTART

## Crawl Summary
GitHub CLI: gh auth login; gh api <path> --method <METHOD> --header Accept --header Authorization --field key=value. Octokit.js: npm install octokit; import { Octokit }; new Octokit({auth}); await octokit.request('GET /repos/{owner}/{repo}/issues',{owner,repo}); error.status and error.response.data.message. curl: curl --request GET --url URL --header Accept:application/vnd.github+json --header Authorization:Bearer token. Use GH_TOKEN or GITHUB_TOKEN in GitHub Actions; generate JWT via actions/create-github-app-token@v1 with app-id and private-key.

## Normalised Extract
Table of Contents
1 GitHub CLI Setup and Usage
2 Octokit.js Setup and Usage
3 curl Setup and Usage

1 GitHub CLI Setup and Usage
Install: Download and install GitHub CLI from GitHub CLI repository. Authenticate: gh auth login. Select host, choose HTTPS or SSH. Stored credentials if HTTPS. Make API calls: gh api /repos/{owner}/{repo}/issues --method GET --header Accept:application/vnd.github+json --header Authorization:Bearer YOUR-TOKEN. GitHub Actions: set env GH_TOKEN to ${{ secrets.GITHUB_TOKEN }} and run gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

2 Octokit.js Setup and Usage
Dependencies: npm install octokit. Import: import { Octokit } from "octokit". Initialize: const octokit = new Octokit({ auth: 'YOUR-TOKEN' }). Request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" }). Error handling: catch error; read error.status, error.response.data.message. GitHub Actions workflow: uses actions/checkout@v4, actions/setup-node@v4 node-version 16.17.0, npm install octokit, run script with env TOKEN=${{ secrets.GITHUB_TOKEN }}

3 curl Setup and Usage
Install: ensure curl installed (curl --version). Authentication: use header Authorization: Bearer YOUR-TOKEN or token. Syntax: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN". GitHub Actions: set env GH_TOKEN=${{ secrets.GITHUB_TOKEN }}, run curl command with $GH_TOKEN

## Supplementary Details
Authentication: Use personal access token or GitHub App user access token. For Apps generate installation token with actions/create-github-app-token@v1 inputs: app-id: ${{ vars.APP_ID }}, private-key: ${{ secrets.APP_PEM }}. Token expires in 60 minutes. Use env GH_TOKEN or GITHUB_TOKEN in workflows. Octokit.js supports RequestParameters interface: path params, query params, body params. curl supports JSON web token only with Bearer. CLI supports --field for form or JSON payload.

## Reference Details
GitHub CLI Method Signature: gh api <endpoint:string> --method <HTTP_METHOD:string=GET> [--header:string]* [--field:key=value]*. Returns: JSON response to stdout, exit code 0 on HTTP status 2xx, exit code 22 on HTTP errors. Flags: -v for verbose. Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

Octokit.js Method Signature: request<T = any>(route:string, parameters?: RequestParameters): Promise<OctokitResponse<T>>. RequestParameters fields: owner:string, repo:string, per_page?:number, page?:number, title?:string, body?:string. OctokitResponse<T>: { data:T; status:number; headers:IncomingHttpHeaders }. Example:
import { Octokit } from "octokit"
const octokit = new Octokit({ auth: process.env.TOKEN })
try {
  const response = await octokit.request("GET /repos/{owner}/{repo}/issues", { owner:"octocat", repo:"Spoon-Knife" })
  console.log(response.data)
} catch(error) {
  console.error(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
}

curl Command Syntax: curl --request GET --url URL --header "Accept: application/vnd.github+json" --header "Authorization: Bearer TOKEN". Debug: add -v; test version: curl --version. Check rate limit: curl --request GET --url https://api.github.com/rate_limit --header "Authorization: Bearer TOKEN". Troubleshooting: HTTP 401 unauthorized means invalid token; HTTP 403 forbidden when rate limit exceeded. Use curl --request GET --url https://api.github.com/rate_limit to inspect.

## Information Dense Extract
gh auth login; gh api /repos/{owner}/{repo}/issues --method GET --header "Accept:application/vnd.github+json" --header "Authorization:Bearer TOKEN"; npm install octokit; import {Octokit}; new Octokit({auth}); await octokit.request("GET /repos/{owner}/{repo}/issues",{owner,repo}); catch error.status,error.response.data.message; curl --request GET --url URL --header Accept:application/vnd.github+json --header Authorization:Bearer TOKEN; use GH_TOKEN or GITHUB_TOKEN in workflows; generate app token via actions/create-github-app-token@v1 with app-id,private-key; token expires 60m; debug: gh --version,curl --version, gh api /rate_limit

## Sanitised Extract
Table of Contents
1 GitHub CLI Setup and Usage
2 Octokit.js Setup and Usage
3 curl Setup and Usage

1 GitHub CLI Setup and Usage
Install: Download and install GitHub CLI from GitHub CLI repository. Authenticate: gh auth login. Select host, choose HTTPS or SSH. Stored credentials if HTTPS. Make API calls: gh api /repos/{owner}/{repo}/issues --method GET --header Accept:application/vnd.github+json --header Authorization:Bearer YOUR-TOKEN. GitHub Actions: set env GH_TOKEN to ${{ secrets.GITHUB_TOKEN }} and run gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

2 Octokit.js Setup and Usage
Dependencies: npm install octokit. Import: import { Octokit } from 'octokit'. Initialize: const octokit = new Octokit({ auth: 'YOUR-TOKEN' }). Request: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }). Error handling: catch error; read error.status, error.response.data.message. GitHub Actions workflow: uses actions/checkout@v4, actions/setup-node@v4 node-version 16.17.0, npm install octokit, run script with env TOKEN=${{ secrets.GITHUB_TOKEN }}

3 curl Setup and Usage
Install: ensure curl installed (curl --version). Authentication: use header Authorization: Bearer YOUR-TOKEN or token. Syntax: curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer YOUR-TOKEN'. GitHub Actions: set env GH_TOKEN=${{ secrets.GITHUB_TOKEN }}, run curl command with $GH_TOKEN

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of REST_QUICKSTART

# GitHub CLI Quickstart

## Installation
Install GitHub CLI on macOS, Windows, or Linux. See https://github.com/cli/cli#installation.

## Authentication
Command: gh auth login
Prompts:
- Select GitHub.com or Other and enter hostname.
- Choose protocol: HTTPS stores credentials automatically; SSH config as usual.

## API Requests
Syntax: gh api <path> --method <METHOD> [--header <header>] [--field <name>=<value>]
Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

## GitHub Actions Example
Environment variable: GH_TOKEN=${{ secrets.GITHUB_TOKEN }}
Run step:
  run: gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

# Using Octokit.js

## Installation
npm install octokit

## Import
import { Octokit } from "octokit"

## Initialization
const octokit = new Octokit({ auth: 'YOUR-TOKEN' })

## Request Example
await octokit.request("GET /repos/{owner}/{repo}/issues", {
  owner: "octocat",
  repo: "Spoon-Knife",
})

## Error Handling
try {
  // request
} catch (error) {
  console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
}

## GitHub Actions Workflow
jobs:
  use_api_via_script:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '16.17.0'
          cache: npm
      - run: npm install octokit
      - run: node .github/actions-scripts/use-the-api.mjs
        env:
          TOKEN: ${{ secrets.GITHUB_TOKEN }}

# Using curl

## Authentication Header
Authorization: Bearer YOUR-TOKEN or Authorization: token YOUR-TOKEN

## Request Syntax
curl --request GET \
  --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer YOUR-TOKEN"

## GitHub Actions Example
Environment variable: GH_TOKEN=${{ secrets.GITHUB_TOKEN }}
Run step:
  run: |
    curl --request GET \
      --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
      --header "Accept: application/vnd.github+json" \
      --header "Authorization: Bearer $GH_TOKEN"

## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-10T23:57:21.004Z
- Data Size: 2252959 bytes
- Links Found: 16072

## Retrieved
2025-05-10
sandbox/library/REUSABLE_WORKFLOWS.md
# sandbox/library/REUSABLE_WORKFLOWS.md
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
sandbox/library/NODEJS_HANDLER.md
# sandbox/library/NODEJS_HANDLER.md
# NODEJS_HANDLER

## Crawl Summary
Project initialization: npm init generates package.json and package-lock.json. Directory: index.mjs, package.json, package-lock.json, node_modules/. Handler: index.mjs exports async handler(event) returning Promise<string>; uses S3Client and PutObjectCommand. JSDoc defines event.order_id:string, event.amount:number, event.item:string. Handler config: fileName.exportedHandler. Input event shape JSON with order_id, amount, item. Valid signatures: async(event), async(event,context), callback(event,context,callback). SDK v3 integration: npm install @aws-sdk/client-s3@^3.0.0; import S3Client,PutObjectCommand; initialize client outside handler; send PutObjectCommand with Bucket,Key,Body. Environment variables: process.env.RECEIPT_BUCKET required. Initialization optimization: SDK client outside handler. Best practices: separate logic, bundle dependencies, minimize package size, reuse init phase, keep-alive, env vars for config, avoid recursion, no non-public APIs, idempotent code.

## Normalised Extract
Table of Contents:
1  Project Initialization
2  Directory Structure
3  Handler Implementation
4  Input Event Schema
5  Handler Signatures
6  AWS SDK Integration
7  Environment Variables
8  Initialization Optimization
9  Best Practices

1  Project Initialization
npm init
Generates package.json and package-lock.json

2  Directory Structure
/project-root
  index.mjs — main handler
  package.json — metadata
  package-lock.json — lock file
  node_modules/ — dependencies

3  Handler Implementation
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
export const handler = async(event) => {
    const bucketName = process.env.RECEIPT_BUCKET
    if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set')
    const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`
    const key = `receipts/${event.order_id}.txt`
    await uploadReceiptToS3(bucketName, key, receiptContent)
    return 'Success'
}

4  Input Event Schema
order_id: string
amount: number
item: string

5  Handler Signatures
export const handler = async (event)
export const handler = async (event, context)
export const handler = (event, context, callback)
callback(error: Error|null, response: any)

6  AWS SDK Integration
npm install @aws-sdk/client-s3@^3.0.0
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
const command = new PutObjectCommand({Bucket: bucketName, Key: key, Body: receiptContent})
await s3Client.send(command)

7  Environment Variables
RECEIPT_BUCKET required
Access via process.env.RECEIPT_BUCKET
Throw Error('RECEIPT_BUCKET environment variable is not set') if undefined

8  Initialization Optimization
Place client initialization outside handler to reuse across invocations

9  Best Practices
Separate handler and core logic
Bundle dependencies in deployment package
Minimize package size
Reuse execution environment; avoid global mutable state
Use keep-alive for HTTP connections
Pass configuration via environment variables
Avoid recursive invocations; use reserved concurrency to throttle
Do not use non-public AWS Lambda APIs
Implement idempotent handlers


## Supplementary Details
- Handler property: fileName.exportedFunctionName (default index.handler)
- AWS CLI to change handler:
  aws lambda update-function-configuration --function-name <name> --handler index.handler
- IAM permission required: Action: s3:PutObject; Resource: arn:aws:s3:::<RECEIPT_BUCKET>/*
- Environment variable definition via AWS CLI:
  aws lambda update-function-configuration --function-name <name> --environment Variables={RECEIPT_BUCKET=my-bucket}
- SDK client version: @aws-sdk/client-s3@^3.0.0
- Timeout default: 3s; adjust with --timeout <seconds> using AWS CLI
- Memory default: 128 MB; adjust with --memory-size <MB>
- Node.js runtimes support ES modules (.mjs) and CommonJS (.js)
- Context object fields: functionName:string, memoryLimitInMB:string, awsRequestId:string, getRemainingTimeInMillis():number
- Keep-alive directive example:
  import https from 'https'
  const agent = new https.Agent({ keepAlive: true })
  const s3Client = new S3Client({ requestHandler: new NodeHttpHandler({ httpsAgent: agent }) })
- Reserved concurrency throttle:
  aws lambda put-function-concurrency --function-name <name> --reserved-concurrent-executions 0


## Reference Details
- S3Client constructor
  constructor S3Client(config?: S3ClientConfig)
  S3ClientConfig fields: region?:string, credentials?:AwsCredentialIdentity, endpoint?:string, requestHandler?:HttpHandlerOptions

- PutObjectCommand
  constructor PutObjectCommand(input: PutObjectRequest)
  PutObjectRequest fields:
    Bucket: string (required)
    Key: string (required)
    Body: Uint8Array|Buffer|string|ReadableStream (required)
    ACL?: 'private'|'public-read'|'public-read-write'|'authenticated-read'|string
    ContentType?: string
    Metadata?: { [key:string]: string }
  response metadata in PutObjectOutput

- Handler signature
  export const handler(event: {order_id:string;amount:number;item:string}, context?: Context, callback?: (error: Error|null, response: any) => void): Promise<string> | void

- uploadReceiptToS3
  async function uploadReceiptToS3(bucketName: string, key: string, receiptContent: string): Promise<void>

- AWS CLI commands
  aws lambda update-function-configuration --function-name MyFunction --timeout 30
  aws lambda update-function-configuration --function-name MyFunction --memory-size 256
  aws lambda update-function-configuration --function-name MyFunction --environment Variables={RECEIPT_BUCKET=my-bucket}
  aws lambda get-function-configuration --function-name MyFunction --query Environment.Variables
  aws lambda put-function-concurrency --function-name MyFunction --reserved-concurrent-executions 0

- Logging and troubleshooting
  CloudWatch Logs filter:
    filter @message ERROR
  Expected log lines:
    START RequestId:... Duration:... ms
    Processed order 12345, stored in my-bucket
    END RequestId:... 
    REPORT RequestId:... Billed Duration:... ms Memory Size:... MB Max Memory Used:... MB

- Idempotency pattern
  import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
  async function processOrder(event) {
    const client = new DynamoDBClient()
    const key = { order_id: { S: event.order_id } }
    const existing = await client.send(new GetItemCommand({ TableName:'Orders', Key:key }))
    if (existing.Item) return 'Duplicate'
    // process and store
    await client.send(new PutItemCommand({ TableName:'Orders', Item:{ order_id:{S:event.order_id}, status:{S:'processed'} }}))
    return 'Success'
  }

- Code signing
  Enable via AWS Console or AWS CLI: 
    aws lambda update-function-configuration --function-name MyFunction --code-signing-config-arn <arn>


## Information Dense Extract
npm init; structure index.mjs,package.json,package-lock.json,node_modules. ESModule or CommonJS handler: export const handler(event[,context]):Promise<string> or callback. Input schema: order_id:string,amount:number,item:string. Bundled @aws-sdk/client-s3@^3.0.0; import S3Client,PutObjectCommand; initialize client outside handler. PutObjectCommand({Bucket,Key,Body}); await s3Client.send(command). Env var RECEIPT_BUCKET required; process.env.RECEIPT_BUCKET; throw if unset. IAM: s3:PutObject on arn:aws:s3:::<bucket>/*. Handler config index.handler. Valid signatures async(event), async(event,context), (event,context,callback). Best practices: separate logic, bundle deps, minimize size, reuse init, keep-alive agent, idempotency, avoid recursion, no non-public APIs. Troubleshoot: aws lambda update-function-configuration commands, CloudWatch Logs filter @message ERROR, expected START/END/REPORT lines.

## Sanitised Extract
Table of Contents:
1  Project Initialization
2  Directory Structure
3  Handler Implementation
4  Input Event Schema
5  Handler Signatures
6  AWS SDK Integration
7  Environment Variables
8  Initialization Optimization
9  Best Practices

1  Project Initialization
npm init
Generates package.json and package-lock.json

2  Directory Structure
/project-root
  index.mjs  main handler
  package.json  metadata
  package-lock.json  lock file
  node_modules/  dependencies

3  Handler Implementation
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
export const handler = async(event) => {
    const bucketName = process.env.RECEIPT_BUCKET
    if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set')
    const receiptContent = 'OrderID: ${event.order_id}'nAmount: $${event.amount.toFixed(2)}'nItem: ${event.item}'
    const key = 'receipts/${event.order_id}.txt'
    await uploadReceiptToS3(bucketName, key, receiptContent)
    return 'Success'
}

4  Input Event Schema
order_id: string
amount: number
item: string

5  Handler Signatures
export const handler = async (event)
export const handler = async (event, context)
export const handler = (event, context, callback)
callback(error: Error|null, response: any)

6  AWS SDK Integration
npm install @aws-sdk/client-s3@^3.0.0
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
const s3Client = new S3Client()
const command = new PutObjectCommand({Bucket: bucketName, Key: key, Body: receiptContent})
await s3Client.send(command)

7  Environment Variables
RECEIPT_BUCKET required
Access via process.env.RECEIPT_BUCKET
Throw Error('RECEIPT_BUCKET environment variable is not set') if undefined

8  Initialization Optimization
Place client initialization outside handler to reuse across invocations

9  Best Practices
Separate handler and core logic
Bundle dependencies in deployment package
Minimize package size
Reuse execution environment; avoid global mutable state
Use keep-alive for HTTP connections
Pass configuration via environment variables
Avoid recursive invocations; use reserved concurrency to throttle
Do not use non-public AWS Lambda APIs
Implement idempotent handlers

## Original Source
AWS Lambda Node.js Handler
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html

## Digest of NODEJS_HANDLER

# AWS Lambda Node.js Handler
Date Retrieved: 2024-06-04

# 1. Project Initialization

- Command: npm init
- Generates: package.json (metadata), package-lock.json (lock file)
- Supported file extensions: .js, .mjs

# 2. Directory Structure

/project-root
  ├── index.mjs      Contains main handler  
  ├── package.json   Project metadata and dependencies  
  ├── package-lock.json  Dependency lock file  
  └── node_modules/  Installed dependencies

# 3. Example Handler Implementation (index.mjs)

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize the S3 client outside the handler for reuse
const s3Client = new S3Client()

/**
 * Lambda handler for processing orders and storing receipts in S3.
 * @param {Object} event               Input event containing order details
 * @param {string} event.order_id      Unique identifier for the order
 * @param {number} event.amount        Order amount
 * @param {string} event.item          Item purchased
 * @returns {Promise<string>}          Success message
 */
export const handler = async(event) => {
    try {
        const bucketName = process.env.RECEIPT_BUCKET
        if (!bucketName) throw new Error('RECEIPT_BUCKET environment variable is not set')

        const receiptContent = `OrderID: ${event.order_id}\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`
        const key = `receipts/${event.order_id}.txt`

        await uploadReceiptToS3(bucketName, key, receiptContent)
        console.log(`Processed order ${event.order_id}, stored in ${bucketName}`)
        return 'Success'
    } catch (error) {
        console.error(`Failed to process order: ${error.message}`)
        throw error
    }
}

async function uploadReceiptToS3(bucketName, key, receiptContent) {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: receiptContent
        })
        await s3Client.send(command)
    } catch (error) {
        throw new Error(`Failed to upload receipt to S3: ${error.message}`)
    }
}

# 4. Handler Configuration

- Handler setting: fileName.exportedHandler (default index.handler)
- To change in console: Functions > Code > Runtime settings > Edit Handler > Save

# 5. Input Event Object

Expected JSON shape:
{
  "order_id": "12345",
  "amount": 199.99,
  "item": "Wireless Headphones"
}

# 6. Valid Handler Patterns

Async/await patterns:
export const handler = async(event) => { }
export const handler = async(event, context) => { }

Callback pattern:
export const handler = (event, context, callback) => { }
- callback(error: Error|null, response: any)
- context.callbackWaitsForEmptyEventLoop = false to send response immediately

# 7. AWS SDK for JavaScript v3

- Runtime includes SDK v3; recommended to bundle specific clients
- Install: npm install @aws-sdk/client-s3@^3.0.0
- Import: import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
- Initialize: const s3Client = new S3Client()

# 8. Environment Variables

- Access: process.env.RECEIPT_BUCKET
- Required: throw error if undefined
- Define in function configuration or deployment

# 9. Initialization Phase Optimization

- Initialize SDK clients, database connections outside handler
- Lambdas reuse initialized resources across invocations

# 10. Code Best Practices

- Separate handler and core logic for unit testing
- Bundle dependencies to control versions and updates
- Minimize deployment package size
- Reuse execution environment, avoid storing sensitive data globally
- Use keep-alive directive for persistent connections (see Reusing Connections with Keep-Alive in Node.js)
- Use environment variables for configuration
- Avoid recursive invocations; throttle by setting reserved concurrency to 0 if needed
- Do not use non-public Lambda internal APIs
- Write idempotent code and validate duplicate events



## Attribution
- Source: AWS Lambda Node.js Handler
- URL: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
- License: Amazon Software License (ASL)
- Crawl Date: 2025-05-10T13:10:00.670Z
- Data Size: 1987488 bytes
- Links Found: 35704

## Retrieved
2025-05-10
sandbox/library/JS_ACTION.md
# sandbox/library/JS_ACTION.md
# JS_ACTION

## Crawl Summary
action.yml exact fields: name, description, inputs: who-to-greet(required, default World), outputs: time; runs using node20 main index.js. Install Node.js v20, npm init -y. Install dependencies: npm install @actions/core @actions/github. index.js code uses core.getInput('who-to-greet'), console.log, core.setOutput('time',timestamp), github.context.payload logging, core.setFailed(error.message). Bundle with ncc build index.js --license licenses.txt, update main to dist/index.js. Commit action.yml, index.js, node_modules, package.json, package-lock.json, README.md; tag version; push tags. Example workflow YAML: uses: your-org/action@v1.0, with who-to-greet. Echo output.

## Normalised Extract
Table of Contents:
 1. action.yml metadata syntax
 2. Dependency installation
 3. index.js implementation
 4. Bundling with ncc
 5. Git steps for commit and release
 6. Workflow usage example

1. action.yml metadata syntax
 name: Hello World
 description: Greet someone and record the time
 inputs:
   who-to-greet:
     description: Who to greet
     required: true
     default: World
 outputs:
   time:
     description: The time we greeted you
 runs:
   using: node20
   main: index.js

2. Dependency installation
 Command: npm install @actions/core @actions/github
 Node.js: v20.x
 Optional bundler: npm install -g @vercel/ncc

3. index.js implementation
 const core = require('@actions/core')
 const github = require('@actions/github')
 try {
   const who = core.getInput('who-to-greet', { required: true })
   console.log(`Hello ${who}!`)
   const ts = new Date().toTimeString()
   core.setOutput('time', ts)
   const payload = JSON.stringify(github.context.payload, null, 2)
   console.log(`Event payload:\n${payload}`)
 } catch (e) {
   core.setFailed(e.message)
 }

4. Bundling with ncc
 Command: ncc build index.js --license licenses.txt
 Outputs: dist/index.js, dist/licenses.txt
 action.yml: runs.main: dist/index.js

5. Git steps for commit and release
 git add action.yml index.js node_modules package.json package-lock.json README.md
 git commit -m "release vX.Y"
 git tag -a vX.Y -m "vX.Y"
 git push --follow-tags

6. Workflow usage example
 on: [push]
 jobs:
   greet_job:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - uses: your-org/hello-world-javascript-action@vX.Y
         with:
           who-to-greet: Octocat
       - run: echo "Time: ${{ steps.greet_job.outputs.time }}"


## Supplementary Details
Parameter details:
 - who-to-greet input: required=true, default=World
 - time output: value set to ISO time string via new Date().toTimeString()
 Configuration:
 - runs.using: node20 ensures Node.js v20 runtime
 - runs.main: file path of entry point
 Implementation steps:
 1. npm init -y
 2. Install dependencies
 3. Create action.yml with inputs/outputs/runs
 4. Write index.js with error handling
 5. Optional bundle via ncc, adjust action.yml
 6. Commit files and version tag
 7. Push and use in workflows


## Reference Details
Complete API specs:
 @actions/core
   getInput(name: string, options?: { required?: boolean; trimWhitespace?: boolean; }): string
   setOutput(name: string, value: string): void
   setFailed(message: string): void
 @actions/github.context: object containing properties:
   payload: any (webhook event payload)

Method signatures:
 - core.getInput(name, { required }): retrieves input from action.yml
 - core.setOutput(name, value): sets action output
 - core.setFailed(message): logs error and exits non-zero

Implementation patterns:
 - Wrap main logic in try/catch
 - Log via console.log
 - Use JSON.stringify(context.payload, null,2) for debug

Configuration options:
 - action.yml inputs 'who-to-greet' default World
 - runs.using: node20
 - runs.main: 'index.js' or 'dist/index.js'

Best practices:
 - Always call core.setFailed on exceptions
 - Pin dependencies via package-lock.json
 - Bundle via @vercel/ncc to avoid checking node_modules
 - Tag releases semantically

Troubleshooting:
 Error: Missing input
   Command: core.getInput('who-to-greet', { required: true }) throws if absent
   Fix: Provide 'with: who-to-greet'
 Untracked dependencies
   Git checkout error: Missing node_modules
   Fix: Bundle via ncc or commit node_modules
 Bundling issues
   Command: ncc build index.js --license licenses.txt
   Expected: outputs dist/index.js and dist/licenses.txt
   On error: reinstall @vercel/ncc@latest


## Information Dense Extract
action.yml: inputs:who-to-greet(required,true,default='World'), outputs:time(description), runs:using='node20',main='index.js'; install: npm install @actions/core @actions/github; index.js: core.getInput('who-to-greet',{required:true}), console.log, ts=new Date().toTimeString(), core.setOutput('time',ts), payload=JSON.stringify(github.context.payload,null,2), console.log, catch->core.setFailed; bundle: ncc build index.js --license licenses.txt -> dist/index.js; git: add action.yml,index.js,node_modules,package.json,package-lock.json,README.md; commit -m 'vX.Y'; tag -a vX.Y; push --follow-tags; workflow: on:push jobs: greet: runs-on ubuntu-latest steps: uses:actions/checkout@v4, uses:your-org/hello-world-javascript-action@vX.Y with:who-to-greet, run:echo "Time: ${{steps.greet.outputs.time}}"

## Sanitised Extract
Table of Contents:
 1. action.yml metadata syntax
 2. Dependency installation
 3. index.js implementation
 4. Bundling with ncc
 5. Git steps for commit and release
 6. Workflow usage example

1. action.yml metadata syntax
 name: Hello World
 description: Greet someone and record the time
 inputs:
   who-to-greet:
     description: Who to greet
     required: true
     default: World
 outputs:
   time:
     description: The time we greeted you
 runs:
   using: node20
   main: index.js

2. Dependency installation
 Command: npm install @actions/core @actions/github
 Node.js: v20.x
 Optional bundler: npm install -g @vercel/ncc

3. index.js implementation
 const core = require('@actions/core')
 const github = require('@actions/github')
 try {
   const who = core.getInput('who-to-greet', { required: true })
   console.log('Hello ${who}!')
   const ts = new Date().toTimeString()
   core.setOutput('time', ts)
   const payload = JSON.stringify(github.context.payload, null, 2)
   console.log('Event payload:'n${payload}')
 } catch (e) {
   core.setFailed(e.message)
 }

4. Bundling with ncc
 Command: ncc build index.js --license licenses.txt
 Outputs: dist/index.js, dist/licenses.txt
 action.yml: runs.main: dist/index.js

5. Git steps for commit and release
 git add action.yml index.js node_modules package.json package-lock.json README.md
 git commit -m 'release vX.Y'
 git tag -a vX.Y -m 'vX.Y'
 git push --follow-tags

6. Workflow usage example
 on: [push]
 jobs:
   greet_job:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - uses: your-org/hello-world-javascript-action@vX.Y
         with:
           who-to-greet: Octocat
       - run: echo 'Time: ${{ steps.greet_job.outputs.time }}'

## Original Source
GitHub Actions Toolkit
https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

## Digest of JS_ACTION

# Creating a JavaScript Action (retrieved 2024-06-18)

## Metadata: action.yml
```yaml
name: "Hello World"
description: "Greet someone and record the time"
inputs:
  who-to-greet:
    description: "Who to greet"
    required: true
    default: "World"
outputs:
  time:
    description: "The time we greeted you"
runs:
  using: "node20"
  main: "index.js"
```

## Dependencies
- Node.js v20.x (npm included)
- @actions/core
- @actions/github
- Optional: @vercel/ncc for bundling

Install:
```bash
npm install @actions/core @actions/github
npm install -g @vercel/ncc  # optional
```

## Action Code: index.js
```javascript
const core = require('@actions/core');
const github = require('@actions/github');

try {
  const who = core.getInput('who-to-greet', { required: true });
  console.log(`Hello ${who}!`);
  const timestamp = new Date().toTimeString();
  core.setOutput('time', timestamp);
  const payload = JSON.stringify(github.context.payload, null, 2);
  console.log(`Event payload:\n${payload}`);
} catch (err) {
  core.setFailed(err.message);
}
```

## Bundling (optional)
```bash
ncc build index.js --license licenses.txt
# outputs dist/index.js and dist/licenses.txt
```
Update action.yml `runs.main` to `dist/index.js`.

## Commit & Release
```bash
git add action.yml index.js node_modules package.json package-lock.json README.md
git commit -m "release v1.0"
git tag -a v1.0 -m "v1.0"
git push --follow-tags
```

## Example Workflow (.github/workflows/main.yml)
```yaml
on: [push]
jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run JS action
        uses: your-org/hello-world-javascript-action@v1.0
        with:
          who-to-greet: 'Octocat'
      - run: echo "Greeted at ${{ steps.runjs.outputs.time }}"
```


## Attribution
- Source: GitHub Actions Toolkit
- URL: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
- License: MIT License
- Crawl Date: 2025-05-11T00:12:23.458Z
- Data Size: 1253636 bytes
- Links Found: 19775

## Retrieved
2025-05-11
sandbox/library/GRAPHQL_API.md
# sandbox/library/GRAPHQL_API.md
# GRAPHQL_API

## Crawl Summary
Authentication via Authorization header; POST endpoint at /graphql; JSON body with query and variables; cursor-based pagination using first/after and last/before with pageInfo fields; rate limit of 5000 points/hour accessible via rateLimit object; full schema introspection via __schema queries; errors in errors array despite HTTP 200.

## Normalised Extract
Table of Contents
1 Authentication
2 Endpoint and Headers
3 Request Payload
4 Pagination Parameters and Response
5 Rate Limit Object
6 Schema Introspection Query
7 Error Handling

1 Authentication
  Use HTTP header 'Authorization: Bearer <PERSONAL_ACCESS_TOKEN>'. Ensure token has required scopes (repo, user, etc.).

2 Endpoint and Headers
  URL: https://api.github.com/graphql
  Mandatory Headers:
    Content-Type: application/json
    Authorization: Bearer <TOKEN>

3 Request Payload
  JSON object with two keys:
    query: GraphQL query or mutation as a string
    variables: JSON object of input variables

4 Pagination Parameters and Response
  Forward pagination: use 'first' (Int) and 'after' (String cursor)
  Backward pagination: use 'last' (Int) and 'before' (String cursor)
  Each connection returns 'pageInfo' containing:
    hasNextPage (Boolean)
    endCursor (String)
    hasPreviousPage (Boolean)
    startCursor (String)

5 Rate Limit Object
  Include 'rateLimit' in query to retrieve:
    limit: Int total points
    cost: Int points consumed by request
    remaining: Int points left
    resetAt: String timestamp in ISO8601

6 Schema Introspection Query
  Standard GraphQL introspection:
    query { __schema { types { name kind fields { name } } queryType { name } mutationType { name } } }

7 Error Handling
  HTTP status is 200 even when errors occur. Check 'errors' array in JSON response. Each error includes:
    message: String
    locations: Array of { line: Int, column: Int }
    path: Array of field names indicating error location


## Supplementary Details
Required token scopes: repo (full control of private repos), user (full control of user data), read:org (read organization data), workflow (update GitHub Actions workflows).
Default Content-Type: application/json. No additional Accept header needed.
Response is always JSON with keys data and optionally errors.
Implement clients with exponential backoff on rate limit remaining==0.
Steps to call:
1. Obtain PAT with required scopes.
2. Build HTTP POST to /graphql with headers.
3. Create payload with query and variables.
4. Monitor rateLimit object and back off or queue if remaining < cost.
5. Handle pagination by inspecting pageInfo and repeating with endCursor.
6. Handle errors array and retry on transient network errors (502, 503, 504) up to 3 times with jitter.


## Reference Details
cURL Example:
  curl -X POST https://api.github.com/graphql \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"query":"query($n:Int!){ viewer{ login } }","variables":{"n":10}}'

Node.js (Octokit GraphQL):
  import { graphql } from '@octokit/graphql'
  const client = graphql.defaults({ headers: { authorization: `token ${TOKEN}` } })
  async function getViewerLogin() {
    const response = await client<{ viewer: { login: string } }>(
      `query { viewer { login } }`
    )
    return response.viewer.login
  }

Python (requests):
  import requests
  headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
  json = {"query": "query { viewer { login } }"}
  r = requests.post('https://api.github.com/graphql', headers=headers, json=json)
  data = r.json()

Best Practices:
  - Persist queries on server to reduce payload size.
  - Batch related queries in a single request.
  - Limit fields returned to only necessary ones.
  - Monitor rateLimit.remaining and resetAt before heavy queries.

Troubleshooting:
  Command: curl ...
  If HTTP 502 or 503, sleep 1s and retry up to 3 times.
  If errors include 'Something went wrong with one of the query fields', inspect field path and schema for deprecated fields.
  Use introspection to confirm current schema:
    curl -X POST https://api.github.com/graphql \
      -H "Authorization: Bearer TOKEN" \
      -d '{"query":"{ __schema { types { name } } }"}'


## Information Dense Extract
Auth: Authorization: Bearer TOKEN; Endpoint: POST https://api.github.com/graphql; Headers: Content-Type: application/json; Payload: { query:String, variables:JSON }; Pagination: first,after,last,before; pageInfo:{hasNextPage,endCursor,hasPreviousPage,startCursor}; RateLimit: 5000/hr via rateLimit{limit,cost,remaining,resetAt}; Introspection: __schema and __type queries; Errors: errors array in JSON even on 200; Scopes: repo,user,read:org,workflow; Retry: 502/503/504 with backoff; Best: Persist queries, batch requests, minimal fields.

## Sanitised Extract
Table of Contents
1 Authentication
2 Endpoint and Headers
3 Request Payload
4 Pagination Parameters and Response
5 Rate Limit Object
6 Schema Introspection Query
7 Error Handling

1 Authentication
  Use HTTP header 'Authorization: Bearer <PERSONAL_ACCESS_TOKEN>'. Ensure token has required scopes (repo, user, etc.).

2 Endpoint and Headers
  URL: https://api.github.com/graphql
  Mandatory Headers:
    Content-Type: application/json
    Authorization: Bearer <TOKEN>

3 Request Payload
  JSON object with two keys:
    query: GraphQL query or mutation as a string
    variables: JSON object of input variables

4 Pagination Parameters and Response
  Forward pagination: use 'first' (Int) and 'after' (String cursor)
  Backward pagination: use 'last' (Int) and 'before' (String cursor)
  Each connection returns 'pageInfo' containing:
    hasNextPage (Boolean)
    endCursor (String)
    hasPreviousPage (Boolean)
    startCursor (String)

5 Rate Limit Object
  Include 'rateLimit' in query to retrieve:
    limit: Int total points
    cost: Int points consumed by request
    remaining: Int points left
    resetAt: String timestamp in ISO8601

6 Schema Introspection Query
  Standard GraphQL introspection:
    query { __schema { types { name kind fields { name } } queryType { name } mutationType { name } } }

7 Error Handling
  HTTP status is 200 even when errors occur. Check 'errors' array in JSON response. Each error includes:
    message: String
    locations: Array of { line: Int, column: Int }
    path: Array of field names indicating error location

## Original Source
GitHub GraphQL API
https://docs.github.com/en/graphql

## Digest of GRAPHQL_API

# Authentication

Use HTTP header Authorization: Bearer <PERSONAL_ACCESS_TOKEN>
Required scope depends on data accessed (repo, user, gist, workflow).

# Endpoint

POST https://api.github.com/graphql
Headers:
  Content-Type: application/json
  Authorization: Bearer <TOKEN>

# Query Structure

Request body JSON:
  query: string containing GraphQL query or mutation
  variables: JSON object mapping variable names to values

# Pagination

Cursor-based pagination on connection fields.
Parameters:
  first: Int (forward pagination)
  after: String (cursor)
  last: Int (backward pagination)
  before: String (cursor)
Response fields:
  pageInfo {
    hasNextPage: Boolean
    endCursor: String
    hasPreviousPage: Boolean
    startCursor: String
  }

# Rate Limits

GraphQL rate limit: 5,000 points per hour per token.
Query cost calculated from field complexity. Query rateLimit object:
  rateLimit {
    limit: Int
    cost: Int
    remaining: Int
    resetAt: ISO8601 timestamp
  }

# Schema Introspection

Introspection query on __schema and __type.
Use standard GraphQL introspection:
  query IntrospectionQuery { __schema { types { name kind fields { name } } queryType { name } } }

# Errors

Errors returned in JSON body under key errors array even if HTTP status 200.
Each error object contains:
  message: String
  locations: [{ line: Int, column: Int }]
  path: [String]

_Retrieved on 2024-06-25_

_Data size: 2,595,078 bytes_

## Attribution
- Source: GitHub GraphQL API
- URL: https://docs.github.com/en/graphql
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-10T18:57:35.568Z
- Data Size: 2595078 bytes
- Links Found: 25412

## Retrieved
2025-05-10
