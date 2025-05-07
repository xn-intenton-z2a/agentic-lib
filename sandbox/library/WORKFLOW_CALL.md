# WORKFLOW_CALL

## Crawl Summary
Event: workflow_call
Inputs: name, description, required, default, type
Secrets: name, description, required
Outputs: defined per job with ::set-output and job.outputs mapping
Caller: uses <owner>/<repo>/.github/workflows/<file>@<ref>, with inputs, secrets
Examples: callee YAML, caller YAML

## Normalised Extract
Table of Contents
1 Event Configuration
2 Inputs Definition
3 Secrets Definition
4 Outputs Definition
5 Caller Syntax
6 Examples

1 Event Configuration
on: workflow_call:
  inputs:
    input_key:
      description: text
      required: true|false
      default: value  # if required false
      type: string|boolean|environment
  secrets:
    secret_key:
      description: text
      required: true|false

2 Inputs Definition
Define input_key under inputs with properties:
- description: human-readable
- required: boolean
- default: scalar value when required false
- type: enum string, boolean, environment

3 Secrets Definition
Define secret_key under secrets with properties:
- description: human-readable
- required: boolean

4 Outputs Definition
In jobs:<job_id>:
- steps: use echo "::set-output name=key::value" with id
- outputs:
    key: ${{ jobs.job_id.outputs.key }}

5 Caller Syntax
jobs:
  <job_id>:
    uses: owner/repo/path/to/workflow.yml@ref
    with:
      input_key: value
    secrets:
      secret_key: ${{ secrets.SECRET_NAME }}

6 Examples
Callee:
name: Reusable
on:
  workflow_call:
    inputs:
      version:
        required: true
        description: 'Version to deploy'
    secrets:
      DEPLOY_TOKEN:
        required: true
        description: 'Token'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy ${{ inputs.version }}"
        id: d
      - run: echo "::set-output name=ref::${{ github.ref }}"
    outputs:
      ref: ${{ jobs.deploy.outputs.ref }}

Caller:
jobs:
  build:
    uses: org/repo/.github/workflows/reusable.yml@v2
    with:
      version: '1.2.3'
    secrets:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

## Supplementary Details
Inputs allowed per workflow_call: max 10 inputs; each input key max 30 chars; types default to string if omitted. Secrets allowed: max 10 secrets; secret values passed securely; missing required input or secret triggers workflow failure. Outputs: job outputs name must match step output. Caller uses can reference local or external repo workflows; uses path supports full path and git ref. Caller job has no runs-on; inherits jobs from callee. YAML must validate schema; invalid keys cause parsing errors.

## Reference Details
YAML Schema
  workflow_call:
    inputs: Map<string, InputSchema>
    secrets: Map<string, SecretSchema>

InputSchema:
  description: string (required)
  required: boolean (required)
  default: string|boolean|number (optional)
  type: string enum[string, boolean, environment] (optional)

SecretSchema:
  description: string (optional)
  required: boolean (required)

Job Outputs
Steps must include id. set-output syntax: echo "::set-output name=<key>::<value>"
Job outputs mapping: outputs.key: ${{ jobs.job_id.outputs.key }}

Caller job signature
jobs.job_id:
  uses: string (@ separated owner/repo/path@ref)
  with: Map<string,string>
  secrets: Map<string,string>
  name: string (optional)

Best Practices
- Pin reusable workflows to specific tag or SHA to avoid breaking changes: uses: repo/path@v1.2.3
- Validate inputs: include required: true and do early step checking inputs in callee.
- Do not include secrets in logs: use ${{ inputs.secret }} only in runner commands that do not echo values.
- Limit number of inputs and secrets to reduce surface area (<10 each).
- Use type: boolean for flags to get true/false typed.

Troubleshooting
1 Missing required input
Error: Inputs input_key required but not provided
Solution: Add input in caller under with.

2 Invalid uses path
Error: Unable to resolve action owner/repo/path
Solution: Check repo, file path, and ref.

3 Output not set
jobs.<job_id>.outputs.key is empty
Check: step id matches set-output name and that echo executed before end of job.

4 Secret redaction
If secret appears in logs, set secrets mask in runner command.

CLI Invocation
Trigger reusable workflow manually:
gh workflow run consumer.yml --ref main \
  -f version=1.2.3 \
  -s DEPLOY_TOKEN=<token>
Expect: job call-reusable shows greetings output from reusable workflow.

## Information Dense Extract
on: workflow_call inputs:name,description,required,default?,type? secrets:name,description?,required jobs:<job_id>.steps:echo "::set-output name=key::value" outputs:key->jobs.job_id.outputs.key Caller uses: owner/repo/path@ref with:inputs secrets:secrets PIN to tag SHA BestPractices: validate inputs, mask secrets, limit counts. Troubleshooting: missing input, invalid uses path, empty outputs, secret leaks. gh cli: gh workflow run <consumer.yml> --ref <branch> -f key=value -s SECRET=value

