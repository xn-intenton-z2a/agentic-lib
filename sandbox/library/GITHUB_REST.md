# GITHUB_REST

## Crawl Summary
Authentication via GitHub CLI (gh auth login) and environment variables, API version header X-GitHub-Api-Version:2022-11-28 for version control, detailed endpoint listings for issues, repositories, commits, pull requests, and more. Includes CLI, Octokit.js, and curl usage examples along with troubleshooting procedures and best practices such as token security and response pagination.

## Normalised Extract
Table of Contents:
1. Authentication Methods
   - GitHub CLI: gh auth login, use of HTTPS for credential storage.
   - Environment Variables: Set GH_TOKEN or use GITHUB_TOKEN.
   - GitHub App Authentication: Use app-id and private-key (APP_PEM) to generate tokens with actions/create-github-app-token@v1.
2. API Versioning
   - Header: X-GitHub-Api-Version:2022-11-28
   - Default version if header missing: 2022-11-28
3. Endpoint Usage
   - Example endpoint: GET /repos/{owner}/{repo}/issues with parameters owner and repo.
   - Pagination handling as provided in responses.
4. SDK Usage
   - Octokit.js: Instantiate with auth token, method signature: new Octokit({ auth: string }), and use octokit.request("GET /repos/{owner}/{repo}/issues", { owner: string, repo: string }).
5. Command Line Tools
   - Using curl: Detailed command with headers for Accept and Authorization.
   - CLI integration in Actions workflows with YAML examples.
6. Troubleshooting and Best Practices
   - Use proper authentication, verify API version headers, monitor rate limits, and log errors with status codes and message responses.

Detailed Topics:
Authentication Methods:
- GitHub CLI: Command 'gh auth login' and using 'gh api /octocat --method GET'.
- Environment variables: GH_TOKEN for secure token management in workflows.
- GitHub App: Configure app-id (vars.APP_ID) and private key (secrets.APP_PEM) to generate token.

API Versioning:
- Mandatory header: X-GitHub-Api-Version must be set to 2022-11-28 otherwise defaults apply.

Endpoint Usage:
- Standard endpoint: GET /repos/{owner}/{repo}/issues with required parameters: owner (string), repo (string).
- Full response handling includes status codes and array of issue objects.

SDK Usage with Octokit:
- Method signature: await octokit.request(methodString, parametersObject)
- Returns a Promise with response.data containing API data.

Command Line Tools:
- Curl command with accepting JSON, and Authorization using Bearer token.

Troubleshooting:
- For 400 errors, confirm API version header is set properly.
- Use logging of error.status and error.response.data.message in Octokit catch blocks.

## Supplementary Details
Authentication Details:
- GitHub CLI: Run 'gh auth login' and use 'gh api /endpoint --method HTTP_METHOD'
- Octokit.js: npm install octokit; Import using { Octokit } from 'octokit'; Instantiate with token: new Octokit({ auth: 'YOUR-TOKEN' })
- GitHub App: Workflow step using actions/create-github-app-token@v1 with inputs 'app-id' and 'private-key'.

API Versioning:
- Header: X-GitHub-Api-Version with value 2022-11-28.
- Default API version if header is omitted: 2022-11-28

Endpoint Specifications:
- Example: GET /repos/{owner}/{repo}/issues
   Parameters:
      owner: string (e.g., 'octocat')
      repo: string (e.g., 'Spoon-Knife')
   Return: Promise resolves to HTTP response with issues array.

CLI and Curl Implementations:
- GitHub CLI Example: gh api /octocat --method GET
- Curl Example: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer YOUR-TOKEN"

Troubleshooting Procedures:
- Verify token validity and scopes if a 401 Unauthorized error occurs.
- For 400 errors, check if the header X-GitHub-Api-Version is properly set.
- Use logging in Octokit catch block to output error.status and error.response.data.message.

