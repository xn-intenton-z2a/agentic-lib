sandbox/library/GRAPHQL_CALLS.md
# sandbox/library/GRAPHQL_CALLS.md
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
sandbox/library/GITHUB_REST_API.md
# sandbox/library/GITHUB_REST_API.md
# GITHUB_REST_API

## Crawl Summary
GitHub CLI: install via package manager; gh auth login stores credentials; gh api <path> --method <METHOD> with -f flags for body data; use GITHUB_TOKEN in Actions. Octokit.js: npm install; import Octokit; new Octokit({auth}); octokit.request(method path, params); catch error.status and error.response.data.message; integrate in Actions with setup-node, checkout, env TOKEN. curl: check version; curl -X <METHOD> URL -H Accept:application/vnd.github+json -H Authorization: Bearer TOKEN; embed in Actions as env GH_TOKEN.

## Normalised Extract
Table of Contents:
1 GitHub CLI Authentication
2 GitHub CLI Request Syntax
3 GitHub CLI in Actions
4 Octokit.js Setup
5 Octokit.js Request Syntax
6 Octokit.js in Actions
7 curl Request Syntax
8 curl in Actions

1 GitHub CLI Authentication
Command: gh auth login
Options: GitHub.com or Other; HTTPS or SSH; credential storage confirmation

2 GitHub CLI Request Syntax
gh api <path> --method <GET|POST|PUT|PATCH|DELETE>
Flags: -f <key=value> for request body fields
Example: gh api /user/repos --method POST -f name=repo-name -f private=true

3 GitHub CLI in Actions
Workflow keys: permissions issues:read or repo: scope, env GH_TOKEN from secrets.GITHUB_TOKEN
Run step: gh api /repos/{owner}/{repo}/issues --method GET

4 Octokit.js Setup
npm install octokit
Import: import { Octokit } from "octokit"
Instantiate: const octokit = new Octokit({ auth: 'TOKEN' })

5 Octokit.js Request Syntax
Method signature: octokit.request(route: string, params: object) => Promise<OctokitResponse>
Example: await octokit.request("GET /repos/{owner}/{repo}/issues", {owner, repo})

6 Octokit.js in Actions
Actions steps: uses actions/checkout@v4, actions/setup-node@v4 with node-version and cache npm, run npm install octokit, run node script with env TOKEN from secrets.GITHUB_TOKEN

7 curl Request Syntax
curl --request <METHOD> --url "https://api.github.com{path}" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer TOKEN"

8 curl in Actions
Use env GH_TOKEN and same curl command in a run step under workflow_dispatch with permissions issues:read

## Supplementary Details
CLI Flags: --method or -X to set HTTP method; -f key=value to set request body fields; default Accept header is application/vnd.github+json; preview media types require custom Accept values. gh auth login stores token in ~/.config/gh/hosts.yml. Use GITHUB_TOKEN in Actions automatically scoped to repo; do not hardcode personal tokens. Octokit options: auth: string; userAgent?: string; baseUrl?: string; timeZone?: string; request?: RequestInterface; previews?: string[]. Request parameters: path, query parameters, request body fields. OctokitResponse<T> contains status, headers, data: T. Curl behavior: --request sets method; default timeout 5s; use --silent or --fail for CI integration. Curl exit codes: 0 success; 6 name lookup failure; 7 connection refused; 22 HTTP error.

## Reference Details
GitHub CLI API Reference
Command:
  gh api <endpoint> [flags]
Flags:
  --method, -X <string>   HTTP method
  -f, --field <string>    Add body field key=value
  --jq <string>           Filter output with jq
  --header <string>       Add request header
Return: JSON payload to stdout; exit code 0 on success; non-zero on error.

Octokit.js SDK
Constructor:
  new Octokit(options: {
    auth: string;
    userAgent?: string;
    baseUrl?: string;
    timeZone?: string;
    request?: RequestInterface;
    previews?: string[];
  }) => OctokitInstance

Method:
  octokit.request(route: string, parameters?: RequestParameters) => Promise<OctokitResponse>
Types:
  interface RequestParameters { [key: string]: any }
  interface OctokitResponse<T = any> {
    status: number;
    url: string;
    headers: Record<string,string>;
    data: T;
  }
Exceptions:
  Throws HttpError with properties status and response.data.message

curl CLI
Command:
  curl --request <METHOD> --url <URL> --header <Header1> --header <Header2>
Headers:
  Accept: application/vnd.github+json
  Authorization: Bearer <TOKEN>
Options:
  --silent suppress progress
  --fail fail on HTTP errors (exit code 22)
  --max-time <seconds> set timeout
Exit codes:
  0 success
  22 HTTP error (>=400)
  28 operation timeout

Best Practices
• Use GITHUB_TOKEN in Actions instead of personal tokens
• Store secrets in repository secrets or variables
• Use --fail and --silent for CI scripts
• Catch and log error.status and error.response.data.message in Octokit

Troubleshooting Commands
  curl --version         # verify installation
  gh auth status        # verify CLI authentication
  node -e "console.log(require('octokit').Octokit)"  # verify SDK installation

