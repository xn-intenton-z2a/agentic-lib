# GITHUB_REST

## Crawl Summary
The GitHub REST API documentation provides detailed technical instructions for interacting with GitHub via CLI, cURL, and Octokit.js. It covers authentication (using personal tokens and GitHub App tokens), usage in GitHub Actions workflows, command line examples with exact commands, detailed YAML workflow configurations, API versioning (via X-GitHub-Api-Version header), and handling breaking changes. Full code examples and step-by-step commands are provided for immediate developer integration.

## Normalised Extract
## Table of Contents
1. GitHub CLI Commands
   - Command: `gh auth login`
   - API call example: `gh api /octocat --method GET`
2. GitHub CLI in GitHub Actions
   - YAML workflow examples using `GH_TOKEN` for authentication and executing `gh api` commands.
3. Octokit.js Usage
   - Installation: `npm install octokit`
   - Import: `import { Octokit } from "octokit"`
   - Initialization: `const octokit = new Octokit({ auth: 'YOUR-TOKEN' });`
   - API request: `await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });`
4. cURL Command Examples
   - Basic GET request using headers for Accept and Authorization.
5. API Versioning
   - Use header: `X-GitHub-Api-Version:2022-11-28`
   - Breaking change guidelines and upgrade instructions.
6. Authentication Methods
   - Personal Access Tokens, GitHub App tokens, and secure storage as secrets.

Each section includes complete technical details that can be directly implemented without additional reference.

## Supplementary Details
### Detailed Technical Specifications

- **GitHub CLI Authentication & Request:**
  - Command: `gh auth login` for interactive login.
  - API request command: `gh api /octocat --method GET`.
  - Credentials stored automatically when using HTTPS.

- **GitHub Actions Workflow Configuration (CLI):**
  - YAML configuration includes `runs-on: ubuntu-latest`, permissions (e.g., `issues: read`), and environment variables set from secrets such as `GH_TOKEN`.
  - Example GitHub App token generation using action: `actions/create-github-app-token@v1` with inputs `app-id` and `private-key`.

- **Octokit.js Integration:**
  - Installation: `npm install octokit`
  - Initialize Octokit with token parameter: `new Octokit({ auth: 'YOUR-TOKEN' })`.
  - Method signature for API call: `octokit.request(method: string, parameters: object)` where method example is `"GET /repos/{owner}/{repo}/issues"` and parameters include `owner` and `repo` strings.
  - Full error handling pattern provided in the script sample.

- **cURL Requests:**
  - Use `--header "Accept: application/vnd.github+json"` to set media type.
  - Authentication header must include `Authorization: Bearer YOUR-TOKEN` (or token alternative).

- **API Versioning:**
  - Header `X-GitHub-Api-Version` must be supplied to enforce using a specific API version (e.g., 2022-11-28). Requests without this header default to the current stable version.
  - Upgrade process requires reading changelogs and updating integration code accordingly.

- **Token and Security Best Practices:**
  - Do not hard code tokens; use GitHub Secrets or environment variables.
  - Prefer built-in `GITHUB_TOKEN` in Actions rather than creating additional tokens.
  - Ensure access tokens have only necessary scopes.


## Reference Details
### Complete API Specifications and Examples

1. **GitHub CLI API Usage**
   - Authenticate with command: `gh auth login`
   - Make API request:
     ```shell
     gh api /octocat --method GET
     ```
   - Documentation Reference: GitHub CLI API docs.

2. **GitHub Actions Workflow (CLI and cURL)**
   - Example YAML (CLI):
     ```yaml
     on:
       workflow_dispatch:
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
   - Example YAML (cURL):
     ```yaml
     on:
       workflow_dispatch:
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

3. **Octokit.js Detailed Example**
   - Install Octokit:
     ```bash
     npm install octokit
     ```
   - JavaScript Usage:
     ```javascript
     import { Octokit } from "octokit";
     const octokit = new Octokit({
       auth: 'YOUR-TOKEN' // Replace YOUR-TOKEN with your personal or app token
     });

     async function fetchIssues() {
       try {
         const response = await octokit.request("GET /repos/{owner}/{repo}/issues", {
           owner: "octocat",
           repo: "Spoon-Knife"
         });
         console.log(response.data);
       } catch (error) {
         console.error(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
       }
     }
     fetchIssues();
     ```
   - Octokit method signature: 
     - Function: request(method: string, parameters: object) => Promise<Response>

4. **API Versioning and Breaking Changes**
   - Specify version header in requests:
     ```shell
     curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen
     ```
   - Breaking Changes Criteria:
     * Removal or renaming of endpoints or parameters
     * Addition of required parameters
     * Changes in response formats

5. **Troubleshooting Procedures**
   - Check authentication errors:
     * Command output: "Error! Status: 401"
     * Action: Verify token validity and proper scope
   - API version errors:
     * HTTP 400 response if using an unsupported version
     * Action: Update header or review changelog
   - Network issues:
     * Use `curl --verbose` to debug header and request flows.

