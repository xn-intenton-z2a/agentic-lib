sandbox/library/GITHUB_GRAPHQL.md
# sandbox/library/GITHUB_GRAPHQL.md
# GITHUB_GRAPHQL

## Crawl Summary
POST endpoint at api.github.com/graphql. Use Bearer token in Authorization, Accept header vnd.github.v4+json, JSON body with `query` and `variables`. Cursor pagination uses Connection args (`first`,`after`,`last`,`before`). Schema introspection via `__schema` query. Monitor rate limits via X-RateLimit headers. Inspect `errors` array for GraphQL errors.

## Normalised Extract
Table of Contents:
 1  Authentication
 2  HTTP Endpoint
 3  HTTP Headers
 4  Request Body Format
 5  Schema Introspection
 6  Cursor Pagination
 7  Rate Limits
 8  Error Handling

1  Authentication
  • Header: Authorization: bearer <TOKEN>
  • Format: token must include full PAT or GitHub App JWT

2  HTTP Endpoint
  • POST https://api.github.com/graphql
  • SSL/TLS enforcement

3  HTTP Headers
  • Accept: application/vnd.github.v4+json
  • Content-Type: application/json
  • Optional: User-Agent: custom-string

4  Request Body Format
  • JSON with fields:
      query: GraphQL operation string
      variables: object mapping variable names to values
  • Max payload size: 1MB

5  Schema Introspection
  • Query __schema for types, fields, directives
  • Use in development for building client types

6  Cursor Pagination
  • Connection arguments: first:Int, after:String, last:Int, before:String
  • Response fields:
      edges { cursor node { ... } }
      pageInfo { hasNextPage endCursor }
  • Loop using endCursor until hasNextPage=false

7  Rate Limits
  • Examine X-RateLimit-* headers on each response
  • Adjust query complexity or reduce frequency when Remaining low

8  Error Handling
  • Check HTTP status (200 OK even on GraphQL errors)
  • If `errors` array present, handle by:
      inspect message, path, locations
      retry on transient errors (502,503) up to 3 times


## Supplementary Details
1  Introspection Download
 • https://docs.github.com/public/schema.docs.graphql
2  Breaking Changes
 • Quarterly schedule on first day of quarter
 • Monitor /graphql/preview API for upcoming changes
3  Auth Scopes
 • repo, user, admin:org, workflow, read:discussion
4  Timeouts and Retries
 • Timeout 10s per request
 • Retry on 502, 503 with exponential backoff (initial 500ms, max 5s)
5  GraphQL Explorer
 • Run queries in-browser at https://docs.github.com/graphql/overview/explorer

## Reference Details
### Curl Invocation
```
curl -X POST https://api.github.com/graphql \
  -H "Authorization: bearer $TOKEN" \
  -H "Accept: application/vnd.github.v4+json" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query($owner:String!, $name:String!){ repository(owner:$owner,name:$name){ issues(first:100){ edges{ node{ number title } } pageInfo{ hasNextPage endCursor } } } }",
    "variables": {"owner":"octocat","name":"Hello-World"}
  }'
```
**Returns**: JSON { data:..., errors:... }

### Octokit GraphQL SDK

Method Signature:
```
import { graphql } from "@octokit/graphql";
async function fetchRepoIssues(owner:String, name:String, token:String) : Promise<{edges:[{cursor:String,node:{number:Int,title:String}}],pageInfo:{hasNextPage:Boolean,endCursor:String}}> {
  return await graphql(
    `query($owner:String!, $name:String!, $pageSize:Int!, $after:String) {
      repository(owner:$owner,name:$name) {
        issues(first:$pageSize, after:$after) {
          edges { cursor node { number title } }
          pageInfo { hasNextPage endCursor }
        }
      }
    }`,
    {
      owner,
      name,
      pageSize: 100,
      after: null,
      headers: { authorization: `bearer ${token}` }
    }
  );
}
```

### Best Practices
• Persisted Queries: register query hashes via GitHub API then call by `{

## Information Dense Extract
POST https://api.github.com/graphql; Headers: Authorization: bearer <token>, Accept:application/vnd.github.v4+json; Body:{query:string,variables:object}; Cursor pagination: first,after,last,before; Response: edges{cursor,node}, pageInfo{hasNextPage,endCursor}; Rate limit: X-RateLimit-Limit/Remaining/Reset; Introspection: __schema query; Error array: handle message/locations/path; Retries: 3 on 502/503; Timeout:10s; Octokit: graphql(query,variables:{},headers:{authorization}); Scopes: repo,user,admin:org; Breaking changes quarterly; Explorer at /graphql/explorer

## Sanitised Extract
Table of Contents:
 1  Authentication
 2  HTTP Endpoint
 3  HTTP Headers
 4  Request Body Format
 5  Schema Introspection
 6  Cursor Pagination
 7  Rate Limits
 8  Error Handling

1  Authentication
   Header: Authorization: bearer <TOKEN>
   Format: token must include full PAT or GitHub App JWT

2  HTTP Endpoint
   POST https://api.github.com/graphql
   SSL/TLS enforcement

3  HTTP Headers
   Accept: application/vnd.github.v4+json
   Content-Type: application/json
   Optional: User-Agent: custom-string

4  Request Body Format
   JSON with fields:
      query: GraphQL operation string
      variables: object mapping variable names to values
   Max payload size: 1MB

5  Schema Introspection
   Query __schema for types, fields, directives
   Use in development for building client types

6  Cursor Pagination
   Connection arguments: first:Int, after:String, last:Int, before:String
   Response fields:
      edges { cursor node { ... } }
      pageInfo { hasNextPage endCursor }
   Loop using endCursor until hasNextPage=false

7  Rate Limits
   Examine X-RateLimit-* headers on each response
   Adjust query complexity or reduce frequency when Remaining low

8  Error Handling
   Check HTTP status (200 OK even on GraphQL errors)
   If 'errors' array present, handle by:
      inspect message, path, locations
      retry on transient errors (502,503) up to 3 times

## Original Source
GitHub API
https://docs.github.com/en/graphql

## Digest of GITHUB_GRAPHQL

# Endpoint and Authentication

**HTTP Method**: POST
**URL**: https://api.github.com/graphql

## Required HTTP Headers

Authorization: bearer <YOUR_TOKEN>
Accept: application/vnd.github.v4+json
Content-Type: application/json

# Request Body

```
{
  "query": "<GraphQL query or mutation string>",
  "variables": { <key>: <value>, ... }
}
```

# GraphQL Schema Introspection

Execute via HTTP:
```
curl -X POST \
  -H "Authorization: bearer $TOKEN" \
  -H "Accept: application/vnd.github.v4+json" \
  -d '{"query":"{ __schema { queryType { name } mutationType { name } subscriptionType { name } types { name kind description fields { name } } } }"}' \
  https://api.github.com/graphql
