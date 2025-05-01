# GITHUB_REST

## Crawl Summary
The GitHub REST API documentation includes authentication methods via GitHub CLI, Octokit.js, and curl. API versioning is controlled by the X-GitHub-Api-Version header (default 2022-11-28) with clear upgrade guidelines. Endpoints are categorized (issues, PRs, repos, etc.) and include detailed parameter handling, response structures, and configuration for GitHub Actions usage. Essential code examples demonstrate API requests, token management, and troubleshooting strategies.

## Normalised Extract
TABLE OF CONTENTS:
  1. Authentication using GitHub CLI
    - Command: gh auth login, gh api /octocat --method GET
    - GitHub Actions configuration with GH_TOKEN environment variable
  2. Authentication using Octokit.js
    - Installation: npm install octokit
    - SDK instantiation: new Octokit({ auth: 'YOUR-TOKEN' })
    - Request method: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' })
  3. Authentication using curl
    - curl command with headers: Accept: application/vnd.github+json, Authorization: Bearer YOUR-TOKEN
    - GitHub Actions curl usage
  4. API Versioning
    - Use header X-GitHub-Api-Version with value 2022-11-28
    - Guidelines for upgrading and handling breaking changes
  5. GitHub App Authentication
    - Configure APP_ID and private key (APP_PEM)
    - Generate token with actions/create-github-app-token@v1 and use in subsequent API calls

DETAILS:
1. GitHub CLI: Execute 'gh auth login' to authenticate; use 'gh api /endpoint --method METHOD' for API requests; in workflows, set GH_TOKEN using secrets.
2. Octokit.js: Import Octokit from 'octokit'; instantiate with auth token; uses async requests with proper parameter mapping.
3. Curl: Use curl commands with proper Authorization header; ensure token security and compliance with header formats.
4. API Versioning: Requests must include header X-GitHub-Api-Version to handle version compatibility; default is 2022-11-28; check error codes for unsupported versions.
5. GitHub App: Use GitHub App token generation steps, secure storage of keys, and generate tokens that expire after 60 minutes.

## Supplementary Details
Authentication:
- GitHub CLI: Use 'gh auth login'; no additional configuration required if using HTTPS.
- Octokit.js: Installation via npm; instantiate with { auth: 'YOUR-TOKEN' }.
- Curl: Include '--header "Authorization: Bearer YOUR-TOKEN"' in command.

API Versioning:
- Header: X-GitHub-Api-Version must be set to '2022-11-28' unless otherwise specified.

GitHub App Authentication:
- Configure APP_ID and store private key with delimiters (-----BEGIN RSA PRIVATE KEY-----, -----END RSA PRIVATE KEY-----).
- Use GitHub Action: actions/create-github-app-token@v1 with inputs app-id and private-key.

Configuration in GitHub Actions:
- Set up node with actions/setup-node, install dependencies with npm install octokit, and check out repository with actions/checkout.
- Environment variables: Use GH_TOKEN or TOKEN, sourced from secrets.

Best Practices:
- Use built-in GITHUB_TOKEN if possible.
- Store access tokens as secrets and do not hardcode them.
- Test API calls locally before integrating in workflows.
- Monitor rate limits via response headers.

Troubleshooting:
- Check HTTP status codes; 400 indicates invalid API version if header is misconfigured.
- Verify token scopes if response indicates insufficient permissions.
- Use verbose logging in CI to capture error responses.

## Reference Details
GitHub CLI:
  Method: gh auth login
  API Call: gh api /octocat --method GET
  In Actions:
    YAML:
      jobs:
        use_api:
          runs-on: ubuntu-latest
          permissions:
            issues: read
          steps:
            - env:
                GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
              run: |
                gh api https://api.github.com/repos/octocat/Spoon-Knife/issues
Octokit.js:
  Installation: npm install octokit
  Import: const { Octokit } = require('octokit');
  Instantiation: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
  Request Example:
    await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "octocat",
      repo: "Spoon-Knife"
    });
  In Actions:
    Workflow:
      - uses: actions/setup-node@v4
      - run: npm install octokit
      - run: node .github/actions-scripts/use-the-api.mjs
        env:
          TOKEN: ${{ secrets.GITHUB_TOKEN }}
Curl:
  Command:
    curl --request GET \
    --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"
  In Actions:
    YAML similar to above with GH_TOKEN environment variable.
API Versioning:
  Header: X-GitHub-Api-Version: 2022-11-28
  Behavior: Default if header not provided; 400 error if using unsupported version.
GitHub App Authentication:
  Action: actions/create-github-app-token@v1
  Inputs:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.APP_PEM }}
  Token expires after 60 minutes.
Troubleshooting:
  - Validate HTTP response codes.
  - Check error.status and error.response.data.message in catch blocks for Octokit.
  - Ensure secrets are correctly configured in GitHub Actions.
  - Use verbose logging (e.g., curl -v) for debugging network issues.

