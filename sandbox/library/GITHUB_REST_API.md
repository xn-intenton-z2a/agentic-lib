# GITHUB_REST_API

## Crawl Summary
Authentication: Authorization: Bearer <token> or token <token>, env GH_TOKEN/GITHUB_TOKEN. API versioning: X-GitHub-Api-Version header, default 2022-11-28, supported 2022-11-28. CLI: gh auth login, gh api <path> --method. Octokit.js: npm install octokit, new Octokit({auth}), octokit.request(method/path, params). cURL: curl --request GET --url <endpoint> --header Accept:application/vnd.github+json --header Authorization:Bearer <token>. Pagination: parse Link header rel=next/last. Rate limits: X-RateLimit-Limit/Remaining/Reset headers. Troubleshooting: 401 Bad credentials, 403 rate limit, backoff and retry.

## Normalised Extract
Table of Contents:
1. Authentication
2. API Versioning
3. Rate Limiting
4. Pagination
5. GitHub CLI Usage
6. Octokit.js Usage
7. cURL Usage
8. Troubleshooting

1. Authentication
Header: Authorization: Bearer <token> or token <token>
Env Variables: GH_TOKEN, GITHUB_TOKEN
Token Scopes: repo, read:org, user, workflow

2. API Versioning
Header: X-GitHub-Api-Version:YYYY-MM-DD
default:2022-11-28
Supported versions:2022-11-28

3. Rate Limiting
Headers: X-RateLimit-Limit:5000, X-RateLimit-Remaining:<n>, X-RateLimit-Reset:<epoch>
Reset unit: seconds since epoch

4. Pagination
Response Header: Link with rel="next", rel="last"
Navigate pages until rel="next" absent

5. GitHub CLI Usage
Install: gh installation instructions
Authenticate: gh auth login
API: gh api <path> --method <METHOD> [-H headers]
Env var override: GH_TOKEN

6. Octokit.js Usage
Install: npm install octokit
Import: import {Octokit} from "octokit"
Init: new Octokit({auth:"<token>"})
Method: octokit.request(method path, {owner:string,repo:string,...})
Return: Promise<{status:number,headers:object,data:any}>

7. cURL Usage
curl --request <METHOD> --url "https://api.github.com<path>" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer <token>"

8. Troubleshooting
401: Bad credentials -> verify token and header
403: Forbidden -> check X-RateLimit-Remaining, wait until X-RateLimit-Reset
500: inspect response body for error code and message

## Supplementary Details
Environment Variables:
  GH_TOKEN: personal or app token
  GITHUB_TOKEN: built-in Actions token

CLI Flags:
  --method/-X: HTTP verb
  --header/-H: custom headers
  --input: JSON body from file or stdin

Octokit Options:
  auth: string token
  userAgent: default "octokit.js/{version}"
  baseUrl: default "https://api.github.com"
  previews: []
  request: { timeout: 0 }

GitHub Actions Example:
permissions:
  issues: read
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: '16.17.0'
      cache: npm
  - run: npm install octokit
  - env:
      TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: |
      node .github/actions-scripts/use-the-api.mjs

Token Scopes:
  repo: full control of private repos
  read:org: read-only organization data
  user: read/write user profile
  workflow: update GitHub Actions workflows

## Reference Details
GitHub CLI api Subcommand:
Signature: gh api <path> [flags]
Flags:
  --method, -X <string>   HTTP method to use
  --header, -H <string>   HTTP header
  --input, -f <file|@file>
Examples:
  gh api /repos/{owner}/{repo}/issues --method GET
  gh api graphql -f query='{viewer{login}}'

Octokit.js API:
Class: Octokit
Constructor: new Octokit(options?: {
  auth?: string | { id: number; privateKey: string; installationId?: number }
  baseUrl?: string
  userAgent?: string
  previews?: string[]
  request?: { timeout?: number; agent?: http.Agent }
})

Method: octokit.request<T = any>(
  route: string,
  parameters?: Record<string, unknown>
): Promise<{ status: number; headers: Record<string, string>; data: T }>

Examples:
  await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife"
  })

cURL Commands:
  curl --request GET \
    --url "https://api.github.com/repos/{owner}/{repo}/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"

API Versioning Header:
  Header: X-GitHub-Api-Version: YYYY-MM-DD
  Default: 2022-11-28
  400 error if unsupported

Rate Limit Headers:
  X-RateLimit-Limit: number (5000)
  X-RateLimit-Remaining: number
  X-RateLimit-Reset: epoch seconds

Pagination Link Header Format:
  Link: <url?page=2>; rel="next", <url?page=last>; rel="last"

Best Practices:
  Always set Accept header: application/vnd.github+json
  Use built-in GITHUB_TOKEN in Actions
  Check X-RateLimit-Remaining before bulk calls
  Implement exponential backoff on 403

