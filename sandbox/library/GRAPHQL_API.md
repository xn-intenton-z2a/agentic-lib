# GRAPHQL_API

## Crawl Summary
Authentication via Authorization header; POST endpoint at /graphql; JSON body with query and variables; cursor-based pagination using first/after and last/before with pageInfo fields; rate limit of 5000 points/hour accessible via rateLimit object; full schema introspection via __schema queries; errors in errors array despite HTTP 200.

## Normalised Extract
Table of Contents
1 Authentication
2 Endpoint and Headers
3 Request Payload
4 Pagination Parameters and Response
5 Rate Limit Object
6 Schema Introspection Query
7 Error Handling

1 Authentication
  Use HTTP header 'Authorization: Bearer <PERSONAL_ACCESS_TOKEN>'. Ensure token has required scopes (repo, user, etc.).

2 Endpoint and Headers
  URL: https://api.github.com/graphql
  Mandatory Headers:
    Content-Type: application/json
    Authorization: Bearer <TOKEN>

3 Request Payload
  JSON object with two keys:
    query: GraphQL query or mutation as a string
    variables: JSON object of input variables

4 Pagination Parameters and Response
  Forward pagination: use 'first' (Int) and 'after' (String cursor)
  Backward pagination: use 'last' (Int) and 'before' (String cursor)
  Each connection returns 'pageInfo' containing:
    hasNextPage (Boolean)
    endCursor (String)
    hasPreviousPage (Boolean)
    startCursor (String)

5 Rate Limit Object
  Include 'rateLimit' in query to retrieve:
    limit: Int total points
    cost: Int points consumed by request
    remaining: Int points left
    resetAt: String timestamp in ISO8601

6 Schema Introspection Query
  Standard GraphQL introspection:
    query { __schema { types { name kind fields { name } } queryType { name } mutationType { name } } }

7 Error Handling
  HTTP status is 200 even when errors occur. Check 'errors' array in JSON response. Each error includes:
    message: String
    locations: Array of { line: Int, column: Int }
    path: Array of field names indicating error location


## Supplementary Details
Required token scopes: repo (full control of private repos), user (full control of user data), read:org (read organization data), workflow (update GitHub Actions workflows).
Default Content-Type: application/json. No additional Accept header needed.
Response is always JSON with keys data and optionally errors.
Implement clients with exponential backoff on rate limit remaining==0.
Steps to call:
1. Obtain PAT with required scopes.
2. Build HTTP POST to /graphql with headers.
3. Create payload with query and variables.
4. Monitor rateLimit object and back off or queue if remaining < cost.
5. Handle pagination by inspecting pageInfo and repeating with endCursor.
6. Handle errors array and retry on transient network errors (502, 503, 504) up to 3 times with jitter.


## Reference Details
cURL Example:
  curl -X POST https://api.github.com/graphql \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"query":"query($n:Int!){ viewer{ login } }","variables":{"n":10}}'

Node.js (Octokit GraphQL):
  import { graphql } from '@octokit/graphql'
  const client = graphql.defaults({ headers: { authorization: `token ${TOKEN}` } })
  async function getViewerLogin() {
    const response = await client<{ viewer: { login: string } }>(
      `query { viewer { login } }`
    )
    return response.viewer.login
  }

Python (requests):
  import requests
  headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
  json = {"query": "query { viewer { login } }"}
  r = requests.post('https://api.github.com/graphql', headers=headers, json=json)
  data = r.json()

Best Practices:
  - Persist queries on server to reduce payload size.
  - Batch related queries in a single request.
  - Limit fields returned to only necessary ones.
  - Monitor rateLimit.remaining and resetAt before heavy queries.

Troubleshooting:
  Command: curl ...
  If HTTP 502 or 503, sleep 1s and retry up to 3 times.
  If errors include 'Something went wrong with one of the query fields', inspect field path and schema for deprecated fields.
  Use introspection to confirm current schema:
    curl -X POST https://api.github.com/graphql \
      -H "Authorization: Bearer TOKEN" \
      -d '{"query":"{ __schema { types { name } } }"}'


