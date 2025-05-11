sandbox/library/GITHUB_ACTIONS.md
# sandbox/library/GITHUB_ACTIONS.md
# GITHUB_ACTIONS

## Crawl Summary
Location: .github/workflows/*.yml; Required keys: name, on, jobs. Triggers: push, pull_request, schedule, workflow_dispatch. Job fields: runs-on, needs, strategy, container, services, environment, timeout, outputs, concurrency. Step fields: name, uses, run, with, env, if, timeout, shell, working-directory, continue-on-error, id. Contexts: github, env, job, steps, matrix. Caching: actions/cache@v4 with path, key, restore-keys. Services: define under jobs.<id>.services with image, ports, env, options. Reusable workflows: on: workflow_call; inputs, secrets, uses. Security: secrets, OIDC, environments with approvals. Concurrency: group, cancel-in-progress. Troubleshooting: gh CLI commands, act validation.

## Normalised Extract
Table of Contents:
1. Workflow File Structure
2. Trigger Events Syntax
3. Job Configuration
4. Steps Configuration
5. Contexts and Expressions
6. Runners
7. Caching Dependencies
8. Service Containers
9. Reusable Workflows
10. Security and Environments
11. Concurrency
12. Troubleshooting Commands

1. Workflow File Structure
Location: .github/workflows/*.yml
Required keys: name (string), on (string|array|map), jobs (map)

2. Trigger Events Syntax
on: push | pull_request | schedule | workflow_dispatch | repository_dispatch
filters map: branches, tags, types, cron, inputs
Examples:
 push:
   branches: [main]
 schedule:
   - cron: '0 0 * * *'
 workflow_dispatch:
   inputs:
     env:
       description: 'Deployment environment'
       required: true
       default: 'prod'

3. Job Configuration
jobs.<id>:
 runs-on: string|array (ubuntu-latest, [self-hosted, linux])
 needs: string|array
essfully-parallel jobs
 strategy:
   matrix: variables map
   max-parallel: integer
 container: string|map
 services:
   key:
     image: string:tag
     ports: ["host:container"]
     env:
       VAR: value
     options: string
 environment: string|map
 timeout-minutes: integer
 outputs: map
 concurrency: group: expr, cancel-in-progress: bool

4. Steps Configuration
steps: [
 { name, uses, run, shell, with, env, if, timeout-minutes, working-directory, continue-on-error, id }
]
 - uses: owner/repo@version
 - run: command or block

5. Contexts and Expressions
Syntax: ${{ expr }}
Contexts: github.actor, github.event_name, github.sha, env.VAR, job.status, steps.id.outputs.name, matrix.var
Expressions: success(), failure(), contains(), startsWith(), github.repository

6. Runners
GitHub-hosted: ubuntu-latest, windows-latest, macos-latest
Self-hosted: labels [self-hosted, os, arch]
Registration: run config.sh with URL and token

7. Caching Dependencies
actions/cache@v4:
 path: string|array
 key: string expr
 restore-keys: string|array
Example: key: ubuntu-node-${{ hashFiles('**/package-lock.json') }}

8. Service Containers
jobs.job.services.key:
 image: postgres:version
 ports: ['5432:5432']
 env: POSTGRES_USER, POSTGRES_PASSWORD
 options: health-cmd, health-interval

9. Reusable Workflows
Define: on: workflow_call
 inputs:
   name: {type: string, required: bool, default}
 secrets: inherit|map
Call: uses: owner/repo/.github/workflows/file@ref
 with: input map
 secrets: {SECRET: ${{ secrets.NAME }}}

10. Security and Environments
Secrets: ${{ secrets.NAME }}
OIDC: configure in settings, use permissions in jobs
Environments:
 name: string
 url: expr
 deployment_branch_policy: protected_branches: bool
 required reviewers via settings

11. Concurrency
concurrency:
 group: expr
 cancel-in-progress: bool

12. Troubleshooting Commands
gh run list --workflow name
gh run view id --log
gh run rerun id
act --validate

## Supplementary Details
Parameter Values and Effects:
- runs-on: ubuntu-latest (default), windows-latest, macos-latest, self-hosted labels
- strategy.matrix: array of values; each combination creates a job run
- concurrency.group: string; jobs with same group share concurrency lock
- concurrency.cancel-in-progress: true stops older runs
- timeout-minutes: integer (default 360)
- environment.deployment_branch_policy.protected_branches: true prevents unapproved branch deployments

Implementation Steps:
1. Create .github/workflows/<name>.yml
2. Define name, on, jobs
3. For CI: jobs.ci:
   runs-on: ubuntu-latest
   steps:
     - uses: actions/checkout@v4
     - uses: actions/setup-node@v4
       with: node-version: '16'
     - run: npm ci
     - run: npm test
4. For CD: jobs.deploy:
   needs: ci
   runs-on: ubuntu-latest
   environment:
     name: production
   steps:
     - uses: actions/checkout@v4
     - run: npm run build
     - uses: azure/webapps-deploy@v2
       with:
         app-name: 'my-app'
         slot-name: 'production'

Configuration Options:
- actions/checkout@v4: fetch-depth default 1; full-history: fetch-depth: 0
- actions/setup-node@v4: node-version string; cache boolean or 'npm'|'yarn'; check-latest boolean
- actions/cache@v4: path, key, restore-keys



## Reference Details
API Specifications:
GitHub CLI commands:
- gh run list --workflow <string> [--repo <owner/repo>] [--limit <int>]
- gh run view <int> [--repo <owner/repo>] [--log] [--exit-status]
- gh run rerun <int> [--repo <owner/repo>] [--fail-fast]
- gh workflow run <string> [--repo <owner/repo>] [--ref <string>] [--json] [--jq <string>]
Return: status code 0 on success; JSON objects when --json is used; error message on failure

SDK Method Signatures:
GitHub REST API (octokit/rest):
- octokit.actions.listWorkflowRunsForRepo({
    owner: string,
    repo: string,
    workflow_id: number|string,
    branch?: string,
    event?: string,
    status?: string,
    per_page?: number,
    page?: number
  }): Promise<{data: WorkflowRun[], status: number}>
- octokit.actions.getWorkflowRun({ owner: string, repo: string, run_id: number }): Promise<{data: WorkflowRun, status: number}>
- octokit.actions.reRunWorkflow({ owner: string, repo: string, run_id: number }): Promise<{status: number}>
- octokit.actions.createWorkflowDispatch({ owner: string, repo: string, workflow_id: number|string, ref: string, inputs?: object }): Promise<{status: number}>

Code Examples:
1. Node.js script to rerun latest failed CI run:
```js
const {Octokit} = require('@octokit/rest';
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
async function rerunFailed() {
  const { data: runs } = await octokit.actions.listWorkflowRunsForRepo({
    owner: 'org', repo: 'repo', workflow_id: 'ci.yml', status: 'failure', per_page: 1
  });
  if (runs.length) {
    const runId = runs[0].id;
    await octokit.actions.reRunWorkflow({ owner: 'org', repo: 'repo', run_id: runId });
    console.log(`Rerunning workflow run ${runId}`);
  }
}
rerunFailed();
```

2. Advanced pattern: Dynamic matrix generation:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - node: 14
            os: ubuntu-latest
          - node: 16
            os: windows-latest
          - node: 18
            os: macos-latest
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4 with: {node-version: ${{ matrix.node }}}
      - run: npm ci
      - run: npm test
