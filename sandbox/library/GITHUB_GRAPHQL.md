# GITHUB_GRAPHQL

## Crawl Summary
POST https://api.github.com/graphql with Authorization: bearer <token>, Content-Type: application/json, Accept: application/vnd.github.v4.idl+json. Use POST payload with query and variables. Pagination via first/after or last/before with pageInfo. Introspection via __schema. Rate limit tracked in rateLimit object. Common errors: 401, 502, ValidationError.

## Normalised Extract
Table of Contents

1. Authentication
2. Endpoint
3. Headers
4. Request Payload
5. Schema Introspection
6. Pagination
7. Rate Limits
8. Error Handling

1. Authentication
Use HTTP header:
  Authorization: bearer <PERSONAL_ACCESS_TOKEN>
Token scope requirements:
  repo, user, admin:org

2. Endpoint
  URL: https://api.github.com/graphql
  Method: POST

3. Headers
  Content-Type: application/json
  Accept: application/vnd.github.v4.idl+json

4. Request Payload
JSON object with fields:
  query: string (GraphQL operation)
  variables: object map

5. Schema Introspection
Run built-in IntrospectionQuery:
  query IntrospectionQuery {
    __schema {
      types { name kind fields { name } }
      queryType { name }
      mutationType { name }
    }
  }
Parse returned __schema to generate client types.

6. Pagination
Apply cursor-based pagination on connection fields:
  arguments: first:Int, after:String, last:Int, before:String
Response fields:
  pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
  edges { node {...}, cursor }

7. Rate Limits
Include rateLimit in query:
  rateLimit { limit cost remaining resetAt }
Defaults:
  limit:5000 points/hour
Costs:
  cost computed per field complexity

8. Error Handling
HTTP 401: invalid token
HTTP 502: retry with exponential backoff (initial delay 3s)
GraphQL validation errors: inspect errors array


## Supplementary Details
1. Implementation Steps

- Obtain a personal access token with required scopes via GitHub settings.
- Set up HTTP client with base URL and default headers.
- Write GraphQL operations as strings or use .graphql files.
- Load schema via introspection for type generation (e.g., Apollo codegen).
- Implement pagination loops by checking pageInfo.hasNextPage and passing endCursor as after.
- Monitor rate limits by querying rateLimit at start and after heavy operations.
- Handle errors: catch HTTP and GraphQL errors separately.

2. Configuration Options

- Default HTTP timeout: 30s
- Max retry attempts for 502: 3
- Backoff strategy: exponential (base delay 3000ms)
- Schema cache TTL: 24h


## Reference Details
JavaScript Fetch Example:

const fetch = require('node-fetch');
async function githubGraphQL(query, variables = {}) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v4.idl+json'
    },
    body: JSON.stringify({ query, variables }),
    timeout: 30000
  });
  if (response.status === 502) {
    // retry logic
    await new Promise(r => setTimeout(r, 3000));
    return githubGraphQL(query, variables);
  }
  const payload = await response.json();
  if (payload.errors) {
    throw new Error(JSON.stringify(payload.errors));
  }
  return payload.data;
}

Apollo Client Setup (TypeScript):

import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';

export function createGitHubClient(token: string): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v4.idl+json'
      }
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
      query: { fetchPolicy: 'network-only' },
    }
  });
}

Best Practices:
- Batch queries within single request when possible.
- Always specify explicit fields to minimize cost.
- Use fragments to reuse field selections.
- Persist introspection schema to local file for offline codegen.

Troubleshooting:
- Command: curl -H "Authorization: bearer $TOKEN" -X POST -d '{"query":"{ rateLimit { remaining } }"}' https://api.github.com/graphql
  Expected: { "data": { "rateLimit": { "remaining": <int> } } }
- If get 401, confirm token validity with REST endpoint: curl -H "Authorization: token $TOKEN" https://api.github.com/user


## Information Dense Extract
Authorization: bearer <token>; POST https://api.github.com/graphql; headers Content-Type: application/json, Accept: application/vnd.github.v4.idl+json; payload {query:string,variables:object}; pagination via first/after and last/before; use pageInfo for cursors; introspection with __schema query; track rate limits via rateLimit {limit,cost,remaining,resetAt}; handle 401,502 with retries, inspect errors array.

## Sanitised Extract
Table of Contents

1. Authentication
2. Endpoint
3. Headers
4. Request Payload
5. Schema Introspection
6. Pagination
7. Rate Limits
8. Error Handling

1. Authentication
Use HTTP header:
  Authorization: bearer <PERSONAL_ACCESS_TOKEN>
Token scope requirements:
  repo, user, admin:org

2. Endpoint
  URL: https://api.github.com/graphql
  Method: POST

3. Headers
  Content-Type: application/json
  Accept: application/vnd.github.v4.idl+json

4. Request Payload
JSON object with fields:
  query: string (GraphQL operation)
  variables: object map

5. Schema Introspection
Run built-in IntrospectionQuery:
  query IntrospectionQuery {
    __schema {
      types { name kind fields { name } }
      queryType { name }
      mutationType { name }
    }
  }
Parse returned __schema to generate client types.

6. Pagination
Apply cursor-based pagination on connection fields:
  arguments: first:Int, after:String, last:Int, before:String
Response fields:
  pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor }
  edges { node {...}, cursor }

7. Rate Limits
Include rateLimit in query:
  rateLimit { limit cost remaining resetAt }
Defaults:
  limit:5000 points/hour
Costs:
  cost computed per field complexity

8. Error Handling
HTTP 401: invalid token
HTTP 502: retry with exponential backoff (initial delay 3s)
GraphQL validation errors: inspect errors array

## Original Source
GitHub GraphQL API
https://docs.github.com/en/graphql

## Digest of GITHUB_GRAPHQL

# Authentication

Use HTTP header Authorization: bearer <PERSONAL_ACCESS_TOKEN>. Token scopes: repo (full control), user (read/write), admin:org.

# Endpoint

POST https://api.github.com/graphql
Content-Type: application/json
Accept: application/vnd.github.v4.idl+json

# Query Structure

Request payload:
{
  "query": "<GraphQL query string>",
  "variables": {<variables map>}
}

# Schema Introspection

Introspection query:
query IntrospectionQuery { __schema { types { name kind fields { name } } } }

# Pagination

Connection arguments:
- first: Int
- after: String (cursor)
- last: Int
- before: String (cursor)
Response includes pageInfo { hasNextPage, hasPreviousPage, startCursor, endCursor } and edges { node, cursor }.

# Rate Limits

Query cost calculated per field. Default limit: 5000 points per hour. Inspect rateLimit { limit, cost, remaining, resetAt } in a query.

# Common Errors

- 401 Unauthorized: invalid or missing token
- 502 Bad Gateway: retry after 3s backoff
- ValidationError: syntax or schema mismatch


## Attribution
- Source: GitHub GraphQL API
- URL: https://docs.github.com/en/graphql
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T05:28:48.954Z
- Data Size: 2253908 bytes
- Links Found: 17050

## Retrieved
2025-05-06
