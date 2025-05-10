# GITHUB_GRAPHQL

## Crawl Summary
Endpoint: POST https://api.github.com/graphql with header Authorization: bearer <token> and Content-Type: application/json. Authentication uses OAuth or App tokens with scopes public_repo, repo, read:org, user. Schema introspection via __schema query or downloaded schema.docs.graphql. Rate limit: 5000 points/hour; cost per field=1 point; headers X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. Pagination: use connection args first, after, last, before; pageInfo returns endCursor, hasNextPage.

## Normalised Extract
Table of Contents:
1. Authentication
2. Endpoint Configuration
3. Schema Introspection
4. Rate Limits
5. Pagination Usage

1. Authentication
- Header: Authorization: bearer <token>
- Token types: OAuth user token, GitHub App installation token
- Required scopes: public_repo, repo, read:org, user

2. Endpoint Configuration
- URL: https://api.github.com/graphql
- HTTP Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: bearer <token>
- Request body: { "query": <GraphQL query string>, "variables": { ... } }

3. Schema Introspection
- Introspection query: __schema { types { name kind fields { name type { name kind ofType { name kind } } } } queryType { name } mutationType { name } }
- Download schema: GET schema.docs.graphql
- Tooling: use GraphQL Explorer or graphql-cli introspect

4. Rate Limits
- Limit: 5000 points per hour
- Cost calculation: one point per object field returned
- Headers:
  - X-RateLimit-Limit: total points
  - X-RateLimit-Remaining: available points
  - X-RateLimit-Reset: epoch seconds when resets
- Enforcement: queries exceeding points are rejected with error code RATE_LIMITED

5. Pagination Usage
- Connection arguments on fields returning lists:
  - first: Int, after: String
  - last: Int, before: String
- PageInfo fields:
  - hasNextPage: Boolean
  - hasPreviousPage: Boolean
  - startCursor: String
  - endCursor: String
- Example usage: repositories(first:50, after: $cursor)



## Supplementary Details
Authentication Implementation Steps:
1. Generate OAuth token or App installation token with required scopes.
2. Configure GraphQL client header Authorization: bearer <token>.
3. Validate token by running a simple query: { viewer { login } }.

Error Handling:
- 401 Unauthorized: invalid/missing token
- 403 Forbidden: missing scope or rate limit exceed
- Errors returned in JSON under errors array with message, type, path

Default Scopes and Effects:
- public_repo: read/write public repos
- repo: full control private repos
- read:org: read organization data
- user: read/write user profile

Client Configuration Options:
- HTTP timeout default: 30s
- Retries: 3 attempts with exponential backoff
- Logging: request/response logging enabled by setting DEBUG=graphql

Implementation Patterns:
- Persist queries to reduce cost
- Batch smaller queries into single request
- Cache schema locally for offline validation
- Use pagination cursors to traverse large lists


## Reference Details
API Specifications:

Queries:
- viewer: returns User
  signature: viewer: User!
- repository(owner: String!, name: String!): Repository
  signature: repository(owner:String!, name:String!): Repository

Mutations:
- addComment(input: AddCommentInput!): AddCommentPayload
  AddCommentInput fields:
    - subjectId: ID! (issue or pull request)
    - body: String! (comment text)
  AddCommentPayload fields:
    - commentEdge: IssueCommentEdge
    - subject: Node

Connections and Pagination:
- <Type>Connection arguments:
    first: Int
    after: String
    last: Int
    before: String
  PageInfo:
    - hasNextPage: Boolean!
    - hasPreviousPage: Boolean!
    - startCursor: String
    - endCursor: String

