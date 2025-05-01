# WORKFLOW_SYNTAX

## Crawl Summary
Workflow syntax uses YAML configuration specifying workflow metadata, triggers (on, schedule, workflow_call, workflow_dispatch), job definitions (jobs with unique ids, environment, permissions, defaults, concurrency), and filters for branches, tags, and paths. Trigger events use precise definitions for activity types and filtering using glob patterns. Reusable workflows require defined inputs, outputs, and secret mappings, along with strict type requirements. Permission settings allow precise control of GITHUB_TOKEN scopes with options like read-all and write-all.

## Normalised Extract
Table of Contents:
1. Workflow Metadata
   - name and run-name configuration with expression support.
2. Triggering Events
   - on events configuration, including single and multi-event triggers, filters for branches, tags, and paths, activity types, and example cron scheduling with on.schedule.
3. Job Configuration
   - jobs with unique identifiers, dependency declaration using needs, environment variable precedence, and runner specifications.
4. Defaults and Environment
   - defaults.run settings for shell and working directory; env configuration and override hierarchy.
5. Concurrency
   - definition of concurrency groups and cancel-in-progress behavior using expressions.
6. Permission Settings
   - GITHUB_TOKEN permissions configuration, including granular scopes and use of read-all/write-all shortcuts.
7. Reusable Workflows
   - on.workflow_call inputs, outputs, and secrets with required types and error conditions on undefined inputs.

Detailed Technical Information:
1. Workflow Metadata:
   - YAML file must reside in .github/workflows
   - name: workflow display name, run-name: dynamic naming using expressions.

2. Triggering Events:
   - on: push, fork, label (with types), schedule (cron), workflow_dispatch (with inputs) examples.
   - Filters include branches, branches-ignore, tags, tags-ignore, and paths with examples:
     on:
       push:
         branches: [main, 'releases/**']
         tags: [v2, 'v1.*']
         paths: ['**.js']
         paths-ignore: ['docs/**']

3. Job Configuration:
   - jobs: each job defined with an identifier. Example:
     jobs:
       my_first_job:
         name: 'My first job'
         runs-on: ubuntu-latest
         needs: [other_job]
         permissions: contents: write, actions: read
   - Environment variables set in env and defaults with override order: step > job > workflow.

4. Defaults and Environment:
   - defaults.run configuration: shell (bash, pwsh, etc) and working-directory provided.
   Example: defaults:
              run:
                shell: bash
                working-directory: ./scripts

5. Concurrency:
   - Defined at workflow or job level using concurrency:
     concurrency:
       group: ${{ github.workflow }}-${{ github.ref }}
       cancel-in-progress: true
   - Dynamic expressions can include fallback for undefined variables.

6. Permission Settings:
   - Permissions for GITHUB_TOKEN defined as:
     permissions:
       actions: read|write|none
       contents: read|write|none
       deployments: read|write|none
     - Use of shortcuts: permissions: read-all, write-all, or {} to disable.

7. Reusable Workflows:
   - on.workflow_call:
     inputs:
       username:
         description: 'A username passed from the caller workflow'
         default: 'john-doe'
         required: false
         type: string
     outputs:
       workflow_output1:
         description: 'First output'
         value: ${{ jobs.my_job.outputs.job_output1 }}
     secrets:
       access-token:
         description: 'Token for workflow'
         required: false

## Supplementary Details
Exact Technical Specifications:
- YAML file extension: .yml or .yaml
- Directory location: .github/workflows
- Workflow Metadata:
    name: String; if omitted, path is used
    run-name: Supports expressions (e.g., Deploy to ${{ inputs.deploy_target }} by @${{ github.actor }})
- Event Triggers:
    on: { event_name: trigger details }
    on.schedule: cron syntax string e.g. '30 5,17 * * *'
    on.workflow_call: Requires inputs with type field (boolean, number, or string), outputs, and secrets
    on.workflow_dispatch: Supports inputs (choice, boolean, number, environment, string) with max 10 fields and payload up to 65,535 characters
- Job definitions:
    job_id: Must start with letter or _; supports keys: name, runs-on, needs, permissions, defaults, steps
- Defaults:
    defaults.run:
      shell: Options include bash, pwsh, cmd, powershell
      working-directory: Must pre-exist on runner
- Concurrency:
    concurrency group: Defined using expressions; cancel-in-progress flag (boolean or expression)
- Permissions:
    List of permissions with allowed values (read, write, none); fallback to none if not specified.
    Examples: actions, contents, deployments, issues, status, etc.

Implementation Steps:
1. Create YAML file in .github/workflows
2. Set workflow metadata with name and run-name
3. Define triggering events using on with proper filters
4. Configure jobs with appropriate runner, permissions, and dependency settings
5. Use defaults and env to manage execution context
6. Configure concurrency to enforce single-run limits
7. For reusable workflows, set up on.workflow_call with inputs, outputs, and secrets
8. Test filtering functionality by pushing changes to branches/tags/paths as per defined patterns

