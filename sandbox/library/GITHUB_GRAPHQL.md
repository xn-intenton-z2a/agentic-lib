# GITHUB_GRAPHQL

## Crawl Summary
Endpoint: POST https://api.github.com/graphql with headers Authorization: bearer <TOKEN>, Content-Type and Accept application/json. Use JSON body {query,variables}. Authenticate via personal access token with required scopes. Introspect schema via __schema query or download schema file. Rate limit tracked via rateLimit object with fields limit, cost, remaining, resetAt; default 5000 points/hour. Use cursor pagination with first/after or last/before and pageInfo. Global Node IDs are Base64 encoded "Type:ID" and used in queries and mutations.

## Normalised Extract
Table of Contents

1. Authentication
2. Endpoint & Headers
3. Request Body Format
4. Schema Introspection
5. Rate Limiting
6. Cursor Pagination
7. Global Node IDs

1. Authentication
• Use HTTP header Authorization: bearer <PERSONAL_ACCESS_TOKEN>
• Common scopes: repo, read:org, workflow

2. Endpoint & Headers
• URL: https://api.github.com/graphql
• Headers:
    Authorization: bearer <TOKEN>
    Content-Type: application/json
    Accept: application/json

3. Request Body Format
• JSON object with two keys:
    query: string containing GraphQL operation
    variables: object mapping variable names to values
• Example:
    {
      "query": "query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id,name } }",
      "variables": {"owner":"octocat","name":"Hello-World"}
    }

4. Schema Introspection
• Send POST with introspection query:
    { __schema { types { name fields { name type { name kind ofType { name kind } } } } } }
• Or download schema.docs.graphql from public schema link.

5. Rate Limiting
• Query rateLimit field:
    {
      rateLimit { limit cost remaining resetAt }
    }
• Interpret:
    limit = 5000, cost = computed per query, remaining = points left, resetAt = next reset timestamp

6. Cursor Pagination
• On any connection field use arguments:
    first: Int, after: String, last: Int, before: String
• Response returns pageInfo with hasNextPage, endCursor, hasPreviousPage, startCursor.
• To traverse forward use first + after; backward use last + before.

7. Global Node IDs
• All Node types expose id: ID! Global ID = Base64("<TypeName>:<internal ID>")
• Use to fetch objects by id in queries and mutations:
    query { node(id: "MDQ6VXNlcjU4MzIzMQ==") { __typename id } }


## Supplementary Details
Implementation Steps

1. Obtain PAT (personal access token) with necessary scopes.
2. Construct HTTP POST to https://api.github.com/graphql.
3. Set headers Authorization: bearer <TOKEN>, Content-Type: application/json.
4. Build JSON payload with query and variables.
5. Execute request; parse JSON response.
6. For paging large lists, perform initial query with first:N. While pageInfo.hasNextPage is true, repeat with after: pageInfo.endCursor.
7. Monitor rate usage by querying rateLimit and throttle if remaining < threshold.
8. For schema updates, re-run introspection or re-download schema.docs.graphql monthly.

Exact Parameter Values

• Content-Type: application/json
• Accept: application/json
• Default page size: no hard limit but recommended <=100
• Rate limit reset interval: 3600s

Configuration Options

• Custom GraphQL client: configure retry on 502, 503 up to 3 attempts with exponential backoff.
• Timeout: 10s per request.

Error Handling

• HTTP 4xx: check response.errors array. Example: "Bad credentials" => reauthenticate.
• HTTP 5xx: retry.
• Rate limit exceeded: GraphQL returns errors with type RATE_LIMITED. On detection, sleep until resetAt or fallback to REST rate limit API.

## Reference Details
HTTP Endpoint
  POST https://api.github.com/graphql

Required Headers
  Authorization: bearer <TOKEN>
  Content-Type: application/json
  Accept: application/json

Request Payload
  query: String!
  variables: JSON object

Response Structure
  data: JSON object matching query selection
  errors: [ { message: String, locations: [ { line: Int, column: Int } ], path: [ String ], type: String } ]

RateLimit API
  Query: rateLimit(limit: Int?, cost: Int?): RateLimit
  RateLimit fields:
    limit: Int!
    cost: Int!
    remaining: Int!
    resetAt: DateTime!

Pagination Arguments on Connection Types
  first: Int
  after: String
  last: Int
  before: String

pageInfo Type
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String

Node Interface
  id: ID!

Global ID Format
  Base64("<TypeName>:<internal ID>")

Sample cURL
  curl -X POST -H "Authorization: bearer $TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"query":"query{ viewer{ login }}"}' \
       https://api.github.com/graphql

JavaScript Fetch Example
  import fetch from 'node-fetch';
  const token = process.env.GITHUB_TOKEN;
  const query = `query($login:String!){ user(login:$login){ id name }}`;
  const variables = { login: 'octocat' };
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables })
  });
  const { data, errors } = await response.json();

Best Practices
  • Batch pagination: use `first:100` and loop on `endCursor`.
  • Persisted queries: use sha256 hash of query and send {id, variables} to reduce payload.
  • Caching: cache schema introspection and query results keyed by variables.