```

Best Practices:
- Pin action versions: use @v4 instead of @latest
- Use checkout fetch-depth: 0 for full git history when needed
- Cache dependencies keyed on lockfile hash
- Limit job concurrency for CD pipelines
- Protect branches and require approvals via environments

Troubleshooting Procedures:
1. Validate workflow syntax locally:
   - Command: act --validate
   - Expected: No validation errors
2. Test run using act:
   - Command: act push --secret GITHUB_TOKEN=token
   - Expected: Steps execute locally, logs appear
3. Inspect logs on GitHub:
   - Command: gh run view <run-id> --log
   - Check for step failures, error codes
4. Re-run failing runs:
   - Command: gh run rerun <run-id> --fail-fast
5. Clear cache if dependency errors:
   - Update cache key in actions/cache
   - Commit to trigger new cache


## Information Dense Extract
name: string; on: [push, pull_request, schedule(cron), workflow_dispatch(inputs)]; jobs:<id>:{runs-on:string|array,needs:string[],strategy:{matrix:map,max-parallel:int},container:string|map,services:{key:{image:string,ports:string[],env:map,options:string}},environment:{name:string,url:expr,deployment_branch_policy:{protected_branches:bool}},timeout-minutes:int,outputs:map,concurrency:{group:expr,cancel-in-progress:bool}}; steps:[{id?,name,uses:owner/repo@version,run:string|array,shell:string,with:map,env:map,if:expr,timeout-minutes:int,working-directory:string,continue-on-error:bool}]; contexts:github.{actor,event_name,ref,sha},env.*,job.status,steps.id.outputs, matrix.*; cache:actions/cache@v4 with path,key,restore-keys; reusable:on:workflow_call inputs:{name:{type:string,required:bool,default}},secrets; call uses:owner/repo/.github/workflows/file@ref; secrets:param; security: secrets.NAME, OIDC provider config; concurrency group expr, cancel-in-progress; troubleshooting: gh run list|view|rerun, act --validate.

## Sanitised Extract
Table of Contents:
1. Workflow File Structure
2. Trigger Events Syntax
3. Job Configuration
4. Steps Configuration
5. Contexts and Expressions
6. Runners
7. Caching Dependencies
8. Service Containers
9. Reusable Workflows
10. Security and Environments
11. Concurrency
12. Troubleshooting Commands

1. Workflow File Structure
Location: .github/workflows/*.yml
Required keys: name (string), on (string|array|map), jobs (map)

2. Trigger Events Syntax
on: push | pull_request | schedule | workflow_dispatch | repository_dispatch
filters map: branches, tags, types, cron, inputs
Examples:
 push:
   branches: [main]
 schedule:
   - cron: '0 0 * * *'
 workflow_dispatch:
   inputs:
     env:
       description: 'Deployment environment'
       required: true
       default: 'prod'

3. Job Configuration
jobs.<id>:
 runs-on: string|array (ubuntu-latest, [self-hosted, linux])
 needs: string|array
essfully-parallel jobs
 strategy:
   matrix: variables map
   max-parallel: integer
 container: string|map
 services:
   key:
     image: string:tag
     ports: ['host:container']
     env:
       VAR: value
     options: string
 environment: string|map
 timeout-minutes: integer
 outputs: map
 concurrency: group: expr, cancel-in-progress: bool

4. Steps Configuration
steps: [
 { name, uses, run, shell, with, env, if, timeout-minutes, working-directory, continue-on-error, id }
]
 - uses: owner/repo@version
 - run: command or block

5. Contexts and Expressions
Syntax: ${{ expr }}
Contexts: github.actor, github.event_name, github.sha, env.VAR, job.status, steps.id.outputs.name, matrix.var
Expressions: success(), failure(), contains(), startsWith(), github.repository

6. Runners
GitHub-hosted: ubuntu-latest, windows-latest, macos-latest
Self-hosted: labels [self-hosted, os, arch]
Registration: run config.sh with URL and token

7. Caching Dependencies
actions/cache@v4:
 path: string|array
 key: string expr
 restore-keys: string|array
Example: key: ubuntu-node-${{ hashFiles('**/package-lock.json') }}

8. Service Containers
jobs.job.services.key:
 image: postgres:version
 ports: ['5432:5432']
 env: POSTGRES_USER, POSTGRES_PASSWORD
 options: health-cmd, health-interval

9. Reusable Workflows
Define: on: workflow_call
 inputs:
   name: {type: string, required: bool, default}
 secrets: inherit|map
Call: uses: owner/repo/.github/workflows/file@ref
 with: input map
 secrets: {SECRET: ${{ secrets.NAME }}}

10. Security and Environments
Secrets: ${{ secrets.NAME }}
OIDC: configure in settings, use permissions in jobs
Environments:
 name: string
 url: expr
 deployment_branch_policy: protected_branches: bool
 required reviewers via settings

11. Concurrency
concurrency:
 group: expr
 cancel-in-progress: bool

12. Troubleshooting Commands
gh run list --workflow name
gh run view id --log
gh run rerun id
act --validate

## Original Source
GitHub Actions Official Documentation
https://docs.github.com/en/actions

## Digest of GITHUB_ACTIONS

# GitHub Actions Technical Details

## Workflow File Structure

- Location: `.github/workflows/*.yml`
- Format: YAML 1.2
- Required top-level keys:
  - `name` (string): Workflow display name
  - `on` (string|array|map): Trigger events
  - `jobs` (map): Job definitions

### Trigger Events Syntax

- on: push | pull_request | schedule | workflow_dispatch | repository_dispatch
- Map syntax for filters:
  push:
    branches: [main, develop]
    tags: [v*]
  pull_request:
    types: [opened, synchronize]
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'

## Job Configuration

- Key: `jobs.<job_id>`
- Fields:
  - `runs-on` (string|array): runner labels, e.g., `ubuntu-latest`, `[self-hosted, linux, x64]`
  - `needs` (string|array): dependencies
  - `strategy` (map): matrix and max-parallel
    - strategy:
        matrix:
          node: [14,16]
        max-parallel: 2
  - `container` (string|map): container image or detailed config
  - `services` (map): service containers
    - services.postgres:
        image: postgres:13
        ports: ['5432:5432']
        env:
          POSTGRES_USER: user
          POSTGRES_PASSWORD: pass
        options: --health-cmd pg_isready --health-interval 10s
  - `environment` (string|map): environment name and url
  - `timeout-minutes` (integer): job timeout
  - `outputs` (map): job-to-job outputs
  - `concurrency` (map|string): group and cancel-in-progress
    - concurrency:
        group: ${{ github.ref }}
        cancel-in-progress: true

## Steps Configuration

- `steps` (array)
- Each step fields:
  - `name` (string)
  - `uses` (string): action reference `owner/repo@version`
  - `run` (string | array): shell command(s)
  - `shell` (string): bash, sh, cmd, pwsh, python
  - `with` (map): input for actions
  - `env` (map): environment variables
  - `continue-on-error` (boolean)
  - `timeout-minutes` (integer)
  - `if` (expression)
  - `working-directory` (string)
  - `id` (string): step id

## Contexts and Expressions

- Syntax: `${{ expression }}`
- Contexts:
  - `github`: event data, actor, repository, event_name, sha, ref
  - `env`: environment variables
  - `job`: status
  - `steps`: access outputs
  - `matrix`: matrix variables

### Common Expressions

- Conditional: `if: ${{ success() }}`
- Output reference: `steps.<id>.outputs.<name>`
- Matrix: `${{ matrix.node }}`

## Runners

### GitHub-hosted Images

- ubuntu-latest (Ubuntu 22.04)
- ubuntu-20.04
- windows-latest (Windows Server 2022)
- macos-latest (macOS 14)

### Self-hosted

- Labels: `[self-hosted, os, arch, custom]`
- Register: `actions-runner/config.sh --url <repo> --token <token>`
- Service: systemd, launchd, Windows service

## Caching Dependencies

- Action: `actions/cache@v4`
- Inputs:
  - `path` (string|array)
  - `key` (string)
  - `restore-keys` (string|array)

Example:
  - uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

## Service Containers

- Define in `jobs.<id>.services`
- Connect via hostnames matching service key
- Ports mapping optional

## Reusable Workflows

- Define workflow in `.github/workflows` with `on: workflow_call`
- Inputs and secrets:
  workflow_call:
    inputs:
      version:
        type: string
        required: true
    secrets: inherit
- Call via:
  uses: owner/repo/.github/workflows/<file>.yml@version
  with:
    version: '1.0'

## Security Features

- Secrets: define in repo/org settings
- Access via `${{ secrets.NAME }}`
- OIDC: configure in environment settings
- Require approvals via environments

## Concurrency and Environments

- concurrency:
    group: ${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true
- environment:
    name: production
    url: ${{ steps.deploy.outputs.url }}
    deployment_branch_policy:
      protected_branches: true

## Troubleshooting Commands

- View recent runs:
  gh run list --workflow <name>
- View logs:
  gh run view <run-id> --log
- Re-run failed:
  gh run rerun <run-id>
- Validate YAML:
  act --validate


<!-- Date Retrieved: 2024-06-20 -->

## Attribution
- Source: GitHub Actions Official Documentation
- URL: https://docs.github.com/en/actions
- License: License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-11T05:57:36.687Z
- Data Size: 936286 bytes
- Links Found: 16479

## Retrieved
2025-05-11
sandbox/library/GITHUB_GRAPHQL.md
# sandbox/library/GITHUB_GRAPHQL.md
# GITHUB_GRAPHQL

## Crawl Summary
Endpoint: POST https://api.github.com/graphql with headers Authorization: bearer <TOKEN>, Content-Type and Accept application/json. Use JSON body {query,variables}. Authenticate via personal access token with required scopes. Introspect schema via __schema query or download schema file. Rate limit tracked via rateLimit object with fields limit, cost, remaining, resetAt; default 5000 points/hour. Use cursor pagination with first/after or last/before and pageInfo. Global Node IDs are Base64 encoded "Type:ID" and used in queries and mutations.

## Normalised Extract
Table of Contents

1. Authentication
2. Endpoint & Headers
3. Request Body Format
4. Schema Introspection
5. Rate Limiting
6. Cursor Pagination
7. Global Node IDs

1. Authentication
• Use HTTP header Authorization: bearer <PERSONAL_ACCESS_TOKEN>
• Common scopes: repo, read:org, workflow

2. Endpoint & Headers
• URL: https://api.github.com/graphql
• Headers:
    Authorization: bearer <TOKEN>
    Content-Type: application/json
    Accept: application/json

3. Request Body Format
• JSON object with two keys:
    query: string containing GraphQL operation
    variables: object mapping variable names to values
• Example:
    {
      "query": "query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id,name } }",
      "variables": {"owner":"octocat","name":"Hello-World"}
    }

4. Schema Introspection
• Send POST with introspection query:
    { __schema { types { name fields { name type { name kind ofType { name kind } } } } } }
• Or download schema.docs.graphql from public schema link.

5. Rate Limiting
• Query rateLimit field:
    {
      rateLimit { limit cost remaining resetAt }
    }
• Interpret:
    limit = 5000, cost = computed per query, remaining = points left, resetAt = next reset timestamp

6. Cursor Pagination
• On any connection field use arguments:
    first: Int, after: String, last: Int, before: String
• Response returns pageInfo with hasNextPage, endCursor, hasPreviousPage, startCursor.
• To traverse forward use first + after; backward use last + before.

7. Global Node IDs
• All Node types expose id: ID! Global ID = Base64("<TypeName>:<internal ID>")
• Use to fetch objects by id in queries and mutations:
    query { node(id: "MDQ6VXNlcjU4MzIzMQ==") { __typename id } }


## Supplementary Details
Implementation Steps

1. Obtain PAT (personal access token) with necessary scopes.
2. Construct HTTP POST to https://api.github.com/graphql.
3. Set headers Authorization: bearer <TOKEN>, Content-Type: application/json.
4. Build JSON payload with query and variables.
5. Execute request; parse JSON response.
6. For paging large lists, perform initial query with first:N. While pageInfo.hasNextPage is true, repeat with after: pageInfo.endCursor.
7. Monitor rate usage by querying rateLimit and throttle if remaining < threshold.
8. For schema updates, re-run introspection or re-download schema.docs.graphql monthly.

Exact Parameter Values

• Content-Type: application/json
• Accept: application/json
• Default page size: no hard limit but recommended <=100
• Rate limit reset interval: 3600s

Configuration Options

• Custom GraphQL client: configure retry on 502, 503 up to 3 attempts with exponential backoff.
• Timeout: 10s per request.

Error Handling

• HTTP 4xx: check response.errors array. Example: "Bad credentials" => reauthenticate.
• HTTP 5xx: retry.
• Rate limit exceeded: GraphQL returns errors with type RATE_LIMITED. On detection, sleep until resetAt or fallback to REST rate limit API.

## Reference Details
HTTP Endpoint
  POST https://api.github.com/graphql

Required Headers
  Authorization: bearer <TOKEN>
  Content-Type: application/json
  Accept: application/json

Request Payload
  query: String!
  variables: JSON object

Response Structure
  data: JSON object matching query selection
  errors: [ { message: String, locations: [ { line: Int, column: Int } ], path: [ String ], type: String } ]

RateLimit API
  Query: rateLimit(limit: Int?, cost: Int?): RateLimit
  RateLimit fields:
    limit: Int!
    cost: Int!
    remaining: Int!
    resetAt: DateTime!

Pagination Arguments on Connection Types
  first: Int
  after: String
  last: Int
  before: String

pageInfo Type
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String

Node Interface
  id: ID!

Global ID Format
  Base64("<TypeName>:<internal ID>")

Sample cURL
  curl -X POST -H "Authorization: bearer $TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"query":"query{ viewer{ login }}"}' \
       https://api.github.com/graphql

JavaScript Fetch Example
  import fetch from 'node-fetch';
  const token = process.env.GITHUB_TOKEN;
  const query = `query($login:String!){ user(login:$login){ id name }}`;
  const variables = { login: 'octocat' };
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const { data, errors } = await response.json();

Best Practices
  • Batch pagination: use `first:100` and loop on `endCursor`.
  • Persisted queries: use sha256 hash of query and send {id, variables} to reduce payload.
  • Caching: cache schema introspection and query results keyed by variables.

Troubleshooting
  • Authentication failure: HTTP 401, error.DOMAIN = "AUTHENTICATION_FAILURE". Run:
      curl -H "Authorization: bearer $TOKEN" https://api.github.com/user
  • Rate limit exceeded: GraphQL error.type = RATE_LIMITED, check resetAt, then sleep:
      sleep $(($(date -d "$(jq -r .data.rateLimit.resetAt response.json)" +%s) - $(date +%s)))
  • Schema mismatch errors: re-download schema file or re-introspect.

## Information Dense Extract
POST https://api.github.com/graphql  Headers: Authorization: bearer <TOKEN>; Content-Type: application/json; Accept: application/json; Body: {query:string,variables:object}. Authenticate via PAT with scopes repo,read:org,workflow. RateLimit object fields: limit(5000),cost,remaining,resetAt. Pagination: first:Int,after:String,last:Int,before:String with pageInfo.hasNextPage,endCursor. Global IDs: Base64("Type:ID"). Introspect with __schema query or download schema.docs.graphql. Retry on HTTP 502/503 up to 3x, timeout 10s, throttle when remaining<100. Error handling: 401=>renew token; RATE_LIMITED=>sleep until resetAt. Best practice: persisted queries via sha256, batch pagination with first 100.

## Sanitised Extract
Table of Contents

1. Authentication
2. Endpoint & Headers
3. Request Body Format
4. Schema Introspection
5. Rate Limiting
6. Cursor Pagination
7. Global Node IDs

1. Authentication
 Use HTTP header Authorization: bearer <PERSONAL_ACCESS_TOKEN>
 Common scopes: repo, read:org, workflow

2. Endpoint & Headers
 URL: https://api.github.com/graphql
 Headers:
    Authorization: bearer <TOKEN>
    Content-Type: application/json
    Accept: application/json

3. Request Body Format
 JSON object with two keys:
    query: string containing GraphQL operation
    variables: object mapping variable names to values
 Example:
    {
      'query': 'query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id,name } }',
      'variables': {'owner':'octocat','name':'Hello-World'}
    }

4. Schema Introspection
 Send POST with introspection query:
    { __schema { types { name fields { name type { name kind ofType { name kind } } } } } }
 Or download schema.docs.graphql from public schema link.

5. Rate Limiting
 Query rateLimit field:
    {
      rateLimit { limit cost remaining resetAt }
    }
 Interpret:
    limit = 5000, cost = computed per query, remaining = points left, resetAt = next reset timestamp

6. Cursor Pagination
 On any connection field use arguments:
    first: Int, after: String, last: Int, before: String
 Response returns pageInfo with hasNextPage, endCursor, hasPreviousPage, startCursor.
 To traverse forward use first + after; backward use last + before.

7. Global Node IDs
 All Node types expose id: ID! Global ID = Base64('<TypeName>:<internal ID>')
 Use to fetch objects by id in queries and mutations:
    query { node(id: 'MDQ6VXNlcjU4MzIzMQ==') { __typename id } }

## Original Source
GitHub GraphQL API Reference
https://docs.github.com/en/graphql

## Digest of GITHUB_GRAPHQL

# Authentication

Use a GitHub personal access token in the HTTP Authorization header.

• Header: Authorization: bearer <TOKEN>
• Required scopes per operation:
  • Queries on public data: no scopes
  • Repository read/write: repo
  • Organization read: read:org
  • Workflow dispatch: workflow

# Endpoint and Headers

Endpoint URL: https://api.github.com/graphql

Required HTTP headers:
  • Authorization: bearer <TOKEN>
  • Content-Type: application/json
  • Accept: application/json

# Query and Mutation Format

Request body JSON:
{
  "query": "<GraphQL query or mutation string>",
  "variables": {  /* key-value pairs for $variables */ }
}

