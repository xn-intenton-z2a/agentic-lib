# WORKFLOW_EVENTS

## Crawl Summary
Event trigger block supports fields: types, branches, branches-ignore, paths, paths-ignore, tags, tags-ignore, schedule. Defaults: all activity types, default branch. Context: GITHUB_REF, GITHUB_SHA, github.event. Security: pull_request_target base context, fork restrictions, recursion prevention. Schedule cron POSIX syntax, 5-minute minimum, high-load delays.

## Normalised Extract
Table of Contents:
 1. Event Trigger Syntax
 2. Filter Options
 3. Context Variables
 4. Security Considerations
 5. Schedule Syntax

1. Event Trigger Syntax
 on: <event_name>:
   types: [created|edited|deleted|completed|published|rerequested...]
   branches: ['pattern/**']
   paths: ['**/*.js']
   tags: ['v1.*']
   schedule:
     - cron: '30 5 * * 1-5'

2. Filter Options
 types: list of supported activity types per event
 branches, branches-ignore: glob patterns, default branch if omitted
 paths, paths-ignore: glob patterns under repository
 tags, tags-ignore: tag glob patterns
 schedule: array of POSIX cron strings

3. Context Variables
 GITHUB_REF: ref or pull merge ref
 GITHUB_SHA: commit ID
 github.event.*: event payload properties
 github.head_ref, github.event.pull_request.merged, github.event.client_payload.*

4. Security Considerations
 pull_request_target: runs in base ref context, GITHUB_TOKEN RW, avoid untrusted code
 check_suite: ignore Actions-created suites
 Fork events: secrets masked, GITHUB_TOKEN read-only

5. Schedule Syntax
 Cron format: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-6)
 Operators: * , - /
 Minimum granularity: 5 minutes


## Supplementary Details
Default branch requirement: workflow file must be on default branch for triggers except push and create.  File existence: events won't fire if file not present.  Recursive prevention: check_suite event ignores runs created by Actions.  Forked repo: need to enable Actions, secrets not forwarded except GITHUB_TOKEN read-only.  pull_request_target: GITHUB_TOKEN default perms read/write unless overridden; caches share base scope; avoid building head code.  schedule: scheduled disabled after 60 days inactivity; actor user must be active; cron change reactivates workflow.

## Reference Details
Event names and filters:
  branch_protection_rule: types=[created,edited,deleted]
  check_run: types=[created,rerequested,completed,requested_action]
  check_suite: types=[completed]
  create,delete: no types
  deployment, deployment_status: no types
  discussion: types=[created,edited,deleted,transferred,pinned,unlocked,locked,category_changed,answered,unanswered]
  discussion_comment: types=[created,edited,deleted]
  fork, gollum: no types
  issue_comment: types=[created,edited,deleted]
  issues: types=[opened,edited,deleted,transferred,pinned,unlocked,locked,closed,reopened,assigned,unassigned,labeled,unlabeled,milestoned,demilestoned,typed,untyped]
  label: types=[created,edited,deleted]
  merge_group: types=[checks_requested]
  milestone: types=[created,closed,opened,edited,deleted]
  page_build, public: no types
  pull_request: default types=[opened,reopened,synchronize], can specify others; filters: branches,paths
  pull_request_review: types=[submitted,edited,dismissed]
  pull_request_review_comment: types=[created,edited,deleted]
  pull_request_target: default types=[opened,reopened,synchronize], filters: branches,paths
  push: no types; filters: branches,branches-ignore,paths,paths-ignore,tags,tags-ignore
  registry_package: types=[published,updated]
  release: types=[published,unpublished,created,edited,deleted,prereleased,released]
  repository_dispatch: types=[<event_type>], client_payload max props=10, max size=65535 chars
  schedule: - cron: '<expression>'

Code Examples:
 on:
   pull_request:
     types: [opened,review_requested]
     branches: ['main','releases/**']
     paths: ['**.js']

 on:
   schedule:
     - cron: '30 5 * * 1-5'

Best Practices:
 Use explicit types to prevent unintended triggers.
 Combine branches and paths filters for precision.
 Use github.head_ref for head branch checks.
 Conditional steps with if: github.event.pull_request.merged.
 Avoid untrusted code in pull_request_target.

