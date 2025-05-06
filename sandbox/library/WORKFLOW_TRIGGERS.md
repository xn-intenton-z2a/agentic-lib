# WORKFLOW_TRIGGERS

## Crawl Summary
Defines the on key syntax for workflow triggers. Events support optional filters: types, branches, branches-ignore, tags, tags-ignore, paths, paths-ignore, schedule, repository_dispatch. Default activity types apply if filters omitted. Common use cases: push, pull_request with types array, schedule cron, repository_dispatch custom events. Conditional job execution via if: github.event. Troubleshooting covers default branch requirement, filter pattern validation, simulation with act.

## Normalised Extract
Table of Contents
1 Workflow triggers configuration
2 Event type filtering (types)
3 Branch and tag filters (branches, branches-ignore, tags, tags-ignore)
4 File path filters (paths, paths-ignore)
5 Scheduled workflows (schedule with cron)
6 repository_dispatch custom events
7 Conditional job execution based on github.event context

1 Workflow triggers configuration
  Syntax: on: <event>:
    <null|array|object>
  Default: runs on all supported activity types for events with types

2 Event type filtering (types)
  Key: types: [activityType1, activityType2]
  Behavior: limits workflow runs to specified activity types
  Example:
    on:
      check_run:
        types:
          - created
          - completed

3 Branch and tag filters (branches, branches-ignore, tags, tags-ignore)
  Keys: branches, branches-ignore, tags, tags-ignore: each an array of string patterns
  Patterns: glob syntax (wildcards *, **)
  Example:
    on:
      push:
        branches: ['main', 'releases/**']
        tags-ignore: ['v0.*']

4 File path filters (paths, paths-ignore)
  Keys: paths, paths-ignore: arrays of file path patterns
  Behavior: run workflow only when changes affect matching paths
  Example:
    on:
      pull_request:
        paths-ignore:
          - '**/*.md'

5 Scheduled workflows (schedule with cron)
  Key: schedule: array of objects { cron: '<cron expression>' }
  Cron syntax fields: minute(0-59) hour(0-23) day(1-31) month(1-12|JAN-DEC) day-of-week(0-6|SUN-SAT)
  Minimum interval: 5 minutes
  Example:
    on:
      schedule:
        - cron: '30 5,17 * * *'

6 repository_dispatch custom events
  Key: repository_dispatch: object
    types: [event_type_string]
    Limit: event_type max length 100 characters
    client_payload: custom data available at github.event.client_payload
  Example:
    on:
      repository_dispatch:
        types: ["test_result"]

7 Conditional job execution based on github.event context
  Use if: expressions in job definitions
  Access event payload properties under github.event
  Example:
    jobs:
      run_if_failed:
        if: !github.event.client_payload.passed
        runs-on: ubuntu-latest
        steps:
          - run: echo "Test failed: ${{ github.event.client_payload.message }}"


## Supplementary Details
1 Default behavior: If an event key is specified without filters, workflows run on all supported activity types. 2 Workflow file location: .github/workflows/ on default branch. 3 For events with Git ref context (push, pull_request, check_run), environment variables: GITHUB_REF, GITHUB_SHA; HEAD vs merge SHA: use github.event.pull_request.head.sha. 4 schedule delays: high load may drop jobs; avoid top-of-hour scheduling. 5 repository_dispatch client_payload: max 10 top-level properties, max 65535 chars. 6 pull_request vs pull_request_target: pull_request runs on merge commit context, skip if merge conflict; pull_request_target runs on base branch context, grants write token, avoid running untrusted code. 7 Combining filters: multiple filters all must match. 8 YAML quoting: wildcard patterns must be quoted to avoid YAML parsing issues.

## Reference Details
JSON schema for workflow triggers:
{
  "$id": "https://docs.github.com/workflow-triggers.schema.json",
  "type": "object",
  "properties": {
    "on": {"type": ["string","array","object"]},
    "push": {"type": ["object","array"],"properties":{
        "branches":{"type":"array","items":{"type":"string"}},
        "branches-ignore":{"type":"array","items":{"type":"string"}},
        "tags":{"type":"array","items":{"type":"string"}},
        "tags-ignore":{"type":"array","items":{"type":"string"}},
        "paths":{"type":"array","items":{"type":"string"}},
        "paths-ignore":{"type":"array","items":{"type":"string"}}
      }
    },
    "pull_request": {"type":["object","array"],"properties":{
        "types":{"type":"array","items":{"type":"string"}},
        "branches":{"type":"array","items":{"type":"string"}},
        "branches-ignore":{"type":"array","items":{"type":"string"}},
        "paths":{"type":"array","items":{"type":"string"}},
        "paths-ignore":{"type":"array","items":{"type":"string"}}
      }
    },
    "schedule": {"type":"array","items":{"type":"object","properties":{"cron":{"type":"string"}}}},
    "repository_dispatch": {"type":"object","properties":{
        "types":{"type":"array","items":{"type":"string"}}
      }
    }
  },
  "additionalProperties": true
}

Best practices:
- Always specify types array to future-proof event types
- Quote glob patterns in YAML
- Use pull_request_target for safe operations on PRs
- Use github.head_ref in conditionals to filter head branch