On success: HTTP 200, body contains { data: { ... }, errors?: [ ... ] }.

# Schema Introspection

Perform a standard GraphQL introspection query:
{
  __schema {
    types { name fields { name type { name kind ofType { name kind } } } }
    queryType { name }
    mutationType { name }
  }
}

Or download the published schema file at https://docs.github.com/public/schema.docs.graphql

# Rate Limits

Query the built-in rateLimit object:
{
  rateLimit {
    limit    # total points per hour
    cost     # points consumed by this operation
    remaining
    resetAt  # ISO8601 timestamp
  }
}

Default limit: 5 000 points per hour. Cost is computed by field complexity.

# Pagination

Cursor-based pagination arguments on connection fields:
  • first: Int (forward paging)
  • after: String (cursor)
  • last: Int (backward paging)
  • before: String (cursor)

Response includes pageInfo:
  {
    hasNextPage: Boolean,
    hasPreviousPage: Boolean,
    startCursor: String,
    endCursor: String
  }

# Global Node IDs

Every object implements Node with id: ID!  Global ID is Base64 of "<TypeName>:<database ID>".
Use __typename and id fields to discover type and global ID for use in other operations.


## Attribution
- Source: GitHub GraphQL API Reference
- URL: https://docs.github.com/en/graphql
- License: License: GitHub Terms of Service
- Crawl Date: 2025-05-11T08:58:16.390Z
- Data Size: 2595078 bytes
- Links Found: 25412

## Retrieved
2025-05-11
sandbox/library/ACT_LOCAL.md
# sandbox/library/ACT_LOCAL.md
# ACT_LOCAL

## Crawl Summary
act reads .github/workflows, builds/pulls container images via Docker API, executes steps in container environments matching GitHub Actions. Requires Go ≥1.20, Docker. Install by cloning repo and running make test and make install. VS Code extension available.

## Normalised Extract
Table of Contents:
1. Prerequisites
2. Repository Clone
3. Build Targets
4. Installation Path
5. Execution Flow

1. Prerequisites
   - Go version: 1.20+
   - Docker daemon: running and accessible via Docker API socket

2. Repository Clone
   - Command: git clone git@github.com:nektos/act.git
   - Default branch: master

3. Build Targets
   - make test: invokes go test ./...  with codecov flags
   - make install: go build -o act main.go; installs to $GOPATH/bin

4. Installation Path
   - Binary installed at: $GOPATH/bin/act (or $HOME/go/bin/act)
   - Version file: ./VERSION contains semantic version tag

5. Execution Flow
   - act [options] [event] invokes workflow runner
   - Reads all YAML under .github/workflows
   - Pulls images: docker pull <image> or docker build <Dockerfile>
   - Sets environment: GITHUB_* variables per action context
   - Runs steps in containers in dependency order


## Supplementary Details
Prerequisites:
  Go 1.20+  (check via go version)
  Docker Engine 20.10+ (check via docker version)

Clone parameters:
  URL: git@github.com:nektos/act.git
  Depth: full history required for tags

Makefile targets:
  test:
    runs: go test -v ./... -coverprofile=coverage.out
    environment: requires GOPATH and module support
  install:
    runs: go install ./cmd/act
    output: binary 'act'

Configuration directory:
  .actrc: place CLI default flags (not shown in readme)

VS Code extension:
  Name: GitHub Local Actions
  Commands: Run Workflow, Debug Step


## Reference Details
Step-by-step Installation:

1. Verify prerequisites:
   - go version output contains 'go1.20'
   - docker version output contains 'Engine:'

2. Clone the repository:

    git clone git@github.com:nektos/act.git
    cd act

3. Run unit tests:

    make test

   Expected output snippet:
    PASS
    coverage: 85.2% of statements
    ok   github.com/nektos/act/pkg/action  0.345s

4. Build and install CLI:

    make install

   Expected binary at $GOPATH/bin/act
   Verify via:
    act --version
    version: v0.2.77

Usage Example:

    cd path/to/repo-with-workflows
    act push -P ubuntu-latest=nektos/act-environments-ubuntu:18.04

Flags:
  -l, --list
        list all available events
  -P, --platform string
        override default image for an OS (format label=image)
  --secret stringArray
        set secret key=value
  --reuse
        reuse previously created containers

Best Practices:
  - Keep workflow files under 100 lines for performance
  - Pin Docker images via digest to ensure repeatability

Troubleshooting:
  - If Docker API error, run:
      sudo systemctl start docker
  - To clear stale containers:
      docker rm -f $(docker ps -aq)