Troubleshooting Procedures:
- Validate YAML syntax using online validators
- Ensure glob patterns are escaped for literal matches if special characters are present
- Use GitHub Actions logs to verify triggered events and parameter values
- Check permissions settings if token access fails; modify permissions: read-all or write-all as necessary
- For concurrency issues, review group expressions and cancel-in-progress flag outputs

## Reference Details
API Specifications and Method Signatures:

Reusable Workflow Input Specification:
Input Object Parameters:
  username: { description: string, default: 'john-doe', required: false, type: string }

Reusable Workflow Output Mapping:
  workflow_output1: { description: 'First job output', value: ${{ jobs.my_job.outputs.job_output1 }} }
  workflow_output2: { description: 'Second job output', value: ${{ jobs.my_job.outputs.job_output2 }} }

Workflow Trigger Example:
  on:
    push:
      branches:
        - 'releases/**'
        - '!releases/**-alpha'
    schedule:
      - cron: '30 5,17 * * *'
    workflow_dispatch:
      inputs:
        logLevel: { description: 'Log level', required: true, default: 'warning', type: choice, options: ['info','warning','debug'] }

Job Definition Example:
  jobs:
    build_job:
      name: 'Build Application'
      runs-on: ubuntu-latest
      permissions: { contents: write, actions: read }
      steps:
        - name: Checkout Code
          uses: actions/checkout@v3
        - name: Build
          run: npm run build

Concurrency Specification:
  concurrency: { group: "${{ github.workflow }}-${{ github.ref }}", cancel-in-progress: true }

Permission Configuration:
  permissions:
    actions: read
    contents: write
    deployments: read
    issues: write
    statuses: read

Shell Defaults:
  defaults:
    run:
      shell: bash
      working-directory: ./scripts

Detailed Troubleshooting Commands:
1. Check YAML syntax with command: yamllint .github/workflows/yourworkflow.yml
2. Test trigger by pushing a commit to branch matching filter, observe Actions logs via GitHub UI
3. For permission issues, add debug command: echo ${{ toJson(github) }} to verify token scopes
4. Validate concurrency configuration by reviewing canceled runs in Actions logs

Best Practices:
- Use explicit branch and path filters to minimize unintended triggers
- Define environment variables at the job level for isolation
- Use cancel-in-progress for deployment workflows to prevent conflicts
- Modularize reusable workflows with clear input and output definitions
- Validate token permissions to adhere to least privilege principles

## Information Dense Extract
Workflow YAML in .github/workflows; name and run-name parameters with expressions; on event triggers: push, fork, label (with types), schedule (cron syntax '30 5,17 * * *'), workflow_call (inputs: type required, default, description), workflow_dispatch (inputs with type: boolean, choice, number, environment, string; max 10 properties, 65k payload); jobs with unique id, runs-on, needs, env, defaults.run {shell, working-directory}, permissions (granular: actions, contents, deployments, issues, statuses); concurrency: group expression (e.g. ${{ github.workflow }}-${{ github.ref }}), cancel-in-progress true; permission shortcuts: read-all, write-all; direct API mappings for reusable workflows; troubleshooting: yamllint validation, log inspection, explicit echo debugging; detailed step-by-step job configuration and best practices for limiting triggers and ensuring minimal token permissions.

## Sanitised Extract
Table of Contents:
1. Workflow Metadata
   - name and run-name configuration with expression support.
2. Triggering Events
   - on events configuration, including single and multi-event triggers, filters for branches, tags, and paths, activity types, and example cron scheduling with on.schedule.
3. Job Configuration
   - jobs with unique identifiers, dependency declaration using needs, environment variable precedence, and runner specifications.
4. Defaults and Environment
   - defaults.run settings for shell and working directory; env configuration and override hierarchy.
5. Concurrency
   - definition of concurrency groups and cancel-in-progress behavior using expressions.
6. Permission Settings
   - GITHUB_TOKEN permissions configuration, including granular scopes and use of read-all/write-all shortcuts.
7. Reusable Workflows
   - on.workflow_call inputs, outputs, and secrets with required types and error conditions on undefined inputs.

Detailed Technical Information:
1. Workflow Metadata:
   - YAML file must reside in .github/workflows
   - name: workflow display name, run-name: dynamic naming using expressions.

2. Triggering Events:
   - on: push, fork, label (with types), schedule (cron), workflow_dispatch (with inputs) examples.
   - Filters include branches, branches-ignore, tags, tags-ignore, and paths with examples:
     on:
       push:
         branches: [main, 'releases/**']
         tags: [v2, 'v1.*']
         paths: ['**.js']
         paths-ignore: ['docs/**']

3. Job Configuration:
   - jobs: each job defined with an identifier. Example:
     jobs:
       my_first_job:
         name: 'My first job'
         runs-on: ubuntu-latest
         needs: [other_job]
         permissions: contents: write, actions: read
   - Environment variables set in env and defaults with override order: step > job > workflow.

4. Defaults and Environment:
   - defaults.run configuration: shell (bash, pwsh, etc) and working-directory provided.
   Example: defaults:
              run:
                shell: bash
                working-directory: ./scripts