## Sanitised Extract
Table of Contents
1 Event Configuration
2 Inputs Definition
3 Secrets Definition
4 Outputs Definition
5 Caller Syntax
6 Examples

1 Event Configuration
on: workflow_call:
  inputs:
    input_key:
      description: text
      required: true|false
      default: value  # if required false
      type: string|boolean|environment
  secrets:
    secret_key:
      description: text
      required: true|false

2 Inputs Definition
Define input_key under inputs with properties:
- description: human-readable
- required: boolean
- default: scalar value when required false
- type: enum string, boolean, environment

3 Secrets Definition
Define secret_key under secrets with properties:
- description: human-readable
- required: boolean

4 Outputs Definition
In jobs:<job_id>:
- steps: use echo '::set-output name=key::value' with id
- outputs:
    key: ${{ jobs.job_id.outputs.key }}

5 Caller Syntax
jobs:
  <job_id>:
    uses: owner/repo/path/to/workflow.yml@ref
    with:
      input_key: value
    secrets:
      secret_key: ${{ secrets.SECRET_NAME }}

6 Examples
Callee:
name: Reusable
on:
  workflow_call:
    inputs:
      version:
        required: true
        description: 'Version to deploy'
    secrets:
      DEPLOY_TOKEN:
        required: true
        description: 'Token'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo 'Deploy ${{ inputs.version }}'
        id: d
      - run: echo '::set-output name=ref::${{ github.ref }}'
    outputs:
      ref: ${{ jobs.deploy.outputs.ref }}

Caller:
jobs:
  build:
    uses: org/repo/.github/workflows/reusable.yml@v2
    with:
      version: '1.2.3'
    secrets:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

## Original Source
GitHub Actions workflow_call Event
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call

## Digest of WORKFLOW_CALL

# workflow_call Event

## Overview
The workflow_call event enables a workflow to be invoked by another workflow as a reusable component. It defines inputs, secrets, and outputs in the callee and is consumed by a caller using the uses, with, and secrets keywords.

## Event Configuration
```yaml
on:
  workflow_call:
    inputs:
      <input_key>:
        description: '<text>'
        required: <true|false>
        default: <value>         # optional
        type: <string|boolean|environment>  # optional
    secrets:
      <secret_key>:
        description: '<text>'
        required: <true|false>
```  
- inputs: map of parameters passed from caller  
- secrets: map of secrets passed from caller  

## Defining Outputs
In the callee workflow, assign outputs at the job level:
```yaml
jobs:
  <job_id>:
    runs-on: <runner>
    steps:
      - name: Produce output
        id: <step_id>
        run: echo "::set-output name=<output_key>::<value>"
    outputs:
      <output_key>: ${{ jobs.<job_id>.outputs.<output_key> }}
```  
- job.outputs: maps step outputs into workflow outputs

## Caller Workflow Usage
```yaml
jobs:
  call-reusable-workflow:
    uses: <owner>/<repo>/.github/workflows/<workflow_file>@<ref>
    with:
      <input_key>: <value>
      ...
    secrets:
      <secret_key>: ${{ secrets.<secret_name> }}
```  
- uses: reference to callee workflow by repo path and git ref  
- with: map input_key→value  
- secrets: map secret_key→runner secret

## Examples
### Callee: .github/workflows/called.yml
```yaml
name: 'Reusable build-and-test'
on:
  workflow_call:
    inputs:
      log_level:
        description: 'Log level for build'
        required: false
        default: 'warning'
      environment:
        description: 'Deployment target'
        required: true
        type: environment
    secrets:
      GITHUB_TOKEN:
        description: 'GitHub token for API calls'
        required: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Log level: ${{ inputs.log_level }}"
        id: log_level_step
      - name: Deploy
        run: echo "Deploying to ${{ inputs.environment }}"
        id: deploy_step
      - name: Set greeting output
        run: echo "::set-output name=greeting::Hello ${{ github.actor }}"
    outputs:
      greeting: ${{ jobs.build.outputs.greeting }}
```

### Caller: .github/workflows/consumer.yml
```yaml
name: 'Consumer workflow'
on:
  push:
    branches: [ main ]
jobs:
  call-reusable:
    uses: octo-org/octo-repo/.github/workflows/called.yml@v1.0.0
    with:
      environment: 'production'
      log_level: 'debug'
    secrets:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Attribution
- Source: GitHub Actions workflow_call Event
- URL: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
- License: License: CC BY 4.0
- Crawl Date: 2025-05-07T00:39:50.998Z
- Data Size: 985163 bytes
- Links Found: 16449

## Retrieved
2025-05-07