Configuration Options:
- In GitHub Actions YAML, set environment variable GH_TOKEN using secrets.GITHUB_TOKEN.
- In Octokit instantiation, token is passed in auth property. Example: auth: process.env.TOKEN
- GitHub App configuration requires variables: APP_ID (app id), APP_PEM (private key, including header/footer lines).

## Reference Details
API Specifications and SDK Method Signatures:

1. GitHub CLI Method:
   Command: gh auth login
   Usage: gh api /[endpoint] --method [HTTP_METHOD]
   Example: gh api /octocat --method GET

2. Octokit.js API Call:
   Instantiation: const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
   Method Signature: octokit.request(method: string, parameters: { [key: string]: any }): Promise<{ data: any, status: number, headers: any }>
   Example Call:
     await octokit.request("GET /repos/{owner}/{repo}/issues", {
         owner: "octocat",
         repo: "Spoon-Knife"
     });

3. Curl Command Usage:
   curl --request GET \
     --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
     --header "Accept: application/vnd.github+json" \
     --header "Authorization: Bearer YOUR-TOKEN"

4. GitHub App Token Generation in YAML (GitHub Actions):
   Steps:
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

5. API Versioning Header:
   Header: X-GitHub-Api-Version:2022-11-28
   Use in requests with curl: curl --header "X-GitHub-Api-Version:2022-11-28" https://api.github.com/zen

