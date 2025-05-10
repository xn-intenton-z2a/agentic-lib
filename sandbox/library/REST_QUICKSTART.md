# REST_QUICKSTART

## Crawl Summary
GitHub CLI: gh auth login; gh api <path> --method <METHOD> --header Accept --header Authorization --field key=value. Octokit.js: npm install octokit; import { Octokit }; new Octokit({auth}); await octokit.request('GET /repos/{owner}/{repo}/issues',{owner,repo}); error.status and error.response.data.message. curl: curl --request GET --url URL --header Accept:application/vnd.github+json --header Authorization:Bearer token. Use GH_TOKEN or GITHUB_TOKEN in GitHub Actions; generate JWT via actions/create-github-app-token@v1 with app-id and private-key.

## Normalised Extract
Table of Contents
1 GitHub CLI Setup and Usage
2 Octokit.js Setup and Usage
3 curl Setup and Usage

1 GitHub CLI Setup and Usage
Install: Download and install GitHub CLI from GitHub CLI repository. Authenticate: gh auth login. Select host, choose HTTPS or SSH. Stored credentials if HTTPS. Make API calls: gh api /repos/{owner}/{repo}/issues --method GET --header Accept:application/vnd.github+json --header Authorization:Bearer YOUR-TOKEN. GitHub Actions: set env GH_TOKEN to ${{ secrets.GITHUB_TOKEN }} and run gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

2 Octokit.js Setup and Usage
Dependencies: npm install octokit. Import: import { Octokit } from "octokit". Initialize: const octokit = new Octokit({ auth: 'YOUR-TOKEN' }). Request: await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" }). Error handling: catch error; read error.status, error.response.data.message. GitHub Actions workflow: uses actions/checkout@v4, actions/setup-node@v4 node-version 16.17.0, npm install octokit, run script with env TOKEN=${{ secrets.GITHUB_TOKEN }}

3 curl Setup and Usage
Install: ensure curl installed (curl --version). Authentication: use header Authorization: Bearer YOUR-TOKEN or token. Syntax: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN". GitHub Actions: set env GH_TOKEN=${{ secrets.GITHUB_TOKEN }}, run curl command with $GH_TOKEN

## Supplementary Details
Authentication: Use personal access token or GitHub App user access token. For Apps generate installation token with actions/create-github-app-token@v1 inputs: app-id: ${{ vars.APP_ID }}, private-key: ${{ secrets.APP_PEM }}. Token expires in 60 minutes. Use env GH_TOKEN or GITHUB_TOKEN in workflows. Octokit.js supports RequestParameters interface: path params, query params, body params. curl supports JSON web token only with Bearer. CLI supports --field for form or JSON payload.

## Reference Details
GitHub CLI Method Signature: gh api <endpoint:string> --method <HTTP_METHOD:string=GET> [--header:string]* [--field:key=value]*. Returns: JSON response to stdout, exit code 0 on HTTP status 2xx, exit code 22 on HTTP errors. Flags: -v for verbose. Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