## Information Dense Extract
Prerequisites: Go>=1.20, Docker Engine>=20.10. Clone: git clone git@github.com:nektos/act.git; cd act. Test: make test (go test -coverprofile). Install: make install (binary at $GOPATH/bin/act). Workflow files: .github/workflows/*.yml. Execution: act [event] pulls uses:image or builds Dockerfile; injects GITHUB_* env; executes steps in dependency order. Flags: -l list events; -P platform=label=image override; --secret key=value; --reuse containers. Example: act push -P ubuntu-latest=nektos/act-environments-ubuntu:18.04. Troubleshoot: ensure Docker daemon active; clear stale containers with docker rm -f $(docker ps -aq). Version test: act --version => v0.2.77.

## Sanitised Extract
Table of Contents:
1. Prerequisites
2. Repository Clone
3. Build Targets
4. Installation Path
5. Execution Flow

1. Prerequisites
   - Go version: 1.20+
   - Docker daemon: running and accessible via Docker API socket

2. Repository Clone
   - Command: git clone git@github.com:nektos/act.git
   - Default branch: master

3. Build Targets
   - make test: invokes go test ./...  with codecov flags
   - make install: go build -o act main.go; installs to $GOPATH/bin

4. Installation Path
   - Binary installed at: $GOPATH/bin/act (or $HOME/go/bin/act)
   - Version file: ./VERSION contains semantic version tag

5. Execution Flow
   - act [options] [event] invokes workflow runner
   - Reads all YAML under .github/workflows
   - Pulls images: docker pull <image> or docker build <Dockerfile>
   - Sets environment: GITHUB_* variables per action context
   - Runs steps in containers in dependency order

## Original Source
act: Run GitHub Actions Locally
https://github.com/nektos/act#readme

## Digest of ACT_LOCAL

# Overview

Think globally, act locally

Run your GitHub Actions locally using the act CLI. Fast Feedback: test changes to .github/workflows/ without commit/push. Local Task Runner: use GitHub Actions as a Makefile replacement.

# How It Works

1. Reads workflow YAML files from .github/workflows/
2. Parses actions, steps, dependencies, and container images
3. Uses Docker API to pull or build images defined under uses: or image:
4. Resolves execution path per workflow dependencies
5. Launches containers for each action with environment variables and filesystem matching GitHub

# Manual Build and Install (Retrieved on 2024-06-15)

Prerequisites:
- Go tools version 1.20 or later
- Docker daemon running

Commands:

    git clone git@github.com:nektos/act.git
    cd act
    make test        # runs unit tests via go test and codecov integration
    make install     # compiles main.go, installs binary 'act' into $GOPATH/bin


## Attribution
- Source: act: Run GitHub Actions Locally
- URL: https://github.com/nektos/act#readme
- License: License: MIT License
- Crawl Date: 2025-05-11T03:20:14.733Z
- Data Size: 567858 bytes
- Links Found: 5125

## Retrieved
2025-05-11
sandbox/library/SQS_EVENT_MAPPING.md
# sandbox/library/SQS_EVENT_MAPPING.md
# SQS_EVENT_MAPPING

## Crawl Summary
Default BatchSize=10; MaximumBatchingWindowInSeconds=0s (0–300s) with 5min max buffering; SQS visibility timeout hides messages until deleted or timeout; Lambda deletes processed messages; on error entire batch reappears; configure ReportBatchItemFailures or DeleteMessage to isolate failures; FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId; low-traffic batch windows wait up to 20s.

## Normalised Extract
Table of Contents
1 PollingAndBatchingBehavior
2 SampleEventStructures
3 EventSourceMappingConfiguration
4 ErrorHandlingStrategies
5 FIFOQueueAttributes

1 PollingAndBatchingBehavior
Default BatchSize=10. MaximumBatchingWindowInSeconds: 0–300s. Batch triggers when BatchSize reached or window expired or payload≥6MB. Low-traffic queues: min wait=20s. VisibilityTimeout hides messages until deletion or timeout.

2 SampleEventStructures
Standard Queue: Records[].messageId, receiptHandle, body, attributes{ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp}, messageAttributes{stringValue,dataType}, md5OfBody, eventSource, eventSourceARN, awsRegion.

3 EventSourceMappingConfiguration
Parameters:
- EventSourceArn: string (required)
- FunctionName: string (required)
- Enabled: boolean (default true)
- BatchSize: integer (1–10)
- MaximumBatchingWindowInSeconds: integer (0–300)
- FunctionResponseTypes: ["ReportBatchItemFailures"] to support partial failures

4 ErrorHandlingStrategies
ReportBatchItemFailures: return {batchItemFailures:[receiptHandle1,...]}. DeleteMessage API: call DeleteMessage({QueueUrl, ReceiptHandle}) per message.

5 FIFOQueueAttributes
attributes include SequenceNumber:string, MessageGroupId:string, MessageDeduplicationId:string; md5OfBody; eventSourceARN suffix ".fifo".


## Supplementary Details
CreateEventSourceMapping via AWS SDK for JavaScript v3:
Client: const client=new LambdaClient({region});
Command: new CreateEventSourceMappingCommand({
  EventSourceArn: 'arn:aws:sqs:region:account-id:queue',
  FunctionName: 'myFunction',
  Enabled: true,
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 60,
  FunctionResponseTypes: ['ReportBatchItemFailures']
});
Invocation: client.send(cmd);

Console: AWS Lambda > Functions > myFunction > Configuration > Triggers > SQS > Add trigger. Configure batch size and batching window. Save.

Queue visibility timeout recommendation: at least function timeout + buffer. E.g., Function Timeout=30s, VisibilityTimeout=60s.

Permissions: Lambda execution role needs sqs:ReceiveMessage, sqs:DeleteMessage, sqs:GetQueueAttributes on the queue resource.


## Reference Details
AWS SDK for JavaScript v3

import { LambdaClient, CreateEventSourceMappingCommand, UpdateEventSourceMappingCommand, DeleteEventSourceMappingCommand, GetEventSourceMappingCommand } from '@aws-sdk/client-lambda';

// Create mapping
const createParams = {
  EventSourceArn: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
  FunctionName: 'myLambdaFunction',
  Enabled: true,
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 60,
  FunctionResponseTypes: ['ReportBatchItemFailures']
};
const createCmd = new CreateEventSourceMappingCommand(createParams);
const createResp = await client.send(createCmd);
// Response: {UUID:string, State:string, LastModified:Date, BatchSize:number, MaximumBatchingWindowInSeconds:number, FunctionArn:string, EventSourceArn:string, FilterCriteria?:object}

// Update mapping
const updateCmd = new UpdateEventSourceMappingCommand({UUID:createResp.UUID, BatchSize:5, Enabled:false});
const updateResp = await client.send(updateCmd);

// Delete mapping
const deleteCmd = new DeleteEventSourceMappingCommand({UUID:createResp.UUID});
await client.send(deleteCmd);

// Troubleshooting:
// AWS CLI commands:
// aws lambda create-event-source-mapping --function-name myLambdaFunction --event-source-arn arn:aws:sqs:... --batch-size 10 --maximum-batching-window-in-seconds 60 --function-response-types ReportBatchItemFailures
// aws lambda get-event-source-mapping --uuid <UUID>
// aws lambda delete-event-source-mapping --uuid <UUID>
// Expected get-event-source-mapping output includes State: Enabled, BatchSize, MaximumBatchingWindowInSeconds.
// CloudWatch Logs: /aws/lambda/myLambdaFunction for error stack traces. Ensure visibility timeout > function timeout + retry buffer.


## Information Dense Extract
BatchSize=10(default,1–10); MaximumBatchingWindowInSeconds=0–300(default0,low-traffic wait20s,max5m); triggers when size, window or payload≥6MB. VisibilityTimeout hides msgs; errors reappear unless ReportBatchItemFailures or DeleteMessage used. FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId. SDKv3: new CreateEventSourceMappingCommand({EventSourceArn,FunctionName,Enabled,BatchSize,MaximumBatchingWindowInSeconds,FunctionResponseTypes:['ReportBatchItemFailures']}); client.send(cmd). Permissions: sqs:ReceiveMessage,DeleteMessage,GetQueueAttributes. CLI and code patterns for create, update, delete, get mapping. Troubleshoot via aws lambda get-event-source-mapping and CloudWatch Logs.

## Sanitised Extract
Table of Contents
1 PollingAndBatchingBehavior
2 SampleEventStructures
3 EventSourceMappingConfiguration
4 ErrorHandlingStrategies
5 FIFOQueueAttributes

1 PollingAndBatchingBehavior
Default BatchSize=10. MaximumBatchingWindowInSeconds: 0300s. Batch triggers when BatchSize reached or window expired or payload6MB. Low-traffic queues: min wait=20s. VisibilityTimeout hides messages until deletion or timeout.

2 SampleEventStructures
Standard Queue: Records[].messageId, receiptHandle, body, attributes{ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp}, messageAttributes{stringValue,dataType}, md5OfBody, eventSource, eventSourceARN, awsRegion.

3 EventSourceMappingConfiguration
Parameters:
- EventSourceArn: string (required)
- FunctionName: string (required)
- Enabled: boolean (default true)
- BatchSize: integer (110)
- MaximumBatchingWindowInSeconds: integer (0300)
- FunctionResponseTypes: ['ReportBatchItemFailures'] to support partial failures

4 ErrorHandlingStrategies
ReportBatchItemFailures: return {batchItemFailures:[receiptHandle1,...]}. DeleteMessage API: call DeleteMessage({QueueUrl, ReceiptHandle}) per message.

5 FIFOQueueAttributes
attributes include SequenceNumber:string, MessageGroupId:string, MessageDeduplicationId:string; md5OfBody; eventSourceARN suffix '.fifo'.

## Original Source
AWS Lambda & SQS Integration with AWS SDK for JavaScript v3
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of SQS_EVENT_MAPPING

# Polling and Batching Behavior

Data Size: 1272100 bytes
Retrieved: 2024-06-21
Source: AWS Lambda Developer Guide (Using Lambda with Amazon SQS)

With Amazon SQS event source mappings, Lambda polls up to 10 messages per batch by default. You can buffer records for up to 5 minutes by setting MaximumBatchingWindowInSeconds to any value from 0 to 300 seconds. When using a batch window on low-traffic queues, Lambda may wait up to 20 seconds even if you set a lower window.

Lambda hides messages in the queue for the duration of the queue’s visibility timeout. If the function processes the batch successfully, Lambda deletes the messages. On function error, messages become visible again after the visibility timeout. For idempotency, code must handle duplicate deliveries or use BatchItemFailures or DeleteMessage API.

# Sample Standard Queue Event Structure
```json
{
  "Records": [
    {
      "messageId": "059f36b4-87a3-44ab-83d2-661975830a7d",
      "receiptHandle": "AQEBwJnKyrHigUMZj6...",
      "body": "Test message.",
      "attributes": {"ApproximateReceiveCount":"1","SentTimestamp":"1545082649183","SenderId":"AIDAIENQZJOLO23YVJ4VO","ApproximateFirstReceiveTimestamp":"1545082649185"},
      "messageAttributes": {"myAttribute":{"stringValue":"myValue","dataType":"String"}},
      "md5OfBody":"e4e68fb7bd0e697a0ae8f1bb342846b3",
      "eventSource":"aws:sqs",
      "eventSourceARN":"arn:aws:sqs:us-east-2:123456789012:my-queue",
      "awsRegion":"us-east-2"
    }
  ]
}
```

# Sample FIFO Queue Event Additions

For FIFO queues, Records[].attributes include SequenceNumber, MessageGroupId, MessageDeduplicationId.

# Event Source Mapping Parameters
- BatchSize (integer, default 10, max 10 for SQS)
- MaximumBatchingWindowInSeconds (integer, 0–300, default 0)
- Enabled (boolean, default true)
- FunctionResponseTypes (list, e.g., ["ReportBatchItemFailures"])

# Error Handling

To avoid redriving entire batches on single failures, configure ReportBatchItemFailures. Return a response object with batchItemFailures: ["receiptHandle1"]. Or call DeleteMessage for each message on success.

# Idempotency Recommendation

Process each message at least once; ensure business logic handles duplicates. Use DeduplicationId for FIFO or idempotency keys in your payload.


## Attribution
- Source: AWS Lambda & SQS Integration with AWS SDK for JavaScript v3
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: Apache License 2.0
- Crawl Date: 2025-05-11T07:57:33.241Z
- Data Size: 1272100 bytes
- Links Found: 3151

## Retrieved
2025-05-11
sandbox/library/OPENAI_NODE.md
# sandbox/library/OPENAI_NODE.md
# OPENAI_NODE

## Crawl Summary
Installation commands, client constructor options (apiKey, maxRetries, timeout, httpAgent, fetch, dangerouslyAllowBrowser), method signatures for responses.create, chat.completions.create, files.create, fineTuning.jobs.create/list, streaming SSE, error types with HTTP status mapping, retry/timeout defaults and overrides, auto-pagination pattern, AzureOpenAI init, HTTP agent customization, supported runtimes.

## Normalised Extract
Table of Contents
1. Installation
2. Client Initialization
3. API Method Signatures
  3.1 responses.create
  3.2 chat.completions.create
  3.3 files.create
  3.4 fineTuning.jobs.create
  3.5 fineTuning.jobs.list
4. Streaming Responses
5. Error Handling
6. Retry & Timeout Configuration
7. Auto-pagination
8. Azure Integration
9. HTTP Agent & Fetch Overrides
10. Requirements & Runtimes

1. Installation
npm install openai
deno add jsr:@openai/openai
npx jsr add @openai/openai

2. Client Initialization
OpenAI({ apiKey:string, maxRetries?:number, timeout?:number, httpAgent?:Agent, fetch?:(url,init)=>Promise<Response>, dangerouslyAllowBrowser?:boolean })

3. API Method Signatures
3.1 responses.create
params: { model:string, input?:string, instructions?:string, stream?:boolean, user?:string, suffix?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ output_text:string, _request_id:string }> or AsyncIterable<SSE.Event>

3.2 chat.completions.create
params: { model:string, messages:Array<{ role:'system'|'developer'|'user'|'assistant'; content:string }>, temperature?:number, top_p?:number, n?:number, stream?:boolean, stop?:string|string[], max_tokens?:number, presence_penalty?:number, frequency_penalty?:number, logit_bias?:Record<string,number>, user?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ choices:Array<{ message:{ role:string; content:string }; finish_reason:string }>, _request_id:string }> or AsyncIterable<SSE.Event>

3.3 files.create
params: { file:File|Response|fs.ReadStream|{ path:string; data:Buffer }, purpose:'fine-tune' }
options: { maxRetries?:number, timeout?:number }
returns: Promise<{ id:string, object:string, bytes:number, created_at:number, filename:string, purpose:string, _request_id:string }>

3.4 fineTuning.jobs.create
params: { model:string, training_file:string, validation_file?:string, n_epochs?:number, batch_size?:number, learning_rate_multiplier?:number, use_packing?:boolean, prompt_loss_weight?:number, compute_classification_metrics?:boolean, classification_n_classes?:number, classification_positive_class?:string, classification_betas?:[number,number] }
returns: Promise<{ id:string, status:string, model:string, created_at:number, fine_tuned_model:string, hyperparams:any, _request_id:string }>

3.5 fineTuning.jobs.list
params: { limit?:number, page?:number }
returns: Promise<{ data:any[]; hasNextPage():boolean; getNextPage():Promise<this>; _request_id:string }>

4. Streaming Responses
const stream=await client.responses.create({ model, input, stream:true }); for await(event of stream){ /* event:{ id?:string, data:string, event?:string, retry?:number } */ }

