# WORKFLOW_SYNTAX

## Crawl Summary
YAML file in .github/workflows, extension .yml/.yaml. Key top-level keys: name, run-name, on, permissions, env, defaults, concurrency, jobs. 'on' defines events and filters: push (branches, tags, paths), pull_request (branches, paths), schedule (cron), workflow_call (inputs, outputs, secrets), workflow_dispatch (inputs). Filters accept glob patterns (*,**,?), ! for negatives; multiple patterns, order matters. 'jobs' define runs-on, needs, permissions, env, defaults, strategy.matrix, container, services, steps with id, name, uses/run, shell, with, env, continue-on-error, timeout. 'permissions' map of GITHUB_TOKEN scopes: actions, checks, contents, deployments, id-token, issues, models, packages, pages, pull-requests, security-events, statuses; values: read, write, none. 'defaults.run' defines shell and working-directory. 'concurrency' group and cancel-in-progress. Contexts and expressions available. Cron syntax POSIX quoted string. Steps contexts: github, inputs, secrets, env, vars, runner, matrix, steps.

## Normalised Extract
Table of Contents:
1. Workflow Placement
2. Triggers (on)
3. Filters and Patterns
4. Permissions
5. Environment Variables (env)
6. Default Settings (defaults)
7. Concurrency Control (concurrency)
8. Jobs Definition
9. Steps Specification
10. Contexts and Expressions

1. Workflow Placement
Store .yml or .yaml files in .github/workflows at repo root.

2. Triggers (on)
Syntax:
  on: <single-event> or [event1, event2] or block:
    event_name:
      filter: [patterns]
Supported events: push, pull_request, pull_request_target, schedule, workflow_call, workflow_dispatch, workflow_run.

3. Filters and Patterns
push:
  branches, branches-ignore, tags, tags-ignore, paths, paths-ignore
pull_request/target:
  branches, branches-ignore, paths, paths-ignore
schedule:
  cron: 'min hr day mon wkday'
workflow_call:
  inputs: id -> {type, required, default, description}
  outputs: id -> {value, description}
  secrets: id -> {required, description}
workflow_dispatch:
  inputs: id -> {type, required, default, options, description}
workflow_run:
  workflows: [names], types: [requested|completed], branches, branches-ignore
Patterns use globs: *, **, ?, ! for exclusion. Escape special chars with '\'. Order-sensitive: negative after positive excludes, after that positive re-includes.

4. Permissions
Map of GITHUB_TOKEN scopes to read|write|none. If any specified, others default to none. Shorthands: read-all, write-all, {} disables all. Top-level or per-job.

5. Environment Variables (env)
Map key:value. Scope: workflow > job > step. No cross-reference in map. Most specific wins.

6. Default Settings (defaults)
defaults.run.shell: bash|pwsh|sh|cmd|powershell|python
defaults.run.working-directory: path

7. Concurrency Control (concurrency)
group: string or expression using github, inputs, vars
cancel-in-progress: boolean or expression
Limits one running and one pending per group. Pending jobs cancel prior pending.

8. Jobs Definition
jobs:
  job_id:
    runs-on: runner-label (e.g., ubuntu-latest, windows-latest)
    needs: [job1, job2]
    permissions: map
    env: map
    defaults: defaults.run map
    strategy:
      matrix: map
      include: []
      exclude: []
      fail-fast: boolean
      max-parallel: integer
    container:
      image, credentials, env, ports, volumes, options
    services:
      service_id: image, credentials, env, ports, volumes, options
    timeout-minutes: integer
    continue-on-error: boolean

9. Steps Specification
Each step item:
  id: identifier
  name: display name
  if: expression
  uses: action reference or local path
  run: shell command string
  shell: shell override
  working-directory: path override
  with: map inputName: value
  env: map
  continue-on-error: boolean
  timeout-minutes: integer

10. Contexts and Expressions
Contexts: github, inputs, secrets, env, runner, matrix, steps, vars
Expression syntax: ${{ context.property || function(args) }}
Supported functions: contains, format, join, toJSON etc.