Best Practices and Troubleshooting:
- Always keep API tokens secure; store them as secrets in workflows.
- Use built-in GITHUB_TOKEN where possible rather than extra tokens.
- Log errors in Octokit usage via catch block:
     catch (error) {
         console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`);
     }
- Check rate limits and pagination in API responses.
- For API version upgrade, read changelog; update header value and test integration.

Full SDK and API details are available from the GitHub REST API documentation at https://docs.github.com/en/rest

## Information Dense Extract
Authentication: gh auth login; set GH_TOKEN or GITHUB_TOKEN; GitHub App: app-id, APP_PEM with actions/create-github-app-token@v1. API Versioning: X-GitHub-Api-Version:2022-11-28, default if omitted. Endpoints: GET /repos/{owner}/{repo}/issues requires { owner: string, repo: string } returning Promise with issues array. Octokit: new Octokit({ auth: 'TOKEN' }), method: octokit.request("GET /repos/{owner}/{repo}/issues", { owner, repo }). Curl: curl --request GET --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" --header "Accept: application/vnd.github+json" --header "Authorization: Bearer TOKEN". YAML Action: steps for checkout, setup-node, generate token, run script using generated token. Troubleshooting: log error.status, error.response.data.message; verify API version header; monitor rate limits.

## Sanitised Extract
Table of Contents:
1. Authentication Methods
   - GitHub CLI: gh auth login, use of HTTPS for credential storage.
   - Environment Variables: Set GH_TOKEN or use GITHUB_TOKEN.
   - GitHub App Authentication: Use app-id and private-key (APP_PEM) to generate tokens with actions/create-github-app-token@v1.
2. API Versioning
   - Header: X-GitHub-Api-Version:2022-11-28
   - Default version if header missing: 2022-11-28
3. Endpoint Usage
   - Example endpoint: GET /repos/{owner}/{repo}/issues with parameters owner and repo.
   - Pagination handling as provided in responses.
4. SDK Usage
   - Octokit.js: Instantiate with auth token, method signature: new Octokit({ auth: string }), and use octokit.request('GET /repos/{owner}/{repo}/issues', { owner: string, repo: string }).
5. Command Line Tools
   - Using curl: Detailed command with headers for Accept and Authorization.
   - CLI integration in Actions workflows with YAML examples.
6. Troubleshooting and Best Practices
   - Use proper authentication, verify API version headers, monitor rate limits, and log errors with status codes and message responses.

Detailed Topics:
Authentication Methods:
- GitHub CLI: Command 'gh auth login' and using 'gh api /octocat --method GET'.
- Environment variables: GH_TOKEN for secure token management in workflows.
- GitHub App: Configure app-id (vars.APP_ID) and private key (secrets.APP_PEM) to generate token.

API Versioning:
- Mandatory header: X-GitHub-Api-Version must be set to 2022-11-28 otherwise defaults apply.

Endpoint Usage:
- Standard endpoint: GET /repos/{owner}/{repo}/issues with required parameters: owner (string), repo (string).
- Full response handling includes status codes and array of issue objects.

SDK Usage with Octokit:
- Method signature: await octokit.request(methodString, parametersObject)
- Returns a Promise with response.data containing API data.

Command Line Tools:
- Curl command with accepting JSON, and Authorization using Bearer token.

Troubleshooting:
- For 400 errors, confirm API version header is set properly.
- Use logging of error.status and error.response.data.message in Octokit catch blocks.

## Original Source
GitHub REST API Documentation
https://docs.github.com/en/rest

## Digest of GITHUB_REST

# GitHub REST API Documentation

Date Retrieved: 2023-10-19

## Overview
The GitHub REST API provides endpoints for creating integrations, retrieving data, and automating workflows. This documentation includes API versioning, authentication methods, detailed endpoint specifications, and best practices.

## Authentication and Authorization
- Use GitHub CLI: Run command 'gh auth login' to authenticate. GitHub CLI stores Git credentials when HTTPS is selected.
- Environment Variable Authentication: Set GH_TOKEN with a personal access token or use GITHUB_TOKEN in GitHub Actions.
- GitHub App Authentication: Generate an installation access token using the app ID and private key stored as a secret. Tokens expire after 60 minutes.

## API Versioning
- All API requests can include header: X-GitHub-Api-Version:2022-11-28
- Requests without the version header default to 2022-11-28
- Breaking changes include parameter or response field modifications; additive changes include new optional parameters.

## Command Line Usage Examples
### GitHub CLI Example
- Request Octocat information: 
  gh api /octocat --method GET

### GitHub Actions with CLI
- YAML workflow uses environment variable GH_TOKEN and runs 'gh api' command to list issues from a repository.

## Octokit.js Usage
- Install: npm install octokit
- Import and instantiate:
  const octokit = new Octokit({ auth: 'YOUR-TOKEN' });
- Make request:
  await octokit.request("GET /repos/{owner}/{repo}/issues", { owner: "octocat", repo: "Spoon-Knife" });
- In Actions, use GITHUB_TOKEN or generated token from GitHub App steps.

## Curl Commands
- Example using curl:
  curl --request GET \
       --url "https://api.github.com/repos/octocat/Spoon-Knife/issues" \
       --header "Accept: application/vnd.github+json" \
       --header "Authorization: Bearer YOUR-TOKEN"

## Detailed Endpoints and Features
- Endpoints for repositories, commits, pull requests, issues, rate limits, and more.
- Pagination: Use provided pagination details in responses.
- Error Handling: 400 errors for unsupported API versions, descriptive error messages for method failures.

## Configuration and Best Practices
- Always specify the X-GitHub-Api-Version header.
- Keep API tokens secure by storing them as secrets in GitHub Actions.
- Use Octokit.js for JavaScript integrations with full parameter support.
- For GitHub App, configure app-id and private key precisely.

## Troubleshooting
- For API rate limits, monitor headers in responses.
- If encountering 400 errors, verify the API version header.
- Use logs in GitHub Actions for step-by-step verification of token generation and API calls.

## Attribution and Data Size
- Data Size: 2268506 bytes
- Source URL: https://docs.github.com/en/rest
- Crawled Links: 16119

## Attribution
- Source: GitHub REST API Documentation
- URL: https://docs.github.com/en/rest
- License: License: Publicly available
- Crawl Date: 2025-05-02T20:01:14.952Z
- Data Size: 2268506 bytes
- Links Found: 16119

## Retrieved
2025-05-02