6. **Configuration Options and Effects**
   - `GH_TOKEN` / `GITHUB_TOKEN`: Environment variables storing secure tokens.
   - `node-version` in GitHub Actions: Specifies Node.js version (e.g., '16.17.0').
   - `cache: npm` in setup-node action: Enables npm cache for faster dependency installation.

These detailed API specifications and implementation examples offer developers a complete and readily usable reference for immediate integration with the GitHub REST API.

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_REST

# GitHub REST API Documentation

**Retrieved on:** 2023-10-28

## Overview
The GitHub REST API documentation provides detailed instructions on authenticating, making requests, and integrating with GitHub services. The documentation covers multiple authentication methods including GitHub CLI, cURL, and Octokit.js usage. 

## Table of Contents
1. GitHub CLI Commands
2. GitHub CLI in GitHub Actions
3. Octokit.js Usage
4. cURL Command Examples
5. API Versioning and Breaking Changes
6. Authentication Methods and Token Management

## 1. GitHub CLI Commands

- **Authentication Command:**

  ```shell
  gh auth login
  ```

  Prompts:
  - Select GitHub.com or specific hostname (e.g., octocorp.ghe.com).
  - Choose HTTPS for storing credentials automatically.

- **API Request Example:**

  ```shell
  gh api /octocat --method GET
  ```

## 2. GitHub CLI in GitHub Actions

- **Workflow YAML Example:**

  ```yaml
  on:
    workflow_dispatch:
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

- **GitHub App Authentication:**

  ```yaml
  on:
    workflow_dispatch:
  jobs:
    track_pr:
      runs-on: ubuntu-latest
      steps:
        - name: Generate token
          id: generate-token
          uses: actions/create-github-app-token@v1
          with:
            app-id: ${{ vars.APP_ID }}
            private-key: ${{ secrets.APP_PEM }}
        - name: Use API
          env:
            GH_TOKEN: ${{ steps.generate-token.outputs.token }}
          run: |
            gh api https://api.github.com/repos/octocat/Spoon-Knife/issues
  ```

## 3. Octokit.js Usage

- **Installation and Import:**

  ```bash
  npm install octokit
  ```

  ```javascript
  import { Octokit } from "octokit";
  const octokit = new Octokit({ 
    auth: 'YOUR-TOKEN'
  });
  ```

- **API Request Example:**

  ```javascript
  await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife"
  });
  ```

- **Octokit in GitHub Actions Workflow:**

  ```yaml
  on:
    workflow_dispatch:
  jobs:
    use_api_via_script:
      runs-on: ubuntu-latest
      permissions:
        issues: read
      steps:
        - name: Check out repo content
          uses: actions/checkout@v4
        - name: Setup Node
          uses: actions/setup-node@v4
          with:
            node-version: '16.17.0'
            cache: npm
        - name: Install dependencies
          run: npm install octokit
        - name: Run script
          run: |
            node .github/actions-scripts/use-the-api.mjs
          env:
            TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```

- **Sample Script (.mjs):**

  ```javascript
  import { Octokit } from "octokit";

  const octokit = new Octokit({ 
    auth: process.env.TOKEN
  });

  try {
    const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "octocat",
      repo: "Spoon-Knife"
    });
    const titleAndAuthor = result.data.map(issue => ({
      title: issue.title, 
      authorID: issue.user.id
    }));
    console.log(titleAndAuthor);
  } catch (error) {
    console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
  }
  ```

## 4. cURL Command Examples

- **Basic cURL Request:**

  ```shell
  curl --request GET \
    --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
    --header "Accept: application/vnd.github+json" \
    --header "Authorization: Bearer YOUR-TOKEN"
  ```

- **cURL in GitHub Actions:** 

  ```yaml
  on:
    workflow_dispatch:
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

## 5. API Versioning and Breaking Changes

- **Specifying API Version:**

  Use the header `X-GitHub-Api-Version` to specify the version. Example:

  ```shell
  curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen
  ```

- **Version Details:**

  *Current Supported Version:* 2022-11-28

  *Breaking changes* include:
  - Removal or renaming of operations/parameters/response fields
  - Addition of required parameters
  - Type changes in parameters/fields

## 6. Authentication Methods and Token Management

- **Personal Access Tokens & GitHub App Tokens:**

  Tokens should be stored as secrets. Use `GH_TOKEN` environment variable or GitHub App token generation via workflow step:

  ```yaml
  - name: Generate token
    id: generate-token
    uses: actions/create-github-app-token@v1
    with:
      app-id: ${{ vars.APP_ID }}
      private-key: ${{ secrets.APP_PEM }}
  ```

- **Best Practices:**

  * Do not hardcode tokens in your scripts
  * Use built-in `GITHUB_TOKEN` when possible
  * Securely store tokens using GitHub Secrets or Codespaces secrets


## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License: GitHub Docs Terms
- Crawl Date: 2025-04-18T23:10:40.196Z
- Data Size: 2777338 bytes
- Links Found: 17626

## Retrieved
2025-04-18