5. Error Handling
Err subclass APIError for non-2xx. Map: 400 BadRequestError, 401 AuthenticationError, 403 PermissionDeniedError, 404 NotFoundError, 422 UnprocessableEntityError, 429 RateLimitError, >=500 InternalServerError, N/A APIConnectionError. err properties: request_id:string, status:number, name:string, headers:Record<string,string>

6. Retry & Timeout Configuration
Default retries:2 on connection errors,408,409,429,>=500. Default timeout:600000ms. Options at client or per-request via maxRetries, timeout. Timeout throws APIConnectionTimeoutError; follows retry policy.

7. Auto-pagination
for await(item of client.fineTuning.jobs.list({ limit:20 })){ /* accumulate items */ }

8. Azure Integration
AzureOpenAI({ azureADTokenProvider:TokenProvider, apiVersion:string }) ; use chat.completions.create same signature

9. HTTP Agent & Fetch Overrides
client=new OpenAI({ httpAgent: Agent, fetch:async(url,init)=>Response }); per-request httpAgent override

10. Requirements & Runtimes
Node.js>=18, TS>=4.5, Deno>=1.28, Bun>=1.0; Cloudflare Workers, Vercel Edge, Nitro>=2.6, Jest>=28; browser only if dangerouslyAllowBrowser:true

## Supplementary Details
Default Options
 maxRetries:2
 timeout:600000ms (10 minutes)
Retry Behavior
 retriableErrors: ['ECONNRESET','ENOTFOUND','ETIMEDOUT','EPIPE','ECONNREFUSED','ESOCKETTIMEDOUT','EHOSTUNREACH','EAI_AGAIN']
 HTTP codes:408,409,429,>=500
Exponential Backoff: base=100ms, cap=1000ms, factor=2, jitter:50%
Streaming SSE
 Event format: { id?:string; event?:string; data:string; retry?:number }
 Handlers: third-party libraries or built-in AsyncIterable
File Upload Helpers
 toFile(data:Buffer|Uint8Array, filename:string): Promise<{ path:string; data:Buffer }>
Agent Configuration
 httpAgent: instance of http.Agent or https.Agent
 fetch: following signature matches Web Fetch
Azure Token Provider
 azureADTokenProvider: (scopes:string[])->Promise<string>
dangerouslyAllowBrowser
 boolean, default:false, must be explicitly true to enable browser support

## Reference Details
// Full Method Signatures with Types

// OpenAI Client Constructor
declare class OpenAI {
  constructor(options?: {
    apiKey?: string;
    baseURL?: string;
    maxRetries?: number;
    timeout?: number;
    httpAgent?: http.Agent | https.Agent;
    fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
    dangerouslyAllowBrowser?: boolean;
  });

  responses: {
    create(
      params: {
        model: string;
        input?: string;
        instructions?: string;
        stream?: boolean;
        user?: string;
        suffix?: string;
      },
      options?: { maxRetries?: number; timeout?: number; httpAgent?: http.Agent | https.Agent }
    ): Promise<{ output_text: string; _request_id: string }>
      | Promise<AsyncIterable<{ id?: string; event?: string; data: string; retry?: number }>>;
  }

  chat: {
    completions: {
      create(
        params: {
          model: string;
          messages: Array<{ role: 'system' | 'developer' | 'user' | 'assistant'; content: string }>;
          temperature?: number;
          top_p?: number;
          n?: number;
          stream?: boolean;
          stop?: string | string[];
          max_tokens?: number;
          presence_penalty?: number;
          frequency_penalty?: number;
          logit_bias?: Record<string, number>;
          user?: string;
        },
        options?: { maxRetries?: number; timeout?: number; httpAgent?: http.Agent | https.Agent }
      ): Promise<{
        choices: Array<{ message: { role: string; content: string }; finish_reason: string }>;
        _request_id: string;
      }> | Promise<AsyncIterable<{ id?: string; event?: string; data: string; retry?: number }>>;
    };
  };

  files: {
    create(
      params: { file: File | Response | fs.ReadStream | { path: string; data: Buffer }; purpose: 'fine-tune' },
      options?: { maxRetries?: number; timeout?: number }
    ): Promise<{
      id: string;
      object: string;
      bytes: number;
      created_at: number;
      filename: string;
      purpose: string;
      _request_id: string;
    }>;
  };

  fineTuning: {
    jobs: {
      create(
        params: {
          model: string;
          training_file: string;
          validation_file?: string;
          n_epochs?: number;
          batch_size?: number;
          learning_rate_multiplier?: number;
          use_packing?: boolean;
          prompt_loss_weight?: number;
          compute_classification_metrics?: boolean;
          classification_n_classes?: number;
          classification_positive_class?: string;
          classification_betas?: [number, number];
        },
        options?: { maxRetries?: number; timeout?: number }
      ): Promise<{
        id: string;
        status: string;
        model: string;
        created_at: number;
        fine_tuned_model: string;
        hyperparams: Record<string, unknown>;
        _request_id: string;
      }>;

      list(
        params: { limit?: number; page?: number },
        options?: { maxRetries?: number; timeout?: number }
      ): Promise<{
        data: Array<Record<string, unknown>>;
        hasNextPage(): boolean;
        getNextPage(): Promise<any>;
        _request_id: string;
      }>;
    };
  };

  // Generic HTTP methods
  get(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string>; body?: Record<string, unknown> }): Promise<any>;
  post(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string>; body?: Record<string, unknown> }): Promise<any>;
  patch(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string>; body?: Record<string, unknown> }): Promise<any>;
  delete(path: string, options?: { query?: Record<string, unknown>; headers?: Record<string, string> }): Promise<any>;
}

// Best Practices Examples

// Configure client with proxy:
import { HttpsProxyAgent } from 'https-proxy-agent';
const client = new OpenAI({ httpAgent: new HttpsProxyAgent(process.env.PROXY_URL), maxRetries: 3, timeout: 30000 });

// Streaming chat:
(async () => {
  const stream = await client.chat.completions.create({ model: 'gpt-4o', messages: [{ role: 'user', content: 'Hello' }], stream: true });
  for await (const chunk of stream) process.stdout.write(chunk.data);
})();

// Troubleshooting

// Check request ID and headers:
(async () => {
  const { data, response } = await client.responses.create({ model: 'gpt-4o', input: 'test' }).withResponse();
  console.log(response.status, response.headers.get('x-request-id'));
})();

// On TIMEOUT:
// Throws APIConnectionTimeoutError, retried twice.

// On RATE LIMIT:
// Throws RateLimitError; default retry twice with exponential backoff.


## Information Dense Extract
openai-node: install npm install openai | deno add jsr:@openai/openai. init OpenAI({apiKey:string(default env),maxRetries:2,timeout:600000,httpAgent,fetch,dangerouslyAllowBrowser}). responses.create(params:{model,input?,instructions?,stream?,user?,suffix?},options)->Promise<{output_text,_request_id}>|AsyncIterable<SSE.Event>. chat.completions.create(params:{model,messages:[{role,content}],temperature?,top_p?,n?,stream?,stop?,max_tokens?,presence_penalty?,frequency_penalty?,logit_bias?,user?},options)->Promise<{choices:[{message:{role,content},finish_reason}],_request_id}>|AsyncIterable<SSE.Event>. files.create({file:File|Response|fs.ReadStream|{path,data},purpose:'fine-tune'},options)->Promise<{id,object,bytes,created_at,filename,purpose,_request_id}>. fineTuning.jobs.create({model,training_file,validation_file?,n_epochs?,batch_size?,learning_rate_multiplier?,use_packing?,prompt_loss_weight?,compute_classification_metrics?,classification_n_classes?,classification_positive_class?,classification_betas?},options)->Promise<{id,status,model,created_at,fine_tuned_model,hyperparams,_request_id}>. list({limit?,page?},options)->Promise<{data[],hasNextPage(),getNextPage(),_request_id}>. errors: HTTP map 400->BadRequestError,401->AuthenticationError,403->PermissionDeniedError,404->NotFoundError,422->UnprocessableEntityError,429->RateLimitError,>=500->InternalServerError,N/A->APIConnectionError. default retry 2 on network,408,409,429,>=500; timeout=600000ms throws APIConnectionTimeoutError, retried. SSE event:{id?,event?,data,retry?}. auto-pagination: for await item of client.fineTuning.jobs.list({limit}). azure: AzureOpenAI({azureADTokenProvider,apiVersion}). override httpAgent per-request. requirements: Node>=18,TS>=4.5,Deno>=1.28,Bun>=1.0,Cloudflare,Edge,Nitro>=2.6,Jest>=28, browser if dangerouslyAllowBrowser=true.

## Sanitised Extract
Table of Contents
1. Installation
2. Client Initialization
3. API Method Signatures
  3.1 responses.create
  3.2 chat.completions.create
  3.3 files.create
  3.4 fineTuning.jobs.create
  3.5 fineTuning.jobs.list
4. Streaming Responses
5. Error Handling
6. Retry & Timeout Configuration
7. Auto-pagination
8. Azure Integration
9. HTTP Agent & Fetch Overrides
10. Requirements & Runtimes

1. Installation
npm install openai
deno add jsr:@openai/openai
npx jsr add @openai/openai

2. Client Initialization
OpenAI({ apiKey:string, maxRetries?:number, timeout?:number, httpAgent?:Agent, fetch?:(url,init)=>Promise<Response>, dangerouslyAllowBrowser?:boolean })

3. API Method Signatures
3.1 responses.create
params: { model:string, input?:string, instructions?:string, stream?:boolean, user?:string, suffix?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ output_text:string, _request_id:string }> or AsyncIterable<SSE.Event>