Octokit.js Method Signature: request<T = any>(route:string, parameters?: RequestParameters): Promise<OctokitResponse<T>>. RequestParameters fields: owner:string, repo:string, per_page?:number, page?:number, title?:string, body?:string. OctokitResponse<T>: { data:T; status:number; headers:IncomingHttpHeaders }. Example:
import { Octokit } from "octokit"
const octokit = new Octokit({ auth: process.env.TOKEN })
try {
  const response = await octokit.request("GET /repos/{owner}/{repo}/issues", { owner:"octocat", repo:"Spoon-Knife" })
  console.log(response.data)
} catch(error) {
  console.error(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
}

curl Command Syntax: curl --request GET --url URL --header "Accept: application/vnd.github+json" --header "Authorization: Bearer TOKEN". Debug: add -v; test version: curl --version. Check rate limit: curl --request GET --url https://api.github.com/rate_limit --header "Authorization: Bearer TOKEN". Troubleshooting: HTTP 401 unauthorized means invalid token; HTTP 403 forbidden when rate limit exceeded. Use curl --request GET --url https://api.github.com/rate_limit to inspect.

## Information Dense Extract
gh auth login; gh api /repos/{owner}/{repo}/issues --method GET --header "Accept:application/vnd.github+json" --header "Authorization:Bearer TOKEN"; npm install octokit; import {Octokit}; new Octokit({auth}); await octokit.request("GET /repos/{owner}/{repo}/issues",{owner,repo}); catch error.status,error.response.data.message; curl --request GET --url URL --header Accept:application/vnd.github+json --header Authorization:Bearer TOKEN; use GH_TOKEN or GITHUB_TOKEN in workflows; generate app token via actions/create-github-app-token@v1 with app-id,private-key; token expires 60m; debug: gh --version,curl --version, gh api /rate_limit

## Sanitised Extract
Table of Contents
1 GitHub CLI Setup and Usage
2 Octokit.js Setup and Usage
3 curl Setup and Usage

1 GitHub CLI Setup and Usage
Install: Download and install GitHub CLI from GitHub CLI repository. Authenticate: gh auth login. Select host, choose HTTPS or SSH. Stored credentials if HTTPS. Make API calls: gh api /repos/{owner}/{repo}/issues --method GET --header Accept:application/vnd.github+json --header Authorization:Bearer YOUR-TOKEN. GitHub Actions: set env GH_TOKEN to ${{ secrets.GITHUB_TOKEN }} and run gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

2 Octokit.js Setup and Usage
Dependencies: npm install octokit. Import: import { Octokit } from 'octokit'. Initialize: const octokit = new Octokit({ auth: 'YOUR-TOKEN' }). Request: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' }). Error handling: catch error; read error.status, error.response.data.message. GitHub Actions workflow: uses actions/checkout@v4, actions/setup-node@v4 node-version 16.17.0, npm install octokit, run script with env TOKEN=${{ secrets.GITHUB_TOKEN }}

3 curl Setup and Usage
Install: ensure curl installed (curl --version). Authentication: use header Authorization: Bearer YOUR-TOKEN or token. Syntax: curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer YOUR-TOKEN'. GitHub Actions: set env GH_TOKEN=${{ secrets.GITHUB_TOKEN }}, run curl command with $GH_TOKEN

## Original Source
GitHub REST API
https://docs.github.com/en/rest

## Digest of REST_QUICKSTART

# GitHub CLI Quickstart

## Installation
Install GitHub CLI on macOS, Windows, or Linux. See https://github.com/cli/cli#installation.

## Authentication
Command: gh auth login
Prompts:
- Select GitHub.com or Other and enter hostname.
- Choose protocol: HTTPS stores credentials automatically; SSH config as usual.

## API Requests
Syntax: gh api <path> --method <METHOD> [--header <header>] [--field <name>=<value>]
Example: gh api /repos/octocat/Spoon-Knife/issues --method GET

## GitHub Actions Example
Environment variable: GH_TOKEN=${{ secrets.GITHUB_TOKEN }}
Run step:
  run: gh api https://api.github.com/repos/octocat/Spoon-Knife/issues

# Using Octokit.js

## Installation
npm install octokit

## Import
import { Octokit } from "octokit"

## Initialization
const octokit = new Octokit({ auth: 'YOUR-TOKEN' })

## Request Example
await octokit.request("GET /repos/{owner}/{repo}/issues", {
  owner: "octocat",
  repo: "Spoon-Knife",
})

## Error Handling
try {
  // request
} catch (error) {
  console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
}

## GitHub Actions Workflow
jobs:
  use_api_via_script:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '16.17.0'
          cache: npm
      - run: npm install octokit
      - run: node .github/actions-scripts/use-the-api.mjs
        env:
          TOKEN: ${{ secrets.GITHUB_TOKEN }}

# Using curl

## Authentication Header
Authorization: Bearer YOUR-TOKEN or Authorization: token YOUR-TOKEN

## Request Syntax
curl --request GET \
  --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer YOUR-TOKEN"

## GitHub Actions Example
Environment variable: GH_TOKEN=${{ secrets.GITHUB_TOKEN }}
Run step:
  run: |
    curl --request GET \
      --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
      --header "Accept: application/vnd.github+json" \
      --header "Authorization: Bearer $GH_TOKEN"

## Attribution
- Source: GitHub REST API
- URL: https://docs.github.com/en/rest
- License: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Crawl Date: 2025-05-10T23:57:21.004Z
- Data Size: 2252959 bytes
- Links Found: 16072

## Retrieved
2025-05-10