Troubleshooting:
  401 Unauthorized:
    curl returns {"message":"Bad credentials","documentation_url":"..."}
    Fix: regenerate token, check scope, correct header format
  403 Forbidden:
    Response headers: X-RateLimit-Remaining: 0
    Wait until X-RateLimit-Reset epoch or implement backoff
  500+ errors:
    Inspect error.status, error.response.data.message
    Retry with delay

## Information Dense Extract
Auth: Authorization: Bearer <token> | env: GH_TOKEN,GITHUB_TOKEN | Scopes: repo,read:org,user,workflow; API Version: X-GitHub-Api-Version:2022-11-28(default) | Pagination: Link header rel=next/last; RateLimit: Limit=5000,Remaining,Reset(epoch); CLI: gh auth login; gh api <path> --method <METHOD> [-H header]; Octokit: new Octokit({auth,baseUrl,userAgent,request:{timeout}}).request(route,params)->Promise<{status,headers,data}>; cURL: curl -X GET "https://api.github.com<path>" -H "Accept:application/vnd.github+json" -H "Authorization:Bearer <token>"; Actions: permissions:issues:read; uses:actions/setup-node@v4 node-version:'16.17.0'; Backoff: exponential on 403; Troubleshoot: 401->check token & header, 403->check X-RateLimit-Remaining, wait until Reset

## Sanitised Extract
Table of Contents:
1. Authentication
2. API Versioning
3. Rate Limiting
4. Pagination
5. GitHub CLI Usage
6. Octokit.js Usage
7. cURL Usage
8. Troubleshooting

1. Authentication
Header: Authorization: Bearer <token> or token <token>
Env Variables: GH_TOKEN, GITHUB_TOKEN
Token Scopes: repo, read:org, user, workflow

2. API Versioning
Header: X-GitHub-Api-Version:YYYY-MM-DD
default:2022-11-28
Supported versions:2022-11-28

3. Rate Limiting
Headers: X-RateLimit-Limit:5000, X-RateLimit-Remaining:<n>, X-RateLimit-Reset:<epoch>
Reset unit: seconds since epoch

4. Pagination
Response Header: Link with rel='next', rel='last'
Navigate pages until rel='next' absent

5. GitHub CLI Usage
Install: gh installation instructions
Authenticate: gh auth login
API: gh api <path> --method <METHOD> [-H headers]
Env var override: GH_TOKEN

6. Octokit.js Usage
Install: npm install octokit
Import: import {Octokit} from 'octokit'
Init: new Octokit({auth:'<token>'})
Method: octokit.request(method path, {owner:string,repo:string,...})
Return: Promise<{status:number,headers:object,data:any}>

7. cURL Usage
curl --request <METHOD> --url 'https://api.github.com<path>' '
  --header 'Accept: application/vnd.github+json' '
  --header 'Authorization: Bearer <token>'

8. Troubleshooting
401: Bad credentials -> verify token and header
403: Forbidden -> check X-RateLimit-Remaining, wait until X-RateLimit-Reset
500: inspect response body for error code and message

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_REST_API

# Quickstart (Retrieved 2024-06-15)

Data Size: 605479 bytes  
Links Found: 9226  
Source: GitHub REST API documentation (https://docs.github.com/en/rest)

# GitHub CLI Authentication and Requests

Install CLI on macOS/Windows/Linux.  
Authenticate:
```
gh auth login
```  
Select GitHub.com or Other + hostname.  

Make requests:
```
gh api /octocat --method GET
```  
Flags: --method or -X, --input, -H.

# API Versioning

Specify version:
```
curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen
```  
Default if header absent: 2022-11-28.  
Supported: 2022-11-28.  

# Authentication Headers

Personal Access Token or JWT or GitHub App token.  
Header formats:
```
Authorization: Bearer <token>
Authorization: token <token>
```  
JWT must use Bearer.  
Env vars:
```
GH_TOKEN  
GITHUB_TOKEN
```  

# Octokit.js Usage

Install:
```
npm install octokit
```  
Import & init:
```js
import { Octokit } from "octokit";
const octokit = new Octokit({ auth: process.env.TOKEN });
```  
Request:
```js
await octokit.request("GET /repos/{owner}/{repo}/issues", {
  owner: "octocat",
  repo: "Spoon-Knife"
});
```  
Return: Promise<{ status:number; headers:object; data:any }>.

# cURL Usage

Authenticate + accept header + token:
```
curl --request GET \
  --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer YOUR-TOKEN"
```

# Pagination

Check response header:
```
Link: <https://api.github.com/.../issues?page=2>; rel="next", <...page=last>; rel="last"
```  
Follow rel="next" until absent.

# Rate Limits

Headers per response:
```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: <remaining>
X-RateLimit-Reset: <epoch-seconds>
```  

# Troubleshooting

401 -> check token format and scopes.  
403 -> inspect X-RateLimit-Remaining, backoff and retry.  



## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License if known
- Crawl Date: 2025-05-18T12:30:27.375Z
- Data Size: 605479 bytes
- Links Found: 9226

## Retrieved
2025-05-18