3.2 chat.completions.create
params: { model:string, messages:Array<{ role:'system'|'developer'|'user'|'assistant'; content:string }>, temperature?:number, top_p?:number, n?:number, stream?:boolean, stop?:string|string[], max_tokens?:number, presence_penalty?:number, frequency_penalty?:number, logit_bias?:Record<string,number>, user?:string }
options: { maxRetries?:number, timeout?:number, httpAgent?:Agent }
returns: Promise<{ choices:Array<{ message:{ role:string; content:string }; finish_reason:string }>, _request_id:string }> or AsyncIterable<SSE.Event>

3.3 files.create
params: { file:File|Response|fs.ReadStream|{ path:string; data:Buffer }, purpose:'fine-tune' }
options: { maxRetries?:number, timeout?:number }
returns: Promise<{ id:string, object:string, bytes:number, created_at:number, filename:string, purpose:string, _request_id:string }>

3.4 fineTuning.jobs.create
params: { model:string, training_file:string, validation_file?:string, n_epochs?:number, batch_size?:number, learning_rate_multiplier?:number, use_packing?:boolean, prompt_loss_weight?:number, compute_classification_metrics?:boolean, classification_n_classes?:number, classification_positive_class?:string, classification_betas?:[number,number] }
returns: Promise<{ id:string, status:string, model:string, created_at:number, fine_tuned_model:string, hyperparams:any, _request_id:string }>

3.5 fineTuning.jobs.list
params: { limit?:number, page?:number }
returns: Promise<{ data:any[]; hasNextPage():boolean; getNextPage():Promise<this>; _request_id:string }>

4. Streaming Responses
const stream=await client.responses.create({ model, input, stream:true }); for await(event of stream){ /* event:{ id?:string, data:string, event?:string, retry?:number } */ }

5. Error Handling
Err subclass APIError for non-2xx. Map: 400 BadRequestError, 401 AuthenticationError, 403 PermissionDeniedError, 404 NotFoundError, 422 UnprocessableEntityError, 429 RateLimitError, >=500 InternalServerError, N/A APIConnectionError. err properties: request_id:string, status:number, name:string, headers:Record<string,string>

6. Retry & Timeout Configuration
Default retries:2 on connection errors,408,409,429,>=500. Default timeout:600000ms. Options at client or per-request via maxRetries, timeout. Timeout throws APIConnectionTimeoutError; follows retry policy.

7. Auto-pagination
for await(item of client.fineTuning.jobs.list({ limit:20 })){ /* accumulate items */ }

8. Azure Integration
AzureOpenAI({ azureADTokenProvider:TokenProvider, apiVersion:string }) ; use chat.completions.create same signature

9. HTTP Agent & Fetch Overrides
client=new OpenAI({ httpAgent: Agent, fetch:async(url,init)=>Response }); per-request httpAgent override

10. Requirements & Runtimes
Node.js>=18, TS>=4.5, Deno>=1.28, Bun>=1.0; Cloudflare Workers, Vercel Edge, Nitro>=2.6, Jest>=28; browser only if dangerouslyAllowBrowser:true

## Original Source
OpenAI Node.js Client
https://github.com/openai/openai-node

## Digest of OPENAI_NODE

# OpenAI Node.js Client Library Detailed Technical Specifications (Retrieved on 2024-06-11)

## Installation

### npm
```bash
npm install openai
```

### JSR (Deno)
```bash
deno add jsr:@openai/openai
npx jsr add @openai/openai
```

## Client Initialization

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: string,               // default: process.env.OPENAI_API_KEY
  maxRetries?: number,          // default: 2
  timeout?: number,             // default: 600000 (10 minutes)
  httpAgent?: Agent,            // node http(s) agent
  fetch?: (url: RequestInfo, init?: RequestInit) => Promise<Response>,
  dangerouslyAllowBrowser?: boolean,
});
```

## API Methods

### Responses API

```ts
responses.create(
  params: {
    model: string;
    input?: string;
    instructions?: string;
    stream?: boolean;
    user?: string;
    suffix?: string;
  },
  options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ output_text: string; _request_id: string } | AsyncIterable<SSE.Event>>
```

### Chat Completions API

```ts
chat.completions.create(
  params: {
    model: string;
    messages: Array<{ role: 'system'|'developer'|'user'|'assistant'; content: string }>;
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: Record<string, number>;
    user?: string;
  },
  options?: { maxRetries?: number; timeout?: number; httpAgent?: Agent }
): Promise<{ choices: Array<{ message: { role: string; content: string }; finish_reason: string }> ; _request_id: string } | AsyncIterable<SSE.Event>>
```

### Files API

```ts
files.create(
  params: { file: File|Response|fs.ReadStream|{ path: string; data: Buffer }; purpose: 'fine-tune' },
  options?: { maxRetries?: number; timeout?: number }
): Promise<{ id: string; object: string; bytes: number; created_at: number; filename: string; purpose: string; _request_id: string }>
```

### Fine-tuning Jobs API

```ts
fineTuning.jobs.create(
  params: { model: string; training_file: string; validation_file?: string; n_epochs?: number; batch_size?: number; learning_rate_multiplier?: number; use_packing?: boolean; prompt_loss_weight?: number; compute_classification_metrics?: boolean; classification_n_classes?: number; classification_positive_class?: string; classification_betas?: [number,number] },
  options?: { maxRetries?: number; timeout?: number }
): Promise<{ id: string; status: string; model: string; created_at: number; fine_tuned_model: string; hyperparams: any; _request_id: string }>

fineTuning.jobs.list(
  params: { limit?: number; page?: number },
  options?: { maxRetries?: number; timeout?: number }
): Promise<{ data: any[]; hasNextPage(): boolean; getNextPage(): Promise<this>; _request_id: string }>
```

## Streaming Responses (SSE)

```ts
const stream = await client.responses.create({ model, input, stream: true });
for await (const event of stream) {
  // event: { id?: string; data: string; event?: string; retry?: number }
}
```

## Error Handling

All non-2xx HTTP responses throw subclass of APIError:

| Status Code | Error Type               |
|------------:|--------------------------|
| 400         | BadRequestError          |
| 401         | AuthenticationError      |
| 403         | PermissionDeniedError    |
| 404         | NotFoundError            |
| 422         | UnprocessableEntityError |
| 429         | RateLimitError           |
| >=500       | InternalServerError      |
| N/A         | APIConnectionError       |

```ts
try {
  const result = await client.fineTuning.jobs.create({ model: 'gpt-4o', training_file: 'file-abc123' });
} catch (err) {
  if (err instanceof OpenAI.APIError) {
    const { request_id, status, name, headers } = err;
  } else throw err;
}
```

## Retry and Timeout Configuration

- Default retries: 2 (on network errors, 408, 409, 429, >=500)
- Override default or per-request via `maxRetries`.
- Default timeout: 600000 ms; override via `timeout`.
- Timeout throws `APIConnectionTimeoutError` and is retried according to retry policy.

## Auto-pagination

```ts
async function fetchAllJobs() {
  const jobs: any[] = [];
  for await (const job of client.fineTuning.jobs.list({ limit: 20 })) {
    jobs.push(job);
  }
  return jobs;
}
```

## Azure Integration

```ts
import { AzureOpenAI } from 'openai';
import { getBearerTokenProvider, DefaultAzureCredential } from '@azure/identity';

const openai = new AzureOpenAI({ azureADTokenProvider: getBearerTokenProvider(new DefaultAzureCredential(), 'https://cognitiveservices.azure.com/.default'), apiVersion: string });
```

## HTTP Agent & Fetch Overrides

```ts
import http from 'http';
import { HttpsProxyAgent } from 'https-proxy-agent';

const client = new OpenAI({
  httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
});