```

# Pagination

Cursor-based pagination on any Connection type fields using `first`, `after`, `last`, `before` arguments. Example:
```
query GetIssues($owner: String!, $repo: String!, $pageSize: Int!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    issues(first: $pageSize, after: $cursor) {
      edges { cursor node { number title } }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

# Rate Limiting Headers

- X-RateLimit-Limit: total points allotted per hour
- X-RateLimit-Remaining: points remaining in current window
- X-RateLimit-Reset: UTC epoch seconds when limit resets

# Error Handling

On error, response includes `errors` array with objects:
- `message`: human-readable description
- `locations`: line/column within query
- `path`: response path where error occurred

# Date Retrieved

2024-06-01

## Attribution
- Source: GitHub API
- URL: https://docs.github.com/en/graphql
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T08:30:43.649Z
- Data Size: 2490883 bytes
- Links Found: 24405

## Retrieved
2025-05-06
sandbox/library/WORKFLOW_TRIGGERS.md
# sandbox/library/WORKFLOW_TRIGGERS.md
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
sandbox/library/WORKFLOW_EVENTS.md
# sandbox/library/WORKFLOW_EVENTS.md
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
sandbox/library/S3_SQS_BRIDGE.md
# sandbox/library/S3_SQS_BRIDGE.md
# S3_SQS_BRIDGE

## Crawl Summary
s3-sqs-bridge integrates S3 PUT event routing to SQS and Lambda with versioned replay and PostgreSQL upsert projection. Uses Node.js handler with signature exports.handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>. Configured via ENV vars: BUCKET_NAME, OBJECT_PREFIX, REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME, PROJECTIONS_TABLE_NAME, SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT; PG_CONNECTION_STRING, GITHUB_PROJECTIONS_TABLE, GITHUB_EVENT_QUEUE_URL; PG_MAX_RETRIES(3), PG_RETRY_DELAY_MS(1000), DEAD_LETTER_QUEUE_URL. Implements exponential backoff retry, Zod-based schema validation, in-memory metrics (totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents), Express endpoints (/metrics, /status) on METRICS_PORT(3000), STATUS_PORT(3000). CLI via npm scripts: start, healthcheck, replay, test and flags --source-projection, --replay-projection, --replay, --healthcheck, --metrics, --status-endpoint.

## Normalised Extract
Table of Contents:
1 Lambda Handler Interface
2 Environment Variables and Defaults
3 PostgreSQL Retry Configuration
4 In-Memory Metrics
5 CLI Operations

1 Lambda Handler Interface
  Signature
    exports.handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>
  Event Record Structure
    event.Records is array of { messageId:string, receiptHandle:string, body:string, messageAttributes:Record<string,any> }
  Returns
    { statusCode:200 } on success

2 Environment Variables and Defaults
  BUCKET_NAME           required            S3 bucket
  OBJECT_PREFIX         default ''         key prefix filter
  REPLAY_QUEUE_URL      required           SQS URL for replay
  DIGEST_QUEUE_URL      required           SQS URL for digest
  OFFSETS_TABLE_NAME    default 'offsets'   table for offsets
  PROJECTIONS_TABLE_NAME default 'projections' table for projections
  SOURCE_LAMBDA_FUNCTION_NAME required       Lambda function name
  AWS_ENDPOINT          optional           override AWS endpoint
  PG_CONNECTION_STRING  default 'postgres://user:pass@localhost:5432/db'
  GITHUB_PROJECTIONS_TABLE default 'github_event_projections'
  GITHUB_EVENT_QUEUE_URL default 'https://test/000000000000/github-event-queue-test'
  PG_MAX_RETRIES        default 3         max DB retries
  PG_RETRY_DELAY_MS     default 1000      ms between retries
  DEAD_LETTER_QUEUE_URL optional           SQS URL for DLQ
  METRICS_PORT          default 3000      HTTP metrics port
  STATUS_PORT           default 3000      HTTP status port

3 PostgreSQL Retry Configuration
  On connect/query failures do up to PG_MAX_RETRIES
  Delay between attempts = PG_RETRY_DELAY_MS ms (exponential backoff)

4 In-Memory Metrics
  Counters:
    totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents
  Access
    getMetrics(): { totalEvents:number, successfulEvents:number, skippedEvents:number, dbFailures:number, dbRetryCount:number, deadLetterEvents:number }

5 CLI Operations
  npm start             runs src/lib/main.js
  npm run healthcheck   starts HTTP /status on STATUS_PORT
  npm run replay        replays S3 versions
  npm test              runs unit tests
  Flags:
    --help
    --source-projection
    --replay-projection
    --replay
    --healthcheck
    --metrics
    --status-endpoint

## Supplementary Details
Deployment Steps:
1 Configure AWS credentials via AWS CLI: aws configure
2 Deploy CDK stack:
   cd aws/cdk
   npm install
   npx cdk deploy --profile your-profile
3 Grant Lambda IAM permissions: SQS ReceiveMessage, SQS DeleteMessage, S3 GetObject, S3 ListBucket, RDS/PostgreSQL connect
4 Set environment variables in Lambda console or via CDK context
5 Ensure network access: Lambda VPC with subnet and SG allowing egress to RDS
6 Verify PostgreSQL schema:
   CREATE TABLE github_event_projections ( id SERIAL PRIMARY KEY, event_id TEXT UNIQUE, payload JSONB, created_at TIMESTAMPTZ DEFAULT now() );
7 For local run, use LocalStack endpoint: AWS_ENDPOINT=http://localhost:4566

Logging and Masking:
Use built-in logger:
logger.info({ eventId, repository }, 'Processing event')
Mask sensitive fields:
logger.mask('requestMetadata.password')

## Reference Details
AWS.SQS.sendMessage
Signature:
  sendMessage(params: {
    QueueUrl: string;
    MessageBody: string;
    MessageAttributes?: Record<string,{ DataType:string; StringValue:string }>;
    DelaySeconds?: number;
  }): Promise<{ MessageId: string; MD5OfMessageBody: string }>
Example:
  await sqs.sendMessage({ QueueUrl: process.env.REPLAY_QUEUE_URL, MessageBody: JSON.stringify(payload) })

PostgreSQL Connection with retry:
```js
import { Client } from 'pg';
async function connectWithRetry() {
  let attempts = 0;
  while (attempts < Number(process.env.PG_MAX_RETRIES)) {
    try {
      const client = new Client({ connectionString: process.env.PG_CONNECTION_STRING });
      await client.connect();
      return client;
    } catch (err) {
      attempts++;
      await new Promise(r => setTimeout(r, Number(process.env.PG_RETRY_DELAY_MS) * Math.pow(2, attempts -1)));
    }
  }
  throw new Error('PostgreSQL connection failed after retries');
}
```

Zod Validation:
```js
import { z } from 'zod';
const EventSchema = z.object({
  action: z.string(),
  repository: z.object({ id: z.number(), full_name: z.string() }),
  sender: z.object({ id: z.number(), login: z.string() }),
});
const event = EventSchema.parse(JSON.parse(record.body));
```

Express Endpoints:
```js
import express from 'express';
const app = express();
app.get('/metrics', (req,res) => res.json(getMetrics()));
app.get('/status', (req,res) => res.sendStatus(200));
app.listen(process.env.STATUS_PORT);
```

Best Practices:
- Validate input with Zod before DB operations
- Mask sensitive fields in logs
- Use exponential backoff for DB retries
- Route failed records to DLQ after retries

Troubleshooting:
1 View Lambda logs:
   aws logs tail /aws/lambda/SOURCE_LAMBDA_FUNCTION_NAME --follow
2 Test local handler:
   node -e "require('./src/lib/main').handler({ Records: [] }, {})"
   Expect { statusCode:200 }
3 Check SQS queue:
   aws sqs get-queue-attributes --queue-url REPLAY_QUEUE_URL --attribute-names ApproximateNumberOfMessages
4 Validate PostgreSQL connectivity:
   psql process.env.PG_CONNECTION_STRING -c '\dt'


## Information Dense Extract
handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>
Env vars:BUCKET_NAME(required),OBJECT_PREFIX(default ''),REPLAY_QUEUE_URL, DIGEST_QUEUE_URL, OFFSETS_TABLE_NAME(default 'offsets'), PROJECTIONS_TABLE_NAME(default 'projections'), SOURCE_LAMBDA_FUNCTION_NAME, AWS_ENDPOINT, PG_CONNECTION_STRING(default 'postgres://user:pass@localhost:5432/db'), GITHUB_PROJECTIONS_TABLE(default 'github_event_projections'), GITHUB_EVENT_QUEUE_URL(default 'https://test/000000000000/github-event-queue-test'), PG_MAX_RETRIES(default 3), PG_RETRY_DELAY_MS(default 1000), DEAD_LETTER_QUEUE_URL, METRICS_PORT(default 3000), STATUS_PORT(default 3000)
Retry: exponential backoff, max attempts PG_MAX_RETRIES, base delay PG_RETRY_DELAY_MS
Metrics:getMetrics():{ totalEvents,successfulEvents,skippedEvents,dbFailures,dbRetryCount,deadLetterEvents }
AWS.SQS.sendMessage({QueueUrl,MessageBody,MessageAttributes?,DelaySeconds?}):Promise<{MessageId,MD5OfMessageBody}>
connectWithRetry():Client or throw
Zod schema: EventSchema.parse(JSON.parse(body))
CLI:npm start, npm run healthcheck, npm run replay, npm test; flags --source-projection,--replay-projection,--replay,--healthcheck,--metrics,--status-endpoint
Express endpoints: /metrics and /status on ports METRICS_PORT and STATUS_PORT
Troubleshoot: aws logs tail, psql -c '\dt', aws sqs get-queue-attributes

## Sanitised Extract
Table of Contents:
1 Lambda Handler Interface
2 Environment Variables and Defaults
3 PostgreSQL Retry Configuration
4 In-Memory Metrics
5 CLI Operations

1 Lambda Handler Interface
  Signature
    exports.handler(event:SQSEvent,context:Context):Promise<{statusCode:200}>
  Event Record Structure
    event.Records is array of { messageId:string, receiptHandle:string, body:string, messageAttributes:Record<string,any> }
  Returns
    { statusCode:200 } on success

2 Environment Variables and Defaults
  BUCKET_NAME           required            S3 bucket
  OBJECT_PREFIX         default ''         key prefix filter
  REPLAY_QUEUE_URL      required           SQS URL for replay
  DIGEST_QUEUE_URL      required           SQS URL for digest
  OFFSETS_TABLE_NAME    default 'offsets'   table for offsets
  PROJECTIONS_TABLE_NAME default 'projections' table for projections
  SOURCE_LAMBDA_FUNCTION_NAME required       Lambda function name
  AWS_ENDPOINT          optional           override AWS endpoint
  PG_CONNECTION_STRING  default 'postgres://user:pass@localhost:5432/db'
  GITHUB_PROJECTIONS_TABLE default 'github_event_projections'
  GITHUB_EVENT_QUEUE_URL default 'https://test/000000000000/github-event-queue-test'
  PG_MAX_RETRIES        default 3         max DB retries
  PG_RETRY_DELAY_MS     default 1000      ms between retries
  DEAD_LETTER_QUEUE_URL optional           SQS URL for DLQ
  METRICS_PORT          default 3000      HTTP metrics port
  STATUS_PORT           default 3000      HTTP status port

3 PostgreSQL Retry Configuration
  On connect/query failures do up to PG_MAX_RETRIES
  Delay between attempts = PG_RETRY_DELAY_MS ms (exponential backoff)

4 In-Memory Metrics
  Counters:
    totalEvents, successfulEvents, skippedEvents, dbFailures, dbRetryCount, deadLetterEvents
  Access
    getMetrics(): { totalEvents:number, successfulEvents:number, skippedEvents:number, dbFailures:number, dbRetryCount:number, deadLetterEvents:number }

5 CLI Operations
  npm start             runs src/lib/main.js
  npm run healthcheck   starts HTTP /status on STATUS_PORT
  npm run replay        replays S3 versions
  npm test              runs unit tests
  Flags:
    --help
    --source-projection
    --replay-projection
    --replay
    --healthcheck
    --metrics
    --status-endpoint

## Original Source
S3-SQS Bridge Middleware
https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme

## Digest of S3_SQS_BRIDGE

# S3-SQS Bridge Middleware Detailed Digest
Retrieved on 2024-06-03
Data Size: 565681 bytes

## Architecture Overview

s3-sqs-bridge connects Amazon S3 PUT events to AWS SQS with versioned replay support and real-time processing via AWS Lambda and PostgreSQL:

- AWS S3 bucket with event notification to SQS (standard queue or FIFO).
- AWS SQS queue forwarding to Lambda handler.
- Lambda (Node.js) processes SQSEvent (github event payloads).
- PostgreSQL projection table for upserts with retry and exponential backoff.
- In-memory metrics and Express HTTP endpoints for /metrics and /status.
- Optional Dead-Letter Queue routing on failure.

## Lambda Handler Signature

```js
// src/lib/main.js
exports.handler = async function(event, context) {
  // event: { Records: Array<{ body: string; messageAttributes: Record<string, any>; }> }
  // context: AWS Lambda Context object
  // returns: Promise<{ statusCode: 200 }>
}
```

## Configuration Variables

Environment variables and defaults:

BUCKET_NAME               (required)          S3 bucket name
OBJECT_PREFIX             (default empty)     S3 key prefix filter
REPLAY_QUEUE_URL          (required)          SQS URL for replay operations
DIGEST_QUEUE_URL          (required)          SQS URL for digest operations
OFFSETS_TABLE_NAME        (default: offsets)  DynamoDB/PostgreSQL offsets table
PROJECTIONS_TABLE_NAME    (default: projections) PostgreSQL projections table
SOURCE_LAMBDA_FUNCTION_NAME (required)        Name of source Lambda
AWS_ENDPOINT              (optional)          Custom AWS endpoint

PostgreSQL:
PG_CONNECTION_STRING      (default: postgres://user:pass@localhost:5432/db)
GITHUB_PROJECTIONS_TABLE  (default: github_event_projections)
GITHUB_EVENT_QUEUE_URL    (default: https://test/000000000000/github-event-queue-test)

Retry:
PG_MAX_RETRIES            (default: 3)
PG_RETRY_DELAY_MS         (default: 1000)

Dead-Letter:
DEAD_LETTER_QUEUE_URL     (optional)

Metrics HTTP ports:
METRICS_PORT              (default: 3000)
STATUS_PORT               (default: 3000)

## Retry Logic

- Exponential backoff on PostgreSQL connect/query:
  - Retries: PG_MAX_RETRIES
  - Delay: PG_RETRY_DELAY_MS ms

## Metrics Collection

In-memory counters:
- totalEvents
- successfulEvents
- skippedEvents
- dbFailures
- dbRetryCount
- deadLetterEvents

Interface:
```js
const metrics = getMetrics()
// returns { totalEvents: number, successfulEvents: number, skippedEvents: number, dbFailures: number, dbRetryCount: number, deadLetterEvents: number }
```

## CLI Commands

npm scripts and CLI flags:

- npm start                  Run Lambda handler (src/lib/main.js)
- npm run healthcheck         Start /status server on STATUS_PORT
- npm run replay              Replay S3 versions
- npm test                    Run Vitest tests

Flags:
--help
--source-projection
--replay-projection
--replay
--healthcheck
--metrics
--status-endpoint

## Attribution
- Source: S3-SQS Bridge Middleware
- URL: https://github.com/xn-intenton-z2a/s3-sqs-bridge#readme
- License: License: MIT
- Crawl Date: 2025-05-06T22:27:59.380Z
- Data Size: 565681 bytes
- Links Found: 4731

## Retrieved
2025-05-06
sandbox/library/URL_UTILS.md
# sandbox/library/URL_UTILS.md
# URL_UTILS

## Crawl Summary
fileURLToPath(url, options.windows?) => string absolute path with percent-decoding and platform rules. pathToFileURL(path, options.windows?) => URL with percent-encoding. url.format(URL, options.{auth,true;fragment,true;search,true;unicode,false}) => string. urlToHttpOptions(URL) => http.request options object. new URL(input[,base]) => WHATWG URL with getters/setters for protocol,username,password,host,hostname,port,pathname,search,hash; static methods createObjectURL, revokeObjectURL, canParse, parse. URLSearchParams constructors from string,obj,iterable; methods append,delete,entries,forEach,get,getAll,has,keys,set,size,sort,toString,values,iterator. domainToASCII/Unicode conversions. URLPattern.experimental with ctor(input[,baseURL,options.ignoreCase]) exec/test. Legacy url.parse(urlString[,parseQueryString,slashesDenoteHost]), format, resolve, UrlObject props auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes

## Normalised Extract
Table of Contents
 1 WHATWG URL Class
 2 URLSearchParams
 3 File and Path URL Conversions
 4 URL Serialization
 5 HTTP Options Conversion
 6 Domain Encoding
 7 URLPattern (Experimental)
 8 Legacy URL API

1 WHATWG URL Class
Constructor: new URL(input: string|{toString()}, base?: string|{toString()})
 Properties (get/set):
  protocol: string (scheme plus colon)
  username: string (percent-encoded characters auto-encoded)
  password: string
  host: string (hostname:port)
  hostname: string
  port: string (0-65535 or empty string for default)
  pathname: string (percent-encoded invalid characters)
  search: string (?query)
  searchParams: URLSearchParams
  hash: string (#fragment)
  href: string (full URL string)
  origin: string (scheme://host)
 Methods:
  toString(): string identical to href
  toJSON(): string used by JSON.stringify
 Static:
  URL.createObjectURL(blob: Blob): string 'blob:nodedata:...'
  URL.revokeObjectURL(id: string): void
  URL.canParse(input: string, base?: string): boolean
  URL.parse(input: string, base?: string): URL|null

2 URLSearchParams
Constructors:
  new URLSearchParams()
  new URLSearchParams(string: string)
  new URLSearchParams(obj: Record<string,string|string[]>)
  new URLSearchParams(iterable: Iterable<[string,string]>)
Methods:
  append(name: string, value: string)
  delete(name: string, value?: string)
  get(name: string): string|null
  getAll(name: string): string[]
  has(name: string, value?: string): boolean
  set(name: string, value: string)
  sort(): void stable by name
  entries(): Iterator<[string,string]>
  keys(): Iterator<string>
  values(): Iterator<string>
  forEach(fn: (value,name,params)=>void, thisArg?)
  toString(): string percent-encoded query
  size: number
  [Symbol.iterator] same as entries

3 File and Path URL Conversions
fileURLToPath(url: URL|string, options?:{windows?:boolean}): string
  windows true=>Windows path, false=>POSIX, undefined=>system default
  decodes percent encodings, UNC paths
pathToFileURL(path: string, options?:{windows?:boolean}): URL
  resolves absolute path, percent-encodes reserved chars

4 URL Serialization
url.format(URL: URL, options?:{auth?:boolean=true, fragment?:boolean=true, search?:boolean=true, unicode?:boolean=false}): string

5 HTTP Options Conversion
urlToHttpOptions(url: URL): {protocol,hostname,hash,search,pathname,path,href,auth}

6 Domain Encoding
domainToASCII(domain: string): string Punycode or '' if invalid
domainToUnicode(domain: string): string Unicode or ''

7 URLPattern (Experimental)
new URLPattern(input: string|object, baseURL?:string, options?:{ignoreCase?:boolean})
exec(input: string|object, baseURL?): PatternResult|null
test(input: string|object, baseURL?): boolean

8 Legacy URL API
parse(urlString: string, parseQueryString?:boolean, slashesDenoteHost?:boolean): UrlObject
 UrlObject props: auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes
format(urlObject: UrlObject): string
resolve(from: string, to: string): string

## Supplementary Details
fileURLToPath and pathToFileURL options.windows default undefined (system). fileURLToPath ensures correct decoding: percent-encoded spaces and Unicode. Windows UNC: fileURLToPath('file://nas/foo.txt') => \\nas\foo.txt. pathToFileURL encodes # and % characters: '/foo#1' => file:///foo%231. url.format unicode:true outputs Unicode host e.g. '測試'. urlToHttpOptions includes original url.href, includes auth only if present. URL constructor base coercion attempts toString; invalid URL or base throws TypeError. URL.host setter ignores invalid values. URL.port setter: string->toString, leading digits accepted, out-of-range ignored. URLSearchParams.delete with optional value removes specific pair. size property added in v19.8.0. sort() uses stable sort. domainToASCII and domainToUnicode require valid domain per DNS rules. URL.canParse returns false if input relative and no base. URL.parse returns null on invalid. URLPattern ignoreCase:true for case-insensitive matching.

## Reference Details
## fileURLToPath
Signature:
import { fileURLToPath } from 'node:url'
function fileURLToPath(url: URL|string, options?: { windows?: boolean }): string
Throws TypeError on invalid URL. Example:
const path = fileURLToPath('file:///C:/path/to/file.txt') // 'C:\path\to\file.txt'

## pathToFileURL
Signature:
import { pathToFileURL } from 'node:url'
function pathToFileURL(path: string, options?: { windows?: boolean }): URL
Example:
const url = pathToFileURL('/var/log/app.log') // URL 'file:///var/log/app.log'

## url.format
Signature:
import { format } from 'node:url'
function format(URL: URL, options?: {
  auth?: boolean;      // default true
  fragment?: boolean;  // default true
  search?: boolean;    // default true
  unicode?: boolean;   // default false
}): string
Example:
const u = new URL('https://a:b@xn--g6w251d/?x=y#z')
format(u, { auth:false, fragment:false, unicode:true }) // 'https://測試/?x=y'

## urlToHttpOptions
Signature:
import { urlToHttpOptions } from 'node:url'
function urlToHttpOptions(url: URL): {
  protocol: string;
  hostname: string;
  hash: string;
  search: string;
  pathname: string;
  path: string;
  href: string;
  auth?: string;
}
Example:
urlToHttpOptions(new URL('https://user:pass@host:443/path?query#hash'))
// Returns object with protocol 'https:', hostname 'host', auth 'user:pass', path '/path?query', ...

## WHATWG URL
Constructor:
new URL(input: string|{toString()}, base?: string|{toString()}): URL
Throws TypeError if invalid. Usage ESM and CommonJS:
import { URL } from 'node:url'
const u1 = new URL('/foo', 'https://example.org/')
const u2 = new URL('https://example.org/')

Getters/Setters:
- protocol: 'https:'
- username, password: percent-encoded
- host: hostname:port
- hostname: without port
- port: '' or '0-65535'
- pathname: begins with '/'
- search: begins with '?'
- hash: begins with '#'
- href: full URL
- origin: read-only scheme://host
- searchParams: URLSearchParams instance

Static Methods:
URL.createObjectURL(blob: Blob): string // generates 'blob:nodedata:' URL
URL.revokeObjectURL(id: string): void
URL.canParse(input: string, base?: string): boolean
URL.parse(input: string, base?: string): URL|null

## URLSearchParams
Constructors and full method signatures as above. Duplicate keys allowed in iterable constructor. Error on invalid tuple length. get returns null if missing. delete(name,value) v20.2.0 supports optional value removal. size property v19.8.0.

## domainToASCII / domainToUnicode
import { domainToASCII, domainToUnicode } from 'node:url'
function domainToASCII(domain: string): string
function domainToUnicode(domain: string): string

## URLPattern (Experimental)
import { URLPattern } from 'node:url'
new URLPattern(input: string|object, baseURL?: string, options?: { ignoreCase?: boolean })
urlPattern.exec(input: string|object, baseURL?: string): PatternResult|null
urlPattern.test(input: string|object, baseURL?: string): boolean

## Legacy
import { parse, format as legacyFormat, resolve } from 'node:url'
parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject
UrlObject props: auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes
legacyFormat(urlObject: UrlObject): string
resolve(from: string, to: string): string

## Best Practices
- Validate URL.origin after construction when base may vary.
- Use URLSearchParams.sort() to normalize query order for caching.
- Prefer WHATWG API over legacy.
- Use fileURLToPath for ES modules __filename compatibility.

## Troubleshooting
Command: node -e "import { fileURLToPath } from 'node:url'; console.log(fileURLToPath('file:///tmp/foo%20bar'))"
Expected: /tmp/foo bar
If result incorrect, verify Node version >=10.12.0.

Command: node -e "import { format } from 'node:url'; console.log(format(new URL('https://測試'), { unicode:false }))"
Expected: https://xn--g6w251d/ 

Check URL.parse returning null on invalid: node -e "import { parse } from 'node:url'; console.log(parse('not a url', undefined))"
Expected: null

## Information Dense Extract
fileURLToPath(url,options.windows?):string; pathToFileURL(path,options.windows?):URL; format(URL,options.auth=true,fragment=true,search=true,unicode=false):string; urlToHttpOptions(URL):{protocol,hostname,hash,search,pathname,path,href,auth?}; new URL(input: string|{toString()},base?):URL protocol:string username:string password:string host:string hostname:string port:string pathname:string search:string hash:string href:string origin:string searchParams:URLSearchParams; URL.createObjectURL(blob):string; URL.revokeObjectURL(id):void; URL.canParse(input,base?):boolean; URL.parse(input,base?):URL|null; URLSearchParams():params; URLSearchParams(string|obj|iterable) methods append(name,value),delete(name,value?),get(name):string|null,getAll(name):string[],has(name,value?):boolean,set(name,value),sort(),entries(),keys(),values(),forEach(fn),toString(),size; domainToASCII(domain):string; domainToUnicode(domain):string; new URLPattern(input[,base,options.ignoreCase]):URLPattern; URLPattern.exec(input[,base]):PatternResult|null; URLPattern.test(input[,base]):boolean; legacy parse(urlString,parseQueryString?,slashesDenoteHost?):UrlObject; legacy format(urlObject):string; resolve(from,to):string UrlObject props auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes

## Sanitised Extract
Table of Contents
 1 WHATWG URL Class
 2 URLSearchParams
 3 File and Path URL Conversions
 4 URL Serialization
 5 HTTP Options Conversion
 6 Domain Encoding
 7 URLPattern (Experimental)
 8 Legacy URL API

1 WHATWG URL Class
Constructor: new URL(input: string|{toString()}, base?: string|{toString()})
 Properties (get/set):
  protocol: string (scheme plus colon)
  username: string (percent-encoded characters auto-encoded)
  password: string
  host: string (hostname:port)
  hostname: string
  port: string (0-65535 or empty string for default)
  pathname: string (percent-encoded invalid characters)
  search: string (?query)
  searchParams: URLSearchParams
  hash: string (#fragment)
  href: string (full URL string)
  origin: string (scheme://host)
 Methods:
  toString(): string identical to href
  toJSON(): string used by JSON.stringify
 Static:
  URL.createObjectURL(blob: Blob): string 'blob:nodedata:...'
  URL.revokeObjectURL(id: string): void
  URL.canParse(input: string, base?: string): boolean
  URL.parse(input: string, base?: string): URL|null

2 URLSearchParams
Constructors:
  new URLSearchParams()
  new URLSearchParams(string: string)
  new URLSearchParams(obj: Record<string,string|string[]>)
  new URLSearchParams(iterable: Iterable<[string,string]>)
Methods:
  append(name: string, value: string)
  delete(name: string, value?: string)
  get(name: string): string|null
  getAll(name: string): string[]
  has(name: string, value?: string): boolean
  set(name: string, value: string)
  sort(): void stable by name
  entries(): Iterator<[string,string]>
  keys(): Iterator<string>
  values(): Iterator<string>
  forEach(fn: (value,name,params)=>void, thisArg?)
  toString(): string percent-encoded query
  size: number
  [Symbol.iterator] same as entries

3 File and Path URL Conversions
fileURLToPath(url: URL|string, options?:{windows?:boolean}): string
  windows true=>Windows path, false=>POSIX, undefined=>system default
  decodes percent encodings, UNC paths
pathToFileURL(path: string, options?:{windows?:boolean}): URL
  resolves absolute path, percent-encodes reserved chars

4 URL Serialization
url.format(URL: URL, options?:{auth?:boolean=true, fragment?:boolean=true, search?:boolean=true, unicode?:boolean=false}): string

5 HTTP Options Conversion
urlToHttpOptions(url: URL): {protocol,hostname,hash,search,pathname,path,href,auth}

6 Domain Encoding
domainToASCII(domain: string): string Punycode or '' if invalid
domainToUnicode(domain: string): string Unicode or ''

7 URLPattern (Experimental)
new URLPattern(input: string|object, baseURL?:string, options?:{ignoreCase?:boolean})
exec(input: string|object, baseURL?): PatternResult|null
test(input: string|object, baseURL?): boolean

8 Legacy URL API
parse(urlString: string, parseQueryString?:boolean, slashesDenoteHost?:boolean): UrlObject
 UrlObject props: auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes
format(urlObject: UrlObject): string
resolve(from: string, to: string): string

## Original Source
Node.js ESM Utilities
https://nodejs.org/api/url.html#url_fileurltopath_url

## Digest of URL_UTILS

# URL Module Documentation
Date Retrieved: 2024-06-15
Data Size: 4238143 bytes

# fileURLToPath(url, options)
Signature
  fileURLToPath(url: URL | string, options?: { windows?: boolean }): string
Parameters
  url         A WHATWG File URL object or file URL string to convert.
  options     Object
    windows   true for returning Windows filepath, false for POSIX, undefined for system default.
Returns
  string      Fully-resolved, platform-specific absolute file path.
Behavior
  Decodes percent-encoded characters, resolves UNC and drive-letter paths on Windows.
Examples
  import { fileURLToPath } from 'node:url'
  const file = fileURLToPath(import.meta.url)
  // Windows: fileURLToPath('file:///C:/path/') => C:\path\
  // POSIX: fileURLToPath('file:///你好.txt') => /你好.txt

# pathToFileURL(path, options)
Signature
  pathToFileURL(path: string, options?: { windows?: boolean }): URL
Parameters
  path        A filesystem path to convert to a file URL.
  options     Object
    windows   true treats path as Windows, false for POSIX, undefined for system default.
Returns
  URL         A fully-encoded WHATWG File URL.
Behavior
  Resolves path absolutely, percent-encodes control characters and reserved URL chars.
Examples
  import { pathToFileURL } from 'node:url'
  pathToFileURL('/foo#1')      // file:///foo%231
  pathToFileURL(__filename)    // file:///... (absolute)

# url.format(URL, options)
Signature
  format(URL: URL, options?: { auth?: boolean, fragment?: boolean, search?: boolean, unicode?: boolean }): string
Parameters
  URL         A WHATWG URL instance.
  options     Object
    auth      Include username:password (default: true)
    fragment  Include hash fragment (default: true)
    search    Include search/query (default: true)
    unicode   Allow Unicode in host rather than Punycode (default: false)
Returns
  string      Serialized URL string with specified components.
Examples
  import { format } from 'node:url'
  format(myURL, { fragment:false, unicode:true, auth:false })

# urlToHttpOptions(url)
Signature
  urlToHttpOptions(url: URL): { protocol, hostname, hash, search, pathname, path, href, auth }
Parameters
  url         A WHATWG URL object.
Returns
  Object      Options for http.request/https.request APIs.
Examples
  import { urlToHttpOptions } from 'node:url'
  urlToHttpOptions(new URL('https://a:b@xn--g6w251d/?abc#foo'))

# WHATWG URL Class
Signature
  new URL(input: string | { toString(): string }, base?: string | { toString(): string }): URL
Properties (get/set)
  hash, host, hostname, href, origin, password, pathname, port, protocol, search, searchParams, username
Methods
  toString(): string
  toJSON(): string
Static Methods
  URL.createObjectURL(blob: Blob): string
  URL.revokeObjectURL(id: string): void
  URL.canParse(input: string, base?: string): boolean
  URL.parse(input: string, base?: string): URL | null
Examples
  new URL('/foo','https://example.org/')
  URL.canParse('/foo','https://example.org/')

# URLSearchParams Class
Constructors
  new URLSearchParams()
  new URLSearchParams(string: string)
  new URLSearchParams(obj: Record<string,string|string[]>)
  new URLSearchParams(iterable: Iterable<[string,string]>)
Methods
  append(name: string, value: string): void
  delete(name: string, value?: string): void
  entries(): Iterator<[string,string]>
  forEach(fn: (value,name,searchParams)=>void, thisArg?): void
  get(name: string): string | null
  getAll(name: string): string[]
  has(name: string, value?: string): boolean
  keys(): Iterator<string>
  set(name: string, value: string): void
  size: number
  sort(): void
  toString(): string
  values(): Iterator<string>
  [Symbol.iterator](): Iterator<[string,string>]

# domainToASCII(domain)
Signature
  domainToASCII(domain: string): string
Returns
  Punycode ASCII serialization or '' if invalid.

# domainToUnicode(domain)
Signature
  domainToUnicode(domain: string): string
Returns
  Unicode serialization or '' if invalid.

# URLPattern Class (Experimental)
Signature
  new URLPattern(input: string|object, baseURL?: string, options?: { ignoreCase?: boolean })
Methods
  exec(input: string|object, baseURL?: string): PatternResult | null
  test(input: string|object, baseURL?: string): boolean

# Legacy URL API
Functions
  parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject
  format(urlObject: UrlObject): string
  resolve(from: string, to: string): string
Properties on UrlObject
  auth, hash, host, hostname, href, path, pathname, port, protocol, query, search, slashes


## Attribution
- Source: Node.js ESM Utilities
- URL: https://nodejs.org/api/url.html#url_fileurltopath_url
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T14:28:57.661Z
- Data Size: 4238143 bytes
- Links Found: 3240

## Retrieved
2025-05-06
sandbox/library/WORKFLOW_CALL.md
# sandbox/library/WORKFLOW_CALL.md
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
sandbox/library/DOTENV.md
# sandbox/library/DOTENV.md
# DOTENV

## Crawl Summary
Installation commands for npm, yarn, bun. Early import patterns: require('dotenv').config() or import 'dotenv/config'. ConfigOptions defaults: path, encoding utf8, debug false, override false, processEnv process.env. Methods: config(options), parse(input, opt), populate(target, source, opt). .env syntax rules: key=val, empty values, comments, quoting, multiline, backticks. Troubleshooting with debug flag. Best practices on load order and override behavior.

## Normalised Extract
Table of Contents:
1. Installation
2. Initialization
3. Configuration Options
4. API Methods
5. .env File Syntax
6. Troubleshooting
7. Best Practices

1. Installation
  npm install dotenv --save
  yarn add dotenv
  bun add dotenv

2. Initialization
  CommonJS: require('dotenv').config()
  ESM: import 'dotenv/config'
  Preload: node -r dotenv/config script.js

3. Configuration Options
  path: string | string[] - default resolve(process.cwd(),'.env')
  encoding: string - default 'utf8'
  debug: boolean - default false
  override: boolean - default false
  processEnv: object - default process.env

4. API Methods
  config(options?: ConfigOptions): { parsed: Record<string,string>, error?: Error }
  parse(src: string|Buffer, opt?: { debug?: boolean }): Record<string,string>
  populate(target: object, source: Record<string,string>, opt?: { override?: boolean, debug?: boolean }): void

5. .env File Syntax
  KEY=VALUE            simple key/value
  EMPTY=              empty string
  # comment           ignored
  KEY=VAL #cmt        inline comment
  QUOTED="#value"    preserves #
  MULTI="a\n b"     preserves newline
  BACKTICK=`text`      backtick quoted

6. Troubleshooting
  enable debug: require('dotenv').config({ debug: true })
  missing variables: verify .env location and name

7. Best Practices
  Load before any module using process.env
  Use override to supersede existing env
  Combine multiple env files via path array

## Supplementary Details
ConfigOptions:
  path: resolve(process.cwd(),'.env') or override with custom path or array for multiple
  encoding: 'utf8' or custom 'latin1'
  debug: boolean – prints parse/populate logs to stderr
  override: boolean – if true last wins, else first wins or existing processEnv preserved
  processEnv: target object for variables (defaults to process.env)

PopulateOptions:
  override: boolean – if true overwrite target keys
  debug: boolean – log each assignment

ParseOptions:
  debug: boolean – log invalid lines

Supported .env characters:
  Alphanumeric, underscores, hyphens
  Single/double quotes, backticks
  \n sequences

Implementation Steps:
  1. Install package
  2. Create .env file at project root
  3. Call config() before imports
  4. Access process.env.VAR
  5. For parsing custom strings use parse()
  6. For advanced population use populate()


## Reference Details
// API Signatures

interface ConfigOptions {
  path?: string | string[]
  encoding?: string
  debug?: boolean
  override?: boolean
  processEnv?: NodeJS.ProcessEnv | any
}

interface DotenvConfigOutput {
  parsed?: Record<string,string>
  error?: Error
}

interface ParseOptions {
  debug?: boolean
}

interface PopulateOptions {
  override?: boolean
  debug?: boolean
}

// Methods

function config(options?: ConfigOptions): DotenvConfigOutput

function parse(src: string|Buffer, options?: ParseOptions): Record<string,string>

function populate(target: object, source: Record<string,string>, options?: PopulateOptions): void

// Code Examples

// Basic
const result = require('dotenv').config({ path:['.env.local','.env'], override:true })
if(result.error) throw result.error
console.log(result.parsed)

// Custom processEnv
const myEnv = {}
require('dotenv').config({ processEnv: myEnv })
console.log(myEnv.API_KEY)

// Parsing buffer
const dotenv = require('dotenv')
const buf = Buffer.from('FOO=bar')
const out = dotenv.parse(buf, { debug:false })
console.log(out.FOO)

// Populate example
const parsed = { HELLO:'world' }
dotenv.populate(process.env, parsed, { override:true, debug:true })

// ESM Usage Trap
// Correct usage
import 'dotenv/config'
import service from './service.js'

// Preload
// Debug and custom path
DOTENV_CONFIG_PATH=/etc/prod/.env DOTENV_CONFIG_DEBUG=true node -r dotenv/config start.js

// Webpack polyfill
npm install node-polyfill-webpack-plugin

// webpack.config.js snippet
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = {
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(process.env) })
  ]
}

// Troubleshooting Commands
// Verify load
node -r dotenv/config -e "console.log(process.env.MYVAR)"
// Debug output
node -r dotenv/config script.js dotenv_config_debug=true


## Information Dense Extract
Installation: npm install dotenv; yarn add dotenv; bun add dotenv. Initialization: require('dotenv').config(options?), import 'dotenv/config', preload with -r. ConfigOptions: path:string|array (default .env); encoding:string (utf8); debug:boolean(false); override:boolean(false); processEnv:object(process.env). Methods: config(opts?):{parsed, error?}; parse(string|Buffer, {debug?})=>Record<string,string>; populate(target,source,{override?,debug?})=>void. .env syntax: KEY=val; EMPTY=; #comment; KEY=val #cmt; quoted preserve whitespace/hash; "newline\n" expands newline; backticks support. Usage patterns: call config early; override to supplant existing env; combine multiple env files. Troubleshooting: config({debug:true}); verify .env path; inspect stderr parse logs. Best practices: load before imports; isolate custom processEnv; handle ESM import trap; use preload; polyfill front-end with node-polyfill-webpack-plugin; use definePlugin to inject process.env.

## Sanitised Extract
Table of Contents:
1. Installation
2. Initialization
3. Configuration Options
4. API Methods
5. .env File Syntax
6. Troubleshooting
7. Best Practices

1. Installation
  npm install dotenv --save
  yarn add dotenv
  bun add dotenv

2. Initialization
  CommonJS: require('dotenv').config()
  ESM: import 'dotenv/config'
  Preload: node -r dotenv/config script.js

3. Configuration Options
  path: string | string[] - default resolve(process.cwd(),'.env')
  encoding: string - default 'utf8'
  debug: boolean - default false
  override: boolean - default false
  processEnv: object - default process.env

4. API Methods
  config(options?: ConfigOptions): { parsed: Record<string,string>, error?: Error }
  parse(src: string|Buffer, opt?: { debug?: boolean }): Record<string,string>
  populate(target: object, source: Record<string,string>, opt?: { override?: boolean, debug?: boolean }): void

5. .env File Syntax
  KEY=VALUE            simple key/value
  EMPTY=              empty string
  # comment           ignored
  KEY=VAL #cmt        inline comment
  QUOTED='#value'    preserves #
  MULTI='a'n b'     preserves newline
  BACKTICK='text'      backtick quoted

6. Troubleshooting
  enable debug: require('dotenv').config({ debug: true })
  missing variables: verify .env location and name

7. Best Practices
  Load before any module using process.env
  Use override to supersede existing env
  Combine multiple env files via path array

## Original Source
dotenv – Environment variable loader
https://github.com/motdotla/dotenv

## Digest of DOTENV

# Dotenv Technical Digest

Date Retrieved: 2024-06-24
Source: motdotla/dotenv vX.Y.Z (master)

# Installation

npm install dotenv --save

yarn add dotenv

bun add dotenv

# Basic Usage

Require and configure as early as possible:

require('dotenv').config()

import 'dotenv/config'

# Configuration Options

Interface ConfigOptions:
  path: string | string[] | undefined        default: resolve(process.cwd(), '.env')
  encoding: string                           default: 'utf8'
  debug: boolean                             default: false
  override: boolean                          default: false
  processEnv: NodeJS.ProcessEnv | any        default: process.env

# Methods

## config(options?: ConfigOptions): DotenvConfigOutput
Loads .env files, merges into processEnv, returns { parsed, error? }.

## parse(input: string|Buffer, options?: ParseOptions): Record<string,string>
Parses content string or buffer, returns key/value map.

## populate(target: object, source: object, options?: PopulateOptions): void
Assigns parsed source into target per options override/debug.

# .env File Syntax Rules

BASIC=basic                   -> { BASIC: 'basic' }
EMPTY=                        -> { EMPTY: '' }
COMMENTS:
# comment                  skipped
KEY=value # inline comment  -> KEY: 'value'
Quoted values preserve whitespace and hashes:
SECRET_HASH="val#hash"   -> { SECRET_HASH: 'val#hash' }
Multiline in double quotes expands newlines:
MULTI="line1\nline2"    -> { MULTI: 'line1\nline2' }
Backticks supported:
BACKTICK=`a 'b' "c"`       -> { BACKTICK: "a 'b' \"c\"" }

# Troubleshooting

require('dotenv').config({ debug: true })
Ensure .env path is correct. Inspect console for parse errors.

# Best Practices

Load dotenv before any other import that uses process.env.
Use override flag to force update existing variables.
Use path array to combine multiple files in order.


## Attribution
- Source: dotenv – Environment variable loader
- URL: https://github.com/motdotla/dotenv
- License: License: BSD-2-Clause
- Crawl Date: 2025-05-06T01:59:40.120Z
- Data Size: 1058609 bytes
- Links Found: 6215

## Retrieved
2025-05-06
sandbox/library/LAMBDA_SQS.md
# sandbox/library/LAMBDA_SQS.md
# LAMBDA_SQS

## Crawl Summary
Lambda polls SQS in batches of up to 10 messages (BatchSize 1–10, default=10), with an optional batch window (MaximumBatchingWindowInSeconds 0–300, default=0). Messages remain hidden for the visibility timeout and are deleted on full-batch success. On errors, entire batch is retried. For partial failures, enable ReportBatchItemFailures or call DeleteMessage manually. Low-traffic queues with a batch window may wait up to 20 seconds before invocation. Ensure idempotent handlers. FIFO queues include SequenceNumber, MessageGroupId, MessageDeduplicationId attributes.

## Normalised Extract
Table of Contents
1 Polling Behavior
2 Batching Parameters
3 Error Handling and Idempotency
4 Partial Batch Failure Handling
5 Event Payload Structures

1 Polling Behavior
Lambda continuously polls the SQS queue. Default concurrency: up to 10 messages per poll. Visibility timeout on the queue determines message hiding period. Successful processing triggers automatic DeleteMessage for each record.

2 Batching Parameters
BatchSize: 1–10, default=10
MaximumBatchingWindowInSeconds: 0–300 seconds, default=0
Minimum wait on low traffic with batch window: 20 seconds
Invocation triggers: batch size reached OR batch window expired OR total payload size ≥ 6 MB.

3 Error Handling and Idempotency
Lambda retries entire batch on any error. Duplicate delivery at least once. Implement idempotent processing (dedupe on messageId or use messageAttributes).

4 Partial Batch Failure Handling
Enable ReportBatchItemFailures = true. Handler must return {batchItemFailures:[{itemIdentifier:messageId},…]}. Lambda deletes only succeeded messages.
Manual deletion: import AWS.SQS, call deleteMessage({QueueUrl, ReceiptHandle}) per record.

5 Event Payload Structures
Standard queue: Records[].attributes includes ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp
FIFO queue adds attributes: SequenceNumber, MessageGroupId, MessageDeduplicationId

## Supplementary Details
Region and Account: Function and queue must be in same AWS Region (cross-account supported with resource policy on queue).
FIFO Queue Naming: name must end with .fifo, dedupe scope: per MessageDeduplicationId or content-based deduplication.
Visibility Timeout: configure queue visibility timeout > function timeout to avoid duplicate processing mid-invoke.
IAM Permissions:
  lambda:CreateEventSourceMapping
  lambda:ListEventSourceMappings
  sqs:ReceiveMessage
  sqs:DeleteMessage
  sqs:GetQueueAttributes
Queue Redrive Policy: configure DeadLetterQueue with maxReceiveCount to handle poison messages.


## Reference Details
CreateEventSourceMapping API
Operation: lambda:CreateEventSourceMapping
Parameters:
  FunctionName (string, required)
  EventSourceArn (string, required)
  Enabled (boolean, default=true)
  BatchSize (integer, min=1, max=10, default=10)
  MaximumBatchingWindowInSeconds (integer, min=0, max=300, default=0)
  ReportBatchItemFailures (boolean, default=false)
  MaximumRetryAttempts (integer, default=2)
  ParallelizationFactor (integer, min=1, max=10, default=1)
Response fields:
  UUID (string)
  State (string)
  StateTransitionReason (string)

Example Node.js Handler with Partial Failures:
exports.handler = async event => {
  const failures = [];
  for (const record of event.Records) {
    try {
      await processRecord(record.body);
    } catch (err) {
      failures.push({itemIdentifier: record.messageId});
    }
  }
  return {batchItemFailures: failures};
};

AWS CLI Troubleshooting Commands:
aws lambda list-event-source-mappings --function-name my-function
aws logs tail /aws/lambda/my-function --since 1h
aws sqs get-queue-attributes --queue-url https://sqs.us-east-2.amazonaws.com/123456789012/my-queue --attribute-names VisibilityTimeout,ApproximateNumberOfMessages

Expected Outputs:
• list-event-source-mappings returns mapping UUID and configuration
• logs tail streams invocation logs and errors
• get-queue-attributes shows VisibilityTimeout matching > function timeout


## Information Dense Extract
Lambda-SQS: BatchSize=1–10 default=10; MaxBatchWindow=0–300s default=0; low-traffic min-wait=20s; invocation triggers: batch size reached OR window elapsed OR payload≥6MB; hidden message via visibility timeout; full-batch retry on error; enable ReportBatchItemFailures or manual DeleteMessage for partial success; idempotent handlers; standard payload fields: messageId, receiptHandle, body, attributes; FIFO adds SequenceNumber, MessageGroupId, MessageDeduplicationId; CreateEventSourceMapping CLI/SDK parameters: FunctionName, EventSourceArn, BatchSize, MaximumBatchingWindowInSeconds, ReportBatchItemFailures, Enabled; IAM: lambda:CreateEventSourceMapping, sqs:ReceiveMessage, DeleteMessage; use DLQ redrive policy; troubleshooting via aws lambda list-event-source-mappings, aws logs tail, aws sqs get-queue-attributes.

## Sanitised Extract
Table of Contents
1 Polling Behavior
2 Batching Parameters
3 Error Handling and Idempotency
4 Partial Batch Failure Handling
5 Event Payload Structures

1 Polling Behavior
Lambda continuously polls the SQS queue. Default concurrency: up to 10 messages per poll. Visibility timeout on the queue determines message hiding period. Successful processing triggers automatic DeleteMessage for each record.

2 Batching Parameters
BatchSize: 110, default=10
MaximumBatchingWindowInSeconds: 0300 seconds, default=0
Minimum wait on low traffic with batch window: 20 seconds
Invocation triggers: batch size reached OR batch window expired OR total payload size  6 MB.

3 Error Handling and Idempotency
Lambda retries entire batch on any error. Duplicate delivery at least once. Implement idempotent processing (dedupe on messageId or use messageAttributes).

4 Partial Batch Failure Handling
Enable ReportBatchItemFailures = true. Handler must return {batchItemFailures:[{itemIdentifier:messageId},]}. Lambda deletes only succeeded messages.
Manual deletion: import AWS.SQS, call deleteMessage({QueueUrl, ReceiptHandle}) per record.

5 Event Payload Structures
Standard queue: Records[].attributes includes ApproximateReceiveCount, SentTimestamp, SenderId, ApproximateFirstReceiveTimestamp
FIFO queue adds attributes: SequenceNumber, MessageGroupId, MessageDeduplicationId

## Original Source
AWS Lambda & SQS Integration
https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html

## Digest of LAMBDA_SQS

# Polling and Batching Behavior

Lambda polls the configured SQS queue up to 10 messages at once (BatchSize default=10) and invokes the function synchronously. Messages are hidden for the duration of the queue’s visibility timeout. If the function succeeds for all records, Lambda issues DeleteMessage on each receiptHandle. On any error, all batch messages reappear when the visibility timeout expires. Configure idempotent code or ReportBatchItemFailures to handle partial failures.

# Event Payload Examples

## Standard Queue Message Event

{
  "Records": [
    {
      "messageId": "059f36b4-...",
      "receiptHandle": "AQEBwJnKyr...",
      "body": "Test message.",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1545082649183",
        "SenderId": "AIDAIENQZJOLO23YVJ4VO",
        "ApproximateFirstReceiveTimestamp": "1545082649185"
      },
      "messageAttributes": {
        "myAttribute": {"stringValue": "myValue","dataType": "String"}
      },
      "md5OfBody": "e4e68fb7bd...",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:my-queue",
      "awsRegion": "us-east-2"
    }
  ]
}

## FIFO Queue Message Event

{
  "Records": [
    {
      "messageId": "11d6ee51-...",
      "receiptHandle": "AQEBBX8nes...",
      "body": "Test message.",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1573251510774",
        "SequenceNumber": "18849496460467696128",
        "MessageGroupId": "1",
        "MessageDeduplicationId": "1"
      },
      "messageAttributes": {},
      "md5OfBody": "e4e68fb7bd...",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-2:123456789012:fifo.fifo",
      "awsRegion": "us-east-2"
    }
  ]
}

# Configuration Parameters

- BatchSize (integer): minimum=1, maximum=10, default=10
- MaximumBatchingWindowInSeconds (integer): 0–300, default=0
- ReportBatchItemFailures (boolean): false
- Enabled (boolean): true

# CLI Example

aws lambda create-event-source-mapping  \
  --function-name my-function  \
  --event-source-arn arn:aws:sqs:us-east-2:123456789012:my-queue  \
  --batch-size 10  \
  --maximum-batching-window-in-seconds 60  \
  --report-batch-item-failures

# SDK v3 Example (TypeScript)

import {LambdaClient, CreateEventSourceMappingCommand} from "@aws-sdk/client-lambda";
const client = new LambdaClient({region: "us-east-2"});
const command = new CreateEventSourceMappingCommand({
  FunctionName: "my-function",
  EventSourceArn: "arn:aws:sqs:us-east-2:123456789012:my-queue",
  BatchSize: 10,
  MaximumBatchingWindowInSeconds: 60,
  ReportBatchItemFailures: true
});
const response = await client.send(command);


## Attribution
- Source: AWS Lambda & SQS Integration
- URL: https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
- License: License: Public Domain (AWS documentation)
- Crawl Date: 2025-05-06T06:30:48.331Z
- Data Size: 1269184 bytes
- Links Found: 3144

## Retrieved
2025-05-06
sandbox/library/FILEURL_UTILS.md
# sandbox/library/FILEURL_UTILS.md
# FILEURL_UTILS

## Crawl Summary
fileURLToPath(url, options) converts file URL to absolute path, decodes percent-encoding, options.windows toggles Windows/POSIX behavior. pathToFileURL(path, options) converts absolute path to file:// URL object, percent-encodes reserved characters, options.windows toggles path interpretation. urlToHttpOptions(url) maps WHATWG URL to http.request() options: protocol, hostname, hash, search, pathname, path, href, auth, plus enumerable properties.

## Normalised Extract
Table of Contents
1. fileURLToPath
2. pathToFileURL
3. urlToHttpOptions

1. fileURLToPath
Signature: fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
Parameters: url - file URL string or URL object; options.windows - true for Windows output, false for POSIX, undefined system default
Returns: platform-specific absolute path string
Behavior: resolves percent-encoding, converts network paths to \\server\share on Windows

2. pathToFileURL
Signature: pathToFileURL(path: string, options?: {windows?: boolean}): URL
Parameters: path - file system path; options.windows - true to treat input as Windows path, false POSIX, undefined system default
Returns: WHATWG URL object with file:// scheme
Behavior: ensures absolute resolution, percent-encodes control and reserved chars

3. urlToHttpOptions
Signature: urlToHttpOptions(url: URL): Object
Parameters: url - WHATWG URL object
Returns: Options object for HTTP(S) requests
Properties: protocol, hostname (punycode), hash, search, pathname, path (pathname+search), href, auth (user:pass), plus own enumerable URL props

## Supplementary Details
Import patterns:
import { fileURLToPath, pathToFileURL, urlToHttpOptions } from 'node:url';

Implementation steps for fileURLToPath:
1. Ensure url argument is a valid WHATWG URL or file URL string
2. Call fileURLToPath with optional windows flag
3. Use result directly in fs operations

Implementation steps for pathToFileURL:
1. Provide absolute or relative path
2. Call pathToFileURL, optionally specifying windows flag
3. Use returned URL in APIs expecting URL

Implementation steps for urlToHttpOptions:
1. Construct or receive URL object
2. Call urlToHttpOptions(url)
3. Destructure needed fields: protocol, hostname, path, headers

Configuration options:
windows: boolean | undefined; default undefined uses process.platform

Errors thrown:
fileURLToPath: TypeError if input URL is not file URL or invalid
pathToFileURL: none
urlToHttpOptions: none

## Reference Details
Function: fileURLToPath
Signature: fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
Throws: TypeError for non-file URL or invalid URL
Examples:
import { fileURLToPath } from 'node:url';
const p1 = fileURLToPath('file:///C:/test%20dir/file.txt'); // 'C:\test dir\file.txt'
const p2 = fileURLToPath(new URL('file:///home/user/foo')); // '/home/user/foo'
Best practice: wrap in try/catch to handle malformed URLs.
Troubleshooting:
> node -e "const {fileURLToPath} = require('node:url'); console.log(fileURLToPath('http://example.com'))"
TypeError: The URL must be of scheme file but got 'http:'

Function: pathToFileURL
Signature: pathToFileURL(path: string, options?: {windows?: boolean}): URL
Returns: WHATWG URL object
Examples:
import { pathToFileURL } from 'node:url';
const u1 = pathToFileURL('/usr/local/bin'); // file:///usr/local/bin
const u2 = pathToFileURL('C:\Projects\app.js'); // file:///C:/Projects/app.js
Best practice: always absolute path; use path.resolve when uncertain.

Function: urlToHttpOptions
Signature: urlToHttpOptions(url: URL): HttpOptions
HttpOptions fields: protocol:string, hostname:string, hash:string, search:string, pathname:string, path:string, href:string, auth?:string
Examples:
import { urlToHttpOptions } from 'node:url';
const opts = urlToHttpOptions(new URL('https://user:pass@example.com:8080/path?x=1#y'));
// opts: {
//   protocol: 'https:',
//   hostname: 'example.com',
//   hash: '#y',
//   search: '?x=1',
//   pathname: '/path',
//   path: '/path?x=1',
//   href: 'https://user:pass@example.com:8080/path?x=1#y',
//   auth: 'user:pass'
// }
Best practice: pass options to https.request directly: https.request(urlToHttpOptions(url));
Troubleshooting:
Missing auth header: ensure URL includes credentials before calling urlToHttpOptions.


## Information Dense Extract
fileURLToPath(url,options)→string; decodes % chars, handles UNC on windows; throws TypeError for non-file URLs. pathToFileURL(path,options)→URL; percent-encodes reserved chars, resolves absolute path. urlToHttpOptions(url)→{protocol,hostname,hash,search,pathname,path,href,auth,...}; map URL to http request options.

## Sanitised Extract
Table of Contents
1. fileURLToPath
2. pathToFileURL
3. urlToHttpOptions

1. fileURLToPath
Signature: fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
Parameters: url - file URL string or URL object; options.windows - true for Windows output, false for POSIX, undefined system default
Returns: platform-specific absolute path string
Behavior: resolves percent-encoding, converts network paths to ''server'share on Windows

2. pathToFileURL
Signature: pathToFileURL(path: string, options?: {windows?: boolean}): URL
Parameters: path - file system path; options.windows - true to treat input as Windows path, false POSIX, undefined system default
Returns: WHATWG URL object with file:// scheme
Behavior: ensures absolute resolution, percent-encodes control and reserved chars

3. urlToHttpOptions
Signature: urlToHttpOptions(url: URL): Object
Parameters: url - WHATWG URL object
Returns: Options object for HTTP(S) requests
Properties: protocol, hostname (punycode), hash, search, pathname, path (pathname+search), href, auth (user:pass), plus own enumerable URL props

## Original Source
Node.js ESM Utilities
https://nodejs.org/api/url.html#url_fileurltopath_url

## Digest of FILEURL_UTILS

# Node.js URL File Utilities (retrieved 2024-06-20)

Source: Node.js v23.11.0 documentation (Data Size: 4394530 bytes, Links: 5381)

## url.fileURLToPath(url, options)

Signature:

    fileURLToPath(url: string | URL, options?: { windows?: boolean }): string

Parameters:

- url: A file URL string or WHATWG URL object.
- options.windows: true to return a Windows filepath, false for POSIX, undefined for system default.

Returns:

- Fully-resolved platform-specific absolute file path string.

Behavior:

- Decodes percent-encoded characters.
- On Windows: prefixes network paths with \\\\ for UNC shares.

Examples:

    import { fileURLToPath } from 'node:url';

    // Windows output: C:\path\
    fileURLToPath('file:///C:/path/');

    // POSIX output: /你好.txt
    fileURLToPath('file:///你好.txt');


## url.pathToFileURL(path, options)

Signature:

    pathToFileURL(path: string, options?: { windows?: boolean }): URL

Parameters:

- path: File system path string.
- options.windows: true if path is Windows, false for POSIX, undefined system default.

Returns:

- A WHATWG URL object with file:// scheme.

Behavior:

- Resolves path absolutely.
- Encodes control and reserved characters with percent-encoding.

Examples:

    import { pathToFileURL } from 'node:url';

    // Correct POSIX: file:///foo%231
    pathToFileURL('/foo#1');

    // Correct Windows: file:///C:/path/%25file.c
    pathToFileURL('C:\path\%file.c');


## url.urlToHttpOptions(url)

Signature:

    urlToHttpOptions(url: URL): {
      protocol: string;
      hostname: string;
      hash: string;
      search: string;
      pathname: string;
      path: string;
      href: string;
      auth?: string;
      [key: string]: any;
    }

Parameters:

- url: A WHATWG URL object.

Returns:

- Options object for http.request() and https.request().

Fields:

- protocol: e.g. 'https:'
- hostname: punycode-encoded host
- hash: fragment
- search: serialized query
- pathname: path
- path: pathname + search
- href: full URL string
- auth: 'user:pass' if credentials present
- includes other enumerable properties of URL object

Example:

    import { urlToHttpOptions } from 'node:url';
    const opts = urlToHttpOptions(new URL('https://a:b@測試?x=1#z'));
    // opts.protocol --> 'https:'
    // opts.auth --> 'a:b'



## Attribution
- Source: Node.js ESM Utilities
- URL: https://nodejs.org/api/url.html#url_fileurltopath_url
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T10:29:37.638Z
- Data Size: 4394530 bytes
- Links Found: 5381

## Retrieved
2025-05-06
sandbox/library/VITEST_MOCKING.md
# sandbox/library/VITEST_MOCKING.md
# VITEST_MOCKING

## Crawl Summary
vitest mocking: vi.useFakeTimers/useRealTimers/setSystemTime; vi.fn and vi.spyOn APIs with mockImplementation, mockReturnValue, clearAllMocks, restoreAllMocks; vi.stubGlobal; module mocking via vi.mock with factory; class mocking via vi.fn on constructor, prototype, static; memfs-based fs mock; MSW setup via setupServer and handlers; automocking algorithm; pitfalls on internal calls

## Normalised Extract
Table of Contents
1. Date & Timer Control
2. Function Spies & Mocks
3. Global & Module Mocking
4. Class Mocking
5. File System Mocking
6. Network Request Mocking

1. Date & Timer Control
  vi.useFakeTimers(): switch to fake timer mode
  vi.useRealTimers(): revert timer mode
  vi.setSystemTime(date: Date|number): override Date.now
  vi.runAllTimers(): execute all pending timeouts/intervals
  vi.advanceTimersByTime(ms: number): move timers ahead by ms
  vi.advanceTimersToNextTimer(): jump to next timer

2. Function Spies & Mocks
  vi.spyOn(obj, method, accessType?): SpyInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), getMockName(), toHaveBeenCalledTimes(n), toHaveBeenCalledWith(...)
  vi.fn(): creates callable MockInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), mockReturnValue(v), mockResolvedValue(v), mockRejectedValue(err)
  vi.restoreAllMocks(): restore original implementations
  vi.clearAllMocks(): clear call history

3. Global & Module Mocking
  vi.stubGlobal(name, value): define globalThis[name]
  vi.unstubAllGlobals(): remove stubs
  Module mocking:
    vi.mock('module', factory)
    factory returns mocked exports
  Automocking algorithm applies deep clone for objects, empties arrays

4. Class Mocking
  const MockClass = vi.fn(function(args){ constructor body })
  MockClass.prototype.method = vi.fn()
  MockClass.staticMethod = vi.fn()
  Beware new.target undefined

5. File System Mocking
  Setup __mocks__/fs.cjs: module.exports = memfs.fs
  Setup __mocks__/fs/promises.cjs: module.exports = memfs.fs.promises
  vi.mock('node:fs'); vi.mock('node:fs/promises')
  use vol.reset(), vol.fromJSON({...}, cwd)

6. Network Request Mocking
  import { setupServer } from 'msw/node'
  import { http, graphql, ws, HttpResponse } from 'msw'
  const handlers = [http.get(url, () => HttpResponse.json(data)), graphql.query(name, () => HttpResponse.json({data})), ws.link(url).addEventListener('connection', handler)]
  const server = setupServer(...handlers)
  beforeAll(()=>server.listen({onUnhandledRequest:'error'}))
  afterEach(()=>server.resetHandlers())
  afterAll(()=>server.close())


## Supplementary Details
Date & Timer APIs parameters and defaults
- useFakeTimers(): no args
- setSystemTime(date: Date|number): accepts Date object or timestamp number
- advanceTimersByTime(ms:number): integer ms
Function Spy return types
- vi.spyOn returns SpyInstance<OriginalReturnType>
- SpyInstance.mockImplementation returns SpyInstance
Module mocking factory signature
- factory: ()=>Record<string, any>
Class mocking caveats
- new MockClass() instanceof MockClass true only if constructor returns this
Memfs vol API
- vol.reset(): void
- vol.fromJSON(objectMap:Record<string,string>, cwd:string): void
MSW server methods
- server.listen(options:{onUnhandledRequest: 'error'|'warn'|false}): void
- server.resetHandlers(...handlers): void
- server.close(): void


## Reference Details
### vi.useFakeTimers() -> void
### vi.useRealTimers() -> void
### vi.setSystemTime(date: Date|number) -> void
### vi.runAllTimers() -> void
### vi.advanceTimersByTime(ms: number) -> void
### vi.advanceTimersToNextTimer() -> void

### vi.spyOn
Signature: vi.spyOn<T, K extends keyof T>(target: T, property: K, accessType?: 'get'|'set'): SpyInstance<T[K], any[]>
Returns: SpyInstance with:
  mockImplementation(fn: (...args:any[])=>any): this
  mockImplementationOnce(fn: (...args:any[])=>any): this
  getMockName(): string
  toHaveBeenCalledTimes(count: number): Assertion
  toHaveBeenCalledWith(...args:any[]): Assertion

### vi.fn
Signature: vi.fn<T extends (...args:any[])=>any>(implementation?: T): MockInstance<T, Parameters<T>>
MockInstance methods:
  mockImplementation(fn: (...args:Parameters<T>)=>ReturnType<T>): this
  mockImplementationOnce(fn: (...args:Parameters<T>)=>ReturnType<T>): this
  mockReturnValue(value: ReturnType<T>): this
  mockResolvedValue(value: PromiseValue<ReturnType<T>>): this
  mockRejectedValue(error: any): this

### vi.restoreAllMocks() -> void
### vi.clearAllMocks() -> void

### vi.stubGlobal(name: string, value: any) -> void
### vi.unstubAllGlobals() -> void

### vi.mock
Signature: vi.mock(moduleId: string|() => any, factory: () => Record<string, any>): void
Effects: mocks all imports of moduleId with factory return

### Class mocking pattern
const MockClass = vi.fn(function(name:string){ this.name=name })
MockClass.prototype.method = vi.fn()
MockClass.staticMethod = vi.fn()

### Memfs mocks
__mocks__/fs.cjs
  const {fs} = require('memfs')
  module.exports = fs
__mocks__/fs/promises.cjs
  const {fs} = require('memfs')
  module.exports = fs.promises
vol.reset(): void
vol.fromJSON(files:Record<string,string>, cwd:string): void

### MSW usage
import { setupServer } from 'msw/node'
import { http, graphql, ws, HttpResponse } from 'msw'
HTTP handler: http.get(url:string, resolver:()=>HttpResponse)
GraphQL handler: graphql.query(operationName:string, resolver:()=>HttpResponse)
WebSocket: const link = ws.link(url:string)
link.addEventListener('connection', ({client})=>{})
const server = setupServer(...handlers)
server.listen({onUnhandledRequest:'error'| 'warn' | false}): void
server.resetHandlers(...handlers?): void
server.close(): void

### Best Practices
- Clear mocks after each test: afterEach(()=>{vi.clearAllMocks(); vi.restoreAllMocks()})
- Use dependency injection for internal calls to allow mocking
- Use memfs for fs mocking to avoid real disk I/O
- Set onUnhandledRequest:'error' to catch missing handlers

### Troubleshooting
Command: vitest --run
Scenario: Fake timer not applied
  Check: vi.useFakeTimers called before timer creation
Scenario: Module mock not applied
  Check: vi.mock is hoisted above imports
Scenario: FS mock returns undefined
  Check: __mocks__/fs.cjs path and naming correct
Scenario: MSW server not intercepting
  Check: server.listen called in beforeAll and resetHandlers in afterEach


## Information Dense Extract
DateTimers: vi.useFakeTimers(); vi.useRealTimers(); vi.setSystemTime(Date|number); vi.runAllTimers(); vi.advanceTimersByTime(ms); vi.advanceTimersToNextTimer();
Function spies: vi.spyOn(obj,prop,'get'|'set')->SpyInstance
Functions: vi.fn()->MockInstance
Mock methods: mockImplementation(fn); mockImplementationOnce(fn); mockReturnValue(v); mockResolvedValue(v); mockRejectedValue(err)
Restore/Clear: vi.restoreAllMocks(); vi.clearAllMocks()
Global stub: vi.stubGlobal(name,val); vi.unstubAllGlobals()
Module mock: vi.mock(id,factory->Record<string,any>)
Automock: arrays emptied; primitives cloned; objects deep clone; class instances deep clone
Class mock: const C=vi.fn(function(){...}); C.prototype.method=vi.fn(); C.static=vi.fn()
FS mock: __mocks__/fs.cjs->memfs.fs; __mocks__/fs/promises.cjs->memfs.fs.promises; vi.mock('node:fs'); vi.mock('node:fs/promises'); vol.reset(); vol.fromJSON(map,cwd)
Network mock MSW: import {setupServer} from 'msw/node'; import {http,graphql,ws,HttpResponse} from 'msw'; handlers: http.get(url,()=>HttpResponse.json(data)); graphql.query(op,()=>HttpResponse.json({data})); ws.link(url).addEventListener('connection',...); server=setupServer(...handlers); beforeAll(()=>server.listen({onUnhandledRequest:'error'})); afterEach(()=>server.resetHandlers()); afterAll(()=>server.close())

## Sanitised Extract
Table of Contents
1. Date & Timer Control
2. Function Spies & Mocks
3. Global & Module Mocking
4. Class Mocking
5. File System Mocking
6. Network Request Mocking

1. Date & Timer Control
  vi.useFakeTimers(): switch to fake timer mode
  vi.useRealTimers(): revert timer mode
  vi.setSystemTime(date: Date|number): override Date.now
  vi.runAllTimers(): execute all pending timeouts/intervals
  vi.advanceTimersByTime(ms: number): move timers ahead by ms
  vi.advanceTimersToNextTimer(): jump to next timer

2. Function Spies & Mocks
  vi.spyOn(obj, method, accessType?): SpyInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), getMockName(), toHaveBeenCalledTimes(n), toHaveBeenCalledWith(...)
  vi.fn(): creates callable MockInstance
    methods: mockImplementation(fn), mockImplementationOnce(fn), mockReturnValue(v), mockResolvedValue(v), mockRejectedValue(err)
  vi.restoreAllMocks(): restore original implementations
  vi.clearAllMocks(): clear call history