## Information Dense Extract
CLI: brew install gh; gh auth login; gh api /repos/{owner}/{repo}/issues --method GET; in Actions: env GH_TOKEN from secrets.GITHUB_TOKEN, permissions: issues:read. Octokit.js: npm install octokit; import {Octokit}; const octokit=new Octokit({auth:'TOKEN'}); await octokit.request('GET /repos/{owner}/{repo}/issues',{owner,repo}); catch(error)=>error.status,error.response.data.message. Curl: curl -X GET -H Accept:application/vnd.github+json -H Authorization:Bearer TOKEN https://api.github.com/repos/{owner}/{repo}/issues; use --silent --fail; in Actions: env GH_TOKEN, same curl command under workflow_dispatch with permissions issues:read.

## Sanitised Extract
Table of Contents:
1 GitHub CLI Authentication
2 GitHub CLI Request Syntax
3 GitHub CLI in Actions
4 Octokit.js Setup
5 Octokit.js Request Syntax
6 Octokit.js in Actions
7 curl Request Syntax
8 curl in Actions

1 GitHub CLI Authentication
Command: gh auth login
Options: GitHub.com or Other; HTTPS or SSH; credential storage confirmation

2 GitHub CLI Request Syntax
gh api <path> --method <GET|POST|PUT|PATCH|DELETE>
Flags: -f <key=value> for request body fields
Example: gh api /user/repos --method POST -f name=repo-name -f private=true

3 GitHub CLI in Actions
Workflow keys: permissions issues:read or repo: scope, env GH_TOKEN from secrets.GITHUB_TOKEN
Run step: gh api /repos/{owner}/{repo}/issues --method GET

4 Octokit.js Setup
npm install octokit
Import: import { Octokit } from 'octokit'
Instantiate: const octokit = new Octokit({ auth: 'TOKEN' })

5 Octokit.js Request Syntax
Method signature: octokit.request(route: string, params: object) => Promise<OctokitResponse>
Example: await octokit.request('GET /repos/{owner}/{repo}/issues', {owner, repo})

6 Octokit.js in Actions
Actions steps: uses actions/checkout@v4, actions/setup-node@v4 with node-version and cache npm, run npm install octokit, run node script with env TOKEN from secrets.GITHUB_TOKEN

7 curl Request Syntax
curl --request <METHOD> --url 'https://api.github.com{path}' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer TOKEN'

8 curl in Actions
Use env GH_TOKEN and same curl command in a run step under workflow_dispatch with permissions issues:read

## Original Source
GitHub REST API Reference
https://docs.github.com/en/rest/reference

## Digest of GITHUB_REST_API

# Quickstart with GitHub REST API

## 1. GitHub CLI
### Installation
macOS: brew install gh
Windows: scoop install gh or choco install gh
Linux: download from GitHub releases or apt install gh

### Authentication
gh auth login
  • Select GitHub.com or custom hostname
  • Choose HTTPS or SSH
  • Confirm credential storage

### Making Requests
gh api <path> --method <METHOD>
Examples:
  gh api /repos/example-org/example-repo/issues --method GET
  gh api /user/repos --method POST -f name=new-repo -f private=true

## 2. GitHub CLI in GitHub Actions
```yaml
jobs:
  api:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api /repos/octocat/Spoon-Knife/issues --method GET
```

## 3. Octokit.js
### Installation
npm install octokit

### Initialization
```js
import { Octokit } from "octokit"
const octokit = new Octokit({ auth: 'YOUR-TOKEN' })
```

### Making Requests
```js
await octokit.request("GET /repos/{owner}/{repo}/issues", {
  owner: "octocat",
  repo: "Spoon-Knife"
})
```

### Error Handling
```js
try {
  // request
} catch (error) {
  console.error(error.status, error.response.data.message)
}
```

## 4. Octokit.js in GitHub Actions
```yaml
jobs:
  use_api:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '16.x'
          cache: npm
      - run: npm install octokit
      - run: node .github/actions-scripts/use-the-api.mjs
        env:
          TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Example script (.github/actions-scripts/use-the-api.mjs):
```js
import { Octokit } from "octokit"
const octokit = new Octokit({ auth: process.env.TOKEN })
const res = await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })
console.log(res.data.map(i => ({ title: i.title, author: i.user.id })))
```

## 5. curl
### Installation
Check: curl --version

### Making Requests
```sh
curl --request GET \
  --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer YOUR-TOKEN"
```

## 6. curl in GitHub Actions
```yaml
jobs:
  curl_api:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          curl --request GET \
            --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
            --header "Accept: application/vnd.github+json" \
            --header "Authorization: Bearer $GH_TOKEN"
```

## Attribution
- Source: GitHub REST API Reference
- URL: https://docs.github.com/en/rest/reference
- License: MIT License
- Crawl Date: 2025-05-11T01:22:42.439Z
- Data Size: 598872 bytes
- Links Found: 9423

## Retrieved
2025-05-11