5. Concurrency:
   - Defined at workflow or job level using concurrency:
     concurrency:
       group: ${{ github.workflow }}-${{ github.ref }}
       cancel-in-progress: true
   - Dynamic expressions can include fallback for undefined variables.

6. Permission Settings:
   - Permissions for GITHUB_TOKEN defined as:
     permissions:
       actions: read|write|none
       contents: read|write|none
       deployments: read|write|none
     - Use of shortcuts: permissions: read-all, write-all, or {} to disable.

7. Reusable Workflows:
   - on.workflow_call:
     inputs:
       username:
         description: 'A username passed from the caller workflow'
         default: 'john-doe'
         required: false
         type: string
     outputs:
       workflow_output1:
         description: 'First output'
         value: ${{ jobs.my_job.outputs.job_output1 }}
     secrets:
       access-token:
         description: 'Token for workflow'
         required: false

## Original Source
GitHub Actions Workflow Syntax
https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

## Digest of WORKFLOW_SYNTAX

# GitHub Actions Workflow Syntax

Retrieved Date: 2023-10-06

## Overview
A workflow is defined in a YAML file (extension .yml or .yaml) stored in the .github/workflows directory. The file specifies the workflow name, run-name, triggering events, jobs, and steps. All configuration parameters, filters, and event types are strictly defined in the document.

## Workflow Metadata
- name: Workflow display name; if omitted GitHub uses repository file path
- run-name: Can use expressions, e.g. run-name: Deploy to ${{ inputs.deploy_target }} by @${{ github.actor }}

## Triggering Events

### on
- Single event: on: push
- Multiple events: on: [push, fork]
- Activity types: use on.<event_name>.types with array of specific activities

Example:

  on:
    label:
      types:
        - created

- Filters for branches, tags and paths:
  on:
    push:
      branches:
        - main
      tags:
        - v2
      paths:
        - '**.js'
      paths-ignore:
        - 'docs/**'

### Special Events
- on.schedule: Use cron syntax (e.g. cron: '30 5,17 * * *') for scheduling workflow runs
- on.workflow_call: Defines inputs, outputs, and secret mappings for reusable workflows
- on.workflow_dispatch: Allows manual trigger with defined inputs (type, required, default, and options)

## Job Configuration

### jobs
Each job must have a unique job_id that starts with a letter or underscore. Example definitions:

  jobs:
    my_first_job:
      name: My first job
    my_second_job:
      name: My second job

- Jobs can share environment variables via env or defaults.
- jobs.<job_id>.permissions: Overrides token permissions on a job basis
- jobs.<job_id>.needs: Specifies dependencies among jobs
- jobs.<job_id>.runs-on: Specifies runner type e.g. ubuntu-latest

## Defaults and Environment

### defaults
Configure default shell and working directory for run steps:

  defaults:
    run:
      shell: bash
      working-directory: ./scripts

### env
Define environment variables at workflow, job, or step level. Precedence: step > job > workflow

## Concurrency
Configure concurrency to limit parallel jobs/workflow runs:

  concurrency:
    group: ${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true

Alternative concurrency examples include static groups or dynamic expressions with fallback values (e.g. github.head_ref || github.run_id).

## Permission Settings

### permissions
Token permissions define access for the GITHUB_TOKEN. Specify read, write, or none for each scope. Examples:

  permissions:
    actions: read
    contents: write

Or use shortcuts:

  permissions: read-all
  permissions: write-all

A blank permissions object disables all access:

  permissions: {}

## Detailed Filters

- Branch and tag filters: Use branches, branches-ignore, tags, tags-ignore. Patterns use glob characters and can include negative patterns using '!'.
- Path filters: Use paths and paths-ignore. Only one of these can be specified per event. Negative patterns use '!' prefix.

Examples include:

  on:
    push:
      branches:
        - 'releases/**'
        - '!releases/**-alpha'

## API for Reusable Workflows (workflow_call)

### Inputs
Define inputs with type (boolean, number, or string) along with default values and required flag:

  on:
    workflow_call:
      inputs:
        username:
          description: 'A username passed from the caller workflow'
          default: 'john-doe'
          required: false
          type: string

### Outputs
Map outputs from a job using:

  on:
    workflow_call:
      outputs:
        workflow_output1:
          description: 'The first job output'
          value: ${{ jobs.my_job.outputs.job_output1 }}

### Secrets
Define secrets available to the called workflow:

  on:
    workflow_call:
      secrets:
        access-token:
          description: 'A token passed from the caller workflow'
          required: false

## Troubleshooting and Best Practices

- Ensure filters use proper glob patterns and escape characters as needed
- If a pre-flight check fails due to missing matching file or branch, workflow remains pending
- For multiple triggering events, be aware that each may cause separate workflow runs
- Use cancel-in-progress to avoid conflicts in deployment or resource intensive jobs

## Attribution

Data Size: 1081294 bytes; Links Found: 16403; Source: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

## Attribution
- Source: GitHub Actions Workflow Syntax
- URL: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- License: License: GitHub proprietary documentation
- Crawl Date: 2025-05-01T19:00:09.380Z
- Data Size: 1081294 bytes
- Links Found: 16403

## Retrieved
2025-05-01