3. Global & Module Mocking
  vi.stubGlobal(name, value): define globalThis[name]
  vi.unstubAllGlobals(): remove stubs
  Module mocking:
    vi.mock('module', factory)
    factory returns mocked exports
  Automocking algorithm applies deep clone for objects, empties arrays

4. Class Mocking
  const MockClass = vi.fn(function(args){ constructor body })
  MockClass.prototype.method = vi.fn()
  MockClass.staticMethod = vi.fn()
  Beware new.target undefined

5. File System Mocking
  Setup __mocks__/fs.cjs: module.exports = memfs.fs
  Setup __mocks__/fs/promises.cjs: module.exports = memfs.fs.promises
  vi.mock('node:fs'); vi.mock('node:fs/promises')
  use vol.reset(), vol.fromJSON({...}, cwd)

6. Network Request Mocking
  import { setupServer } from 'msw/node'
  import { http, graphql, ws, HttpResponse } from 'msw'
  const handlers = [http.get(url, () => HttpResponse.json(data)), graphql.query(name, () => HttpResponse.json({data})), ws.link(url).addEventListener('connection', handler)]
  const server = setupServer(...handlers)
  beforeAll(()=>server.listen({onUnhandledRequest:'error'}))
  afterEach(()=>server.resetHandlers())
  afterAll(()=>server.close())