Full Code Example (Node.js):
import { GraphQLClient } from 'graphql-request'
const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` }
})

const GET_REPOS = `query($cursor:String){ viewer{ repositories(first:50, after:$cursor){ edges{ cursor node{ name url } } pageInfo{ endCursor hasNextPage } } } }`

async function listAllRepos(){
  let cursor = null
  let all = []
  do{
    const data = await client.request(GET_REPOS, { cursor })
    data.viewer.repositories.edges.forEach(e=>all.push(e.node))
    cursor = data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
  } while(cursor)
  return all
}

Best Practices:
- Persist queries via GraphQL persisted operations to save cost and speed
- Validate queries against local schema before sending
- Use HTTP2 protocol for multiplexing
- Log cost per request by inspecting X-RateLimit-Remaining

Troubleshooting Procedures:
1. Check connectivity: curl -I https://api.github.com/graphql
   Expect: HTTP/2 200
2. Test auth: curl -X POST -H 'Authorization: bearer $TOKEN' -d '{"query":"{viewer{login}}"}' https://api.github.com/graphql
   Expect JSON { data:{ viewer:{ login:"username" } } }
3. Inspect rate limit: curl -H 'Authorization: bearer $TOKEN' https://api.github.com/rate_limit
   Validate limit.core.remaining >0
4. Schema mismatch: run graphql-cli introspect --endpoint https://api.github.com/graphql


## Information Dense Extract
Auth: header Authorization: bearer <token> (scopes: public_repo, repo, read:org, user). Endpoint: POST https://api.github.com/graphql Content-Type: application/json. Introspect: __schema query or download schema.docs.graphql. Rate limit: 5000 points/hour; cost=fields count; headers X-RateLimit-Limit, -Remaining, -Reset. Pagination: connection args first, after, last, before; pageInfo returns hasNextPage, hasPreviousPage, startCursor, endCursor. Node.js client: graphql-request with retries=3, timeout=30s. Signature examples: query viewer: User!, repo(owner:String!,name:String!):Repository, mutation addComment(input:AddCommentInput!):AddCommentPayload(AddCommentInput{subjectId:ID!,body:String!}). Troubleshoot via curl commands. Persist queries for cost reduction.

## Sanitised Extract
Table of Contents:
1. Authentication
2. Endpoint Configuration
3. Schema Introspection
4. Rate Limits
5. Pagination Usage

1. Authentication
- Header: Authorization: bearer <token>
- Token types: OAuth user token, GitHub App installation token
- Required scopes: public_repo, repo, read:org, user

2. Endpoint Configuration
- URL: https://api.github.com/graphql
- HTTP Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: bearer <token>
- Request body: { 'query': <GraphQL query string>, 'variables': { ... } }

3. Schema Introspection
- Introspection query: __schema { types { name kind fields { name type { name kind ofType { name kind } } } } queryType { name } mutationType { name } }
- Download schema: GET schema.docs.graphql
- Tooling: use GraphQL Explorer or graphql-cli introspect

4. Rate Limits
- Limit: 5000 points per hour
- Cost calculation: one point per object field returned
- Headers:
  - X-RateLimit-Limit: total points
  - X-RateLimit-Remaining: available points
  - X-RateLimit-Reset: epoch seconds when resets
- Enforcement: queries exceeding points are rejected with error code RATE_LIMITED

5. Pagination Usage
- Connection arguments on fields returning lists:
  - first: Int, after: String
  - last: Int, before: String
- PageInfo fields:
  - hasNextPage: Boolean
  - hasPreviousPage: Boolean
  - startCursor: String
  - endCursor: String
- Example usage: repositories(first:50, after: $cursor)

## Original Source
GitHub REST & GraphQL APIs
https://docs.github.com/en/graphql

## Digest of GITHUB_GRAPHQL

# Authentication

Use HTTP header Authorization: bearer <token> with OAuth or GitHub App token. Required scopes: public_repo for public repositories, repo for private, read:org for organization data, user for user data.

# Endpoint

Method: POST  
URL: https://api.github.com/graphql  
Headers:  
  Content-Type: application/json  
  Authorization: bearer <token>

# Schema Introspection

Run introspection query:  
```graphql
query IntrospectSchema {
  __schema {
    types {
      name
      kind
      fields { name type { name kind ofType { name kind } } }
    }
    queryType { name }
    mutationType { name }
  }
}
```
Public schema downloadable at schema.docs.graphql.

# Rate Limits

GraphQL rate limit = 5000 points per hour.  
Cost per field: each object field=1 point, nested fields increment cost.  
Response headers:  
  X-RateLimit-Limit: 5000  
  X-RateLimit-Remaining: <points left>  
  X-RateLimit-Reset: <unix epoch>

# Pagination

Use connection arguments on list fields:  
  first: Int (items after cursor)  
  after: String (cursor)  
  last: Int (items before cursor)  
  before: String (cursor)  
Example:
```graphql
query ListRepos($cursor:String) {
  viewer { repositories(first:50, after:$cursor) { edges { cursor node { name } } pageInfo { endCursor hasNextPage } } }
}
```

## Attribution
- Source: GitHub REST & GraphQL APIs
- URL: https://docs.github.com/en/graphql
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T02:24:30.372Z
- Data Size: 2150579 bytes
- Links Found: 16561

## Retrieved
2025-05-10