## Supplementary Details
File Extension: .yml or .yaml
Directory: .github/workflows/
Runner Labels: ubuntu-latest, windows-latest, macos-latest, self-hosted, labels via comma-separated list
Filter Keys and Types:
  branches, tags: include glob patterns, exclude with !, escape special chars with '\\'
  paths: include file paths, wildcards *, **
Cron Syntax: 'm h dom mon dow'
  Min interval: 5 minutes
  UTC only
Expression Contexts: github (event, sha, ref, workflow, run_id), inputs, secrets, env, vars, runner, matrix, steps
Permissions Keys: actions, attestations, checks, contents, deployments, discussions, id-token, issues, models, packages, pages, pull-requests, security-events, statuses
Strategy Matrix:
  matrix: { os:[ubuntu-latest, windows-latest], node:[12,14,16] }
  include: each map extends matrix
  exclude: maps to remove combinations
Container Job:
  image: docker image
  credentials: username/password or token
  env: map
  ports: list '8080:80'
  volumes: list '/host/path:/container/path'
  options: docker run options string
Services:
  define external containers with same fields
Shell Defaults:
  bash: bash --noprofile --norc -eo pipefail {0}
  pwsh: pwsh -command ". '{0}'"
  sh: sh -e {0}
  cmd: %ComSpec% /D /E:ON /V:OFF /S /C "CALL \"{0}\""
  powershell: powershell -command ". '{0}'"

Secrets Exposure:
  workflow_dispatch inputs max 10 keys, payload <=65535 chars
  workflow_call secrets required boolean

Ordering Rules:
  Filters: negative after positive excludes, positive after excludes re-includes
  Concurrency group names are case-insensitive


## Reference Details
YAML Schema Snippet:
```yaml
name: string
run-name: string
on:
  push:
    branches: [patterns]
    branches-ignore: [patterns]
    tags: [patterns]
    tags-ignore: [patterns]
    paths: [patterns]
    paths-ignore: [patterns]
  pull_request:
    types: [activity-types]
    branches: [patterns]
    branches-ignore: [patterns]
    paths: [patterns]
    paths-ignore: [patterns]
  schedule:
    - cron: 'm h dom mon dow'
  workflow_call:
    inputs:
      <id>:
        type: boolean|number|string
        required: true|false
        default: value
        description: string
    outputs:
      <id>:
        value: ${{ jobs.job_id.outputs.output_id }}
        description: string
    secrets:
      <id>:
        required: true|false
        description: string
  workflow_dispatch:
    inputs:
      <id>:
        type: boolean|choice|number|environment|string
        required: true|false
        default: value
        options: [array]
        description: string
  workflow_run:
    workflows: [names]
    types: [requested|completed]
    branches: [patterns]
    branches-ignore: [patterns]
permissions:
  actions: read|write|none
  checks: read|write|none
  contents: read|write|none
  id-token: write|none
  # and other scopes...
env:
  KEY: value
defaults:
  run:
    shell: bash|pwsh|sh|cmd|powershell|python
    working-directory: ./path
dispatch:
  concurrency:
    group: string or ${{ expression }}
    cancel-in-progress: true|false|${{ expression }}
jobs:
  <job_id>:
    name: string
    runs-on: label
    needs: [job_id]
    permissions: map
    env: map
    defaults: run map
    strategy:
      matrix:
        os: [values]
        include: [maps]
        exclude: [maps]
      fail-fast: boolean
      max-parallel: integer
    container:
      image: string
      credentials:
        username: string
        password: string
      env: map
      ports: [list]
      volumes: [list]
      options: string
    services:
      <service_id>:
        image: string
        credentials: map
        env: map
        ports: [list]
        volumes: [list]
        options: string
    timeout-minutes: integer
    continue-on-error: boolean
    steps:
      - id: string
        name: string
        if: expression
        uses: 'action@version' or './path'
        run: string
        shell: bash|pwsh|sh|cmd|powershell|python
        working-directory: path
        with:
          arg1: value
          arg2: value
        env:
          KEY: value
        continue-on-error: boolean
        timeout-minutes: integer
```  

Example Workflow:
```yaml
name: CI Pipeline
on:
  push:
    branches:
      - main
    paths-ignore:
      - 'docs/**'
  pull_request:
    types: [opened, reopened]
    branches:
      - 'releases/**'
permissions:
  contents: read
  id-token: write
env:
  NODE_ENV: test
defaults:
  run:
    shell: bash
    working-directory: ./scripts
concurrency:
  group: '${{ github.workflow }}-${{ github.ref }}'
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
  deploy:
    needs: [build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: ./deploy.sh
```