## Original Source
Vitest Testing & Mocking
https://vitest.dev/guide/mocking.html

## Digest of VITEST_MOCKING

# Vitest Mocking Guide

Retrieved: 2024-06-14

## Dates and Timers

### Methods

- vi.useFakeTimers() : enable fake timers & date manipulation
- vi.useRealTimers() : restore real timers
- vi.setSystemTime(date: Date|number): override system time
- vi.runAllTimers(): fast-forward all timers
- vi.advanceTimersByTime(ms: number): advance timers by ms
- vi.advanceTimersToNextTimer(): advance to next scheduled timer

### Example Usage

```js
import { beforeEach, afterEach, it, describe, expect, vi } from 'vitest'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('executes after two hours', () => {
  const mockFn = vi.fn()
  setTimeout(mockFn, 1000 * 60 * 60 * 2)
  vi.runAllTimers()
  expect(mockFn).toHaveBeenCalledTimes(1)
})
```  

## Function Spies & Mocks

### vi.spyOn(target: object, property: string, accessType?: 'get'|'set')
- Returns SpyInstance with methods:
  - .mockImplementation(fn)
  - .mockImplementationOnce(fn)
  - .getMockName(): string
  - call assertions (.toHaveBeenCalledTimes, .toHaveBeenCalledWith)

