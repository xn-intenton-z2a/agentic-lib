# REST_API

## Crawl Summary
GitHub CLI: authenticate with gh auth login; make API calls with gh api PATH --method METHOD. Personal Access Token auth: set GH_TOKEN or GITHUB_TOKEN environment variable; use in CLI, curl, or Octokit.js. GitHub App auth: use actions/create-github-app-token@v1 with inputs app-id and private-key; assign outputs.token to GH_TOKEN. Octokit.js: install via npm install octokit; instantiate with new Octokit({auth}); method signature octokit.request("METHOD /route", params) returns Promise with status, headers, data. curl: use --request, --url, Accept header application/vnd.github+json, Authorization: Bearer YOUR-TOKEN. API versioning: X-GitHub-Api-Version header set to date-based version (2022-11-28); default to latest; unsupported yields 400; supported versions list. Breaking changes: defined criteria; none in initial version.

## Normalised Extract
Table of Contents:
1. GitHub CLI Quickstart
2. Environment Variable Authentication
3. GitHub App Installation Token
4. Octokit.js Usage
5. Curl Usage
6. API Versioning

1. GitHub CLI Quickstart
Install GitHub CLI on macOS/Windows/Linux. Authenticate with:
  gh auth login
Make a request with:
  gh api <endpoint> --method <METHOD>

2. Environment Variable Authentication
Set GH_TOKEN (or GITHUB_TOKEN in Actions) to your token. In a workflow step:
  - env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: gh api https://api.github.com/repos/{owner}/{repo}/issues
Permissions: issues: read

3. GitHub App Installation Token
In workflow:
  - name: Generate token
    id: generate-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PEM }}
  - name: Use API
    env:
      GH_TOKEN: ${{ steps.generate-token.outputs.token }}
    run: gh api https://api.github.com/repos/{owner}/{repo}/issues

4. Octokit.js Usage
Install: npm install octokit
Import: import { Octokit } from "octokit"
Instantiate: const octokit = new Octokit({ auth: process.env.TOKEN })
Request:
  await octokit.request("GET /repos/{owner}/{repo}/issues", { owner, repo })
Error handling:
  catch error { log error.status and error.response.data.message }

5. Curl Usage
curl --request GET \
  --url "https://api.github.com/repos/{owner}/{repo}/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer YOUR-TOKEN"

6. API Versioning
Header: X-GitHub-Api-Version:2022-11-28
Default version: 2022-11-28
Unsupported version: HTTP 400
Supported versions: ["2022-11-28"]

## Supplementary Details
GitHub CLI flags: --method or -X to specify HTTP verb; gh api supports query parameters via --field or pass JSON. curl headers: Accept: application/vnd.github+json; Authorization: Bearer <token> or Authorization: token <token>. GitHub Actions workflow keys: on: workflow_dispatch; jobs.<id>.runs-on: ubuntu-latest; jobs.<id>.permissions: issues: read; steps[].uses: actions/checkout@v4; actions/setup-node@v4 with node-version: '16.17.0', cache: npm; steps to install octokit: run: npm install octokit; environment variable injection via env:. Octokit.request signature: request(route: string, parameters: object) => Promise<{ status: number; url: string; headers: object; data: any }>. Rate-limit headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. To inspect: add -i to curl to view headers.

## Reference Details
Endpoint: GET /repos/{owner}/{repo}/issues
Parameters:
  owner (string, required): repository owner login
  repo (string, required): repository name
Response: 200 OK, application/json, body: [Issue]
Issue object fields (partial):
  id (number)
  number (number)
  title (string)
  user (object){ login (string), id (number) }
  state (string)
  body (string)
Errors:
  401 Unauthorized: invalid or missing token
  403 Forbidden: insufficient scope or rate limit exceeded
  404 Not Found: invalid owner or repo

Octokit.js method signature:
  request<T>(route: string, parameters: object) => Promise<{ status: number; url: string; headers: object; data: T }>
Example:
  import { Octokit } from "octokit"
  const octokit = new Octokit({ auth: 'PAT_TOKEN' })
  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" })
    console.log(response.data)
  } catch (error) {
    console.error(`Error ${error.status}: ${error.response.data.message}`)
  }

GitHub CLI usage:
  gh api <endpoint> --method <METHOD> [--input <json_file>] [--jq <jq_filter>]
Example:
  gh api /repos/octocat/Spoon-Knife/issues --method GET

Curl usage:
  curl --request GET \
    --url "https://api.github.com/repos/{owner}/{repo}/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"

API Versioning header:
  X-GitHub-Api-Version: YYYY-MM-DD
Effect: selects specific version schema; default if absent. Unsupported => HTTP 400.

Best practices:
  - Use built-in GITHUB_TOKEN in Actions for minimal scope
  - Store PAT or App private key as Actions secret
  - Check rate-limit headers to avoid retry storms
  - Use pagination: inspect Link header and use per_page, page query parameters
  - Retry on 502 and 503 with exponential backoff