Troubleshooting:
 Command: gh api repos/:owner/:repo/actions/runs
 Expected: JSON list of runs for triggers on default branch.
 Check event payload: echo ${{ toJson(github.event) }}
 Verify workflow file on default branch: git ls-tree origin/main .github/workflows
 Fix missing secrets in forks: enable Actions in fork settings.
 Handle cron delays: adjust schedule offset from top of hour.


## Information Dense Extract
on:<event>:{types:[...],branches:[...],branches-ignore:[...],paths:[...],paths-ignore:[...],tags:[...],tags-ignore:[...],schedule:[cron:'m h d M W']}
context:GITHUB_REF,GITHUB_SHA,github.event.*,github.head_ref
security:pull_request_target base context RW token,no untrusted code;check_suite skip Actions;forks no secrets;schedule disabled after 60d inactivity,min interval 5m
events:branch_protection_rule(created,edited,deleted);check_run(created,rerequested,completed,requested_action);check_suite(completed);create;delete;deployment;deployment_status;discussion(...);discussion_comment(...);fork;gollum;issue_comment(...);issues(...);label(...);merge_group(checks_requested);milestone(...);page_build;public;pull_request(default:opened,reopened,synchronize);pull_request_review;pull_request_review_comment;pull_request_target(default);push;registry_package(published,updated);release(...);repository_dispatch(types,client_payload<=65535chars);schedule(cron)
filters:types(activity),branches(patterns),paths(patterns),tags(patterns)
examples:on:pull_request:types[opened],branches['main'];on:schedule:- cron'30 5 * * 1-5'


## Sanitised Extract
Table of Contents:
 1. Event Trigger Syntax
 2. Filter Options
 3. Context Variables
 4. Security Considerations
 5. Schedule Syntax

1. Event Trigger Syntax
 on: <event_name>:
   types: [created|edited|deleted|completed|published|rerequested...]
   branches: ['pattern/**']
   paths: ['**/*.js']
   tags: ['v1.*']
   schedule:
     - cron: '30 5 * * 1-5'

2. Filter Options
 types: list of supported activity types per event
 branches, branches-ignore: glob patterns, default branch if omitted
 paths, paths-ignore: glob patterns under repository
 tags, tags-ignore: tag glob patterns
 schedule: array of POSIX cron strings

3. Context Variables
 GITHUB_REF: ref or pull merge ref
 GITHUB_SHA: commit ID
 github.event.*: event payload properties
 github.head_ref, github.event.pull_request.merged, github.event.client_payload.*

4. Security Considerations
 pull_request_target: runs in base ref context, GITHUB_TOKEN RW, avoid untrusted code
 check_suite: ignore Actions-created suites
 Fork events: secrets masked, GITHUB_TOKEN read-only

5. Schedule Syntax
 Cron format: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-6)
 Operators: * , - /
 Minimum granularity: 5 minutes

## Original Source
GitHub Actions workflow_call Event
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call

## Digest of WORKFLOW_EVENTS

# Workflow Event Triggers

## Event Trigger Syntax
on:
  <event_name>:
    types: [<activity_types>]
    branches: [<branch_patterns>]
    branches-ignore: [<branch_patterns>]
    paths: [<file_path_patterns>]
    paths-ignore: [<file_path_patterns>]
    tags: [<tag_patterns>]
    tags-ignore: [<tag_patterns>]
    schedule:
      - cron: '<POSIX_cron_expression>'

## Default Conditions
- Workflow file must exist on default branch (unless overridden).
- Some events only trigger on default branch or specific refs.

## Context Variables
- GITHUB_REF: the Git ref or merge ref for the event.
- GITHUB_SHA: commit SHA for the event.
- github.event: JSON payload for the event.

## Security and Special Cases
- pull_request_target runs in base context with read/write GITHUB_TOKEN.
- check_suite doesn’t trigger on Actions-created suites to prevent recursion.
- Forked repo triggers: secrets not passed, GITHUB_TOKEN read-only.

## Schedule Event
- Cron fields: minute hour day month weekday.
- Minimum interval: 5 minutes.
- Scheduled workflows run on latest default branch commit.
- High load windows may delay or drop jobs.


## Attribution
- Source: GitHub Actions workflow_call Event
- URL: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T12:31:10.701Z
- Data Size: 915011 bytes
- Links Found: 15038

## Retrieved
2025-05-06