await client.models.list({ limit: 10 }, { httpAgent: new http.Agent({ keepAlive: false }) });
```

## Requirements

- Node.js 18 LTS+
- TypeScript >=4.5
- Deno >=1.28.0
- Bun >=1.0

## Runtimes
- Cloudflare Workers, Vercel Edge, Nitro v2.6+, Jest 28+, Web (dangerouslyAllowBrowser)


## Attribution
- Source: OpenAI Node.js Client
- URL: https://github.com/openai/openai-node
- License: License: MIT License
- Crawl Date: 2025-05-11T09:57:44.272Z
- Data Size: 733137 bytes
- Links Found: 5377

## Retrieved
2025-05-11
sandbox/library/ACT_CLI.md
# sandbox/library/ACT_CLI.md
# ACT_CLI

## Crawl Summary
Installation via Go 1.20+, clone repo, make install. CLI subcommands: list events, specify job, event file, working directory, secrets, bind mounts, reuse containers, verbose. Use act [event] to simulate GitHub Actions events. Use -P to map runner labels to Docker images. Create ~/.actrc to persist defaults.

## Normalised Extract
Table of Contents

1. Installation
2. CLI Options
3. Event Simulation
4. Docker Image Mapping
5. Workflow & Job Execution
6. Configuration File

1. Installation
- Prerequisite: Go >=1.20
- Commands:
  git clone git@github.com:nektos/act.git
  cd act
  make test
  make install (installs `act` binary into GOPATH/bin)

2. CLI Options
- -l, --list: list events
- -P label=image: map runner label to image
- -j job: run specific job
- -e eventpath: path to event JSON
- -C dir: working directory
- -s NAME=VALUE: secret variable
- -S NAME=PATH: secret from file
- -b host:container: mount directory
- -B hostfile:containerfile: mount file
- -r, --reuse: reuse existing containers
- --cache path: container cache dir

3. Event Simulation
- List events: act --list
- Simulate push: act push
- Custom event: act -e ./pr.json pull_request

4. Docker Image Mapping
- Default: ubuntu-latest=nektos/act-environments-ubuntu:18.04
- Override: act -P ubuntu-latest=myrepo/ubuntu:20.04
- Pull images: act pull_request

5. Workflow & Job Execution
- Run all jobs: act
- Single job: act -j test
- Change directory: act -C ./repo
- Verbose logs: act -v

6. Configuration File
- File: ~/.actrc
- Fields:
  platform: label=image
  directory: path
  event: default event
  secrets: key: value
  bind: [host:container]
  reuse: true|false
  cache: path


## Supplementary Details
Exact default mapping: ubuntu-latest=nektos/act-environments-ubuntu:18.04
Default event fixtures stored in bin/event.json for each GitHub Actions event type.
Installation $GOPATH/bin is added to PATH.
act searches .github/workflows/*.yml for workflows.
Containers run with WORKDIR=/github/workspace and GITHUB_WORKSPACE environment variable.
Secret value injection via environment variables inside container.
Bind mounts default to workspace root unless overridden.
Cache directory is mounted as a Docker volume with name act-cache by default.
Reuse flag retains stopped containers by job name; next run skips creation and uses existing containers.


## Reference Details
CLI Specification

Signature:
act [FLAGS] [EVENT_NAME]

Flags:
--list,-l                           bool     List supported events
--platform,-P label=image           string   Map GitHub runner labels to Docker images
--job,-j job_name                   string   Run single job by name
--eventpath,-e path                 string   Specify GitHub event JSON
--directory,-C dir                  string   Change working directory
--secret,-s NAME=VALUE              []string Pass secret as environment variable
--secret-file,-S NAME=FILEPATH      []string Load secret from file content
--bind,-b src:dst                   []string Bind mount host directory
--bind-file,-B srcfile:dstfile      []string Bind mount host file
--reuse,-r                          bool     Reuse existing containers
--cache path                        string   Mount host directory as cache
--verbose,-v                        bool     Enable verbose output
--quiet,-q                          bool     Suppress non-error output
--help,-h                           bool     Show usage

Return Codes:
0 Success
1 Configuration error or invalid flags
2 Workflow parsing error
3 Docker API error

Examples:

1. Run default workflow with push event:
   act

2. Run PR event with custom data:
   act -e events/pull_request.json pull_request

3. Execute only build job:
   act -j build

4. Use custom image for ubuntu-latest label:
   act -P ubuntu-latest=myrepo:20.04

5. Persist cache to /tmp/act-cache and reuse containers:
   act --cache /tmp/act-cache --reuse

Troubleshooting:

Command: act -v
Expected Output Snippet:
  INFO[0000] Checking for workflow files in .github/workflows
  DEBU[0000] Loading event payload from ./.github/events/push.json
  DEBU[0001] Pulling image nektos/act-environments-ubuntu:18.04

If Docker socket connection fails:
  Verify Docker daemon is running: systemctl status docker
  Ensure current user is in docker group: sudo usermod -aG docker $USER

If missing permissions mounting workspace:
  Use sudo or adjust mount propagation flags:
    act --privileged


## Information Dense Extract
Install: Go>=1.20, git clone, make test, make install.
CLI Flags: -l list, -P label=image, -j job, -e event.json, -C dir, -s NAME=VAL, -S NAME=PATH, -b host:cont, -B file, -r reuse, --cache path, -v verbose.
Default image mapping: ubuntu-latest=nektos/act-environments-ubuntu:18.04.
List events: act --list; push: act push; custom: act -e pr.json pull_request.
Run all jobs: act; single job: act -j build; change dir: act -C ./repo.
~/.actrc: platform, directory, event, secrets, bind, reuse, cache.
Reuse retains containers; cache mounts volume; workspace at /github/workspace.
Troubleshoot: act -v logs; Docker socket: systemctl status docker; add user to docker group.

## Sanitised Extract
Table of Contents

1. Installation
2. CLI Options
3. Event Simulation
4. Docker Image Mapping
5. Workflow & Job Execution
6. Configuration File

1. Installation
- Prerequisite: Go >=1.20
- Commands:
  git clone git@github.com:nektos/act.git
  cd act
  make test
  make install (installs 'act' binary into GOPATH/bin)

2. CLI Options
- -l, --list: list events
- -P label=image: map runner label to image
- -j job: run specific job
- -e eventpath: path to event JSON
- -C dir: working directory
- -s NAME=VALUE: secret variable
- -S NAME=PATH: secret from file
- -b host:container: mount directory
- -B hostfile:containerfile: mount file
- -r, --reuse: reuse existing containers
- --cache path: container cache dir

3. Event Simulation
- List events: act --list
- Simulate push: act push
- Custom event: act -e ./pr.json pull_request

4. Docker Image Mapping
- Default: ubuntu-latest=nektos/act-environments-ubuntu:18.04
- Override: act -P ubuntu-latest=myrepo/ubuntu:20.04
- Pull images: act pull_request

5. Workflow & Job Execution
- Run all jobs: act
- Single job: act -j test
- Change directory: act -C ./repo
- Verbose logs: act -v

6. Configuration File
- File: ~/.actrc
- Fields:
  platform: label=image
  directory: path
  event: default event
  secrets: key: value
  bind: [host:container]
  reuse: true|false
  cache: path

## Original Source
act: Run GitHub Actions Locally
https://github.com/nektos/act#readme

## Digest of ACT_CLI

# Installation

Install Go tools 1.20+ from https://golang.org/doc/install

Clone act repository:

    git clone git@github.com:nektos/act.git

Run tests:

    cd act
    make test

Build and install CLI:

    make install

# CLI OPTIONS

Usage: `act [options] [event]`

Options:

  -l, --list                List available GitHub Actions events
  -P, --platform string      Map runner labels to Docker images (default "ubuntu-latest=nektos/act-environments-ubuntu:18.04")
  -j, --job string           Specify a job name to run
  -e, --eventpath string     Path to JSON file that contains the event payload
  -C, --directory string     Working directory (defaults to current directory)
  -s, --secret stringArray   Secret in the form NAME=VALUE (can be specified multiple times)
  -S, --secret-file stringArray   Secret file in form NAME=PATH (can be specified multiple times)
  -v, --verbose              Enable verbose logging
  -q, --quiet                Suppress output
  -b, --bind stringArray     Mount host directory (host_path:container_path)
  -B, --bind-file stringArray   Bind mount a file (host_file:container_file)
  -r, --reuse                Reuse containers
  --cache string             Path to cache directory inside container
  -h, --help                 Display help and exit

# EVENT SIMULATION

Use built-in event fixtures or custom event data. To list events:

    act --list

Simulate `push` event using default fixture:

    act push

Simulate event from file:

    act -e path/to/event.json pull_request

# DOCKER IMAGE MANAGEMENT

Map runner labels to custom images:

    act -P ubuntu-latest=myrepo/ubuntu:20.04

Pull missing images before execution:

    act pull_request --platform ubuntu-latest=myrepo/ubuntu:20.04

# WORKFLOW EXECUTION

Run full workflow defined in .github/workflows:

    act

Run single job:

    act -j build

Override working directory:

    act -C ./projectdir

Enable caching directory `/tmp/cache`:

    act -v --cache /tmp/cache

# ADVANCED CONFIGURATION

Create `~/.actrc` with default options:

    platform: ubuntu-latest=nektos/act-environments-ubuntu:18.04
    directory: project
    secrets:
      FOO: bar
    bind:
      - ".:/github/workspace"
    event: "push"
    reuse: true
    cache: "/tmp/act-cache"


## Attribution
- Source: act: Run GitHub Actions Locally
- URL: https://github.com/nektos/act#readme
- License: License: MIT License
- Crawl Date: 2025-05-11T03:36:07.745Z
- Data Size: 630214 bytes
- Links Found: 5601

## Retrieved
2025-05-11
sandbox/library/VITEST_CONFIG.md
# sandbox/library/VITEST_CONFIG.md
# VITEST_CONFIG

## Crawl Summary
Installation: npm/yarn/pnpm install -D vitest; requires Vite>=5, Node>=18. Writing tests: .test/.spec file naming. CLI: vitest[ run] [--config,--root,--dir,--watch,--run,--update,-u,--environment, --globals, --coverage,--port,--https,--reporter,--outputFile]. Config: unified with Vite; defineConfig({ test: { include,exclude,includeSource,name,root,dir,globals,environment,alias,deps.external,deps.inline,deps.moduleDirectories,runner,watch,update,reporters,outputFile,coverage } }). Supported config file extensions: js,mjs,cjs,ts,cts,mts. Workspaces: workspace: [glob|string|object]. Watch default: interactive. Snapshot update: -u. Node env by default. Alias merging with resolve.alias. Globals off by default. Automatic dependency installation prompts; disable via VITEST_SKIP_INSTALL_CHECKS=1.

## Normalised Extract
Table of Contents:
1. Installation
2. Writing Tests
3. CLI Usage
4. Config File Setup
5. Config Options
6. Workspaces
7. Debugging

1. Installation
- Requirements: Vite>=5.0.0, Node>=18.0.0
- Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest

2. Writing Tests
- File suffix must include .test. or .spec.
- Example:
  export function sum(a: number,b: number): number{return a+b}
  import {expect,test} from 'vitest'
  test('adds',()=>{expect(sum(1,2)).toBe(3)})
- package.json scripts:
  "test":"vitest"

3. CLI Usage
vitest [--config <file>] [--root <path>] [--dir <path>] [--watch] [--run] [-u] [--environment <env>] [--globals] [--coverage] [--reporter <name>] [--outputFile.<type>=<path>] [--port <n>] [--https]

4. Config File Setup
- Supported files: vite.config.{js,mjs,cjs,ts,cts,mts} or vitest.config.{js,mjs,cjs,ts,cts,mts}
- Vite unified config:
  import {defineConfig} from 'vite';
  /// <reference types="vitest/config" />
  export default defineConfig({test:{...}})
- Separate config:
  import {defineConfig} from 'vitest/config';
  export default defineConfig({test:{...}})

5. Config Options
- include: string[] default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[] default ['**/node_modules/**','**/dist/**',...]
- includeSource: string[] default []
- globals: boolean default false
- environment: 'node'|'jsdom'|'happy-dom'|'edge-runtime' default 'node'
- alias: Record<string,string>
- deps.external: Array<string|RegExp> default [/\/node_modules\//]
- deps.inline: Array<string|RegExp>|true default []
- deps.moduleDirectories: string[] default ['node_modules']
- runner: string default 'node'
- watch: boolean default interactive
- update: boolean default false
- reporters: Array<string|object> default ['default']
- outputFile: string|Record<string,string>
- coverage.enabled: boolean default false
- coverage.include/exclude: string[] defaults []

6. Workspaces
- test.workspace: Array<string|object>
- Glob entries or objects: {test:{name,root,environment,setupFiles}}
- Allows multiple configurations in one process

7. Debugging
- server.debug.dumpModules: boolean|string
- server.debug.loadDumppedModules: boolean
- Example:
  test:{server:{debug:{dumpModules:'./tmp',loadDumppedModules:true}}}
- Disable auto install checks: set VITEST_SKIP_INSTALL_CHECKS=1

## Supplementary Details
• defineConfig signature:
  function defineConfig(config: UserConfig<TestOptions>): UserConfig<TestOptions>

• mergeConfig signature:
  function mergeConfig(base: UserConfig, override: UserConfig): UserConfig

• CLI exit codes: 0 success, 1 failures, 2 configuration error

• Environments:
  jsdom: JSDOM instance exposes global jsdom. Types via 'vitest/jsdom'. Default options: {}
  happy-dom: Node-like browser; default options: {}
  edge-runtime: V8 isolate, no DOM; default options: {}
  custom: load 'vitest-environment-<name>' package exporting {name,transformMode,setup}

• Automatic dependency prompts: ENV VITEST_SKIP_INSTALL_CHECKS=1

• Snapshot update:
  vitest -u or vitest --update
  Deletes obsolete and updates changed snapshots



## Reference Details
### Complete CLI Options
--config <string>              path to config file
--root <string>                project root
--dir <string>                 test discovery base dir
--watch, -w                    boolean default true interactive
--run                          boolean default false
--update, -u                   boolean default false
--environment <string>         node|jsdom|happy-dom|edge-runtime default node
--globals                      boolean default false
--coverage                     boolean default false
--port <number>                for browser mode
--https                        boolean default false
--reporter <string>            built-in: default,verbose,junit,json,html
--outputFile.<type>=<string>   type=json|html|junit path
--help                         list options

### defineConfig UserConfig<TestOptions>
interface TestOptions {
  include?: string[]
  exclude?: string[]
  includeSource?: string[]
  name?: string
  root?: string
  dir?: string
  globals?: boolean
  environment?: string
  environmentOptions?: Record<string,unknown>
  alias?: Record<string,string> | Array<{find:string|RegExp;replacement:string;}>
  server?: {sourcemap?:boolean|'inline'; deps?:{external?:Array<string|RegExp>;inline?:Array<string|RegExp>|true;moduleDirectories?:string[];fallbackCJS?:boolean;cacheDir?:string;};debug?:{dumpModules?:boolean|string;loadDumppedModules?:boolean;};}
  deps?: {optimizer?:{ssr?:{include?:string[];exclude?:string[];enabled?:boolean};web?:{include?:string[];exclude?:string[];transformAssets?:boolean;transformCss?:boolean;transformGlobPattern?:RegExp|RegExp[];enabled?:boolean}};external?:Array<string|RegExp>;inline?:Array<string|RegExp>|true;fallbackCJS?:boolean;moduleDirectories?:string[];cacheDir?:string;}
  runner?: string
  watch?: boolean
  update?: boolean
  reporters?: Array<string|object>
  outputFile?: string | Record<string,string>
  coverage?: {enabled?:boolean;reportsDirectory?:string;exclude?:string[];include?:string[]}
  workspace?: Array<string | {test: Partial<TestOptions> & {extends?:boolean}}>
}

### Code Examples
1. Merge Vite and Vitest configs:
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
export default mergeConfig(viteConfig, defineConfig({test:{exclude:['packages/template/*']}}))

2. Custom environment loader:
export default <Environment>{
  name:'custom',
  transformMode:'ssr',
  setup(){ return {teardown(){}} }
}

### Troubleshooting
1. CJS interop errors:
Error: Named export 'x' not found
Set deps.interopDefault=true

2. Debug dumped modules:
Add server.debug.dumpModules='./tmp', loadDumppedModules=true
Inspect generated files in ./tmp

3. Skip installation checks:
export VITEST_SKIP_INSTALL_CHECKS=1

4. Force dependency rebundling:
deps.optimizer.[mode].force=true



## Information Dense Extract
install: npm|yarn|pnpm|bun add -D vitest; requires Vite>=5, Node>=18;
test naming: file.{test,spec}.{js,ts,jsx,tsx,mjs,cjs};
run: vitest [--config file][--root path][--dir path][--watch/-w][--run][--update/-u][--environment env][--globals][--coverage][--reporter name][--outputFile.<type>=path][--port num][--https];
config via vite.config or vitest.config: defineConfig({test:{include,exclude,includeSource,name,root,dir,globals,environment,alias,deps:{external,inline,moduleDirectories,fallbackCJS,cacheDir,optimizer:{web,ssr}},server:{sourcemap,debug:{dumpModules,loadDumppedModules}},runner,watch,update,reporters,outputFile,coverage:{enabled,include,exclude,reportsDirectory},workspace}});
defaults: include ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], exclude ['**/node_modules/**','**/dist/**',...], globals false, environment 'node', runner 'node', watch interactive, update false, reporters ['default'];
workspace supports globs and objects; mergeConfig(base,override);
environments built-in: node,jsdom,happy-dom,edge-runtime,custom via vitest-environment-<name>;
debug: server.debug.dumpModules, loadDumppedModules;
skip prompts: VITEST_SKIP_INSTALL_CHECKS=1;
CJS interop: deps.interopDefault=true.


## Sanitised Extract
Table of Contents:
1. Installation
2. Writing Tests
3. CLI Usage
4. Config File Setup
5. Config Options
6. Workspaces
7. Debugging

1. Installation
- Requirements: Vite>=5.0.0, Node>=18.0.0
- Commands:
  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest

2. Writing Tests
- File suffix must include .test. or .spec.
- Example:
  export function sum(a: number,b: number): number{return a+b}
  import {expect,test} from 'vitest'
  test('adds',()=>{expect(sum(1,2)).toBe(3)})
- package.json scripts:
  'test':'vitest'

3. CLI Usage
vitest [--config <file>] [--root <path>] [--dir <path>] [--watch] [--run] [-u] [--environment <env>] [--globals] [--coverage] [--reporter <name>] [--outputFile.<type>=<path>] [--port <n>] [--https]

4. Config File Setup
- Supported files: vite.config.{js,mjs,cjs,ts,cts,mts} or vitest.config.{js,mjs,cjs,ts,cts,mts}
- Vite unified config:
  import {defineConfig} from 'vite';
  /// <reference types='vitest/config' />
  export default defineConfig({test:{...}})
- Separate config:
  import {defineConfig} from 'vitest/config';
  export default defineConfig({test:{...}})

5. Config Options
- include: string[] default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
- exclude: string[] default ['**/node_modules/**','**/dist/**',...]
- includeSource: string[] default []
- globals: boolean default false
- environment: 'node'|'jsdom'|'happy-dom'|'edge-runtime' default 'node'
- alias: Record<string,string>
- deps.external: Array<string|RegExp> default [/'/node_modules'//]
- deps.inline: Array<string|RegExp>|true default []
- deps.moduleDirectories: string[] default ['node_modules']
- runner: string default 'node'
- watch: boolean default interactive
- update: boolean default false
- reporters: Array<string|object> default ['default']
- outputFile: string|Record<string,string>
- coverage.enabled: boolean default false
- coverage.include/exclude: string[] defaults []

6. Workspaces
- test.workspace: Array<string|object>
- Glob entries or objects: {test:{name,root,environment,setupFiles}}
- Allows multiple configurations in one process

7. Debugging
- server.debug.dumpModules: boolean|string
- server.debug.loadDumppedModules: boolean
- Example:
  test:{server:{debug:{dumpModules:'./tmp',loadDumppedModules:true}}}
- Disable auto install checks: set VITEST_SKIP_INSTALL_CHECKS=1

## Original Source
Vitest Testing Framework
https://vitest.dev

## Digest of VITEST_CONFIG

# Vitest Configuration and Usage Reference

**Retrieved on:** 2024-06-19

## 1. Installation Requirements

• Vite >= 5.0.0

• Node.js >= 18.0.0

• Install command examples:

  npm install -D vitest
  yarn add -D vitest
  pnpm add -D vitest
  bun add -D vitest


## 2. Writing and Running Tests

**sum.js**
export function sum(a: number, b: number): number {
  return a + b
}

**sum.test.js**
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

Add to package.json scripts:
  "scripts": { "test": "vitest" }
Run:
  npm run test
  yarn test
  pnpm test
  bun run test  (for Bun users)


## 3. Command Line Interface

vitest [options]
vitest run --coverage

**Common Flags**
--config <path>         path to vitest config file
--root <path>           project root directory
--dir <path>            base directory to scan for tests
--watch, -w             boolean, default true iff interactive
--run, --no-watch       run once without watching
--update, -u            update snapshots, default false
--environment <env>     node | jsdom | happy-dom | edge-runtime, default node
--globals               boolean, default false
--coverage              collect coverage
--port <number>         serve port for browser mode
--https                 use HTTPS for browser mode
--reporter <name>       built-in or custom reporter, default default
--outputFile.<type>=<path> write report to file


## 4. Configuration Files

### 4.1 vite.config.[js|ts]
import { defineConfig } from 'vite'
/// <reference types="vitest/config" />
export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: false,
    environment: 'node',
    root: './',
    dir: './',
    watch: !process.env.CI && process.stdin.isTTY,
    update: false,
    reporters: ['default'],
    outputFile: { json: './results.json' },
    coverage: {
      enabled: true,
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts']
    },
    deps: {
      inline: [],
      external: [/node_modules/],
      moduleDirectories: ['node_modules']
    }
  }
})

### 4.2 vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    includeSource: [],
    alias: { '@': '/src' },
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    workspace: [
      'packages/*',
      { test: { name: 'node', root: './shared', environment: 'node' } }
    ]
  }
})


## 5. Configuration Options Reference

| Option                  | Type                | Default                                                         | Description                              |
|-------------------------|---------------------|-----------------------------------------------------------------|------------------------------------------|
| include                 | string[]            | ['**/*.{test,spec}.?(c|m)[jt]s?(x)']                            | Glob patterns for test files            |
| exclude                 | string[]            | ['**/node_modules/**','**/dist/**', ...]                       | Glob patterns to exclude                |
| includeSource           | string[]            | []                                                              | Glob patterns for in-source tests       |
| name                    | string              | undefined                                                       | Custom project name                     |
| root                    | string              | process.cwd()                                                  | Project root directory                  |
| dir                     | string              | same as root                                                   | Base dir to scan for tests              |
| globals                 | boolean             | false                                                           | Enable global APIs                      |
| environment             | string              | 'node'                                                          | Test environment                         |
| environmentOptions      | Record<string,unknown> | {}                                                            | Options passed to environment setup     |
| alias                   | Record<string,string> | {}                                                           | Custom module resolution aliases        |
| deps.external           | Array<string|RegExp> | [/\/node_modules\//]                                         | Dependencies to externalize             |
| deps.inline             | Array<string|RegExp> 
|                         | []                                                              | Dependencies to inline                  |
| deps.moduleDirectories  | string[]            | ['node_modules']                                               | Additional module directories           |
| runner                  | string              | 'node' or 'benchmark'                                         | Custom runner                           |
| watch                   | boolean             | true when interactive, false in CI                             | Watch mode                              |
| update                  | boolean             | false                                                          | Snapshot update                         |
| reporters               | Array<string|object> | ['default']                                                   | Output reporters                        |
| outputFile              | string or Record    | undefined                                                      | File path(s) for reporter output        |
| coverage.enabled        | boolean             | false                                                          | Enable coverage                         |
| coverage.include        | string[]            | []                                                             | Coverage include patterns               |
| coverage.exclude        | string[]            | []                                                             | Coverage exclude patterns               |


## 6. Workspaces Support

Configure multiple test projects in one process:

vitest.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    workspace: [
      'packages/*',
      { test: { name: 'unit', environment: 'jsdom', setupFiles: ['./unit.setup.ts'] } },
      { test: { name: 'e2e', environment: 'node', dir: 'tests/e2e' } }
    ]
  }
})


## 7. Troubleshooting and Best Practices

### 7.1 Module Debugging

Use server.debug:

in vitest.config.ts:
  test: { server: { debug: { dumpModules: './tmp', loadDumppedModules: true } } }

Run tests and inspect dumped modules in ./tmp to trace transformations.

### 7.2 Dependency Issues

To disable automatic install prompts:
ENV VITEST_SKIP_INSTALL_CHECKS=1

### 7.3 Common Errors

Error: Named export 'x' not found
Cause: importing CJS without interopDefault
Fix: set deps.interopDefault to true in config



## Attribution
- Source: Vitest Testing Framework
- URL: https://vitest.dev
- License: License: MIT License
- Crawl Date: 2025-05-11T06:57:48.514Z
- Data Size: 25406638 bytes
- Links Found: 21691

## Retrieved
2025-05-11