### vi.fn(): MockInstance & Callable
- Methods:
  - .mockImplementation(fn)
  - .mockImplementationOnce(fn)
  - .mockReturnValue(value)
  - .mockResolvedValue(value)
  - .mockRejectedValue(error)

### Restoring

- vi.restoreAllMocks(): restore spies to original
- vi.clearAllMocks(): clear mock call history

### Stub Globals

- vi.stubGlobal(name: string, value: any)
- vi.unstubAllGlobals()

## Module & Class Mocking

### Module Factory

```ts
vi.mock('module-name', () => {
  return { export1: vi.fn(), export2: vi.fn() }
})
```

### Virtual Modules

- In vite.config:
  alias: { 'virtual:id': '/path/to/mock.js' }
- Or plugin.resolveId() returns 'virtual:id'

### Class Mocking

```ts
const Dog = vi.fn(function(name: string){ this.name = name })
Dog.prototype.speak = vi.fn(()=>'bark')
Dog.getType = vi.fn(()=> 'animal')
```  

## Module Automocking

- Arrays -> []
- Primitives -> same
- Objects -> deep clone
- Class instances -> deep clone

## File System Mocking

- Use memfs:
  - __mocks__/fs.cjs exports memfs.fs
  - __mocks__/fs/promises.cjs exports memfs.fs.promises
