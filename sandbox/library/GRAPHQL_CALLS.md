# GRAPHQL_CALLS

## Crawl Summary
POST https://api.github.com/graphql with Authorization: Bearer <token>, Content-Type: application/json, Accept: application/vnd.github.v4+json. Body must include query:string, optional variables:object, operationName:string. Response HTTP 200 JSON {data, errors}. 401,502,422 errors. Cursor pagination via first/after or last/before. rateLimit object with fields limit:Int, cost:Int, remaining:Int, resetAt:DateTime.

## Normalised Extract
Table of Contents
1 Authentication Headers
2 Endpoint URL
3 Request Headers
4 Request Body
5 Response Schema
6 Error Handling
7 Pagination Pattern
8 Rate Limit Query

1 Authentication Headers
  Header: Authorization: Bearer <PERSONAL_ACCESS_TOKEN>
  Token must have scopes matching accessed resources (repo,user,admin:org,etc.)

2 Endpoint URL
  POST https://api.github.com/graphql

3 Request Headers
  Content-Type: application/json
  Accept: application/vnd.github.v4+json
  Authorization: Bearer <TOKEN>

4 Request Body
  JSON object:
    query: string (required)
    variables: object (optional)
    operationName: string (optional)

5 Response Schema
  HTTP 200
  data: JSON object matching query structure
  errors: array of {message:string,locations:[{line:int,column:int}],path:[string|int]}

6 Error Handling
  401 Unauthorized: invalid token or missing header
  502 Bad Gateway: retry with exponential backoff
  422 Unprocessable Entity: GraphQL syntax or validation error

7 Pagination Pattern
  Use cursor arguments on connections:
    first:int, after:string OR last:int, before:string
  Inspect pageInfo: hasNextPage:boolean, endCursor:string

8 Rate Limit Query
  query {
    rateLimit {
      limit:Int!
      cost:Int!
      remaining:Int!
      resetAt:DateTime!
    }
  }

## Supplementary Details
Complexity cost parameters: each field consumed adds to cost total; default cost limit=5000 per hour. Schema introspection allowed; public schema downloadable at https://api.github.com/graphql/schema.docs.graphql. Use GraphQL variables to avoid query string injection and caching issues. Batch queries by aliasing identical field sets. Support for UTF-8 in variables. Maximum query depth limited to 10 by default; errors if exceeded. Default timeout 60s. For retry logic, use exponential backoff with jitter starting at 500ms, max 8s, 5 attempts.

## Reference Details
HTTP Method: POST
Endpoint: https://api.github.com/graphql
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
  Accept: application/vnd.github.v4+json
Request Body Parameters:
  query: string, required, UTF-8, no control chars
  variables: object, optional, JSON-serializable
  operationName: string, optional
Response:
  200 OK: JSON {data:object, errors?:array<Error>} 
  Error: HTTP status codes 401,502,422
Error Object:
  message:string
  locations:array<{line:int,column:int}>
  path:array<string|int>
GraphQL Variable Declaration Example:
  query($owner:String!,$name:String!){
    repository(owner:$owner,name:$name){
      issues(first:10){nodes{title,url}}
    }
  }
Variables Example:
  {"owner":"octocat","name":"Hello-World"}
Node.js SDK Method Signature:
  import { graphql } from "@octokit/graphql"
  async function callGraphQL<T = any>(
    query: string,
    variables?: Record<string,unknown>,
    token?: string
  ): Promise<T>;
Implementation Pattern:
  const graphqlWithAuth = graphql.defaults({ headers: { authorization: `token ${TOKEN}` } })
  const data = await graphqlWithAuth<{repository:{name:string}}>(
    `query { repository(owner:\"o\",name:\"n\"){name}}`
  )
Pagination Example:
  async function fetchAllIssues(owner:string,name:string){
    let cursor: string | null = null;
    const all: any[] = [];
    while(true){
      const res = await graphqlWithAuth<{
        repository:{issues:{nodes:any[],pageInfo:{hasNextPage:boolean,endCursor:string}}}
      }>(
        `query($owner:String!,$name:String!,$after:String){
          repository(owner:$owner,name:$name){
            issues(first:100,after:$after){nodes{title},pageInfo{hasNextPage,endCursor}}
          }
        }`,
        {owner,name,after:cursor}
      )
      all.push(...res.repository.issues.nodes)
      if(!res.repository.issues.pageInfo.hasNextPage) break;
      cursor = res.repository.issues.pageInfo.endCursor;
    }
    return all;
  }
Best Practices:
  - Always use variables for dynamic values.
  - Limit returned fields to only needed ones.
  - Check rateLimit cost before heavy queries.
  - Use pagination for large lists.