Best Practices:
- Limit permissions: specify only needed scopes.
- Use concurrency to prevent duplicate runs.
- Leverage matrix for parallel tests.
- Use paths and branches filters to reduce CI usage.
- Store reusable logic in workflow_call.

Troubleshooting:
- Pending state: verify branch/path filters cover changed files.
- Cron not triggering: confirm UTC schedule and file on default branch.
- Unrecognized event types: check API version: workflow file must be on default branch for workflow_dispatch.
- Diff limit: if >300 files, narrow path filters.
- Escaping globs: prefix special chars with '\\'.

Commands:
- Validate YAML: `act -P ubuntu-latest=nektos/act-environments-ubuntu:18.04`   
- List workflow runs: `gh run list --workflow 'CI Pipeline'`   
- View run logs: `gh run view <run-id> --log`   

## Information Dense Extract
Placement:.github/workflows/*.yml/.yaml. Triggers:on:{push:{branches[],branches-ignore[],tags[],tags-ignore[],paths[],paths-ignore[]},pull_request/pull_request_target:{types[],branches[],branches-ignore[],paths[],paths-ignore[]},schedule:[{cron:'m h dom mon dow'}],workflow_call:{inputs:{id:{type,required,default}},outputs:{id:{value,description}},secrets:{id:{required}}},workflow_dispatch:{inputs:{id:{type,required,default,options}}},workflow_run:{workflows[],types[],branches[],branches-ignore[]}}. permissions:{<scope>:read|write|none} | read-all|write-all. env:key:value. defaults.run:{shell:bash|pwsh|sh|cmd|powershell|python,working-directory:path}. concurrency:{group:string|expression,cancel-in-progress:boolean|expression}. jobs:{job_id:{runs-on,label,needs[],permissions,env,defaults,strategy:{matrix,include,exclude,fail-fast,max-parallel},container:{image,credentials,env,ports,volumes,options},services:{...},steps:[{id,name,if,uses,run,shell,working-directory,with,env,continue-on-error,timeout-minutes}],timeout-minutes,continue-on-error}}. contexts:github,inputs,secrets,env,vars,runner,matrix,steps. expressions:${{ }}. glob patterns:* ** ? ! (escape \). cron POSIX. Recommended: least privileges, concurrency, matrix, filters to optimize CI. Common commands: gh run list/view, act for local tests, YAML validation tools.

## Sanitised Extract
Table of Contents:
1. Workflow Placement
2. Triggers (on)
3. Filters and Patterns
4. Permissions
5. Environment Variables (env)
6. Default Settings (defaults)
7. Concurrency Control (concurrency)
8. Jobs Definition
9. Steps Specification
10. Contexts and Expressions

1. Workflow Placement
Store .yml or .yaml files in .github/workflows at repo root.

2. Triggers (on)
Syntax:
  on: <single-event> or [event1, event2] or block:
    event_name:
      filter: [patterns]
Supported events: push, pull_request, pull_request_target, schedule, workflow_call, workflow_dispatch, workflow_run.

3. Filters and Patterns
push:
  branches, branches-ignore, tags, tags-ignore, paths, paths-ignore
pull_request/target:
  branches, branches-ignore, paths, paths-ignore
schedule:
  cron: 'min hr day mon wkday'
workflow_call:
  inputs: id -> {type, required, default, description}
  outputs: id -> {value, description}
  secrets: id -> {required, description}
workflow_dispatch:
  inputs: id -> {type, required, default, options, description}
workflow_run:
  workflows: [names], types: [requested|completed], branches, branches-ignore
Patterns use globs: *, **, ?, ! for exclusion. Escape special chars with '''. Order-sensitive: negative after positive excludes, after that positive re-includes.

4. Permissions
Map of GITHUB_TOKEN scopes to read|write|none. If any specified, others default to none. Shorthands: read-all, write-all, {} disables all. Top-level or per-job.

5. Environment Variables (env)
Map key:value. Scope: workflow > job > step. No cross-reference in map. Most specific wins.

6. Default Settings (defaults)
defaults.run.shell: bash|pwsh|sh|cmd|powershell|python
defaults.run.working-directory: path

7. Concurrency Control (concurrency)
group: string or expression using github, inputs, vars
cancel-in-progress: boolean or expression
Limits one running and one pending per group. Pending jobs cancel prior pending.

8. Jobs Definition
jobs:
  job_id:
    runs-on: runner-label (e.g., ubuntu-latest, windows-latest)
    needs: [job1, job2]
    permissions: map
    env: map
    defaults: defaults.run map
    strategy:
      matrix: map
      include: []
      exclude: []
      fail-fast: boolean
      max-parallel: integer
    container:
      image, credentials, env, ports, volumes, options
    services:
      service_id: image, credentials, env, ports, volumes, options
    timeout-minutes: integer
    continue-on-error: boolean

9. Steps Specification
Each step item:
  id: identifier
  name: display name
  if: expression
  uses: action reference or local path
  run: shell command string
  shell: shell override
  working-directory: path override
  with: map inputName: value
  env: map
  continue-on-error: boolean
  timeout-minutes: integer

10. Contexts and Expressions
Contexts: github, inputs, secrets, env, runner, matrix, steps, vars
Expression syntax: ${{ context.property || function(args) }}
Supported functions: contains, format, join, toJSON etc.

## Original Source
GitHub Actions Workflow Syntax
https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

## Digest of WORKFLOW_SYNTAX

# Workflow File Placement

Workflow files must reside in .github/workflows/ with .yml or .yaml extension.

# name

Type: string
Default: file path relative to repo root

# run-name

Type: string or expression
Default: event-specific (commit message or PR title)

# on (Triggers)

Syntax:
  on: <event> | [<event1>,<event2>] |
       <event>:\n     <filter-key>: [<pattern>]
Supported events: push, pull_request, pull_request_target, schedule, workflow_call, workflow_dispatch, workflow_run, workflow_dispatch, workflow_dispatch

Filter keys per event:
  push: branches, branches-ignore, tags, tags-ignore, paths, paths-ignore
  pull_request / pull_request_target: branches, branches-ignore, paths, paths-ignore
  schedule: cron
  workflow_call: inputs, outputs, secrets
  workflow_dispatch: inputs
  workflow_run: workflows, types, branches, branches-ignore

# permissions

top-level or per-job: map<permission: String, access: read|write|none>
Default unspecified => none
read-all or write-all shorthand

# env

map<key: String, value: String>
Scope: workflow, job, step; resolution: step>job>workflow

# defaults

defaults.run.shell: bash|pwsh|sh|cmd|powershell|python
defaults.run.working-directory: String path

# concurrency

group: String or expression(github, inputs, vars)
cancel-in-progress: boolean or expression

# jobs

jobs:
  <job_id>:
    runs-on: runner-label
    needs: [<job_id>]
    permissions: map
    env: map
    defaults: defaults.run map
    strategy:
      matrix: map<axis: [values]>
      include: []
      exclude: []
      fail-fast: boolean
      max-parallel: integer
    container:
      image: String
      credentials: map
      env: map
      ports: [String]
      volumes: [String]
      options: String
    services:
      <service_id>:
        image: String
        credentials: map
        env: map
        ports: [String]
        volumes: [String]
        options: String
    steps:
      - id: String
        name: String
        if: expression
        uses: { action:version | path }
        run: String
        shell: String
        working-directory: String
        with: map<key:value>
        env: map
        continue-on-error: boolean
        timeout-minutes: integer
    timeout-minutes: integer
    continue-on-error: boolean

# contexts

github, inputs, secrets, env, vars, runner, matrix, steps

# expressions

${{ <context>.<property> | <function> }}

# cron

POSIX: minute hour day month weekday, quoted string, frequency >=5min

# glob patterns

Supported wildcards: *, **, ?, !. Escape special chars with \\.


## Attribution
- Source: GitHub Actions Workflow Syntax
- URL: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- License: License: CC BY 4.0
- Crawl Date: 2025-05-19T03:39:28.419Z
- Data Size: 1146302 bytes
- Links Found: 17315

## Retrieved
2025-05-19