- vi.mock('node:fs') / vi.mock('node:fs/promises')

## Network Mocking with MSW

- setupServer(handlers...)
- handlers: http.get(url, resolver), graphql.query(operationName, resolver), ws.link(url)
- server.listen({ onUnhandledRequest:'error' })
- server.resetHandlers()

## Pitfalls

- Cannot mock internal calls inside same module; use dependency injection.


## Attribution
- Source: Vitest Testing & Mocking
- URL: https://vitest.dev/guide/mocking.html
- License: License: MIT
- Crawl Date: 2025-05-06T16:29:08.804Z
- Data Size: 33436480 bytes
- Links Found: 24750

## Retrieved
2025-05-06
sandbox/library/GRAPHQL_API.md
# sandbox/library/GRAPHQL_API.md
# GRAPHQL_API

## Crawl Summary
Endpoint POST https://api.github.com/graphql, header Authorization: bearer TOKEN, Content-Type application/json; rate limit 5000 points/hour; use first and after for cursor pagination; check errors array for execution errors; introspection via __schema; HTTP status codes 200.errors, 401, 403

## Normalised Extract
Table of Contents
1 Authentication
2 HTTP Endpoint
3 Content-Type Header
4 Rate Limits
5 Schema Introspection
6 Pagination
7 Error Handling

