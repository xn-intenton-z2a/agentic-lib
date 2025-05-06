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