Troubleshooting:
  curl -i --request GET ... to view response headers
  On 401: verify token scopes include repo or relevant scopes
  On 403: inspect X-RateLimit-Remaining and X-RateLimit-Reset
  On 400 version errors: confirm X-GitHub-Api-Version header format and supported values

## Information Dense Extract
GH CLI: gh auth login; gh api <endpoint> --method <METHOD>; token via GH_TOKEN/GITHUB_TOKEN. GitHub App: actions/create-github-app-token@v1 inputs app-id, private-key; outputs.token as GH_TOKEN. Octokit.js: npm install octokit; import Octokit; const o=new Octokit({auth}); await o.request("METHOD /route", params) returns {status, headers, data}. Curl: curl --request GET --url "https://api.github.com/repos/{owner}/{repo}/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer TOKEN". API version: X-GitHub-Api-Version:2022-11-28; default to latest; unsupported => 400. Endpoint GET /repos/{owner}/{repo}/issues parameters owner:string, repo:string returns Issue[]. Errors: 401,403,404. Best practices: use GITHUB_TOKEN in Actions, inspect X-RateLimit-Remaining, paginate via Link header, retry 502/503 with backoff.

## Sanitised Extract
Table of Contents:
1. GitHub CLI Quickstart
2. Environment Variable Authentication
3. GitHub App Installation Token
4. Octokit.js Usage
5. Curl Usage
6. API Versioning

1. GitHub CLI Quickstart
Install GitHub CLI on macOS/Windows/Linux. Authenticate with:
  gh auth login
Make a request with:
  gh api <endpoint> --method <METHOD>

2. Environment Variable Authentication
Set GH_TOKEN (or GITHUB_TOKEN in Actions) to your token. In a workflow step:
  - env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: gh api https://api.github.com/repos/{owner}/{repo}/issues
Permissions: issues: read

3. GitHub App Installation Token
In workflow:
  - name: Generate token
    id: generate-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PEM }}
  - name: Use API
    env:
      GH_TOKEN: ${{ steps.generate-token.outputs.token }}
    run: gh api https://api.github.com/repos/{owner}/{repo}/issues

4. Octokit.js Usage
Install: npm install octokit
Import: import { Octokit } from 'octokit'
Instantiate: const octokit = new Octokit({ auth: process.env.TOKEN })
Request:
  await octokit.request('GET /repos/{owner}/{repo}/issues', { owner, repo })
Error handling:
  catch error { log error.status and error.response.data.message }

5. Curl Usage
curl --request GET '
  --url 'https://api.github.com/repos/{owner}/{repo}/issues' '
  --header 'Accept: application/vnd.github+json' '
  --header 'Authorization: Bearer YOUR-TOKEN'

6. API Versioning
Header: X-GitHub-Api-Version:2022-11-28
Default version: 2022-11-28
Unsupported version: HTTP 400
Supported versions: ['2022-11-28']

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of REST_API

# Document Detailed Digest

Date retrieved: 2024-06-18
Source: https://docs.github.com/en/rest
Data Size: 1141593 bytes
Links Found: 12391

# Quickstart with GitHub CLI
Install GitHub CLI on macOS, Windows, or Linux: see https://github.com/cli/cli#installation
Authenticate interactively:
  gh auth login
Make API request:
  gh api /octocat --method GET
  gh api PATH --method METHOD

# Authenticating with a Personal Access Token
Set environment variable:
  GH_TOKEN or GITHUB_TOKEN (recommended in GitHub Actions)
Example workflow step:
  - env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    run: |
      gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

# Authenticating with a GitHub App Installation Token
Generate token in workflow:
  - name: Generate token
    id: generate-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PEM }}
Use generated token:
  - name: Use API
    env:
      GH_TOKEN: ${{ steps.generate-token.outputs.token }}
    run: |
      gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

# Octokit.js Usage
Install SDK:
  npm install octokit
Import and instantiate:
  import { Octokit } from "octokit"
  const octokit = new Octokit({ auth: 'YOUR-TOKEN' })
Execute request:
  await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife",
  })
Error handling:
  catch error {
    error.status  // HTTP status code
    error.response.data.message  // API error message
  }

# Using curl
Make request:
  curl --request GET \
    --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"

# API Versioning
Specify version header:
  X-GitHub-Api-Version: 2022-11-28
Default version if omitted: 2022-11-28
Unsupported version response: HTTP 400
Supported versions: 2022-11-28 (first date-based version)

# Breaking Changes
Breaking change criteria: removing operations, renaming parameters or response fields, adding required parameters, changing types, removing enum values, new validation rules, auth changes
Version 2022-11-28: no breaking changes


## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: Creative Commons Attribution 4.0 International
- Crawl Date: 2025-05-19T18:30:05.994Z
- Data Size: 1141593 bytes
- Links Found: 12391

## Retrieved
2025-05-19