1 Authentication
Use header Authorization: bearer TOKEN. Tokens: personal access tokens with scopes repo,user,workflow; GitHub App installation tokens

2 HTTP Endpoint
POST https://api.github.com/graphql

3 Content-Type Header
Set Content-Type: application/json

4 Rate Limits
Default 5000 points per hour. Each query costs points based on complexity. Monitor X-Github-Request-Rate-Limit headers

5 Schema Introspection
Query __schema field to fetch types, fields, enums. Example query:
```graphql
{
  __schema {
    types { name kind fields { name type { name kind } } }
  }
}
```

6 Pagination
On connection fields use first and after parameters. Response includes pageInfo.endCursor and pageInfo.hasNextPage. Example:
```graphql
query($cursor:String){
  repository(owner:owner,name:name){
    issues(first:100,after:$cursor){
      edges { node { id title } }
      pageInfo { endCursor hasNextPage }
    }
  }
}
```

7 Error Handling
Successful HTTP 200 may include errors array. Inspect errors field in JSON. Handle 401 HTTP for invalid auth, 403 for rate limit or scope issues.

## Supplementary Details
Authorization header name: Authorization; value format: bearer TOKEN; required scopes: repo,user,workflow; endpoint URL: https://api.github.com/graphql; HTTP method: POST; required header: Content-Type: application/json; response headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset; error response structure: { errors: [ { message path locations } ] }

