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