## Information Dense Extract
Auth: Authorization: Bearer TOKEN; Endpoint: POST https://api.github.com/graphql; Headers: Content-Type: application/json; Payload: { query:String, variables:JSON }; Pagination: first,after,last,before; pageInfo:{hasNextPage,endCursor,hasPreviousPage,startCursor}; RateLimit: 5000/hr via rateLimit{limit,cost,remaining,resetAt}; Introspection: __schema and __type queries; Errors: errors array in JSON even on 200; Scopes: repo,user,read:org,workflow; Retry: 502/503/504 with backoff; Best: Persist queries, batch requests, minimal fields.

## Sanitised Extract
Table of Contents
1 Authentication
2 Endpoint and Headers
3 Request Payload
4 Pagination Parameters and Response
5 Rate Limit Object
6 Schema Introspection Query
7 Error Handling

1 Authentication
  Use HTTP header 'Authorization: Bearer <PERSONAL_ACCESS_TOKEN>'. Ensure token has required scopes (repo, user, etc.).

2 Endpoint and Headers
  URL: https://api.github.com/graphql
  Mandatory Headers:
    Content-Type: application/json
    Authorization: Bearer <TOKEN>

3 Request Payload
  JSON object with two keys:
    query: GraphQL query or mutation as a string
    variables: JSON object of input variables

4 Pagination Parameters and Response
  Forward pagination: use 'first' (Int) and 'after' (String cursor)
  Backward pagination: use 'last' (Int) and 'before' (String cursor)
  Each connection returns 'pageInfo' containing:
    hasNextPage (Boolean)
    endCursor (String)
    hasPreviousPage (Boolean)
    startCursor (String)

5 Rate Limit Object
  Include 'rateLimit' in query to retrieve:
    limit: Int total points
    cost: Int points consumed by request
    remaining: Int points left
    resetAt: String timestamp in ISO8601

6 Schema Introspection Query
  Standard GraphQL introspection:
    query { __schema { types { name kind fields { name } } queryType { name } mutationType { name } } }

7 Error Handling
  HTTP status is 200 even when errors occur. Check 'errors' array in JSON response. Each error includes:
    message: String
    locations: Array of { line: Int, column: Int }
    path: Array of field names indicating error location

## Original Source
GitHub GraphQL API
https://docs.github.com/en/graphql

## Digest of GRAPHQL_API

# Authentication

Use HTTP header Authorization: Bearer <PERSONAL_ACCESS_TOKEN>
Required scope depends on data accessed (repo, user, gist, workflow).

# Endpoint

POST https://api.github.com/graphql
Headers:
  Content-Type: application/json
  Authorization: Bearer <TOKEN>

# Query Structure

Request body JSON:
  query: string containing GraphQL query or mutation
  variables: JSON object mapping variable names to values

# Pagination

Cursor-based pagination on connection fields.
Parameters:
  first: Int (forward pagination)
  after: String (cursor)
  last: Int (backward pagination)
  before: String (cursor)
Response fields:
  pageInfo {
    hasNextPage: Boolean
    endCursor: String
    hasPreviousPage: Boolean
    startCursor: String
  }

# Rate Limits

GraphQL rate limit: 5,000 points per hour per token.
Query cost calculated from field complexity. Query rateLimit object:
  rateLimit {
    limit: Int
    cost: Int
    remaining: Int
    resetAt: ISO8601 timestamp
  }

# Schema Introspection

Introspection query on __schema and __type.
Use standard GraphQL introspection:
  query IntrospectionQuery { __schema { types { name kind fields { name } } queryType { name } } }

# Errors

Errors returned in JSON body under key errors array even if HTTP status 200.
Each error object contains:
  message: String
  locations: [{ line: Int, column: Int }]
  path: [String]

_Retrieved on 2024-06-25_

_Data size: 2,595,078 bytes_

## Attribution
- Source: GitHub GraphQL API
- URL: https://docs.github.com/en/graphql
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-10T18:57:35.568Z
- Data Size: 2595078 bytes
- Links Found: 25412

## Retrieved
2025-05-10