## Reference Details
HTTP Request
Method POST
URL https://api.github.com/graphql
Headers
  Authorization: bearer TOKEN
  Content-Type: application/json
Body
  { query: STRING, variables: OBJECT }
Responses
  200 OK with { data: OBJECT, errors?: ARRAY }
  401 Unauthorized when token missing or invalid
  403 Forbidden when rate limit exceeded or insufficient scopes
Octokit SDK Method Signature
import { graphql } from '@octokit/graphql'
function graphql<T = any>(options: RequestParameters & Record<string,unknown>): Promise<T>

Example Usage
```js
import { graphql } from '@octokit/graphql'
const result = await graphql({
  query: `query($owner:String!,$name:String!){
    repository(owner:$owner,name:$name){ id name url }
  }`,
  owner: 'my-org',
  name: 'my-repo'
})
console.log(result.repository.id)
```

Pagination Pattern
1 Initialize cursor to null
2 Loop while hasNextPage true
3 Call graphql with variables { owner, name, cursor }
4 Process edges nodes
5 Set cursor to pageInfo.endCursor

Best Practices
Batch fields in a single query to minimize round trips
Use fragments for reusable field sets
Limit page size to 100 for performance

Troubleshooting
If 401, verify token validity via curl:
```bash
curl -H 'Authorization: bearer TOKEN' https://api.github.com/graphql -d '{"query":"{ viewer { login }}"}'
```
Expected { data: { viewer: { login } } }
If rate limit exceeded, X-RateLimit-Remaining returns 0. Wait until reset time from X-RateLimit-Reset header.

## Information Dense Extract
POST https://api.github.com/graphql | Authorization: bearer TOKEN | Content-Type: application/json | RateLimit 5000/hr | Use query+variables JSON body | Schema introspection via __schema | Cursor pagination first/after/pageInfo | Errors in errors array | HTTP codes 200,401,403 | SDK graphql<T>(options):Promise<T> | Fragments for reuse | Max page 100

## Sanitised Extract
Table of Contents
1 Authentication
2 HTTP Endpoint
3 Content-Type Header
4 Rate Limits
5 Schema Introspection
6 Pagination
7 Error Handling

1 Authentication
Use header Authorization: bearer TOKEN. Tokens: personal access tokens with scopes repo,user,workflow; GitHub App installation tokens

2 HTTP Endpoint
POST https://api.github.com/graphql

3 Content-Type Header
Set Content-Type: application/json

4 Rate Limits
Default 5000 points per hour. Each query costs points based on complexity. Monitor X-Github-Request-Rate-Limit headers

5 Schema Introspection
Query __schema field to fetch types, fields, enums. Example query:
'''graphql
{
  __schema {
    types { name kind fields { name type { name kind } } }
  }
}
'''

6 Pagination
On connection fields use first and after parameters. Response includes pageInfo.endCursor and pageInfo.hasNextPage. Example:
'''graphql
query($cursor:String){
  repository(owner:owner,name:name){
    issues(first:100,after:$cursor){
      edges { node { id title } }
      pageInfo { endCursor hasNextPage }
    }
  }
}
'''

7 Error Handling
Successful HTTP 200 may include errors array. Inspect errors field in JSON. Handle 401 HTTP for invalid auth, 403 for rate limit or scope issues.

## Original Source
GitHub API
https://docs.github.com/en/graphql

## Digest of GRAPHQL_API

# GitHub GraphQL API Detailed Digest
Retrieved on 2024-07-12
Data size 3727208 bytes

# About the GraphQL API
The GraphQL API endpoint is POST https://api.github.com/graphql   Content-Type must be application/json

# Authentication
Include HTTP header Authorization: bearer TOKEN   Valid tokens include user, app, or installation tokens with appropriate scopes (repo, workflow, user)

# Rate limits
GraphQL rate limit uses a points system   Default limit 5000 points per hour per account   Query and mutation costs depend on field complexity

# Schema Introspection
Run query { __schema { types { name kind fields { name type { name kind } } } } } to retrieve types   Requires Authorization header   Returns JSON payload with schema structure

# Pagination
Use arguments first: Int, after: String on connection fields   Example: repository(owner: owner, name: name) { issues(first: 100, after: CURSOR) { edges { node { id title } } pageInfo { endCursor hasNextPage } } }

# Errors
HTTP 200 with errors array in payload for GraphQL errors   HTTP 401 for authentication failures   HTTP 403 when rate limit exceeded or insufficient scopes


## Attribution
- Source: GitHub API
- URL: https://docs.github.com/en/graphql
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T18:29:45.218Z
- Data Size: 3727208 bytes
- Links Found: 25775

## Retrieved
2025-05-06
