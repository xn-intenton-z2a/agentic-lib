# WORKFLOW_EVENTS

## Crawl Summary
Detailed control of GitHub Actions workflow triggers via filter keywords types, branches, branches-ignore, paths, paths-ignore, tags, tags-ignore, conditional expressions using if and contexts, and scheduled cron events; examples for key events; default behaviors and constraints

## Normalised Extract
Table of Contents
1 types filter
2 branches and branches-ignore filter
3 paths and paths-ignore filter
4 tags and tags-ignore filter
5 conditional execution with if and contexts
6 schedule event triggers

1 types filter
Specify activity types for events with multiple actions.
Syntax:
 on:
   <event>:
     types: [actionA, actionB]
Supported events: branch_protection_rule, check_run, check_suite, discussion, issue_comment, issues, label, merge_group, milestone, pull_request, pull_request_review, pull_request_review_comment, pull_request_target, registry_package, release, repository_dispatch
Default: all actions

2 branches and branches-ignore filter
Restrict triggers to specific branches.
Syntax:
 on:
   <event>:
     branches: [pattern1, pattern2]
     branches-ignore: [pattern3]
Applies to GITHUB_REF or PR base branch
Example: push to main or releases/**

3 paths and paths-ignore filter
Restrict triggers when files matching globs change.
Syntax:
 on:
   <event>:
     paths: [**.js]
     paths-ignore: [docs/**]
Combined with branches yields intersection

4 tags and tags-ignore filter
Applicable to push events only.
Syntax:
 on:
   push:
     tags: [v1.*]
     tags-ignore: [v2-beta*]

5 conditional execution with if and contexts
Use if in jobs or steps with expressions.
Contexts: github.event.issue.pull_request, github.event.pull_request.merged, github.head_ref, github.event.client_payload
Example:
 if: github.event.client_payload.passed == false

6 schedule event triggers
Trigger via cron schedule.
Syntax:
 on:
   schedule:
     - cron: '30 5 * * 1,3'
Minimum interval: 5 minutes
Runs on default branch commit
Cron string must be quoted
High load may delay runs
Auto-disable after 60 days inactivity

## Supplementary Details
Filter Keywords and Effects
 types: restricts event actions; default all
 branches: branch name patterns; default any
 branches-ignore: negated branch patterns
 paths: file glob filters; default any
 paths-ignore: negated file patterns
 tags: push tag patterns; default any
 tags-ignore: negated tag patterns
 cron: POSIX minute hour day month weekday; numeric or names; operators *, ,, -, /
Contexts and Expressions
 github.ref: full ref for event
 github.sha: commit SHA for event
 github.head_ref: pull_request head branch
 github.event.pull_request.merged: boolean
 github.event.issue.pull_request: truthy for PR comments
 github.event.client_payload: custom data for repository_dispatch
Conditional Syntax
 Use if: expression at job or step level, e.g. if: startsWith(github.head_ref, 'releases/')

## Reference Details
Complete Examples and Patterns

1 Branch Protection Rule Event
on:
  branch_protection_rule:
    types: [created, edited, deleted]

2 Check Run Event with Filters
on:
  check_run:
    types: [rerequested, completed]

3 Pull Request Event Filtering
on:
  pull_request:
    types: [opened, reopened]
    branches: ['releases/**']
    paths: ['**.js']
jobs:
  build:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == false
    steps:
      - run: echo Building PR

4 Repository Dispatch Custom Trigger
on:
  repository_dispatch:
    types: [test_result]
jobs:
  report:
    runs-on: ubuntu-latest
    if: github.event.client_payload.passed == false
    steps:
      - run: echo ${{ github.event.client_payload.message }}

5 Scheduled Workflow
on:
  schedule:
    - cron: '30 5,17 * * *'
jobs:
  nightly:
    runs-on: ubuntu-latest
    steps:
      - run: echo Nightly job

Best Practices
 Always restrict types to minimize runs
 Combine branches and paths for precise triggers
 Use pull_request_target to label or comment securely, avoid checkout of untrusted code
 Quote cron expressions to prevent parsing errors
Troubleshooting
 Verify workflow file exists on default branch
 Use gh run list to confirm trigger
 Check workflow dispatch logs for event name and payload

## Information Dense Extract
types filter restricts event actions with list of activity names; branches and branches-ignore apply glob filters to branch names; paths and paths-ignore apply glob filters to changed files; tags and tags-ignore apply to push tags; cron syntax uses POSIX fields minute hour day month weekday, minimum interval 5 minutes, value names or numbers, operators *,,,,-,/; defaults trigger all branches and actions; combined filters use logical AND; contexts github.event.pull_request.merged, github.head_ref, github.event.client_payload support conditional expressions with if; schedule events must be quoted, may be delayed under high load, auto-disable after 60d inactivity

## Sanitised Extract
Table of Contents
1 types filter
2 branches and branches-ignore filter
3 paths and paths-ignore filter
4 tags and tags-ignore filter
5 conditional execution with if and contexts
6 schedule event triggers

1 types filter
Specify activity types for events with multiple actions.
Syntax:
 on:
   <event>:
     types: [actionA, actionB]
Supported events: branch_protection_rule, check_run, check_suite, discussion, issue_comment, issues, label, merge_group, milestone, pull_request, pull_request_review, pull_request_review_comment, pull_request_target, registry_package, release, repository_dispatch
Default: all actions

2 branches and branches-ignore filter
Restrict triggers to specific branches.
Syntax:
 on:
   <event>:
     branches: [pattern1, pattern2]
     branches-ignore: [pattern3]
Applies to GITHUB_REF or PR base branch
Example: push to main or releases/**

3 paths and paths-ignore filter
Restrict triggers when files matching globs change.
Syntax:
 on:
   <event>:
     paths: [**.js]
     paths-ignore: [docs/**]
Combined with branches yields intersection

4 tags and tags-ignore filter
Applicable to push events only.
Syntax:
 on:
   push:
     tags: [v1.*]
     tags-ignore: [v2-beta*]

5 conditional execution with if and contexts
Use if in jobs or steps with expressions.
Contexts: github.event.issue.pull_request, github.event.pull_request.merged, github.head_ref, github.event.client_payload
Example:
 if: github.event.client_payload.passed == false

6 schedule event triggers
Trigger via cron schedule.
Syntax:
 on:
   schedule:
     - cron: '30 5 * * 1,3'
Minimum interval: 5 minutes
Runs on default branch commit
Cron string must be quoted
High load may delay runs
Auto-disable after 60 days inactivity

## Original Source
GitHub Actions workflow_call Event
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call

## Digest of WORKFLOW_EVENTS

# GitHub Actions Events That Trigger Workflows
Date Retrieved: 2024-06-28
Source URL: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
Data Size: 1043963 bytes

# Filter Options
## types
Default: all activity types unless restricted

Syntax
 on:
   <event>:
     types: [activity1, activity2]

Example
 on:
   branch_protection_rule:
     types: [created, deleted]

## branches and branches-ignore
Default: trigger on all branches

Syntax
 on:
   <event>:
     branches: [pattern1, pattern2]
     branches-ignore: [pattern3]

Example
 on:
   push:
     branches: [main, releases/**]

## paths and paths-ignore
Default: trigger on any file path

Syntax
 on:
   <event>:
     paths: [glob1, glob2]
     paths-ignore: [glob3]

Example
 on:
   pull_request:
     paths: [**.js]

## tags and tags-ignore
Applicable to push events only

Syntax
 on:
   push:
     tags: [v1.*]
     tags-ignore: [v2-beta*]

## conditionals and contexts
Use if with contexts in jobs or steps

Available contexts: github.event.issue.pull_request, github.event.pull_request.merged, github.head_ref, github.event.client_payload

Example
 if: github.event.pull_request.merged == true

## schedule
Trigger workflows on a cron schedule

Syntax
 on:
   schedule:
     - cron: '30 5,17 * * *'

Constraints: minimum interval 5 minutes; cron must be quoted; high load may delay runs; auto-disable after 60 days of inactivity

## Attribution
- Source: GitHub Actions workflow_call Event
- URL: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_call
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T02:50:26.166Z
- Data Size: 1043963 bytes
- Links Found: 17342

## Retrieved
2025-05-06