## Information Dense Extract
GitHub REST API; CLI: gh auth login, gh api /octocat --method GET; Octokit: npm install octokit, new Octokit({ auth: 'YOUR-TOKEN' }), await octokit.request('GET /repos/{owner}/{repo}/issues',{owner:'octocat',repo:'Spoon-Knife'}); Curl: curl --request GET --url 'https://api.github.com/repos/octocat/Spoon-Knife/issues' --header 'Accept: application/vnd.github+json' --header 'Authorization: Bearer YOUR-TOKEN'; API Version: Header X-GitHub-Api-Version=2022-11-28; GitHub App: actions/create-github-app-token@v1 with app-id and private-key; Workflow YAML examples provided; Troubleshooting: check response codes, use verbose logging, secure tokens as secrets.

## Sanitised Extract
TABLE OF CONTENTS:
  1. Authentication using GitHub CLI
    - Command: gh auth login, gh api /octocat --method GET
    - GitHub Actions configuration with GH_TOKEN environment variable
  2. Authentication using Octokit.js
    - Installation: npm install octokit
    - SDK instantiation: new Octokit({ auth: 'YOUR-TOKEN' })
    - Request method: await octokit.request('GET /repos/{owner}/{repo}/issues', { owner: 'octocat', repo: 'Spoon-Knife' })
  3. Authentication using curl
    - curl command with headers: Accept: application/vnd.github+json, Authorization: Bearer YOUR-TOKEN
    - GitHub Actions curl usage
  4. API Versioning
    - Use header X-GitHub-Api-Version with value 2022-11-28
    - Guidelines for upgrading and handling breaking changes
  5. GitHub App Authentication
    - Configure APP_ID and private key (APP_PEM)
    - Generate token with actions/create-github-app-token@v1 and use in subsequent API calls

DETAILS:
1. GitHub CLI: Execute 'gh auth login' to authenticate; use 'gh api /endpoint --method METHOD' for API requests; in workflows, set GH_TOKEN using secrets.
2. Octokit.js: Import Octokit from 'octokit'; instantiate with auth token; uses async requests with proper parameter mapping.
3. Curl: Use curl commands with proper Authorization header; ensure token security and compliance with header formats.
4. API Versioning: Requests must include header X-GitHub-Api-Version to handle version compatibility; default is 2022-11-28; check error codes for unsupported versions.
5. GitHub App: Use GitHub App token generation steps, secure storage of keys, and generate tokens that expire after 60 minutes.

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_REST

# GitHub REST API Documentation

## Overview
The GitHub REST API enables integrations to create, retrieve, update, and delete resources on GitHub. The API is versioned using date-based versioning (e.g. 2022-11-28). Requests without a specified version default to 2022-11-28. Use the header X-GitHub-Api-Version to specify a different version and to ensure compatibility.

## Authentication Methods

### Using GitHub CLI
- Authenticate via: gh auth login
- Command for API request: 
  gh api /octocat --method GET

#### In GitHub Actions
Example YAML:
```
jobs:
  use_api:
    runs-on: ubuntu-latest
    permissions:
      issues: read
    steps:
      - env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh api https://api.github.com/repos/octocat/Spoon-Knife/issues
```

### Using Octokit.js
- Installation: npm install octokit
- Import and instantiate:
  const { Octokit } = require('octokit');
  const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
- Example request:
  await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });

#### In GitHub Actions
Example workflow steps:
```
steps:
  - name: Setup Node
    uses: actions/setup-node@v4
    with:
      node-version: '16.17.0'
  - name: Install dependencies
    run: npm install octokit
  - name: Run script
    run: node .github/actions-scripts/use-the-api.mjs
    env:
      TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Using curl
- Command example:
```
curl --request GET \
  --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
  --header "Accept: application/vnd.github+json" \
  --header "Authorization: Bearer YOUR-TOKEN"
```

#### Curl in GitHub Actions
Example YAML:
```
jobs:
  use_api:
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

## API Versioning and Configuration
- Header: X-GitHub-Api-Version: 2022-11-28
- Breaking changes include removal/renaming of operations, parameters, and response fields. 
- Upgrading requires reading breaking changes log, testing integration and updating header.

## GitHub App Authentication

### Using GitHub App in Actions
- Store APP_ID in configuration, secure PEM file contains private key.
- Generate token using action:
```
- name: Generate token
  id: generate-token
  uses: actions/create-github-app-token@v1
  with:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.APP_PEM }}
```

- Use token as GH_TOKEN for API requests.

## Endpoint Categories
- Issues, Pull Requests, Repositories, Deployments, Actions, Codespaces, Security, etc.
- Each endpoint accepts query parameters, path parameters, and returns structured JSON responses. 

## Troubleshooting and Best Practices
- Rate limits: Monitor responses headers and manage pagination.
- Secure tokens by storing them as secrets.
- Use the built-in GITHUB_TOKEN where possible to simplify token management.
- Test requests using CLI before implementation in production routines.

Retrieved: 2023-10-05
Data Size: 572382 bytes
Attribution: GitHub REST API official documentation

## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License: N/A
- Crawl Date: 2025-05-01T18:15:49.623Z
- Data Size: 572382 bytes
- Links Found: 9080

## Retrieved
2025-05-01