Troubleshooting:
  Command: curl -H "Authorization: Bearer WRONG" -X POST https://api.github.com/graphql -d '{"query":"{viewer{login}}"}'
  Expected: HTTP 401 {"message":"Bad credentials"}
  Command: curl -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -X POST https://api.github.com/graphql -d '{"query":"malformed"}'
  Expected: HTTP 422 {"errors":[{"message":"Syntax Error"}]}
  For 502 errors retry after 500ms backoff, up to 5 times.

## Information Dense Extract
POST https://api.github.com/graphql Authorization:Bearer<TOKEN> Content-Type:application/json Accept:application/vnd.github.v4+json query:string variables:object? operationName:string? response:data:Object errors?:[{message:string,locations:[{line:int,column:int}],path:[string|int]}] errors:401,502,422 Cursor pagination via first/after or last/before inspect pageInfo{hasNextPage,endCursor} RateLimit query: rateLimit{limit:Int cost:Int remaining:Int resetAt:DateTime} Node.js sdk: graphql(query:string,variables?:object) default headers:{authorization:`token ${TOKEN}`} retries:exponential backoff(500ms→8s) depth≤10 cost≤5000/hr

## Sanitised Extract
Table of Contents
1 Authentication Headers
2 Endpoint URL
3 Request Headers
4 Request Body
5 Response Schema
6 Error Handling
7 Pagination Pattern
8 Rate Limit Query

1 Authentication Headers
  Header: Authorization: Bearer <PERSONAL_ACCESS_TOKEN>
  Token must have scopes matching accessed resources (repo,user,admin:org,etc.)

2 Endpoint URL
  POST https://api.github.com/graphql

3 Request Headers
  Content-Type: application/json
  Accept: application/vnd.github.v4+json
  Authorization: Bearer <TOKEN>

4 Request Body
  JSON object:
    query: string (required)
    variables: object (optional)
    operationName: string (optional)

5 Response Schema
  HTTP 200
  data: JSON object matching query structure
  errors: array of {message:string,locations:[{line:int,column:int}],path:[string|int]}

6 Error Handling
  401 Unauthorized: invalid token or missing header
  502 Bad Gateway: retry with exponential backoff
  422 Unprocessable Entity: GraphQL syntax or validation error

7 Pagination Pattern
  Use cursor arguments on connections:
    first:int, after:string OR last:int, before:string
  Inspect pageInfo: hasNextPage:boolean, endCursor:string

8 Rate Limit Query
  query {
    rateLimit {
      limit:Int!
      cost:Int!
      remaining:Int!
      resetAt:DateTime!
    }
  }

## Original Source
GitHub API (REST & GraphQL)
https://docs.github.com/en/graphql

## Digest of GRAPHQL_CALLS

# Authentication

Use a GitHub personal access token or OAuth token in the HTTP Authorization header.  The token must include at least the scopes needed for your queries or mutations ("repo", "user", etc.).  Example header:

    Authorization: Bearer <TOKEN>

# Endpoint

All operations are performed against the single endpoint:

    POST https://api.github.com/graphql

# Required Headers

    Authorization: Bearer <TOKEN>
    Content-Type: application/json
    Accept: application/vnd.github.v4+json

# Request Payload

The POST body must be a JSON object with the following fields:

    {
      "query": "<GraphQL query string>",         # required, UTF-8, no newlines in header
      "variables": { <object> },                  # optional
      "operationName": "<name>"                 # optional
    }

# Response Structure

Successful responses return HTTP 200 with a JSON body:

    {
      "data": { ... },            # query result data matching schema
      "errors": [                 # optional
        {
          "message": "<error msg>",
          "locations": [ {"line":n,"column":m} ],
          "path": [ "fieldName", ... ]
        }, …
      ]
    }

# Error Codes

401 Unauthorized: invalid or missing token

502 Bad Gateway: transient service error, retry with backoff

422 Unprocessable Entity: syntax error in query

# Pagination Pattern

Use cursor-based pagination: include `first` or `last` and `after` or `before` on connection fields:

    {
      repository(owner:"o",name:"n"){ issues(first:100,after:"CURSOR"){ pageInfo{endCursor,hasNextPage} edges{node{…}} }}
    }

# Rate Limit Query

    query { rateLimit { limit cost remaining resetAt } }

# Retrieval Date

Content retrieved: 2024-06-15

# Attribution & Data Size

Source: GitHub GraphQL API docs (https://docs.github.com/en/graphql)
Data Size: 2415503 bytes

## Attribution
- Source: GitHub API (REST & GraphQL)
- URL: https://docs.github.com/en/graphql
- License: MIT License
- Crawl Date: 2025-05-11T01:37:21.066Z
- Data Size: 2415503 bytes
- Links Found: 20648

## Retrieved
2025-05-11
