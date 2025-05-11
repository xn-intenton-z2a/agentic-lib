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
