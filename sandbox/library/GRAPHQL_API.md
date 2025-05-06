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