Troubleshooting
  • Authentication failure: HTTP 401, error.DOMAIN = "AUTHENTICATION_FAILURE". Run:
      curl -H "Authorization: bearer $TOKEN" https://api.github.com/user
  • Rate limit exceeded: GraphQL error.type = RATE_LIMITED, check resetAt, then sleep:
      sleep $(($(date -d "$(jq -r .data.rateLimit.resetAt response.json)" +%s) - $(date +%s)))
  • Schema mismatch errors: re-download schema file or re-introspect.

## Information Dense Extract
POST https://api.github.com/graphql  Headers: Authorization: bearer <TOKEN>; Content-Type: application/json; Accept: application/json; Body: {query:string,variables:object}. Authenticate via PAT with scopes repo,read:org,workflow. RateLimit object fields: limit(5000),cost,remaining,resetAt. Pagination: first:Int,after:String,last:Int,before:String with pageInfo.hasNextPage,endCursor. Global IDs: Base64("Type:ID"). Introspect with __schema query or download schema.docs.graphql. Retry on HTTP 502/503 up to 3x, timeout 10s, throttle when remaining<100. Error handling: 401=>renew token; RATE_LIMITED=>sleep until resetAt. Best practice: persisted queries via sha256, batch pagination with first 100.

## Sanitised Extract
Table of Contents

1. Authentication
2. Endpoint & Headers
3. Request Body Format
4. Schema Introspection
5. Rate Limiting
6. Cursor Pagination
7. Global Node IDs

1. Authentication
 Use HTTP header Authorization: bearer <PERSONAL_ACCESS_TOKEN>
 Common scopes: repo, read:org, workflow

2. Endpoint & Headers
 URL: https://api.github.com/graphql
 Headers:
    Authorization: bearer <TOKEN>
    Content-Type: application/json
    Accept: application/json

3. Request Body Format
 JSON object with two keys:
    query: string containing GraphQL operation
    variables: object mapping variable names to values
 Example:
    {
      'query': 'query($owner:String!,$name:String!){ repository(owner:$owner,name:$name){ id,name } }',
      'variables': {'owner':'octocat','name':'Hello-World'}
    }

4. Schema Introspection
 Send POST with introspection query:
    { __schema { types { name fields { name type { name kind ofType { name kind } } } } } }
 Or download schema.docs.graphql from public schema link.

5. Rate Limiting
 Query rateLimit field:
    {
      rateLimit { limit cost remaining resetAt }
    }
 Interpret:
    limit = 5000, cost = computed per query, remaining = points left, resetAt = next reset timestamp

6. Cursor Pagination
 On any connection field use arguments:
    first: Int, after: String, last: Int, before: String
 Response returns pageInfo with hasNextPage, endCursor, hasPreviousPage, startCursor.
 To traverse forward use first + after; backward use last + before.

7. Global Node IDs
 All Node types expose id: ID! Global ID = Base64('<TypeName>:<internal ID>')
 Use to fetch objects by id in queries and mutations:
    query { node(id: 'MDQ6VXNlcjU4MzIzMQ==') { __typename id } }

## Original Source
GitHub GraphQL API Reference
https://docs.github.com/en/graphql

## Digest of GITHUB_GRAPHQL

# Authentication

Use a GitHub personal access token in the HTTP Authorization header.

• Header: Authorization: bearer <TOKEN>
• Required scopes per operation:
  • Queries on public data: no scopes
  • Repository read/write: repo
  • Organization read: read:org
  • Workflow dispatch: workflow

# Endpoint and Headers

Endpoint URL: https://api.github.com/graphql

Required HTTP headers:
  • Authorization: bearer <TOKEN>
  • Content-Type: application/json
  • Accept: application/json

# Query and Mutation Format

Request body JSON:
{
  "query": "<GraphQL query or mutation string>",
  "variables": {  /* key-value pairs for $variables */ }
}

On success: HTTP 200, body contains { data: { ... }, errors?: [ ... ] }.

# Schema Introspection

Perform a standard GraphQL introspection query:
{
  __schema {
    types { name fields { name type { name kind ofType { name kind } } } }
    queryType { name }
    mutationType { name }
  }
}

Or download the published schema file at https://docs.github.com/public/schema.docs.graphql

# Rate Limits

Query the built-in rateLimit object:
{
  rateLimit {
    limit    # total points per hour
    cost     # points consumed by this operation
    remaining
    resetAt  # ISO8601 timestamp
  }
}

Default limit: 5 000 points per hour. Cost is computed by field complexity.

# Pagination

Cursor-based pagination arguments on connection fields:
  • first: Int (forward paging)
  • after: String (cursor)
  • last: Int (backward paging)
  • before: String (cursor)

Response includes pageInfo:
  {
    hasNextPage: Boolean,
    hasPreviousPage: Boolean,
    startCursor: String,
    endCursor: String
  }

# Global Node IDs

Every object implements Node with id: ID!  Global ID is Base64 of "<TypeName>:<database ID>".
Use __typename and id fields to discover type and global ID for use in other operations.


## Attribution
- Source: GitHub GraphQL API Reference
- URL: https://docs.github.com/en/graphql
- License: License: GitHub Terms of Service
- Crawl Date: 2025-05-11T08:58:16.390Z
- Data Size: 2595078 bytes
- Links Found: 25412

## Retrieved
2025-05-11