Troubleshooting:
Command: yamllint .github/workflows/*.yml
Expected: no errors

Command: act -W .github/workflows/trigger.yml -j job_id
Expected: simulated run log matching event payload

If workflow not triggered:
- Ensure event key present in on
- Verify default branch contains workflow file
- Check filter patterns match actual event values

## Information Dense Extract
on: <event>[: filters]
types: [activityType,...]
branches, branches-ignore, tags, tags-ignore: [pattern,...]
paths, paths-ignore: [pattern,...]
schedule: [{ cron: 'min hour day month dow' }]
repository_dispatch: types: [event_type]
if: github.event.<field>
Defaults: all activity types, workflow file on default branch
github.context variables: GITHUB_REF, GITHUB_SHA, github.head_ref, github.event
Min schedule interval: 5m
Globs: *, **, ?.json schema conforme
Avoid running untrusted code with pull_request_target
combine filters with AND logic on event properties

## Sanitised Extract
Table of Contents
1 Workflow triggers configuration
2 Event type filtering (types)
3 Branch and tag filters (branches, branches-ignore, tags, tags-ignore)
4 File path filters (paths, paths-ignore)
5 Scheduled workflows (schedule with cron)
6 repository_dispatch custom events
7 Conditional job execution based on github.event context

1 Workflow triggers configuration
  Syntax: on: <event>:
    <null|array|object>
  Default: runs on all supported activity types for events with types

2 Event type filtering (types)
  Key: types: [activityType1, activityType2]
  Behavior: limits workflow runs to specified activity types
  Example:
    on:
      check_run:
        types:
          - created
          - completed

3 Branch and tag filters (branches, branches-ignore, tags, tags-ignore)
  Keys: branches, branches-ignore, tags, tags-ignore: each an array of string patterns
  Patterns: glob syntax (wildcards *, **)
  Example:
    on:
      push:
        branches: ['main', 'releases/**']
        tags-ignore: ['v0.*']

4 File path filters (paths, paths-ignore)
  Keys: paths, paths-ignore: arrays of file path patterns
  Behavior: run workflow only when changes affect matching paths
  Example:
    on:
      pull_request:
        paths-ignore:
          - '**/*.md'

5 Scheduled workflows (schedule with cron)
  Key: schedule: array of objects { cron: '<cron expression>' }
  Cron syntax fields: minute(0-59) hour(0-23) day(1-31) month(1-12|JAN-DEC) day-of-week(0-6|SUN-SAT)
  Minimum interval: 5 minutes
  Example:
    on:
      schedule:
        - cron: '30 5,17 * * *'

6 repository_dispatch custom events
  Key: repository_dispatch: object
    types: [event_type_string]
    Limit: event_type max length 100 characters
    client_payload: custom data available at github.event.client_payload
  Example:
    on:
      repository_dispatch:
        types: ['test_result']

7 Conditional job execution based on github.event context
  Use if: expressions in job definitions
  Access event payload properties under github.event
  Example:
    jobs:
      run_if_failed:
        if: !github.event.client_payload.passed
        runs-on: ubuntu-latest
        steps:
          - run: echo 'Test failed: ${{ github.event.client_payload.message }}'

## Original Source
GitHub Actions workflow_call Event
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call

## Digest of WORKFLOW_TRIGGERS

# Workflow triggers syntax

Use the on key in your workflow file to specify events that cause the workflow to run. Each event key can map to:
- null (runs on default activity types)
- array of event names (shorthand)
- object with filters

# Filter keywords and their types

- types: array of activity types supported by the event
- branches: array of branch name patterns to include
- branches-ignore: array of branch name patterns to exclude
- tags: array of tag name patterns to include
- tags-ignore: array of tag name patterns to exclude
- paths: array of file path patterns to include
- paths-ignore: array of file path patterns to exclude
- schedule: array of objects with cron: string
- repository_dispatch: types: array of custom event_type strings

# Examples

Trigger on push to main or any releases/* branch, limited to .js files:
```yaml
on:
  push:
    branches:
      - main
      - 'releases/**'
    paths:
      - '**/*.js'
```

Trigger on check_run rerequested or completed:
```yaml
on:
  check_run:
    types:
      - rerequested
      - completed
```

Trigger on repository_dispatch with event_type "test_result":
```yaml
on:
  repository_dispatch:
    types: [test_result]
```

Trigger on schedule at 30 minutes past 5 and 17 UTC daily:
```yaml
on:
  schedule:
    - cron: '30 5,17 * * *'
```

# Conditional job execution

Use if conditions with github.event context to run jobs based on event payload:
```yaml
jobs:
  pr_comment:
    if: github.event.issue.pull_request
    runs-on: ubuntu-latest
    steps:
      - run: echo "PR comment on issue number ${{ github.event.issue.number }}"
```

# Troubleshooting

- Verify workflow file is on default branch
- Ensure YAML syntax is valid (use yamllint)
- Check filter patterns for correct globs
- Use act CLI to simulate events: act -e event.json -W .github/workflows/my.yml
- View "Triggered by" field in Actions UI to confirm event source

Retrieved on: 2024-06-15
Source: GitHub Actions docs, "Events that trigger workflows"

## Attribution
- Source: GitHub Actions workflow_call Event
- URL: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T20:29:01.275Z
- Data Size: 761593 bytes
- Links Found: 11274

## Retrieved
2025-05-06
